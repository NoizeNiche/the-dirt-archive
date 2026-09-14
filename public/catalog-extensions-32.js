(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-32.tsv'];
  const builders = {
    'BLD-DISC-32-01':{name:'Klinger Custom Pedals',country:'Australia',status:'Historical / boutique',description:'Shaun Klinger’s Melbourne, Australia workshop known for handmade vintage-style fuzzes, Tone Bender, Buzzaround, Foxx Tone Machine and high-gain designs.',primary_source:'https://www.effectsdatabase.com/model/klinger'},
    'BLD-DISC-32-02':{name:'KMA Audio Machines',country:'Germany',status:'Boutique / active',description:'Berlin-based effects builder with a broad catalog spanning fuzz, distortion, overdrive, modulation, filtering and utility designs.',primary_source:'https://www.effectsdatabase.com/model/kma'},
    'BLD-DISC-32-03':{name:'Kittycaster FX',country:'USA',status:'Boutique / active',description:'Portland, Oregon effects builder with modern takes on classic fuzz, boost and dirt concepts, including the FXCORE series.',primary_source:'https://www.effectsdatabase.com/model/kittycaster'},
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-32.tsv').then(r => r.ok ? r.text() : '');
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
      console.error('Builder-first discovery extension 32 failed:', err);
      return response;
    }
  };
})();
