(() => {
  const nativeFetch = window.fetch.bind(window.fetch);
  const batches = ['discovery-24.tsv'];
  const builders = {
    'BLD-DISC-TOPGEAR-01':['Top Gear','UK','Historical / manufacturer','1970s British effects line designed and manufactured by Len Hawkes at Hawkes Electronics in Sussex.'],
    'BLD-DISC-SMITTY-01':['Smitty Pedals','USA','Boutique','Mark Smith and Kimberly Smith operation in Washington state with a strong focus on vintage-style fuzz and bender pedals.'],
    'BLD-DISC-FRANTONE-01':['Frantone Electronics','USA','Boutique / historical','Frances Caroline Blanche boutique operation associated with distinctive fuzz, modulation and utility designs.'],
    'BLD-DISC-ECPEDALS-01':['EC Pedals','Israel','Boutique / historical','EC Custom Shop run by Eldar Cohen in Netanya, Israel; began in late 2010 with a small original pedal line.']
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
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Complete lineup discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Captured from a builder catalog or current builder source. Product-level historical research, variations and image-rights research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err) { console.error('Discovery extension 24 failed:',err); return response; }
  };
})();
