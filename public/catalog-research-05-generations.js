(() => {
  const generations={
    'Electro-Harmonix Deluxe Big Muff Pi':[
      {label:'Deluxe Big Muff Pi',years:'2014–present',notes:'Introduced May 16, 2014 as a feature-expanded modern NYC Big Muff branch with switchable mids, gate, attack, bass boost and expression input.'}
    ],
    'Electro-Harmonix Double Muff':[
      {label:'Double Muff',years:'2010–2020',notes:'Compact dual-Muff product. Single mode uses one Muff stage; Double mode cascades both.'}
    ],
    'Electro-Harmonix Graphic Fuzz':[
      {label:'Graphic Fuzz',years:'2008–2023',notes:'Large-format fuzz/distortion and six-band EQ combination. EHX lists the product as discontinued in 2023.'}
    ],
    'Electro-Harmonix Little Big Muff Pi':[
      {label:'Little Big Muff Pi',years:'2006–present catalog lineage',notes:'Compact die-cast Big Muff branch introduced in 2006. EHX describes it as the classic Big Muff circuit in a smaller enclosure.'}
    ],
    'Electro-Harmonix Hot Tubes - Tube Amp Overdrive Simulator':[
      {label:'Original Hot Tubes',years:'1978–historical',notes:'Original EHX late-1970s overdrive product.'},
      {label:'Modern Hot Tubes reissue',years:'2010s–present',notes:'Modern EHX product explicitly marketed as reproducing the tone and drive of the 1970s original.'}
    ]
  };
  let merged=false;
  function apply(base){
    base.pedals=base.pedals||[];
    for(const [name,gens] of Object.entries(generations)){
      const p=base.pedals.find(x=>String(x.model_name||'').trim().toLowerCase()===name.toLowerCase());
      if(!p) continue;
      p.archive_research=p.archive_research||{}; p.archive_research.generations=gens;
    }
    return base;
  }
  window.addEventListener('dirtarchive:catalog-ready',e=>apply(e.detail||{}));
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json();const data=apply(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}catch(err){console.error('Batch 05 generation layer failed:',err);return response;}
  };
})();
