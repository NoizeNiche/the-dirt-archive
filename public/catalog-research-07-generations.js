(() => {
  const generations={
    'Marshall SupaFuzz':[
      {name:'Early SupaFuzz / MKI-derived',from:1966,to:1966,notes:'Short-lived early form with Tone Bender MKI-derived design and a true filter function.'},
      {name:'Sola Sound Professional MKII-era',from:1966,to:1968,notes:'Mainstream Sola Sound-supplied SupaFuzz using the Tone Bender Professional MKII family; early and later enclosure/knob details occur.'},
      {name:'Marshall production',from:1968,to:1974,notes:'Marshall assumed production; broadly retained the MKII-derived lineage with its own enclosure and production details.'}
    ],
    'Tone Bender Professional MKII':[
      {name:'Early Sola Sound MKII',from:1966,to:1967,notes:'Initial three-transistor Professional MKII production, closely related to the transitional MK1.5 enclosure family.'},
      {name:'Later Sola Sound MKII',from:1967,to:1968,notes:'Later production includes evolving transistor and enclosure details and supplied branded OEM versions.'}
    ],
    'Tone Bender MKIII':[
      {name:'Early MKIII',from:1968,to:1970,notes:'Major redesign with expanded control arrangement and new tonal architecture.'},
      {name:'Later MKIII / OEM variants',from:1970,to:1978,notes:'Vox, Rotosound, Park and Sola Sound branded forms with enclosure and technology changes.'}
    ],
    'Vox Tone Bender Professional MKII':[
      {name:'Early Vox MKII',from:1967,to:1967,notes:'Initial Vox-branded Sola Sound supply using closely related Sola Sound graphics and enclosure.'},
      {name:'Later Vox MKII',from:1967,to:1968,notes:'Later branded production before the MKII was discontinued and the Vox/Sola Sound relationship moved into the MKIII family.'}
    ],
    'Rotosound Fuzz Box':[
      {name:'MKII-related Rotosound Fuzz Box',from:1966,to:1968,notes:'Sola Sound supplied Rotosound-branded examples from the Professional MKII OEM family.'},
      {name:'Later Rotosound fuzz family',from:1968,to:1972,notes:'Later examples track the MKIII and subsequent Sola Sound production changes.'}
    ]
  };
  function apply(base){base.pedals=base.pedals||[];for(const [name,gens] of Object.entries(generations)){const p=base.pedals.find(x=>String(x.model_name||'').trim().toLowerCase()===name.toLowerCase());if(p)p.archive_generations=gens;}return base;}
  const nativeFetch=window.fetch.bind(window);let merged=false;
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){return response;}};
})();
