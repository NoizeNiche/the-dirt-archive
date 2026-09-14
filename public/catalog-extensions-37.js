(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-37.tsv'];
  const builders = {
    'BLD-DISC-37-01':{name:'Caroline Guitar Company',country:'USA',status:'Boutique / active',description:'Philippe Herndon’s Columbia, South Carolina pedal company, launched in 2010 and known for Wave Cannon, Icarus, Haymaker, Shigeharu, Hawaiian Pizza and other dirt and modulation designs.',primary_source:'https://carolineguitar.com/product-category/pedals/'},
    'BLD-DISC-37-02':{name:'Rainger FX',country:'UK',status:'Boutique / active',description:'David Rainger’s North West London effects company, founded in 2009, with a distinctive catalog of fuzz, distortion, experimental mini-pedals and pressure-pad-controlled designs.',primary_source:'https://www.raingerfx.com/'},
    'BLD-DISC-37-03':{name:'Red Panda',country:'USA',status:'Boutique / active',description:'Curt Malouin’s Detroit company, founded in 2009, focused on DSP-based experimental effects including Bitmap, Particle, Raster, Tensor and related families.',primary_source:'https://www.redpandalab.com/pedals/'},
    'BLD-DISC-37-04':{name:'Pladask Elektrisk',country:'Norway',status:'Boutique / active',description:'David Rolo-adjacent? No. Independent Bergen, Norway experimental effects company with hand-built digital, analog and hybrid pedals including Vrang and a broad granular/experimental catalog.',primary_source:'https://www.effectsdatabase.com/model/pladask'},
    'BLD-DISC-37-05':{name:'drolo',country:'Belgium',status:'Boutique / active',description:'David Rolo’s rural southern Belgian one-person effects operation, established officially in 2017 and known for experimental DSP, modulation, glitch, fuzz and micro-loop designs.',primary_source:'https://drolofx.com/about/'},
    'BLD-DISC-37-06':{name:'JPTR FX',country:'Germany',status:'Boutique / active',description:'German effects company with a highly individual catalog of fuzz, distortion, overdrive, boost, modulation and experimental devices, including Warlow, Jive, Katastrophe and Super Weirdo.',primary_source:'https://jptrfx.com/collections/all'}
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
    catch(err){console.error('Builder-first discovery extension 37 failed:',err);return response;}
  };
})();
