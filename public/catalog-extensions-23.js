(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-23.tsv'];
  const builders = {
    'BLD-DISC-EQD-01':['EarthQuaker Devices','USA','Boutique / active','Akron, Ohio effects company founded by Jamie Stillman; began in 2005 and grew from one-person experimentation into a major independent pedal builder.'],
    'BLD-DISC-DBA-01':['Death By Audio','USA','Boutique / active','Oliver Ackermann founded Death By Audio in 2002; the company developed from a web-based customization service and later the Williamsburg workshop into a handmade Queens, NYC pedal operation.'],
    'BLD-DISC-EAE-01':['Electronic Audio Experiments','USA','Boutique / active','Boston company founded by guitarist and electrical engineer John Snyder in 2015, combining original designs with carefully documented homages to older circuits.'],
    'BLD-DISC-BAT-01':['Black Arts Toneworks','USA','Boutique / active','Mark Wentz runs the Chattanooga, Tennessee company; Black Arts Toneworks has been building pedals since 2010 with a strong focus on high-gain dirt.'],
    'BLD-DISC-FULLTONE-01':['Fulltone','USA','Historical / revived','Fulltone was founded by Michael Fuller in 1991. California operations were suspended in 2022; Fulltone USA launched in 2024 under a licensing partnership with Brad Jackson/Jackson Audio.']
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
    catch(err) { console.error('Discovery extension 23 failed:',err); return response; }
  };
})();
