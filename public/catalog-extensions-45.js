(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-45.tsv'];
  const builders = {
    'BLD-DISC-45-01': {
      name:'Colorsound / Sola Sound',
      country:'UK',
      status:'Historical / reissue activity',
      description:'Colorsound was the Macari/Sola Sound effects brand associated with a broad British effects catalog. This discovery snapshot focuses on its overdrive, distortion, fuzz and combination-effects products.',
      primary_source:'https://www.effectsdatabase.com/model/colorsound'
    }
  };
  let merged=false;
  async function merge(base){
    for(const batch of batches){
      const text=await nativeFetch(batch).then(r=>r.ok?r.text():'');
      base.pedals=base.pedals||[]; base.builders=base.builders||[];
      const ids=new Set(base.builders.map(b=>b.builder_id));
      for(const [id,v] of Object.entries(builders)){
        if(ids.has(id)) continue;
        base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});
        ids.add(id);
      }
      const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
      for(const line of text.split(/\r?\n/)){
        if(!line.trim()) continue;
        const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');
        const key=`${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
        if(!model_name||existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Colorsound / Sola Sound discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Colorsound product enumerated from the documented Colorsound/Sola Sound catalog. Product chronology, variants and cross-brand relationships pending detailed research.',archive_status:'Research',confidence:'Discovery'});
      }
    }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}
    catch(err){console.error('Builder-first discovery extension 45 failed:',err);return response;}
  };
})();
