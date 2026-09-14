(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-13.tsv'];
  const builders = {
    'BLD-DISC-ALLSOUND-01':['Allsound','West Germany','Historical / OEM brand','European brand associated with Schaller-family fuzz-sustain products.'],
    'BLD-DISC-DALLAS-ARBITER-01':['Dallas-Arbiter','U.K. / Italian OEM','Historical / brand','British brand associated with Italian Jen-built effects and later Dallas-Arbiter products.'],
    'BLD-DISC-ROADRUNNER-01':['Roadrunner','France','Modern / historical boutique','French hand-built effects builder whose Supersonic Fuzz dates from the 1990s.'],
    'BLD-DISC-GENERAL-GUITAR-GADGETS-01':['General Guitar Gadgets','USA','DIY / documentation','DIY-oriented project source and replica catalog; keep distinct from original historical manufacturers.'],
    'BLD-DISC-SQUIRREL-01':['Squirrel Audio','U.K.','Boutique / historical','British hand-assembled effects builder with Shin-Ei and Ampeg-inspired fuzz lineage.'],
    'BLD-DISC-ANASOUNDS-01':['AnaSounds','France','Modern boutique','French boutique builder with a substantial modern fuzz and gain catalog.']
  };
  let merged = false;
  async function merge(base) {
    const texts = await Promise.all(batches.map(n => nativeFetch(n).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || []; base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v[0],country:v[1],status:v[2],founded:null,description:v[3],primary_source:'https://www.effectsdatabase.com/type/fuzz'});
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
    catch(err) { console.error('Discovery extension 13 failed:',err); return response; }
  };
})();
