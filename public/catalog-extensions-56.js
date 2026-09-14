(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const rows = await nativeFetch('modern-variant-discovery-02.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const builderDefs = [
      {builder_id:'BLD-MOD-FENDER-01',name:'Fender',aliases:'Fender Musical Instruments',country:'USA',status:'Current manufacturer / effects brand',founded:1946,description:'Current Fender effects program with a documented 2026 V2 redesign wave affecting multiple dirt products.',primary_source:'https://www.fender.com/products/pugilist-v2-distortion',source_confidence:'High'},
      {builder_id:'BLD-MOD-DOD-01',name:'DOD',aliases:'DOD Electronics; DigiTech',country:'USA',status:'Historical/current manufacturer / brand',founded:1974,description:'DOD dirt lineage including the modern 250, 50th Anniversary Edition and 250-X tenth-generation product.',primary_source:'https://digitech.com/dp/overdrive-preamp-250-x/',source_confidence:'High'},
      {builder_id:'BLD-MOD-REVV-01',name:'REVV Amplification',aliases:'REVV Amps; REVV',country:'Canada',status:'Current manufacturer / amplifier and effects brand',founded:null,description:'Modern amplifier and pedal manufacturer with documented 2025 V2 revisions across the G-series.',primary_source:'https://www.guitarpedalx.com/news/gpx-blog-revv-amps-releases-standard-v2-editions-of-its-g-series-g2-g3-g4',source_confidence:'High'}
    ];
    const byId = new Set(base.builders.map(b => b.builder_id));
    for (const b of builderDefs) if (!byId.has(b.builder_id)) { base.builders.push(b); byId.add(b.builder_id); }
    const builderMap = {'Fender':'BLD-MOD-FENDER-01','DOD':'BLD-MOD-DOD-01','REVV Amplification':'BLD-MOD-REVV-01','JHS Pedals':'BLD-DISC-JHS-01'};
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`));
    for (const line of rows.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [id, brand, model, category, period] = line.split('\t');
      const bid = builderMap[brand];
      if (!bid || !model) continue;
      const key = `${bid}::${model.trim().toLowerCase()}`;
      if (existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id:id,primary_builder_id:bid,model_name:model,primary_category:category.split(' / ')[0],subcategory:'Modern preservation / variant research',introduced_year:null,discontinued_year:null,production_status:'Current / research',description:`Modern preservation record for ${model}, captured while manufacturer and period documentation remains abundant.`,archive_status:'Research',confidence:'Verified'});
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
      console.error('Modern preservation extension 56 failed:', err);
      return response;
    }
  };
})();
