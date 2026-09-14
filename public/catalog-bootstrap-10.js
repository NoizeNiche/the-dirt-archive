(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-10.tsv'];
  const provisionalBuilders = {
    'BLD-DISC-KAY-01': {name:'Kay', country:'Japan / USA market', status:'Historical / importer-brand', description:'Kay-branded effects sold in the 1970s; the F-1 Fuzz Tone is a Japanese-made fuzz with a distinctive treadle enclosure.'},
    'BLD-DISC-EXCETRO-01': {name:'Excetro', country:'Japan', status:'Historical / OEM brand', description:'Japanese OEM/export brand represented by 1970s wah and wah-fuzz products related to the broader Ibanez/Bruno/Mica family.'},
    'BLD-DISC-JEN-01': {name:'Jen', country:'Italy', status:'Historical / manufacturer', description:'Jen of Pescara manufactured the Italian continuation of the Vox Tone Bender family and supplied multiple brands.'},
    'BLD-DISC-ELKA-01': {name:'Elka', country:'Italy / export brand', status:'Historical / OEM brand', description:'Italian-market badge represented by a Jen-built Tone Bender-family fuzz.'},
    'BLD-DISC-LUXOR-01': {name:'Luxor', country:'Italy / export brand', status:'Historical / OEM brand', description:'Brand represented by a Jen-built late-1960s Tone Bender-family fuzz and later wah-fuzz products.'},
    'BLD-DISC-UNICORD-01': {name:'Unicord', country:'USA / Italy OEM', status:'Historical / distributor-brand', description:'North American brand under which Jen-built Italian fuzz products were distributed.'},
    'BLD-DISC-GOODFUZZY-01': {name:'Good Fuzzy Sounds', country:'U.K.', status:'Modern boutique', description:'Small builder preserving unusual early-fuzz-inspired designs, including the Bad Nite Fuzz.'}
  };
  let merged = false;

  async function loadDiscovery(base) {
    const texts = await Promise.all(batches.map(name => nativeFetch(name).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const builderIds = new Set(base.builders.map(b => b.builder_id));
    for (const [id, info] of Object.entries(provisionalBuilders)) {
      if (builderIds.has(id)) continue;
      base.builders.push({builder_id:id,name:info.name,country:info.country,status:info.status,founded:null,description:info.description,primary_source:'https://www.effectsdatabase.com/type/fuzz'});
      builderIds.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`));
    for (const text of texts) {
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
        const key = `${primary_builder_id}::${String(model_name || '').trim().toLowerCase()}`;
        if (!model_name || existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Discovery record',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',archive_status:'Research',confidence:'Discovery'});
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
      return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}});
    } catch (err) {
      console.error('Discovery batch 10 failed to load:', err);
      return response;
    }
  };
})();
