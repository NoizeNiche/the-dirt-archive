(() => {
  const generations = {
    'Maestro FZ-1 Fuzz-Tone': [
      {label:'FZ-1 original',years:'1962–1965',notes:'Original Maestro Fuzz-Tone generation. The wedge enclosure and early two-control presentation are the principal external identifiers.'},
      {label:'FZ-1A',years:'1965–1968',notes:'Revised germanium-era Fuzz-Tone introduced after the success of Satisfaction. Keep separate from the original FZ-1 record.'},
      {label:'FZ-1B',years:'1968–early 1970s',notes:'Major redesign associated with Robert Moog and a new Maestro enclosure and power arrangement.'},
      {label:'FZ-1S Super-Fuzz',years:'1970s',notes:'Later Maestro fuzz branch with substantially different appearance and voicing; separate product record recommended.'},
      {label:'1990s FZ-1A reissue',years:'1990s',notes:'Gibson reissue branch, distinct from 1960s original production.'}
    ],
    'Univox U-1095 Super-Fuzz': [
      {label:'Stamped-box early generation',years:'1968–c.1970',notes:'Early Univox examples use a simpler stamped-metal enclosure and blue Univox badge.'},
      {label:'Die-cast generation',years:'c.1970–late 1970s',notes:'Larger die-cast enclosure with prominent rubber-covered footswitch. Finish and hardware variations help distinguish sub-periods.'}
    ],
    'Shin-Ei Companion FY-2 Fuzz Box': [
      {label:'Early germanium FY-2',years:'late 1960s',notes:'Early and comparatively scarce FY-2 examples. External dating should be combined with documented component-era evidence.'},
      {label:'Silicon-era FY-2',years:'1970s',notes:'Later production moved to silicon-era construction and includes numerous export/OEM branded relatives.'}
    ],
    'MXR M-104 Distortion+': [
      {label:'Early MXR Innovations',years:'1974–late 1970s',notes:'Original small-box MXR production, including early script and later block-logo cosmetic periods.'},
      {label:'1979-era production',years:'1979–early 1980s',notes:'Original-era examples such as the documented 1979 block-logo unit provide useful visual dating references.'},
      {label:'Later MXR / Dunlop M-104',years:'1990s–present',notes:'Modern production under the Dunlop MXR lineage. Do not merge modern reissues with original Innovations units.'}
    ],
    'BOSS DS-1 Distortion': [
      {label:'Made in Japan early production',years:'1978–1990',notes:'Original Japanese compact-series production. Country markings and serial/date evidence are central identification clues.'},
      {label:'Made in Taiwan transition',years:'1990–1994',notes:'Production moved to Taiwan; this period precedes the major 1994 redesign documented by specialist histories.'},
      {label:'DS-1A / 1994 redesign',years:'1994–1999',notes:'Major production revision following the scarcity of the original preamp component.'},
      {label:'Y2K-era revision',years:'2000–2005',notes:'Further component and manufacturing revisions while retaining the DS-1 identity.'},
      {label:'Modern production',years:'2006–present',notes:'Later component revisions and ongoing BOSS production. Exact dating should use serial and manufacturing evidence.'}
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
    catch(err){console.error('Product generation batch 03 failed:',err);return response;}
  };
})();
