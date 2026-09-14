(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-28.tsv'];
  const builders = {
    'BLD-DISC-28-01':{name:'BSM',country:'Germany',status:'Historical',description:'Bernd C. Meiser and Steffi Meiser’s German boutique line focused heavily on vintage treble boosters and artist-specific classic-rock sounds.',primary_source:'https://www.effectsdatabase.com/model/bsm'},
    'BLD-DISC-28-02':{name:'VFE Pedals',country:'USA',status:'Historical / successor lineage',description:'Peter Rutter’s Puyallup, Washington operation, later connected to the v(e) design successor lineage.',primary_source:'https://www.effectsdatabase.com/model/vfe'},
    'BLD-DISC-28-03':{name:'Blackout Effectors',country:'USA / Canada',status:'Historical',description:'Kyle Tompkins’ boutique effects company, founded in Vancouver in 2008 and moved to Asheville in 2009.',primary_source:'https://www.effectsdatabase.com/model/blackout'},
    'BLD-DISC-28-04':{name:'Fredric Effects',country:'UK',status:'Boutique / active',description:'Tim Webster and Stacey Hine’s North London effects company with a catalog spanning fuzz, overdrive, modulation and experimental designs.',primary_source:'https://www.effectsdatabase.com/model/fredric'},
    'BLD-DISC-28-05':{name:'Basic Audio',country:'USA',status:'Boutique / historical-active lineage',description:'John Lyons’ Fayetteville, West Virginia company, making pedals since 1998 and especially associated with fuzz designs.',primary_source:'https://www.effectsdatabase.com/model/basicaudio'},
  };
  let merged = false;
  async function merge(base) {
    const texts = await Promise.all(batches.map(path => nativeFetch(path).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});
      ids.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const text of texts) {
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const [pedal_id,primary_builder_id,primary_category,model_name] = line.split('\t');
        const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
        if (!model_name || existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations, photography and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
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
      console.error('Builder-first discovery extension 28 failed:', err);
      return response;
    }
  };
})();
