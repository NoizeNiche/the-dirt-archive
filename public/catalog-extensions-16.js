(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-16.tsv'];
  const builders = {
    'BLD-DISC-BLACKCAT-01':['Black Cat','USA','Historical / rebuilt boutique','Fred Bonte founded Black Cat in Texas in 1993; the original operation ceased in late 2007 and was later rebuilt as a separate production phase.'],
    'BLD-DISC-BSM-01':['BSM','Germany','Historical / defunct boutique','Bernd C. Meiser and Steffi Meiser boutique manufacturer founded in 2002; operation ceased after Meiser died in 2024.'],
    'BLD-DISC-LOVEPEDAL-01':['Lovepedal','USA','Boutique / historical','Sean Michael Lovepedal catalog with extensive fuzz, overdrive, boost, modulation, delay and amp-oriented products.'],
    'BLD-DISC-MYTHOS-01':['Mythos Pedals','USA','Modern boutique / active','Zach Broyles boutique builder with a broad fuzz, overdrive, boost, modulation and collaboration catalog.'],
    'BLD-DISC-MADPROF-01':['Mad Professor','Finland','Boutique / active','Finnish amplifier and effects company associated with Harri Koski, Jukka Mönkkönen and designer Bjorn Juhl.']
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
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Complete lineup discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Captured from a builder-level catalog. Product-level historical research, variations and image rights research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err) { console.error('Discovery extension 16 failed:',err); return response; }
  };
})();
