(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-34.tsv'];
  const builders = {
    'BLD-DISC-34-01':{name:'Mojo Hand FX',country:'USA',status:'Historical / acquired',description:'Boutique effects company associated with Mo Handy, Brad Fee and Zach Early; catalog includes fuzz, overdrive, boost, modulation, filter and delay products.',primary_source:'https://www.effectsdatabase.com/model/mojohand'},
    'BLD-DISC-34-02':{name:'DenTone Electronics',country:'USA',status:'Historical / boutique',description:'One-person Vermont effects operation run by Dennis Menard, with a strong vintage-fuzz and vintage-parts focus.',primary_source:'https://www.effectsdatabase.com/model/dentone'},
    'BLD-DISC-34-03':{name:'Erafuzz',country:'USA',status:'Historical / boutique',description:'Rex Thornton’s Tucson, Arizona operation known for hand-built vintage-fuzz-derived designs and a documented early-2010s catalog.',primary_source:'https://www.effectsdatabase.com/model/erafuzz'},
    'BLD-DISC-34-04':{name:'Ghost Effects',country:'UK',status:'Historical / boutique',description:'Ian Sherwen’s Birmingham operation with a compact but unusually useful lineage of Tone Bender, Buzzaround, Zonk and other vintage fuzz recreations.',primary_source:'https://www.effectsdatabase.com/model/ghost'}
  };
  let merged = false;
  async function merge(base) {
    for (const batch of batches) {
      const text = await nativeFetch(batch).then(r => r.ok ? r.text() : '');
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
      console.error('Builder-first discovery extension 34 failed:', err);
      return response;
    }
  };
})();
