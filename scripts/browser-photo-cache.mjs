import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const TRACKER = path.join(ROOT, 'research/PRP_TRACKER.csv');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 60));
const CONCURRENCY = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_CONCURRENCY || 6));
const PRIORITY_COMPANY = String(process.env.PHOTO_BROWSER_CACHE_PRIORITY_COMPANY || '').trim().toLowerCase();
const IMAGE_SEARCH_ENABLED = String(process.env.PHOTO_BROWSER_IMAGE_SEARCH || 'true').toLowerCase() !== 'false';
const PAGE_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_PAGE_TIMEOUT_MS || 8000));
const SEARCH_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_SEARCH_TIMEOUT_MS || 8000));
const IMAGE_TIMEOUT = Math.max(2500, Number(process.env.PHOTO_BROWSER_IMAGE_TIMEOUT_MS || 6000));
const CANDIDATE_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CANDIDATE_LIMIT || 6));
const SEARCH_VERIFY_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_SEARCH_VERIFY_LIMIT || 5));
const TARGET_BUILDER = String(process.env.PHOTO_BROWSER_TARGET_BUILDER || '').trim();
const TARGET_PEDAL = String(process.env.PHOTO_BROWSER_TARGET_PEDAL || '').trim();

function key(builder, pedal) {
  return builder + '\\0' + pedal;
}

function csvRows(raw) {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    const fields = [];
    let value = '', quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (quoted) {
        if (ch === '"' && next === '"') { value += '"'; i++; }
        else if (ch === '"') quoted = false;
        else value += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { fields.push(value); value = ''; }
      else value += ch;
    }
    fields.push(value);
    return Object.fromEntries(header.map((h, i) => [h, (fields[i] || '').trim()]));
  });
}

function slug(value) {
  const raw = String(value || '').trim().toLowerCase();
  const normalized = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
  if (normalized.length <= 90) return normalized;
  const digest = crypto.createHash('sha1').update(raw).digest('hex').slice(0, 10);
  return normalized.slice(0, 79).replace(/-+$/g, '') + '-' + digest;
}

function target(entry) {
  return path.join(ROOT, 'assets/pedals', slug(entry.company), slug(entry.pedal), 'primary.webp');
}

function identityTokens(pedal) {
  const ignored = new Set(['the', 'and', 'with', 'distortion', 'overdrive', 'fuzz', 'crunch', 'drive', 'double', 'pro']);
  return String(pedal || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => token.length >= 4 && !ignored.has(token));
}

function pageMatchesIdentity(entry, title, h1) {
  const haystack = (title + ' ' + h1).toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const tokens = identityTokens(entry.pedal);
  return tokens.length ? tokens.every(token => haystack.includes(token)) : haystack.includes(slug(entry.pedal));
}

async function extractDirectImage(page, url) {
  try {
    const response = await page.request.get(url, { timeout: SEARCH_TIMEOUT });
    const type = (response.headers()['content-type'] || '').toLowerCase();
    if (!response.ok() || !type.startsWith('image/')) return null;
    const bytes = await response.body();
    if (bytes.length < 3000) return null;
    return { url, bytes };
  } catch {
    return null;
  }
}

function imageSearchScore(entry, result) {
  const haystack = [result.title || '', result.purl || '', result.murl || '']
    .join(' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const pedalHits = pedalTokens.filter(token => haystack.includes(token));
  const builderHits = builderTokens.filter(token => haystack.includes(token));
  let score = pedalHits.length * 15 + builderHits.length * 5;
  const exactPedal = String(entry.pedal || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (exactPedal && haystack.includes(exactPedal)) score += 60;
  return { score, pedalHits: pedalHits.length, builderHits: builderHits.length };
}

function pedalTokensForSearch(entry) {
  return identityTokens(entry.pedal);
}

async function imageSearchCandidates(page, entry) {
  if (!IMAGE_SEARCH_ENABLED) return [];
  const query = `${entry.company} ${entry.pedal} guitar pedal`;
  const searchUrl = 'https://www.bing.com/images/search?form=HDRSC2&q=' + encodeURIComponent(query);
  try {
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
    await page.waitForTimeout(200);
    return await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a.iusc')) {
        const raw = el.getAttribute('m');
        if (!raw) continue;
        try {
          const m = JSON.parse(raw);
          if (m.murl) out.push({ murl: m.murl, purl: m.purl || '', title: m.t || '' });
        } catch {}
      }
      return out;
    });
  } catch {
    return [];
  }
}

async function recoverEntry(browser, entry) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    const candidates = [];
    const pageUrl = entry.image_source_page || entry.source_page || null;

    if (entry.image_source_url && /^https?:/i.test(entry.image_source_url)) {
      candidates.push({
        url: entry.image_source_url,
        sourcePage: entry.image_source_page || entry.source_page || null,
        sourceScore: 80
      });
    }

    let sourcePageUsed = null;
    if (pageUrl && /^https?:/i.test(pageUrl)) {
      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
        const title = await page.title().catch(() => '');
        const h1 = await page.locator('h1').first().textContent().catch(() => '');
        const body = await page.locator('body').textContent().catch(() => '');

        if (pageMatchesIdentity(entry, title + ' ' + body, h1)) {
          sourcePageUsed = pageUrl;

          for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
            const value = await page.locator(selector).getAttribute('content').catch(() => null);
            if (value) {
              candidates.push({
                url: new URL(value, sourcePageUsed).href,
                sourcePage: sourcePageUsed,
                sourceScore: 120
              });
            }
          }

          if (!candidates.some(x => x.sourcePage === sourcePageUsed && x.sourceScore >= 120)) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(250);
          }

          const imageData = await page.evaluate(() => {
            const urls = [];
            for (const el of document.querySelectorAll('img, source')) {
              urls.push(
                el.currentSrc || '',
                el.src || '',
                el.getAttribute('data-src') || '',
                el.getAttribute('data-lazy-src') || '',
                el.getAttribute('data-original') || '',
                el.getAttribute('srcset') || ''
              );
            }
            for (const el of document.querySelectorAll('[style*="background"]')) {
              const css = getComputedStyle(el).backgroundImage || '';
              const match = css.match(/url\(["']?([^"')]+)["']?\)/i);
              if (match) urls.push(match[1]);
            }
            return urls.filter(Boolean);
          });

          for (const raw of imageData) {
            for (const part of raw.split(/\s+/)) {
              if (/^https?:/i.test(part)) {
                candidates.push({ url: part, sourcePage: sourcePageUsed, sourceScore: 90 });
              } else if (part && !part.includes('x') && !part.startsWith('data:')) {
                try {
                  candidates.push({
                    url: new URL(part, sourcePageUsed).href,
                    sourcePage: sourcePageUsed,
                    sourceScore: 90
                  });
                } catch {}
              }
            }
          }
        }
      } catch {}
    }

    const tokens = identityTokens(entry.pedal);
    const ranked = [...new Map(candidates.map(x => [x.url, x])).values()].sort((a, b) => {
      const score = candidate => {
        const normalized = candidate.url.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
        return candidate.sourceScore
          + tokens.reduce((sum, token) => sum + (normalized.includes(token) ? 10 : 0), 0)
          + (normalized.includes('logo') ? -20 : 0)
          + (normalized.includes('icon') ? -20 : 0)
          + (normalized.includes('thumb') ? 1 : 0);
      };
      return score(b) - score(a);
    });

    async function tryImages(list) {
      for (const candidate of list.slice(0, CANDIDATE_LIMIT)) {
        try {
          const response = await page.request.get(candidate.url, { timeout: IMAGE_TIMEOUT });
          const type = (response.headers()['content-type'] || '').toLowerCase();
          if (!response.ok() || !type.startsWith('image/')) continue;
          const bytes = await response.body();
          if (bytes.length < 3000) continue;
          return { candidate, bytes };
        } catch {}
      }
      return null;
    }

    // First trust only candidates discovered on the already-verified source page.
    let selectedResult = await tryImages(
      ranked.filter(candidate => !candidate.searchResult)
    );

    // Search is a fallback, not the primary source. Verify the result page identity
    // before accepting its image so a visually similar pedal cannot slip through.
    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const searchResults = await imageSearchCandidates(page, entry);
      const verifiedSearch = [];
      for (const result of searchResults.slice(0, SEARCH_VERIFY_LIMIT)) {
        const fit = imageSearchScore(entry, result);
        const requiredHits = pedalTokensForSearch(entry).length >= 2 ? 2 : 1;
        if (fit.score < 45 || fit.pedalHits < requiredHits || !result.purl || !result.murl) continue;
        try {
          await page.goto(result.purl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
          const title = await page.title().catch(() => '');
          const h1 = await page.locator('h1').first().textContent().catch(() => '');
          const body = await page.locator('body').textContent().catch(() => '');
          if (!pageMatchesIdentity(entry, title + ' ' + body, h1)) continue;
          verifiedSearch.push({
            url: result.murl,
            sourcePage: result.purl,
            sourceScore: 45 + Math.min(70, fit.score),
            searchResult: true
          });
        } catch {}
      }
      selectedResult = await tryImages(
        verifiedSearch.sort((a, b) => b.sourceScore - a.sourceScore)
      );
    }

    if (!selectedResult) throw new Error('no usable exact-model image candidate found');

    const selected = selectedResult.candidate;
    const selectedBytes = selectedResult.bytes;

    const out = target(entry);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out.replace(/\.webp$/i, '.source'), selectedBytes);
    entry.image_source_url = selected.url;
    if (selected.sourcePage) entry.image_source_page = selected.sourcePage;
    return { ok: true, imageUrl: selected.url, sourcePage: selected.sourcePage || null };
  } finally {
    await page.close().catch(() => {});
  }
}
(async () => {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const trackerRows = fs.existsSync(TRACKER)
    ? csvRows(fs.readFileSync(TRACKER, 'utf8'))
    : [];
  const trackerOrder = new Map(
    trackerRows.map((row, index) => [key(row.Builder, row.Pedal), index])
  );
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));
  const candidates = (catalog.pedals || [])
    .filter(x => {
      if (TARGET_BUILDER && String(x.company || '').trim() !== TARGET_BUILDER) return false;
      if (TARGET_PEDAL && String(x.pedal || '').trim() !== TARGET_PEDAL) return false;
      return x.research_record && !x.image && (x.image_source_page || x.source_page || x.image_source_url);
    })
    .sort((a, b) => {
      const score = entry => {
        const order = trackerOrder.get(key(entry.company, entry.pedal));
        let value = Number.isFinite(order) ? -order : -100000000;
        if (entry.image_source_url && /^https?:/i.test(entry.image_source_url)) value += 100;
        if (PRIORITY_COMPANY && String(entry.company || '').trim().toLowerCase() === PRIORITY_COMPANY) value += 100000;
        return value;
      };
      return score(b) - score(a);
    })
    .slice(0, LIMIT);

  const browser = await chromium.launch({ headless: true });
  let recovered = 0;
  let attempted = 0;
  const failures = [];

  for (let cursor = 0; cursor < candidates.length; cursor += CONCURRENCY) {
    const batch = candidates.slice(cursor, cursor + CONCURRENCY);
    attempted += batch.length;
    const results = await Promise.all(batch.map(async entry => {
      try {
        const result = await recoverEntry(browser, entry);
        return { entry, result };
      } catch (err) {
        return { entry, error: err };
      }
    }));

    for (const result of results) {
      const entry = result.entry;
      const m = manifestByKey.get(key(entry.company, entry.pedal));
      if (result.error) {
        failures.push(entry.company + ' - ' + entry.pedal + ': ' + result.error.message);
        continue;
      }
      recovered++;
      if (m) {
        m.image_source_url = result.result.imageUrl;
        if (result.result.sourcePage) m.image_source_page = result.result.sourcePage;
      }
    }
  }

  fs.writeFileSync(INDEX, JSON.stringify(catalog, null, 2) + '\n');
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  await browser.close();

  console.log('Browser photo recovery: recovered ' + recovered + '; attempted ' + attempted + '; failures ' + failures.length + '.');
  for (const failure of failures) console.log(' - ' + failure);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
