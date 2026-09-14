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

    const builder = {id:'BLD-MOD-BROWNE-01',name:'Browne Amplification',country:'USA',source:'https://browneamps.com/'};
    if (!base.builders.some(b=>b.builder_id===builder.id) && !base.builders.some(b=>String(b.name||'').toLowerCase()===builder.name.toLowerCase())) {
      base.builders.push({builder_id:builder.id,name:builder.name,aliases:'',country:builder.country,status:'Current manufacturer',founded:null,description:'Kansas City guitar/effects company captured during the modern preservation sweep.',primary_source:builder.source,source_confidence:'High'});
    }
    const bid=builder.id;
    const rows=[
      {id:'MOD-0055',model:'Protein Dual Overdrive',cat:'Overdrive',intro:2010,variant:'V2.2',summary:'Manufacturer-documented Protein V2-era form with side-mounted jacks, mechanical switching and internal split-mode controls.',diff:'Side-mounted jacks; mechanical switches; two internal switches for split mode; 9V operation.',why:'Side-mounted jacks and mechanical switching distinguish the V2/V2.2 family from V3.',url:'https://browneamps.com/store/p/protein-dual-overdrive'},
      {id:'MOD-0056',model:'Protein Dual Overdrive',cat:'Overdrive',intro:2010,variant:'V3',summary:'Protein V3 moves to top-mounted jacks and soft switching and adds a revised internal split-mode arrangement.',diff:'Top-mounted jacks; soft switching; single internal switch for split mode; higher documented power draw than V2.',why:'Top jacks plus soft switching are primary external identification clues for V3.',url:'https://browneamps.com/store/p/protein-dual-overdrive-v3'},
      {id:'MOD-0057',model:'Protein Dual Overdrive',cat:'Overdrive',intro:2010,variant:'V4',summary:'Protein V4 adds a three-way hi-cut on the Blue side and three Green-side internal clipping/voicing options. Browne also documents a V3-to-V4 board upgrade path.',diff:'Three-way Blue-side hi-cut; Green-side low-cut, heavier clipping and asymmetrical clipping options; V3-only upgrade path.',why:'V4-specific controls and the documented V3-to-V4 upgrade distinguish this generation.',url:'https://browneamps.com/theprotein'},
      {id:'MOD-0058',model:'The Carbon',cat:'Overdrive',intro:2023,variant:'V2',summary:'Standalone Carbon derived from the Blue side of Protein. V2 adds a three-position High-Cut control and adjustable startup state soft switching.',diff:'Three-position High-Cut toggle: subtle cut, original Carbon, more pronounced cut; adjustable startup state soft switch.',why:'The High-Cut toggle and soft-switch startup behavior distinguish Carbon V2.',url:'https://browneamps.com/thecarbon'}
    ];
    for(const r of rows){
      let p=base.pedals.find(x=>x.pedal_id===r.id) || base.pedals.find(x=>x.primary_builder_id===bid && String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if(!p){p={pedal_id:r.id,primary_builder_id:bid,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Research',confidence:'Verified'};base.pedals.push(p);}
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research&&p.archive_research.variant_evidence)||[]),{variant:r.variant,differences:r.diff,identification_value:r.why,status:'VERIFIED',source:r.url}]};
      const gid=`GEN-${r.id}`;
      if(!base.generations.some(g=>g.generation_id===gid))base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:null,end_year:null,summary:r.summary,description:r.diff,status:'VERIFIED',source_url:r.url});
      const did=`DST-${r.id}`;
      if(!base.distinguishers.some(d=>d.distinguisher_id===did))base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Variant / identification',description:r.diff,identification_value:r.why,source_url:r.url,status:'VERIFIED'});
      const cid=`CLM-${r.id}`;
      if(!base.claims.some(c=>c.claim_id===cid))base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED',confidence:'High',source_url:r.url});
      if(!base.sources.some(s=>s.url===r.url))base.sources.push({source_id:`SRC-${r.id}`,title:`Browne Amplification ${r.model} ${r.variant}`,url:r.url,source_type:'manufacturer / primary source',author_or_org:'Browne Amplification',source_confidence:'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Modern preservation extension 62 failed:',err);return response;}};
})();
