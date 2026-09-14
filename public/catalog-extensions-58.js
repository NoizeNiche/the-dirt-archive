(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const rows = await nativeFetch('modern-variant-discovery-04.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const defs = [
      {id:'BLD-MOD-EMPTYHEAD-01',name:'Empty Head Effects',country:'USA'},
      {id:'BLD-MOD-BEETRONICS-01',name:'Beetronics',country:'Netherlands'},
      {id:'BLD-MOD-BSRI-01',name:'BSRI Audio',country:'USA'},
      {id:'BLD-MOD-TRIODE-01',name:'Triode Pedals',country:'USA'},
      {id:'BLD-MOD-ONEDER-01',name:'Oneder Effects',country:'USA'}
    ];
    const known = new Set(base.builders.map(b => b.builder_id));
    for (const d of defs) if (!known.has(d.id)) { base.builders.push({builder_id:d.id,name:d.name,aliases:'',country:d.country,status:'Current manufacturer',founded:null,description:'Modern preservation candidate captured from recent revision evidence.',primary_source:'',source_confidence:'Research'}); known.add(d.id); }
    const map = Object.fromEntries(defs.map(d => [d.name,d.id]));
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').toLowerCase()}`));
    for (const line of rows.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [id,brand,model,category,period] = line.split('\t'); const bid = map[brand]; if (!bid) continue;
      const key = `${bid}::${model.toLowerCase()}`; if (existing.has(key)) continue; existing.add(key);
      base.pedals.push({pedal_id:id,primary_builder_id:bid,model_name:model,primary_category:category.split(' / ')[0],subcategory:'Modern preservation / variant research',introduced_year:null,discontinued_year:null,production_status:'Modern / research',description:`Modern preservation record for ${model}, captured from recent revision evidence.`,archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base=await response.clone().json(); const data=await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err){ console.error('Modern preservation extension 58 failed:',err); return response; }
  };
})();
