import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const failures = [];

async function expectText(page, name, hash, selector, text) {
  await page.goto(`${base}/${hash}`, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(300);
  const node = page.locator(selector).first();
  await node.waitFor({state:'visible', timeout:10000});
  const actual = await node.textContent();
  if (!actual?.includes(text)) throw new Error(`${name}: expected ${selector} to contain \"${text}\", got \"${actual}\"`);
  console.log(`PASS  ${name}`);
}

const browser = await chromium.launch({headless:true});
const page = await browser.newPage();

page.on('pageerror', error => {
  const stack = error.stack ? `\n${error.stack.split('\n').slice(0,5).join('\n')}` : '';
  failures.push(`pageerror: ${error.message}${stack}`);
});
page.on('console', message => {
  if (message.type() === 'error') failures.push(`console: ${message.text()}`);
});

try {
  const indexResponse = await page.request.get(`${base}/index.html`);
  if (!indexResponse.ok()) throw new Error(`index.html returned HTTP ${indexResponse.status()}`);
  const indexHtml = await indexResponse.text();
  const scriptSources = [...indexHtml.matchAll(/<script[^>]+src=[\"']([^\"']+)[\"']/gi)].map(m => m[1]);
  if (!scriptSources.length) throw new Error('No JavaScript files are referenced by index.html');
  const missingScripts = [];
  for (const src of scriptSources) {
    const response = await page.request.get(`${base}/${src}`);
    if (!response.ok()) missingScripts.push(`${src} (${response.status()})`);
  }
  if (missingScripts.length) throw new Error(`Missing/broken script files: ${missingScripts.join(', ')}`);
  const cssResponse = await page.request.get(`${base}/catalog-experience.css`);
  if (!cssResponse.ok()) throw new Error(`catalog-experience.css returned HTTP ${cssResponse.status()}`);
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

  const fuzzResearch = await page.request.get(`${base}/catalog-research-02.js`).then(r => r.text());
  if (!fuzzResearch.includes("'Fuzz Face': [")) throw new Error('Fuzz Face researched generation map is missing');
  const fuzzFaceSpecimenText = await page.request.get(`${base}/catalog-specimen-registry-01.js`).then(r => r.text());
  if (!fuzzFaceSpecimenText.includes("generation_id:'GEN-fuzz-face-01'")) throw new Error('Fuzz Face specimen is not anchored to the first researched generation');
  console.log('PASS  generation fixture');

  await expectText(page, 'home', '', 'h1', 'Document');
  await expectText(page, 'builders index', '#/builders', '.detail-title', 'Builders');
  await expectText(page, 'fuzz category', '#/category/fuzz', '.detail-title', 'Fuzz');
  await expectText(page, 'overdrive category', '#/category/overdrive', '.detail-title', 'Overdrive');
  await expectText(page, 'distortion category', '#/category/distortion', '.detail-title', 'Distortion');
  await expectText(page, 'pedal detail', '#/pedal/Fuzz%20Face', '.detail-title', 'Fuzz Face');
  if (await page.locator('.research-status').count() !== 1) throw new Error('Pedal detail did not render exactly one research status row');
  const browserGenerationCount = await page.evaluate(() => Array.isArray(window.DIRT_RESEARCH_GENERATIONS?.['Fuzz Face']) ? window.DIRT_RESEARCH_GENERATIONS['Fuzz Face'].length : 0);
  if (browserGenerationCount !== 5) throw new Error(`Browser research layer exposed ${browserGenerationCount} Fuzz Face generations, expected 5`);
  console.log('PASS  browser research generation map');
  const generationSectionCount = await page.locator('.generation-visual-section').count();
  if (generationSectionCount !== 1) {
    const debug = await page.evaluate(() => typeof window.DIRT_GENERATION_GUIDE_DEBUG === 'function' ? window.DIRT_GENERATION_GUIDE_DEBUG() : {debugUnavailable:true,hash:location.hash,headingPresent:!!document.querySelector('.detail-title')});
    console.log(`DEBUG generation guide: ${JSON.stringify(debug)}`);
    throw new Error('Fuzz Face did not render the generation guide');
  }
  const generationRowCount = await page.locator('.generation-visual-row').count();
  if (generationRowCount !== 5) {
    const debug = await page.evaluate(() => ({guideRows:document.querySelectorAll('.generation-visual-row').length,guideHtml:document.querySelector('.generation-visual-section')?.outerHTML.slice(0,4000)||null,state:typeof window.DIRT_GENERATION_GUIDE_DEBUG === 'function' ? window.DIRT_GENERATION_GUIDE_DEBUG() : null}));
    console.log(`DEBUG generation rows: ${JSON.stringify(debug)}`);
    throw new Error(`Generation guide rendered ${generationRowCount} rows, expected five researched Fuzz Face generations`);
  }
  if (await page.locator('.generation-visual-row').first().locator('img.generation-visual').count() !== 1) throw new Error('Fuzz Face first generation does not expose its cleared visual reference');
  if (await page.locator('.specimen-strip,.specimen-gallery').count() !== 0) throw new Error('Legacy specimen strip/gallery is still rendered');
  console.log('PASS  generation visual guide');
  await expectText(page, 'lineage test pedal detail', '#/pedal/Park%20Fuzz%20Sound', '.detail-title', 'Park Fuzz Sound');
  await page.waitForTimeout(200);
  const lineageCount = await page.locator('#lineage-map').count();
  if (lineageCount !== 1) throw new Error(`Pedal detail did not render exactly one lineage section (found ${lineageCount})`);
  console.log('PASS  pedal lineage section');
  await expectText(page, 'about', '#/about', '.detail-title', 'The Dirt Archive');

  await expectText(page, 'identification desk', '#/identify', '.detail-title', 'Identify a pedal');
  if (await page.locator('.identify-results').count() !== 1) throw new Error('Identification desk did not render a candidate results region');
  if (await page.locator('.identify-result').count() < 1) throw new Error('Identification desk did not produce any candidate records');
  console.log('PASS  identification desk');

  await expectText(page, 'photo desk', '#/photos', '.detail-title', 'Build the picture');
  const photoCards = await page.locator('.photo-card').count();
  const browserDirtRecords = await page.evaluate(() => Array.isArray(window.DATA?.pedals) ? window.DATA.pedals.filter(p => ['Fuzz','Overdrive','Distortion'].includes(p.primary_category)).length : 0);
  if (photoCards !== browserDirtRecords) throw new Error(`Photo desk rendered ${photoCards} records, expected ${browserDirtRecords}`);
  const photoReady = await page.locator('.photo-card-status.ready').count();
  if (photoReady < 1) throw new Error('Photo desk did not recognize any archive-ready visual records');
  console.log(`PASS  photo desk (${photoCards} dirt records enrolled)`);

  await page.goto(`${base}/#/`, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(250);
  const cards = page.locator('.pedal-card');
  const cardCount = await cards.count();
  if (cardCount < 1) throw new Error('Home page did not render any pedal cards');
  const card = cards.first();
  if (await card.locator('.research-badge').count() !== 1) throw new Error('Home pedal card did not render exactly one research badge');
  const thumbnailHeight = await card.locator('.pedal-image').evaluate(el => Math.round(el.getBoundingClientRect().height));
  if (thumbnailHeight > 120) throw new Error(`Pedal thumbnail is not compact enough (${thumbnailHeight}px)`);
  console.log(`PASS  compact pedal thumbnail (${thumbnailHeight}px)`);
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