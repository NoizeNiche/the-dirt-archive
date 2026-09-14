(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-55.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builders = [
      {builder_id:'BLD-DISC-FIRSTMAN-HILLWOOD-01',name:'Firstman / Hillwood',aliases:'Firstman; Firstman Electronics; Hillwood; HILLWOOD',country:'Japan',status:'Historical manufacturer / brand / OEM',founded:1967,description:'Japanese historical manufacturer/brand lineage that later operated as Hillwood and supplied OEM effects including the late-1970s Multivox Big Jam series.',primary_source:'https://www.guitarpedalx.com/news/decades-pedals-perfectly-revives-and-improves-multivoxs-1978-big-jam-distortion-which-sits-sort-of-adjacent-to-but-distinct-from-the-early-mxr-distortion-and-dod250',source_confidence:'Medium-High'}
    ];
    const existingBuilders = new Set(base.builders.map(b => b.builder_id));
    for (const builder of builders) if (!existingBuilders.has(builder.builder_id)) { base.builders.push(builder); existingBuilders.add(builder.builder_id); }
    const existingPedals = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`));
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
      if (!model_name || !['Fuzz','Overdrive','Distortion'].includes(primary_category)) continue;
      const key = `${primary_builder_id}::${String(model_name).trim().toLowerCase()}`;
      if (existingPedals.has(key)) continue;
      existingPedals.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Independent manufacturer discovery',introduced_year:1978,discontinued_year:null,production_status:'Historical / research',description:'Public research record sourced from independent manufacturer and historical OEM research. Detailed chronology, editions and production relationships remain under research.',archive_status:'Research',confidence:'Discovery'});
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
      console.error('Independent manufacturer discovery extension 55 failed:', err);
      return response;
    }
  };
})();
