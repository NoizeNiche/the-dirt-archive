(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-43.tsv'];
  const builders = {
    'BLD-DISC-43-01':{name:'Elk',country:'Japan',status:'Historical',description:'Japanese effects and amplifier brand with an important 1970s fuzz, fuzz-wah and echo catalog, including the Big Muff Sustainar and Super Fuzz Sustainar families.',primary_source:'https://www.effectsdatabase.com/model/elk'},
    'BLD-DISC-43-02':{name:'Teisco',country:'Japan',status:'Historical / revived brand',description:'Japanese instrument and effects brand represented by vintage fuzz/OEM products as well as a later revived pedal line.',primary_source:'https://www.effectsdatabase.com/model/teisco'},
    'BLD-DISC-43-03':{name:'Aria',country:'Japan',status:'Historical / active brand',description:'Japanese instrument brand with documented effects families including Diamond, RE, die-cast, XX-10 and other pedal series.',primary_source:'https://www.effectsdatabase.com/model/aria'},
    'BLD-DISC-43-04':{name:'Mirano',country:'Japan',status:'Historical / obscure',description:'Obscure Japanese effects manufacturer associated with vintage fuzzes, boosters and studio/echo equipment.',primary_source:'https://www.effectsdatabase.com/model/mirano/ef1'},
    'BLD-DISC-43-05':{name:'Maccanbell',country:'Japan',status:'Historical / obscure',description:'Rare Japanese brand represented in the surviving record by a Big Muff Sustainar-era fuzz copy.',primary_source:'https://www.effectsdatabase.com/model/maccanbell/bigmuff'}
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
    catch(err){console.error('Builder-first discovery extension 43 failed:',err);return response;}
  };
})();
