import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const checks = [
  {name:'home', hash:'', selector:'h1', text:'Document'},
  {name:'builders index', hash:'#/builders', selector:'.detail-title', text:'Builders'},
  {name:'fuzz category', hash:'#/category/fuzz', selector:'.detail-title', text:'Fuzz'},
  {name:'overdrive category', hash:'#/category/overdrive', selector:'.detail-title', text:'Overdrive'},
  {name:'distortion category', hash:'#/category/distortion', selector:'.detail-title', text:'Distortion'},
  {name:'pedal detail', hash:'#/pedal/Fuzz%20Face', selector:'.detail-title', text:'Fuzz Face'},
  {name:'about', hash:'#/about', selector:'.detail-title', text:'About'}
];

const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const failures = [];

page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') failures.push(`console: ${message.text()}`);
});

try {
  for (const check of checks) {
    const url = `${base}/${check.hash}`;
    await page.goto(url, {waitUntil:'networkidle', timeout:30000});
    await page.waitForTimeout(250);
    const node = page.locator(check.selector).first();
    await node.waitFor({state:'visible', timeout:10000});
    const text = await node.textContent();
    if (!text?.includes(check.text)) {
      throw new Error(`Expected ${check.selector} to contain "${check.text}", got "${text}"`);
    }
    console.log(`PASS  ${check.name}`);
  }

  await page.goto(`${base}/#/`, {waitUntil:'networkidle', timeout:30000});
  const searchButton = page.locator('#searchBtn');
  await searchButton.click();
  await page.locator('#searchDialog').waitFor({state:'visible', timeout:5000});
  const searchInput = page.locator('#searchInput');
  await searchInput.fill('Fuzz Face');
  await page.waitForTimeout(100);
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
