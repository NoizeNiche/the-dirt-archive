// The Dirt Archive shared browser runtime.
// Keep catalog identity, escaping, URLs, and loading here.
// Page-specific files should focus only on rendering and interaction.

const ARCHIVE_DATA_INDEX = './research/PEDAL_INDEX.json';
const ARCHIVE_DIRT_TYPES = ['All', 'Overdrive', 'Distortion', 'Fuzz'];

const $ = id => document.getElementById(id);

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function catalogKey(company, pedal) {
  return String(company ?? '') + '\u0000' + String(pedal ?? '');
}

function entryKey(entry) {
  return catalogKey(entry.company, entry.pedal);
}

function isCatalogEntry(entry) {
  return entry?.catalog_role !== 'variation';
}

function detailUrl(entry, variation) {
  const url = new URL('./pedal-detail.html', location.href);
  url.searchParams.set('builder', entry.company);
  url.searchParams.set('pedal', entry.pedal);
  if (variation) url.searchParams.set('variation', variation);
  return url.href;
}

async function loadCatalog() {
  const response = await fetch(ARCHIVE_DATA_INDEX, {cache: 'no-store'});
  if (!response.ok) throw new Error('Catalog request failed: HTTP ' + response.status);
  const data = await response.json();
  if (!data || !Array.isArray(data.pedals)) {
    throw new Error('Catalog payload is missing the pedals array.');
  }
  return data;
}
