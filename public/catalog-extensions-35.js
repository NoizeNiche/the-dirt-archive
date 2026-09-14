(() => {
  const nativeFetch = window.fetch.bind(window);
  const builders = {
    'BLD-DISC-35-01': {name:'Arcane Analog',country:'Canada',status:'Boutique / historical',description:'Canadian boutique builder with a compact catalog heavily centered on classic fuzz families including Fuzz Face, Tone Bender, Buzzaround and Big Muff-derived models.',primary_source:'https://www.effectsdatabase.com/model/arcaneanalog'},
    'BLD-DISC-35-02': {name:'Creepy Fingers',country:'USA',status:'Boutique / historical',description:'Brad Davis’s Fullerton, California effects operation, founded in 2008 and known for a substantial fuzz catalog and vintage-derived designs.',primary_source:'https://www.effectsdatabase.com/model/creepyfingers'},
    'BLD-DISC-35-03': {name:'Sabbadius',country:'Argentina',status:'Boutique / active lineage',description:'Nicolás Sabbadin’s Córdoba effects company, established commercially in the early 2000s with fuzz, distortion, overdrive, boost and modulation products.',primary_source:'https://www.effectsdatabase.com/model/sabbadius'},
    'BLD-DISC-35-04': {name:'Stone Deaf FX',country:'UK',status:'Boutique / active lineage',description:'UK effects company associated with Luke Hilton and known for parametric filter, fuzz, distortion, boost and modulation designs.',primary_source:'https://www.effectsdatabase.com/model/stonedeaf'}
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-35.tsv').then(r => r.ok ? r.text() : '');
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});
      ids.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await merge(base);
      merged = true;
      return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}});
    } catch (err) {
      console.error('Builder-first discovery extension 35 failed:', err);
      return response;
    }
  };
})();
