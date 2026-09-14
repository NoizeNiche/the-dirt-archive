(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-52.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builders = [
      {builder_id:'BLD-DISC-JEN-01',name:'JEN Elettronica',aliases:'JEN; Jen Elettronica; JEN elettronica',country:'Italy',status:'Historical / OEM manufacturer / brand',founded:1967,description:'Italian effects manufacturer and OEM associated with Vox and other labels, while also marketing pedals under the JEN name.',primary_source:'https://www.tonehome.de/jen/',source_confidence:'High'},
      {builder_id:'BLD-DISC-HERALD-01',name:'Herald Electronics',aliases:'Herald',country:'Japan',status:'Historical / OEM manufacturer',founded:null,description:'Japanese historical effects manufacturer documented through the AM-44A Fuzz Master and a multi-brand distribution trail.',primary_source:'https://www.effectsdatabase.com/model/herald/fuzzmaster',source_confidence:'High'},
      {builder_id:'BLD-DISC-SELMER-01',name:'Selmer',aliases:'Selmer London; Selmer UK',country:'United Kingdom',status:'Historical manufacturer / brand',founded:null,description:'British musical-instrument manufacturer documented with the Fuzz-Wah, including surviving designer testimony and 1968 period advertising.',primary_source:'https://www.vintagehofner.co.uk/gallery/gallery3/wah.html',source_confidence:'High'},
      {builder_id:'BLD-DISC-MORESCHI-01',name:'Cav. Giovanni Moreschi / Moreschi',aliases:'Moreschi',country:'Italy',status:'Historical manufacturer',founded:null,description:'Castelfidardo Italian manufacturer, primarily known for accordions, that produced a short-lived effects line in cooperation with Gary Hurst / Electronic Sounds.',primary_source:'https://www.effectsdatabase.com/model/moreschi/octavefuzz',source_confidence:'High'}
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
      console.error('Independent manufacturer discovery extension 52 failed:', err);
      return response;
    }
  };
})();
