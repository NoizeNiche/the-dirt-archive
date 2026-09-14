(() => {
  const generations={
    'Colorsound / Sola Sound|Sola Sound Tone Bender Mk1.5 (D*A.M reissue) Copperhead':[
      {label:'Copperhead OC75 edition',years:'2013–',notes:'D*A.M.-built Sola Sound reissue using OC75 germanium devices and the modern Copperhead presentation. Keep separate from vintage Mk1.5 examples.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender Mk1.5 (D*A.M reissue) Goldie':[
      {label:'Goldie OC84 edition',years:'2010s',notes:'Official Sola Sound/D*A.M. Mk1.5 reissue with carefully selected Mullard OC84 devices.'},
      {label:'Goldie OC75 edition',years:'2010s–2018+',notes:'Later documented runs use OC75 germanium devices while retaining the Goldie identity and modern sand-cast enclosure.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender Mk1.75 (D*A.M Reissue) El Diablo':[
      {label:'El Diablo OC75/OC84 family',years:'2013–',notes:'D*A.M. hybrid interpretation between Mk1.5 and Vox-related Tone Bender ideas. Surviving examples show variation in transistor selection.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkII (D*A.M reissue)':[
      {label:'Early D*A.M. MKII builds',years:'early 2000s onward',notes:'Independent D*A.M. builds predate or overlap the official Sola Sound relationship; specimen-level dating matters.'},
      {label:'Official Sola Sound/D*A.M. Professional MKII',years:'2010s onward',notes:'Modern sand-cast Professional MKII presentation forming the parent lineage for specialized limited editions.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkII (D*A.M reissue) Green Bastard':[
      {label:'Green Bastard / OC82D run',years:'2014',notes:'Limited to 50 units, built around scarce Mullard OC82D germanium devices and green Hammerite finish.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkII (D*A.M reissue) Hybrid Squadron':[
      {label:'Hybrid Squadron / Squadron 27',years:'2020',notes:'Modern hybrid Professional MKII using one germanium input device and two selected silicon devices for temperature stability.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkII SCB (D*A.M reissue) Blue Meanie':[
      {label:'Blue Meanie SCB',years:'2011–',notes:'D*A.M. special edition based on the earliest known short-board MKII form and using selected OC75 germanium devices.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkIV (D*A.M reissue)':[
      {label:'Modern D*A.M./Sola Sound MKIV',years:'2017 onward',notes:'Modern reissue family based on the later Sola Sound MKIV platform, with named limited editions sharing the enclosure family.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkIV (D*A.M reissue) The Purple People Eater':[
      {label:'Purple People Eater',years:'2017',notes:'Special edition using an OC75/OC82D/OC75 selection and limited to 10 units in each color scheme.'}
    ],
    'Colorsound / Sola Sound|Sola Sound Tone Bender MkIV (D*A.M reissue) The Red Baron':[
      {label:'Red Baron',years:'2017',notes:'Special edition using an OC75/OC82D/OC75 selection; together with Purple People Eater, it consumed the remaining MKIV enclosure stock described by the product page.'}
    ]
  };
  function apply(base){base.pedals=base.pedals||[];for(const p of base.pedals){const b=(base.builders||[]).find(x=>x.builder_id===p.primary_builder_id);const g=generations[`${b?.name||''}|${p.model_name||''}`];if(g){p.archive_research=p.archive_research||{};p.archive_research.generations=g;}}return base;}
  let merged=false;const nativeFetch=window.fetch.bind(window);window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();merged=true;return new Response(JSON.stringify(apply(base)),{status:200,headers:{'Content-Type':'application/json'}})}catch(e){console.error('D*A.M. reissue generation layer failed:',e);return response;}};
})();
