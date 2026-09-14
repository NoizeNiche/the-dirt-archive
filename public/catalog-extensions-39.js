(() => {
  const nativeFetch=window.fetch.bind(window);
  const batches=['discovery-39.tsv'];
  const builders={
    'BLD-DISC-39-01':{name:'Mad Professor',country:'Finland',status:'Boutique / active',description:'Finnish amplifier and effects company associated with Harri Koski, Jukka Mönkkönen and designer Bjorn Juhl, with a substantial drive/fuzz and modulation catalog.',primary_source:'https://www.effectsdatabase.com/model/madprofessor'},
    'BLD-DISC-39-02':{name:'BearFoot FX',country:'USA',status:'Historical / boutique',description:'St. Louis operation run by Donner Rusk in collaboration with BJF Electronics, producing a broad family of BJF-derived overdrives, fuzzes, boosts and utility effects.',primary_source:'https://www.effectsdatabase.com/model/bearfoot'},
    'BLD-DISC-39-03':{name:'One Control',country:'Japan',status:'Boutique / active',description:'Japanese effects company run by Tomokaz Kawamura, including BJF-designed mini pedals, BJFe-derived recreations, loop systems and utility products.',primary_source:'https://www.effectsdatabase.com/model/onecontrol'},
    'BLD-DISC-39-04':{name:'Spaceman Effects',country:'USA',status:'Boutique / active',description:'Portland, Oregon boutique effects company known for limited-run fuzz, boost, overdrive and modulation designs with documented generation and edition histories.',primary_source:'https://www.effectsdatabase.com/model/spaceman'},
    'BLD-DISC-39-05':{name:'Foxpedal',country:'USA',status:'Historical / boutique',description:'Tulsa, Oklahoma boutique effects company with a 21-product documented catalog spanning fuzz, overdrive, boost, delay, modulation and utility products; company activity was winding down by 2023.',primary_source:'https://www.effectsdatabase.com/model/foxpedal'}
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
    try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}
    catch(err){console.error('Builder-first discovery extension 39 failed:',err);return response;}
  };
})();
