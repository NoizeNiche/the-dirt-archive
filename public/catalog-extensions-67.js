(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  const rows = [
    {id:'MOD-0065',brand:'Bardic Audio Devices',model:'Rival',cat:'Distortion',intro:2023,variant:'Original',summary:'2023 Mesa Mark V-style preamp/distortion with five-band graphic EQ, Presence, Gain, Volume and separate Gain/Solo footswitches.',diff:'Five-band 80Hz/240Hz/750Hz/2.2kHz/6.6kHz graphic EQ; Gain and Solo switching; 9–15V; top-mounted jacks; handmade in Niles, Illinois.',url:'https://www.guitarpedalx.com/news/gpx-blog/bardic-audio-devices-designs-the-perfect-mesa-mark-v-style-preamp-pedal-with-a-little-help-from-yours-truly---the-rival-amp-distortion--preamp'},
    {id:'MOD-0066',brand:'Messiah Guitars',model:'Eddie BoostDrive',cat:'Overdrive',intro:2023,variant:'Original 18V',summary:'Dual boost and drive pedal introduced in 2023 after a year of development with guitarist Eddie Haddad.',diff:'Separate MOSFET boost and drive sections; three-band EQ; Tight switch; silicon/LED clipping selection; internal charge pump; standard 9V input; dual footswitches.',url:'https://www.messiahguitars.com/2023/04/07/eddie-boostdrive/'},
    {id:'MOD-0067',brand:'PedalPalFX',model:'PAL800 Gold Overdrive',cat:'Overdrive',intro:2023,variant:'V4',summary:'PAL800 V4 is the fourth-generation Gold Overdrive, described by the manufacturer as eight years of evolution of its 800 series in a smaller enclosure.',diff:'Three-way JCM II/Mod #07/Mod #34 switch; Gain, Bass, Middle, Treble, Presence and Master Volume; internal Master Tone trim; V4 is explicitly distinguished from V3 by manufacturer documentation.',url:'https://www.pedalpalfx.com/pal800-v4-gold-overdrive'},
    {id:'MOD-0068',brand:'Electric Eye Audio',model:'The Thrasher',cat:'Distortion',intro:2023,variant:'Standard / Stealth edition evidence',summary:'2023 high-gain distortion documented in contemporary reporting in standard/red and black/Stealth treatments.',diff:'Standard and Stealth/Black appearance treatments are preserved as edition/specimen evidence; no generation change is inferred from color alone.',url:'https://www.guitarpedalx.com/news/gpx-blog/2023-best-new-distortion-pedals-of-the-year'},
    {id:'MOD-0069',brand:'Intensive Care Audio',model:'Vena Cava',cat:'Distortion',intro:2023,variant:'Original',summary:'2023 filter/distortion instrument combining dirt with filter, oscillation and ring-mod-oriented functions.',diff:'Function identity spans filter, distortion, oscillation and ring modulation; archive taxonomy keeps it as an experimental dirt product rather than forcing it into a conventional distortion-only family.',url:'https://www.guitarpedalx.com/news/gpx-blog/2023-best-new-distortion-pedals-of-the-year'},
    {id:'MOD-0070',brand:'Intensive Care Audio',model:'Death Drive',cat:'Distortion',intro:2023,variant:'Original',summary:'2023 Intensive Care Audio distortion product documented in contemporary pedal-chain reporting.',diff:'Product identity is supported; exact generation chronology remains unresolved and is deliberately not inferred.',url:'https://www.guitarpedalx.com/news/gpx-blog/2023-october-pedal-chain-update---episode-x---transformation-multipliers'}
  ];
  const builders = [
    ['BLD-MOD-BARDIC-01','Bardic Audio Devices','USA'],
    ['BLD-MOD-MESSIAH-01','Messiah Guitars','USA'],
    ['BLD-MOD-PEDALPAL-01','PedalPalFX','Venezuela'],
    ['BLD-MOD-ELECTRIC-EYE-01','Electric Eye Audio','USA'],
    ['BLD-MOD-ICA-01','Intensive Care Audio','USA']
  ];
  async function merge(base) {
    base.builders=base.builders||[]; base.pedals=base.pedals||[]; base.generations=base.generations||[]; base.distinguishers=base.distinguishers||[]; base.claims=base.claims||[]; base.sources=base.sources||[];
    for (const [id,name,country] of builders) if (!base.builders.some(b=>b.builder_id===id || String(b.name||'').toLowerCase()===name.toLowerCase())) base.builders.push({builder_id:id,name,country,aliases:'',status:'Current / modern preservation',founded:null,description:'Builder captured during the newest-to-oldest 2023 census.',primary_source:'',source_confidence:'Research'});
    for (const r of rows) {
      const b=base.builders.find(x=>String(x.name||'').toLowerCase()===r.brand.toLowerCase()); if(!b) continue;
      let p=base.pedals.find(x=>x.primary_builder_id===b.builder_id && String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if(!p){p={pedal_id:r.id,primary_builder_id:b.builder_id,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Research',confidence:'Verified'};base.pedals.push(p);}
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research||{}).variant_evidence||[]),{variant:r.variant,period:String(r.intro),differences:r.diff,status:'VERIFIED / STRONG SECONDARY',source:r.url}]};
      const gid=`GEN-${r.id}`; if(!base.generations.some(g=>g.generation_id===gid)) base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:r.intro,end_year:null,summary:r.summary,description:r.diff,status:r.variant.includes('edition')?'RESEARCH':'VERIFIED'});
      const did=`DST-${r.id}`; if(!base.distinguishers.some(d=>d.distinguisher_id===did)) base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Identification / variant evidence',description:r.diff,identification_value:r.diff,source_url:r.url,status:'VERIFIED'});
      const cid=`CLM-${r.id}`; if(!base.claims.some(c=>c.claim_id===cid)) base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED / STRONG SECONDARY',confidence:'High',source_url:r.url});
      if(!base.sources.some(s=>s.url===r.url)) base.sources.push({source_id:`SRC-${r.id}`,title:`${r.brand} ${r.model} ${r.variant}`,url:r.url,source_type:'manufacturer / strong contemporary secondary',author_or_org:r.brand,source_confidence:'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(e){console.error('Modern preservation extension 67 failed:',e);return response;}};
})();
