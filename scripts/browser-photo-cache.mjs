import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 60));
const CONCURRENCY = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_CONCURRENCY || 6));
const PRIORITY_COMPANY = String(process.env.PHOTO_BROWSER_CACHE_PRIORITY_COMPANY || '').trim().toLowerCase();
const IMAGE_SEARCH_ENABLED = String(process.env.PHOTO_BROWSER_IMAGE_SEARCH || 'true').toLowerCase() !== 'false';

function key(builder, pedal) {
  return builder + '\\0' + pedal;
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
    const response = await page.request.get(url, { timeout: 12000 });
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

async function imageSearchCandidates(page, entry) {
  if (!IMAGE_SEARCH_ENABLED) return [];
  const query = `${entry.company} ${entry.pedal} guitar pedal`;
  const searchUrl = 'https://www.bing.com/images/search?form=HDRSC2&q=' + encodeURIComponent(query);
  try {
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await page.waitForTimeout(500);
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
    const pageUrl = entry.image_source_page || entry.source_page || null;
    const candidates = [];
    let sourcePageUsed = null;

    if (pageUrl && /^https?:/i.test(pageUrl)) {
      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
        sourcePageUsed = pageUrl;
      } catch {}
    }

    if (sourcePageUsed) {
      const title = await page.title().catch(() => '');
      const h1 = await page.locator('h1').first().textContent().catch(() => '');
      const body = await page.locator('body').textContent().catch(() => '');
      if (!pageMatchesIdentity(entry, title + ' ' + body, h1)) {
        sourcePageUsed = null;
      }
    }

    if (sourcePageUsed) {

    const title = await page.title().catch(() => '');
    const h1 = await page.locator('h1').first().textContent().catch(() => '');
    const body = await page.locator('body').textContent().catch(() => '');
    if (!pageMatchesIdentity(entry, title + ' ' + body, h1)) {
      throw new Error('page identity did not match page text');
    }

    const metaSelectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]'
    ];
    for (const selector of metaSelectors) {
      const value = await page.locator(selector).getAttribute('content').catch(() => null);
      if (value && sourcePageUsed) candidates.push(new URL(value, sourcePageUsed).href);
    }

    // Shopify and similar product pages usually expose the exact product image
    // in og:image. Only pay the lazy-gallery cost when no canonical meta image
    // is available.
    if (sourcePageUsed && !candidates.length) {
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      await page.evaluate(() => window.scrollTo(0, 0));
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
        if (/^https?:/i.test(part)) candidates.push(part);
        else if (part && !part.includes('x') && !part.startsWith('data:')) {
          try { if (sourcePageUsed) candidates.push(new URL(part, sourcePageUsed).href); } catch {}
        }
      }
    }

    if (IMAGE_SEARCH_ENABLED && (!sourcePageUsed || !candidates.length)) {
      const searchResults = await imageSearchCandidates(page, entry);
      for (const result of searchResults) {
        const fit = imageSearchScore(entry, result);
        if (fit.score < 30 || fit.pedalHits < 1) continue;
        candidates.push(result.murl);
      }
      if (!sourcePageUsed && searchResults.length) sourcePageUsed = searchResults[0].purl || null;
    }

    const tokens = identityTokens(entry.pedal);
    const ranked = [...new Set(candidates)].sort((a, b) => {
      const score = url => {
        const normalized = url.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
        return tokens.reduce((sum, token) => sum + (normalized.includes(token) ? 10 : 0), 0)
          + (normalized.includes('logo') ? -20 : 0)
          + (normalized.includes('icon') ? -20 : 0)
          + (normalized.includes('thumb') ? 1 : 0);
      };
      return score(b) - score(a);
    });
    if (!ranked.length) throw new Error('no candidate images found');

    let selected = null;
    let selectedBytes = null;
    for (const candidate of ranked.slice(0, 6)) {
      try {
        const response = await page.request.get(candidate, { timeout: 10000 });
        const type = (response.headers()['content-type'] || '').toLowerCase();
        if (!response.ok() || !type.startsWith('image/')) continue;
        const bytes = await response.body();
        if (bytes.length < 3000) continue;
        selected = candidate;
        selectedBytes = bytes;
        break;
      } catch {}
    }
    if (!selected) throw new Error('no usable image candidate found');

    const out = target(entry);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out.replace(/\.webp$/i, '.source'), selectedBytes);
    entry.image_source_url = selected;
    if (sourcePageUsed) entry.image_source_page = sourcePageUsed;
    return { ok: true, imageUrl: selected, sourcePage: sourcePageUsed };
  } finally {
    await page.close().catch(() => {});
  }
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));
  const candidates = (catalog.pedals || [])
    .filter(x => !x.image && (x.image_source_page || x.source_page || x.image_source_url))
    .sort((a, b) => {
      const score = entry => {
        let value = 0;
        if (entry.research_record) value += 1000;
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
