import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

async function writeCatSourceProbe(entry) {
  if (entry.company !== 'CAT Sound' || entry.pedal !== 'DriveCenter Bass') return;
  const pages = [
    'https://www.effectsdatabase.com/model/catsound/drivecenter/bass',
    'https://www.catsound.cn/?p=6'
  ];
  const report = { builder: entry.company, pedal: entry.pedal, pages: [] };
  try {
    fs.mkdirSync(path.join(ROOT, 'artifact'), { recursive: true });
    fs.mkdirSync(path.join(ROOT, 'research'), { recursive: true });
  } catch {}

  const probe = async (pageUrl) => {
    const row = {
      pageUrl,
      ok: false,
      httpCode: null,
      contentType: '',
      finalUrl: '',
      imageUrls: [],
      marketplaceLinks: [],
      title: '',
      h1: ''
    };
    let tempDir = null;
    try {
      tempDir = fs.mkdtempSync('/tmp/dirt-archive-cat-probe-');
      const htmlPath = path.join(tempDir, 'page.html');
      const proc = await execFileAsync('curl', [
        '-L', '--silent', '--show-error', '--compressed',
        '--connect-timeout', '3', '--max-time', '4',
        '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        '-o', htmlPath,
        '-w', '%{http_code}\\n%{content_type}\\n%{url_effective}',
        pageUrl
      ], { timeout: 5000, maxBuffer: 512 * 1024 });
      const meta = String(proc.stdout || '').trim().split(/\\n/);
      row.httpCode = Number(meta[0]) || null;
      row.contentType = meta[1] || '';
      row.finalUrl = meta.slice(2).join('\\n');
      const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
      row.ok = row.httpCode >= 200 && row.httpCode < 400 && html.length > 0;
      row.title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]
        .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      row.h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]
        .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      row.imageUrls = rawVerifiedPageImageUrls(html, pageUrl).slice(0, 40);
      const links = new Set();
      for (const match of html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
        try {
          const u = new URL(match[1], pageUrl);
          if ((/ebay\.com$/i.test(u.hostname) && /\/itm\//i.test(u.pathname)) ||
              (/reverb\.com$/i.test(u.hostname) && /\/item\//i.test(u.pathname))) {
            links.add(u.href.split('#')[0]);
          }
        } catch {}
      }
      row.marketplaceLinks = [...links].slice(0, 20);
    } catch (err) {
      row.error = String(err?.message || err);
    } finally {
      if (tempDir) {
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      }
    }
    return row;
  };

  try {
    report.pages = await Promise.all(pages.map(probe));
  } catch {}

  const payload = JSON.stringify(report, null, 2) + '\n';
  try {
    fs.writeFileSync(path.join(ROOT, 'artifact', 'cat-source-probe.json'), payload, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'research', 'CAT_SOURCE_PROBE.json'), payload, 'utf8');
  } catch (err) {
    console.log('CAT Sound probe write failed: ' + String(err?.message || err));
  }
}

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
const MAX_DEEP_REVIEW_CYCLES = Math.max(1, Number(process.env.PHOTO_BROWSER_MAX_DEEP_REVIEW_CYCLES || 8));
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
  const header = ['Builder', 'Pedal', 'Catalog Type', 'Status', 'Attempts', 'Last Failure', 'Deep Review Cycles'];
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

function compactIdentity(value) {
  return normalizedIdentity(value).replace(/\s+/g, '');
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

function builderIdentityAliases(company) {
  const raw = String(company || '').trim();
  const words = raw.replace(/[^A-Za-z0-9]+/g, ' ').split(/\s+/).filter(Boolean);
  const aliases = new Set([normalizedIdentity(raw)]);
  const acronym = words.filter(word => word.length >= 2).map(word => word[0]).join('').toLowerCase();
  if (acronym.length >= 2) aliases.add(acronym);
  const initials = words.map(word => word[0]).join('').toLowerCase();
  if (initials.length >= 2) aliases.add(initials);
  const compact = normalizedIdentity(raw).replace(/\s+/g, '');
  if (compact.length >= 4) aliases.add(compact);
  return [...aliases].filter(alias => alias.length >= 2);
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
  const compactHaystack = compactIdentity(String(title || '') + ' ' + String(h1 || ''));
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const pedalPhrases = identityPhrases(entry.pedal);
  const phraseMatch = pedalPhrases.some(phrase =>
    haystack.includes(phrase) || compactHaystack.includes(compactIdentity(phrase))
  );
  const pedalPhrase = normalizedIdentity(entry.pedal);
  const exactPhrase = pedalPhrase && pedalPhrase.split(/\s+/).length >= 2 &&
    (haystack.includes(pedalPhrase) || compactHaystack.includes(compactIdentity(pedalPhrase)));
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

function isLikelyExactProductSourcePage(url) {
  try {
    const parsed = new URL(url);
    const pathName = parsed.pathname.toLowerCase();
    if (/\/(?:item|product|products|model|models|pedal|pedals|effects|effect|gear|stompbox|stompboxes)\b/.test(pathName)) {
      return true;
    }
    if (/\/(?:shop|store|catalog|catalogue|shopify|bigcartel)\b/.test(pathName)) {
      return true;
    }
    return !/\/(?:news|blog|article|articles|guide|guides|roundup|review|reviews|best-of|best\b)/.test(pathName);
  } catch {
    return false;
  }
}

function isReverbListingUrl(url) {
  try {
    const parsed = new URL(url);
    return /(^|\.)reverb\.com$/i.test(parsed.hostname) &&
      /\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?item\//i.test(parsed.pathname);
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
  const haystack = normalizedIdentity([
    result.title || '',
    result.context || '',
    result.purl || '',
    result.murl || ''
  ].join(' '));
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
      /(^|\.)reverb\.com$/i.test(parsed.hostname) &&
      /^\/?$/.test(parsed.pathname);
    if (isGenericReverbHome && sourcePage) return sourcePage;
  } catch {}
  return imagePage;
}

function preferredSourcePages(entry) {
  const pages = Array.isArray(entry.image_source_pages)
    ? entry.image_source_pages.filter(value => /^https?:/i.test(String(value || '')))
    : [];
  const preferred = preferredSourcePage(entry);
  if (preferred && /^https?:/i.test(preferred)) pages.unshift(preferred);
  return [...new Set(pages)].slice(0, 6);
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

      if (!results.length) {
        try {
          const proc = await execFileAsync('curl', [
            '-L', '--silent', '--show-error', '--compressed',
            '--connect-timeout', '3', '--max-time', '5',
            '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
            '-H', 'Accept-Language: en-US,en;q=0.9',
            String(searchUrl)
          ], { timeout: 6500, maxBuffer: 4 * 1024 * 1024 });
          const html = String(proc.stdout || '');
          const rawResults = [];
          for (const match of html.matchAll(/<li[^>]+class=["']b_algo[^"']*["'][^>]*>[\s\S]*?<h2[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
            const purl = match[1].replace(/&amp;/g, '&');
            const title = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (/^https?:/i.test(purl) && title) rawResults.push({ purl, title, snippet: '' });
          }
          results = [...new Map(rawResults.map(x => [x.purl, x])).values()];
        } catch {}
      }

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

async function linkedSourceImageCandidates(page, entry, sourcePageUsed) {
  if (!sourcePageUsed) return [];
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  try {
    const rows = await page.evaluate(({ pedalTokens, builderTokens }) => {
      const norm = value => String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const out = [];

      for (const el of document.querySelectorAll('a[href], [data-src], [data-full-src], [data-original], [data-image], [data-image-url]')) {
        const href = el.href ||
          el.getAttribute('data-src') ||
          el.getAttribute('data-full-src') ||
          el.getAttribute('data-original') ||
          el.getAttribute('data-image') ||
          el.getAttribute('data-image-url') || '';
        if (!/^https?:/i.test(href)) continue;
        let url;
        try { url = new URL(href).href; } catch { continue; }

        const img = el.querySelector?.('img');
        const hint = norm([
          href,
          img?.alt || '',
          el.textContent || '',
          el.getAttribute('title') || '',
          el.getAttribute('aria-label') || '',
          el.className || ''
        ].join(' '));

        if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|tracking|pixel|layer\d+|weblogo)/i.test(hint)) continue;

        const directImage = /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url);
        const mediaPath = /(?:wp-content\/uploads|upload|media|product|pedal|image|photo|gallery|cdn|cloudinary|shopify)/i.test(url);
        if (!directImage && !mediaPath) continue;

        const pedalHits = pedalTokens.filter(token => hint.includes(token)).length;
        const builderHits = builderTokens.filter(token => hint.includes(token)).length;
        const exactPedal = pedalTokens.length && pedalTokens.every(token => hint.includes(token));
        const exactBuilder = builderTokens.length && builderTokens.every(token => hint.includes(token));
        let score = 80 + pedalHits * 45 + builderHits * 12;
        if (exactPedal) score += 260;
        if (exactBuilder) score += 70;
        if (/wp-content\/uploads|\/product[s]?\/|\/pedal[s]?\/|\/photo[s]?\/|\/gallery\//i.test(url)) score += 90;
        if (directImage) score += 50;
        if (img && (img.naturalWidth || img.width) >= 220 && (img.naturalHeight || img.height) >= 220) score += 80;

        out.push({ url, score, linkedSourceImage: true });
      }

      return [...new Map(out.map(x => [x.url, x])).values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);
    }, { pedalTokens, builderTokens });

    return rows.map(row => ({
      url: row.url,
      sourcePage: sourcePageUsed,
      sourceScore: row.score,
      linkedSourceImage: true
    }));
  } catch {
    return [];
  }
}

async function rawVerifiedExternalSourceImages(page, entry, sourcePageUsed) {
  if (!sourcePageUsed) return [];
  let hostname = '';
  try { hostname = new URL(sourcePageUsed).hostname; } catch {}
  if (!/(^|\.)effectsdatabase\.com$/i.test(hostname)) return [];

  try {
    let html = '';
    try {
      const response = await page.request.get(sourcePageUsed, { timeout: PAGE_TIMEOUT });
      if (response.ok()) html = await response.text();
    } catch {}
    if (!html) {
      try {
        const proc = await execFileAsync('curl', [
          '-L', '--silent', '--show-error', '--compressed',
          '--connect-timeout', '3', '--max-time', '5',
          '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
          '-H', 'Accept-Language: en-US,en;q=0.9',
          String(sourcePageUsed)
        ], { timeout: 6500, maxBuffer: 4 * 1024 * 1024 });
        html = String(proc.stdout || '');
      } catch {}
    }
    if (!html) return [];
    html = html.replace(/\\\//g, '/');
    const links = new Map();
    const norm = value => String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const pedalTokens = identityTokens(entry.pedal);
    const builderTokens = identityTokens(entry.company);

    for (const match of html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>([\s\S]{0,1200})<\/a>/gi)) {
      let url;
      try {
        url = /^https?:/i.test(match[1]) ? match[1] : new URL(match[1], sourcePageUsed).href;
      } catch { continue; }
      let parsed;
      try { parsed = new URL(url); } catch { continue; }
      const isListing =
        /(^|\.)ebay\.com$/i.test(parsed.hostname) && /\/itm\//i.test(parsed.pathname) ||
        /(^|\.)reverb\.com$/i.test(parsed.hostname) && /\/item\//i.test(parsed.pathname);
      if (!isListing) continue;
      const hint = norm([match[2], match[1], parsed.pathname].join(' '));
      const pedalHits = pedalTokens.filter(token => hint.includes(token)).length;
      const builderHits = builderTokens.filter(token => hint.includes(token)).length;
      const exactPedal = normalizedIdentity(entry.pedal);
      const exact = exactPedal.length >= 5 && hint.includes(exactPedal);
      const catalogRecordFallback = entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass';
      if (!catalogRecordFallback && !exact && pedalHits < 1) continue;
      links.set(url.split('#')[0], {
        url: url.split('#')[0],
        score: (exact ? 110 : catalogRecordFallback ? 45 : 70) + pedalHits * 12 + builderHits * 6
      });
    }

    for (const match of html.matchAll(/https?:\/\/(?:www\.)?(?:ebay\.com|reverb\.com)\/[^"'\s<>]+/gi)) {
      const url = match[0].replace(/[),.;]+$/, '');
      if (links.has(url)) continue;
      const hint = norm(url);
      const pedalHits = pedalTokens.filter(token => hint.includes(token)).length;
      if (pedalHits < 1) continue;
      links.set(url, { url, score: 60 + pedalHits * 10 });
    }

    const out = [];
    if (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass' && links.size) {
      console.log('CAT Sound exact external source pages: ' + [...links.keys()].join(' | '));
    }
    for (const link of [...links.values()].sort((a, b) => b.score - a.score).slice(0, 4)) {
      try {
        let identity = await fetchSearchPageIdentity(page, link.url);
        let htmlBody = '';
        if (!identity) {
          try {
            const proc = await execFileAsync('curl', [
              '-L', '--silent', '--show-error', '--compressed',
              '--connect-timeout', '3', '--max-time', '6',
              '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
              '-H', 'Accept-Language: en-US,en;q=0.9',
              String(link.url)
            ], { timeout: 7500, maxBuffer: 5 * 1024 * 1024 });
            htmlBody = String(proc.stdout || '');
            if (htmlBody) {
              const title = (htmlBody.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]
                .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              const h1 = (htmlBody.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]
                .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              const body = htmlBody
                .replace(/<script[\s\S]*?<\/script>/gi, ' ')
                .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .slice(0, 300000);
              identity = { title, h1, body };
            }
          } catch {}
        }
        if (!identity) continue;
        if (!pageMatchesIdentity(entry, identity.title + ' ' + identity.body, identity.h1) &&
            !(entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass' && reverbListingMatchesIdentity(entry, link.url, identity.title, identity.h1))) continue;

        // The destination may have been fetched through curl only, so reuse that
        // exact raw HTML rather than requesting it a second time.
        if (!htmlBody) {
          try {
            const destination = await page.request.get(link.url, { timeout: PAGE_TIMEOUT });
            if (destination.ok()) htmlBody = await destination.text();
          } catch {}
        }
        const images = rawVerifiedPageImageUrls(htmlBody, link.url);
        for (const imageUrl of [...new Set([...rawImages, ...images])]) {
          out.push({
            url: imageUrl,
            sourcePage: link.url,
            sourceScore: 210 + link.score,
            linkedExactSourceImage: true
          });
        }
      } catch {}
    }
    return [...new Map(out.map(x => [x.url, x])).values()].slice(0, 24);
  } catch {
    return [];
  }
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

      let externalStrong = false;
      try {
        const u = new URL(href);
        if (/(^|\.)effectsdatabase\.com$/i.test(u.hostname)) continue;

        // On an exact Effects Database page, marketplace links can be labeled
        // only "eBay"/"Reverb" or contain no useful text at all. Keep those
        // strong external candidates in the shortlist, then perform the real
        // exact-model identity check on the destination page below.
        externalStrong =
          /(^|\.)ebay\.com$/i.test(u.hostname) && /\/itm\//i.test(u.pathname) ||
          /(^|\.)reverb\.com$/i.test(u.hostname) && /\/item\//i.test(u.pathname) ||
          /\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(u.pathname);
      } catch {
        continue;
      }

      const imageHints = [...el.querySelectorAll('img')].flatMap(img => [
        img.alt,
        img.currentSrc,
        img.src,
        img.getAttribute('data-src'),
        img.getAttribute('data-lazy-src'),
        img.getAttribute('data-original')
      ]).filter(Boolean).join(' ');

      const text = norm(
        (el.textContent || '') + ' ' +
        (el.getAttribute('title') || '') + ' ' +
        (el.getAttribute('aria-label') || '') + ' ' +
        href + ' ' + imageHints
      );
      const pedalHits = pedalTokens.filter(token => text.includes(token)).length;
      const builderHits = builderTokens.filter(token => text.includes(token)).length;
      if (!pedalHits && !builderHits && !externalStrong) continue;
      out.push({
        href: href.split('#')[0],
        score: pedalHits * 20 + builderHits * 8 + (externalStrong ? 3 : 0)
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

  // One exact query is enough for a distinctive model name. Repeating four
  // near-identical searches was multiplying runtime without materially improving
  // identity coverage.
  const queries = [entry.company + ' "' + entry.pedal + '" guitar pedal'];

  const merged = new Map();

  function decodeHtml(value) {
    return String(value || '')
      .replace(/&quot;/gi, '"')
      .replace(/&#34;/gi, '"')
      .replace(/&#x22;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/&#39;/gi, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>');
  }

  function parseImageSearchMetadata(rawHtml, searchUrl) {
    const out = [];
    const seen = new Set();
    if (!rawHtml) return out;

    const add = raw => {
      const decoded = decodeHtml(raw);
      let meta = null;
      try {
        meta = JSON.parse(decoded);
      } catch {
        try {
          meta = JSON.parse(decoded.replace(/\\/g, '\\'));
        } catch {}
      }
      if (!meta?.murl || seen.has(meta.murl)) return;
      seen.add(meta.murl);
      const context = [
        meta.t || '',
        meta.desc || '',
        meta.s || '',
        meta.source || '',
        meta.purl || ''
      ].join(' ').replace(/\s+/g, ' ').trim();
      out.push({
        murl: meta.murl,
        purl: meta.purl || '',
        title: meta.t || '',
        context,
        searchUrl
      });
    };

    for (const match of rawHtml.matchAll(/<(?:a|div)[^>]+(?:\bclass|\bdata-class)=["'][^"']*\biusc\b[^"']*["'][^>]+\b(?:m|data-m)=["']([^"']+)["'][^>]*>/gi)) {
      add(match[1]);
    }
    for (const match of rawHtml.matchAll(/<(?:a|div)[^>]+\b(?:m|data-m)=["']([^"']+)["'][^>]+(?:\bclass|\bdata-class)=["'][^"']*\biusc\b[^"']*["'][^>]*>/gi)) {
      add(match[1]);
    }

    // Bing occasionally embeds its image metadata as standalone JSON rather
    // than on an iusc element. Recover those exact murl/purl pairs too.
    for (const match of rawHtml.matchAll(/"murl":"([^"]+)"/gi)) {
      const start = Math.max(0, match.index - 1800);
      const end = Math.min(rawHtml.length, match.index + 2600);
      const chunk = rawHtml.slice(start, end);
      const purlMatch = chunk.match(/"purl":"([^"]+)"/i);
      const titleMatch = chunk.match(/"t":"([^"]{0,400})"/i);
      add(JSON.stringify({
        murl: match[1],
        purl: purlMatch?.[1] || '',
        t: titleMatch?.[1] || '',
        s: purlMatch?.[1] || ''
      }));
    }

    return out;
  }

  for (const query of queries) {
    const searchUrl = 'https://www.bing.com/images/search?form=HDRSC2&q=' + encodeURIComponent(query);
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
      await page.waitForTimeout(200);

      let results = await page.evaluate(() => {
        const out = [];
        const nodes = document.querySelectorAll('a.iusc, [data-m][class*="iusc"], [data-m]');
        for (const el of nodes) {
          const raw = el.getAttribute('m') || el.getAttribute('data-m');
          if (!raw) continue;
          try {
            const m = JSON.parse(raw);
            if (m.murl) {
              const context = [
                m.t || '',
                m.desc || '',
                m.s || '',
                m.source || '',
                el.textContent || '',
                el.getAttribute('aria-label') || '',
                el.getAttribute('title') || '',
                el.querySelector('img')?.getAttribute('alt') || '',
                el.querySelector('img')?.getAttribute('title') || ''
              ].join(' ').replace(/\s+/g, ' ').trim();
              out.push({
                murl: m.murl,
                purl: m.purl || '',
                title: m.t || '',
                context,
                searchUrl: location.href
              });
            }
          } catch {}
        }
        return [...new Map(out.map(x => [x.murl, x])).values()];
      });

      // Bing markup changes periodically. If the rendered DOM exposes no
      // image metadata, parse the raw response as a bounded fallback.
      if (!results.length) {
        try {
          const response = await page.request.get(searchUrl, { timeout: SEARCH_TIMEOUT });
          if (response.ok()) {
            const html = await response.text();
            results = parseImageSearchMetadata(html.slice(0, 1200000), searchUrl);
          }
        } catch {}
      }
      if (!results.length && deepReview) {
        try {
          const proc = await execFileAsync('curl', [
            '-L', '--silent', '--show-error', '--compressed',
            '--connect-timeout', '3', '--max-time', '5',
            '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
            '-H', 'Accept-Language: en-US,en;q=0.9',
            String(searchUrl)
          ], { timeout: 6500, maxBuffer: 4 * 1024 * 1024 });
          results = parseImageSearchMetadata(String(proc.stdout || '').slice(0, 1200000), searchUrl);
        } catch {}
      }

      for (const result of results) {
        if (!merged.has(result.murl)) merged.set(result.murl, result);
      }
    } catch {}
  }

  // Google Images is a second broad discovery engine. Its DOM/embedded
  // metadata is less stable than Bing's, so collect only image/source pairs
  // that can be tied back to an external source page. The source page is still
  // checked by the normal identity gate later.
  // Keep Google as a second independent image index, but use one exact
  // builder/model query instead of another multi-query sweep.
  const googleQueries = ['"' + entry.company + '" "' + entry.pedal + '" pedal'];

  for (const query of googleQueries) {
    const searchUrl = 'https://www.google.com/search?udm=2&hl=en&gl=us&q=' + encodeURIComponent(query);
    try {
      await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: SEARCH_TIMEOUT
      });
      await page.waitForTimeout(300);

      let results = await page.evaluate(() => {
        const out = [];
        const push = (murl, purl, title, context) => {
          if (!murl || !/^https?:\/\//i.test(murl)) return;
          if (/^(?:https?:\/\/)?(?:www\.)?(google|gstatic|googleusercontent)\./i.test(murl)) return;
          if (!purl || !/^https?:\/\//i.test(purl)) return;
          out.push({ murl, purl, title: title || '', context: context || '', searchUrl: location.href });
        };

        for (const image of document.querySelectorAll('img')) {
          const anchor = image.closest('a[href]');
          if (!anchor) continue;
          const href = anchor.href || '';

          // Google Images commonly uses /imgres?imgurl=<original>&imgrefurl=<source>.
          // Decode those explicit parameters instead of discarding the google.com
          // wrapper URL.
          try {
            const parsed = new URL(href);
            if (parsed.hostname === 'www.google.com' && parsed.pathname === '/imgres') {
              const murl = parsed.searchParams.get('imgurl') || '';
              const purl = parsed.searchParams.get('imgrefurl') || '';
              const context = [
                image.alt || '',
                image.getAttribute('title') || '',
                anchor.textContent || '',
                anchor.getAttribute('aria-label') || '',
                anchor.getAttribute('title') || '',
                purl
              ].join(' ').replace(/\s+/g, ' ').trim();
              push(murl, purl, image.alt || anchor.getAttribute('title') || '', context);
              continue;
            }
          } catch {}

          // Some layouts expose direct external links rather than /imgres.
          if (!/^https?:\/\//i.test(href)) continue;
          try {
            const host = new URL(href).hostname.toLowerCase();
            if (host === 'www.google.com' || host.endsWith('.google.com') || host.endsWith('.gstatic.com')) continue;
          } catch {}

          const imageAttrs = [
            image.getAttribute('data-iurl') || '',
            image.getAttribute('data-src') || '',
            image.getAttribute('data-original') || '',
            image.getAttribute('data-image-url') || '',
            image.currentSrc || '',
            image.src || ''
          ].filter(Boolean);

          const murl = imageAttrs.find(value => /^https?:\/\//i.test(value) &&
            !/(encrypted-tbn|gstatic|googleusercontent)/i.test(value)) ||
            imageAttrs.find(value => /^https?:\/\//i.test(value)) || '';

          const context = [
            image.alt || '',
            image.getAttribute('title') || '',
            anchor.textContent || '',
            anchor.getAttribute('aria-label') || '',
            anchor.getAttribute('title') || '',
            href
          ].join(' ').replace(/\s+/g, ' ').trim();

          push(murl, href, image.alt || anchor.getAttribute('title') || '', context);
        }

        return [...new Map(out.map(x => [x.murl + '\u0000' + x.purl, x])).values()];
      });

      // Older Google Images pages embed original/source URLs in script data.
      // Harvest only explicit ou/ru pairs, keeping provenance attached to the
      // same result object instead of guessing across unrelated page elements.
      if (!results.length) {
        try {
          const html = (await page.content()).replace(/\\\//g, '/');
          const embedded = [];
          const seen = new Set();
          const re = /"ou":"(https?:\/\/[^"]+)".{0,1200}?"ru":"(https?:\/\/[^"]+)"/g;
          for (const match of html.matchAll(re)) {
            const murl = decodeURIComponent(match[1]).replace(/\\u0026/g, '&');
            const purl = decodeURIComponent(match[2]).replace(/\\u0026/g, '&');
            const key = murl + '\u0000' + purl;
            if (seen.has(key)) continue;
            seen.add(key);
            embedded.push({
              murl,
              purl,
              title: '',
              context: purl,
              searchUrl
            });
          }
          results = embedded;
        } catch {}
      }

      for (const result of results) {
        if (!merged.has(result.murl)) merged.set(result.murl, result);
      }
    } catch {}
  }

  const finalResults = [...merged.values()];
  if (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass' && finalResults.length) {
    console.log('CAT Sound image-search raw results: ' + finalResults.slice(0, 30).map(x =>
      JSON.stringify({title:x.title||'',purl:x.purl||'',murl:x.murl||''})
    ).join(' | '));
  }
  return finalResults;
}

async function effectsDatabaseFeedImageUrls(page, pageUrl) {
  try {
    const feedLinks = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a[href]')) {
        const href = el.href || '';
        if (!/https?:\/\/[^/]*effectsdatabase\.com\/feed\/model\//i.test(href)) continue;
        out.push(href.split('#')[0]);
      }
      return [...new Set(out)];
    });

    // Older Effects Database model pages do not always expose their legacy
    // image-feed link in the DOM. Derive the exact feed endpoint from the
    // curated /model/... page path so the recovery engine can still reach the
    // model's own image records without guessing across other products.
    try {
      const parsed = new URL(pageUrl);
      if (/([.]|^)effectsdatabase[.]com$/i.test(parsed.hostname) && /^\/model\//i.test(parsed.pathname)) {
        const suffix = parsed.pathname.slice('/model/'.length).replace(/\/+$/, '');
        feedLinks.push(
          parsed.origin + '/feed/model/' + suffix,
          parsed.origin + '/feed/model/' + suffix + '/us/go',
          parsed.origin + '/feed/model/' + suffix + '/us/world/go'
        );
      }
    } catch {}

    const feedUrls = [...new Set(feedLinks)].slice(0, 3);
    const urls = new Set();

    // Effects Database keeps a legacy per-model image archive. When the feed
    // endpoint is blocked, probe only deterministic same-model assets derived
    // from the already identity-verified /model/... path.
    try {
      const parsed = new URL(pageUrl);
      if (/([.]|^)effectsdatabase[.]com$/i.test(parsed.hostname) && /^\/model\//i.test(parsed.pathname)) {
        const suffix = parsed.pathname.slice('/model/'.length).replace(/\/+$/, '');
        const legacySlug = suffix.replace(/\//g, '_').replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '');
        if (legacySlug) {
          const stems = [legacySlug, legacySlug + '_001', legacySlug + '_01', legacySlug + '_1'];
          for (const stem of stems) {
            urls.add('https://files.effectsdatabase.com/gear/pics/' + stem + '.jpg');
            urls.add('https://files.effectsdatabase.com/gear/thumbs/' + stem + '.jpg');
            urls.add('https://files.effectsdatabase.com/gear/pics/' + stem + '.png');
            urls.add('https://files.effectsdatabase.com/gear/thumbs/' + stem + '.png');
          }
        }
      }
    } catch {}
    const addUrl = value => {
      if (!value || typeof value !== 'string' || value.startsWith('data:')) return;
      try {
        const absolute = /^https?:\/\//i.test(value) ? value : new URL(value, pageUrl).href;
        if (!/^https?:\/\//i.test(absolute)) return;
        if (/(logo|avatar|icon|sprite|favicon|badge|payment|social)/i.test(absolute)) return;
        if (/\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(absolute) || /effectsdatabase\.com/i.test(new URL(absolute).hostname)) {
          urls.add(absolute);
        }
      } catch {}
    };

    for (const feedUrl of feedUrls) {
      try {
        let body = '';
        try {
          const response = await page.request.get(feedUrl, { timeout: PAGE_TIMEOUT });
          if (response.ok()) body = await response.text();
        } catch {}

        // The legacy feed is sometimes blocked to Playwright's request context
        // even while the exact model page can fetch it same-origin in Chromium.
        // Retry inside the already-open browser page so cookies/referrer/session
        // state are preserved.
        if (!body) {
          try {
            const result = await page.evaluate(async url => {
              try {
                const response = await fetch(url, { credentials: 'same-origin' });
                return { ok: response.ok, body: await response.text() };
              } catch {
                return { ok: false, body: '' };
              }
            }, feedUrl);
            if (result?.ok) body = result.body || '';
          } catch {}
        }

        // Some routed Effects Database feeds only materialize their auction/image
        // content when Chromium navigates to the feed URL. Use a short-lived page
        // in the same browser context so this fallback cannot disturb the verified
        // source page that owns the feed. The feed URL is derived directly from
        // that exact model page, so it remains inside the same-model provenance
        // chain rather than becoming a generic web search.
        if (!body) {
          let feedPage = null;
          try {
            feedPage = await page.context().newPage({ viewport: { width: 1440, height: 1000 } });
            const feedNetworkImages = [];
            feedPage.on('response', response => {
              try {
                const type = (response.headers()['content-type'] || '').toLowerCase();
                if (type.startsWith('image/')) feedNetworkImages.push(response.url());
              } catch {}
            });
            await feedPage.goto(feedUrl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
            await feedPage.waitForTimeout(700);
            for (let i = 0; i < 4; i++) {
              const height = await feedPage.evaluate(() => document.body?.scrollHeight || 0).catch(() => 0);
              await feedPage.evaluate((height) => {
                window.scrollTo(0, Math.min(height, window.innerHeight * 2));
                for (const img of document.images || []) img.loading = 'eager';
              }, height).catch(() => {});
              await feedPage.waitForTimeout(180);
            }
            const renderedFeedImages = await feedPage.evaluate(() => {
              const out = new Set();
              const add = value => {
                if (!value || typeof value !== 'string') return;
                for (const part of value.split(/\s+/)) {
                  if (!part || part.startsWith('data:')) continue;
                  try {
                    const url = /^https?:\/\//i.test(part) ? part : new URL(part, location.href).href;
                    if (!/^https?:\/\//i.test(url)) continue;
                    if (/(logo|avatar|icon|sprite|favicon|badge|payment|social|tracking|pixel)/i.test(url)) continue;
                    out.add(url);
                  } catch {}
                }
              };
              for (const img of document.querySelectorAll('img, source')) {
                add(img.currentSrc || '');
                add(img.src || '');
                add(img.getAttribute('data-src') || '');
                add(img.getAttribute('data-original') || '');
                add(img.getAttribute('data-lazy-src') || '');
                add(img.getAttribute('srcset') || '');
                add(img.getAttribute('data-srcset') || '');
              }
              for (const node of document.querySelectorAll('[style*="background-image"], [data-background], [data-bg], [data-background-image]')) {
                const raw = [
                  getComputedStyle(node).backgroundImage || '',
                  node.getAttribute('data-background') || '',
                  node.getAttribute('data-bg') || '',
                  node.getAttribute('data-background-image') || ''
                ].join(' ');
                for (const match of raw.matchAll(/url\\((?:"|')?([^"')]+)(?:"|')?\\)/gi)) add(match[1]);
              }
              return [...out];
            }).catch(() => []);
            for (const url of renderedFeedImages) addUrl(url);
            for (const url of feedNetworkImages) addUrl(url);
            body = await feedPage.content().catch(() => '');
            if (!body) body = await feedPage.locator('body').textContent().catch(() => '') || '';
          } catch {} finally {
            await feedPage?.close().catch(() => {});
          }
        }

        if (!body) continue;

        for (const match of body.matchAll(/<(?:img|source)\b[^>]*(?:src|data-src|data-original|data-lazy-src|srcset)=["']([^"']+)["'][^>]*>/gi)) {
          for (const part of match[1].split(/\s+/)) addUrl(part);
        }
        for (const match of body.matchAll(/(?:https?:)?\/\/[^"'\s<>]+\.(?:jpe?g|png|webp|gif)(?:[?#][^"'\s<>]*)?/gi)) {
          addUrl(match[0]);
        }
        for (const match of body.matchAll(/(?:https?:)?\/\/[^"'\s<>]+\/gear\/pics\/[^"'\s<>]+/gi)) {
          addUrl(match[0]);
        }
        for (const match of body.matchAll(/["'](?:image|imageUrl|image_url|contentUrl|thumbnailUrl)["']\s*:\s*["']([^"']+)["']/gi)) {
          addUrl(match[1]);
        }
      } catch {}
    }

    return [...urls].slice(0, 48);
  } catch {
    return [];
  }
}

function rawVerifiedPageImageUrls(html, pageUrl) {
  const out = new Set();
  if (!html) return [];
  // Decode the escaped URL forms used by marketplace JSON payloads before
  // extracting image hosts. Reverb commonly emits \\/ or \\u002F inside
  // serialized gallery data while still exposing the exact image URL.
  html = String(html)
    .replace(/\\u002f/gi, '/')
    .replace(/\\\//g, '/');
  const add = value => {
    if (!value || typeof value !== 'string') return;
    for (const part of value.split(/[\s,]+/)) {
      const raw = part.replace(/&amp;/g, '&').replace(/^["']|["']$/g, '');
      if (!raw || raw.startsWith('data:')) continue;
      try {
        const url = /^https?:/i.test(raw) ? raw : new URL(raw, pageUrl).href;
        if (!/^https?:/i.test(url)) return;
        if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|tracking|pixel)/i.test(url)) return;
        const pathname = new URL(url).pathname;
        if (/\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(url) || /\/gear\/(?:pics|thumbs)\//i.test(pathname)) out.add(url);
      } catch {}
    }
  };

  for (const pattern of [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi,
    /<img[^>]+(?:src|data-src|data-lazy-src|data-original|data-full-src|data-large-image|data-zoom-image)=["']([^"']+)["']/gi,
    /<source[^>]+(?:src|srcset|data-srcset)=["']([^"']+)["']/gi,
    /<a[^>]+href=["']([^"']+\.(?:jpe?g|png|webp|gif)(?:[?#][^"']*)?)["']/gi
  ]) {
    for (const match of html.matchAll(pattern)) add(match[1]);
  }

  for (const match of html.matchAll(/https?:\/\/[^"'\s<>]+\.(?:jpe?g|png|webp|gif)(?:[?#][^"'\s<>]*)?/gi)) {
    add(match[0]);
  }
  // Effects Database hosts legacy pedal photography without relying on
  // conventional image-file paths being present in the surrounding markup.
  // Harvest its canonical gear/pics and gear/thumbs assets directly.
  for (const match of html.matchAll(/https?:\/\/files\.effectsdatabase\.com\/gear\/(?:pics|thumbs)\/[^"'\s<>]+/gi)) {
    add(match[0]);
  }

  return [...out].slice(0, 24);
}

async function richSourceImageUrls(page, pageUrl) {
  try {
    return await page.evaluate(() => {
      const out = new Set();
      const add = value => {
        if (!value || typeof value !== 'string') return;
        for (const part of value.split(/\s+/)) {
          if (!part || part.startsWith('data:')) continue;
          try {
            const url = /^https?:/i.test(part) ? part : new URL(part, location.href).href;
            if (!/^https?:/i.test(url)) return;
            if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(url)) return;
            out.add(url);
          } catch {}
        }
      };

      for (const img of document.querySelectorAll('img, source')) {
        add(img.currentSrc || '');
        add(img.getAttribute('data-full-src') || '');
        add(img.getAttribute('data-large-image') || '');
        add(img.getAttribute('data-zoom-image') || '');
        add(img.getAttribute('data-original-src') || '');
        add(img.getAttribute('data-image') || '');
        add(img.getAttribute('data-image-url') || '');
        add(img.getAttribute('data-src') || '');
        add(img.getAttribute('data-lazy-src') || '');
        add(img.getAttribute('data-original') || '');
        add(img.getAttribute('srcset') || '');
        add(img.getAttribute('data-srcset') || '');
        add(img.getAttribute('data-lazy-srcset') || '');
      }

      for (const node of document.querySelectorAll('[style*="background-image"], [data-background], [data-bg], [data-background-image]')) {
        const raw = [
          getComputedStyle(node).backgroundImage || '',
          node.getAttribute('data-background') || '',
          node.getAttribute('data-bg') || '',
          node.getAttribute('data-background-image') || ''
        ].join(' ');
        for (const match of raw.matchAll(/url\\((?:"|')?([^"')]+)(?:"|')?\\)/gi)) add(match[1]);
      }

      for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
        const raw = String(script.textContent || '').trim();
        if (!raw) continue;
        let parsed;
        try { parsed = JSON.parse(raw); } catch { continue; }

        const visit = value => {
          if (!value || typeof value !== 'object') return;
          if (Array.isArray(value)) {
            for (const child of value) visit(child);
            return;
          }
          const type = String(value['@type'] || '');
          const context = [
            value.name,
            value.model,
            typeof value.brand === 'string' ? value.brand : value.brand?.name,
            value.description
          ].filter(Boolean).join(' ');
          const rawImages = [];
          const collectImage = image => {
            if (!image) return;
            if (typeof image === 'string') rawImages.push(image);
            else if (Array.isArray(image)) image.forEach(collectImage);
            else if (typeof image === 'object') {
              collectImage(image.url);
              collectImage(image.contentUrl);
              collectImage(image.thumbnailUrl);
            }
          };
          collectImage(value.image);
          collectImage(value.images);

          if (/product/i.test(type) || /pedal|guitar/i.test(context) || rawImages.length === 1) {
            for (const image of rawImages) add(image);
          }

          for (const child of Object.values(value)) {
            if (child && typeof child === 'object') visit(child);
          }
        };
        visit(parsed);
      }

      return [...out];
    });
  } catch {
    return [];
  }
}

async function curlExactSourceCandidates(entry) {
  if (!entry?.company || !entry?.pedal) return [];
  const query = '"' + entry.company + '" "' + entry.pedal + '" pedal';
  const searchUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
  let html = '';
  try {
    const proc = await execFileAsync('curl', [
      '-L', '--silent', '--show-error', '--compressed',
      '--connect-timeout', '3', '--max-time', '6',
      '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
      '-H', 'Accept-Language: en-US,en;q=0.9',
      searchUrl
    ], { timeout: 7500, maxBuffer: 5 * 1024 * 1024 });
    html = String(proc.stdout || '');
  } catch {}
  if (!html) return [];

  const rows = [];
  for (const match of html.matchAll(/<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1].replace(/&amp;/g, '&');
    const title = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/^https?:/i.test(href) || !title) continue;
    rows.push({ url: href.split('#')[0], title });
  }

  const pedalPhrase = normalizedIdentity(entry.pedal);
  const builderPhrase = normalizedIdentity(entry.company);
  return [...new Map(rows.map(row => [row.url, row]))
    .values()]
    .sort((a, b) => {
      const ah = normalizedIdentity(a.title + ' ' + a.url);
      const bh = normalizedIdentity(b.title + ' ' + b.url);
      const as = (pedalPhrase && ah.includes(pedalPhrase) ? 80 : 0) +
        (builderPhrase && ah.includes(builderPhrase) ? 70 : 0) +
        identityTokens(entry.pedal).filter(t => ah.includes(t)).length * 10 +
        identityTokens(entry.company).filter(t => ah.includes(t)).length * 6;
      const bs = (pedalPhrase && bh.includes(pedalPhrase) ? 80 : 0) +
        (builderPhrase && bh.includes(builderPhrase) ? 70 : 0) +
        identityTokens(entry.pedal).filter(t => bh.includes(t)).length * 10 +
        identityTokens(entry.company).filter(t => bh.includes(t)).length * 6;
      return bs - as;
    })
    .slice(0, 6);
}

async function curlExactSourcePageImages(entry, sourceRows) {
  const out = [];
  for (const row of sourceRows) {
    try {
      const proc = await execFileAsync('curl', [
        '-L', '--silent', '--show-error', '--compressed',
        '--connect-timeout', '3', '--max-time', '6',
        '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        String(row.url)
      ], { timeout: 7500, maxBuffer: 5 * 1024 * 1024 });
      const html = String(proc.stdout || '');
      if (!html) continue;

      const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]
        .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]
        .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const body = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 300000);
      if (!pageMatchesIdentity(entry, title + ' ' + body, h1) &&
          !reverbListingMatchesIdentity(entry, row.url, title, h1)) continue;

      const urls = rawVerifiedPageImageUrls(html, row.url);
      for (const url of urls) {
        out.push({
          url,
          sourcePage: row.url,
          sourceScore: 230,
          rawVerifiedPageImage: true
        });
      }
    } catch {}
  }
  return [...new Map(out.map(x => [x.url, x])).values()].slice(0, 24);
}

function deepReviewSourcePageEligible(pageUrl) {
  try {
    const url = new URL(pageUrl);
    return /^https?:$/i.test(url.protocol) &&
      !/(^|\.)bing\.com$/i.test(url.hostname) &&
      !/(^|\.)google\.com$/i.test(url.hostname) &&
      !/(^|\.)html\.duckduckgo\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

async function curlVerifiedSourcePageImages(entry, pageUrl) {
  if (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass') {
    const manufacturerPage = 'https://www.catsound.cn/?p=6';
    try {
      const proc = await execFileAsync('curl', [
        '-L', '--silent', '--show-error', '--compressed',
        '--connect-timeout', '3', '--max-time', '7',
        '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        String(manufacturerPage)
      ], { timeout: 8500, maxBuffer: 6 * 1024 * 1024 });
      const manufacturerHtml = String(proc.stdout || '');
      if (manufacturerHtml) {
        const refs = manufacturerHtml.split(/\\r?\\n/)
          .filter(line => /drivecenter|bass|gear|product|image|jpg|jpeg|png|webp/i.test(line))
          .slice(0, 120)
          .join(' ')
          .slice(0, 30000);
        console.log('CAT Sound manufacturer raw references: ' + refs);
      } else {
        console.log('CAT Sound manufacturer raw references: EMPTY');
      }
    } catch (err) {
      console.log('CAT Sound manufacturer raw fetch failed: ' + String(err?.message || err));
    }
  }

  // CAT Sound's archived Effects Database page has historically exposed
  // different legacy image/link forms. Preserve a diagnostic snapshot of the
  // exact raw source markup for this one remaining holdout so recovery can use
  // real current references instead of filename guesses.

  if (!deepReviewSourcePageEligible(pageUrl)) return [];
  let html = '';
  try {
    const proc = await execFileAsync('curl', [
      '-L', '--silent', '--show-error', '--compressed',
      '--connect-timeout', '3', '--max-time', '6',
      '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
      '-H', 'Accept-Language: en-US,en;q=0.9',
      String(pageUrl)
    ], { timeout: 7500, maxBuffer: 6 * 1024 * 1024 });
    html = String(proc.stdout || '');
  } catch {}
  if (!html) return [];

  if (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass') {
    try {
      const needles = html.split(/\\r?\\n/).filter(line =>
        /drivecenter|gear\/pics|gear\/thumbs|reverb|ebay|image|photo/i.test(line)
      ).slice(0, 80);
      console.log('CAT Sound raw source references: ' + needles.join(' ').slice(0, 30000));
    } catch {}
  }

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 300000);

  if (!pageMatchesIdentity(entry, title + ' ' + body, h1) &&
      !reverbListingMatchesIdentity(entry, pageUrl, title, h1)) return [];

  const imageUrls = rawVerifiedPageImageUrls(html, pageUrl);
  return imageUrls.map(url => ({
    url,
    sourcePage: pageUrl,
    sourceScore: 165,
    rawVerifiedPageImage: true
  }));
}

async function recoverEntry(browser, entry, deepReview = false, recoveryDeadlineMs = RECOVERY_DEADLINE_MS) {
  const diagnostic = {
    sourceHost: null,
    sourcePageLoaded: false,
    sourceIdentityMatch: false,
    sourceImageCandidates: 0,
    linkedExternalCandidates: 0,
    sourceScreenshotCaptured: false,
    makerFallbackTried: false,
    soldCandidates: 0,
    verifiedSoldCandidates: 0,
    imageSearchCandidates: 0,
    verifiedSearchCandidates: 0,
    rawHtmlCandidates: 0
  };
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    locale: 'en-US',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
  });
  await page.addInitScript(() => {
    try {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    } catch {}
  });
  const networkImageUrls = [];
  const networkImageBodies = new Map();
  const MAX_NETWORK_IMAGE_BODIES = 40;
  const onResponse = response => {
    try {
      const type = (response.headers()['content-type'] || '').toLowerCase();
      if (!type.startsWith('image/')) return;
      const url = response.url().split('#')[0];
      networkImageUrls.push(url);
      if (networkImageBodies.size >= MAX_NETWORK_IMAGE_BODIES || networkImageBodies.has(url)) return;
      networkImageBodies.set(url, {
        type,
        promise: response.body().catch(() => null)
      });
    } catch {}
  };
  page.on('response', onResponse);
  const deadline = setTimeout(() => {
    // A single stubborn source must not occupy a browser worker indefinitely.
    page.close().catch(() => {});
  }, recoveryDeadlineMs);
  try {
    const candidates = [];
    const pageUrl = preferredSourcePage(entry);
    await writeCatSourceProbe(entry, preferredSourcePages(entry));
    const deepSearchTokens = identityTokens(entry.pedal);
    const genericPedalOnly = deepSearchTokens.length === 0;
    // Keep exact source pages and image search in the same recovery pass. A
    // search engine can be empty or rate-limited while the known product page
    // still contains the exact photo, so neither route is exclusive.
    const imageSearchFirst = false;

    // A curated/explicit image source page is already a stronger lead than a
    // fresh maker-search query, so give that page the first chance to resolve.
    let sourcePageUsed = null;
    const pageUrls = preferredSourcePages(entry);

    // A curated/explicit source page is already a stronger lead than a fresh
    // maker-search query. Try every curated page in bounded order rather than
    // allowing one blocked/stale host to become a dead end.
    const hasExplicitSourcePage = Boolean(entry.image_source_page || (Array.isArray(entry.image_source_pages) && entry.image_source_pages.length));
    if ((!pageUrls.length || !hostMatchesBuilder(pageUrls[0], entry.company)) && !hasExplicitSourcePage) {
      const makerCandidates = await makerWebCandidates(page, entry);
      candidates.push(...makerCandidates);
    }

    const directImageUrls = Array.isArray(entry.image_source_urls) && entry.image_source_urls.length
      ? entry.image_source_urls.filter(value => /^https?:/i.test(String(value || "")))
      : (entry.image_source_url && /^https?:/i.test(entry.image_source_url) ? [entry.image_source_url] : []);
    for (const imageUrl of [...new Set(directImageUrls)].slice(0, 3)) {
      candidates.push({
        url: imageUrl,
        sourcePage: entry.image_source_page || entry.source_page || null,
        sourceScore: 1400,
        directImageOverride: true
      });
    }

    // Exact curated direct-image URLs are the strongest possible photo lead.
    // Try them before spending time loading/searching the source page. This makes
    // hard-case recovery cheap when the source CDN itself is the only obstacle.
    let selectedResult = await tryImages(
      candidates.filter(candidate => candidate.directImageOverride)
    );
    if (!selectedResult) {
      for (const candidate of candidates.filter(candidate => candidate.directImageOverride).slice(0, 3)) {
        const shot = await screenshotDirectImageCandidate(candidate);
        if (shot) {
          selectedResult = { candidate, bytes: shot.bytes };
          diagnostic.sourceScreenshotCaptured = true;
          break;
        }
      }
    }

    if (!selectedResult) {
      for (const pageUrl of pageUrls) {
      if (!pageUrl || !/^https?:/i.test(pageUrl)) continue;
      try {
        // Effects Database model URLs are exact catalog identities even when the
        // page itself is blocked to Chromium. Query the deterministic per-model
        // feed first so the record can recover its own image without depending on
        // successful page navigation.
        if (/([.]|^)effectsdatabase[.]com$/i.test(new URL(pageUrl).hostname)) {
          try {
            const feedImages = await effectsDatabaseFeedImageUrls(page, pageUrl);
            for (const url of feedImages) {
              candidates.push({
                url,
                sourcePage: pageUrl,
                sourceScore: 145,
                rawVerifiedPageImage: true
              });
            }
            diagnostic.rawHtmlCandidates += feedImages.length;
            if (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass' && feedImages.length) {
              console.log('CAT Sound exact raw image candidates: ' + feedImages.slice(0, 24).join(' | '));
            }
            const feedResult = await tryImages(feedImages.map(url => ({
              url,
              sourcePage: pageUrl,
              sourceScore: 145,
              rawVerifiedPageImage: true
            })));
            if (feedResult) {
              selectedResult = feedResult;
              sourcePageUsed = pageUrl;
              diagnostic.sourcePageLoaded = true;
              diagnostic.sourceIdentityMatch = true;
              break;
            }
          } catch {}
        }

        // Keep rendered-network candidates scoped to the source page that
        // produced them. This prevents an image from a previous fallback page
        // from being mislabeled as evidence for the next page.
        networkImageUrls.length = 0;
        diagnostic.sourceHost = diagnostic.sourceHost || new URL(pageUrl).hostname;
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
        diagnostic.sourcePageLoaded = true;
        const title = await page.title().catch(() => '');
        const h1 = await page.locator('h1').first().textContent().catch(() => '');
        const body = await page.locator('body').textContent().catch(() => '');

        const pageIdentityMatch =
          entry.image_source_pages_verified === true ||
          entry.image_source_page_verified === true ||
          pageMatchesIdentity(entry, title + ' ' + body, h1) ||
          reverbListingMatchesIdentity(entry, pageUrl, title, h1);
        if (!pageIdentityMatch) continue;

        diagnostic.sourceIdentityMatch = true;
        sourcePageUsed = sourcePageUsed || pageUrl;

        if ((entry.company === 'C14 Devices' && entry.pedal === 'Tone Chaser') ||
            (entry.company === 'Cameltone Electronics' && entry.pedal === 'Big Stuff') ||
            (entry.company === 'CAT Sound' && entry.pedal === 'DriveCenter Bass')) {
          try {
            const domDiag = await page.evaluate(() => ({
              imgCount: document.images.length,
              imgs: [...document.images].slice(0, 18).map(img => ({
                alt: img.alt || '', src: img.currentSrc || img.src || '',
                w: Number(img.naturalWidth) || 0, h: Number(img.naturalHeight) || 0
              })),
              imageAnchors: [...document.querySelectorAll('a[href]')].filter(a => a.querySelector('img')).slice(0, 18).map(a => ({
                href: a.href || '', alt: a.querySelector('img')?.alt || '',
                src: a.querySelector('img')?.currentSrc || a.querySelector('img')?.src || ''
              }))
            }));
            console.log(entry.company + ' / ' + entry.pedal + ' DOM image diagnostic ' + JSON.stringify(domDiag));
          } catch {}
        }

        // Reverb galleries often lazy-load the primary product image just below
        // the heading. Trigger one small viewport move before harvesting browser
        // response bytes, avoiding the much slower screenshot/search fallback.
        if (isReverbListingUrl(pageUrl)) {
          await page.mouse.wheel(0, 950).catch(() => {});
          await page.waitForTimeout(350).catch(() => {});
          await page.mouse.wheel(0, -950).catch(() => {});
          await page.waitForTimeout(120).catch(() => {});
        }

        // The live page has now passed exact builder/model identity verification.
        // Harvest its raw document media regardless of whether the source was
        // pre-flagged as verified. This catches relative WordPress uploads,
        // marketplace CDN links, and older archive media that vanish from the
        // hydrated DOM.
        try {
          const rawResponse = await page.request.get(pageUrl, { timeout: PAGE_TIMEOUT });
          if (rawResponse.ok()) {
            const rawHtml = await rawResponse.text();
            const rawUrls = rawVerifiedPageImageUrls(rawHtml, pageUrl);
            for (const url of rawUrls) {
              candidates.push({
                url,
                sourcePage: pageUrl,
                sourceScore: 118,
                rawVerifiedPageImage: true
              });
            }
            diagnostic.rawHtmlCandidates += rawUrls.length;
          }
        } catch {}

        if (/([.]|^)effectsdatabase[.]com$/i.test(new URL(pageUrl).hostname)) {
          await page.waitForTimeout(1400);
        }

        for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
          const value = await page.locator(selector).getAttribute('content').catch(() => null);
          if (value) {
            candidates.push({
              url: new URL(value, pageUrl).href,
              sourcePage: pageUrl,
              sourceScore: 120,
              metaImage: true
            });
          }
        }

        if (!candidates.some(x => x.sourcePage === pageUrl && x.sourceScore >= 120)) {
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
        const richImageData = await richSourceImageUrls(page, pageUrl);
        const legacyFeedImages = /([.]|^)effectsdatabase[.]com$/i.test(new URL(pageUrl).hostname)
          ? await effectsDatabaseFeedImageUrls(page, pageUrl)
          : [];

        const legacyFeedSet = new Set(legacyFeedImages);
        for (const raw of [...imageData, ...richImageData, ...legacyFeedImages]) {
          for (const part of String(raw).split(/\s+/)) {
            if (/^https?:/i.test(part)) {
              const legacyExactImage =
                legacyFeedSet.has(part) &&
                /([.]|^)effectsdatabase[.]com$/i.test(new URL(part).hostname) &&
                /\/gear\/(?:pics|thumbs)\//i.test(new URL(part).pathname);
              if (!isLikelyExactProductSourcePage(pageUrl) && !identityPhrases(entry.pedal).some(phrase => normalizedIdentity(part).includes(phrase))) continue;
              candidates.push({
                url: part,
                sourcePage: pageUrl,
                sourceScore: legacyExactImage ? 125 : 90,
                rawVerifiedPageImage: legacyExactImage,
                articleExactImage: !isLikelyExactProductSourcePage(pageUrl)
              });
            } else if (part && !part.includes('x') && !part.startsWith('data:')) {
              try {
                const absolute = new URL(part, pageUrl).href;
                const legacyExactImage =
                  legacyFeedSet.has(part) &&
                  /([.]|^)effectsdatabase[.]com$/i.test(new URL(absolute).hostname) &&
                  /\/gear\/(?:pics|thumbs)\//i.test(new URL(absolute).pathname);
                candidates.push({
                  url: absolute,
                  sourcePage: pageUrl,
                  sourceScore: legacyExactImage ? 125 : 90,
                  rawVerifiedPageImage: legacyExactImage
                });
              } catch {}
            }
          }
        }

        // The response listener already filtered these URLs by image MIME type.
        // Do not require a filename extension here: CDN/image proxy URLs commonly
        // omit .jpg/.png/.webp while still returning a real image.
        if (isLikelyExactProductSourcePage(pageUrl)) {
          for (const url of [...new Set(networkImageUrls)]) {
            candidates.push({ url, sourcePage: pageUrl, sourceScore: 110 });
          }
        }

        diagnostic.sourceImageCandidates += candidates.filter(x => x.sourcePage === pageUrl).length;

        // Some verified product pages render an anti-bot shell or an image-empty
        // DOM even though the same exact page still exposes current product image
        // URLs in its raw HTML response. On deep-review holdouts, fetch that exact
        // page once and harvest only its own image URLs.
        if (deepReview && candidates.filter(x => x.sourcePage === pageUrl).length === 0) {
          try {
            const rawResponse = await page.request.get(pageUrl, { timeout: PAGE_TIMEOUT });
            const rawType = (rawResponse.headers()['content-type'] || '').toLowerCase();
            if (rawResponse.ok() && (!rawType || rawType.includes('text/html'))) {
              const rawHtml = await rawResponse.text();
              const rawUrls = rawVerifiedPageImageUrls(rawHtml, pageUrl);
              if (entry.company === 'C14 Devices' || entry.company === 'Cameltone Electronics' || entry.company === 'CAT Sound') {
                console.log(entry.company + ' / ' + entry.pedal + ' raw HTML image candidates: ' + rawUrls.slice(0, 24).join(' | '));
              }
              for (const url of rawUrls) {
                candidates.push({
                  url,
                  sourcePage: pageUrl,
                  sourceScore: 155,
                  rawVerifiedPageImage: true
                });
              }
              diagnostic.rawHtmlCandidates += rawUrls.length;
              diagnostic.sourceImageCandidates += rawUrls.length;
            }
          } catch {}
        }

        // Fast path: many protected CDNs successfully deliver the exact image
        // to Chromium even though a separate HTTP request gets 401/403/500.
        // Save the browser's original response bytes before attempting any
        // screenshot-based fallback.
        const browserDownloaded = await networkImageCandidate(
          candidates.filter(candidate => candidate.sourcePage === pageUrl)
        );
        if (browserDownloaded) {
          selectedResult = browserDownloaded;
          sourcePageUsed = pageUrl;
          break;
        }

        if (/([.]|^)effectsdatabase[.]com$/i.test(new URL(pageUrl).hostname) && deepReview) {
          const linked = await linkedExactSourceCandidates(page, entry, pageUrl, true);
          diagnostic.linkedExternalCandidates += linked.length;
          candidates.push(...linked);
        } else if (!candidates.some(x => x.sourcePage === pageUrl && x.sourceScore >= 120)) {
          const linked = await linkedExactSourceCandidates(page, entry, pageUrl, deepReview);
          diagnostic.linkedExternalCandidates += linked.length;
          candidates.push(...linked);
        }
      } catch {
        // Some source sites reject Chromium navigation while still serving the
        // document to a normal HTTP client. Retry the exact curated page through
        // Playwright's request context so a navigation block does not erase a
        // potentially usable og:image/img/srcset lead.
        try {
          const response = await page.request.get(pageUrl, { timeout: PAGE_TIMEOUT });
          const type = (response.headers()['content-type'] || '').toLowerCase();
          if (response.ok() && (!type || type.includes('text/html'))) {
            const html = await response.text();
            const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]
              .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]
              .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const body = html
              .replace(/<script[\s\S]*?<\/script>/gi, ' ')
              .replace(/<style[\s\S]*?<\/style>/gi, ' ')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .slice(0, 300000);
            const identityMatch =
              entry.image_source_pages_verified === true ||
              entry.image_source_page_verified === true ||
              pageMatchesIdentity(entry, title + ' ' + body, h1) ||
              reverbListingMatchesIdentity(entry, pageUrl, title, h1);
            if (identityMatch) {
              diagnostic.sourcePageLoaded = true;
              diagnostic.sourceIdentityMatch = true;
              sourcePageUsed = sourcePageUsed || pageUrl;

              // Effects Database model pages can reject Chromium navigation
              // while their deterministic per-model feed still exposes the exact
              // pedal photography. Harvest that feed directly from the curated
              // model URL instead of abandoning the record.
              if (/([.]|^)effectsdatabase[.]com$/i.test(new URL(pageUrl).hostname)) {
                try {
                  const feedImages = await effectsDatabaseFeedImageUrls(page, pageUrl);
                  for (const url of feedImages) {
                    candidates.push({
                      url,
                      sourcePage: pageUrl,
                      sourceScore: 135,
                      rawVerifiedPageImage: true
                    });
                  }
                  diagnostic.rawHtmlCandidates += feedImages.length;
                } catch {}
              }

              const imageAttrs = [];
              for (const match of html.matchAll(/<(?:img|source)\b[^>]*(?:src|data-src|data-lazy-src|data-original|srcset)=["']([^"']+)["'][^>]*>/gi)) {
                imageAttrs.push(match[1]);
              }
              for (const match of html.matchAll(/<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=["']([^"']+)["'][^>]*>/gi)) {
                imageAttrs.push(match[1]);
              }

              // Navigation can fail on otherwise healthy Effects Database pages
              // because Chromium is challenged or the page times out. The raw
              // HTML response can still contain the exact product-photo anchor,
              // legacy /gear/pics/ asset, or lazy image field. Use the same strict
              // source-page extraction used by the normal path instead of throwing
              // away that exact-page evidence just because DOM navigation failed.
              for (const url of rawVerifiedPageImageUrls(html, pageUrl)) {
                candidates.push({
                  url,
                  sourcePage: pageUrl,
                  sourceScore: 135,
                  rawVerifiedPageImage: true
                });
              }
              diagnostic.rawHtmlCandidates += rawVerifiedPageImageUrls(html, pageUrl).length;

              if (/(^|\\.)effectsdatabase\\.com$/i.test(new URL(pageUrl).hostname)) {
                try {
                  const externalImages = await rawVerifiedExternalSourceImages(page, entry, pageUrl);
                  diagnostic.linkedExternalCandidates += externalImages.length;
                  for (const candidate of externalImages) candidates.push(candidate);
                } catch {}
              }

              for (const raw of imageAttrs) {
                for (const part of raw.split(/\s+/)) {
                  if (!part || part.startsWith('data:')) continue;
                  try {
                    const url = /^https?:/i.test(part) ? part : new URL(part, pageUrl).href;
                    if (/^https?:/i.test(url)) {
                      candidates.push({ url, sourcePage: pageUrl, sourceScore: 105 });
                    }
                  } catch {}
                }
              }
            }
          }
        } catch {}
        }

        if (!selectedResult && deepReview) {
          try {
            const curlImages = await curlVerifiedSourcePageImages(entry, pageUrl);
            diagnostic.rawHtmlCandidates += curlImages.length;
            if (curlImages.length && (entry.company === 'CAT Sound' || entry.company === 'C14 Devices')) {
              console.log(entry.company + ' / ' + entry.pedal + ' curl-verified source images: ' + curlImages.map(x => x.url).join(' | '));
            }
            candidates.push(...curlImages);
            selectedResult = await tryImages(curlImages);
            if (!selectedResult) {
              for (const candidate of curlImages.slice(0, 8)) {
                const proxy = await proxyImageCandidate(candidate);
                if (proxy?.bytes) {
                  selectedResult = { candidate, bytes: proxy.bytes };
                  break;
                }
              }
            }
          } catch {}
        }
      }
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

    async function curlImageCandidate(candidate) {
      if (!candidate?.url || !/^https?:/i.test(String(candidate.url))) return null;
      let tempDir = null;
      try {
        const cookies = await page.context().cookies(
          [candidate.sourcePage, candidate.url].filter(Boolean)
        );
        const cookieHeader = cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ');
        tempDir = fs.mkdtempSync('/tmp/dirt-archive-photo-');
        const output = path.join(tempDir, 'image.bin');
        const args = [
          '-L',
          '--fail',
          '--silent',
          '--show-error',
          '--compressed',
          '--connect-timeout', '3',
          '--max-time', '5',
          '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          '-H', 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        ];
        if (candidate.sourcePage) {
          args.push('-e', String(candidate.sourcePage));
        }
        if (cookieHeader) {
          args.push('-H', 'Cookie: ' + cookieHeader);
        }
        args.push('-o', output, String(candidate.url));

        await execFileAsync('curl', args, {
          timeout: 6500,
          maxBuffer: 1024 * 1024
        });
        if (!fs.existsSync(output)) return null;
        const bytes = fs.readFileSync(output);
        if (!imageBytesLookComplete(bytes)) return null;
        return { bytes, src: candidate.url };
      } catch {
        return null;
      } finally {
        if (tempDir) {
          try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
        }
      }
    }

    async function proxyImageCandidate(candidate) {
      if (!candidate?.url || !/^https?:/i.test(String(candidate.url))) return null;
      const source = String(candidate.url);
      let host = '';
      try { host = new URL(source).hostname.toLowerCase(); } catch {}
      if (!/(^|\.)reverb\.com$/i.test(host) && !/(^|\.)rvb-img\.reverb\.com$/i.test(host) &&
          !/(^|\.)static\.reverb-assets\.com$/i.test(host) &&
          !/(^|\.)effectsdatabase\.com$/i.test(host)) return null;

      const proxyUrls = [
        'https://external-content.duckduckgo.com/iu/?u=' + encodeURIComponent(source) + '&f=1&nofb=1',
        'https://wsrv.nl/?url=' + encodeURIComponent(source),
        'https://wsrv.nl/?url=' + source,
        'https://images.weserv.nl/?url=' + encodeURIComponent(source),
        'https://images.weserv.nl/?url=' + source
      ];
      for (const proxyUrl of proxyUrls) {
        try {
          const response = await page.request.get(proxyUrl, { timeout: Math.min(IMAGE_TIMEOUT + 1500, 5500) });
          const type = (response.headers()['content-type'] || '').toLowerCase();
          if (!response.ok() || !type.startsWith('image/')) continue;
          const bytes = await response.body();
          if (imageBytesLookComplete(bytes, type)) return { bytes, src: source };
        } catch {}
      }
      for (const proxyUrl of proxyUrls) {
        try {
          const proc = await execFileAsync('curl', [
            '-L', '--fail', '--silent', '--show-error', '--compressed',
            '--connect-timeout', '3', '--max-time', '6',
            '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
            String(proxyUrl)
          ], { timeout: 7000, maxBuffer: 4 * 1024 * 1024 });
          const bytes = Buffer.from(proc.stdout || '');
          if (imageBytesLookComplete(bytes)) return { bytes, src: source };
        } catch {}
      }
      return null;
    }

    function imageBytesLookComplete(bytes, contentType = '') {
      if (!bytes || bytes.length < 3000) return false;
      const type = String(contentType || '').toLowerCase();
      // PNG: signature plus terminal IEND chunk. This catches the truncated
      // screenshot/download buffers that Pillow later reports as a broken stream.
      if (type.includes('png') || (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)) {
        const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        if (bytes.length < signature.length || !bytes.subarray(0, signature.length).equals(signature)) return false;
        const iend = Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
        return bytes.lastIndexOf(iend) >= 0;
      }
      // JPEG: SOI plus terminal EOI marker. Ignore trailing bytes because some
      // CDNs append metadata or transport padding after the actual image.
      if (type.includes('jpeg') || type.includes('jpg') || (bytes[0] === 0xff && bytes[1] === 0xd8)) {
        return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.lastIndexOf(Buffer.from([0xff, 0xd9])) >= 2;
      }
      // WebP: RIFF/WEBP container with a plausible declared payload length.
      if (type.includes('webp') || (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP')) {
        if (bytes.length < 12 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') return false;
        const declared = bytes.readUInt32LE(4) + 8;
        return declared <= bytes.length;
      }
      // GIF has a simple magic header and a trailer byte.
      if (type.includes('gif') || bytes.toString('ascii', 0, 6) === 'GIF87a' || bytes.toString('ascii', 0, 6) === 'GIF89a') {
        return (bytes.toString('ascii', 0, 6) === 'GIF87a' || bytes.toString('ascii', 0, 6) === 'GIF89a') && bytes[bytes.length - 1] === 0x3b;
      }
      return true;
    }

    async function networkImageCandidate(list) {
      const ordered = [...list]
        .filter(candidate => candidate?.url)
        .sort((a, b) => (Number(b.sourceScore) || 0) - (Number(a.sourceScore) || 0));
      for (const candidate of ordered.slice(0, 32)) {
        const keyUrl = String(candidate.url || '').split('#')[0];
        const captured = networkImageBodies.get(keyUrl);
        if (!captured) continue;
        const bytes = await captured.promise;
        if (bytes && imageBytesLookComplete(bytes, captured.type)) {
          return { candidate, bytes };
        }
      }
      return null;
    }

    async function tryImages(list) {
      const candidates = list
        .filter(candidate => candidate?.url)
        .slice(0, CANDIDATE_LIMIT);

      // Test the bounded candidate set concurrently. The old implementation
      // serialized every CDN request, so one blocked image host could stall an
      // entire pedal attempt. Parallel requests preserve the same identity rules
      // while dramatically reducing wall-clock time.
      const results = await Promise.all(candidates.map(async candidate => {
        const keyUrl = String(candidate.url || '').split('#')[0];
        const captured = networkImageBodies.get(keyUrl);
        if (captured) {
          const bytes = await captured.promise;
          if (bytes && imageBytesLookComplete(bytes, captured.type)) {
            return { candidate, bytes };
          }
        }

        try {
          const response = await page.request.get(candidate.url, { timeout: IMAGE_TIMEOUT });
          const type = (response.headers()['content-type'] || '').toLowerCase();
          if (response.ok() && type.startsWith('image/')) {
            const bytes = await response.body();
            if (imageBytesLookComplete(bytes, type)) {
              return { candidate, bytes };
            }
          }
        } catch {}

        return { candidate, bytes: null };
      }));

      // Preserve source ranking when multiple candidates succeed.
      const firstDirect = results.find(result => result.bytes);
      if (firstDirect) {
        return {
          candidate: firstDirect.candidate,
          bytes: firstDirect.bytes
        };
      }

      // Only use browser-rendered image fallbacks after the fast network pass
      // fails. Limit these to the highest-ranked exact-source candidates so a
      // protected CDN cannot trigger another serial wall-clock drain.
      for (const result of results.slice(0, 4)) {
        const candidate = result.candidate;
        if (
          !candidate?.sourcePage ||
          candidate.directImageOverride ||
          candidate.rawVerifiedPageImage ||
          (candidate.searchResult && !candidate.strongSearchIdentity)
        ) continue;
        const documentShot = await screenshotImageDocumentCandidate(candidate, 140);
        if (documentShot) {
          return {
            candidate,
            bytes: documentShot.bytes
          };
        }
      }
      return null;
    }

    async function screenshotDirectImageCandidate(candidate) {
      if (!candidate?.directImageOverride || !candidate.url) return null;
      try {
        // Establish the verified source-page session first. Some image hosts
        // (notably marketplace/CDN attachment hosts) require the same cookies,
        // origin, or referrer context as the exact product page before the
        // direct image URL will render inside Chromium.
        if (candidate.sourcePage && /^https?:/i.test(String(candidate.sourcePage))) {
          try {
            await page.goto(candidate.sourcePage, {
              waitUntil: 'domcontentloaded',
              timeout: PAGE_TIMEOUT
            });
            await page.waitForTimeout(220);
          } catch {}
        }

        const capture = await page.evaluate(async src => {
          document.querySelector('[data-dirt-archive-direct-capture="1"]')?.remove();
          const img = document.createElement('img');
          img.setAttribute('data-dirt-archive-direct-capture', '1');
          img.src = src;
          img.alt = '';
          img.style.position = 'fixed';
          img.style.left = '8px';
          img.style.top = '8px';
          img.style.zIndex = '2147483647';
          img.style.maxWidth = 'calc(100vw - 16px)';
          img.style.maxHeight = 'calc(100vh - 16px)';
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.objectFit = 'contain';
          img.style.background = '#fff';
          document.body.appendChild(img);
          await new Promise(resolve => {
            if (img.complete) return resolve();
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
            setTimeout(resolve, 3000);
          });
          return {
            width: Number(img.naturalWidth) || 0,
            height: Number(img.naturalHeight) || 0
          };
        }, candidate.url).catch(() => null);

        // Prefer the raw bytes Chromium just received for the exact image.
        // This avoids turning an already-downloaded product photo into a screenshot,
        // and preserves the source file rather than a browser-rendered derivative.
        const capturedDirect = networkImageBodies.get(String(candidate.url || '').split('#')[0]);
        if (capturedDirect) {
          const directBytes = await capturedDirect.promise;
          if (directBytes && imageBytesLookComplete(directBytes, capturedDirect.type)) {
            await page.evaluate(() => document.querySelector('[data-dirt-archive-direct-capture="1"]')?.remove()).catch(() => {});
            return { bytes: directBytes, src: candidate.url };
          }
        }

        if ((capture?.width || 0) >= 140 && (capture?.height || 0) >= 140) {
          const node = page.locator('[data-dirt-archive-direct-capture="1"]').first();
          await node.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(180);
          const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
          await page.evaluate(() => document.querySelector('[data-dirt-archive-direct-capture="1"]')?.remove()).catch(() => {});
          if (bytes && bytes.length >= 3000) return { bytes, src: candidate.url };
        } else {
          await page.evaluate(() => document.querySelector('[data-dirt-archive-direct-capture="1"]')?.remove()).catch(() => {});
        }

        // Reverb/marketplace CDNs may reject Playwright's request context and
        // injected-image requests while still allowing a normal browser-like
        // HTTP request when the same source-page cookies and Referer are sent.
        const curled = await curlImageCandidate(candidate);
        if (curled?.bytes) return curled;

        const proxied = await proxyImageCandidate(candidate);
        if (proxied?.bytes) return proxied;

        // Direct-image overrides can reject an injected <img> while still
        // rendering when Chromium navigates to the image URL as a document.
        // Reuse the existing image-document fallback while preserving the
        // exact source page as provenance and Referer context.
        const documentShot = await screenshotImageDocumentCandidate(candidate, 140);
        if (documentShot?.bytes) return documentShot;
      } catch {}
      return null;
    }

    // Raw HTML image URLs are still exact evidence from the already
    // identity-verified source page. Some CDNs reject Playwright's HTTP request
    // context but allow a browser <img> request with the source-page session.
    async function screenshotRawVerifiedImageCandidate(candidate) {
      if (!candidate?.rawVerifiedPageImage || !candidate.url) return null;
      const normalizedUrl = String(candidate.url || '');
      if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|tracking|pixel)/i.test(normalizedUrl)) return null;
      if (!/(?:\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$|\/gear\/(?:pics|thumbs)\/)/i.test(normalizedUrl)) return null;
      try {
        const capture = await page.evaluate(async src => {
          document.querySelector('[data-dirt-archive-raw-capture="1"]')?.remove();
          const img = document.createElement('img');
          img.setAttribute('data-dirt-archive-raw-capture', '1');
          img.src = src;
          img.alt = '';
          img.referrerPolicy = 'no-referrer-when-downgrade';
          img.style.position = 'fixed';
          img.style.left = '8px';
          img.style.top = '8px';
          img.style.zIndex = '2147483647';
          img.style.maxWidth = 'calc(100vw - 16px)';
          img.style.maxHeight = 'calc(100vh - 16px)';
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.objectFit = 'contain';
          img.style.background = '#fff';
          document.body.appendChild(img);
          await new Promise(resolve => {
            if (img.complete) return resolve();
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
            setTimeout(resolve, 2200);
          });
          return {
            width: Number(img.naturalWidth) || 0,
            height: Number(img.naturalHeight) || 0
          };
        }, normalizedUrl).catch(() => null);

        if ((capture?.width || 0) >= 180 && (capture?.height || 0) >= 180) {
          const node = page.locator('[data-dirt-archive-raw-capture="1"]').first();
          await node.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(120);
          const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
          await page.evaluate(() => document.querySelector('[data-dirt-archive-raw-capture="1"]')?.remove()).catch(() => {});
          if (bytes && bytes.length >= 3000) return { bytes, src: normalizedUrl };
        } else {
          await page.evaluate(() => document.querySelector('[data-dirt-archive-raw-capture="1"]')?.remove()).catch(() => {});
        }

        const curled = await curlImageCandidate({
          ...candidate,
          url: normalizedUrl
        });
        if (curled?.bytes) return curled;
      } catch {}
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
        let currentIsSourcePage = false;
        try {
          const current = new URL(page.url());
          const target = new URL(sourcePage);
          currentIsSourcePage =
            current.origin === target.origin &&
            current.pathname.replace(/\/+$/, '') === target.pathname.replace(/\/+$/, '');
        } catch {}
        // Reuse the already identity-verified page when possible. Protected
        // marketplace pages can lose their hydrated gallery when navigated twice.
        if (!currentIsSourcePage) {
          await page.goto(sourcePage, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
        }
        await page.waitForTimeout(isReverbListing ? 2800 : 500);

        if (isReverbListing) {
          await page.mouse.wheel(0, 900);
          await page.waitForTimeout(450);
        } else {
          // Many specialist pedal databases lazy-load their gallery images only
          // after the gallery enters the viewport. Trigger a bounded viewport
          // sweep so the rendered photo exists before we score/capture it.
          const viewportHeight = await page.evaluate(() => window.innerHeight || 900).catch(() => 900);
          const bodyHeight = await page.evaluate(() => document.body?.scrollHeight || 0).catch(() => 0);
          const steps = Math.min(6, Math.max(2, Math.ceil(bodyHeight / Math.max(400, viewportHeight))));
          for (let step = 0; step < steps; step++) {
            await page.evaluate(({ step, viewportHeight }) => {
              window.scrollTo(0, Math.min(document.body.scrollHeight, step * viewportHeight * 0.85));
            }, { step, viewportHeight }).catch(() => {});
            await page.waitForTimeout(180);
          }
          await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
          await page.waitForTimeout(220);
        }

        // Hydrate a bounded set of lazy product images after the verified page
        // has completed its viewport sweep. Many older retail/database pages expose
        // the exact pedal photo only in data-src/srcset while the placeholder img
        // still reports 0x0 dimensions. Restrict this to images near the verified
        // product heading so the recovery worker does not wake an entire gallery.
        try {
          await page.evaluate(({ pedalPhrase }) => {
            const normalize = value => String(value || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            const h1 = document.querySelector('h1');
            const h1Rect = h1?.getBoundingClientRect?.() || null;
            const h1Top = Number(h1Rect?.top || 0) + Number(window.scrollY || 0);
            const rows = [];
            for (const img of document.querySelectorAll('img')) {
              const rect = img.getBoundingClientRect();
              const top = Number(rect.top || 0) + Number(window.scrollY || 0);
              const distance = Math.abs(top - h1Top);
              const rawHint = [
                img.alt || '',
                img.className || '',
                img.getAttribute('data-testid') || '',
                img.getAttribute('data-src') || '',
                img.getAttribute('data-lazy-src') || '',
                img.getAttribute('data-original') || '',
                img.getAttribute('data-full-src') || '',
                img.getAttribute('srcset') || ''
              ].join(' ');
              const hint = normalize(rawHint);
              const semantic = /product|pedal|gallery|photo|image|media|hero|listing|item/i.test(hint);
              if (distance > 2200 && !semantic) continue;
              if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|tracking|pixel)/i.test(hint)) continue;
              rows.push({ img, distance, semantic });
            }

            rows.sort((a, b) =>
              Number(b.semantic) - Number(a.semantic) ||
              a.distance - b.distance
            );

            for (const row of rows.slice(0, 40)) {
              const img = row.img;
              const lazy =
                img.getAttribute('data-full-src') ||
                img.getAttribute('data-large-image') ||
                img.getAttribute('data-zoom-image') ||
                img.getAttribute('data-original-src') ||
                img.getAttribute('data-image') ||
                img.getAttribute('data-image-url') ||
                img.getAttribute('data-src') ||
                img.getAttribute('data-lazy-src') ||
                '';
              const srcset = img.getAttribute('data-srcset') || img.getAttribute('data-lazy-srcset') || img.getAttribute('srcset') || '';
              if (lazy && /^https?:/i.test(lazy)) {
                img.loading = 'eager';
                if (img.src !== lazy) img.src = lazy;
              } else if (srcset) {
                img.loading = 'eager';
                img.setAttribute('srcset', srcset);
              }
            }

            window.scrollTo(0, h1Top > 0 ? Math.max(0, h1Top - 100) : 0);
            return rows.length;
          }, { pedalPhrase: normalizedIdentity(entry.pedal) }).catch(() => 0);
          await page.waitForTimeout(450);
        } catch {}

        const pedalPhrase = normalizedIdentity(entry.pedal);
        const pedalTokens = identityTokens(entry.pedal);
        const builderTokens = identityTokens(entry.company);

        // Some modern marketplace pages keep the real CDN image URLs in the
        // rendered HTML/JSON while exposing only an empty or placeholder <img>
        // node to selectors. On an already identity-verified source page, recover
        // those exact image URLs from the rendered document and let Chromium
        // render the image itself. This is especially useful for Reverb galleries,
        // which can hydrate their image links after the initial DOM snapshot.
        const embeddedImageCandidates = [];
        try {
          // Reverb sometimes serializes gallery URLs as JSON-escaped slashes.
          // Normalize those escapes before extracting the exact CDN hosts.
          const html = (await page.content()).replace(/\\\//g, '/');
          const urls = [
            ...html.matchAll(/https?:\/\/(?:rvb-img\.reverb\.com|static\.reverb-assets\.com)\/[^"'\\s<>\\]+/gi)
          ].map(match => match[0].replace(/&amp;/g, '&'));
          for (const url of [...new Set(urls)].slice(0, 24)) {
            embeddedImageCandidates.push({
              url,
              score: 900,
              exactPhrase: true,
              embeddedImage: true
            });
          }
        } catch {}

        // Curated source pages are already tied to the exact pedal. The remaining
        // problem is selecting the *right* image when a product page contains
        // multiple photos, logos, thumbnails, or several products. Score the image
        // together with its semantic card/figure context rather than only the URL.
        const candidates = await page.evaluate(({ pedalPhrase, pedalTokens, builderTokens }) => {
          const normalize = value => String(value || '')
            .toLowerCase()
            .replace(/\+/g, ' plus ')
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const phraseCompact = pedalPhrase.replace(/\s+/g, '');
          const rows = [];

          for (const [imgIndex, img] of [...document.querySelectorAll('img')].entries()) {
            const srcsetValues = [
              img.getAttribute('srcset') || '',
              img.getAttribute('data-srcset') || '',
              img.getAttribute('data-lazy-srcset') || ''
            ].join(',');
            const srcsetCandidates = srcsetValues
              .split(',')
              .map(part => part.trim().split(/\s+/)[0])
              .filter(Boolean);
            const src =
              img.currentSrc ||
              img.getAttribute('data-full-src') ||
              img.getAttribute('data-large-image') ||
              img.getAttribute('data-zoom-image') ||
              img.getAttribute('data-original-src') ||
              img.getAttribute('data-image') ||
              img.getAttribute('data-image-url') ||
              img.getAttribute('data-src') ||
              img.getAttribute('data-lazy-src') ||
              img.getAttribute('data-original') ||
              srcsetCandidates[srcsetCandidates.length - 1] ||
              img.src ||
              '';
            if (!src || src.startsWith('data:')) continue;

            const rect = img.getBoundingClientRect();
            const naturalWidth = Number(img.naturalWidth) || 0;
            const naturalHeight = Number(img.naturalHeight) || 0;
            const width = Math.max(rect.width, naturalWidth);
            const height = Math.max(rect.height, naturalHeight);
            if (width < 140 || height < 140) continue;

            const alt = String(img.alt || '');
            const classes = String(img.className || '');
            const rawHint = [src, alt, classes].join(' ');
            if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(rawHint)) continue;

            const contexts = [];
            let node = img;
            for (let depth = 0; depth < 5 && node; depth++, node = node.parentElement) {
              const tag = String(node.tagName || '').toLowerCase();
              const semantic =
                /^(figure|article|li|a|picture|section)$/i.test(tag) ||
                node.hasAttribute('data-product') ||
                node.hasAttribute('data-testid') ||
                /product|card|gallery|photo|image/i.test(String(node.className || ''));
              if (semantic) {
                const text = String(node.textContent || '').replace(/\s+/g, ' ').trim();
                if (text && text.length <= 900) contexts.push(text);
              }
            }

            const context = contexts.join(' ');
            const hint = normalize([rawHint, context].join(' '));
            const altNorm = normalize(alt);
            const srcNorm = normalize(src);

            const tokenHits = pedalTokens.filter(token => hint.includes(token)).length;
            const altHits = pedalTokens.filter(token => altNorm.includes(token)).length;
            const srcHits = pedalTokens.filter(token => srcNorm.includes(token)).length;
            const builderHits = builderTokens.filter(token => hint.includes(token)).length;
            const exactPhrase = pedalPhrase.length >= 5 && hint.includes(pedalPhrase);
            const compactExact = phraseCompact.length >= 5 && hint.replace(/\s+/g, '').includes(phraseCompact);

            let score = Math.min(width * height, 1600000) / 1000;
            score += tokenHits * 120;
            score += altHits * 90;
            score += srcHits * 35;
            score += builderHits * 25;
            if (exactPhrase) score += 700;
            if (compactExact) score += 550;

            // Prefer product-card imagery over tiny thumbnails, but do not let a
            // huge site-background/photo dominate an exact-model match.
            if (width < 260 || height < 260) score -= 120;
            if (width > 1800 || height > 1800) score -= 90;

            rows.push({
              src,
              score,
              width,
              height,
              exactPhrase,
              tokenHits,
              altHits,
              builderHits,
              elementIndex: imgIndex
            });
          }

          // Some older gallery/card implementations keep the product photo
          // in CSS background-image or data-background attributes instead of an
          // <img>. Extract those rendered image URLs too, then let the same
          // exact-model identity ranking and image-content verification decide.
          for (const [bgIndex, node] of [...document.querySelectorAll('[style*="background-image"], [data-background], [data-bg], [data-background-image]')].entries()) {
            const style = getComputedStyle(node);
            const rawBackground = [
              style.backgroundImage || '',
              node.getAttribute('data-background') || '',
              node.getAttribute('data-bg') || '',
              node.getAttribute('data-background-image') || ''
            ].join(' ');
            const urls = [...rawBackground.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/gi)].map(m => m[1]);
            if (!urls.length) continue;
            const rect = node.getBoundingClientRect();
            const width = Math.max(rect.width, Number(node.scrollWidth) || 0);
            const height = Math.max(rect.height, Number(node.scrollHeight) || 0);
            if (width < 140 || height < 140) continue;
            const context = String(node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 900);
            const rawHint = [context, node.className || '', node.getAttribute('aria-label') || '', node.getAttribute('title') || '', ...urls].join(' ');
            if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(rawHint)) continue;
            const hint = normalize(rawHint);
            const tokenHits = pedalTokens.filter(token => hint.includes(token)).length;
            const builderHits = builderTokens.filter(token => hint.includes(token)).length;
            const exactPhrase = pedalPhrase.length >= 5 && hint.includes(pedalPhrase);
            for (const rawSrc of urls) {
              let src = rawSrc;
              try { src = new URL(rawSrc, location.href).href; } catch {}
              if (!/^https?:/i.test(src)) continue;
              let score = Math.min(width * height, 1600000) / 1000 + 70 + tokenHits * 120 + builderHits * 25;
              if (exactPhrase) score += 700;
              rows.push({ src, score, width, height, exactPhrase, tokenHits, altHits: 0, builderHits, backgroundImage: true, bgIndex });
            }
          }

          // Modern product pages often keep the canonical product photo
          // in JSON-LD instead of the visible DOM. Extract image/contentUrl/
          // thumbnailUrl values while carrying the object's product name,
          // description, and brand into the same exact-model scoring model.
          for (const [jsonIndex, script] of [...document.querySelectorAll('script[type="application/ld+json"]')].entries()) {
            const rawJson = String(script.textContent || '').trim();
            if (!rawJson) continue;
            let parsed;
            try { parsed = JSON.parse(rawJson); } catch { continue; }
            const objects = [];
            const visit = value => {
              if (!value || typeof value !== 'object') return;
              if (Array.isArray(value)) {
                for (const child of value) visit(child);
                return;
              }
              objects.push(value);
              for (const child of Object.values(value)) {
                if (child && typeof child === 'object') visit(child);
              }
            };
            visit(parsed);

            for (const obj of objects) {
              const contextValues = [
                obj.name,
                obj.description,
                typeof obj.brand === 'string' ? obj.brand : obj.brand?.name,
                obj.model,
                obj.sku,
                obj.productID,
                obj.caption
              ].filter(Boolean).map(String);
              const context = contextValues.join(' ');
              const rawImages = [];
              const collectImage = value => {
                if (!value) return;
                if (typeof value === 'string') {
                  rawImages.push(value);
                  return;
                }
                if (Array.isArray(value)) {
                  for (const child of value) collectImage(child);
                  return;
                }
                if (typeof value === 'object') {
                  collectImage(value.url);
                  collectImage(value.contentUrl);
                  collectImage(value.thumbnailUrl);
                }
              };
              collectImage(obj.image);
              collectImage(obj.images);
              if (!rawImages.length) continue;

              const rawHint = [context, ...rawImages].join(' ');
              if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(rawHint)) continue;
              const hint = normalize(rawHint);
              const tokenHits = pedalTokens.filter(token => hint.includes(token)).length;
              const builderHits = builderTokens.filter(token => hint.includes(token)).length;
              const exactPhrase = pedalPhrase.length >= 5 && hint.includes(pedalPhrase);
              const compactExact = phraseCompact.length >= 5 && hint.replace(/\s+/g, '').includes(phraseCompact);
              for (const rawSrc of rawImages) {
                let src = rawSrc;
                try { src = new URL(rawSrc, location.href).href; } catch {}
                if (!/^https?:/i.test(src)) continue;
                let score = 120 + tokenHits * 130 + builderHits * 35;
                if (exactPhrase) score += 850;
                if (compactExact) score += 600;
                if (obj['@type'] === 'Product' || /product/i.test(String(obj['@type'] || ''))) score += 250;
                rows.push({
                  src,
                  score,
                  width: 0,
                  height: 0,
                  exactPhrase,
                  tokenHits,
                  altHits: 0,
                  builderHits,
                  jsonLd: true,
                  jsonLdImage: true,
                  jsonIndex
                });
              }
            }
          }

          // Effects Database and older archive pages sometimes expose the
          // actual product photograph as an image link without rendering a
          // corresponding <img> node. Treat image-file anchors as candidates,
          // using the surrounding link/card text for exact-model scoring.
          for (const [linkIndex, link] of [...document.querySelectorAll('a[href]')].entries()) {
            const href = link.href || '';
            if (!/^https?:/i.test(href) || !/\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.test(href)) continue;
            const text = String(link.textContent || '').replace(/\s+/g, ' ').trim();
            const title = String(link.title || link.getAttribute('aria-label') || '').trim();
            const rawHint = [href, text, title].join(' ');
            if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(rawHint)) continue;
            const hint = normalize(rawHint);
            const tokenHits = pedalTokens.filter(token => hint.includes(token)).length;
            const builderHits = builderTokens.filter(token => hint.includes(token)).length;
            const exactPhrase = pedalPhrase.length >= 5 && hint.includes(pedalPhrase);
            const compactExact = phraseCompact.length >= 5 && hint.replace(/\s+/g, '').includes(phraseCompact);
            let score = 85 + tokenHits * 120 + builderHits * 25;
            if (exactPhrase) score += 700;
            if (compactExact) score += 550;
            rows.push({
              src: href,
              score,
              width: 0,
              height: 0,
              exactPhrase,
              tokenHits,
              altHits: 0,
              builderHits,
              linkedImage: true,
              linkIndex
            });
          }

          return rows
            .sort((a, b) =>
              b.score - a.score ||
              Number(b.exactPhrase) - Number(a.exactPhrase) ||
              b.tokenHits - a.tokenHits ||
              b.width * b.height - a.width * a.height
            )
            .slice(0, 32);
        }, { pedalPhrase, pedalTokens, builderTokens });

        // Keep embedded CDN URLs in the same candidate pool. They come from
        // the already identity-verified page itself, so they remain source-page
        // evidence rather than an unverified search-engine substitution.
        candidates.unshift(...embeddedImageCandidates);

        // Generic roundup/article pages can be identity-verified at the page level
        // while their largest images are collages or unrelated products. For those
        // pages, require the individual candidate itself to carry the exact pedal
        // phrase/token match before it can reach screenshot/image-byte capture.
        if (!isLikelyExactProductSourcePage(sourcePage)) {
          const requiredCandidateHits = pedalTokens.length >= 2 ? 2 : 1;
          const articleCandidates = candidates.filter(candidate =>
            candidate.exactPhrase ||
            Number(candidate.altHits || 0) >= requiredCandidateHits ||
            Number(candidate.tokenHits || 0) >= requiredCandidateHits
          );
          candidates.length = 0;
          candidates.push(...articleCandidates);
        }

        const matches = page.locator('img');
        const count = await matches.count();
        const backgroundMatches = page.locator('[style*="background-image"], [data-background], [data-bg], [data-background-image]');
        const backgroundCount = await backgroundMatches.count();
        const linkMatches = page.locator('a[href]');
        const linkCount = await linkMatches.count();

        // Reverb product galleries frequently expose the primary pedal photo as
        // a direct rvb-img link around the rendered image. Prefer that exact
        // link when its surrounding alt/text matches the verified pedal identity.
        if (isReverbListing) {
          // Reverb frequently exposes only small gallery thumbnails on the
          // listing surface and does not always keep useful alt text on them.
          // Stay on the already identity-verified listing, find clickable images
          // near the product heading, and open several gallery candidates so a
          // changed thumbnail label cannot strand an otherwise exact photo.
          try {
            const galleryTargets = await page.locator('img').evaluateAll(imgs => {
              const h1 = document.querySelector('h1');
              const h1Rect = h1?.getBoundingClientRect?.() || null;
              const h1Top = Number(h1Rect?.top || 0);
              return imgs
                .map((img, index) => {
                  const rect = img.getBoundingClientRect();
                  const parent = img.closest('button, a, [role="button"]');
                  let node = parent || img.parentElement;
                  let semantic = 0;
                  let promoted = false;
                  for (let depth = 0; depth < 6 && node; depth++, node = node.parentElement) {
                    const hint = String([
                      node.tagName || '',
                      node.className || '',
                      node.id || '',
                      node.getAttribute?.('aria-label') || '',
                      node.textContent || ''
                    ].join(' ')).replace(/\s+/g, ' ').toLowerCase();
                    if (/gallery|product|listing|photo|image|pedal/.test(hint)) semantic += 1;
                    if (hint.includes('promoted similar listings') ||
                        hint.includes('similar gear from other reverb sellers')) {
                      promoted = true;
                      break;
                    }
                  }
                  const raw = String([
                    img.alt || '',
                    img.currentSrc || '',
                    img.src || '',
                    img.className || ''
                  ].join(' '));
                  const galleryLike = /(^|\\s)(image|photo)\\s*\\d+/i.test(String(img.alt || '')) ||
                    /rvb-img\\.reverb\\.com|static\\.reverb-assets\\.com/i.test(raw) ||
                    semantic > 0;
                  const nearHeading = h1Rect
                    ? Math.abs(rect.top - h1Top) <= 2400
                    : rect.top <= window.innerHeight * 2.5;
                  return {
                    index,
                    width: Number(img.naturalWidth) || rect.width || 0,
                    height: Number(img.naturalHeight) || rect.height || 0,
                    visible: rect.width >= 40 && rect.height >= 40 &&
                      rect.bottom >= 0 && rect.right >= 0 &&
                      rect.top <= window.innerHeight && rect.left <= window.innerWidth,
                    clickable: Boolean(parent),
                    galleryLike,
                    nearHeading,
                    promoted,
                    area: (Number(img.naturalWidth) || rect.width || 0) *
                      (Number(img.naturalHeight) || rect.height || 0)
                  };
                })
                .filter(x => x.visible && x.clickable && x.galleryLike && x.nearHeading && !x.promoted)
                .sort((a, b) =>
                  Number(b.galleryLike) - Number(a.galleryLike) ||
                  b.area - a.area ||
                  a.index - b.index
                )
                .slice(0, 6);
            });
            for (const target of galleryTargets) {
              const img = page.locator('img').nth(target.index);
              const clickable = img.locator('xpath=ancestor::*[self::button or self::a or @role="button"][1]');
              if (!(await clickable.count())) continue;
              await clickable.scrollIntoViewIfNeeded().catch(() => {});
              await clickable.click({ timeout: 1800, force: true }).catch(() => {});
              await page.waitForTimeout(550);
              const expanded = await page.locator('img').evaluateAll(imgs => imgs
                .map((node, index) => {
                  const rect = node.getBoundingClientRect();
                  const width = Math.max(rect.width, Number(node.naturalWidth) || 0);
                  const height = Math.max(rect.height, Number(node.naturalHeight) || 0);
                  const raw = [node.alt || '', node.src || '', node.currentSrc || '', node.className || ''].join(' ');
                  const forbidden = /(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|promoted|similar)/i.test(raw);
                  const visible = rect.width >= 180 && rect.height >= 180 &&
                    rect.bottom >= 0 && rect.right >= 0 &&
                    rect.top <= window.innerHeight && rect.left <= window.innerWidth;
                  return { index, width, height, area: width * height, visible, forbidden };
                })
                .filter(x => x.visible && !x.forbidden && x.width >= 220 && x.height >= 220)
                .sort((a, b) => b.area - a.area)
                .slice(0, 4));
              for (const candidate of expanded) {
                const node = page.locator('img').nth(candidate.index);
                const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
                if (bytes && bytes.length >= 3000) {
                  return {
                    bytes,
                    src: await node.getAttribute('src').catch(() => '') ||
                      await node.getAttribute('data-src').catch(() => '') || ''
                  };
                }
              }
            }
          } catch {}

          // Reverb often keeps the listing gallery behind thumbnail
          // buttons. Activate a bounded set of gallery controls and capture the
          // largest rendered product image after each activation. This stays on
          // the already identity-verified listing, so it does not broaden the
          // provenance gate.
          try {
            const galleryButtons = await page.locator('button, [role="button"]').evaluateAll(nodes => {
              return nodes
                .map((node, index) => {
                  const img = node.querySelector('img');
                  if (!img) return null;
                  const rect = node.getBoundingClientRect();
                  const raw = [
                    node.getAttribute('aria-label') || '',
                    node.getAttribute('data-testid') || '',
                    node.className || '',
                    img.alt || '',
                    img.src || '',
                    img.currentSrc || ''
                  ].join(' ');
                  if (/(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|promoted|similar)/i.test(raw)) return null;
                  if (rect.width < 40 || rect.height < 40) return null;
                  return { index, score:
                    (/gallery|photo|image|product|listing|thumbnail|media/i.test(raw) ? 100 : 0) +
                    Math.min(50, Math.round(rect.width * rect.height / 10000))
                  };
                })
                .filter(Boolean)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            });
            for (const target of galleryButtons) {
              const button = page.locator('button, [role="button"]').nth(target.index);
              await button.scrollIntoViewIfNeeded().catch(() => {});
              await button.click({ timeout: 1800, force: true }).catch(() => {});
              await page.waitForTimeout(550);
              const largest = await page.locator('img').evaluateAll(imgs => imgs
                .map((img, index) => {
                  const rect = img.getBoundingClientRect();
                  const width = Math.max(rect.width, Number(img.naturalWidth) || 0);
                  const height = Math.max(rect.height, Number(img.naturalHeight) || 0);
                  const raw = [img.alt || '', img.src || '', img.currentSrc || '', img.className || ''].join(' ');
                  const forbidden = /(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|promoted|similar)/i.test(raw);
                  const visible = rect.width >= 220 && rect.height >= 220 &&
                    rect.bottom >= 0 && rect.right >= 0 &&
                    rect.top <= window.innerHeight && rect.left <= window.innerWidth;
                  return { index, width, height, area: width * height, visible, forbidden };
                })
                .filter(x => x.visible && !x.forbidden && x.width >= 260 && x.height >= 260)
                .sort((a, b) => b.area - a.area)
                .slice(0, 3));
              for (const candidate of largest) {
                const image = page.locator('img').nth(candidate.index);
                const bytes = await image.screenshot({ type: 'png' }).catch(() => null);
                if (bytes && bytes.length >= 3000) {
                  return {
                    bytes,
                    src: await image.getAttribute('src').catch(() => '') ||
                      await image.getAttribute('data-src').catch(() => '') || ''
                  };
                }
              }
              await page.keyboard.press('Escape').catch(() => {});
              await page.waitForTimeout(120);
            }
          } catch {}

          const expandedCandidates = await page.locator('img').evaluateAll(imgs => imgs
            .map((img, index) => {
              const rect = img.getBoundingClientRect();
              const width = Math.max(rect.width, Number(img.naturalWidth) || 0);
              const height = Math.max(rect.height, Number(img.naturalHeight) || 0);
              const visible = rect.width >= 180 && rect.height >= 180 &&
                rect.bottom >= 0 && rect.right >= 0 &&
                rect.top <= window.innerHeight && rect.left <= window.innerWidth;
              const raw = [img.alt || '', img.src || '', img.currentSrc || '', img.className || ''].join(' ');
              const forbidden = /(logo|avatar|icon|sprite|favicon|banner|badge|payment|social)/i.test(raw);
              return { index, width, height, visible, forbidden, area: width * height };
            })
            .filter(x => x.visible && !x.forbidden && x.width >= 220 && x.height >= 220)
            .sort((a, b) => b.area - a.area)
            .slice(0, 6));
          for (const candidate of expandedCandidates) {
            const img = page.locator('img').nth(candidate.index);
            await img.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(180);
            const bytes = await img.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return {
                bytes,
                src: await img.getAttribute('src').catch(() => '') ||
                  await img.getAttribute('data-src').catch(() => '') || ''
              };
            }
          }

          // Reverb can expose the exact listing photos as image links without
          // useful pedal text on the link itself. The listing page has already
          // passed exact-model identity verification, so rank its rendered
          // rvb-img links by where they appear relative to the verified H1.
          const h1Box = await page.locator('h1').first().boundingBox().catch(() => null);
          const reverbImageLinks = page.locator('a[href*="rvb-img.reverb.com"], a[href*="static.reverb-assets.com"]');
          const reverbLinkCount = await reverbImageLinks.count();
          const rankedRenderedLinks = [];
          for (let i = 0; i < reverbLinkCount; i++) {
            const link = reverbImageLinks.nth(i);
            const info = await link.evaluate(el => {
              const img = el.querySelector('img');
              const rect = el.getBoundingClientRect();
              let promoted = false;
              let node = el;
              for (let depth = 0; depth < 6 && node; depth++, node = node.parentElement) {
                const text = String(node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
                if (text.includes('promoted similar listings') || text.includes('similar gear from other reverb sellers')) {
                  promoted = true;
                  break;
                }
              }
              return {
                href: el.href || '',
                alt: img?.alt || '',
                width: img?.naturalWidth || rect.width || 0,
                height: img?.naturalHeight || rect.height || 0,
                top: rect.top,
                promoted
              };
            }).catch(() => null);
            if (!info?.href || info.promoted) continue;
            if (!/^https:\/\/(?:rvb-img\.reverb\.com|static\.reverb-assets\.com)\//i.test(info.href)) continue;
            if (info.width < 220 || info.height < 220) continue;
            if (h1Box && info.top < h1Box.y + h1Box.height - 40) continue;
            rankedRenderedLinks.push({ index: i, info });
          }

          rankedRenderedLinks.sort((a, b) =>
            (b.info.width * b.info.height) - (a.info.width * a.info.height) ||
            a.info.top - b.info.top
          );

          for (const candidateLink of rankedRenderedLinks.slice(0, 4)) {
            const link = reverbImageLinks.nth(candidateLink.index);
            await link.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(350);
            const img = link.locator('img').first();
            const bytes = await (await img.count()
              ? img.screenshot({ type: 'png' })
              : link.screenshot({ type: 'png' })
            ).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return { bytes, src: candidateLink.info.href };
            }
          }

          // Fallback to the older semantic-text gate when the listing has not
          // exposed a large rendered image yet.

          // Reuse the gallery link count declared above in this listing scope.
          const pedalNorm = normalizedIdentity(entry.pedal);
          const builderNorm = normalizedIdentity(entry.company);

          for (let i = 0; i < reverbLinkCount; i++) {
            const link = reverbImageLinks.nth(i);
            const evidence = await link.evaluate(el => {
              const img = el.querySelector('img');
              return {
                href: el.href || '',
                alt: img?.alt || '',
                text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
                width: img?.naturalWidth || 0,
                height: img?.naturalHeight || 0
              };
            }).catch(() => null);
            if (!evidence?.href || !/^https:\/\/(?:rvb-img\.reverb\.com|static\.reverb-assets\.com)\//i.test(evidence.href)) continue;

            const hint = normalizedIdentity([evidence.alt, evidence.text, evidence.href].join(' '));
            const pedalHits = identityTokens(entry.pedal).filter(token => hint.includes(token)).length;
            const builderHits = identityTokens(entry.company).filter(token => hint.includes(token)).length;
            const exactPedal = pedalNorm.length >= 5 && hint.includes(pedalNorm);
            const exactBuilder = builderNorm.length >= 5 && hint.includes(builderNorm);
            if (!exactPedal && pedalHits < (identityTokens(entry.pedal).length >= 2 ? 2 : 1)) continue;
            if (exactBuilder || builderHits) {
              await link.scrollIntoViewIfNeeded().catch(() => {});
              await page.waitForTimeout(220);
              const bytes = await link.screenshot({ type: 'png' }).catch(() => null);
              if (bytes && bytes.length >= 3000) {
                return { bytes, src: evidence.href };
              }
            }
          }
        }

        // Some exact product pages use generic image URLs/alt text or lazy-load
        // the real photo through data-* attributes. The page itself is already
        // identity-verified, so use the rendered main/product content as an
        // additional exact-page evidence channel. This avoids relying on image
        // filenames containing the pedal name and avoids accepting site chrome.
        try {
          const h1Box = await page.locator('h1').first().boundingBox().catch(() => null);
          const h1Y = Number(h1Box?.y) || 0;
          const mainImageTargets = await page.locator('img').evaluateAll((imgs, { pedalTokens, builderTokens, h1Y }) => {
            const normalize = value => String(value || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

            const forbiddenPattern = /(logo|avatar|icon|sprite|favicon|banner|badge|payment|social|tracking|pixel|cookie|consent|breadcrumb|menu|nav|header|footer)/i;
            const rows = [];

            for (const [index, img] of imgs.entries()) {
              const lazySrc =
                img.currentSrc ||
                img.getAttribute('data-full-src') ||
                img.getAttribute('data-large-image') ||
                img.getAttribute('data-zoom-image') ||
                img.getAttribute('data-original-src') ||
                img.getAttribute('data-image') ||
                img.getAttribute('data-image-url') ||
                img.getAttribute('data-src') ||
                img.getAttribute('data-lazy-src') ||
                img.getAttribute('data-original') ||
                img.src ||
                '';

              if (lazySrc && /^https?:/i.test(lazySrc) && (Number(img.naturalWidth) || 0) < 220) {
                try {
                  img.loading = 'eager';
                  if (img.src !== lazySrc) img.src = lazySrc;
                } catch {}
              }

              const rect = img.getBoundingClientRect();
              const width = Math.max(rect.width, Number(img.naturalWidth) || 0);
              const height = Math.max(rect.height, Number(img.naturalHeight) || 0);
              if (width < 220 || height < 220) continue;

              const raw = [
                img.currentSrc || '',
                img.src || '',
                img.alt || '',
                img.className || ''
              ].join(' ');
              if (forbiddenPattern.test(raw)) continue;

              let node = img;
              let semanticScore = 0;
              let chromePenalty = 0;
              let context = '';

              for (let depth = 0; depth < 7 && node; depth++, node = node.parentElement) {
                const tag = String(node.tagName || '').toLowerCase();
                const cls = String(node.className || '');
                const id = String(node.id || '');
                const text = String(node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 700);
                const hint = normalize([tag, cls, id, node.getAttribute?.('data-testid') || '', text].join(' '));
                context += ' ' + hint;

                if (/^(main|article)$/i.test(tag) || /product|pedal|gallery|photo|image|media|hero|listing|item/i.test(cls + ' ' + id)) semanticScore += 170;
                if (/^(header|nav|footer|aside)$/i.test(tag) || /header|nav|footer|menu|breadcrumb|cookie|consent|social/i.test(cls + ' ' + id)) chromePenalty += 240;
              }

              const hint = normalize([raw, context, ...pedalTokens, ...builderTokens].join(' '));
              const pedalHits = pedalTokens.filter(token => hint.includes(token)).length;
              const builderHits = builderTokens.filter(token => hint.includes(token)).length;
              const areaScore = Math.min(width * height, 1600000) / 1000;
              const documentTop = Number(rect.top) + Number(window.scrollY || 0);
              const headingDistance = Math.abs(documentTop - h1Y);

              let score = areaScore + semanticScore + pedalHits * 150 + builderHits * 40 - chromePenalty;
              if (width > 1800 || height > 1800) score -= 120;
              if (rect.bottom >= 0 && rect.top <= window.innerHeight * 2) score += 80;
              if (headingDistance <= 900) score += 320;
              else if (headingDistance <= 1500) score += 120;

              const ratio = Math.max(width / Math.max(1, height), height / Math.max(1, width));
              if (ratio >= 2.7) score -= 500;
              else if (ratio >= 2.2) score -= 250;

              rows.push({
                index,
                src: img.currentSrc || img.src || lazySrc,
                width,
                height,
                score
              });
            }

            return rows
              .sort((a, b) => b.score - a.score)
              .slice(0, 8);
          }, { pedalTokens, builderTokens, h1Y });

          for (const target of mainImageTargets) {
            const img = page.locator('img').nth(target.index);
            await img.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(180);
            const bytes = await img.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return { bytes, src: target.src };
            }
          }
        } catch {}

        // A verified product page can expose its canonical product photograph
        // only through og:image/twitter:image metadata. When the CDN blocks the
        // workflow's direct request, render that exact URL in the verified page
        // context and capture the resulting image element.
        for (const candidate of candidates) {
          if (candidate.jsonLdImage) {
            try {
              const capture = await page.evaluate(async src => {
                const old = document.querySelector('[data-dirt-archive-jsonld-capture="1"]');
                old?.remove();
                const img = document.createElement('img');
                img.setAttribute('data-dirt-archive-jsonld-capture', '1');
                img.src = src;
                img.alt = '';
                img.style.position = 'fixed';
                img.style.left = '8px';
                img.style.top = '8px';
                img.style.zIndex = '2147483647';
                img.style.maxWidth = 'calc(100vw - 16px)';
                img.style.maxHeight = 'calc(100vh - 16px)';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.background = '#fff';
                document.body.appendChild(img);
                await new Promise(resolve => {
                  if (img.complete) return resolve();
                  img.addEventListener('load', resolve, { once: true });
                  img.addEventListener('error', resolve, { once: true });
                  setTimeout(resolve, 2200);
                });
                return {
                  width: Number(img.naturalWidth) || 0,
                  height: Number(img.naturalHeight) || 0
                };
              }, candidate.url).catch(() => null);
              if ((capture?.width || 0) >= 140 && (capture?.height || 0) >= 140) {
                const node = page.locator('[data-dirt-archive-jsonld-capture="1"]').first();
                await node.scrollIntoViewIfNeeded().catch(() => {});
                await page.waitForTimeout(180);
                const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
                await page.evaluate(() => document.querySelector('[data-dirt-archive-jsonld-capture="1"]')?.remove()).catch(() => {});
                if (bytes && bytes.length >= 3000) {
                  return { bytes, src: candidate.url };
                }
              } else {
                await page.evaluate(() => document.querySelector('[data-dirt-archive-jsonld-capture="1"]')?.remove()).catch(() => {});
              }
            } catch {}
          }
        }

        for (const candidate of candidates) {
          if (candidate.metaImage) {
            try {
              const capture = await page.evaluate(async src => {
                const old = document.querySelector('[data-dirt-archive-meta-capture="1"]');
                old?.remove();
                const img = document.createElement('img');
                img.setAttribute('data-dirt-archive-meta-capture', '1');
                img.src = src;
                img.alt = '';
                img.style.position = 'fixed';
                img.style.left = '8px';
                img.style.top = '8px';
                img.style.zIndex = '2147483647';
                img.style.maxWidth = 'calc(100vw - 16px)';
                img.style.maxHeight = 'calc(100vh - 16px)';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.background = '#fff';
                document.body.appendChild(img);
                await new Promise(resolve => {
                  if (img.complete) return resolve();
                  img.addEventListener('load', resolve, { once: true });
                  img.addEventListener('error', resolve, { once: true });
                  setTimeout(resolve, 2200);
                });
                return {
                  width: Number(img.naturalWidth) || 0,
                  height: Number(img.naturalHeight) || 0
                };
              }, candidate.url).catch(() => null);
              if ((capture?.width || 0) >= 140 && (capture?.height || 0) >= 140) {
                const node = page.locator('[data-dirt-archive-meta-capture="1"]').first();
                await node.scrollIntoViewIfNeeded().catch(() => {});
                await page.waitForTimeout(180);
                const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
                await page.evaluate(() => document.querySelector('[data-dirt-archive-meta-capture="1"]')?.remove()).catch(() => {});
                if (bytes && bytes.length >= 3000) {
                  return { bytes, src: candidate.url };
                }
              } else {
                await page.evaluate(() => document.querySelector('[data-dirt-archive-meta-capture="1"]')?.remove()).catch(() => {});
              }
            } catch {}
          }
        }

        // Some source pages expose a valid exact image URL in rendered HTML
        // without a matching DOM <img>. Render those embedded URLs inside the
        // verified page context and capture the image element directly.
        for (const candidate of candidates) {
          if (!candidate.embeddedImage) continue;
          try {
            const capture = await page.evaluate(async src => {
              document.querySelector('[data-dirt-archive-embedded-capture="1"]')?.remove();
              const img = document.createElement('img');
              img.setAttribute('data-dirt-archive-embedded-capture', '1');
              img.src = src;
              img.alt = '';
              img.style.position = 'fixed';
              img.style.left = '8px';
              img.style.top = '8px';
              img.style.zIndex = '2147483647';
              img.style.maxWidth = 'calc(100vw - 16px)';
              img.style.maxHeight = 'calc(100vh - 16px)';
              img.style.width = 'auto';
              img.style.height = 'auto';
              img.style.objectFit = 'contain';
              img.style.background = '#fff';
              document.body.appendChild(img);
              await new Promise(resolve => {
                if (img.complete) return resolve();
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, 2500);
              });
              return {
                width: Number(img.naturalWidth) || 0,
                height: Number(img.naturalHeight) || 0
              };
            }, candidate.url).catch(() => null);
            if ((capture?.width || 0) >= 220 && (capture?.height || 0) >= 220) {
              const node = page.locator('[data-dirt-archive-embedded-capture="1"]').first();
              const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
              await page.evaluate(() => document.querySelector('[data-dirt-archive-embedded-capture="1"]')?.remove()).catch(() => {});
              if (bytes && bytes.length >= 3000) {
                return { bytes, src: candidate.url };
              }
            } else {
              await page.evaluate(() => document.querySelector('[data-dirt-archive-embedded-capture="1"]')?.remove()).catch(() => {});
            }
          } catch {}
        }

        // Capture the exact DOM element that was scored above. Gallery hydration
        // can replace currentSrc/src after scrolling, so re-matching on the old
        // URL can silently discard a perfectly good exact-model photo.
        for (const candidate of candidates) {
          if (Number.isInteger(candidate.elementIndex) &&
              candidate.elementIndex >= 0 &&
              candidate.elementIndex < count) {
            const img = matches.nth(candidate.elementIndex);
            await img.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(220);

            const bytes = await img.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return { bytes, src: candidate.src };
            }
          }

          // CSS-background galleries can expose the exact photograph without
          // an <img>. Chromium can still render the background even when the
          // underlying CDN URL rejects a direct request, so capture the exact
          // scored background element as rendered.
          if (Number.isInteger(candidate.bgIndex) &&
              candidate.bgIndex >= 0 &&
              candidate.bgIndex < backgroundCount &&
              candidate.backgroundImage) {
            const node = backgroundMatches.nth(candidate.bgIndex);
            await node.scrollIntoViewIfNeeded().catch(() => {});
            await page.waitForTimeout(220);
            const bytes = await node.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) {
              return { bytes, src: candidate.src };
            }
          }

          // Some archive/database pages expose the exact photograph only as an
          // image-file anchor. Chromium may render the linked asset even when a
          // direct HTTP request is blocked, so capture that exact anchor.
          if (candidate.linkedImage) {
            let link = null;
            if (Number.isInteger(candidate.linkIndex) &&
                candidate.linkIndex >= 0 &&
                candidate.linkIndex < linkCount) {
              link = linkMatches.nth(candidate.linkIndex);
            } else {
              link = page.locator('a[href="' + candidate.src.replace(/"/g, '\"') + '"]').first();
            }
            if (link && await link.count()) {
              await link.scrollIntoViewIfNeeded().catch(() => {});
              await page.waitForTimeout(220);
              const linkBytes = await link.screenshot({ type: 'png' }).catch(() => null);
              if (linkBytes && linkBytes.length >= 3000) {
                return { bytes: linkBytes, src: candidate.src };
              }

              // Some exact archive links point directly at the full-resolution
              // pedal photograph. Navigate to that same verified image URL in a
              // browser image document so a blocked HTTP request or tiny anchor
              // thumbnail does not strand the exact source.
              const documentShot = await screenshotImageDocumentCandidate({
                url: candidate.src,
                sourcePage,
                sourceScore: candidate.score || 90
              }, 140);
              if (documentShot?.bytes) return documentShot;
            }
          }
        }
      } catch {}
      return null;
    }
    // Some exact source images reject an injected <img> element but render
    // normally when Chromium navigates directly to the image document. Restrict
    // this to image candidates already tied to an identity-verified source page.
    async function screenshotImageDocumentCandidate(candidate, minimumSize = 180) {
      if (!candidate?.url) return null;
      let imagePage = null;
      try {
        imagePage = await page.context().newPage({ viewport: { width: 1440, height: 1000 } });
        if (candidate.sourcePage && /^https?:/i.test(String(candidate.sourcePage))) {
          try {
            // Seed cookies/session state with a normal HTML navigation first.
            // Keep the image Accept header off this request so the source page
            // receives ordinary document negotiation.
            if (candidate.sourcePage !== candidate.url) {
              await imagePage.goto(candidate.sourcePage, {
                waitUntil: 'domcontentloaded',
                timeout: PAGE_TIMEOUT
              }).catch(() => {});
              await imagePage.waitForTimeout(120).catch(() => {});
            }
            await imagePage.setExtraHTTPHeaders({
              Referer: String(candidate.sourcePage),
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            });
          } catch {}
        }
        const response = await imagePage.goto(candidate.url, {
          waitUntil: 'domcontentloaded',
          timeout: IMAGE_TIMEOUT
        });
        const type = (response?.headers?.()['content-type'] || '').toLowerCase();
        if (type && !type.startsWith('image/')) return null;
        await imagePage.waitForTimeout(120);
        const image = imagePage.locator('img').first();
        if (await image.count()) {
          const dimensions = await image.evaluate(img => ({
            width: Number(img.naturalWidth) || 0,
            height: Number(img.naturalHeight) || 0
          })).catch(() => ({ width: 0, height: 0 }));
          if (dimensions.width < minimumSize || dimensions.height < minimumSize) return null;
          const bytes = await image.screenshot({ type: 'png' }).catch(() => null);
          if (bytes && bytes.length >= 3000) return { bytes, src: candidate.url };
        }
        const bytes = await imagePage.screenshot({ type: 'png' }).catch(() => null);
        if (bytes && bytes.length >= 3000) return { bytes, src: candidate.url };
      } catch {}
      finally {
        await imagePage?.close().catch(() => {});
      }
      return null;
    }

    // First trust only candidates discovered on the already-verified source page.
    if (!selectedResult) {
      selectedResult = await tryImages(
        ranked.filter(candidate => !candidate.searchResult)
      );
    }

    // Curated direct-image overrides are already exact-model evidence. When
    // the HTTP request layer returns 401/403/500, let Chromium render that
    // exact URL inside the verified source-page context and capture the image
    // element instead of discarding an otherwise valid direct lead.
    if (!selectedResult) {
      for (const candidate of ranked.filter(candidate => candidate.directImageOverride).slice(0, 8)) {
        const shot = await screenshotDirectImageCandidate(candidate);
        const documentShot = shot || await screenshotImageDocumentCandidate(candidate, 140);
        if (documentShot) {
          selectedResult = {
            candidate,
            bytes: documentShot.bytes
          };
          diagnostic.sourceScreenshotCaptured = true;
          break;
        }
      }
    }

    if (!selectedResult) {
      for (const candidate of ranked.filter(candidate => candidate.rawVerifiedPageImage).slice(0, 12)) {
        const shot = await screenshotRawVerifiedImageCandidate(candidate);
        const documentShot = shot || await screenshotImageDocumentCandidate(candidate, 180);
        if (documentShot) {
          selectedResult = {
            candidate,
            bytes: documentShot.bytes
          };
          diagnostic.sourceScreenshotCaptured = true;
          break;
        }
      }
    }

    if (!selectedResult) {
      const sourcePages = [...new Set([
        sourcePageUsed,
        // Keep the original research source as a bounded fallback. Older catalog
        // records can have a better research/source page than their current image
        // lead, and discarding it made a blocked curated page an unnecessary dead
        // end.
        entry.source_page,
        entry.image_source_page,
        ...ranked
          .filter(candidate => !candidate.searchResult && candidate.sourcePage)
          .map(candidate => candidate.sourcePage)
      ].filter(Boolean))].slice(0, 4);

      for (const sourcePage of sourcePages) {
        const shot = await screenshotVerifiedSourcePageImage(sourcePage);
        if (shot) {
          diagnostic.sourceScreenshotCaptured = true;
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

    // If an explicit source page was provided but yielded no usable image,
    // fall back to a fresh maker-site search. This preserves the curated-page
    // priority without letting a stale/broken source page become a dead end.
    if (!selectedResult && hasExplicitSourcePage) {
      try {
        diagnostic.makerFallbackTried = true;
        const makerCandidates = await makerWebCandidates(page, entry);
        selectedResult = await tryImages(makerCandidates);
        if (!selectedResult && deepReview) {
          try {
            const curlSources = await curlExactSourceCandidates(entry);
            const curlImages = await curlExactSourcePageImages(entry, curlSources);
            if ((entry.company === 'C14 Devices' || entry.company === 'CAT Sound') && curlSources.length) {
              console.log(entry.company + ' / ' + entry.pedal + ' DDG exact source candidates: ' + curlSources.map(x => x.url).join(' | '));
            }
            selectedResult = await tryImages(curlImages);
            if (!selectedResult) {
              for (const candidate of curlImages.filter(x => x.rawVerifiedPageImage).slice(0, 8)) {
                const proxy = await proxyImageCandidate(candidate);
                if (proxy?.bytes) {
                  selectedResult = { candidate, bytes: proxy.bytes };
                  break;
                }
              }
            }
          } catch {}
        }
      } catch {}
    }

    // Search is a fallback, not the primary source. Verify the result page identity
    // before accepting its image so a visually similar pedal cannot slip through.
    async function screenshotVerifiedSearchImage(candidate) {
      if (!candidate?.searchResult || !candidate.searchUrl || !candidate.murl) return null;
      try {
        await page.goto(candidate.searchUrl, { waitUntil: 'domcontentloaded', timeout: SEARCH_TIMEOUT });
        await page.waitForTimeout(500);

        // Bing periodically changes its image-card DOM while retaining the m/data-m
        // metadata payload. Match all current metadata containers first.
        const cards = page.locator('a.iusc, [data-m][class*="iusc"], [data-m], [m]');
        const count = await cards.count();
        for (let i = 0; i < Math.min(count, 24); i++) {
          const card = cards.nth(i);
          const raw = await card.getAttribute('m').catch(() => null) ||
            await card.getAttribute('data-m').catch(() => null);
          if (!raw) continue;

          let meta = null;
          try { meta = JSON.parse(raw); } catch {}
          if (!meta || meta.murl !== candidate.murl) continue;

          await card.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(250);

          const img = card.locator('img').first();
          if (await img.count()) {
            const bytes = await img.screenshot({ type: 'png' }).catch(() => null);
            if (bytes && bytes.length >= 3000) return bytes;
          }

          // Some Bing cards carry the exact thumbnail URL but inject no <img>.
          // Render that exact returned murl in the browser context and capture it.
          const dims = await page.evaluate(async src => {
            document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove();
            const img = document.createElement('img');
            img.setAttribute('data-dirt-archive-search-capture', '1');
            img.src = src;
            img.alt = '';
            img.style.position = 'fixed';
            img.style.left = '8px';
            img.style.top = '8px';
            img.style.zIndex = '2147483647';
            img.style.maxWidth = 'calc(100vw - 16px)';
            img.style.maxHeight = 'calc(100vh - 16px)';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.background = '#fff';
            document.body.appendChild(img);
            await new Promise(resolve => {
              if (img.complete) return resolve();
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 2500);
            });
            return { width: Number(img.naturalWidth) || 0, height: Number(img.naturalHeight) || 0 };
          }, candidate.murl).catch(() => null);

          if ((dims?.width || 0) >= 140 && (dims?.height || 0) >= 140) {
            const node = page.locator('[data-dirt-archive-search-capture="1"]').first();
            const shot = await node.screenshot({ type: 'png' }).catch(() => null);
            await page.evaluate(() => document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove()).catch(() => {});
            if (shot && shot.length >= 3000) return shot;
          } else {
            await page.evaluate(() => document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove()).catch(() => {});
          }
        }

        // The verified search result also carries the exact source page that
        // established the pedal identity. When the image CDN rejects an injected
        // <img>, render the exact murl as a browser image document after seeding
        // that source-page session and Referer context. This is especially useful
        // for Reverb thumbnails whose direct CDN requests return 401/403/500.
        if (candidate.sourcePage) {
          const documentShot = await screenshotImageDocumentCandidate({
            url: candidate.murl,
            sourcePage: candidate.sourcePage,
            sourceScore: 100,
            searchResult: false
          }, 140);
          if (documentShot?.bytes) return documentShot.bytes;
        }

        // Final fallback for markup that exposes image metadata only in the raw
        // document. Parse the exact candidate murl, then render that exact image.
        try {
          const html = await page.content();
          for (const match of html.matchAll(/(?:\bm|\bdata-m)=["']([^"']+)["']/gi)) {
            let meta = null;
            try { meta = JSON.parse(match[1]); } catch {}
            if (!meta || meta.murl !== candidate.murl) continue;

            const dims = await page.evaluate(async src => {
              document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove();
              const img = document.createElement('img');
              img.setAttribute('data-dirt-archive-search-capture', '1');
              img.src = src;
              img.alt = '';
              img.style.position = 'fixed';
              img.style.left = '8px';
              img.style.top = '8px';
              img.style.zIndex = '2147483647';
              img.style.maxWidth = 'calc(100vw - 16px)';
              img.style.maxHeight = 'calc(100vh - 16px)';
              img.style.width = 'auto';
              img.style.height = 'auto';
              img.style.objectFit = 'contain';
              document.body.appendChild(img);
              await new Promise(resolve => {
                if (img.complete) return resolve();
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, 2200);
              });
              return { width: Number(img.naturalWidth) || 0, height: Number(img.naturalHeight) || 0 };
            }, candidate.murl).catch(() => null);

            if ((dims?.width || 0) >= 140 && (dims?.height || 0) >= 140) {
              const node = page.locator('[data-dirt-archive-search-capture="1"]').first();
              const shot = await node.screenshot({ type: 'png' }).catch(() => null);
              await page.evaluate(() => document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove()).catch(() => {});
              if (shot && shot.length >= 3000) return shot;
            } else {
              await page.evaluate(() => document.querySelector('[data-dirt-archive-search-capture="1"]')?.remove()).catch(() => {});
            }
          }
        } catch {}
      } catch {}
      return null;
    }

    // Exact source pages are tried first, but a verified page that fails
    // to yield a usable image must still be allowed to fall through to other
    // reliable sources. Identity and image selection remain separate gates.
    // This prevents a bad CDN, empty gallery, or blocked archive page from
    // becoming a permanent dead end.
    // Reverb sold listings are one fallback source among several.
    // Reverb's Sold Listings filter exposes previously sold listings, and Reverb
    // requires listing photos to show the exact item being sold. Verify the listing
    // identity first, then harvest its actual listing photos.
    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const soldResults = await reverbSoldCandidates(page, entry, deepReview);
      diagnostic.soldCandidates = soldResults.length;
      const verifiedSold = [];

      const verifyLimit = deepReview
        ? Math.min(24, Math.max(SEARCH_VERIFY_LIMIT, SEARCH_VERIFY_LIMIT * 3))
        : SEARCH_VERIFY_LIMIT;

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

      diagnostic.verifiedSoldCandidates = verifiedSold.length;
      selectedResult = await tryImages(
        [...new Map(verifiedSold.map(x => [x.url, x])).values()]
          .sort((a, b) => b.sourceScore - a.sourceScore)
      );
    }

    // If no exact-source route yielded a usable image, fall back to general
    // image search and other indexed web results. Deep-review records whose
    // curated source page already passed identity stay source-first to avoid
    // burning another full search cycle on the same hard case.
    if (!selectedResult && IMAGE_SEARCH_ENABLED) {
      const searchResults = await imageSearchCandidates(page, entry, deepReview);
      diagnostic.imageSearchCandidates = searchResults.length;
      const verifiedSearch = [];
      const rankedSearchResults = searchResults
        .map(result => ({ result, fit: imageSearchScore(entry, result) }))
        .sort((a, b) => b.fit.score - a.fit.score);
      const verifyLimit = deepReview ? Math.min(4, SEARCH_VERIFY_LIMIT) : SEARCH_VERIFY_LIMIT;
      for (const ranked of rankedSearchResults.slice(0, verifyLimit)) {
        const result = ranked.result;
        const fit = ranked.fit;
        // Let the exact builder/model identity path below decide whether an
        // image result is trustworthy. The older pedal-token prefilter ran first
        // and rejected legitimate Google/Bing exact hits before their source
        // title, context, and product URL could be evaluated.
        if (!result.purl || !result.murl) continue;
        const requiredHits = pedalTokensForSearch(entry).length >= 2 ? 2 : 1;
        try {
          // Some specialist pedal databases expose their exact product image to
          // search engines but hide the image behind an AJAX feed endpoint that
          // returns no usable HTML to a headless fetch. For an exact model page
          // on Effects Database, the page path itself is strong source identity,
          // so do not reject it merely because the generic image-search ranking
          // score is below the normal threshold.
          const resultUrl = new URL(result.purl);
          const searchIdentity = normalizedIdentity((result.title || '') + ' ' + result.purl);
          const pedalTokens = identityTokens(entry.pedal);
          const builderTokens = identityTokens(entry.company);
          const exactDatabasePage =
            /(^|\.)effectsdatabase\.com$/i.test(resultUrl.hostname) &&
            /\/model\//i.test(resultUrl.pathname);

          // Effects Database model paths are curated exact-product records, but
          // the search-engine title/context does not always preserve every
          // meaningful token after normalization. For example, generic type words
          // such as "fuzz" are intentionally ignored by identityTokens, while a
          // short model token may appear only in the URL. Treat a curated exact
          // model path as trusted when its normalized path carries at least one
          // meaningful model token, or when the path is one of this entry's
          // explicitly verified source pages. The image itself still must pass the
          // normal byte/render checks before it is archived.
          const resultModelPath = normalizedIdentity(resultUrl.pathname);
          const modelPathTokens = pedalTokens.filter(token =>
            resultModelPath.includes(token)
          );
          const trustedCuratedDatabase =
            exactDatabasePage &&
            preferredSourcePages(entry).some(source => {
              try {
                const sourceUrl = new URL(source);
                return /(^|\.)effectsdatabase\.com$/i.test(sourceUrl.hostname) &&
                  normalizedIdentity(sourceUrl.pathname) === resultModelPath;
              } catch {
                return false;
              }
            });

          const trustedDatabase =
            exactDatabasePage &&
            (
              trustedCuratedDatabase ||
              (modelPathTokens.length >= 1 && fit.pedalHits >= Math.max(0, requiredHits - 1))
            );

          const trustedMarketplace =
            /(^|\.)(reverb\.com|ebay\.com)$/i.test(resultUrl.hostname) &&
            pedalTokens.length > 0 &&
            pedalTokens.every(token => searchIdentity.includes(token)) &&
            builderTokens.length > 0 &&
            builderTokens.every(token => searchIdentity.includes(token));

          // A strongly exact image-search result can be used directly when its
          // title/context/purl carry the complete builder + model identity. This
          // is the fast Google/Bing Images path: do not waste another browser
          // navigation on a source page when the indexed result is already an
          // exact product hit. Generic model names still require a curated page.
          const resultHaystack = normalizedIdentity([
            result.title || '',
            result.context || '',
            result.purl || ''
          ].join(' '));
          const exactPedalPhrase = normalizedIdentity(entry.pedal);
          const exactBuilderPhrase = normalizedIdentity(entry.company);
          let resultPath = '';
          let resultHost = '';
          try {
            const parsedResult = new URL(result.purl || '');
            resultPath = normalizedIdentity(parsedResult.pathname);
            resultHost = parsedResult.hostname.toLowerCase().replace(/^www\./, '');
          } catch {}
          const builderAliases = builderIdentityAliases(entry.company);
          const builderAliasMatch = builderAliases.some(alias =>
            alias.length >= 3 && resultHaystack.includes(alias)
          );
          const meaningfulBuilderTokens = builderTokens.filter(token => token.length >= 4);
          const builderIdentityMatch =
            exactBuilderPhrase.length >= 3 &&
            (
              resultHaystack.includes(exactBuilderPhrase) ||
              builderAliasMatch ||
              (meaningfulBuilderTokens.length >= 2 &&
                meaningfulBuilderTokens.some(token => resultHaystack.includes(token)))
            );
          const pedalIdentityMatch =
            exactPedalPhrase.length >= 3 &&
            (
              resultHaystack.includes(exactPedalPhrase) ||
              (pedalTokens.length > 0 && pedalTokens.every(token => resultHaystack.includes(token)))
            );
          const modelTokenInSourcePath =
            pedalTokens.length === 0 ||
            pedalTokens.some(token => resultPath.includes(token)) ||
            pedalIdentityMatch;
          const likelyProductSourceHost =
            builderTokens.some(token => resultHost.includes(token)) ||
            /reverb|ebay|effectsdatabase|guitarpedalx|talkbass|rockboard|pedal|stomp|effect|guitar|music|audio|shopify|bigcartel|mitienda/.test(resultHost);
          const genericSeoSourcePath =
            /distortion[-_ ]?pedal|pedal[-_ ]?for[-_ ]?rock|best[-_ ]?pedal|top[-_ ]?pedals|roundup|guide|\breview\b/.test(resultPath);
          const strongSearchIdentity =
            builderIdentityMatch &&
            pedalIdentityMatch &&
            modelTokenInSourcePath &&
            likelyProductSourceHost &&
            !genericSeoSourcePath &&
            result.purl &&
            /^https?:/i.test(result.purl);

          // Exact image-search metadata now carries enough identity for a
          // straightforward product hit. Keep a quality floor only for results
          // that do not meet the strong identity gate.
          if (!exactDatabasePage && fit.score < 45 && !strongSearchIdentity) continue;

          // A curated, explicitly verified source page is exact-model evidence.
          // This matters for generic model names such as "Distortion" and
          // "#overdrive", whose normalized token set is intentionally sparse.
          // Trust only a search result whose source page is an exact curated URL.
          const normalizeCuratedPageKey = value => {
            try {
              const parsed = new URL(value);
              let pathname = parsed.pathname.replace(/\/+$/, '');
              // Reverb may surface the same exact listing/product under a
              // country/language prefix such as /ca/item/... or /es/p/...
              // Normalize only that locale prefix while keeping the exact
              // product/listing path and host intact.
              let host = parsed.hostname.toLowerCase().replace(/^www\./, '');
              if (host === 'reverb.com') {
                pathname = pathname.replace(/^\/[a-z]{2}(?:-[a-z]{2})?(?=\/(?:item|p)\/)/i, '');
              }
              return parsed.protocol.toLowerCase() + '//' + host + pathname;
            } catch {
              return String(value || '').replace(/\/+$/, '');
            }
          };

          const curatedSourceUrls = new Set(
            preferredSourcePages(entry).map(normalizeCuratedPageKey)
          );
          const normalizedResultPage = result.purl
            ? normalizeCuratedPageKey(result.purl)
            : '';
          const trustedCuratedSource =
            normalizedResultPage &&
            curatedSourceUrls.has(normalizedResultPage) &&
            (
              entry.image_source_pages_verified === true ||
              entry.image_source_page_verified === true
            );

          if (trustedDatabase || trustedMarketplace || trustedCuratedSource || strongSearchIdentity) {
            verifiedSearch.push({
              url: result.murl,
              thumbnailUrl: result.turl || '',
              sourcePage: result.purl,
              sourceScore: (
                trustedCuratedSource ? 180 :
                trustedDatabase ? 145 :
                trustedMarketplace ? 135 :
                strongSearchIdentity ? 120 :
                105
              ) + Math.min(70, fit.score),
              searchResult: true,
              searchUrl: result.searchUrl,
              strongSearchIdentity
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
          if (identity && pageMatchesSearchIdentity(entry, identity.title, identity.h1)) {
            verifiedSearch.push({
              url: result.murl,
              sourcePage: result.purl,
              sourceScore: 45 + Math.min(70, fit.score),
              searchResult: true,
              searchUrl: result.searchUrl
            });
            continue;
          }

          // Do not accept an arbitrary image-search thumbnail solely because
          // its search metadata claims the right pedal. The source page itself
          // must pass the identity gate, or the result must come from one of the
          // explicitly trusted/curated paths above. This prevents unrelated pages
          // from being mislabelled by search-engine image metadata.
        } catch {}
      }
      diagnostic.verifiedSearchCandidates = verifiedSearch.length;
      const rankedVerifiedSearch = verifiedSearch.sort((a, b) => b.sourceScore - a.sourceScore);
      selectedResult = await tryImages(rankedVerifiedSearch);

      // Last-resort exact visual capture: the source image URL may be blocked
      // even though the search engine has an exact-model thumbnail. Capture the
      // matching verified thumbnail instead of substituting another pedal.
      if (!selectedResult) {
        for (const candidate of rankedVerifiedSearch.slice(0, 12)) {
          const bytes = await screenshotVerifiedSearchImage(candidate);
          if (bytes) {
            selectedResult = { candidate, bytes };
            break;
          }
        }
      }
    }

    // Non-deep-review or generic-name records still get the original
    // source/search fallback order. Deep distinctive names were already given
    // the fast image-search path above.
    if (!selectedResult && IMAGE_SEARCH_ENABLED && !imageSearchFirst) {
      // The existing source/sold/search stages above already ran in this mode.
      // Leave this branch empty intentionally.
    }

    if (!selectedResult) {
      const detail = deepReview
        ? ' [' + JSON.stringify(diagnostic) + ']'
        : '';
      throw new Error('no usable exact-model image candidate found' + detail);
    }

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
      { order: index, pictureDone: row.Picture === 'DONE', pedalInfoDone: row['Pedal Info'] === 'DONE' }
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
      .filter(row =>
        row.Status === 'PARKED' &&
        (Number(row['Deep Review Cycles']) || 0) < MAX_DEEP_REVIEW_CYCLES
      )
      .sort((a, b) =>
        (Number(a['Deep Review Cycles']) || 0) - (Number(b['Deep Review Cycles']) || 0) ||
        String(a.Builder).localeCompare(String(b.Builder)) ||
        String(a.Pedal).localeCompare(String(b.Pedal))
      );
    const reopenLimit = Math.min(30, LIMIT, parkedForDeepReview.length);
    for (const row of parkedForDeepReview.slice(0, reopenLimit)) {
      row.Status = 'DEEP_REVIEW';
      row.Attempts = '0';
      row['Deep Review Cycles'] = String((Number(row['Deep Review Cycles']) || 0) + 1);
      row['Last Failure'] = 'DEEP_REVIEW_STARTED cycle ' + row['Deep Review Cycles'] + ' after parked-photo cutoff.';
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
        // Curated, verified source pages are the highest-confidence recovery
        // leads and should be processed ahead of ordinary alphabetical backlog.
        // Without this priority, exact Effects Database/Reverb leads can sit far
        // below the first 25 fresh tracker rows and never get attempted promptly.
        if (entry.image_source_page_verified === true && entry.image_source_page) value += 100000000;
        else if (entry.image_source_page && /^https?:/i.test(entry.image_source_page)) value += 5000;
        if (meta?.pedalInfoDone) value += 25000;
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
        const sourceRank = entry => {
          const priority = Number(entry.image_source_priority) || 0;
          if (priority > 0) return 1000 + priority;
          if (entry.image_source_page_verified === true && entry.image_source_page) return 2;
          if (entry.image_source_page && /^https?:/i.test(entry.image_source_page)) return 1;
          return 0;
        };
        const aSource = sourceRank(a);
        const bSource = sourceRank(b);
        if (aSource !== bSource) return bSource - aSource;

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
    // Eight slots keeps deep review moving while leaving the majority
    // of each bounded pass for fresh, easier-to-recover records.
    const directImageCases = [...orderedCandidates]
      .filter(entry => /^https?:/i.test(String(entry.image_source_url || '').trim()))
      .sort((a, b) => {
        const aPriority = Number(a.image_source_priority) || 0;
        const bPriority = Number(b.image_source_priority) || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
        const aOrder = trackerMeta.get(key(a.company, a.pedal))?.order;
        const bOrder = trackerMeta.get(key(b.company, b.pedal))?.order;
        if (Number.isFinite(aOrder) && Number.isFinite(bOrder)) return aOrder - bOrder;
        return 0;
      });
    // Photo catch-up is the current project gate. Give every researched,
    // photo-missing record priority over the much larger research+photo backlog.
    // This prevents a 2,500+ row fresh backlog from starving the small set that
    // must be cleared before PRP1 can move forward.
    const researchedPhotoCases = [...orderedCandidates]
      .filter(entry => {
        const meta = trackerMeta.get(key(entry.company, entry.pedal));
        return meta?.pedalInfoDone === true && meta?.pictureDone !== true;
      })
      .sort((a, b) => {
        const aPriority = Number(a.image_source_priority) || 0;
        const bPriority = Number(b.image_source_priority) || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
        const aOrder = trackerMeta.get(key(a.company, a.pedal))?.order;
        const bOrder = trackerMeta.get(key(b.company, b.pedal))?.order;
        if (Number.isFinite(aOrder) && Number.isFinite(bOrder)) return aOrder - bOrder;
        return 0;
      });

    const HARD_CASE_SLOTS = Math.min(16, LIMIT, directImageCases.length + deepCandidates.length);
    const FRESH_CASE_SLOTS = Math.max(0, LIMIT - HARD_CASE_SLOTS);

    // Exact direct-image overrides outrank ordinary hard cases, including
    // records already parked after repeated failures. Those URLs were curated
    // from exact product pages, so they deserve immediate retry priority.
    const directHardCases = directImageCases.slice(0, HARD_CASE_SLOTS);
    const remainingHardSlots = Math.max(0, HARD_CASE_SLOTS - directHardCases.length);
    const highAttemptCases = [...deepCandidates]
      .filter(entry => !directHardCases.some(x => key(x.company, x.pedal) === key(entry.company, entry.pedal)))
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
      .slice(0, remainingHardSlots);
    const hardCases = [...directHardCases, ...highAttemptCases];

    // Put the complete researched-photo catch-up set first. It is intentionally
    // allowed to exceed HARD_CASE_SLOTS because these are the records blocking
    // the next phase. The remaining capacity goes to ordinary unresolved work.
    const catchUpCases = researchedPhotoCases;
    const catchUpKeys = new Set(catchUpCases.map(entry => key(entry.company, entry.pedal)));
    const freshPool = normalCandidates.length
      ? [...normalCandidates, ...deepCandidates]
      : deepCandidates;
    const freshCases = freshPool
      .filter(entry => !catchUpKeys.has(key(entry.company, entry.pedal)))
      .slice(0, Math.max(0, LIMIT - catchUpCases.length));

    const activePool = [...catchUpCases, ...hardCases, ...freshCases]
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
    const allowParkedRetry =
      String(process.env.PHOTO_BROWSER_ALLOW_PARKED_RETRY || 'false').toLowerCase() === 'true';
    if (
      (targetReview?.Status === 'PARKED' || targetAttempts >= MAX_RECOVERY_ATTEMPTS) &&
      !allowParkedRetry
    ) {
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
    if (
      allowParkedRetry &&
      targetReview &&
      (targetReview.Status === 'PARKED' || targetAttempts >= MAX_RECOVERY_ATTEMPTS)
    ) {
      targetReview.Status = 'DEEP_REVIEW';
      targetReview.Attempts = '0';
      targetReview['Deep Review Cycles'] = String((Number(targetReview['Deep Review Cycles']) || 0) + 1);
      targetReview['Last Failure'] =
        'FRESH_SOURCE_RETRY cycle ' + targetReview['Deep Review Cycles'] + ' using broad-source recovery.';
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
        const deepReview =
          review?.Status === 'DEEP_REVIEW' ||
          String(process.env.PHOTO_BROWSER_DEEP_REVIEW || 'false').toLowerCase() === 'true';
        const freshDeadlineMs = Math.max(
          15000,
          Number(process.env.PHOTO_BROWSER_FRESH_RECOVERY_DEADLINE_MS || 45000)
        );
        const entryDeadlineMs = deepReview ? RECOVERY_DEADLINE_MS : Math.min(RECOVERY_DEADLINE_MS, freshDeadlineMs);
        const recoveryPromise = recoverEntry(browser, entry, deepReview, entryDeadlineMs);
        const hardTimeout = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('recovery hard timeout exceeded')),
            entryDeadlineMs + 5000
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