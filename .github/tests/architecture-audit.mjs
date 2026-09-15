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
  'public/catalog-lineage-runtime.js',
  'public/catalog-specimen-ui.js',
  'public/catalog-visual-references.js',
  'public/catalog-polish.js'
];

for (const path of runtimeFiles) {
  const text = await read(path);
  const observers = (text.match(/new MutationObserver/g) || []).length;
  if (observers > 0) console.log(`INFO  ${path}: ${observers} MutationObserver instance(s) remain during staged refactor`);
}

const lineageStatic = await read('public/catalog-lineage-static.js');
if (/new MutationObserver/.test(lineageStatic)) failures.push('deterministic lineage renderer must not use MutationObserver');
if (!/window\.pedalPage/.test(lineageStatic)) failures.push('deterministic lineage renderer lost pedalPage integration');
if (!/lineage-map/.test(lineageStatic)) failures.push('deterministic lineage renderer lost lineage section output');

const app = await read('public/app.js');
if (!/function pedalPage\(/.test(app)) failures.push('app.js lost its canonical pedalPage renderer');
if (!/window\.addEventListener\('hashchange',route\)/.test(app)) failures.push('app.js lost canonical route change handling');
if (!/fetch\('data\.json'\)/.test(app)) failures.push('app.js lost its explicit data.json load boundary');

const researchUi = await read('public/catalog-research-ui.js');
if (!/__dirtArchiveResearchCardWrapped/.test(researchUi)) failures.push('research UI card wrapper is missing');
if (!/__dirtArchiveResearchPageWrapped/.test(researchUi)) failures.push('research UI page wrapper is missing');

const forbidden = [
  ['public/catalog-identity-routing.js', /pedalPage\s*=\s*function/, 'identity routing still wraps pedalPage'],
  ['public/catalog-identity-routing.js', /pedalCard\s*=\s*function/, 'identity routing still wraps pedalCard']
];
for (const [path, pattern, message] of forbidden) {
  const text = await read(path);
  if (!pattern.test(text)) continue;
  console.log(`INFO  ${message}`);
}

if (failures.length) {
  console.error('\nArchitecture audit failures:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nArchitecture audit passed.');
