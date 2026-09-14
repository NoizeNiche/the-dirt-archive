(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-01.tsv','discovery-02.tsv','discovery-03.tsv','discovery-04.tsv'];
  const provisionalBuilders = {
    'BLD-DISC-APL-01': {name:'Lectrolab', country:'USA', status:'Historical / rare', description:'Mid-century electronics maker associated with the Fuzz Buzz; Allied marketing/distribution is documented in surviving period material.'},
    'BLD-DISC-APL-02': {name:'Applied Electronics / Applied Audio Products', country:'USA', status:'Historical / OEM attribution', description:'Obscure late-1960s to early-1970s U.S. effects manufacturing lineage associated with several store and house-brand fuzz products.'},
    'BLD-DISC-LR-01': {name:'Lou Rose Music Center', country:'USA', status:'Historical / store brand', description:'New Jersey music-store brand associated with the Lou Rose Combo-Fuzz, attributed to Applied Audio Products.'},
    'BLD-DISC-CONRAD-01': {name:'Conrad', country:'USA', status:'Historical / house brand', description:'Chicago-distributed house brand with surviving late-1960s effects records and unresolved OEM relationships.'},
    'BLD-DISC-KUROSAWA-01': {name:'Kurosawa?', country:'Japan', status:'Provisional attribution', description:'Provisional attribution associated with a rare Japanese The Fuzz specimen carrying Kurosawa/PRAT-7 markings.'},
    'BLD-DISC-JP-UNKNOWN-01': {name:'Unknown Japanese maker', country:'Japan', status:'Unresolved', description:'Unknown Japanese fuzz group preserved from Effects Database relationships; exact maker remains unresolved.'},
    'BLD-DISC-UK-UNKNOWN-01': {name:'Unknown U.K. maker', country:'U.K.', status:'Unresolved', description:'Unresolved British fuzz attribution preserved as a discovery record.'},
    'BLD-DISC-USSR-UNKNOWN-01': {name:'Unknown USSR maker', country:'USSR', status:'Unresolved', description:'Rare Soviet-era effects leads preserved for later specimen and regional research.'},
    'BLD-DISC-POLAND-UNKNOWN-01': {name:'Unknown Polish maker', country:'Poland', status:'Unresolved', description:'Obscure Polish fuzz records preserved as discovery leads.'},
    'BLD-DISC-GERMANY-UNKNOWN-01': {name:'Unknown German maker', country:'Germany', status:'Unresolved', description:'Obscure German fuzz records preserved as discovery leads.'}
  };
  let merged = false;

  async function loadDiscovery(base) {
    const texts = await Promise.all(batches.map(name =>
      nativeFetch(name).then(r => r.ok ? r.text() : '')
    ));
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const builderIds = new Set(base.builders.map(b => b.builder_id));
    for (const [id, info] of Object.entries(provisionalBuilders)) {
      if (builderIds.has(id)) continue;
      base.builders.push({
        builder_id: id,
        name: info.name,
        country: info.country,
        status: info.status,
        founded: null,
        description: info.description,
        primary_source: 'https://www.effectsdatabase.com/type/fuzz'
      });
      builderIds.add(id);
    }
    const existing = new Set(base.pedals.map(p =>
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
