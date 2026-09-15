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
if (sources.some(src => /catalog-thumbnails-3[5-9]-runtime\.js|catalog-thumbnails-4[0-2]-runtime\.js/.test(src))) failures.push('retired duplicate media runtime files are still referenced by index.html');

const runtimeFiles = [
  'public/catalog-research-runtime.js',
  'public/catalog-research-ui.js',
  'public/catalog-visual-references.js',
  'public/catalog-polish.js',
  'public/catalog-specimen-ui.js'
];

for (const path of runtimeFiles) {
  const text = await read(path);
  const observers = (text.match(/new MutationObserver/g) || []).length;
  if (observers > 0) {
    if (path.endsWith('catalog-research-ui.js') || path.endsWith('catalog-specimen-ui.js') || path.endsWith('catalog-visual-references.js') || path.endsWith('catalog-research-runtime.js')) failures.push(`${path} still uses MutationObserver`);
    else console.log(`INFO  ${path}: ${observers} MutationObserver instance(s) remain during staged refactor`);
  }
}

const lineageStatic = await read('public/catalog-lineage-static.js');
if (/new MutationObserver/.test(lineageStatic)) failures.push('deterministic lineage renderer must not use MutationObserver');
if (!/window\.pedalPage/.test(lineageStatic)) failures.push('deterministic lineage renderer lost pedalPage integration');
if (!/lineage-map/.test(lineageStatic)) failures.push('deterministic lineage renderer lost lineage section output');

const mediaCanonical = await read('public/catalog-thumbnails-33-runtime.js');
if (!/window\.imageFor\s*=/.test(mediaCanonical)) failures.push('canonical media runtime lost imageFor integration');

const visualRefs = await read('public/catalog-visual-references.js');
if (!/__dirtArchiveVisualCardWrapped/.test(visualRefs)) failures.push('visual reference card wrapper is missing');
if (!/__dirtArchiveVisualPageWrapped/.test(visualRefs)) failures.push('visual reference page wrapper is missing');
if (/new MutationObserver/.test(visualRefs)) failures.push('visual reference runtime still uses MutationObserver');

const recentHome = await read('public/catalog-recent-home.js');
if (/catalog-extensions-8[3-9]\.js/.test(recentHome) || /catalog-extensions-1(?:[0-3]\d|4[0])\.js/.test(recentHome)) failures.push('home runtime must not inject late extension scripts after app bootstrap');
if (/new Function\s*\(/.test(recentHome)) failures.push('home runtime must not evaluate generated JavaScript dynamically');

const specimenUi = await read('public/catalog-specimen-ui.js');
if (!/generation-visual-section/.test(specimenUi)) failures.push('generation guide renderer is missing');
if (!/generation_id/.test(specimenUi)) failures.push('generation guide is not generation-aware');
if (/specimen-strip/.test(specimenUi)) failures.push('legacy specimen strip presentation is still present');
if (/new MutationObserver/.test(specimenUi)) failures.push('specimen UI still uses MutationObserver');

const researchRuntime = await read('public/catalog-research-runtime.js');
if (!/window\.pedalPage/.test(researchRuntime)) failures.push('research runtime lost deterministic pedalPage integration');
if (!/research-dossier/.test(researchRuntime)) failures.push('research runtime lost dossier output');
if (/new MutationObserver/.test(researchRuntime)) failures.push('research runtime still uses MutationObserver');

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
