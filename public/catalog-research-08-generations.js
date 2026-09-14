(() => {
  const generations={
    'Maestro|FZ-1S Fuzz-Tone':[
      {label:'FZ-1S Super-Fuzz',years:'1970s',notes:'Later Maestro Fuzz-Tone branch with a distinctive expanded control/selector layout and large wedge-style enclosure. Exact factory start/end years remain incompletely documented.'}
    ],
    'Maestro|FZ-2 Fuzz-Tone':[
      {label:'Canadian Turner production',years:'late 1960s',notes:'Rare Toronto-associated Fuzz-Tone branch retaining the broad wedge family appearance but distinct from the U.S.-built FZ-1B.'}
    ],
    'Maestro|MFZ-1 Fuzz':[
      {label:'Norlin / Total Foot Control MFZ-1',years:'1976–1978',notes:'Unconventional wedge chassis with a full-surface footswitch and foot-accessible Drive and Volume controls.'}
    ],
    'Vox|V828 Tone Bender':[
      {label:'Early Italian V828',years:'late 1960s',notes:'JEN-built Vox/Thomas Organ branch with black or grey textured die-cast housing and two-knob Attack/Level layout.'},
      {label:'Later V828 production',years:'early 1970s',notes:'Later examples retain the Italian V828 identity while external and component details vary across surviving examples.'}
    ],
    'Vox|V8281 Tone Bender':[
      {label:'Early V8281',years:'late 1960s–early 1970s',notes:'Distinct JEN-built model using the Italian die-cast family enclosure with multiple documented panel/finish variants.'},
      {label:'Later V8281 variants',years:'1970s',notes:'Black/grey housing and panel combinations occur; exact chronological ordering remains incompletely documented.'}
    ]
  };
  function apply(base){
    base.pedals=base.pedals||[];
    for(const p of base.pedals){
      const b=(base.builders||[]).find(x=>x.builder_id===p.primary_builder_id);
      const gens=generations[`${b?.name||''}|${p.model_name||''}`];
      if(gens) { p.archive_research=p.archive_research||{}; p.archive_research.generations=gens; }
    }
    return base;
  }
  let merged=false;
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 08 generation layer failed:',e);return response;}};
})();
