(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-22.tsv'];
  const builders = {
    'BLD-DISC-EMPRESS-01':['Empress Effects','Canada','Boutique / active','Ottawa pedal company founded in 2005 by Steve Bragg; catalog includes dirt, dynamics, modulation, delay and utility products.'],
    'BLD-DISC-GUILD-01':['Guild','USA / OEM network','Historical / manufacturer / OEM network','American guitar brand with a late-1960s/1970s effects catalog spanning Applied Audio, Aria, fOXX and Top Gear-built models.'],
    'BLD-DISC-DENTONE-01':['DenTone Electronics','USA','Historical / one-person boutique','One-man operation associated with Dennis Menard in Vermont, known for small-run fuzz, boost and drive experiments.'],
    'BLD-DISC-MONTGOMERY-01':['Montgomery Appliances','USA','Boutique / one-person','David Gill one-man operation from Montgomery County, Maryland, with early small runs and a later fuzz-focused catalog.'],
    'BLD-DISC-BLUESKOOL-01':['Blue Skool Records','USA','Historical / boutique','Small-run handmade effects label documented in the 2010s, including fuzz, boost and drive designs.']
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
    catch(err) { console.error('Discovery extension 22 failed:',err); return response; }
  };
})();
