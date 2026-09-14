(() => {
  const generations={
    'Honey|Baby Crying':[
      {label:'Honey Baby Crying',years:'1967–1969',notes:'Earliest documented Super-Fuzz family object; later years and exact transition into Shin-Ei branding remain imperfectly documented.'}
    ],
    'Shin-Ei Companion|FY-6 Super Fuzz':[
      {label:'Shin-Ei FY-6',years:'1968 onward',notes:'Shin-Ei-branded continuation of Honey’s Baby Crying design; later Companion/private-label forms share the broader FY-6 family.'}
    ],
    'Companion|FY-6 Fuzz Master':[
      {label:'Companion FY-6',years:'1970s',notes:'Later Companion-branded FY-6/Fuzz Master form with the characteristic Expander, Balance and two-position tone controls.'}
    ],
    'Shin-Ei Companion|WF-24 8-Tr Fuzz Wah':[
      {label:'WF-24 8-Tr',years:'early 1970s',notes:'Wide-format combination fuzz/wah using an FY-6-derived eight-transistor fuzz section.'}
    ],
    'Univox|U-1095 Super-Fuzz':[
      {label:'Early stamped-metal Univox',years:'1968–c.1970',notes:'Early production associated closely with the Honey/Shin-Ei FY-6 family; simple stamped construction and distinctive Univox labeling.'},
      {label:'Later die-cast Univox',years:'c.1970–late 1970s',notes:'Later production moved to a die-cast enclosure with the large rubber Super-Fuzz foot pad; exact revision boundaries vary by surviving example.'}
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
  let merged=false;
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('Product research batch 09 generation layer failed:',e);return response;}};
})();
