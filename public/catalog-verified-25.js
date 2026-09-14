(() => {
  const nativeFetch = window.fetch.bind(window);
  const records = [
    {id:'PED-VER-0001',builder:'BLD-DISC-FULLTONE-01',category:'Overdrive',name:'OCD',year:2004,status:'Current / historical',description:'Verified Fulltone OCD family record. Fulltone documents one OCD lineage with V1.0–V1.8 value variations and identifies serial 205811+ as the less-compressed revision commonly called “v2.01” by users.',confidence:'High'},
    {id:'PED-VER-0002',builder:'BLD-DISC-FULLTONE-01',category:'Overdrive',name:'Full-Drive 2',year:null,status:'Current / historical',description:'Verified Full-Drive 2 family record preserving major documented production distinctions including early Comp-Cut, Flat-Mids, MOSFET-era variants and later Full-Drive 2 v2 production.',confidence:'High'},
    {id:'PED-VER-0003',builder:'BLD-DISC-EQD-01',category:'Fuzz',name:'Hoof',year:2007,status:'Current / historical',description:'Verified Hoof family record. EQD identifies March 18, 2007 as the first production Hoof sale and places the product in its early basement-production period.',confidence:'High'},
    {id:'PED-VER-0004',builder:'BLD-DISC-EQD-01',category:'Fuzz',name:'Hoof Reaper',year:2010,status:'Historical / discontinued',description:'Verified combination-product record. EQD documents an approximately 25-unit Tone Factor Black Friday 2010 origin followed by later reintroduction. Combines Hoof, Tone Reaper and analog octave-up.',confidence:'High'},
    {id:'PED-VER-0005',builder:'BLD-DISC-EAE-01',category:'Overdrive',name:'Longsword',year:2015,status:'Current / historical',description:'Verified EAE Longsword record with builder-defined V1 through V4.6 chronology. V4.5 covers serials #362–3252; V4.6 begins at serial #3253 in June 2026.',confidence:'Very High'},
    {id:'PED-VER-0006',builder:'BLD-DISC-EAE-01',category:'Overdrive',name:'Halberd',year:2019,status:'Current / historical',description:'Verified EAE Halberd record with V1, V2 and V2.5 chronology. V2.5 begins at serial #1684 in January 2025. The family descends from the preamp lineage developed for Sending.',confidence:'Very High'}
  ];
  const builders = {
    'BLD-DISC-FULLTONE-01':{name:'Fulltone',country:'USA',status:'Historical / revived',source:'https://www.fulltoneusa.com/',description:'Fulltone lineage spanning original Fulltone Musical Products production and the current Fulltone USA relaunch era.'},
    'BLD-DISC-EQD-01':{name:'EarthQuaker Devices',country:'USA',status:'Boutique / active',source:'https://www.earthquakerdevices.com/about',description:'Akron, Ohio effects company founded by Jamie Stillman, with early production rooted in the company’s basement workshop.'},
    'BLD-DISC-EAE-01':{name:'Electronic Audio Experiments',country:'USA',status:'Boutique / active',source:'https://www.electronicaudioexperiments.com/about',description:'Boston effects company founded by John Snyder in 2015, with unusually well-documented model revision histories.'}
  };
  const sources = [
    ['SRC-VER-25-01','https://www.fulltoneusa.com/products/ocd-v2','Fulltone OCDv2','Builder / current product','Fulltone USA'],
    ['SRC-VER-25-02','https://www.fulltoneusa.com/products/full-drive1','Full-Drive1','Builder / current product','Fulltone USA'],
    ['SRC-VER-25-03','https://www.fulltoneusa.com/products/full-drive2-v2','Full-Drive2 v2','Builder / current product','Fulltone USA'],
    ['SRC-VER-25-04','https://www.fulltoneusa.com/products/full-drive3','Full-Drive3','Builder / current product','Fulltone USA'],
    ['SRC-VER-25-05','https://www.earthquakerdevices.com/about','EQD About / History','Builder / history','EarthQuaker Devices'],
    ['SRC-VER-25-06','https://www.earthquakerdevices.com/blog-posts/fuzzcyclopedia','Fuzzcyclopedia','Builder / history','EarthQuaker Devices'],
    ['SRC-VER-25-07','https://www.earthquakerdevices.com/hoof-reaper','Hoof Reaper','Builder / product archive','EarthQuaker Devices'],
    ['SRC-VER-25-08','https://www.electronicaudioexperiments.com/pedals/longsword','Longsword','Builder / current product','Electronic Audio Experiments'],
    ['SRC-VER-25-09','https://www.electronicaudioexperiments.com/blog/2025/6/17/a-decade-of-studying-the-blade','A Decade of Studying the Blade','Builder / history','Electronic Audio Experiments'],
    ['SRC-VER-25-10','https://www.electronicaudioexperiments.com/pedals/halberd','Halberd','Builder / current product','Electronic Audio Experiments'],
    ['SRC-VER-25-11','https://www.electronicaudioexperiments.com/s/Halberd-V2-Manual-R1.pdf','Halberd V2 Manual','Builder / manual','Electronic Audio Experiments']
  ];
  const generations = [
    ['GEN-VER-25-001','PED-VER-0001','OCD V1.0–V1.8',2004,null,'Builder-defined OCD lineage with slight value variations. Collector “v2.01” is terminology for the serial 205811+ less-compressed revision, not an official numbered generation.'],
    ['GEN-VER-25-002','PED-VER-0001','OCD serial 205811+ revision',null,null,'Fulltone identifies serial 205811 and higher as the less-compressed OCD revision commonly called “v2.01” by users.'],
    ['GEN-VER-25-003','PED-VER-0001','Custom Shop OCD v1.4 reproduction',null,null,'Modern Fulltone USA reproduction/limited production event tied to the historical v1.4 specification.'],
    ['GEN-VER-25-004','PED-VER-0002','Early Full-Drive 2 / Comp-Cut',null,null,'Early Full-Drive 2 production distinguished by Comp-Cut behavior.'],
    ['GEN-VER-25-005','PED-VER-0002','Flat-Mids era',null,null,'Later Full-Drive 2 production distinguished by the Flat-Mids configuration.'],
    ['GEN-VER-25-006','PED-VER-0002','MOSFET era',null,null,'Fulltone-documented MOSFET-era Full-Drive 2 variants.'],
    ['GEN-VER-25-007','PED-VER-0002','Full-Drive 2 v2',null,null,'Later Fulltone USA Full-Drive 2 production generation.'],
    ['GEN-VER-25-008','PED-VER-0003','Early Hoof production',2007,null,'First production Hoof sale documented by EQD on March 18, 2007; early basement-production period.'],
    ['GEN-VER-25-009','PED-VER-0004','Tone Factor limited run',2010,2010,'Approximately 25 Hoof Reaper units made for Tone Factor for a 2010 Black Friday sale.'],
    ['GEN-VER-25-010','PED-VER-0004','Reintroduced production',null,null,'EQD later reintroduced Hoof Reaper after demand exceeded the original limited run.'],
    ['GEN-VER-25-011','PED-VER-0005','V1',2015,null,'Initial Longsword release.'],
    ['GEN-VER-25-012','PED-VER-0005','V2',null,null,'Added diode-clipping selection and Gain 1/2 features.'],
    ['GEN-VER-25-013','PED-VER-0005','V2.1',null,null,'Removed the Range toggle and fixed it at the selected intermediate setting.'],
    ['GEN-VER-25-014','PED-VER-0005','V3',null,null,'Added 9–18V operation and replaced Gain 1/2 with Boost.'],
    ['GEN-VER-25-015','PED-VER-0005','V4',null,null,'Six-knob layout, surface-mount PCB, external Boost control and relay bypass.'],
    ['GEN-VER-25-016','PED-VER-0005','V4.5',2021,null,'January 2021 revision, serials #362–3252.'],
    ['GEN-VER-25-017','PED-VER-0005','V4.6',2026,null,'June 2026 revision beginning at serial #3253; intelligent momentary/latching behavior and reduced Boost switch pop.'],
    ['GEN-VER-25-018','PED-VER-0006','V1',2019,null,'Fall 2019 Halberd V1; BB enclosure and NOS germanium transistor in one gain stage.'],
    ['GEN-VER-25-019','PED-VER-0006','V2',2021,null,'August 2021 revision with 125B enclosure, removal of NOS germanium, lower current draw, electronic bypass, Voice switch and protection.'],
    ['GEN-VER-25-020','PED-VER-0006','V2.5',2025,null,'January 2025 revision beginning at serial #1684 with revised Pre and Depth tapers and increased maximum gain.']
  ];
  const runs = [
    ['RUN-VER-25-001','GEN-VER-25-001',2004,null,'Builder-documented','OCD family begins in 2004; V1.0–V1.8 variations are part of one builder-defined lineage.','https://www.fulltoneusa.com/products/ocd-v2'],
    ['RUN-VER-25-002','GEN-VER-25-002',null,null,'Serial boundary','Serial 205811+ marks Fulltone’s less-compressed OCD revision.','https://www.fulltoneusa.com/products/ocd-v2'],
    ['RUN-VER-25-003','GEN-VER-25-003',null,null,'Current limited event','Modern Custom Shop OCD v1.4 reproduction, separate from original 2000s production.','https://www.fulltoneusa.com/collections/ocd/products/custom-shop-ocd-v1-4'],
    ['RUN-VER-25-004','GEN-VER-25-008',2007,null,'Exact date anchor','First production Hoof sale documented March 18, 2007.','https://www.earthquakerdevices.com/about'],
    ['RUN-VER-25-005','GEN-VER-25-009',2010,2010,'Exact year / limited run','Approximately 25 Hoof Reapers made for Tone Factor for Black Friday 2010.','https://www.earthquakerdevices.com/blog-posts/fuzzcyclopedia'],
    ['RUN-VER-25-006','GEN-VER-25-011',2015,null,'Year anchor','First Longsword batch orders began June 17, 2015.','https://www.electronicaudioexperiments.com/blog/2025/6/17/a-decade-of-studying-the-blade'],
    ['RUN-VER-25-007','GEN-VER-25-016',2021,null,'Month / serial range','V4.5: January 2021, serials #362–3252.','https://www.electronicaudioexperiments.com/pedals/longsword'],
    ['RUN-VER-25-008','GEN-VER-25-017',2026,null,'Month / serial threshold','V4.6: June 2026, beginning at serial #3253.','https://www.electronicaudioexperiments.com/pedals/longsword'],
    ['RUN-VER-25-009','GEN-VER-25-018',2019,null,'Season anchor','Halberd V1 released Fall 2019.','https://www.electronicaudioexperiments.com/pedals/halberd'],
    ['RUN-VER-25-010','GEN-VER-25-019',2021,null,'Month anchor','Halberd V2 released August 2021.','https://www.electronicaudioexperiments.com/pedals/halberd'],
    ['RUN-VER-25-011','GEN-VER-25-020',2025,null,'Month / serial threshold','Halberd V2.5: January 2025, beginning at serial #1684.','https://www.electronicaudioexperiments.com/pedals/halberd']
  ];
  const distinguishers = [
    ['DST-VER-25-001','GEN-VER-25-002','Serial threshold','Fulltone serial 205811+ identifies the less-compressed OCD revision.','Serial 205811 and higher','Verified','https://www.fulltoneusa.com/products/ocd-v2'],
    ['DST-VER-25-002','GEN-VER-25-001','Terminology','“v2.01” is collector/user terminology for the serial 205811+ revision, not Fulltone’s official generation name.','Label as collector terminology','Verified','https://www.fulltoneusa.com/products/ocd-v2'],
    ['DST-VER-25-003','GEN-VER-25-008','Production date','EQD identifies March 18, 2007 as the first production Hoof sale.','March 18, 2007','Verified','https://www.earthquakerdevices.com/about'],
    ['DST-VER-25-004','GEN-VER-25-009','Limited-run quantity','Approximately 25 Hoof Reapers were made for the 2010 Tone Factor Black Friday sale.','Approx. 25 units','Verified','https://www.earthquakerdevices.com/blog-posts/fuzzcyclopedia'],
    ['DST-VER-25-005','GEN-VER-25-016','Serial range','Longsword V4.5 covers serials #362–3252.','#362–3252','Verified','https://www.electronicaudioexperiments.com/pedals/longsword'],
    ['DST-VER-25-006','GEN-VER-25-017','Serial threshold','Longsword V4.6 begins at serial #3253.','#3253+','Verified','https://www.electronicaudioexperiments.com/pedals/longsword'],
    ['DST-VER-25-007','GEN-VER-25-020','Serial threshold','Halberd V2.5 begins at serial #1684.','#1684+','Verified','https://www.electronicaudioexperiments.com/pedals/halberd']
  ];
  const claims = [
    ['CLM-VER-25-001','PED-VER-0001','Fulltone states OCD began in 2004 and describes one OCD lineage with V1.0–V1.8 variations.','Verified','High','SRC-VER-25-01'],
    ['CLM-VER-25-002','PED-VER-0001','Fulltone identifies serial 205811 and higher as the less-compressed revision commonly called “v2.01” by users.','Verified','High','SRC-VER-25-01'],
    ['CLM-VER-25-003','PED-VER-0003','EQD identifies March 18, 2007 as the first production Hoof sale.','Verified','High','SRC-VER-25-05'],
    ['CLM-VER-25-004','PED-VER-0004','EQD records an approximately 25-unit Tone Factor Black Friday 2010 origin for Hoof Reaper before later reintroduction.','Verified','High','SRC-VER-25-06'],
    ['CLM-VER-25-005','PED-VER-0005','EAE documents Longsword V4.5 as January 2021 serials #362–3252 and V4.6 as June 2026 beginning at serial #3253.','Verified','Very High','SRC-VER-25-08'],
    ['CLM-VER-25-006','PED-VER-0006','EAE documents Halberd V2.5 as January 2025 beginning at serial #1684.','Verified','Very High','SRC-VER-25-10']
  ];
  const superseded = {
    'BLD-DISC-FULLTONE-01': n => /ocd|full-?drive\s*2/i.test(n),
    'BLD-DISC-EQD-01': n => /^(earthquaker devices\s+)?hoof( fuzz)?$|^earthquaker devices\s+hoof reaper$/i.test(n),
    'BLD-DISC-EAE-01': n => /^(electronic audio experiments\s+)?(longsword|halberd)$/i.test(n)
  };
  let merged=false;
  async function merge(base){
    base.builders=base.builders||[]; base.pedals=base.pedals||[]; base.generations=base.generations||[]; base.sources=base.sources||[]; base.claims=base.claims||[]; base.runs=base.runs||[]; base.distinguishers=base.distinguishers||[];
    for(const [id,v] of Object.entries(builders)){
      let b=base.builders.find(x=>x.builder_id===id);
      if(b) Object.assign(b,{name:v.name,country:v.country,status:v.status,description:v.description,primary_source:v.source,source_confidence:'High'});
      else base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.source,source_confidence:'High'});
    }
    base.pedals=base.pedals.filter(p=>!(superseded[p.primary_builder_id]&&superseded[p.primary_builder_id](String(p.model_name||''))));
    for(const r of records){
      const old=base.pedals.find(p=>p.pedal_id===r.id);
      const p={pedal_id:r.id,primary_builder_id:r.builder,model_name:r.name,primary_category:r.category,subcategory:'Verified archive record',introduced_year:r.year,discontinued_year:null,production_status:r.status,description:r.description,archive_status:'Verified',confidence:r.confidence};
      if(old) Object.assign(old,p); else base.pedals.push(p);
    }
    for(const [id,url,title,type,org] of sources){ if(!base.sources.some(s=>s.source_id===id)) base.sources.push({source_id:id,url,title,source_type:type,author_or_org:org}); }
    for(const [id,pid,name,start,end,summary] of generations){ if(!base.generations.some(g=>g.generation_id===id)) base.generations.push({generation_id:id,pedal_id:pid,name,start_year:start,end_year:end,summary}); }
    for(const [id,gid,start,end,dateQuality,summary,url] of runs){ if(!base.runs.some(r=>r.run_id===id)) base.runs.push({run_id:id,generation_id:gid,start_year:start,end_year:end,date_quality:dateQuality,summary,source_url:url}); }
    for(const [id,gid,type,description,value,status,url] of distinguishers){ if(!base.distinguishers.some(d=>d.distinguisher_id===id)) base.distinguishers.push({distinguisher_id:id,generation_id:gid,type,description,identification_value:value,status,source_url:url}); }
    for(const [id,subject,claim,status,confidence,sourceId] of claims){ const src=base.sources.find(s=>s.source_id===sourceId); if(!base.claims.some(c=>c.claim_id===id)) base.claims.push({claim_id:id,subject_id:subject,claim_text:claim,status,confidence,source_url:src?.url||''}); }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init); const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged)return response;
    try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}catch(err){console.error('Verified promotion extension 25 failed:',err);return response;}
  };
})();
