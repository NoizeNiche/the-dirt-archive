(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-40.tsv'];
  const builders = {
    'BLD-DISC-40-01':{name:'Stomp Under Foot',country:'USA',status:'Boutique / active',description:'Matt Pasquerella’s Haverhill, Massachusetts operation, known for extensive Big Muff-related work plus Tone Bender, fuzz and overdrive families.',primary_source:'https://www.effectsdatabase.com/model/stompunderfoot'},
    'BLD-DISC-40-02':{name:'BJF Electronics (BJFE)',country:'Sweden',status:'Boutique / active lineage',description:'Björn Juhl’s Stockholm company, founded in 1999, whose designs also appear through BearFoot, Mad Professor and One Control relationships.',primary_source:'https://www.effectsdatabase.com/model/bjfe'},
    'BLD-DISC-40-03':{name:'Pause&Effects',country:'Hungary',status:'Boutique / active',description:'Hungarian hand-built effects operation with vintage-radio enclosure projects, Tone Bender/Fuzz Face/Rangemaster-derived fuzzes and modern utility variants.',primary_source:'https://pauseeffects.com/'},
    'BLD-DISC-40-04':{name:'Tonecat',country:'Australia',status:'Boutique / active',description:'Melbourne boutique pedal builder with a small current catalog and an explicit focus on character-driven fuzz, overdrive and art-pedal presentation.',primary_source:'https://www.tonecat.life/'}
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
