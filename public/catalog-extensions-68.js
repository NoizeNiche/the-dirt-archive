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
      {id:'BLD-MOD-BOSS-01',name:'BOSS',country:'Japan',source:'https://www.boss.info/us/whats_new/press_releases/2023/BOSS-Introduces-Waza-Craft-BP-1W-Booster-Preamp/'},
      {id:'BLD-MOD-FENDER-01',name:'Fender',country:'USA',source:'https://spotlight.fender.com/newsroom/news/914'},
      {id:'BLD-MOD-GEFX-01',name:'Great Eastern FX Co.',country:'UK',source:'https://www.guitarpedalx.com/news/gpx-blog/2023-best-of-new-fuzz-pedals-of-the-year'}
    ];
    for (const d of defs) if (!base.builders.some(b=>b.builder_id===d.id) && !base.builders.some(b=>String(b.name||'').toLowerCase()===d.name.toLowerCase())) base.builders.push({builder_id:d.id,name:d.name,aliases:'',country:d.country,status:'Current manufacturer',founded:null,description:'Modern preservation builder captured during the 2023 newest-to-oldest census.',primary_source:d.source,source_confidence:'High'});
    const rows = [
      {id:'MOD-0068',bid:'BLD-MOD-BOSS-01',model:'BP-1W Booster/Preamp',cat:'Overdrive',intro:2023,variant:'Original',summary:'Waza Craft booster/preamp introduced October 26, 2023. Three modes provide CE preamp, RE preamp and clean boost voices; Gain and Level controls plus selectable buffer types.',diff:'New BOSS Waza Craft product; CE and RE modes reference the preamp sections of the CE-1 and RE-201, but BOSS does not present BP-1W as a CE-1 or RE-201 product generation.',why:'Three-mode CE/RE/NAT architecture, Gain/Level controls and rear buffer selection identify the BP-1W.',url:'https://www.boss.info/us/whats_new/press_releases/2023/BOSS-Introduces-Waza-Craft-BP-1W-Booster-Preamp/'},
      {id:'MOD-0069',bid:'BLD-MOD-FENDER-01',model:'Shields Blender',cat:'Fuzz',intro:2023,variant:'Limited Edition launch',summary:'Kevin Shields signature fuzz launched June 13, 2023 after more than four years of co-development. Fender describes it as built around a circuit traced from Shields personal 1970s Fender Blender, with two footswitchable fuzz channels and reactive sag.',diff:'Limited Edition signature product; two fuzz channels, octave-up control, blend controls, suboctave channel and reactive sag circuit; angled brushed-aluminum 1970s-inspired enclosure with top jacks.',why:'Four footswitches, channel/sag arrangement, brushed-aluminum chassis and signature-product identity strongly distinguish the Shields Blender from vintage Fender Blender products.',url:'https://spotlight.fender.com/newsroom/news/914'},
      {id:'MOD-0070',bid:'BLD-MOD-GEFX-01',model:'Focus Fuzz',cat:'Fuzz',intro:2023,variant:'Original',summary:'2023 Great Eastern FX Co. Ge/Si Focus Fuzz. Contemporary GPX documentation identifies a hybrid germanium/silicon fuzz with Fuzz, Level and Focus controls.',diff:'Three-control hybrid Ge/Si fuzz; Fuzz control combines gain/bias behavior, Level handles master output and Focus provides tuned gain/frequency shaping.',why:'Three-control Fuzz/Level/Focus layout and hybrid Ge/Si identity provide primary identification clues in contemporary documentation.',url:'https://www.guitarpedalx.com/news/gpx-blog/2023-best-of-new-fuzz-pedals-of-the-year'}
    ];
    for (const r of rows) {
      const b=base.builders.find(x=>x.builder_id===r.bid);
      let p=base.pedals.find(x=>x.pedal_id===r.id)||base.pedals.find(x=>x.primary_builder_id===r.bid&&String(x.model_name||'').toLowerCase()===r.model.toLowerCase());
      if(!p){p={pedal_id:r.id,primary_builder_id:r.bid,model_name:r.model,primary_category:r.cat,subcategory:'Modern preservation / variant research',introduced_year:r.intro,discontinued_year:null,production_status:'Modern / research',description:r.summary,archive_status:'Cataloged',confidence:'Verified'};base.pedals.push(p);}
      p.archive_research={...(p.archive_research||{}),summary:r.summary,variant_evidence:[...((p.archive_research&&p.archive_research.variant_evidence)||[]),{variant:r.variant,differences:r.diff,identification_value:r.why,status:'VERIFIED',source:r.url}]};
      const gid=`GEN-${r.id}`; if(!base.generations.some(g=>g.generation_id===gid))base.generations.push({generation_id:gid,pedal_id:p.pedal_id,name:r.variant,start_year:r.intro,end_year:null,summary:r.summary,description:r.diff,status:'VERIFIED',source_url:r.url});
      const did=`DST-${r.id}`; if(!base.distinguishers.some(d=>d.distinguisher_id===did))base.distinguishers.push({distinguisher_id:did,generation_id:gid,type:'Variant / identification',description:r.diff,identification_value:r.why,source_url:r.url,status:'VERIFIED'});
      const cid=`CLM-${r.id}`; if(!base.claims.some(c=>c.claim_id===cid))base.claims.push({claim_id:cid,subject_id:p.pedal_id,claim_text:r.summary,status:'VERIFIED',confidence:'High',source_url:r.url});
      if(!base.sources.some(s=>s.url===r.url))base.sources.push({source_id:`SRC-${r.id}`,title:`${r.model} ${r.variant}`,url:r.url,source_type:'manufacturer / strong secondary source',author_or_org:b?.name||'',source_confidence:b?.name==='Great Eastern FX Co.'?'Medium':'High'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Modern preservation extension 68 failed:',err);return response;}};
})();
