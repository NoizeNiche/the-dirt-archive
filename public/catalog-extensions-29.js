(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-29.tsv'];
  const builders = {
    'BLD-DISC-29-01':{name:'Electro-Harmonix',country:'USA',status:'Historical / active',description:'Mike Matthews’ effects company, founded in New York in 1968 and responsible for a large historical catalog spanning fuzz, overdrive, modulation, delay, synthesis and utility products.',primary_source:'https://www.effectsdatabase.com/model/eh'},
    'BLD-DISC-29-02':{name:'Prescription Electronics',country:'USA',status:'Historical / intermittent revival',description:'Jack Brossart’s Portland, Oregon company, associated with distinctive fuzz, octave, boost, tremolo and utility effects.',primary_source:'https://www.effectsdatabase.com/model/prescription'},
    'BLD-DISC-29-03':{name:'D*A*M (Differential Audio Manifestationz)',country:'UK',status:'Boutique / historical',description:'David Main’s South Yorkshire company, built with Linzi Haynes and strongly associated with Tone Bender, Buzzaround and other vintage fuzz-derived products.',primary_source:'https://www.effectsdatabase.com/model/dam'},
    'BLD-DISC-29-04':{name:'Abominable Electronics',country:'USA',status:'Boutique / historical-active lineage',description:'Builder associated with fuzz, distortion and unusual dirt combinations including Hail Satan, Yeti and collaborations.',primary_source:'https://www.effectsdatabase.com/model/abominable'},
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
      console.error('Builder-first discovery extension 29 failed:', err);
      return response;
    }
  };
})();
