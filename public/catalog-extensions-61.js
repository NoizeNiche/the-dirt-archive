(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    base.generations = base.generations || [];
    base.distinguishers = base.distinguishers || [];
    base.claims = base.claims || [];
    base.sources = base.sources || [];

    const defs = [
      {id:'BLD-MOD-KERNOM-01',name:'Kernom',country:'France',source:'https://kernom.com/'},
      {id:'BLD-MOD-THORPY-01',name:'ThorpyFX',country:'UK',source:'https://thorpyfx.com/'},
      {id:'BLD-MOD-FAIRFIELD-01',name:'Fairfield Circuitry',country:'Canada',source:'https://fairfieldcircuitry.com/'},
      {id:'BLD-MOD-CHAMPION-01',name:'Champion Leccy',country:'UK',source:'https://championleccy.com/'},
      {id:'BLD-MOD-DRUNK-01',name:'Drunk Beaver',country:'Poland',source:'https://drunk-beaver.rocks/'},
      {id:'BLD-MOD-BME-01',name:'Black Mass Electronics',country:'USA',source:'https://blackmasselectronics.com/'}
    ];
    for (const d of defs) if (!base.builders.some(b=>b.builder_id===d.id) && !base.builders.some(b=>String(b.name||'').toLowerCase()===d.name.toLowerCase())) base.builders.push({builder_id:d.id,name:d.name,aliases:'',country:d.country,status:'Current manufacturer',founded:null,description:'Modern preservation builder captured during the 2023 newest-to-oldest sweep.',primary_source:d.source,source_confidence:'High'});
    const bmap = Object.fromEntries(defs.map(d=>[d.name,d.id]));

    const rows = [
      {id:'MOD-0045',brand:'Walrus Audio',model:'Fundamental Series Drive',cat:'Overdrive',intro:2023,variant:'Original',summary:'Launch-generation Fundamental Drive: Gain/Tone/Volume sliders, Smooth/Crunch/Bright three-way mode switch, matte black compact diecast enclosure, top audio jacks and side power.',diff:'Three slider controls; Smooth, Crunch and Bright modes; black enclosure with red/off-white graphics; 9VDC 100mA minimum.',why:'Slider layout and mode labels identify the Drive within the Fundamental Series.',url:'https://www.walrusaudio.com/products/fundamental-series-drive',bid:'BLD-MOD-WALRUS-01'},
      {id:'MOD-0046',brand:'Walrus Audio',model:'Fundamental Series Distortion',cat:'Distortion',intro:2023,variant:'Original',summary:'Launch-generation Fundamental Distortion: Gain/Tone/Volume sliders and Dark/Si/LED modes in matte black compact diecast enclosure.',diff:'Three slider controls; Dark, Si and LED modes; black enclosure with yellow/off-white graphics; 9VDC 100mA minimum.',why:'Mode labels and yellow-accented enclosure graphics distinguish the Distortion.',url:'https://www.walrusaudio.com/products/fundamental-series-distortion',bid:'BLD-MOD-WALRUS-01'},
      {id:'MOD-0047',brand:'Walrus Audio',model:'Fundamental Series Fuzz',cat:'Fuzz',intro:2023,variant:'Original',summary:'Launch-generation Fundamental Fuzz: Gain/Tone/Volume sliders with Gate/Classic/Mid+ modes in matte black compact diecast enclosure.',diff:'Three slider controls; Gate, Classic and Mid+ modes; black enclosure with light-orange/off-white graphics; 9VDC 100mA minimum.',why:'Mode labels and enclosure graphics distinguish the Fuzz within the Fundamental line.',url:'https://www.walrusaudio.com/products/fundamental-series-fuzz',bid:'BLD-MOD-WALRUS-01'},
      {id:'MOD-0048',brand:'Kernom',model:'MOHO',cat:'Fuzz',intro:2023,variant:'Original',summary:'First production MOHO fuzz workstation, announced at NAMM 2023 for July release. Analog fuzz with digital parameter control, continuous MOOD morphing, PRE/POST TONE, FUZZ, VOLUME, ELECTRICITY, octave up/down, ring modulation, MIDI and expression control.',diff:'Distinctive large aluminium enclosure; MOOD and ELECTRICITY controls; MIDI in/out; expression input; preset control; internal analog fuzz with digitally controlled morphing.',why:'The control/connection architecture is unusually distinctive and strongly identifies MOHO.',url:'https://kernom.com/products/moho',bid:'BLD-MOD-KERNOM-01'},
      {id:'MOD-0049',brand:'ThorpyFX',model:'The Dane',cat:'Overdrive',intro:2018,variant:'MKII',summary:'Five-year MKII refresh: smaller black anodised aluminium enclosure, retained Drive/Boost architecture, and new Boost DP/HC heavier-clipping selector.',diff:'Smaller black anodised aluminium enclosure and added Boost DP/HC clipping selector compared with MKI.',why:'The HC selector and revised enclosure are direct MKI/MKII identification clues.',url:'https://thorpyfx.com/en-us/collections/modulation-pedals-copy/products/the-dane-mkii',bid:'BLD-MOD-THORPY-01'},
      {id:'MOD-0050',brand:'Fairfield Circuitry',model:'~900',cat:'Fuzz',intro:2023,variant:'Original',summary:'Four-knob fuzz using two cascading JFET gain stages and tracing its lineage to Fairfield Circuitry\'s discontinued Four Eyes Fuzz.',diff:'INPUT, FUZZ, BIAS and VOLUME controls; tilde-prefixed model name; explicit Four Eyes lineage.',why:'The unusual four-control layout and ~900 model marking make this easy to distinguish.',url:'https://fairfieldcircuitry.com/products/900',bid:'BLD-MOD-FAIRFIELD-01'},
      {id:'MOD-0051',brand:'Champion Leccy',model:'The Divvy',cat:'Fuzz',intro:2023,variant:'V3',summary:'V3 returned to production in 2023 after a production pause; builder describes this version as the two-knob, voicing-switch form and notes Rocktar Fuzz was based on the Divvy.',diff:'Two knobs plus a voicing switch; 2023 production return is a historical event distinct from a new product introduction.',why:'Two-knob plus voicing-switch layout identifies the V3 form.',url:'https://championleccy.com/2023/06/23/summer-leccy-2023/',bid:'BLD-MOD-CHAMPION-01'},
      {id:'MOD-0052',brand:'Champion Leccy',model:'The Dunsh',cat:'Fuzz',intro:2023,variant:'Original',summary:'Amp-smashing fuzz-stortion with gating and EQ options; 2023 builder notes tie it to the End of Days Fuzz project and document UV-print/blem production variants.',diff:'Fuzz-stortion with gate and EQ options; documented finish/printing changes across production batches.',why:'Finish/print should be treated as specimen/edition evidence, not automatically a circuit-generation change.',url:'https://championleccy.com/product/the-dunsh/',bid:'BLD-MOD-CHAMPION-01'},
      {id:'MOD-0053',brand:'Drunk Beaver',model:'Distortion',cat:'Distortion',intro:2021,variant:'Latest 2023 edition',summary:'DS-1-derived distortion family with multiple generations; 2023 reporting documents updated controls and revised Muff gain-stage behavior compared with V2.',diff:'Expanded control/switch surface including mids, clipping, op-amp and Muff options; later generation-specific enclosure/knob differences are documented in the evidence trail.',why:'Generation-specific switch/control combinations distinguish later editions, but source numbering should be preserved rather than flattened.',url:'https://drunk-beaver.rocks/products/distortion',bid:'BLD-MOD-DRUNK-01'},
      {id:'MOD-0054',brand:'Black Mass Electronics',model:'1312 Distortion',cat:'Distortion',intro:2023,variant:'V3',summary:'V3 retains eight-way clipping selection and uses an internal charge pump architecture for higher internal voltage/headroom; V3 and V1/V2 manuals are separated on the manufacturer page.',diff:'Level, Filter, Gain and eight-position Clip rotary; V3 has a documented internal charge-pump/DIP configuration distinct from earlier manuals.',why:'Separate V3 documentation plus control architecture identify the V3 generation; internal settings remain non-visual evidence.',url:'https://blackmasselectronics.com/products/1312-distortion',bid:'BLD-MOD-BME-01'}
    ];

    for (const r of rows) {
      let p = base.pedals.find(x=>x.pedal_id===r.id) || base.pedals.find(x=>x.primary_builder_id===r.bid && String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if (!p) { p={pedal_id:r.id,primary_builder_id:r.bid,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Research',confidence:'Verified'}; base.pedals.push(p); }
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research&&p.archive_research.variant_evidence)||[]),{variant:r.variant,differences:r.diff,identification_value:r.why,status:'VERIFIED',source:r.url}]};
      const gid=`GEN-${r.id}`;
      if (!base.generations.some(g=>g.generation_id===gid)) base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:r.intro,end_year:null,summary:r.summary,description:r.diff,status:'VERIFIED'});
      const did=`DST-${r.id}`;
      if (!base.distinguishers.some(d=>d.distinguisher_id===did)) base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Variant / identification',description:r.diff,identification_value:r.why,source_url:r.url,status:'VERIFIED'});
      const cid=`CLM-${r.id}`;
      if (!base.claims.some(c=>c.claim_id===cid)) base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED',confidence:'High',source_url:r.url});
      if (!base.sources.some(s=>s.url===r.url)) base.sources.push({source_id:`SRC-${r.id}`,title:`${r.brand} ${r.model} ${r.variant}`,url:r.url,source_type:'manufacturer / primary lead source',author_or_org:r.brand,source_confidence:'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Modern preservation extension 61 failed:',err);return response;}};
})();
