(() => {
  const records = {
    'Acapulco Gold': {
      family_status: 'Variant mapped',
      identity_note: 'EarthQuaker Devices has both V1 and V2 manuals; V2 is the later identified production/graphic generation.',
      variants: [
        {label:'V1', type:'generation', notes:'Original Acapulco Gold production identity.', identification:'Use the early artwork/enclosure treatment and compare against the manufacturer V1 manual.'},
        {label:'V2', type:'generation', notes:'Later documented production identity with a separate V2 manual.', identification:'Compare artwork/enclosure details and control presentation against the V2 manual.'}
      ],
      distinguishers: [
        {type:'documentation', description:'EarthQuaker Devices publishes separate V1 and V2 manuals.', value:'Strong generation marker; manual/version evidence should be treated as more reliable than collector shorthand.', confidence:'High'}
      ],
      sources:[{title:'EarthQuaker Devices Manuals',url:'https://www.earthquakerdevices.com/manuals',type:'manufacturer',confidence:'High'},{title:'Acapulco Gold',url:'https://www.earthquakerdevices.com/acapulco-gold',type:'manufacturer',confidence:'High'}]
    },
    'Speaker Cranker': {
      family_status:'Variant mapped',
      identity_note:'EarthQuaker Devices publishes distinct V1 and V2 manuals and current product documentation confirms the pedal as a discrete, all-analog overdrive.',
      variants:[
        {label:'V1',type:'generation',notes:'Original documented production identity.',identification:'Compare artwork/enclosure treatment and control presentation with the V1 manual.'},
        {label:'V2',type:'generation',notes:'Later documented production identity.',identification:'Compare artwork/enclosure treatment and control presentation with the V2 manual.'}
      ],
      distinguishers:[
        {type:'documentation',description:'Separate manufacturer V1 and V2 manuals exist.',value:'Manual identity can anchor generation research when exterior traits are ambiguous.',confidence:'High'},
        {type:'function',description:'Single More control; discrete, all-analog overdrive design.',value:'Core operating concept is stable across the documented family; do not assume a new circuit solely from the V2 label.',confidence:'High'}
      ],
      sources:[{title:'EarthQuaker Devices Manuals',url:'https://www.earthquakerdevices.com/manuals',type:'manufacturer',confidence:'High'},{title:'Speaker Cranker',url:'https://www.earthquakerdevices.com/speaker-cranker',type:'manufacturer',confidence:'High'}]
    },
    'Sunn O))) Life Pedal': {
      family_status:'Variant mapped',
      identity_note:'The Life Pedal has three manufacturer-discussed versions with clear enclosure/control/function differences.',
      variants:[
        {label:'V1',type:'generation',notes:'Large, Ace Tone Fuzz Master-inspired enclosure with front-facing controls; 1,000-unit initial run.',identification:'Large vintage-style enclosure and front-facing controls are major exterior markers.'},
        {label:'V2',type:'generation',notes:'Smaller, more pedalboard-friendly enclosure with conventional top controls; V1 and V2 described as sonically very close with only a few circuit changes.',identification:'Smaller enclosure and top-mounted traditional controls distinguish V2 from V1.'},
        {label:'V3',type:'generation',notes:'Larger enclosure returns; octave circuit received multiple tweaks and an added octave switch/third control element, plus expression capability.',identification:'Added octave control/switch, larger enclosure and expression connection are strong V3 markers.'}
      ],
      distinguishers:[
        {type:'enclosure',description:'V1 uses a large Ace Tone Fuzz Master-inspired enclosure; V2 is smaller; V3 uses a larger enclosure again.',value:'Strong visual generation marker.',confidence:'High'},
        {type:'controls',description:'V2 moves controls to the top; V3 adds an octave control/switch and expression functionality.',value:'Strong exterior identification markers.',confidence:'High'},
        {type:'function',description:'V3 received forensic octave-circuit work and adds octave switching/expression compared with earlier versions.',value:'Strong functional generation marker.',confidence:'High'}
      ],
      sources:[{title:'Sunn O))) Life Pedal V3 history',url:'https://www.earthquakerdevices.com/blog-posts/sunn-o-life-pedal',type:'manufacturer interview/history',confidence:'High'},{title:'Sunn O))) Life Pedal V2',url:'https://www.earthquakerdevices.com/life-pedal-v2',type:'manufacturer',confidence:'High'},{title:'EarthQuaker Devices Manuals',url:'https://www.earthquakerdevices.com/manuals',type:'manufacturer',confidence:'High'}]
    },
    '385 Overdrive MKII': {
      family_status:'Variant mapped',
      identity_note:'Walrus Audio states the original 385 launched in 2016 and the MKII consolidates the light- and high-gain use cases into one pedal.',
      variants:[
        {label:'Original 385 Overdrive',type:'generation',notes:'2016-era original built around the Bell and Howell Filmosound 385-inspired dynamic overdrive concept.',identification:'Original control set lacks the MKII A/B switching and second Gain/Volume set.'},
        {label:'385 Overdrive MKII',type:'generation',notes:'Adds A/B switching, a second Gain/Volume set sharing tone controls, and a 385+ high-gain mode; internally runs at 18V.',identification:'A/B switch, dual Gain/Volume sets, 385+ switch, and MKII artwork/enclosure are strong markers.'}
      ],
      distinguishers:[
        {type:'controls',description:'A/B switch selects between two Volume and Gain sets sharing one tone section.',value:'Definitive MKII marker.',confidence:'High'},
        {type:'function',description:'385+ switch increases front-end saturation for higher-gain tones.',value:'Definitive MKII marker.',confidence:'High'},
        {type:'appearance',description:'MKII is offered in textured black with projector artwork or flat black with tube artwork.',value:'Useful edition/appearance marker; do not confuse art treatment with a circuit generation by itself.',confidence:'High'},
        {type:'power',description:'Circuit runs internally at 18V from a 9VDC supply.',value:'Documented production specification, not a unique exterior marker.',confidence:'High'}
      ],
      sources:[{title:'385 MKII Overdrive',url:'https://www.walrusaudio.com/products/385-overdrive-mkii',type:'manufacturer',confidence:'High'},{title:'Walrus Audio Product Manuals',url:'https://www.walrusaudio.com/pages/manuals',type:'manufacturer',confidence:'High'}]
    },
    'Hot Wired v2': {
      family_status:'Variant mapped',
      identity_note:'Wampler describes v2 as a redesign of Channel 1 while retaining the British Plexi flavor of Channel 2.',
      variants:[
        {label:'Hot Wired v1',type:'generation',notes:'Original dual overdrive/distortion concept, with Channel 1 oriented toward broader country/session drive use.',identification:'Compare enclosure/control layout with v2 documentation.'},
        {label:'Hot Wired v2',type:'generation',notes:'Channel 1 was redesigned to add a broader range of subtlety, a warmer/deeper overdrive range, and a clean Blend control; Channel 2 retains its British Plexi character.',identification:'Clean Blend control on Channel 1 is a major v2 marker; top-mounted jacks and dual-channel layout are also useful.'}
      ],
      distinguishers:[
        {type:'controls',description:'Channel 1 adds a Blend control in v2.',value:'Strong generation marker.',confidence:'High'},
        {type:'function',description:'Channel 1 was completely redesigned for more subtle and warmer overdrive while Channel 2 keeps the British Plexi flavor.',value:'Strong functional distinction.',confidence:'High'},
        {type:'appearance',description:'Large 4.5 x 4.5 inch enclosure with top-mounted jacks.',value:'Useful physical identity marker.',confidence:'High'}
      ],
      sources:[{title:'Brent Mason: Hot Wired v2',url:'https://www.wamplerpedals.com/products/distortion-overdrive/brent-mason-hot-wired-v2/',type:'manufacturer',confidence:'High'}]
    },
    'Pinnacle Deluxe v2': {
      family_status:'Variant mapped',
      identity_note:'Wampler presents the Deluxe v2 as an expanded version with a new EQ and substantially more control.',
      variants:[
        {label:'Pinnacle Deluxe original',type:'generation',notes:'Earlier Deluxe platform compared by Wampler with the Standard, with the boost on the stomp rather than the expanded v2 feature set.',identification:'Original lacks the v2 three-band EQ, side SAG switch and dedicated pre-gain boost implementation described by Wampler.'},
        {label:'Pinnacle Deluxe v2',type:'generation',notes:'Adds three-band EQ, bright and bass boosts, a Valve Screamer-style pre-gain boost and side SAG switch; retains Vintage/Modern voice architecture.',identification:'Three-band EQ plus side SAG switch are strong external v2 markers.'}
      ],
      distinguishers:[
        {type:'controls',description:'Three-band EQ replaces the simpler earlier control scheme; bright and bass boosts are added.',value:'Strong v2 marker.',confidence:'High'},
        {type:'controls',description:'Dedicated pre-gain boost and side-mounted SAG switch are added.',value:'Strong v2 marker.',confidence:'High'},
        {type:'function',description:'Vintage and Modern modes remain, while v2 broadens the tone-shaping range.',value:'Functional family continuity with expanded controls.',confidence:'High'}
      ],
      sources:[{title:'Pinnacle Deluxe v2',url:'https://www.wamplerpedals.com/products/distortion-overdrive/pinnacle-deluxe-v2/',type:'manufacturer',confidence:'High'}]
    }
  };

  function esc(v){return String(v ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function apply(base){
    base.pedals=base.pedals||[]; base.sources=base.sources||[]; base.generations=base.generations||[]; base.distinguishers=base.distinguishers||[]; base.claims=base.claims||[];
    for(const [name,r] of Object.entries(records)){
      const p=base.pedals.find(x=>String(x.model_name||'').trim().toLowerCase()===name.toLowerCase());
      if(!p) continue;
      p.archive_research={...(p.archive_research||{}),...r};
      const gens=r.variants||[];
      for(const g of gens){
        const gid=`VAR-${p.pedal_id}-${g.label.toUpperCase().replace(/[^A-Z0-9]+/g,'-')}`;
        if(!base.generations.some(x=>x.generation_id===gid)) base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:g.label,start_year:null,end_year:null,summary:g.notes,description:g.identification});
        const dset= r.distinguishers||[];
        dset.forEach((d,i)=>{ const did=`DST-${p.pedal_id}-${i+1}`; if(!base.distinguishers.some(x=>x.distinguisher_id===did)) base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:d.type,description:d.description,identification_value:d.value,status:d.confidence}); });
      }
      (r.sources||[]).forEach((s,i)=>{if(!base.sources.some(x=>x.url===s.url)) base.sources.push({source_id:`SRC-VE1-${i}-${name.replace(/\W+/g,'-')}`,title:s.title,url:s.url,source_type:s.type,author_or_org:s.type.startsWith('manufacturer')?'Manufacturer':''});});
    }
    return base;
  }
  const nativeFetch=window.fetch.bind(window); let merged=false;
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=apply(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Variant enrichment 01 failed:',err);return response;}};
})();
