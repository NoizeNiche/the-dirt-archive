#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research/PEDAL_INDEX.json');
const MANIFEST = path.join(ROOT, 'research/pedals/PEDAL_IMAGES.json');
const LIMIT = Math.max(1, Number(process.env.PHOTO_BROWSER_CACHE_LIMIT || 20));

function key(builder, pedal) {
  return builder + '\\0' + pedal;
}
function slug(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}
function target(entry) {
  return path.join(ROOT, 'assets/pedals', slug(entry.company), slug(entry.pedal), 'primary.webp');
}
function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const manifestByKey = new Map(manifest.map(x => [key(x.builder, x.pedal), x]));
  const candidates = (catalog.pedals || []).filter(x => !x.image && x.image_source_page && /^https?:/i.test(x.image_source_page));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let recovered = 0;
  let attempted = 0;
  const failures = [];

  for (const entry of candidates) {
    if (attempted >= LIMIT) break;
    const expected = normalize(entry.pedal);
    if (!expected) continue;
    attempted++;
    try {
      await page.goto(entry.image_source_page, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const meta = await page.locator('meta[property="og:image"]').getAttribute('content').catch(() => null);
      const title = await page.title().catch(() => '');
      const h1 = await page.locator('h1').first().textContent().catch(() => '');
      const pageText = normalize(title + ' ' + h1);
      if (!pageText.includes(expected)) {
        failures.push(entry.company + ' - ' + entry.pedal + ': page identity did not match title/H1');
        continue;
      }
      if (!meta) {
        failures.push(entry.company + ' - ' + entry.pedal + ': no og:image found');
        continue;
      }
      const ogImage = new URL(meta, entry.image_source_page).href;
      const response = await page.request.get(ogImage, { timeout: 20000 });
      const type = (response.headers()['content-type'] || '').toLowerCase();
      if (!response.ok() || !type.startsWith('image/')) {
        failures.push(entry.company + ' - ' + entry.pedal + ': og:image fetch failed ' + response.status() + ' ' + type);
        continue;
      }
      const bytes = await response.body();
      const out = target(entry);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out.replace(/\.webp$/i, '.source'), bytes);
      entry.image_source_url = ogImage;
      const m = manifestByKey.get(key(entry.company, entry.pedal));
      if (m) {
        m.image_source_url = ogImage;
        m.image_source_page = entry.image_source_page;
      }
      recovered++;
    } catch (err) {
      failures.push(entry.company + ' - ' + entry.pedal + ': ' + err.message);
    }
  }

  fs.writeFileSync(INDEX, JSON.stringify(catalog, null, 2) + '\n');
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  await browser.close();
  console.log('Browser photo recovery: recovered ' + recovered + '; attempted ' + attempted + '; failures ' + failures.length + '.');
  for (const failure of failures.slice(0, 20)) console.log(' - ' + failure);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
