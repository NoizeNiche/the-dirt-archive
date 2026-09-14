(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-51.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builders = [
      {builder_id:'BLD-DISC-FOXX-01',name:'fOXX / Ridinger Associates Inc.',aliases:'fOXX; Ridinger Associates',country:'USA (California)',status:'Historical / manufacturer',founded:null,description:'Historical California effects maker behind the fOXX Clean Machine, documented in early-1970s period material.',primary_source:'https://www.tonehome.de/foxx/clean-machine/',source_confidence:'High'},
      {builder_id:'BLD-DISC-EKO-01',name:'EKO',aliases:'EKO Musical Instruments',country:'Italy',status:'Historical / manufacturer',founded:null,description:'Italian effects and instrument manufacturer represented here by the early-1970s Multitone multi-effect pedal.',primary_source:'https://www.tonehome.de/eko/',source_confidence:'High'},
      {builder_id:'BLD-DISC-JENNINGS-01',name:'Jennings Electronic Industries (JEI)',aliases:'JEI; Jennings',country:'United Kingdom',status:'Historical / manufacturer',founded:null,description:'British effects maker documented with rotary-control and treadle-style fuzz products beginning in the late 1960s.',primary_source:'https://fuzzboxes.org/jenningsfuzz',source_confidence:'High'},
      {builder_id:'BLD-DISC-MORLEY-01',name:'Morley / Tel-Ray Electronics',aliases:'Morley; Tel-Ray',country:'USA (California)',status:'Historical / active lineage',founded:1946,description:'Los Angeles effects manufacturer lineage behind Morley pedals, including the historically distinctive Power Wah Fuzz.',primary_source:'https://www.morleyproducts.com/the-morley-history/',source_confidence:'High'}
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
      console.error('Independent manufacturer discovery extension 51 failed:', err);
      return response;
    }
  };
})();
