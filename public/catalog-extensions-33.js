(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-33.tsv'];
  const builders = {
    'BLD-DISC-33-01':{name:'Kinnatone',country:'USA',status:'Boutique / historical',description:'U.S. effects operation with a small but documented fuzz catalog and a wider modification/service history.',primary_source:'https://www.effectsdatabase.com/model/kinnatone'},
    'BLD-DISC-33-02':{name:'Kinsman FX',country:'Unknown',status:'Historical',description:'Small documented effects line with KAC-series analog delay, high-gain, overdrive, chorus and distortion models.',primary_source:'https://www.effectsdatabase.com/model/kinsman'},
    'BLD-DISC-33-03':{name:'KHDK Electronics',country:'USA',status:'Boutique / active',description:'Boutique guitar-effects company founded by Kirk Hammett and David Karon, with artist-signature and heavy-gain designs.',primary_source:'https://www.effectsdatabase.com/model/khdk'},
    'BLD-DISC-33-04':{name:'Kingsley',country:'Canada',status:'Boutique / active',description:'Simon Jarrett’s tube-pedal company, especially known for valve preamps, overdrives and boosts.',primary_source:'https://www.effectsdatabase.com/model/kingsley'},
    'BLD-DISC-33-05':{name:'Heavy Electronics',country:'USA',status:'Historical / boutique',description:'Sayer Payne’s Minneapolis effects company with a documented lineage of fuzz, distortion, modulation and utility products.',primary_source:'https://www.effectsdatabase.com/model/heavy'},
    'BLD-DISC-33-06':{name:'KOMA Elektronik',country:'Germany',status:'Boutique / active lineage',description:'Berlin-based electronic instrument and effects company with unusual CV-enabled pedals and utility devices.',primary_source:'https://www.effectsdatabase.com/model/koma'},
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-33.tsv').then(r => r.ok ? r.text() : '');
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
      console.error('Builder-first discovery extension 33 failed:', err);
      return response;
    }
  };
})();
