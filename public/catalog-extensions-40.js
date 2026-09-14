(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-40.tsv'];
  const builders = {
    'BLD-DISC-40-01':{name:'BearFoot FX',country:'USA',status:'Boutique / historical',description:'St. Louis boutique effects operation built in collaboration with BJF Electronics, preserving a substantial BJF-connected dirt and utility catalog.',primary_source:'https://www.effectsdatabase.com/model/bearfoot'},
    'BLD-DISC-40-02':{name:'Mad Professor',country:'Finland',status:'Boutique / active',description:'Finnish amplifier and effects company associated with Harri Koski, Jukka Mönkkönen and designer Bjorn Juhl, with a broad boutique pedal catalog.',primary_source:'https://www.effectsdatabase.com/model/madprofessor'},
    'BLD-DISC-40-03':{name:'One Control',country:'Japan',status:'Boutique / active',description:'Japanese effects and signal-management company run by Tomokaz Kawamura, with a large BJF-designed pedal family and extensive loop/utility ecosystem.',primary_source:'https://www.effectsdatabase.com/model/onecontrol'},
    'BLD-DISC-40-04':{name:'Spaceman Effects',country:'USA',status:'Boutique / active lineage',description:'Portland, Oregon boutique builder known for limited-run fuzz, boost, overdrive and experimental effects with numerous numbered generations and editions.',primary_source:'https://www.effectsdatabase.com/model/spaceman'},
    'BLD-DISC-40-05':{name:'Foxpedal',country:'USA',status:'Historical / phasing out',description:'Boutique effects company with a documented 21-product catalog spanning fuzz, overdrive, distortion, boost, delay, reverb and modulation; later catalog history includes a 2023 phasing-out notice.',primary_source:'https://www.effectsdatabase.com/model/foxpedal'}
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
    catch(err){console.error('Builder-first discovery extension 40 failed:',err);return response;}
  };
})();
