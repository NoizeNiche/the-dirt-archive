import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const TRACKER = path.join(ROOT, 'research/PRP_TRACKER.csv');
const PHOTO_REVIEW_QUEUE = path.join(ROOT, 'research/PHOTO_REVIEW_QUEUE.csv');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 60));
const CONCURRENCY = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_CONCURRENCY || 6));
const PRIORITY_COMPANY = String(process.env.PHOTO_BROWSER_CACHE_PRIORITY_COMPANY || '').trim().toLowerCase();
const IMAGE_SEARCH_ENABLED = String(process.env.PHOTO_BROWSER_IMAGE_SEARCH || 'true').toLowerCase() !== 'false';
const PAGE_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_PAGE_TIMEOUT_MS || 8000));
const SEARCH_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_SEARCH_TIMEOUT_MS || 8000));
const IMAGE_TIMEOUT = Math.max(2500, Number(process.env.PHOTO_BROWSER_IMAGE_TIMEOUT_MS || 6000));
const CANDIDATE_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CANDIDATE_LIMIT || 8));
const SEARCH_VERIFY_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_SEARCH_VERIFY_LIMIT || 8));
const TARGET_BUILDER = String(process.env.PHOTO_BROWSER_TARGET_BUILDER || '').trim();
const TARGET_PEDAL = String(process.env.PHOTO_BROWSER_TARGET_PEDAL || '').trim();
const PER_BUILDER_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_PER_BUILDER_LIMIT || 4));
const RECOVERY_DEADLINE_MS = Math.max(10000, Number(process.env.PHOTO_BROWSER_RECOVERY_DEADLINE_MS || 25000));

function key(builder, pedal) {
  return builder + '\\0' + pedal;
}

function reviewQueueRows(raw) {
  if (!raw) return [];
  return csvRows(raw);
}

function reviewQueueKey(row) {
  return key(row.Builder, row.Pedal);
}

function writeReviewQueue(rows) {
  const header = ['Builder', 'Pedal', 'Catalog Type', 'Status', 'Attempts', 'Last Failure'];
  const escape = value => {
    const s = String(value ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const out = [header.join(',')];
  for (const row of rows) {
    out.push(header.map(field => escape(row[field] || '')).join(','));
  }
  fs.writeFileSync(PHOTO_REVIEW_QUEUE, out.join('\n') + '\n');
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
  const builder = entry.company || entry.builder;
  if (entry.catalog_role === 'variation' && entry.parent_pedal) {
    const variant = entry.variation_name || entry.pedal;
    return path.join(
      ROOT,
      'assets/pedals',
      slug(builder),
      slug(entry.parent_pedal),
      'variants',
      slug(variant) + '.webp'
    );
  }
  return path.join(ROOT, 'assets/pedals', slug(builder), slug(entry.pedal), 'primary.webp');
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function identityTokens(pedal) {
  const ignored = new Set(['the', 'and', 'with', 'distortion', 'overdrive', 'fuzz', 'crunch', 'drive', 'double', 'pro']);
  return normalizedIdentity(pedal)
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => (token.length >= 4 || /\d/.test(token)) && !ignored.has(token));
}

function identityPhrases(pedal) {
  const raw = String(pedal || '').trim();
  const variants = new Set([
    raw,
    raw.split('(')[0].trim(),
    raw.split(' - ')[0].trim()
  ]);
  return [...variants]
    .map(normalizedIdentity)
    .filter(value => value.length >= 5 && value.split(/\s+/).length >= 2);
}

function pageMatchesIdentity(entry, title, h1) {
  const haystack = normalizedIdentity(title + ' ' + h1);
  const pedalPhrases = identityPhrases(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const builderMatch = !builderTokens.length || builderTokens.some(token => haystack.includes(token));

  // Fast exact-phrase path for model names containing short tokens/codes
  // such as OD-12, CP-25, A1, or X-Drive. Require builder context as well.
  for (const phrase of pedalPhrases) {
    if (haystack.includes(phrase) && builderMatch) return true;
  }

  const tokens = identityTokens(entry.pedal);
  return tokens.length ? tokens.every(token => haystack.includes(token)) : haystack.includes(normalizedIdentity(entry.pedal));
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

async function fetchSearchPageIdentity(page, url) {
  try {
    const response = await page.request.get(url, { timeout: PAGE_TIMEOUT });
    if (!response.ok()) return null;
    const html = await response.text();
    if (!html) return null;
    const compact = html.slice(0, 300000);
    const titleMatch = compact.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const h1Match = compact.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const strip = value => String(value || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      title: strip(titleMatch?.[1]),
      h1: strip(h1Match?.[1]),
      body: strip(compact)
    };
  } catch {
    return null;
  }
}

async function imageSearchCandidates(page, entry, deepReview = false) {
  if (!IMAGE_SEARCH_ENABLED) return [];
  const queries = deepReview
    ? [
        '"' + entry.company + '" "' + entry.pedal + '" guitar pedal',
        '"' + entry.pedal + '" "' + entry.company + '" pedal',
        '"' + entry.pedal + '" "' + entry.company + '"',
        '"' + entry.pedal + '" "' + entry.company + '" reverb',
        entry.pedal + " " + entry.company + " pedal",
        entry.pedal + " pedal photo",
        entry.company + " " + entry.pedal
      ]
    : [entry.company + " " + entry.pedal + " guitar pedal"];

  const merged = new Map();
  for (const query of queries) {
    const searchUrl = 'https://www.bing.com/images/search?form=HDRSC2&q=' + encodeURIComponent(query);
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
      await page.waitForTimeout(200);
      const results = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a.iusc')) {
          const raw = el.getAttribute('m');
          if (!raw) continue;
          try {
            const m = JSON.parse(raw);
            if (m.murl) out.push({ murl: m.murl, purl: m.purl || '', title: m.t || '', searchUrl: location.href });
          } catch {}
        }
        return out;
      });
      for (const result of results) {
        if (!merged.has(result.murl)) merged.set(result.murl, result);
      }
    } catch {}
  }
  return [...merged.values()];
}

async function recoverEntry(browser, entry, deepReview = false) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const networkImageUrls = [];
  const onResponse = response => {
    try {
      const type = (response.headers()['content-type'] || '').toLowerCase();
      if (type.startsWith('image/')) networkImageUrls.push(response.url());
    } catch {}
  };
  page.on('response', onResponse);
  const deadline = setTimeout(() => {
    // A single stubborn source must not occupy a browser worker indefinitely.
    page.close().catch(() => {});
  }, RECOVERY_DEADLINE_MS);
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

          // Effects Database renders its auction/search image after the initial
          // document response. Give that verified page a little more time and
          // capture any image requests it makes. This is still identity-gated by
          // the page title/body above, so the extra wait cannot admit a lookalike.
          if (/([.]|^)effectsdatabase[.]com$/i.test(new URL(sourcePageUsed).hostname)) {
            await page.waitForTimeout(1400);
          }

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

          // Some archived/product pages load their only useful photo through
          // an image request rather than an <img> node. Capture those requests
          // from the verified page and let the normal URL ranking/filtering pick
          // a plausible exact-model asset. Logos/icons remain penalized below.
          for (const url of [...new Set(networkImageUrls)]) {
            if (/\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url)) {
              candidates.push({ url, sourcePage: sourcePageUsed, sourceScore: 110 });
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
    async function screenshotVerifiedSearchImage(candidate) {
      if (!candidate?.searchResult || !candidate.searchUrl || !candidate.murl) return null;
      try {
        await page.goto(candidate.searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
        await page.waitForTimeout(500);
        const cards = page.locator('a.iusc');
        const count = await cards.count();
        for (let i = 0; i < Math.min(count, 12); i++) {
          const card = cards.nth(i);
          const raw = await card.getAttribute('m').catch(() => null);
          if (!raw) continue;
          let meta = null;
          try { meta = JSON.parse(raw); } catch {}
          if (!meta || meta.murl !== candidate.murl) continue;
          await card.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(250);
          const img = card.locator('img').first();
          if (await img.count()) {
            const bytes = await img.screenshot({ type: 'png' });
            if (bytes.length >= 3000) return bytes;
          }
        }
      } catch {}
      return null;
    }

    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const searchResults = await imageSearchCandidates(page, entry, deepReview);
      const verifiedSearch = [];
      const rankedSearchResults = searchResults
        .map(result => ({ result, fit: imageSearchScore(entry, result) }))
        .sort((a, b) => b.fit.score - a.fit.score);
      for (const ranked of rankedSearchResults.slice(0, SEARCH_VERIFY_LIMIT)) {
        const result = ranked.result;
        const fit = ranked.fit;
        const requiredHits = pedalTokensForSearch(entry).length >= 2 ? 2 : 1;
        if (fit.score < 45 || fit.pedalHits < requiredHits || !result.purl || !result.murl) continue;
        try {
          // Some specialist pedal databases expose their exact product image to
          // search engines but hide the image behind an AJAX feed endpoint that
          // returns no usable HTML to a headless fetch. For a trusted database,
          // an exact model-title match is sufficient source-page identity.
          const resultUrl = new URL(result.purl);
          const searchIdentity = normalizedIdentity((result.title || '') + ' ' + result.purl);
          const pedalTokens = identityTokens(entry.pedal);
          const builderTokens = identityTokens(entry.company);
          const trustedDatabase =
            /(^|\\.)effectsdatabase\\.com$/i.test(resultUrl.hostname) &&
            fit.pedalHits >= requiredHits &&
            pedalTokens.every(token => searchIdentity.includes(token));

          const trustedMarketplace =
            /(^|\\.)(reverb\\.com|ebay\\.com)$/i.test(resultUrl.hostname) &&
            pedalTokens.length > 0 &&
            pedalTokens.every(token => searchIdentity.includes(token)) &&
            builderTokens.length > 0 &&
            builderTokens.every(token => searchIdentity.includes(token));

          if (trustedDatabase || trustedMarketplace) {
            verifiedSearch.push({
              url: result.murl,
              sourcePage: result.purl,
              sourceScore: (trustedDatabase ? 125 : 105) + Math.min(70, fit.score),
              searchResult: true,
              searchUrl: result.searchUrl
            });
            continue;
          }

          // Verify other search-result pages with a lightweight HTTP fetch first.
          // This avoids opening a full Chromium page for every candidate and
          // keeps the recovery pass moving without lowering the identity gate.
          let identity = await fetchSearchPageIdentity(page, result.purl);
          if (!identity) {
            await page.goto(result.purl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
            identity = {
              title: await page.title().catch(() => ''),
              h1: await page.locator('h1').first().textContent().catch(() => ''),
              body: await page.locator('body').textContent().catch(() => '')
            };
          }
          if (!pageMatchesIdentity(entry, identity.title + ' ' + identity.body, identity.h1)) continue;
          verifiedSearch.push({
            url: result.murl,
            sourcePage: result.purl,
            sourceScore: 45 + Math.min(70, fit.score),
            searchResult: true,
            searchUrl: result.searchUrl
          });
        } catch {}
      }
      const rankedVerifiedSearch = verifiedSearch.sort((a, b) => b.sourceScore - a.sourceScore);
      selectedResult = await tryImages(rankedVerifiedSearch);

      // Last-resort exact visual capture: the source image URL may be blocked
      // even though the search engine has an exact-model thumbnail. Capture the
      // matching verified thumbnail instead of substituting another pedal.
      if (!selectedResult) {
        for (const candidate of rankedVerifiedSearch.slice(0, 3)) {
          const bytes = await screenshotVerifiedSearchImage(candidate);
          if (bytes) {
            selectedResult = { candidate, bytes };
            break;
          }
        }
      }
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
    clearTimeout(deadline);
    await page.close().catch(() => {});
  }
}
(async () => {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const trackerRows = fs.existsSync(TRACKER)
    ? csvRows(fs.readFileSync(TRACKER, 'utf8'))
    : [];
  const trackerMeta = new Map(
    trackerRows.map((row, index) => [
      key(row.Builder, row.Pedal),
      { order: index, pictureDone: row.Picture === 'DONE' }
    ])
  );
  const reviewRows = fs.existsSync(PHOTO_REVIEW_QUEUE)
    ? reviewQueueRows(fs.readFileSync(PHOTO_REVIEW_QUEUE, 'utf8'))
    : [];
  const reviewByKey = new Map(reviewRows.map(row => [reviewQueueKey(row), row]));
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));
  const orderedCandidates = (catalog.pedals || [])
    .filter(x => {
      if (TARGET_BUILDER && String(x.company || '').trim() !== TARGET_BUILDER) return false;
      if (TARGET_PEDAL && String(x.pedal || '').trim() !== TARGET_PEDAL) return false;
      if (!x.research_record) return false;
      // Bulk recovery is exclusively for records whose tracker photo field is
      // still unresolved. Cleanup of already-complete records is handled only
      // through an explicit targeted run, so the backlog cannot be starved.
      const tracker = trackerMeta.get(key(x.company, x.pedal));
      if (!TARGET_BUILDER && !TARGET_PEDAL && tracker?.pictureDone) return false;
      const review = reviewByKey.get(key(x.company, x.pedal));
      // A normal backlog pass gets one clean attempt per unresolved record.
      // Failed records are parked for a deeper review pass instead of being
      // hammered again on every cache run.
      if (!TARGET_BUILDER && !TARGET_PEDAL && review?.Status === 'DEEP_REVIEW' && String(process.env.PHOTO_BROWSER_DEEP_REVIEW || 'true').toLowerCase() === 'false') return false;
      const canonical = target(x);
      // Bulk catch-up is driven by the canonical local archive state, not by
      // whether an old/external image URL happens to be present in the catalog.
      // This lets browser recovery revisit researched pedals whose external
      // image host has gone stale or started returning 4xx/5xx errors.
      return !fs.existsSync(canonical);
    })
    .sort((a, b) => {
      const score = entry => {
        const meta = trackerMeta.get(key(entry.company, entry.pedal));
        const review = reviewByKey.get(key(entry.company, entry.pedal));
        const order = meta?.order;
        let value = Number.isFinite(order) ? -order : -100000000;
        if (entry.image_source_url && /^https?:/i.test(entry.image_source_url)) value += 100;
        if (review?.Status === 'DEEP_REVIEW') value -= 40;
        if (PRIORITY_COMPANY && String(entry.company || '').trim().toLowerCase() === PRIORITY_COMPANY) value += 100000;
        return value;
      };
      return score(b) - score(a);
    });

  // In bulk mode, spread each pass across builders so a single run cannot
  // burn all of its recovery attempts on one builder's hard-to-source photos.
  let candidates = orderedCandidates;
  if (!TARGET_BUILDER && !TARGET_PEDAL) {
    const selected = [];
    const deferred = [];
    const perBuilder = new Map();
    for (const entry of orderedCandidates) {
      const builder = String(entry.company || entry.builder || 'Unknown').trim();
      const used = perBuilder.get(builder) || 0;
      if (used < PER_BUILDER_LIMIT && selected.length < LIMIT) {
        selected.push(entry);
        perBuilder.set(builder, used + 1);
      } else {
        deferred.push(entry);
      }
    }
    for (const entry of deferred) {
      if (selected.length >= LIMIT) break;
      selected.push(entry);
    }
    candidates = selected;
  } else {
    candidates = orderedCandidates.slice(0, LIMIT);
  }

  const browser = await chromium.launch({ headless: true });
  let recovered = 0;
  let attempted = 0;
  const failures = [];

  for (let cursor = 0; cursor < candidates.length; cursor += CONCURRENCY) {
    const batch = candidates.slice(cursor, cursor + CONCURRENCY);
    attempted += batch.length;
    const results = await Promise.all(batch.map(async entry => {
      try {
        const review = reviewByKey.get(key(entry.company, entry.pedal));
        const result = await recoverEntry(browser, entry, review?.Status === 'DEEP_REVIEW');
        return { entry, result };
      } catch (err) {
        return { entry, error: err };
      }
    }));

    for (const result of results) {
      const entry = result.entry;
      const entryKey = key(entry.company, entry.pedal);
      const m = manifestByKey.get(entryKey);
      const existingReview = reviewByKey.get(entryKey);
      if (result.error) {
        const failure = result.error.message;
        failures.push(entry.company + ' - ' + entry.pedal + ': ' + failure);
        const row = existingReview || {
          Builder: entry.company || entry.builder || '',
          Pedal: entry.pedal || '',
          'Catalog Type': entry.catalog_type || entry.catalogType || '',
          Status: 'DEEP_REVIEW',
          Attempts: '0',
          'Last Failure': ''
        };
        row.Status = 'DEEP_REVIEW';
        row.Attempts = String((Number(row.Attempts) || 0) + 1);
        row['Last Failure'] = failure;
        reviewByKey.set(entryKey, row);
        continue;
      }
      recovered++;
      if (existingReview) {
        reviewByKey.delete(entryKey);
      }
      if (m) {
        m.image_source_url = result.result.imageUrl;
        if (result.result.sourcePage) m.image_source_page = result.result.sourcePage;
      }
    }
  }

  fs.writeFileSync(INDEX, JSON.stringify(catalog, null, 2) + '\n');
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  writeReviewQueue([...reviewByKey.values()].sort((a, b) =>
    (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
    String(a.Builder).localeCompare(String(b.Builder)) ||
    String(a.Pedal).localeCompare(String(b.Pedal))
  ));
  await browser.close();

  console.log('Browser photo recovery: recovered ' + recovered + '; attempted ' + attempted + '; failures ' + failures.length + '.');
  console.log('Photo deep-review queue: ' + reviewByKey.size + ' records parked for deeper research.');
  for (const failure of failures) console.log(' - ' + failure);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
