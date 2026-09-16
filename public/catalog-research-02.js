(() => {
  const generations = {
    'Fuzz Face': [
      {generation_id:'GEN-fuzz-face-01',label:'Arbiter / early germanium',years:'1966–1967',notes:'Early British production in the round cast-aluminium enclosure. Pre-Dallas Arbiter branding and early cosmetic variants are especially useful for dating.'},
      {generation_id:'GEN-fuzz-face-02',label:'Dallas-Arbiter germanium',years:'1968–1970s',notes:'Arbiter/Dallas merger is reflected in the center branding. Graphics, enclosure moulds, knobs and switch details changed during the run.'},
      {generation_id:'GEN-fuzz-face-03',label:'Later original production',years:'early–mid 1970s',notes:'Later British examples include further enclosure and cosmetic changes before original UK production ended.'},
      {generation_id:'GEN-fuzz-face-04',label:'Crest / Dallas reissue branch',years:'1980s',notes:'Later reissue history should remain separate from the original 1960s–70s British production record.'},
      {generation_id:'GEN-fuzz-face-05',label:'Dunlop production',years:'1990s–present',notes:'Dunlop-era licensed production is a distinct modern manufacturing branch.'}
    ],
    'Tone Bender': [
      {generation_id:'GEN-tone-bender-01',label:'MKI',years:'1964–1965',notes:'Gary Hurst-developed three-transistor British fuzz. Early examples include wood and later folded-steel wedge enclosures.'},
      {generation_id:'GEN-tone-bender-02',label:'MK1.5 / transitional',years:'1965–1966',notes:'Two-transistor cast-aluminium Sola Sound version. The MK1.5 name is retrospective and was not printed as a formal model designation.'},
      {generation_id:'GEN-tone-bender-03',label:'Professional MKII',years:'1966–1968',notes:'Three-transistor Sola Sound generation. Sola Sound also supplied closely related OEM versions to other brands.'},
      {generation_id:'GEN-tone-bender-04',label:'Vox v828 (Italian grey)',years:'1966–1968',notes:'Italian-built Vox model V828. It is related visually and historically to the Tone Bender family but should not be treated as the Sola Sound MK1.5 or MKII; surviving examples use a two-transistor PCB design.'},
      {generation_id:'GEN-tone-bender-05',label:'Vox Professional MKII',years:'1967–1968',notes:'British Vox-branded branch of the Professional MKII, broadly based on the Sola Sound version. Early examples can show Sola Sound graphics covered and overprinted for Vox.'},
      {generation_id:'GEN-tone-bender-06',label:'MKIII family',years:'late 1960s–1970s',notes:'Later Tone Bender family with multiple enclosure, control, graphics and technology variations.'},
      {generation_id:'GEN-tone-bender-07',label:'MKIV / later Sola Sound family',years:'1970s',notes:'Later British Tone Bender products continued the family with changing graphics and production details.'}
    ],
    'Big Muff Pi': [
      {generation_id:'GEN-big-muff-pi-01',label:'Triangle / V1',years:'1969–1973',notes:'First Big Muff generation. Plain enclosure and triangular control layout are major external identifiers.'},
      {generation_id:'GEN-big-muff-pi-02',label:"Ram's Head / V2",years:'1973–1976',notes:'Larger enclosure and ram-head graphics. Surviving examples show several documented production subtypes.'},
      {generation_id:'GEN-big-muff-pi-03',label:'Red & Black / V3',years:'1976–1978',notes:'New graphics with production changes over the run. Early and later V3 examples should not be assumed identical.'},
      {generation_id:'GEN-big-muff-pi-04',label:'Op-Amp / V4',years:'1977–1980',notes:'Major design branch using op-amp ICs rather than the earlier four-transistor architecture. Separate historical family branch.'},
      {generation_id:'GEN-big-muff-pi-05',label:'Post-NYC / Russian and reissue branches',years:'1980s–present',notes:'Later production should be split by manufacturing geography, brand and reissue generation rather than folded into the original NYC history.'}
    ],
    'TS808 Tube Screamer': [
      {generation_id:'GEN-ts808-01',label:'Original TS808 / OD808 era',years:'1979–1981',notes:'Foundational Japanese Tube Screamer generation sold internationally under Ibanez branding, with Maxon/Nisshin Onpa central to the manufacturing lineage.'},
      {generation_id:'GEN-ts808-02',label:'TS9 successor',years:'1981–1985',notes:'Related 9-series model with a revised output section and enlarged switch presentation. It should remain a separate product record.'},
      {generation_id:'GEN-ts808-03',label:'Later Tube Screamer family',years:'1980s–present',notes:'TS10, Soundtank, reissue and modern TS variants form separate product records and should not be merged into the original TS808 chronology.'}
    ],
    'RAT': [
      {generation_id:'GEN-rat-01',label:'Bud Box',years:'1978',notes:'Only twelve early units are documented in specialist histories, including a prototype. Standard project-box construction makes this the defining early identifier.'},
      {generation_id:'GEN-rat-02',label:'Big Box V1',years:'1978/79–1981',notes:'First larger production enclosure. Early examples use Tone rather than Filter and show several cosmetic sub-variants.'},
      {generation_id:'GEN-rat-03',label:'Big Box V2 / Filter',years:'1981–1983',notes:'Major identification break: Tone becomes Filter, with revised logo treatment and control behavior.'},
      {generation_id:'GEN-rat-04',label:'Small Box RAT',years:'1984–1988',notes:'Smaller U-shaped enclosure. White-face and black-face cosmetic periods are useful sub-identifiers.'},
      {generation_id:'GEN-rat-05',label:'RAT 2',years:'1988–present',notes:'Introduced with LED and overlay graphics. Later enclosure and production changes create additional sub-generations.'},
      {generation_id:'GEN-rat-06',label:'Turbo RAT and other variants',years:'1989–present',notes:'Turbo RAT, Vintage Reissue, BRAT, Deucetone, You Dirty RAT, FATRAT, Lil RAT and other variants should become separate records.'}
    ]
  };

  window.DIRT_RESEARCH_GENERATIONS = generations;
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
    catch(err){console.error('Product generation layer failed:',err);return response;}
  };
})();
