(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-01.tsv','discovery-02.tsv','discovery-03.tsv'];
  let merged = false;

  async function loadDiscovery(base) {
    const texts = await Promise.all(batches.map(name =>
      nativeFetch(name).then(r => r.ok ? r.text() : '')
    ));
    const existing = new Set((base.pedals || []).map(p =>
      `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`
    ));
    for (const text of texts) {
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
        const key = `${primary_builder_id}::${String(model_name || '').trim().toLowerCase()}`;
        if (!model_name || existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({
          pedal_id,
          primary_builder_id,
          model_name,
          primary_category,
          subcategory: 'Discovery record',
          introduced_year: null,
          discontinued_year: null,
          production_status: 'Discovery',
          description: 'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',
          archive_status: 'Research',
          confidence: 'Discovery'
        });
      }
    }
    return base;
  }

  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await loadDiscovery(base);
      merged = true;
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
      });
    } catch (err) {
      console.error('Discovery layer failed to load:', err);
      return response;
    }
  };
})();
