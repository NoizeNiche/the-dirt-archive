(() => {
  const generations={
    'Colorsound / Sola Sound|Colorsound Supa Tonebender':[
      {label:'Early Supa Tonebender',years:'c.1972–1974',notes:'Early 1970s large Colorsound fuzz branch using a four-transistor Big Muff-derived architecture.'},
      {label:'Later Supa Tonebender',years:'c.1974–1978',notes:'Later production shares the broad Colorsound enclosure family while production details and graphics evolved.'}
    ],
    'Colorsound / Sola Sound|Colorsound Tone Bender Jumbo':[
      {label:'Early Jumbo / related MKIII enclosure',years:'c.1973–1975',notes:'Early examples can overlap with the later Vox MKIII silicon/Colorsound Jumbo family.'},
      {label:'Wide-box Jumbo Tone Bender',years:'mid-1970s–1980',notes:'Large Colorsound enclosure with Jumbo Tone Bender branding; production continued alongside other Colorsound fuzz products.'}
    ],
    'Colorsound / Sola Sound|Colorsound Power Boost':[
      {label:'18V orange Power Boost',years:'c.1969–1971',notes:'Early orange enclosure and 18V power era; early graphics can include the “Hit It” arrow.'},
      {label:'Later 9V Power Boost',years:'c.1971–1972',notes:'Power Boost branding continued on later production after the enclosure/power transition toward the Overdriver branch.'},
      {label:'Mid-1970s Power Boost graphics variant',years:'mid-1970s',notes:'Some later examples use Power Boost graphics on hardware otherwise associated with the Overdriver-era Colorsound production.'}
    ],
    'Colorsound / Sola Sound|Colorsound Overdriver':[
      {label:'Early grey Overdriver',years:'c.1971–1974',notes:'Grey enclosure and 9V format associated with the post-Power-Boost naming transition.'},
      {label:'Wide-box Overdriver',years:'mid-1970s',notes:'Later Colorsound enclosure generation; external artwork and construction provide useful dating clues.'},
      {label:'Late white-label Overdriver',years:'late 1970s',notes:'Later production with revised top labeling; exact boundaries should be established from surviving examples rather than assumed.'}
    ]
  };
  function apply(base){
    base.pedals=base.pedals||[];
    for(const p of base.pedals){
      const b=(base.builders||[]).find(x=>x.builder_id===p.primary_builder_id);
      const gens=generations[`${b?.name||''}|${p.model_name||''}`];
      if(gens){p.archive_research=p.archive_research||{};p.archive_research.generations=gens;}
    }
    return base;
  }
  let merged=false;const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 10 generation layer failed:',e);return response;}};
})();
