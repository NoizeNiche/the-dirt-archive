(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches=['discovery-38.tsv'];
  const builders={
    'BLD-DISC-38-01':{name:'Shin-Ei',country:'Japan',status:'Historical / reissue lineage',description:'Japanese effects manufacturer associated with Companion fuzz, Uni-Fuzz, Uni-Vibe and other 1960s-70s effects; current Shin-Ei also offers historically styled reproductions.',primary_source:'https://www.effectsdatabase.com/model/shinei'},
    'BLD-DISC-38-02':{name:'Guyatone',country:'Japan',status:'Historical / ongoing brand',description:'Japanese instrument and effects maker with multiple historical effect series, including early fuzz, tube distortion/overdrive and later compact products.',primary_source:'https://www.effectsdatabase.com/model/guyatone'},
    'BLD-DISC-38-03':{name:'Jen Elettronica',country:'Italy',status:'Historical / OEM manufacturer',description:'Italian manufacturer from Pescara that produced its own pedals and contract/OEM versions for brands including Vox and others.',primary_source:'https://www.effectsdatabase.com/model/jen'},
    'BLD-DISC-38-04':{name:'Univox',country:'USA / imported Japanese OEM',status:'Historical brand',description:'U.S. retail/import brand with a substantial historical effects lineup, including Japanese-made products and documented OEM relationships such as fOXX-branded/Univox variants.',primary_source:'https://www.effectsdatabase.com/model/univox'},
    'BLD-DISC-38-05':{name:'Maxon',country:'Japan',status:'Historical / active brand',description:'Japanese effects maker with a long history of overdrive, distortion, booster and related products; closely connected to the Japanese production lineage behind several famous 1970s-80s dirt pedals.',primary_source:'https://www.effectsdatabase.com/model/maxon'}
  };
  let merged=false;
  async function merge(base){
    for(const batch of batches){
      const text=await nativeFetch(batch).then(r=>r.ok?r.text():'');
      base.pedals=base.pedals||[]; base.builders=base.builders||[];
      const ids=new Set(base.builders.map(b=>b.builder_id));
      for(const [id,v] of Object.entries(builders)){
        if(ids.has(id)) continue;
        base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'}); ids.add(id);
      }
      const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
      for(const line of text.split(/\r?\n/)){
        if(!line.trim()) continue;
        const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');
        const key=`${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
        if(!model_name||existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
      }
    }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json(); const data=await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}
    catch(err){console.error('Builder-first discovery extension 38 failed:',err);return response;}
  };
})();
