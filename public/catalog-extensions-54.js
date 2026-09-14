(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-54.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builders = [
      {builder_id:'BLD-DISC-HOFNER-01',name:'Höfner',aliases:'Hofner',country:'West Germany',status:'Historical manufacturer / effects brand',founded:1887,description:'German instrument maker with a documented effects range beginning in 1967, including fuzz and distortion pedals closely associated with Schaller production.',primary_source:'https://www.vintagehofner.co.uk/factfiles/pedal/pedals.html',source_confidence:'High'},
      {builder_id:'BLD-DISC-BELL-ELECTROLABS-01',name:'Bell Electrolabs',aliases:'Bell',country:'United Kingdom',status:'Historical manufacturer / brand',founded:1977,description:'Small British effects maker from Stokenchurch with a documented module system and a named designer history for its Fuzz and Sustain products.',primary_source:'https://www.blackguitars.com/bell-electrolabs.html',source_confidence:'High'},
      {builder_id:'BLD-DISC-TOP-GEAR-01',name:'Top Gear',aliases:'Top Gear Effects; Hawkes Electronics',country:'United Kingdom',status:'Historical manufacturer / brand',founded:null,description:'British effects maker associated with Len Hawkes and a broad 1970s product range including Fuzz and Fuzz Sustain.',primary_source:'https://www.effectsdatabase.com/model/topgear',source_confidence:'High'},
      {builder_id:'BLD-DISC-LEMON-STUDIOSOUND-01',name:'Lemon StudioSound',aliases:'Lemon Studio Sound',country:'Germany',status:'Historical manufacturer / brand',founded:null,description:'Karlsruhe effects manufacturer founded by Gerard Daleiden in the 1970s, documented with a rare multi-effect range including the Zuzz Thainer fuzz/sustainer/noise-gate.',primary_source:'https://www.tonehome.de/lemon-studiosound/',source_confidence:'High'}
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
      console.error('Independent manufacturer discovery extension 54 failed:', err);
      return response;
    }
  };
})();
