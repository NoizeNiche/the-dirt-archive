// The Dirt Archive shared browser runtime.
// Keep catalog identity, escaping, URLs, and loading here.
// Page-specific files should focus only on rendering and interaction.

const ARCHIVE_DATA_INDEX = new URL('./research/PEDAL_INDEX.json', location.href).href;
const ARCHIVE_DIRT_TYPES = Object.freeze(['All', 'Overdrive', 'Distortion', 'Fuzz']);

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

let archiveCatalogPromise = null;

function loadCatalog() {
  if (archiveCatalogPromise) return archiveCatalogPromise;

  archiveCatalogPromise = fetch(ARCHIVE_DATA_INDEX, {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error('Catalog request failed: HTTP ' + response.status);
      return response.json();
    })
    .then(async data => {
      if (!data || !Array.isArray(data.pedals)) {
        throw new Error('Catalog payload is missing the pedals array.');
      }

      // Small, separately maintained photo overrides let verified replacement
      // images reach the live site without rewriting the large catalog file.
      // Existing catalog images always win over an override.
      try {
        const overrideResponse = await fetch(
          new URL('./research/PEDAL_IMAGE_OVERRIDES.json', location.href).href,
          {cache: 'no-store'}
        );
        if (overrideResponse.ok) {
          const payload = await overrideResponse.json();
          const overrides = Array.isArray(payload.overrides) ? payload.overrides : [];
          const byKey = new Map(
            overrides.map(x => [catalogKey(x.builder, x.pedal), x])
          );
          data.pedals = data.pedals.map(entry => {
            if (entry.image) return entry;
            const override = byKey.get(entryKey(entry));
            if (!override?.image) return entry;
            return {
              ...entry,
              image: override.image,
              image_source_page: override.source_page || entry.image_source_page
            };
          });
        }
      } catch (overrideError) {
        console.warn('Photo override layer unavailable:', overrideError);
      }

      return data;
    })
    .catch(error => {
      archiveCatalogPromise = null;
      throw error;
    });

  return archiveCatalogPromise;
}
