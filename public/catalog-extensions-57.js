(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    const rows = await nativeFetch('modern-variant-discovery-03.tsv').then(r => r.ok ? r.text() : '');
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    const defs = [
      {id:'BLD-MOD-EAE-01',name:'Electronic Audio Experiments',aliases:'EAE',country:'USA',status:'Current boutique manufacturer',founded:null},
      {id:'BLD-MOD-DBA-01',name:'Death By Audio',aliases:'DBA',country:'USA',status:'Current boutique manufacturer',founded:null},
      {id:'BLD-MOD-CORNERSTONE-01',name:'Cornerstone Music Gear',aliases:'Cornerstone',country:'Italy',status:'Current manufacturer',founded:null},
      {id:'BLD-MOD-DRUNK-BEAVER-01',name:'Drunk Beaver',aliases:'Drunk Beaver Pedals',country:'Poland',status:'Current boutique manufacturer',founded:null},
      {id:'BLD-MOD-ALEKS-K-01',name:'Aleks K Production',aliases:'Aleks K',country:'Poland',status:'Current manufacturer',founded:null},
      {id:'BLD-MOD-COLORTONE-01',name:'Colortone',aliases:'ColorTone Fx',country:'Italy',status:'Current boutique manufacturer / successor lineage',founded:null},
      {id:'BLD-MOD-L0REZ-01',name:'L0/Rez',aliases:'L0/Rez Effects',country:'USA',status:'Current boutique manufacturer',founded:null},
      {id:'BLD-MOD-ANODE-01',name:'Anode Effects',aliases:'Anode',country:'USA',status:'Current boutique manufacturer',founded:null}
    ];
    const known = new Set(base.builders.map(b => b.builder_id));
    for (const d of defs) if (!known.has(d.id)) { base.builders.push({builder_id:d.id,name:d.name,aliases:d.aliases,country:d.country,status:d.status,founded:d.founded,description:'Modern preservation candidate captured from current/recent revision evidence.',primary_source:'',source_confidence:'Research'}); known.add(d.id); }
    const map = Object.fromEntries(defs.map(d => [d.name,d.id]));
    map['JHS Pedals'] = 'BLD-DISC-JHS-01'; map['Fender'] = 'BLD-MOD-FENDER-01'; map['DOD'] = 'BLD-MOD-DOD-01'; map['REVV Amplification']='BLD-MOD-REVV-01';
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
    catch(err){ console.error('Modern preservation extension 57 failed:',err); return response; }
  };
})();
