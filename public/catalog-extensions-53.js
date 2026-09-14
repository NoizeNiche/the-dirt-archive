(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-53.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builders = [
      {builder_id:'BLD-DISC-SCHALLER-01',name:'Schaller',aliases:'Schaller Electronic',country:'West Germany',status:'Historical manufacturer / brand',founded:null,description:'German manufacturer documented with period effects catalogs, including fuzz, distortion and wah products in the early-to-mid 1970s.',primary_source:'https://www.tonehome.de/schaller-electronic/fuzz-sustain/',source_confidence:'High'},
      {builder_id:'BLD-DISC-BLACKFIELD-01',name:'Blackfield Orchester-Elektronik',aliases:'Blackfield',country:'West Germany',status:'Historical manufacturer / brand',founded:null,description:'Rare German effects maker documented with the large Flying Sound fuzz/wah/phaser and a separate Blackfield Fuzz OEM record.',primary_source:'https://www.tonehome.de/blackfield/',source_confidence:'High'}
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
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Independent manufacturer discovery',introduced_year:null,discontinued_year:null,production_status:'Historical / research',description:'Public research record sourced from independent manufacturer/history research. Detailed chronology, editions and production relationships remain under research.',archive_status:'Research',confidence:'Discovery'});
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
      console.error('Independent manufacturer discovery extension 53 failed:', err);
      return response;
    }
  };
})();
