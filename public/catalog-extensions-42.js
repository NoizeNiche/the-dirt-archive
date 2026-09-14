(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-42.tsv'];
  const builders = {
    'BLD-DISC-42-01':{name:'Honey Co. Ltd.',country:'Japan',status:'Historical',description:'Pre-Shin-Ei Japanese effects brand associated with Fumio Mieda and the earliest Honey Super Fuzz lineage.',primary_source:'https://www.effectsdatabase.com/model/honey/babycrying'},
    'BLD-DISC-42-02':{name:'Sekova',country:'USA / Japan OEM',status:'Historical / export brand',description:'U.S.-market export label associated with a broad family of Japanese-made effects, including early wedge fuzzes and Shin-Ei-related products.',primary_source:'https://www.effectsdatabase.com/model/sekova'},
    'BLD-DISC-42-03':{name:'Greco',country:'Japan',status:'Historical / active guitar brand',description:'Japanese guitar brand whose documented effects include early wedge fuzzes, wahs, phase units and multi-effects, with Effects Database identifying its effects as the same as Maxon/Ibanez effects.',primary_source:'https://www.effectsdatabase.com/model/greco'},
    'BLD-DISC-42-04':{name:'Pearl',country:'Japan',status:'Historical',description:'Japanese effects brand with documented Sound Spice and Sound Choice series spanning dirt, modulation, delay, EQ and control products.',primary_source:'https://www.effectsdatabase.com/model/pearl/soundspice'},
    'BLD-DISC-42-05':{name:'Ideal',country:'USA / Japan OEM',status:'Historical / obscure export brand',description:'Rare Ideal-branded Japanese OEM fuzz lineage represented by the late-1960s Fuzz Master and tied visually and mechanically to the broader wedge-fuzz export family.',primary_source:'https://www.effectsdatabase.com/model/ideal/fuzzmaster'}
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
    catch(err){console.error('Builder-first discovery extension 42 failed:',err);return response;}
  };
})();
