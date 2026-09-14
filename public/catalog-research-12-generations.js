(() => {
  const generations={
    'Sola Sound|Sola Sound Tone Bender MkI':[
      {label:'Wooden prototype / earliest handmade',years:'1964–early 1965',notes:'Extremely scarce early form. Wooden enclosure and three germanium transistors are the defining surviving-object clues; exact production count is unknown.'},
      {label:'Folded-steel commercial MKI',years:'1965',notes:'Gold/black folded-steel wedge became the practical commercial form as demand increased. The MKI designation is retrospective collector terminology.'}
    ],
    'Sola Sound|Sola Sound Tone Bender MkII':[
      {label:'Short-board / MK1.5 conversion',years:'1966',notes:'Some early three-transistor MKII examples were converted from existing two-transistor MK1.5 stock on the older stripboard.'},
      {label:'Conventional large-board MKII',years:'1966–1968',notes:'New-build Sola Sound MKII examples used the larger board and the production parts family also supplied to major OEM customers.'},
      {label:'Late Sola Sound / OEM transition',years:'1967–1968',notes:'Sola Sound continued its own smaller run while Vox, Marshall, Rotosound and Dallas-branded versions carried the design into broader distribution.'}
    ],
    'Sola Sound|Sola Sound Tone Bender MkIII':[
      {label:'Early two-control silicon MKIII',years:'1968–1969',notes:'Rare early form with treble/bass-boost behavior and silicon technology; later three-control versions are materially different.'},
      {label:'Three-control germanium MKIII',years:'1969–early 1970s',notes:'Main early production form with the classic expanded control arrangement and Sola Sound/OEM branding.'},
      {label:'Hastings / Vox Sound Ltd. period',years:'early 1970s',notes:'Cast-enclosure examples carrying Hastings address labels; attribution to Vox Sound Ltd. is supported but remains partly interpretive.'},
      {label:'Later silicon / Jumbo-related MKIII',years:'mid-1970s',notes:'Later silicon forms overlap technically and cosmetically with the Colorsound Jumbo Tone Bender branch.'}
    ],
    'Sola Sound|Sola Sound Tone Bender MkIV':[
      {label:'Early “bendy” graphic MKIV',years:'c.1970–1971',notes:'Grey pressed-steel enclosure with early stylized Tone Bender graphics. “Bendy” is an informal collector descriptor.'},
      {label:'Later “Batman” graphic MKIV',years:'1971–mid 1970s',notes:'Yellow examples and then the familiar grey enclosure carry the informal “Batman” FUZZ artwork.'},
      {label:'Late silicon Tone-Bender Fuzz era',years:'mid–late 1970s',notes:'Later production moved toward silicon/Big Muff-influenced fuzz architecture while retaining the MKIV identity.'}
    ],
    'Sola Sound|Sola Sound Bum Fuzz Unit':[
      {label:'B&M Fuzz Unit / original production',years:'mid-1970s',notes:'Vintage Barnes & Mullins product supplied by Sola Sound. Exact start/end dates remain uncertain.'},
      {label:'Sola Sound / D*A.M.-associated recreation',years:'2010s',notes:'Later recreation based on Edwyn Collins’s personal vintage B&M Fuzz Unit. Keep this separate from the original vintage object.'}
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
  let merged=false; const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 12 generation layer failed:',e);return response;}};
})();
