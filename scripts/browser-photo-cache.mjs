import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 12));
const CONCURRENCY = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_CONCURRENCY || 3));

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

async function recoverEntry(browser, entry) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.goto(entry.image_source_page, { waitUntil: 'domcontentloaded', timeout: 12000 });
    const title = await page.title().catch(() => '');
    const h1 = await page.locator('h1').first().textContent().catch(() => '');
    if (!pageMatchesIdentity(entry, title, h1)) {
      throw new Error('page identity did not match title/H1');
    }

    const meta = await page.locator('meta[property="og:image"]').getAttribute('content').catch(() => null);
    if (!meta) throw new Error('no og:image found');
    const ogImage = new URL(meta, entry.image_source_page).href;

    const response = await page.request.get(ogImage, { timeout: 10000 });
    const type = (response.headers()['content-type'] || '').toLowerCase();
    if (!response.ok() || !type.startsWith('image/')) {
      throw new Error('og:image fetch failed ' + response.status() + ' ' + type);
    }

    const bytes = await response.body();
    const out = target(entry);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out.replace(/\.webp$/i, '.source'), bytes);
    entry.image_source_url = ogImage;
    return { ok: true, ogImage };
  } finally {
    await page.close().catch(() => {});
  }
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));
  const candidates = (catalog.pedals || [])
    .filter(x => !x.image && x.image_source_page && /^https?:/i.test(x.image_source_page))
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
        m.image_source_url = result.result.ogImage;
        m.image_source_page = entry.image_source_page;
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
