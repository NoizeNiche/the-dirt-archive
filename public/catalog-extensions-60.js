(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  const defs = [
    {id:'BLD-MOD-ATOMIC-TONE-01',name:'Atomic Tone LLC',country:'USA'},
    {id:'BLD-MOD-EMPRESS-01',name:'Empress Effects',country:'Canada'},
    {id:'BLD-MOD-KEELEY-01',name:'Keeley Electronics',country:'USA'},
    {id:'BLD-MOD-COLLISION-01',name:'Collision Devices',country:'France'},
    {id:'BLD-MOD-CATALINBREAD-01',name:'Catalinbread',country:'USA'}
  ];
  const research = {
    'NOTAKLÖN': '2023-present DIY overdrive kit with JHS Shamrock modification; Output/Treble/Gain controls, Shamrock switch, top jacks, 9V input internally converted to 18V. Later Pink/Splatter/Blackout variants are treated as editions unless evidence establishes a product-generation change.',
    'Noble Screamer': '2023-present four-in-one analog overdrive/boost using two familiar drive architectures plus two hybrid amp-like tones; selectable tone and clipping structures, buffered/true-bypass switching, new aluminum enclosure.',
    'Heavy Menace': '2023-present compact evolution of the 2013 Heavy with Lite(ish), Heavy and Heavier modes, four-band EQ including Weight, and responsive gating. Distinct product generation from the original two-channel Heavy.',
    'TARS': '2023-present standalone fuzz/filter derived from the Singularity section of Black Hole Symmetry, with MS-20-style resonant low-pass filtering, slope/routing switches and expression/CV control.',
    'Saturation Triptych': '2023-present hybrid boost/overdrive/distortion/fuzz; V1 baseline has three gain regions in one 125B enclosure. V2 adds extra low-end voicing and more saturation across all three positions.',
    'CB Fuzz': '2023-present one-knob Catalinbread CB Series fuzz with shared series enclosure/art language.',
    'CB Overdrive': '2023-present one-knob Catalinbread CB Series overdrive with shared series enclosure/art language.',
    'CB Distortion': '2023-present one-knob Catalinbread CB Series distortion with shared series enclosure/art language.'
  };
  async function merge(base) {
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    base.sources = base.sources || [];
    base.generations = base.generations || [];
    base.distinguishers = base.distinguishers || [];
    base.claims = base.claims || [];
    const known = new Set(base.builders.map(b => b.builder_id));
    const byName = new Map(base.builders.map(b => [String(b.name||'').toLowerCase(), b]));
    for (const d of defs) if (!known.has(d.id)) base.builders.push({builder_id:d.id,name:d.name,aliases:'',country:d.country,status:'Current manufacturer',founded:null,description:'Modern preservation builder captured during newest-to-oldest catalog research.',primary_source:'',source_confidence:'Research'});
    const builderMap = Object.fromEntries(defs.map(d=>[d.name,d.id]));
    const rows = await nativeFetch('modern-variant-discovery-07.tsv').then(r=>r.ok?r.text():'');
    const existingPedal = new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').toLowerCase()}`));
    const sourceByUrl = new Map(base.sources.filter(s=>s.url).map(s=>[s.url,s]));
    for (const line of rows.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [id,brand,model,variant,period,kind,diff,status,url,note] = line.split('\t');
      const bid = builderMap[brand] || byName.get(String(brand||'').toLowerCase())?.builder_id;
      if (!bid) continue;
      let p = base.pedals.find(x => x.primary_builder_id===bid && String(x.model_name||'').toLowerCase()===model.toLowerCase());
      if (!p) {
        p={pedal_id:id,primary_builder_id:bid,model_name:model,primary_category:(/fuzz/i.test(model+' '+kind)?'Fuzz':/distortion/i.test(model+' '+kind)?'Distortion':'Overdrive'),subcategory:'Modern preservation / variant research',introduced_year:null,discontinued_year:null,production_status:'Modern / research',description:`Modern preservation record for ${model}.`,archive_status:'Research',confidence:'Discovery'};
        base.pedals.push(p); existingPedal.add(`${bid}::${model.toLowerCase()}`);
      }
      p.archive_research={...(p.archive_research||{}),summary:research[model]||p.archive_research?.summary||'',variant_evidence:(p.archive_research?.variant_evidence||[]).concat([{variant,period,kind,differences:diff,status,url,note}])};
      const genId=`GEN-${id}`;
      if (!base.generations.some(g=>g.generation_id===genId)) base.generations.push({generation_id:genId,pedal_id:p.pedal_id,name:variant,start_year:(period.match(/\d{4}/)||[''])[0]||null,end_year:null,summary:diff,description:note||diff,status:'VERIFIED',source_url:url});
      const distId=`DST-${id}`;
      if (!base.distinguishers.some(d=>d.distinguisher_id===distId)) base.distinguishers.push({distinguisher_id:distId,generation_id:genId,type:kind,description:diff,identification_value:note||diff,status:status||'VERIFIED',source_url:url});
      if (url && !sourceByUrl.has(url)) { const s={source_id:`SRC-${id}`,title:`${brand} ${model} ${variant}`,url,source_type:'manufacturer / lead source',author_or_org:brand,source_confidence:'High'}; base.sources.push(s); sourceByUrl.set(url,s); }
      const claimId=`CLM-${id}`;
      if (!base.claims.some(c=>c.claim_id===claimId)) base.claims.push({claim_id:claimId,subject_id:p.pedal_id,claim_text:`${variant}: ${diff}`,status:status||'VERIFIED',confidence:status==='VERIFIED'?'High':'Research',source_url:url});
    }
    return base;
  }
  window.fetch = async (input,init) => {
    const response = await nativeFetch(input,init);
    const url = new URL(typeof input==='string'?input:input.url,location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base=await response.clone().json(); const data=await merge(base); merged=true; return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}); }
    catch(err){ console.error('Modern variant extension 60 failed:',err); return response; }
  };
})();
