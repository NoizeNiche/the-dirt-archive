(() => {
  const nativeFetch=window.fetch.bind(window);
  let merged=false;
  async function merge(base){
    const text=await nativeFetch('discovery-47.tsv').then(r=>r.ok?r.text():'');
    base.pedals=base.pedals||[]; base.builders=base.builders||[];
    const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for(const line of text.split(/\r?\n/)){
      if(!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');
      const key=`${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
      if(!model_name||existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Colorsound / Sola Sound discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated from the documented Colorsound/Sola Sound catalog. Detailed chronology, variants and cross-brand relationships pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Discovery extension 47 failed:',e);return response;}
  };
})();
