(() => {
  const generations={
    'Colorsound / Sola Sound|Colorsound Fuzz Box':[
      {label:'One Knob Fuzz / revival-era Fuzz Box',years:'1996–2000s',notes:'Later Colorsound production based on Dick Denney-associated design material; do not date the commercial pedal to 1961 merely because the design is attributed to a 1961 board.'},
      {label:'D*A.M. reissue branch',years:'2010s',notes:'Separate modern reissue developed with David Main and Colorsound-related historical references.'}
    ],
    'Colorsound / Sola Sound|Colorsound Fuzz 4':[
      {label:'Modern Fuzz 4',years:'2000s',notes:'Four-transistor multi-voicing fuzz with modern controls and color-changing LED; distinct from vintage Tone Bender generations.'}
    ],
    'Colorsound / Sola Sound|Colorsound Tone Bender Distortion':[
      {label:'Modern Colorsound Tone Bender Distortion',years:'late 1990s–2000s',notes:'Later Colorsound-branded distortion product; avoid treating the Tone Bender name as proof of continuity with 1960s germanium production.'}
    ],
    'Colorsound / Sola Sound|Colorsound Wow Fuzz':[
      {label:'Classic Colorsound Wow Fuzz',years:'early 1970s onward',notes:'Combination fuzz-wah branch using the Colorsound treadle format; exact production sub-eras require object-level comparison.'},
      {label:'D*A.M./Castledine reissue',years:'2011 onward',notes:'Separate reissue combining historically voiced fuzz and wah sections in a new production enclosure.'}
    ],
    'Colorsound / Sola Sound|Colorsound Wah Fuzz':[
      {label:'Early 1970s Colorsound Wah Fuzz',years:'early 1970s',notes:'Classic combination pedal in the Sola Sound/Colorsound treadle ecosystem.'}
    ],
    'Colorsound / Sola Sound|Colorsound Wah plus Fuzz':[
      {label:'Early combination-effects production',years:'early 1970s',notes:'Closely related to Colorsound Wah Fuzz and Wow Fuzz; exact identity depends on model lettering, artwork and hardware.'}
    ],
    'Colorsound / Sola Sound|Colorsound Supa Wah-Fuzz':[
      {label:'Supa-format Wah-Fuzz',years:'1970s',notes:'Later larger-format Colorsound combination pedal; distinguish from Supa Wah-Fuzz-Swell by the additional swell function.'}
    ],
    'Colorsound / Sola Sound|Colorsound Supa Wah-Fuzz-Swell':[
      {label:'Supa-format Wah-Fuzz-Swell',years:'1970s',notes:'Three-function treadle configuration combining wah, fuzz and swell/volume operation.'}
    ]
  };
  function apply(base){base.pedals=base.pedals||[];for(const p of base.pedals){const b=(base.builders||[]).find(x=>x.builder_id===p.primary_builder_id);const g=generations[`${b?.name||''}|${p.model_name||''}`];if(g){p.archive_research=p.archive_research||{};p.archive_research.generations=g;}}return base;}
  let merged=false;const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 11 generation layer failed:',e);return response;}};
})();
