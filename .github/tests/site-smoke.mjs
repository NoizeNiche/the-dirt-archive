import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const failures = [];

async function expectText(page, name, hash, selector, text) {
  await page.goto(`${base}/${hash}`, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(250);
  const node = page.locator(selector).first();
  await node.waitFor({state:'visible', timeout:10000});
  const actual = await node.textContent();
  if (!actual?.includes(text)) throw new Error(`${name}: expected ${selector} to contain "${text}", got "${actual}"`);
  console.log(`PASS  ${name}`);
}

const browser = await chromium.launch({headless:true});
const page = await browser.newPage();

page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') failures.push(`console: ${message.text()}`);
});

try {
  const indexResponse = await page.request.get(`${base}/index.html`);
  if (!indexResponse.ok()) throw new Error(`index.html returned HTTP ${indexResponse.status()}`);
  const indexHtml = await indexResponse.text();
  const scriptSources = [...indexHtml.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  if (!scriptSources.length) throw new Error('No JavaScript files are referenced by index.html');
  const missingScripts = [];
  for (const src of scriptSources) {
    const response = await page.request.get(`${base}/${src}`);
    if (!response.ok()) missingScripts.push(`${src} (${response.status()})`);
  }
  if (missingScripts.length) throw new Error(`Missing/broken script files: ${missingScripts.join(', ')}`);
  console.log(`PASS  script references (${scriptSources.length} checked)`);

  const dataResponse = await page.request.get(`${base}/data.json`);
  if (!dataResponse.ok()) throw new Error(`data.json returned HTTP ${dataResponse.status()}`);
  const data = await dataResponse.json();
  for (const key of ['builders','pedals','generations','runs','distinguishers','claims','sources']) {
    if (!Array.isArray(data[key])) throw new Error(`data.json is missing required array: ${key}`);
  }
  const fuzzFace = data.pedals.find(p => String(p.model_name || '').toLowerCase() === 'fuzz face');
  if (!fuzzFace) throw new Error('data.json does not contain the Fuzz Face record');
  if (!data.pedals.some(p => String(p.model_name || '').toLowerCase() === 'park fuzz sound')) throw new Error('data.json does not contain the Park Fuzz Sound lineage test record');
  console.log('PASS  data structure');

  const fuzzFaceGenerationIds = data.generations.filter(g => g.pedal_id === fuzzFace.pedal_id).map(g => g.generation_id);
  const fuzzFaceSpecimenText = await page.request.get(`${base}/catalog-specimen-registry-01.js`).then(r => r.text());
  if (!fuzzFaceSpecimenText.includes("generation_id:'GEN-0001'")) throw new Error('Fuzz Face specimen is not anchored to its documented generation');
  if (!fuzzFaceGenerationIds.includes('GEN-0001')) throw new Error('Fuzz Face generation GEN-0001 is missing from data.json');
  console.log('PASS  generation fixture');

  await expectText(page, 'home', '', 'h1', 'Document');
  await expectText(page, 'builders index', '#/builders', '.detail-title', 'Builders');
  await expectText(page, 'fuzz category', '#/category/fuzz', '.detail-title', 'Fuzz');
  await expectText(page, 'overdrive category', '#/category/overdrive', '.detail-title', 'Overdrive');
  await expectText(page, 'distortion category', '#/category/distortion', '.detail-title', 'Distortion');
  await expectText(page, 'pedal detail', '#/pedal/Fuzz%20Face', '.detail-title', 'Fuzz Face');
  if (await page.locator('.research-status').count() !== 1) throw new Error('Pedal detail did not render exactly one research status row');
  console.log('PASS  pedal research status');
  if (await page.locator('.generation-visual-section').count() !== 1) throw new Error('Fuzz Face did not render the generation guide');
  if (await page.locator('.generation-visual-row').count() !== fuzzFaceGenerationIds.length) throw new Error('Generation guide row count does not match documented generations');
  if (await page.locator('.generation-visual-row').first().locator('img.generation-visual').count() !== 1) throw new Error('Fuzz Face first generation does not expose its cleared visual reference');
  if (await page.locator('.specimen-strip,.specimen-gallery').count() !== 0) throw new Error('Legacy specimen strip/gallery is still rendered');
  console.log('PASS  generation visual guide');
  await expectText(page, 'lineage test pedal detail', '#/pedal/Park%20Fuzz%20Sound', '.detail-title', 'Park Fuzz Sound');
  await page.waitForTimeout(200);
  const lineageCount = await page.locator('#lineage-map').count();
  if (lineageCount !== 1) throw new Error(`Pedal detail did not render exactly one lineage section (found ${lineageCount})`);
  console.log('PASS  pedal lineage section');
  await expectText(page, 'about', '#/about', '.detail-title', 'About');

  await page.goto(`${base}/#/`, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(250);
  const card = page.locator('.pedal-card').filter({hasText:'Fuzz Face'}).first();
  await card.waitFor({state:'visible', timeout:10000});
  if (await card.locator('.research-badge').count() !== 1) throw new Error('Fuzz Face card did not render exactly one research badge');
  console.log('PASS  pedal card research badge');

  await page.goto(`${base}/#/builders`, {waitUntil:'networkidle', timeout:30000});
  const builderLink = page.locator('a.builder-feature').first();
  await builderLink.waitFor({state:'visible', timeout:10000});
  const builderName = (await builderLink.locator('h2').textContent())?.trim();
  if (!builderName) throw new Error('Builders page did not expose a builder destination');
  await builderLink.click();
  await page.waitForTimeout(250);
  const builderTitle = await page.locator('.detail-title').first().textContent();
  if (!builderTitle?.trim()) throw new Error('Builder detail route did not render a title');
  console.log(`PASS  builder detail (${builderName})`);

  await page.goto(`${base}/#/`, {waitUntil:'networkidle', timeout:30000});
  await page.locator('#searchBtn').click();
  await page.locator('#searchDialog').waitFor({state:'visible', timeout:5000});
  await page.locator('#searchInput').fill('Fuzz Face');
  await page.waitForTimeout(150);
  const results = await page.locator('#searchResults').textContent();
  if (!results?.includes('Fuzz Face')) throw new Error('Search did not return Fuzz Face');
  console.log('PASS  search');
  await page.locator('.close').click();
  await page.locator('#searchDialog').waitFor({state:'hidden', timeout:5000});
  console.log('PASS  search close');
} catch (error) {
  console.error(`FAIL  ${error.message}`);
  failures.push(`test: ${error.message}`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error('\nSmoke test failures:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nAll smoke tests passed.');
