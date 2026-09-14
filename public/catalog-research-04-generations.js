(() => {
  const generations = {
    'Maestro FZ-1A Fuzz-Tone': [
      {label:'Kalamazoo FZ-1A',years:'1965–1967',notes:'Early production after the FZ-1 revision, retaining the wedge enclosure.'},
      {label:'Lincolnwood FZ-1A',years:'late 1960s',notes:'Later production moved from Kalamazoo to Lincolnwood, providing a useful historical and identification breakpoint.'},
      {label:'1990s Gibson reissue',years:'1990s',notes:'Modern reissue branch; do not merge with original 1960s production.'}
    ],
    'Maestro FZ-1B Fuzz-Tone': [
      {label:'Early FZ-1B',years:'1968–1969',notes:'First major post-FZ-1A redesign, associated with Robert Moog and a new enclosure format.'},
      {label:'Later FZ-1B revisions',years:'late 1960s–early 1970s',notes:'Specialist histories document multiple production revisions within the FZ-1B run.'}
    ],
    'Tone Bender MK1.5': [
      {label:'Early transitional examples',years:'1965',notes:'Earliest known examples overlap chronologically with late MKI production.'},
      {label:'Established transitional production',years:'1966',notes:'Cast-aluminium two-transistor Tone Bender produced by Sola Sound before the Professional MKII superseded it.'},
      {label:'OEM/rebranded relatives',years:'1966',notes:'Related electronics appeared in Rotosound and Dallas/Rangemaster-branded products; these remain separate records.'}
    ],
    'BOSS OD-1 OverDrive': [
      {label:'Early Japan production',years:'1977–1980s',notes:'Original compact-series OD-1 production with multiple documented manufacturing revisions.'},
      {label:'Late production',years:'1980s–1985',notes:'Later OD-1 examples precede discontinuation as BOSS shifted the OverDrive line toward the OD-2.'}
    ],
    'ProCo Turbo RAT': [
      {label:'Original Turbo RAT',years:'1989–1990s',notes:'Early Turbo RAT production established the distinct high-output branch of the RAT family.'},
      {label:'Later production',years:'2000s–present',notes:'Modern ProCo production remains a separate variant branch from the standard RAT 2.'}
    ]
  };
  let merged=false;
  function apply(base){
    base.pedals=base.pedals||[];
    for(const [name,gens] of Object.entries(generations)){
      const p=base.pedals.find(x=>String(x.model_name||'').trim().toLowerCase()===name.toLowerCase());
      if(!p) continue;
      p.archive_research=p.archive_research||{};
      p.archive_research.generations=gens;
    }
    return base;
  }
  window.addEventListener('dirtarchive:catalog-ready',e=>apply(e.detail||{}));
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{const base=await response.clone().json();const data=apply(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}
    catch(err){console.error('Product generation batch 04 failed:',err);return response;}
  };
})();
