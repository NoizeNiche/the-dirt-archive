import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const TRACKER = path.join(ROOT, 'research/PRP_TRACKER.csv');
const PHOTO_REVIEW_QUEUE = path.join(ROOT, 'research/PHOTO_REVIEW_QUEUE.csv');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 90));
const CONCURRENCY = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_CONCURRENCY || 8));
const PRIORITY_COMPANY = String(process.env.PHOTO_BROWSER_CACHE_PRIORITY_COMPANY || '').trim().toLowerCase();
const IMAGE_SEARCH_ENABLED = String(process.env.PHOTO_BROWSER_IMAGE_SEARCH || 'true').toLowerCase() !== 'false';
const PAGE_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_PAGE_TIMEOUT_MS || 8000));
const SEARCH_TIMEOUT = Math.max(4000, Number(process.env.PHOTO_BROWSER_SEARCH_TIMEOUT_MS || 8000));
const IMAGE_TIMEOUT = Math.max(2500, Number(process.env.PHOTO_BROWSER_IMAGE_TIMEOUT_MS || 6000));
const CANDIDATE_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CANDIDATE_LIMIT || 8));
const SEARCH_VERIFY_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_SEARCH_VERIFY_LIMIT || 8));
const TARGET_BUILDER = String(process.env.PHOTO_BROWSER_TARGET_BUILDER || '').trim();
const TARGET_PEDAL = String(process.env.PHOTO_BROWSER_TARGET_PEDAL || '').trim();
const PER_BUILDER_LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_PER_BUILDER_LIMIT || 5));
const RECOVERY_DEADLINE_MS = Math.max(10000, Number(process.env.PHOTO_BROWSER_RECOVERY_DEADLINE_MS || 35000));
const MAX_RECOVERY_ATTEMPTS = Math.max(1, Number(process.env.PHOTO_BROWSER_MAX_RECOVERY_ATTEMPTS || 12));
const REVISIT_PARKED = String(process.env.PHOTO_BROWSER_REVISIT_PARKED || 'false').toLowerCase() !== 'false';
let manifestOwnersByImage = new Map();

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

function exactIdentity(value) {
  return String(value || '').trim().toLowerCase();
}

function collisionSlug(value) {
  const raw = String(value || '').trim();
  const plusAware = raw.replace(/\+/g, ' plus ');
  const readable = slug(plusAware);
  const base = slug(raw);
  if (readable !== base) return readable;
  return base + '-' + crypto.createHash('sha1').update(raw).digest('hex').slice(0, 8);
}

function relativeAssetPath(targetPath) {
  return './' + path.relative(ROOT, targetPath).split(path.sep).join('/');
}

function sameManifestOwner(owner, entry) {
  if (!owner) return false;
  return exactIdentity(owner.builder) === exactIdentity(entry.company || entry.builder) &&
    exactIdentity(owner.pedal) === exactIdentity(entry.pedal);
}

function safeAssetSlug(builder, name, buildPath, entry) {
  const base = slug(name);
  const basePath = buildPath(base);
  const owner = manifestOwnersByImage.get(relativeAssetPath(basePath));
  if (!fs.existsSync(basePath) || !owner || sameManifestOwner(owner, entry)) return base;

  let candidate = collisionSlug(name);
  let candidatePath = buildPath(candidate);
  const candidateOwner = manifestOwnersByImage.get(relativeAssetPath(candidatePath));
  if (fs.existsSync(candidatePath) && candidateOwner && !sameManifestOwner(candidateOwner, entry)) {
    candidate = slug(name) + '-' + crypto.createHash('sha1').update(String(name || '')).digest('hex').slice(0, 8);
  }
  return candidate;
}

function target(entry) {
  const builder = entry.company || entry.builder;
  if (entry.catalog_role === 'variation' && entry.parent_pedal) {
    const variant = entry.variation_name || entry.pedal;
    const parentDir = path.join(ROOT, 'assets/pedals', slug(builder), slug(entry.parent_pedal), 'variants');
    const variantSlug = safeAssetSlug(builder, variant, candidate => path.join(parentDir, candidate + '.webp'), entry);
    return path.join(parentDir, variantSlug + '.webp');
  }
  const builderSlug = slug(builder);
  const pedalSlug = safeAssetSlug(
    builder,
    entry.pedal,
    candidate => path.join(ROOT, 'assets/pedals', builderSlug, candidate, 'primary.webp'),
    entry
  );
  return path.join(ROOT, 'assets/pedals', builderSlug, pedalSlug, 'primary.webp');
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\+/g, ' plus ')
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

function pageMatchesSearchIdentity(entry, title, h1) {
  const haystack = normalizedIdentity(String(title || '') + ' ' + String(h1 || ''));
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const pedalPhrases = identityPhrases(entry.pedal);
  const phraseMatch = pedalPhrases.some(phrase => haystack.includes(phrase));
  const pedalPhrase = normalizedIdentity(entry.pedal);
  const exactPhrase = pedalPhrase && pedalPhrase.split(/\s+/).length >= 2 && haystack.includes(pedalPhrase);
  const pedalHits = pedalTokens.filter(token => haystack.includes(token)).length;
  const builderHits = builderTokens.filter(token => haystack.includes(token)).length;
  const requiredPedalHits = pedalTokens.length >= 2 ? Math.min(2, pedalTokens.length) : Math.max(1, pedalTokens.length);

  // Search-result identity must be proven by the title/H1 itself. For names
  // written as "Model - descriptor", the model phrase before the dash is often
  // the exact product name shown by marketplaces, so recognize that phrase while
  // still requiring builder context. Do not use arbitrary body text here.
  return Boolean(
    (phraseMatch && builderHits >= 1) ||
    (exactPhrase && builderHits >= 1) ||
    (pedalHits >= requiredPedalHits && builderHits >= 1)
  );
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
  return builderMatch && (
    tokens.length
      ? tokens.every(token => haystack.includes(token))
      : haystack.includes(normalizedIdentity(entry.pedal))
  );
}

function isReverbListingUrl(url) {
  try {
    const parsed = new URL(url);
    return /(^|\.)reverb\.com$/i.test(parsed.hostname) &&
      \/(?:[a-z]{2}(?:-[a-z]{2})?\/)?item\//i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function reverbListingMatchesIdentity(entry, url, title, h1) {
  try {
    const parsed = new URL(url);
    if (!isReverbListingUrl(url)) return false;
    const haystack = normalizedIdentity([title || '', h1 || '', parsed.pathname].join(' '));
    const pedalPhrase = normalizedIdentity(entry.pedal);
    const pedalTokens = identityTokens(entry.pedal);
    const builderTokens = identityTokens(entry.company);
    const builderMatch = !builderTokens.length || builderTokens.some(token => haystack.includes(token));
    const pedalMatch = pedalPhrase && pedalPhrase.split(/\s+/).length >= 2
      ? haystack.includes(pedalPhrase)
      : pedalTokens.length
        ? pedalTokens.every(token => haystack.includes(token))
        : haystack.includes(pedalPhrase);
    return Boolean(pedalMatch && builderMatch);
  } catch {
    return false;
  }
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
  const haystack = normalizedIdentity([result.title || '', result.purl || '', result.murl || ''].join(' '));
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const pedalHits = pedalTokens.filter(token => haystack.includes(token));
  const builderHits = builderTokens.filter(token => haystack.includes(token));
  let score = pedalHits.length * 15 + builderHits.length * 5;
  const exactPedal = normalizedIdentity(entry.pedal);
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

function preferredSourcePage(entry) {
  const imagePage = entry.image_source_page || null;
  const sourcePage = entry.source_page || null;
  if (!imagePage) return sourcePage;
  try {
    const parsed = new URL(imagePage);
    const isGenericReverbHome =
      /(^|\\.)reverb\\.com$/i.test(parsed.hostname) &&
      /^\\/?$/.test(parsed.pathname);
    if (isGenericReverbHome && sourcePage) return sourcePage;
  } catch {}
  return imagePage;
}

function hostMatchesBuilder(url, company) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const builder = normalizedIdentity(company);
    const compactHost = host.replace(/[^a-z0-9]+/g, ' ');
    const tokens = identityTokens(company);
    return Boolean(
      tokens.length && tokens.some(token => compactHost.includes(token))
    ) || (builder.length >= 6 && compactHost.includes(builder.replace(/ /g, '')));
  } catch {
    return false;
  }
}

async function makerWebCandidates(page, entry) {
  const queries = [
    '"' + entry.company + '" "' + entry.pedal + '"',
    entry.company + ' ' + entry.pedal
  ];
  const merged = new Map();

  for (const query of queries) {
    const searchUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
      await page.waitForTimeout(180);

      const results = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('li.b_algo h2 a')) {
          const href = el.href || '';
          const title = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!/^https?:/i.test(href) || !title) continue;
          const card = el.closest('li.b_algo');
          const snippet = (card?.textContent || '').replace(/\s+/g, ' ').trim();
          out.push({ purl: href.split('#')[0], title, snippet });
        }
        return out;
      });

      for (const result of results) {
        if (!merged.has(result.purl)) merged.set(result.purl, result);
      }
    } catch {}
  }

  const ranked = [...merged.values()]
    .map(result => {
      const haystack = normalizedIdentity(result.title + ' ' + result.snippet + ' ' + result.purl);
      const pedalTokens = identityTokens(entry.pedal);
      const builderTokens = identityTokens(entry.company);
      const pedalHits = pedalTokens.filter(token => haystack.includes(token)).length;
      const builderHits = builderTokens.filter(token => haystack.includes(token)).length;
      const exactPedal = normalizedIdentity(entry.pedal);
      const exactBuilder = normalizedIdentity(entry.company);
      let score = pedalHits * 15 + builderHits * 10;
      if (exactPedal && haystack.includes(exactPedal)) score += 70;
      if (exactBuilder && haystack.includes(exactBuilder)) score += 50;
      if (hostMatchesBuilder(result.purl, entry.company)) score += 80;
      return { result, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const out = [];
  for (const { result, score } of ranked) {
    try {
      const identity = await fetchSearchPageIdentity(page, result.purl);
      if (!identity) continue;
      if (!pageMatchesIdentity(entry, identity.title + ' ' + identity.body, identity.h1)) continue;

      const imageData = await page.goto(result.purl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT })
        .then(async () => {
          await page.waitForTimeout(180);
          return page.evaluate(() => {
            const urls = [];
            for (const selector of [
              'meta[property="og:image"]',
              'meta[name="twitter:image"]'
            ]) {
              const value = document.querySelector(selector)?.getAttribute('content') || '';
              if (value) urls.push(value);
            }
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
            return urls.filter(Boolean);
          });
        });

      for (const raw of imageData) {
        for (const part of String(raw).split(/\s+/)) {
          try {
            const url = /^https?:/i.test(part)
              ? part
              : new URL(part, result.purl).href;
            if (/^https?:/i.test(url)) {
              out.push({
                url,
                sourcePage: result.purl,
                sourceScore: 200 + Math.min(70, score)
              });
            }
          } catch {}
        }
      }
    } catch {}
  }
  return out;
}

async function reverbSoldCandidates(page, entry, deepReview = false) {
  if (!IMAGE_SEARCH_ENABLED) return [];

  // Deep-review records have already failed a normal pass. Keep the Reverb
  // search focused on the two highest-signal exact-identity queries so a hard
  // case gets more useful work per run instead of spending the whole deadline
  // on redundant search permutations.
  const queries = deepReview
    ? [
        entry.company + ' ' + entry.pedal,
        '"' + entry.pedal + '"'
      ]
    : [
        entry.company + ' ' + entry.pedal,
        '"' + entry.company + '" "' + entry.pedal + '"',
        entry.pedal + ' ' + entry.company
      ];

  const merged = new Map();
  for (const query of queries) {
    const searchUrl =
      'https://reverb.com/marketplace?query=' +
      encodeURIComponent(query) +
      '&product_type=effects-and-pedals&show_only_sold=true';

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
      await page.waitForTimeout(350);

      // Reverb's sold-results grid can lazy-load additional listings as the
      // viewport moves. Do a few bounded scrolls rather than a full-page scrape.
      for (let i = 0; i < (deepReview ? 2 : 2); i++) {
        await page.mouse.wheel(0, 1400);
        await page.waitForTimeout(250);
      }
      await page.mouse.wheel(0, -5600);
      await page.waitForTimeout(200);

      const results = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a[href*="/item/"]')) {
          const href = el.href || '';
          const title = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!href || !/^https?:\/\/reverb\.com(?:\/[a-z]{2}(?:-[a-z]{2})?)?\/item\//i.test(href)) continue;
          out.push({ purl: href.split('?')[0], title, searchUrl: location.href });
        }
        return out;
      });

      for (const result of results) {
        if (!merged.has(result.purl)) merged.set(result.purl, result);
      }
    } catch {}
  }

  // Sold listings remain the preferred source. If Reverb has no sold result
  // for a hard-to-find pedal, make one bounded active-listing pass as a fallback.
  // The listing page is still identity-verified before any image is accepted.
  if (deepReview || !merged.size) {
    const fallbackQuery = entry.company + ' ' + entry.pedal;
    const searchUrl =
      'https://reverb.com/marketplace?query=' +
      encodeURIComponent(fallbackQuery) +
      '&product_type=effects-and-pedals';
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
      await page.waitForTimeout(350);
      for (let i = 0; i < (deepReview ? 2 : 1); i++) {
        await page.mouse.wheel(0, 1400);
        await page.waitForTimeout(250);
      }
      const results = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a[href*="/item/"]')) {
          const href = el.href || '';
          const title = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!href || !/^https?:\/\/reverb\.com(?:\/[a-z]{2}(?:-[a-z]{2})?)?\/item\//i.test(href)) continue;
          out.push({ purl: href.split('?')[0], title, searchUrl: location.href });
        }
        return out;
      });
      for (const result of results) {
        if (!merged.has(result.purl)) merged.set(result.purl, result);
      }
    } catch {}
  }

  return [...merged.values()];
}

async function linkedExactSourceCandidates(page, entry, sourcePageUsed, deepReview = false) {
  if (!deepReview || !sourcePageUsed) return [];
  let hostname = '';
  try { hostname = new URL(sourcePageUsed).hostname; } catch {}
  if (!/(^|\.)effectsdatabase\.com$/i.test(hostname)) return [];

  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const links = await page.evaluate(({ pedalTokens, builderTokens }) => {
    const norm = value => String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const out = [];
    for (const el of document.querySelectorAll('a[href]')) {
      const href = el.href || '';
      if (!/^https?:/i.test(href)) continue;
      try {
        const u = new URL(href);
        if (/(^|\.)effectsdatabase\.com$/i.test(u.hostname)) continue;
      } catch {
        continue;
      }
      const text = norm(
        (el.textContent || '') + ' ' +
        (el.getAttribute('title') || '') + ' ' + href
      );
      const pedalHits = pedalTokens.filter(token => text.includes(token)).length;
      const builderHits = builderTokens.filter(token => text.includes(token)).length;
      if (!pedalHits && !builderHits) continue;
      out.push({
        href: href.split('#')[0],
        score: pedalHits * 20 + builderHits * 8
      });
    }
    return [...new Map(out.map(x => [x.href, x])).values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }, { pedalTokens, builderTokens });

  const out = [];
  for (const link of links) {
    try {
      // Go directly to the candidate page once, then verify the rendered page.
      // This removes a duplicate HTTP fetch that was making deep-review passes
      // spend most of their time on sources that were ultimately rejected.
      await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
      await page.waitForTimeout(250);
      const title = await page.title().catch(() => '');
      const h1 = await page.locator('h1').first().textContent().catch(() => '');
      const body = await page.locator('body').textContent().catch(() => '');
      if (!pageMatchesIdentity(entry, title + ' ' + body, h1)) continue;

      const imageData = await page.evaluate(() => {
        const urls = [];
        for (const selector of [
          'meta[property="og:image"]',
          'meta[name="twitter:image"]'
        ]) {
          const value = document.querySelector(selector)?.getAttribute('content') || '';
          if (value) urls.push(value);
        }
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
        return urls.filter(Boolean);
      });

      for (const raw of imageData) {
        for (const part of String(raw).split(/\s+/)) {
          try {
            const url = /^https?:/i.test(part)
              ? part
              : new URL(part, link.href).href;
            if (/^https?:/i.test(url)) {
              out.push({
                url,
                sourcePage: link.href,
                sourceScore: 170
              });
            }
          } catch {}
        }
      }
    } catch {}
  }
  return out;
}

async function imageSearchCandidates(page, entry, deepReview = false) {
  if (!IMAGE_SEARCH_ENABLED) return [];
  const queries = deepReview
    ? [
        '"' + entry.company + '" "' + entry.pedal + '" guitar pedal',
        '"' + entry.pedal + '" "' + entry.company + '" pedal',
        '"' + entry.pedal + '" guitar pedal',
        entry.pedal + " pedal"
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
    const pageUrl = preferredSourcePage(entry);

    // Use the builder's own web presence first whenever the existing research
    // source is not obviously hosted by the builder. This matches the archive's
    // simple recovery ladder: maker first, then known pedal databases/marketplaces.
    if (!pageUrl || !hostMatchesBuilder(pageUrl, entry.company)) {
      const makerCandidates = await makerWebCandidates(page, entry);
      candidates.push(...makerCandidates);
    }

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

        const pageIdentityMatch =
          pageMatchesIdentity(entry, title + ' ' + body, h1) ||
          reverbListingMatchesIdentity(entry, pageUrl, title, h1);
        if (pageIdentityMatch) {
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

          if (!candidates.some(x => x.sourcePage === sourcePageUsed && x.sourceScore >= 120)) {
            const linked = await linkedExactSourceCandidates(page, entry, sourcePageUsed, deepReview);
            candidates.push(...linked);
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

    // A verified source page can display the exact pedal photo even when its
    // image URL returns a block/403/500 to a direct request. Capture the rendered
    // photo from the already identity-verified page instead of substituting a
    // search-engine image.
    async function screenshotVerifiedSourcePageImage(sourcePage) {
      if (!sourcePage) return null;
      try {
        const parsedSource = new URL(sourcePage);
        const isReverbListing = isReverbListingUrl(sourcePage);
        await page.goto(sourcePage, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
        await page.waitForTimeout(isReverbListing ? 1400 : 350);

        if (isReverbListing) {
          await page.mouse.wheel(0, 900);
          await page.waitForTimeout(450);
        }

        const pedalTokens = identityTokens(entry.pedal);
        const imageSelectors = await page.evaluate((tokens) => {
          const candidates = [];
          for (const img of document.querySelectorAll('img')) {
            const rect = img.getBoundingClientRect();
            const src = img.currentSrc || img.src || '';
            const alt = String(img.alt || '').toLowerCase();
            const hint = (src + ' ' + alt).toLowerCase();
            if (!src || src.startsWith('data:')) continue;
            if (/(logo|avatar|icon|sprite|favicon|banner)/i.test(hint)) continue;

            const visibleWidth = Math.max(rect.width, Number(img.naturalWidth) || 0);
            const visibleHeight = Math.max(rect.height, Number(img.naturalHeight) || 0);
            if (visibleWidth < 140 || visibleHeight < 140) continue;

            const normalized = hint.replace(/[^a-z0-9]+/g, ' ');
            const tokenHits = tokens.filter(token => normalized.includes(token)).length;
            const area = visibleWidth * visibleHeight;
            candidates.push({
              src,
              score: tokenHits * 100000000 + area
            });
          }

          return candidates
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(x => x.src);
        }, pedalTokens);

        const matches = page.locator('img');
        const count = await matches.count();
        for (const src of imageSelectors) {
          for (let i = 0; i < count; i++) {
            const img = matches.nth(i);
            const currentSrc = await img.evaluate(el => el.currentSrc || el.src || '').catch(() => '');
            if (currentSrc !== src) continue;
            await img.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(120);
            const bytes = await img.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return { bytes, src };
            }
          }
        }
      } catch {}
      return null;
    }

    // First trust only candidates discovered on the already-verified source page.
    let selectedResult = await tryImages(
      ranked.filter(candidate => !candidate.searchResult)
    );

    if (!selectedResult) {
      const sourcePages = [...new Set(
        ranked
          .filter(candidate => !candidate.searchResult && candidate.sourcePage)
          .map(candidate => candidate.sourcePage)
      )].slice(0, 3);

      for (const sourcePage of sourcePages) {
        const shot = await screenshotVerifiedSourcePageImage(sourcePage);
        if (shot) {
          selectedResult = {
            candidate: {
              url: shot.src,
              sourcePage,
              sourceScore: 115
            },
            bytes: shot.bytes
          };
          break;
        }
      }
    }

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

    // Reverb sold listings are the preferred marketplace source for hard cases.
    // Reverb's Sold Listings filter exposes previously sold listings, and Reverb
    // requires listing photos to show the exact item being sold. Verify the listing
    // identity first, then harvest its actual listing photos.
    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const soldResults = await reverbSoldCandidates(page, entry, deepReview);
      const verifiedSold = [];

      const verifyLimit = deepReview ? Math.min(4, SEARCH_VERIFY_LIMIT) : SEARCH_VERIFY_LIMIT;

      for (const result of soldResults.slice(0, verifyLimit)) {
        const searchIdentity = normalizedIdentity((result.title || '') + ' ' + result.purl);
        const pedalTokens = identityTokens(entry.pedal);
        const builderTokens = identityTokens(entry.company);
        const pedalHits = pedalTokens.filter(token => searchIdentity.includes(token)).length;
        const builderHits = builderTokens.filter(token => searchIdentity.includes(token)).length;
        const requiredHits = pedalTokens.length >= 2 ? 2 : 1;

        // The listing title/URL is only a fast model-name prefilter. Reverb
        // listing pages are verified below, where the builder/brand is present
        // in the actual listing metadata/body. Requiring the builder here was
        // too strict and rejected legitimate sold listings whose titles omit it.
        if (pedalHits < requiredHits) continue;

        try {
          const networkStart = networkImageUrls.length;
          await page.goto(result.purl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
          await page.waitForTimeout(500);

          const title = await page.title().catch(() => '');
          const h1 = await page.locator('h1').first().textContent().catch(() => '');
          const body = await page.locator('body').textContent().catch(() => '');
          const identity = { title, h1, body };

          if (
            !pageMatchesIdentity(entry, title + ' ' + body, h1) &&
            !reverbListingMatchesIdentity(entry, result.purl, title, h1)
          ) continue;

          const imageData = await page.evaluate(() => {
            const urls = [];
            for (const selector of [
              'meta[property="og:image"]',
              'meta[name="twitter:image"]'
            ]) {
              const value = document.querySelector(selector)?.getAttribute('content') || '';
              if (value) urls.push(value);
            }
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
            return urls.filter(Boolean);
          });

          await page.waitForTimeout(700);
          const networkUrls = networkImageUrls.slice(networkStart);

          for (const raw of [...imageData, ...networkUrls]) {
            for (const part of String(raw).split(/\s+/)) {
              try {
                const url = /^https?:/i.test(part)
                  ? part
                  : new URL(part, result.purl).href;
                if (/^https?:/i.test(url)) {
                  verifiedSold.push({
                    url,
                    sourcePage: result.purl,
                    sourceScore: 180,
                    searchResult: false
                  });
                }
              } catch {}
            }
          }
        } catch {}
      }

      selectedResult = await tryImages(
        [...new Map(verifiedSold.map(x => [x.url, x])).values()]
          .sort((a, b) => b.sourceScore - a.sourceScore)
      );
    }

    // If no sold Reverb listing yielded a usable image, fall back to general
    // image search and other indexed web results.
    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const searchResults = await imageSearchCandidates(page, entry, deepReview);
      const verifiedSearch = [];
      const rankedSearchResults = searchResults
        .map(result => ({ result, fit: imageSearchScore(entry, result) }))
        .sort((a, b) => b.fit.score - a.fit.score);
      const verifyLimit = deepReview ? Math.min(4, SEARCH_VERIFY_LIMIT) : SEARCH_VERIFY_LIMIT;
      for (const ranked of rankedSearchResults.slice(0, verifyLimit)) {
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
          if (!pageMatchesSearchIdentity(entry, identity.title, identity.h1)) continue;
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
  manifestOwnersByImage = new Map(
    manifest
      .filter(row => row && row.image)
      .map(row => [String(row.image), { builder: row.builder || row.company || '', pedal: row.pedal || '' }])
  );
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

  // Remove queue rows that are already resolved in the tracker. These stale
  // entries otherwise consume the bounded deep-review slots even though the
  // catalog no longer needs a photo for them.
  let staleResolved = 0;
  for (const [queueKey, row] of reviewByKey) {
    const tracker = trackerMeta.get(queueKey);
    if (tracker?.pictureDone === true) {
      reviewByKey.delete(queueKey);
      staleResolved++;
    }
  }
  if (staleResolved) {
    writeReviewQueue([...reviewByKey.values()].sort((a, b) =>
      (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
      String(a.Builder).localeCompare(String(b.Builder)) ||
      String(a.Pedal).localeCompare(String(b.Pedal))
    ));
    console.log('Removed ' + staleResolved + ' stale photo-review queue rows already marked DONE.');
  }

  // Self-heal older queue entries that reached the automatic-attempt cutoff
  // before the cutoff rule was installed. They are parked before selection so
  // they cannot keep consuming recovery cycles.
  let parkedOnLoad = false;
  for (const row of reviewByKey.values()) {
    if ((Number(row.Attempts) || 0) >= MAX_RECOVERY_ATTEMPTS && row.Status !== 'PARKED') {
      row.Status = 'PARKED';
      row['Last Failure'] =
        'PARKED after ' + MAX_RECOVERY_ATTEMPTS + ' automatic photo attempts; hold for deeper/manual photo research.';
      parkedOnLoad = true;
    }
  }
  if (parkedOnLoad) {
    writeReviewQueue([...reviewByKey.values()].sort((a, b) =>
      (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
      String(a.Builder).localeCompare(String(b.Builder)) ||
      String(a.Pedal).localeCompare(String(b.Pedal))
    ));
    console.log('Photo review queue self-healed: entries at the automatic-attempt cutoff were parked.');
  }
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));

  // Reopen a small batch of records that exhausted the ordinary automatic
  // search. Deep review gets a fresh attempt budget, while the automatic cutoff
  // still prevents any one stubborn pedal from consuming every run.
  if (!TARGET_BUILDER && !TARGET_PEDAL && REVISIT_PARKED) {
    const parkedForDeepReview = [...reviewByKey.values()]
      .filter(row => row.Status === 'PARKED' && /automatic photo attempts/i.test(String(row['Last Failure'] || '')))
      .sort((a, b) =>
        (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
        String(a.Builder).localeCompare(String(b.Builder)) ||
        String(a.Pedal).localeCompare(String(b.Pedal))
      );
    const reopenLimit = Math.min(15, LIMIT, parkedForDeepReview.length);
    for (const row of parkedForDeepReview.slice(0, reopenLimit)) {
      row.Status = 'DEEP_REVIEW';
      row.Attempts = '0';
      row['Last Failure'] = 'DEEP_REVIEW_STARTED after automatic photo cutoff.';
    }
    if (reopenLimit) {
      writeReviewQueue([...reviewByKey.values()].sort((a, b) =>
        (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
        String(a.Builder).localeCompare(String(b.Builder)) ||
        String(a.Pedal).localeCompare(String(b.Pedal))
      ));
      console.log('Reopened ' + reopenLimit + ' parked records for deep photo review.');
    }
  }
  const orderedCandidates = (catalog.pedals || [])
    .filter(x => {
      if (TARGET_BUILDER && String(x.company || '').trim() !== TARGET_BUILDER) return false;
      if (TARGET_PEDAL && String(x.pedal || '').trim() !== TARGET_PEDAL) return false;
      if (!x.research_record) return false;
      // Bulk recovery is exclusively for records whose tracker photo field is
      // still unresolved. Cleanup of already-complete records is handled only
      // through an explicit targeted run, so the backlog cannot be starved.
      const tracker = trackerMeta.get(key(x.company, x.pedal));
      const review = reviewByKey.get(key(x.company, x.pedal));
      // A normal backlog pass gets one clean attempt per unresolved record.
      // Failed records are parked for a deeper review pass instead of being
      // hammered again on every cache run.
      if (!TARGET_BUILDER && !TARGET_PEDAL && review?.Status === 'DEEP_REVIEW' && String(process.env.PHOTO_BROWSER_DEEP_REVIEW || 'true').toLowerCase() === 'false') return false;
      const canonical = target(x);
      // The tracker is the source of truth for the researched-photo gate.
      // Follow its Picture field so a missing photo cannot disappear from the
      // recovery queue just because an old local artifact happens to exist.
      if (tracker) return tracker.pictureDone !== true;
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

  // In bulk mode, unresolved records that have never failed get first
  // priority. Deep-review records are intentionally parked behind that normal
  // backlog so a stubborn hard case can never consume an entire run repeatedly.
  // Once the normal researched-photo backlog is empty, the same scheduler opens
  // the deep-review queue and works through it.
  let candidates = orderedCandidates;
  if (!TARGET_BUILDER && !TARGET_PEDAL) {
    const normalCandidates = orderedCandidates.filter(entry => {
      const status = reviewByKey.get(key(entry.company, entry.pedal))?.Status;
      return status !== 'DEEP_REVIEW' && status !== 'PARKED';
    });
    const deepCandidates = orderedCandidates
      .filter(entry => {
        const review = reviewByKey.get(key(entry.company, entry.pedal));
        return review?.Status === 'DEEP_REVIEW' && (Number(review.Attempts) || 0) < MAX_RECOVERY_ATTEMPTS;
      })
      .sort((a, b) => {
        const aReview = reviewByKey.get(key(a.company, a.pedal));
        const bReview = reviewByKey.get(key(b.company, b.pedal));
        const aAttempts = Number(aReview?.Attempts) || 0;
        const bAttempts = Number(bReview?.Attempts) || 0;
        if (aAttempts !== bAttempts) return aAttempts - bAttempts;
        const aOrder = trackerMeta.get(key(a.company, a.pedal))?.order;
        const bOrder = trackerMeta.get(key(b.company, b.pedal))?.order;
        if (Number.isFinite(aOrder) && Number.isFinite(bOrder)) return aOrder - bOrder;
        return 0;
      });
    // Finish the ordinary researched-photo backlog before spending automatic
    // time on stubborn deep-review cases. This keeps the archive moving toward
    // zero unresolved researched photos as quickly as possible. Once the ordinary
    // backlog is empty, the same scheduler automatically opens deep review.
    // Reserve a small, fixed part of every bulk run for the hardest cases.
    // The previous selector could accidentally fill all LIMIT slots with fresh
    // records before the high-attempt cases ever got selected. That made a
    // stubborn pedal effectively wait forever while the queue stayed non-empty.
    // Fifteen slots is enough to keep deep review moving without sacrificing the
    // bulk of the run to one difficult corner of the archive.
    const HARD_CASE_SLOTS = Math.min(15, LIMIT, deepCandidates.length);
    const FRESH_CASE_SLOTS = Math.max(0, LIMIT - HARD_CASE_SLOTS);
    const highAttemptCases = [...deepCandidates]
      .sort((a, b) => {
        const aReview = reviewByKey.get(key(a.company, a.pedal));
        const bReview = reviewByKey.get(key(b.company, b.pedal));
        const aAttempts = Number(aReview?.Attempts) || 0;
        const bAttempts = Number(bReview?.Attempts) || 0;
        if (aAttempts !== bAttempts) return bAttempts - aAttempts;
        const aOrder = trackerMeta.get(key(a.company, a.pedal))?.order;
        const bOrder = trackerMeta.get(key(b.company, b.pedal))?.order;
        if (Number.isFinite(aOrder) && Number.isFinite(bOrder)) return aOrder - bOrder;
        return 0;
      })
      .slice(0, HARD_CASE_SLOTS);
    const hardCases = highAttemptCases;
    // Fill the remaining slots with ordinary unresolved records. This keeps
    // progress broad while guaranteeing that hard cases get revisited every run.
    const freshPool = normalCandidates.length
      ? [...normalCandidates, ...deepCandidates]
      : deepCandidates;
    const freshCases = freshPool.slice(0, FRESH_CASE_SLOTS);
    const activePool = [...freshCases, ...hardCases]
      .filter((entry, index, pool) => pool.findIndex(x => key(x.company, x.pedal) === key(entry.company, entry.pedal)) === index);

    const selected = [];
    const deferred = [];
    const perBuilder = new Map();
    for (const entry of activePool) {
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

  if (TARGET_BUILDER && TARGET_PEDAL) {
    const targetReview = reviewByKey.get(key(TARGET_BUILDER, TARGET_PEDAL));
    const targetAttempts = Number(targetReview?.Attempts) || 0;
    if (targetReview?.Status === 'PARKED' || targetAttempts >= MAX_RECOVERY_ATTEMPTS) {
      if (targetAttempts >= MAX_RECOVERY_ATTEMPTS && targetReview?.Status !== 'PARKED') {
        targetReview.Status = 'PARKED';
        targetReview['Last Failure'] =
          'PARKED after ' + MAX_RECOVERY_ATTEMPTS + ' automatic photo attempts; hold for deeper/manual photo research.';
      }
      writeReviewQueue([...reviewByKey.values()].sort((a, b) =>
        (Number(a.Attempts) || 0) - (Number(b.Attempts) || 0) ||
        String(a.Builder).localeCompare(String(b.Builder)) ||
        String(a.Pedal).localeCompare(String(b.Pedal))
      ));
      console.log('Photo recovery skipped for parked target: ' + TARGET_BUILDER + ' - ' + TARGET_PEDAL);
      process.exit(0);
    }
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
        const recoveryPromise = recoverEntry(browser, entry, review?.Status === 'DEEP_REVIEW');
        const hardTimeout = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('recovery hard timeout exceeded')),
            RECOVERY_DEADLINE_MS + 5000
          );
        });
        const result = await Promise.race([recoveryPromise, hardTimeout]);
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
        row.Attempts = String((Number(row.Attempts) || 0) + 1);
        const attempts = Number(row.Attempts) || 0;
        const wasDeepReview = existingReview?.Status === 'DEEP_REVIEW';
        row.Status = attempts >= MAX_RECOVERY_ATTEMPTS ? 'PARKED' : 'DEEP_REVIEW';
        row['Last Failure'] = attempts >= MAX_RECOVERY_ATTEMPTS
          ? 'PARKED after ' + MAX_RECOVERY_ATTEMPTS + (wasDeepReview ? ' deep-review attempts: ' : ' automatic photo attempts: ') + failure
          : failure;
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
  const parked = [...reviewByKey.values()].filter(row => row.Status === 'PARKED').length;
  console.log('Photo review queue: ' + reviewByKey.size + ' records; ' + parked + ' parked at the automatic-attempt cutoff.');
  for (const failure of failures) console.log(' - ' + failure);
})().catch(err => {
  console.error(err);
  process.exit(1);
});