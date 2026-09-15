import { readFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');
const failures = [];

const index = await read('public/index.html');
const sources = [...index.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);

if (!sources.includes('catalog-core-utils.js')) failures.push('core utility layer is not loaded by index.html');
if (!sources.includes('app.js')) failures.push('app.js is not loaded by index.html');
if (!sources.includes('catalog-lineage-static.js')) failures.push('deterministic lineage renderer is not loaded by index.html');
if (sources.includes('catalog-lineage-runtime.js')) failures.push('legacy lineage MutationObserver runtime is still loaded by index.html');

const runtimeFiles = [
  'public/catalog-research-runtime.js',
  'public/catalog-research-ui.js',
  'public/catalog-visual-references.js',
  'public/catalog-polish.js'
];

for (const path of runtimeFiles) {
  const text = await read(path);
  const observers = (text.match(/new MutationObserver/g) || []).length;
  if (path.endsWith('catalog-research-ui.js') && observers > 0) failures.push(`${path} still uses MutationObserver`);
  else if (observers > 0) console.log(`INFO  ${path}: ${observers} MutationObserver instance(s) remain during staged refactor`);
}

const lineageStatic = await read('public/catalog-lineage-static.js');
if (/new MutationObserver/.test(lineageStatic)) failures.push('deterministic lineage renderer must not use MutationObserver');
if (!/window\.pedalPage/.test(lineageStatic)) failures.push('deterministic lineage renderer lost pedalPage integration');
if (!/lineage-map/.test(lineageStatic)) failures.push('deterministic lineage renderer lost lineage section output');

const mediaCanonical = await read('public/catalog-thumbnails-33-runtime.js');
if (!/window\.imageFor\s*=/.test(mediaCanonical)) failures.push('canonical media runtime lost imageFor integration');
const duplicateMediaRuntimes = [35, 36, 37, 38, 39, 40, 41, 42].map(n => `public/catalog-thumbnails-${n}-runtime.js`);
for (const path of duplicateMediaRuntimes) {
  const text = await read(path);
  if (/window\.imageFor\s*=/.test(text)) failures.push(`${path} still implements a duplicate imageFor runtime`);
}

const app = await read('public/app.js');
if (!/function pedalPage\(/.test(app)) failures.push('app.js lost its canonical pedalPage renderer');
if (!/window\.addEventListener\('hashchange',route\)/.test(app)) failures.push('app.js lost canonical route change handling');
if (!/fetch\('data\.json'\)/.test(app)) failures.push('app.js lost its explicit data.json load boundary');

const researchUi = await read('public/catalog-research-ui.js');
if (!/__dirtArchiveResearchCardWrapped/.test(researchUi)) failures.push('research UI card wrapper is missing');
if (!/__dirtArchiveResearchPageWrapped/.test(researchUi)) failures.push('research UI page wrapper is missing');
if (/new MutationObserver/.test(researchUi)) failures.push('research UI still uses MutationObserver');

if (failures.length) {
  console.error('\nArchitecture audit failures:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nArchitecture audit passed.');
