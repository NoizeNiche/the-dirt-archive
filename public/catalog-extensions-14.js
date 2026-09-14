(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-14.tsv'];
  const builders = {
    'BLD-DISC-FUZZROCIOUS-01':['Fuzzrocious Pedals','USA','Boutique / active and historical','Ryan Ratajski and Shannon Ratajski boutique operation; large catalog with fuzz, gain, modulation and collaboration products.'],
    'BLD-DISC-BMF-01':['BMF Effects','USA','Boutique / historical','Scott Kiraly boutique builder with a documented catalog spanning fuzz, gain, boost, chorus, compression and fixed wah.'],
    'BLD-DISC-DEVI-01':['Devi Ever FX','USA','Boutique / historical and revived','Devi Ever project beginning under Effector 13; later Devi Ever FX and Ooh La La licensed period, with a large experimental fuzz-oriented catalog.'],
    'BLD-DISC-TONEMOB-01':['Tone Mob','USA / collaborations','Boutique / collaboration brand','Collaboration and guest-brand identity appearing across Fuzzrocious and other builders; preserve product-level relationships rather than collapsing manufacturers.']
  };
  let merged = false;
  async function merge(base) {
    const texts = await Promise.all(batches.map(n => nativeFetch(n).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || []; base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v[0],country:v[1],status:v[2],founded:null,description:v[3],primary_source:'https://www.effectsdatabase.com/'});
      ids.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const text of texts) for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Complete lineup discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Captured from a builder-level product catalog. Individual historical research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err) { console.error('Discovery extension 14 failed:',err); return response; }
  };
})();
