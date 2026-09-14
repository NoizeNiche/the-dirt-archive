(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  const builders = [
    {id:'BLD-MOD-GEFX-01',name:'Great Eastern FX Co.',country:'UK',source:'https://www.greateasternfx.com/'},
    {id:'BLD-MOD-MESSIAH-01',name:'Messiah Guitars',country:'USA',source:'https://messiahguitars.com/'},
    {id:'BLD-MOD-COPPERSOUND-01',name:'CopperSound Pedals',country:'USA',source:'https://coppersoundpedals.com/'},
    {id:'BLD-MOD-FLOWER-01',name:'Flower Pedals',country:'USA',source:'https://flower-pedals.com/'},
    {id:'BLD-MOD-BARDIC-01',name:'Bardic Audio Devices',country:'USA',source:''}
  ];
  const rows = [
    {id:'MOD-0055',bid:'BLD-MOD-GEFX-01',brand:'Great Eastern FX Co.',model:'Focus Fuzz',cat:'Fuzz',intro:2023,variant:'2023 production run',summary:'Original hybrid germanium/silicon fuzz launched in 2023 and limited to 250 units because of transistor availability.',diff:'Focus, Fuzz and Level controls; 250-unit production limitation documented at launch.',why:'Three-control layout and limited-production identity distinguish the launch product.',url:'https://www.premierguitar.com/great-eastern-focus-fuzz'},
    {id:'MOD-0056',bid:'BLD-MOD-MESSIAH-01',brand:'Messiah Guitars',model:'Billy Transparent Overdrive',cat:'Overdrive',intro:2023,variant:'Standard / Brown Sugar Edition',summary:'First Messiah Guitars overdrive: four controls plus three-position silicon/germanium/experimental-fuzz mode switch.',diff:'Standard silver finish versus limited Brown Sugar edition; Brown Sugar uses NOS germanium diodes in its germanium mode.',why:'Brown Sugar is an edition-level identification clue, not automatically a new generation.',url:'https://www.premierguitar.com/news/messiah-guitars-billy-overdrive'},
    {id:'MOD-0057',bid:'BLD-MOD-COPPERSOUND-01',brand:'CopperSound Pedals',model:'Kingpin',cat:'Overdrive',intro:2023,variant:'Original',summary:'Mini two-stage FET overdrive with germanium clipping diodes, three levels of overdrive and Clip toggle.',diff:'Mini enclosure; Volume-based high gain range; Clip toggle; 9-18V operation and mechanical true bypass.',why:'Compact enclosure and Clip control identify the product; germanium refers to clipping diodes rather than a transistor fuzz lineage.',url:'https://www.premierguitar.com/news/coppersound-kingpin-and-iris'},
    {id:'MOD-0058',bid:'BLD-MOD-FLOWER-01',brand:'Flower Pedals',model:'Lupine Dual Fuzz',cat:'Fuzz',intro:2023,variant:'2023 Dual Fuzz',summary:'Compound fuzz combining the Purple octave-up side derived from the earlier Lupine with a new JFET Cream fuzz side.',diff:'Purple side gains Gain control; Cream side has Input, Bias and Output; independent sides and extra input/output jacks; startup single-fuzz mode.',why:'Two distinct sides and expanded I/O identify the 2023 compound product from the earlier Purple Lupine.',url:'https://www.premierguitar.com/news/flower-pedals-lupine'},
    {id:'MOD-0059',bid:'BLD-MOD-BARDIC-01',brand:'Bardic Audio Devices',model:'2 Stroke Beaver / Shelob\'s Lair',cat:'Fuzz',intro:2023,variant:'Artwork identities',summary:'2023 reporting identifies 2 Stroke Beaver and Shelob\'s Lair as the same circuit with different artwork, an extended-range Rat-style fuzz/distortion.',diff:'Same circuit, different artwork/name presentation.',why:'Name and artwork distinguish specimens/market presentation, while the underlying product identity remains shared.',url:'https://www.guitarpedalx.com/news/bardic-audio-devices-distortion-trifecta'}
  ];
  async function merge(base){
    base.builders=base.builders||[]; base.pedals=base.pedals||[]; base.generations=base.generations||[]; base.distinguishers=base.distinguishers||[]; base.claims=base.claims||[]; base.sources=base.sources||[];
    for(const b of builders) if(!base.builders.some(x=>x.builder_id===b.id)||!base.builders.some(x=>String(x.name||'').toLowerCase()===b.name.toLowerCase())) base.builders.push({builder_id:b.id,name:b.name,aliases:'',country:b.country,status:'Current manufacturer',founded:null,description:'Builder captured during modern newest-to-oldest preservation research.',primary_source:b.source,source_confidence:'High'});
    for(const r of rows){
      let p=base.pedals.find(x=>x.pedal_id===r.id)||base.pedals.find(x=>x.primary_builder_id===r.bid&&String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if(!p){p={pedal_id:r.id,primary_builder_id:r.bid,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Research',confidence:'Verified'};base.pedals.push(p)}
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research&&p.archive_research.variant_evidence)||[]),{variant:r.variant,differences:r.diff,identification_value:r.why,status:'VERIFIED',source:r.url}]};
      const gid='GEN-'+r.id; if(!base.generations.some(g=>g.generation_id===gid)) base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:r.intro,end_year:null,summary:r.summary,description:r.diff,status:'VERIFIED'});
      const did='DST-'+r.id; if(!base.distinguishers.some(d=>d.distinguisher_id===did)) base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Variant / identification',description:r.diff,identification_value:r.why,source_url:r.url,status:'VERIFIED'});
      const cid='CLM-'+r.id; if(!base.claims.some(c=>c.claim_id===cid)) base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED',confidence:'High',source_url:r.url});
      if(!base.sources.some(s=>s.url===r.url)) base.sources.push({source_id:'SRC-'+r.id,title:r.brand+' '+r.model+' '+r.variant,url:r.url,source_type:'contemporary primary/secondary lead',author_or_org:r.brand,source_confidence:'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}catch(err){console.error('Modern preservation extension 64 failed:',err);return response}};
})();
