(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-27.tsv'];
  const builders = {
    'BLD-DISC-27-01':{name:'JHS Pedals',country:'USA',status:'Boutique / active',description:'Josh Scott’s Kansas City effects company, founded as a full-time operation in December 2009 after earlier modification and build work.',primary_source:'https://www.effectsdatabase.com/model/jhspedals'},
    'BLD-DISC-27-02':{name:'Walrus Audio',country:'USA',status:'Boutique / active',description:'Oklahoma City effects company with a broad catalog spanning dirt, modulation, delay, reverb, utility and multi-effect products.',primary_source:'https://www.effectsdatabase.com/model/walrus'},
    'BLD-DISC-27-03':{name:'Old Blood Noise Endeavors',country:'USA',status:'Boutique / active',description:'Independent experimental effects builder with roots in the 2010s boutique scene and a catalog ranging from dirt to highly specialized modulation and ambient devices.',primary_source:'https://www.effectsdatabase.com/model/oldbloodnoise'},
    'BLD-DISC-27-04':{name:'Fairfield Circuitry',country:'Canada',status:'Boutique / active',description:'Hull, Québec builder founded by Guillaume Fairfield, active since 2008 with a deliberately small catalog of distinctive effects.',primary_source:'https://www.effectsdatabase.com/model/fairfield'},
    'BLD-DISC-27-05':{name:'Thorpy FX',country:'U.K.',status:'Boutique / active',description:'Adrian Thorpe’s British boutique effects company, notable for durability-focused construction and collaborations including work with former Lovetone engineer Dan Coggins.',primary_source:'https://www.effectsdatabase.com/model/thorpyfx'},
    'BLD-DISC-27-06':{name:'Mr. Black',country:'USA',status:'Boutique / active',description:'Jack Deville’s effects line, founded as a special division of Jack Deville LTD. in early 2012 and built around its own distinct design and production identity.',primary_source:'https://www.effectsdatabase.com/model/mrblack'}
  };
  let merged=false;
  async function merge(base){
    const text=await nativeFetch('discovery-27.tsv').then(r=>r.ok?r.text():'');
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
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}
    catch(err){console.error('Builder-first discovery extension 27 failed:',err);return response;}
  };
})();
