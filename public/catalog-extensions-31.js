(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-31.tsv'];
  const builders = {
    'BLD-DISC-31-01':{name:'AnaSounds',country:'France',status:'Boutique / active',description:'French effects builder with wooden/bamboo-bodied pedals, saturation, modulation, time-based and utility products.',primary_source:'https://anasounds.com/products/'},
    'BLD-DISC-31-02':{name:'Leila Vintage Electronics',country:'USA',status:'Historical / boutique',description:'Morgan Hargrave’s Truckee, California one-person operation producing amps and pedals.',primary_source:'https://www.effectsdatabase.com/model/leila'},
    'BLD-DISC-31-03':{name:'Jamés Pedals',country:'Sweden',status:'Boutique / historical',description:'James Bennett’s Örebro-area pedal operation, begun with a fuzz in 2004.',primary_source:'https://www.effectsdatabase.com/model/james'},
    'BLD-DISC-31-04':{name:'Loophole Pedals',country:'USA',status:'Boutique / active',description:'Mike Copeland’s Dallas-area operation, evolving from repair/mod/rehouse services into original finished pedals and custom work.',primary_source:'https://loopholepedals.com/'},
    'BLD-DISC-31-05':{name:'Orion Effekte',country:'Germany',status:'Boutique / active',description:'Jan van Triest’s one-person German effects company with a long fuzz, drive and booster catalog.',primary_source:'https://www.orion-fx.com/'},
    'BLD-DISC-31-06':{name:'G.S. Wyllie',country:'USA',status:'Historical',description:'Glenn S. Wyllie’s highly individual one-person effects and instrument workshop, known for cast enclosures and unusual fuzz designs.',primary_source:'https://www.effectsdatabase.com/model/gswyllie'},
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-31.tsv').then(r => r.ok ? r.text() : '');
    base.pedals = base.pedals || []; base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b=>b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (!ids.has(id)) base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});
    }
    const existing = new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err){ console.error('Builder-first discovery extension 31 failed:',err); return response; }
  };
})();
