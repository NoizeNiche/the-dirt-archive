(() => {
  const nativeFetch = window.fetch.bind(window);
  const batch = 'discovery-11.tsv';
  const provisionalBuilders = {
    'BLD-DISC-WALCO-01': {name:'Walco', country:'Japan / export', status:'Historical / importer-brand', description:'Vintage effects badge associated with compact Japanese fuzz products, including the distinctive belt-clip Fuzz Tone Generator.'},
    'BLD-DISC-VTP-01': {name:'Vintage Tone Project', country:'USA', status:'Boutique / historical', description:'Small U.S. builder active in the 2000s, preserved here for early boutique-era fuzz history.'},
    'BLD-DISC-IDEEN-01': {name:'IDEEN Tech', country:'Canada', status:'Boutique / small builder', description:'Canadian builder represented by the True Friend Fuzz and vintage-germanium-oriented product work.'},
    'BLD-DISC-DEVI-01': {name:'Devi Ever FX', country:'USA', status:'Boutique / historical', description:'Devi Ever-era effects maker whose early catalog helped define the 2000s experimental boutique fuzz scene.'},
    'BLD-DISC-AREA51-01': {name:'Area 51', country:'USA', status:'Boutique', description:'Small builder represented by the Area 51 Fuzz, preserving an early-2000s/late-2000s boutique interpretation of the Fuzz Face family.'},
    'BLD-DISC-KLINGER-01': {name:'Klinger Custom Pedals', country:'Australia', status:'Boutique / historical', description:'Melbourne-based small builder represented by the Jimi Fuzz and vintage-oriented boutique work.'}
  };
  let merged = false;
  async function load(base) {
    const text = await nativeFetch(batch).then(r => r.ok ? r.text() : '');
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const builderIds = new Set(base.builders.map(b => b.builder_id));
    for (const [id, info] of Object.entries(provisionalBuilders)) {
      if (builderIds.has(id)) continue;
      base.builders.push({builder_id:id,name:info.name,country:info.country,status:info.status,founded:null,description:info.description,primary_source:'https://www.effectsdatabase.com/type/fuzz'});
      builderIds.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`));
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name || '').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Discovery record',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await load(base);
      merged = true;
      return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}});
    } catch (err) {
      console.error('Discovery batch 11 failed to load:', err);
      return response;
    }
  };
})();
