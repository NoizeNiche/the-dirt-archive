(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-15.tsv'];
  const builders = {
    'BLD-DISC-BASICAUDIO-01':['Basic Audio','USA','Boutique / one-person','Fayetteville, West Virginia company owned and operated by John Lyons; pedal production began in 1998.'],
    'BLD-DISC-FREDRIC-01':['Fredric Effects','U.K.','Boutique','Run by Tim Webster and Stacey Hine in Muswell Hill, North London, with occasional help from Tom Webster.'],
    'BLD-DISC-ABOMINABLE-01':['Abominable Electronics','USA','Boutique','Small U.S. effects builder with a documented 17-product Effects Database catalog including fuzz, distortion, modulation, and utility products.'],
    'BLD-DISC-MASF-01':['M.A.S.F.','Japan','Boutique / experimental','Japanese experimental effects project with a compact 17-product historical catalog spanning fuzz, noise, feedback, and oscillator devices.']
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
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Discovery record',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err) { console.error('Discovery extension 15 failed:',err); return response; }
  };
})();
