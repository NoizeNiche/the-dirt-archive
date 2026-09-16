(() => {
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const specs=()=>Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  const pedalFromHash=()=>{const raw=location.hash.replace(/^#\/?pedal\//,'');let key=raw;try{key=decodeURIComponent(raw)}catch{}const pedals=Array.isArray(window.DATA?.pedals)?window.DATA.pedals:[];return pedals.find(p=>String(p.pedal_id)===key)||pedals.find(p=>String(p.model_name||'').trim().toLowerCase()===key.trim().toLowerCase())||null;};
  const builderFor=p=>{const builders=Array.isArray(window.DATA?.builders)?window.DATA.builders:[];return p?builders.find(b=>b.builder_id===p.primary_builder_id):null;};
  const generationRecords=p=>{
    if(!p)return [];
    const researched=Array.isArray(p.archive_research?.generations)?p.archive_research.generations:(window.DIRT_RESEARCH_GENERATIONS?.[p.model_name]||[]);
    if(researched.length)return researched.map((g,i)=>{const years=String(g.years||'');const matches=years.match(/(\d{4})\D*(\d{4})?/);return {id:g.generation_id||`GEN-${String(p.model_name||'pedal').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${String(i+1).padStart(2,'0')}`,name:g.name||g.label||`Generation ${i+1}`,start_year:g.start_year||(matches?Number(matches[1]):null),end_year:g.end_year||(matches&&matches[2]?Number(matches[2]):null),summary:g.summary||g.notes||g.description||''};});
    const structured=Array.isArray(window.DATA?.generations)?window.DATA.generations.filter(g=>g.pedal_id===p.pedal_id):[];
    return structured.map((g,i)=>({id:g.generation_id,name:g.name||g.label||`Generation ${i+1}`,start_year:g.start_year,end_year:g.end_year,summary:g.summary||g.description||''}));
  };
  const recordsFor=(title,builderName)=>{const list=specs().filter(s=>String(s.title||'').trim()===String(title||'').trim());const tagged=list.filter(s=>s.builder);if(builderName&&tagged.length){const exact=tagged.filter(s=>String(s.builder).trim().toLowerCase()===String(builderName).trim().toLowerCase());if(exact.length)return exact;return list.filter(s=>!s.builder);}return list;};
  const cleared=s=>['cleared','licensed','permission granted','owned','public domain','cc-by','cc-by-sa'].includes(String(s?.rights||s?.rights_status||'reference').trim().toLowerCase())&&s?.public_use_decision!=='pending';
  const imageSearch=(title,g)=>`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${title} ${g.name||''} ${g.start_year||''} guitar pedal vintage`)}`;
  const visual=(s,title,g)=>cleared(s)&&s.src?`<a class="generation-visual-link" href="${esc(s.page||s.src)}" target="_blank" rel="noopener"><img class="generation-visual" src="${esc(s.src)}" alt="${esc(title)} ${esc(g.name)} visual reference" loading="lazy" referrerpolicy="no-referrer"></a>`:`<a class="generation-visual-pending" href="${esc(s?.page||imageSearch(title,g))}" target="_blank" rel="noopener"><span>PHOTO</span><small>${s?'external reference':'find a photo'}</small></a>`;

  function debugState(){
    const p=pedalFromHash();
    return {hash:location.hash,pedal:p?.model_name||null,generationCount:generationRecords(p).length,structuredCount:Array.isArray(window.DATA?.generations)?window.DATA.generations.filter(g=>g.pedal_id===p?.pedal_id).length:0,researchGlobalCount:Array.isArray(window.DIRT_RESEARCH_GENERATIONS?.[p?.model_name])?window.DIRT_RESEARCH_GENERATIONS[p.model_name].length:0,headingPresent:!!document.querySelector('.detail-title'),guidePresent:!!document.querySelector('.generation-visual-section'),specimenCount:specs().filter(s=>String(s.title||'').trim()===String(p?.model_name||'').trim()).length};
  }
  window.DIRT_GENERATION_GUIDE_DEBUG=debugState;

  function renderGenerationVisuals(){
    const p=pedalFromHash();if(!p)return false;
    const gens=generationRecords(p);const heading=document.querySelector('.detail-title');
    if(!heading||!gens.length)return false;
    let section=document.querySelector('.generation-visual-section');
    const b=builderFor(p),records=recordsFor(p.model_name,b?.name),firstByGen=new Map();
    records.forEach(s=>{if(s.generation_id&&!firstByGen.has(s.generation_id))firstByGen.set(s.generation_id,s);});
    const rows=gens.map((g)=>{const s=firstByGen.get(g.id);const years=`${g.start_year||'Date unknown'}${g.end_year?`–${g.end_year}`:''}`;return `<div class="generation-visual-row" data-generation-id="${esc(g.id)}"><div class="generation-visual-slot">${s?visual(s,p.model_name,g):`<a class="generation-visual-pending" href="${esc(imageSearch(p.model_name,g))}" target="_blank" rel="noopener"><span>PHOTO</span><small>find a photo</small></a>`}</div><div class="generation-visual-copy"><div class="generation-visual-years">${esc(years)}</div><h3>${esc(g.name)}</h3><p>${esc(g.summary||'Generation research in progress.')}</p>${s?.caption?`<small>${esc(s.caption)}</small>`:''}</div></div>`;}).join('');
    if(!section){
      section=document.createElement('section');section.className='generation-visual-section';
      const sections=Array.from(document.querySelectorAll('.archive-section'));const anchor=sections.find(s=>s.textContent.includes('Production History'));if(anchor)anchor.after(section);else heading.parentElement?.after(section);
    }
    section.innerHTML=`<div class="section-head"><h2>Generation guide</h2><div class="section-note">Visual identification</div></div><p class="generation-visual-intro">Compare the exterior of your pedal against the production generations below. Images appear only when a specimen record is tied to that exact generation and has an appropriate public-use status. Every missing generation has a direct photo-search doorway.</p><div class="generation-visual-list">${rows}</div>`;
    return true;
  }

  const style=document.createElement('style');style.textContent=`.generation-visual-section{margin:38px 0 0;padding-top:22px;border-top:3px double #1d1712}.generation-visual-intro{max-width:760px;color:#766a5b;font:11px/1.55 Arial,Helvetica,sans-serif}.generation-visual-list{display:grid;gap:10px;margin-top:16px}.generation-visual-row{display:grid;grid-template-columns:190px 1fr;gap:18px;align-items:center;border:1px solid #b9aa92;background:#fbf7ef;padding:10px}.generation-visual-slot{min-height:145px;background:#e5dccb;display:flex;align-items:center;justify-content:center}.generation-visual-link{display:block;width:100%;height:100%}.generation-visual{display:block;width:100%;height:145px;object-fit:contain}.generation-visual-pending{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:100%;height:145px;background:repeating-linear-gradient(135deg,#eee5d5 0,#eee5d5 8px,#e8decc 8px,#e8decc 16px);color:#8b2319;text-transform:uppercase;text-align:center;text-decoration:none}.generation-visual-pending span{font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.14em}.generation-visual-pending small{font:8px Arial,Helvetica,sans-serif;color:#766a5b;letter-spacing:.08em}.generation-visual-years{font:700 8px Arial,Helvetica,sans-serif;color:#8b2319;letter-spacing:.12em;text-transform:uppercase}.generation-visual-copy h3{margin:5px 0 4px;font:700 19px/1.1 Georgia,'Times New Roman',serif;color:#1d1712}.generation-visual-copy p{margin:0;color:#766a5b;font:10px/1.45 Arial,Helvetica,sans-serif}.generation-visual-copy small{display:block;margin-top:8px;color:#766a5b;font:8px/1.4 Arial,Helvetica,sans-serif}@media(max-width:640px){.generation-visual-row{grid-template-columns:1fr}.generation-visual-slot{min-height:180px}.generation-visual{height:180px}.generation-visual-pending{height:180px}}`;document.head.appendChild(style);

  let repairTimer=null;
  const scheduleRepair=()=>{clearInterval(repairTimer);let attempts=0;repairTimer=setInterval(()=>{attempts++;if(renderGenerationVisuals()||attempts>=30){clearInterval(repairTimer);repairTimer=null;}},100);};
  window.addEventListener('dirtarchive:runtime-ready',scheduleRepair);
  window.addEventListener('hashchange',scheduleRepair);
  window.addEventListener('load',scheduleRepair);
  setTimeout(scheduleRepair,250);
})();
