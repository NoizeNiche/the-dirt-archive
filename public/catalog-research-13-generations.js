(() => {
  const generations={
    'Colorsound / Sola Sound|Colorsound Bass Fuzz':[
      {label:'1990s revival Bass Fuzz',years:'c.1990s–2000s',notes:'Later Colorsound product inspired by the 1970s Supa/Jumbo/B&M Big Muff-derived branch; not a vintage 1970s catalog model.'}
    ],
    'Colorsound / Sola Sound|Colorsound Fuzz Phazer':[
      {label:'Treadle Fuzz Phazer',years:'early 1970s',notes:'Treadle controls the phaser rate; fuzz and phaser occupy a combined performance-oriented enclosure.'}
    ],
    'Colorsound / Sola Sound|Colorsound Fuzzphaze':[
      {label:'Expanded Fuzzphaze',years:'early 1970s',notes:'Related to the Fuzz Phazer but distinguished by its additional external controls.'}
    ],
    'Colorsound / Sola Sound|Colorsound Wah-Fuzz-Straight':[
      {label:'Early orange Wah-Fuzz-Straight',years:'c.1973',notes:'Rare configuration within the Colorsound wah/fuzz family. Exact production boundaries remain open pending more dated examples.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Wow Fuzz':[
      {label:'Early Sola Sound Wow Fuzz',years:'early 1970s',notes:'Sola Sound-branded fuzz-wah object within the same broad family as Colorsound and Rotosound Wow Fuzz examples.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Wow Pedal':[
      {label:'Classic Sola Sound Wow Pedal',years:'early 1970s',notes:'Stand-alone treadle wah branch associated with the wider Colorsound/Sola Sound inductor-wah family.'}
    ]
  };
  function apply(base){
    base.pedals=base.pedals||[];
    for(const p of base.pedals){
      const b=(base.builders||[]).find(x=>x.builder_id===p.primary_builder_id);
      const g=generations[`${b?.name||''}|${p.model_name||''}`];
      if(g){p.archive_research=p.archive_research||{};p.archive_research.generations=g;}
    }
    return base;
  }
  let merged=false;const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 13 generations failed:',e);return response;}};
})();
