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
    const builders = [
      {id:'BLD-MOD-BOSS-01',name:'BOSS',country:'Japan',source:'https://www.boss.info/'},
      {id:'BLD-MOD-FENDER-01',name:'Fender',country:'USA',source:'https://www.fender.com/'}
    ];
    for (const b of builders) if (!base.builders.some(x=>x.builder_id===b.id) && !base.builders.some(x=>String(x.name||'').toLowerCase()===b.name.toLowerCase())) base.builders.push({builder_id:b.id,name:b.name,aliases:'',country:b.country,status:'Current manufacturer',founded:null,description:'Modern preservation builder captured during the 2023 newest-to-oldest sweep.',primary_source:b.source,source_confidence:'High'});
    const rows = [
      {id:'MOD-0055',bid:'BLD-MOD-BOSS-01',brand:'BOSS',model:'BP-1W Booster/Preamp',cat:'Overdrive',intro:2023,variant:'Original 2023',summary:'Waza Craft analog booster/preamp with CE, RE and NAT modes, Gain and Level controls, and selectable standard/vintage input buffer.',diff:'Three modes; selectable buffer; Made in Japan; buffered bypass; compact Waza Craft enclosure.',why:'MODE and BUFFER controls plus the BP-1W designation identify the product.',url:'https://www.boss.info/us/products/bp-1w/'},
      {id:'MOD-0056',bid:'BLD-MOD-FENDER-01',brand:'Fender',model:'Shields Blender',cat:'Fuzz',intro:2023,variant:'Limited Edition 2023',summary:'Kevin Shields signature fuzz developed with Fender around the circuit of Shields personal 1970s Fender Blender, expanded with two footswitchable fuzz channels, octave blending and reactive sag.',diff:'Angled brushed-aluminum chassis, four footswitches, two fuzz channels, blend controls, octave functionality, reactive sag, top-mounted jacks and true bypass.',why:'Four-switch layout, Kevin Shields branding, angled chassis and dual-channel architecture distinguish the product.',url:'https://www.fender.com/products/fender-shields-blender'}
    ];
    for (const r of rows) {
      let p=base.pedals.find(x=>x.pedal_id===r.id)||base.pedals.find(x=>x.primary_builder_id===r.bid&&String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if(!p){p={pedal_id:r.id,primary_builder_id:r.bid,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Cataloged',confidence:'Verified'};base.pedals.push(p);}
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research&&p.archive_research.variant_evidence)||[]),{variant:r.variant,differences:r.diff,identification_value:r.why,status:'VERIFIED',source:r.url}]};
      const gid=`GEN-${r.id}`;
      if(!base.generations.some(g=>g.generation_id===gid))base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:r.intro,end_year:null,summary:r.summary,description:r.diff,status:'VERIFIED'});
      const did=`DST-${r.id}`;
      if(!base.distinguishers.some(d=>d.distinguisher_id===did))base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Variant / identification',description:r.diff,identification_value:r.why,source_url:r.url,status:'VERIFIED'});
      const cid=`CLM-${r.id}`;
      if(!base.claims.some(c=>c.claim_id===cid))base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED',confidence:'High',source_url:r.url});
      if(!base.sources.some(s=>s.url===r.url))base.sources.push({source_id:`SRC-${r.id}`,title:`${r.brand} ${r.model} ${r.variant}`,url:r.url,source_type:'manufacturer / primary source',author_or_org:r.brand,source_confidence:'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Modern preservation extension 63 failed:',err);return response;}};
})();
