(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-41.tsv'];
  const builders = {
    'BLD-DISC-41-01':{name:'Ace Tone',country:'Japan',status:'Historical',description:'Early Japanese electronic musical instrument and effects brand founded by Ikutaro Kakehashi; an important pre-Roland branch for Japanese fuzz and effects history.',primary_source:'https://www.effectsdatabase.com/model/acetone'},
    'BLD-DISC-41-02':{name:'Dazatronyx',country:'Australia',status:'Boutique / active',description:'Melbourne effects operation by Darron Thornbury spanning germanium amplification, fuzz, overdrive, distortion, tremolo and other handmade effects.',primary_source:'https://www.dazatronyx.com/'},
    'BLD-DISC-41-03':{name:'Lastgasp Art Laboratories',country:'Japan / Australia',status:'Boutique / active lineage',description:'Japanese-founded experimental effects brand associated with an artist based in Australia, known for oscillation, noise, fuzz, filtering and unusual signal-processing instruments.',primary_source:'https://www.effectsdatabase.com/model/lastgasp'},
    'BLD-DISC-41-04':{name:'A.Y.A',country:'Japan',status:'Boutique / active',description:'Tokyo effects builder Makoto Kawai with a small documented catalog spanning fuzz, overdrive, bass drive, compressor and chorus.',primary_source:'https://www.effectsdatabase.com/model/aya'},
    'BLD-DISC-41-05':{name:'Kink Guitar Pedals',country:'Australia',status:'Boutique / active',description:'Melbourne handmade effects builder with vintage-derived fuzzes, overdrives and distortions plus collaborative and artist-oriented designs.',primary_source:'https://kinkguitarpedals.com/'}
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
    catch(err){console.error('Builder-first discovery extension 41 failed:',err);return response;}
  };
})();
