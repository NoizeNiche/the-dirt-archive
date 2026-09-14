let DATA={};
const app=document.getElementById('app');
const dialog=document.getElementById('searchDialog');
const searchInput=document.getElementById('searchInput');
const searchResults=document.getElementById('searchResults');

const IMAGES={
  'Fuzz Face':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dallas_Arbiter_Fuzz_Face.jpg',page:'https://commons.wikimedia.org/wiki/File:Dallas_Arbiter_Fuzz_Face.jpg',credit:'Photograph by sploshette · CC BY 2.0'},
  'Tone Bender':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1966_VOX_TONE_BENDER_FUZZ.jpg',page:'https://commons.wikimedia.org/wiki/File:1966_VOX_TONE_BENDER_FUZZ.jpg',credit:'Photograph by sploshette · CC BY 2.0'},
  'Big Muff Pi':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Electro_Harmonix_Big_Muff.jpg',page:'https://commons.wikimedia.org/wiki/File:Electro_Harmonix_Big_Muff.jpg',credit:'Photograph by Skimel · CC BY-SA 4.0'},
  'Tube Screamer':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tube_screamer.jpg',page:'https://commons.wikimedia.org/wiki/File:Tube_screamer.jpg',credit:'Photograph by matt.mac · public domain release'},
  'TS808 Tube Screamer':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tube_screamer.jpg',page:'https://commons.wikimedia.org/wiki/File:Tube_screamer.jpg',credit:'Photograph by matt.mac · public domain release'},
  'RAT':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Proco-rat.jpg',page:'https://commons.wikimedia.org/wiki/File:Proco-rat.jpg',credit:'Photograph by Jazzman · CC BY-SA 3.0 / GFDL'},
  'RAT2':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/ProCo_Rat_2.jpg',page:'https://commons.wikimedia.org/wiki/File:ProCo_Rat_2.jpg',credit:'Wikimedia Commons · see file page for license'}
};

document.getElementById('searchBtn').addEventListener('click',()=>{dialog.showModal();searchInput.focus();});
searchInput.addEventListener('input',()=>renderSearch(searchInput.value));
window.addEventListener('hashchange',route);

function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function slug(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function byId(arr,id,key){return (arr||[]).find(x=>x[key]===id)||null;}
function builder(id){return byId(DATA.builders,id,'builder_id');}
function pedal(id){return byId(DATA.pedals,id,'pedal_id');}
function years(p){return p.introduced_year ? `${p.introduced_year}${p.discontinued_year?`–${p.discontinued_year}`:'–present'}` : 'Date range not established';}
function inDirt(p){return ['Fuzz','Overdrive','Distortion'].includes(p.primary_category)}
function gensFor(p){return (DATA.generations||[]).filter(g=>g.pedal_id===p.pedal_id)}
function sourceRows(p){
  const urls=new Set();
  gensFor(p).forEach(g=>{
    (DATA.runs||[]).filter(r=>r.generation_id===g.generation_id).forEach(r=>r.source_url&&urls.add(r.source_url));
    (DATA.distinguishers||[]).filter(d=>d.generation_id===g.generation_id).forEach(d=>d.source_url&&urls.add(d.source_url));
  });
  return (DATA.sources||[]).filter(s=>urls.has(s.url)).slice(0,18);
}
function imageFor(p){
  return IMAGES[p.model_name]||IMAGES[p.model_name?.replace(/^TS808 /,'')]||null;
}
function confidenceClass(s){return String(s||'').toLowerCase();}
function statCount(label){
  const map={'builders':(DATA.builders||[]).length,'dirt':(DATA.pedals||[]).filter(inDirt).length,'generations':(DATA.generations||[]).length,'sources':(DATA.sources||[]).length};
  return map[label]||0;
}

function route(){
  const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  if(!parts.length)return home();
  if(parts[0]==='builders')return buildersPage();
  if(parts[0]==='builder'&&parts[1])return builderPage(decodeURIComponent(parts[1]));
  if(parts[0]==='category'&&parts[1])return categoryPage(decodeURIComponent(parts[1]));
  if(parts[0]==='pedal'&&parts[1])return pedalPage(decodeURIComponent(parts[1]));
  if(parts[0]==='about')return aboutPage();
  return home();
}

fetch('data.json').then(r=>r.json()).then(d=>{DATA=d;route();}).catch(e=>{app.innerHTML='<section class="section"><h1>Archive unavailable.</h1><p class="empty">The data file could not be loaded.</p></section>';console.error(e);});

function home(){
  const coreNames=['Fuzz Face','Tone Bender','Big Muff Pi','TS808 Tube Screamer','RAT'];
  const core=coreNames.map(n=>DATA.pedals.find(p=>p.model_name===n)).filter(Boolean);
  const builders=[...DATA.builders].filter(b=>(DATA.pedals||[]).some(p=>p.primary_builder_id===b.builder_id&&inDirt(p))).sort((a,b)=>String(a.name).localeCompare(String(b.name))).slice(0,36);
  app.innerHTML=`
  <section class="hero">
    <div>
      <div class="kicker">Founding collection · Dirt v0.3</div>
      <h1>Document<br>the dirt.</h1>
      <p class="hero-copy">An independent reference project for overdrive, distortion and fuzz. Browse the builders, follow the product lineage, compare generations, and learn how to identify the box sitting in front of you.</p>
      <div class="hero-note"><span class="tag">Historical reference</span><span class="tag">Identification</span><span class="tag">Preservation</span></div>
    </div>
    <aside class="hero-stamp"><div class="number">${statCount('dirt')}</div><div class="label">dirt records in the working archive</div><div class="number" style="margin-top:20px;font-size:48px">${statCount('generations')}</div><div class="label">structured generations</div></aside>
  </section>
  <section class="section"><div class="section-head"><h2>Browse by builder</h2><div class="note">The builder is the front door</div></div><div class="builder-grid">${builders.map(builderCard).join('')}</div><div style="margin-top:18px"><a class="back" href="#/builders">View the complete builder index →</a></div></section>
  <section class="section"><div class="section-head"><h2>Founding collection</h2><div class="note">Five historical stress tests</div></div><div class="pedal-grid">${core.map(pedalCard).join('')}</div></section>
  <section class="section"><div class="editorial-grid">
    <div class="paper-box"><h3>Browse the dirt</h3><p>Start with the kind of dirt you want to explore.</p><div class="link-list"><a href="#/category/fuzz">Fuzz →</a><a href="#/category/overdrive">Overdrive →</a><a href="#/category/distortion">Distortion →</a></div></div>
    <div class="paper-box"><h3>Document the object, not the recipe.</h3><p>Meaningful technical distinctions may be recorded when they help identify a production period. The archive does not publish schematics, PCB layouts, gutshot libraries, complete bills of materials or cloning instructions.</p></div>
  </div></section>`;
}

function builderCard(b){
  const count=DATA.pedals.filter(p=>p.primary_builder_id===b.builder_id&&inDirt(p)).length;
  return `<a class="builder-card" href="#/builder/${encodeURIComponent(b.name)}"><div class="name">${esc(b.name)}</div><div class="meta">${count} dirt record${count===1?'':'s'} · ${esc(b.country||'origin not established')}</div></a>`;
}
function pedalCard(p){
  const b=builder(p.primary_builder_id),im=imageFor(p);
  const art=im?`<img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(p.model_name)}</strong><small>Photo pending rights clearance</small></div></div>'">`:`<div class="no-image"><div><strong>${esc(p.model_name)}</strong><small>Archive photography pending</small></div></div>`;
  return `<a class="pedal-card" href="#/pedal/${encodeURIComponent(p.model_name)}"><div class="pedal-image">${art}</div><div class="pedal-body"><div class="builder">${esc(b?.name||'Builder not established')}</div><h3>${esc(p.model_name)}</h3><div class="years">${esc(years(p))} · ${esc(p.primary_category)}</div></div></a>`;
}
function buildersPage(){
  const sorted=[...DATA.builders].sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  app.innerHTML=`<a class="back" href="#/">← Home</a><div class="detail-head"><div class="kicker">Archive index</div><div class="detail-title">Builders</div><p class="subhead">The companies, designers, workshops and brands behind the dirt.</p><div class="archive-stats"><div class="stat"><span class="n">${sorted.length}</span><span class="l">builder records</span></div><div class="stat"><span class="n">${DATA.pedals.filter(inDirt).length}</span><span class="l">dirt records</span></div><div class="stat"><span class="n">${DATA.generations.length}</span><span class="l">generations</span></div><div class="stat"><span class="n">${DATA.sources.length}</span><span class="l">source records</span></div></div></div><section class="section"><div class="filter-row"><input id="builderFilter" placeholder="Filter builders…" aria-label="Filter builders"></div><div id="builderList" class="builder-grid">${sorted.map(builderCard).join('')}</div></section>`;
  const input=document.getElementById('builderFilter'),list=document.getElementById('builderList');
  input.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();list.innerHTML=sorted.filter(b=>`${b.name} ${b.aliases||''} ${b.country||''}`.toLowerCase().includes(q)).map(builderCard).join('')||'<div class="empty">No builders matched that filter.</div>';});
}
function builderPage(name){
  const b=DATA.builders.find(x=>x.name===name)||DATA.builders.find(x=>slug(x.name)===slug(name));if(!b)return notFound();
  const ps=DATA.pedals.filter(p=>p.primary_builder_id===b.builder_id&&inDirt(p));
  app.innerHTML=`<a class="back" href="#/builders">← All builders</a><div class="detail-head"><div class="kicker">Builder</div><div class="detail-title">${esc(b.name)}</div><div class="detail-meta"><span class="pill">${esc(b.country||'Country unknown')}</span><span class="pill">${esc(b.status||'Status unknown')}</span>${b.founded?`<span class="pill">Founded ${esc(b.founded)}</span>`:''}</div><p class="subhead" style="margin-top:17px">${esc(b.description||'Historical profile in progress.')}</p></div><section class="section"><div class="section-head"><h2>Dirt catalog</h2><div class="note">${ps.length} represented records</div></div><div class="pedal-grid">${ps.map(pedalCard).join('')||'<div class="empty">No dirt records have been promoted into the public catalog yet.</div>'}</div></section>`;
}
function categoryPage(cat){
  const wanted=cat.charAt(0).toUpperCase()+cat.slice(1).toLowerCase();const ps=DATA.pedals.filter(p=>p.primary_category===wanted);
  app.innerHTML=`<a class="back" href="#/">← Home</a><div class="detail-head"><div class="kicker">Dirt category</div><div class="detail-title">${esc(wanted)}</div><p class="subhead">A curated slice of the archive, focused on production history, identification and preservation.</p><div class="category-tabs"><a class="${wanted==='Fuzz'?'active':''}" href="#/category/fuzz">Fuzz</a><a class="${wanted==='Overdrive'?'active':''}" href="#/category/overdrive">Overdrive</a><a class="${wanted==='Distortion'?'active':''}" href="#/category/distortion">Distortion</a></div></div><section class="section"><div class="section-head"><h2>Archive records</h2><div class="note">${ps.length} records</div></div><div class="pedal-grid">${ps.map(pedalCard).join('')||'<div class="empty">Nothing promoted here yet.</div>'}</div></section>`;
}
function pedalPage(name){
  const p=DATA.pedals.find(x=>x.model_name===name)||DATA.pedals.find(x=>slug(x.model_name)===slug(name));if(!p)return notFound();
  const b=builder(p.primary_builder_id),gens=gensFor(p),runs=(DATA.runs||[]).filter(r=>gens.some(g=>g.generation_id===r.generation_id)),ds=(DATA.distinguishers||[]).filter(d=>gens.some(g=>g.generation_id===d.generation_id)),claims=(DATA.claims||[]).filter(c=>c.pedal_id===p.pedal_id||c.subject_id===p.pedal_id||c.model_name===p.model_name),sources=sourceRows(p),im=imageFor(p);
  const image=im?`<div class="plate"><div class="plate-image"><img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(p.model_name)}</strong><small>Photo pending rights clearance</small></div></div>'"></div><div class="plate-caption"><a href="${esc(im.page)}" target="_blank" rel="noopener">Reference image source ↗</a><br>${esc(im.credit)}</div></div>`:`<div class="plate"><div class="plate-image"><div class="no-image"><div><strong>${esc(p.model_name)}</strong><small>Archive photography pending</small></div></div></div><div class="plate-caption">The public archive will prefer owned, builder-provided, permission-cleared, or appropriately licensed photography.</div></div>`;
  const genCount=gens.length, runCount=runs.length, distinguisherCount=ds.length;
  app.innerHTML=`<a class="back" href="#/category/${encodeURIComponent((p.primary_category||'dirt').toLowerCase())}">← ${esc(p.primary_category||'Dirt')}</a><div class="detail-head"><div class="kicker">${esc(p.primary_category||'Dirt')} · Archive record</div><div class="detail-title">${esc(p.model_name)}</div><div class="detail-meta"><span class="pill">Builder: ${esc(b?.name||'Unknown')}</span><span class="pill">${esc(years(p))}</span><span class="pill">${esc(p.production_status||'Status unknown')}</span><span class="pill">Confidence: ${esc(p.confidence||'Unrated')}</span></div></div>
  <div class="detail-layout"><aside>${image}</aside><article>
  <section class="detail-section"><h2>About</h2><p>${esc(p.description||'Historical narrative in progress.')}</p></section>
  <section class="detail-section"><h2>At a glance</h2><div class="archive-stats"><div class="stat"><span class="n">${genCount}</span><span class="l">generations</span></div><div class="stat"><span class="n">${runCount}</span><span class="l">production periods</span></div><div class="stat"><span class="n">${distinguisherCount}</span><span class="l">distinguishers</span></div><div class="stat"><span class="n">${sources.length}</span><span class="l">linked sources</span></div></div></section>
  <section class="detail-section"><h2>Generations</h2>${gens.length?`<div class="timeline">${gens.map(g=>`<div class="timeline-item"><div class="date">${esc(g.start_year||'Date unknown')}${g.end_year?`–${esc(g.end_year)}`:''}</div><h3>${esc(g.name)}</h3><p>${esc(g.summary||g.description||'')}</p></div>`).join('')}</div>`:'<div class="empty">Generation research is pending.</div>'}</section>
  <section class="detail-section"><h2>Distinguishing characteristics</h2>${ds.length?`<table class="table"><thead><tr><th>Type</th><th>Characteristic</th><th>Identification value</th><th>Status</th></tr></thead><tbody>${ds.map(d=>`<tr><td>${esc(d.type)}</td><td>${esc(d.description)}</td><td>${esc(d.identification_value||'')}</td><td class="status ${confidenceClass(d.status)}">${esc(d.status||'')}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No structured distinguishers yet.</div>'}</section>
  <section class="detail-section"><h2>Production periods</h2>${runs.length?`<table class="table"><thead><tr><th>Period</th><th>Date quality</th><th>Summary</th></tr></thead><tbody>${runs.map(r=>`<tr><td>${esc(r.start_year||'?')}–${esc(r.end_year||'?')}</td><td>${esc(r.date_quality||'')}</td><td>${esc(r.summary||'')}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">Production-period research is pending.</div>'}</section>
  <section class="detail-section"><h2>Evidence & claims</h2>${claims.length?`<div class="source-list">${claims.slice(0,18).map(c=>`<div class="source-row"><strong>${esc(c.statement||c.claim||c.description||'Historical claim')}</strong><small>${esc(c.status||c.confidence||'')}</small></div>`).join('')}</div>`:'<div class="empty">No claim records have been attached yet.</div>'}</section>
  <section class="detail-section"><h2>Known unknowns</h2><p>The archive preserves uncertainty on purpose. Exact dates, generation boundaries and technical distinctions that cannot currently be substantiated remain open questions.</p></section>
  <section class="detail-section"><h2>Sources</h2>${sources.length?`<div class="source-list">${sources.map(s=>`<div class="source-row"><a href="${esc(s.url||'#')}" target="_blank" rel="noopener">${esc(s.title||'Source')} ↗</a><small>${esc(s.type||'Source')} · ${esc(s.date||'Date not established')}</small></div>`).join('')}</div>`:'<div class="empty">Source list in progress.</div>'}</section>
  </article></div>`;
}
function aboutPage(){
  app.innerHTML=`<a class="back" href="#/">← Home</a><div class="detail-head"><div class="kicker">Independent reference project</div><div class="detail-title">About the Archive</div><p class="subhead">A curated historical reference for dirt pedals, built around identification, production history and preservation.</p></div><section class="section"><div class="editorial-grid"><div><h2>Document the object, not the recipe.</h2><p>The archive records useful historical distinctions without becoming a schematic, gutshot or cloning library. When a component technology changed and that change genuinely helps identify a production period, it can be documented at the appropriate level.</p></div><div class="paper-box"><h3>Quarterly, not frantic</h3><p>The project grows through deliberate research releases rather than an impossible promise to catalog every pedal ever made.</p></div></div></section><section class="section"><div class="editorial-grid"><div class="paper-box"><h3>Evidence first</h3><p>Claims can be confirmed, probable, reported or unverified. Sources stay attached to the research so the archive can improve without quietly rewriting uncertainty out of existence.</p></div><div class="paper-box"><h3>Photography policy</h3><p>The site should prefer photographs we own, photographs supplied by builders or contributors with permission, and appropriately licensed archival material. Commercial listing photos are not assumed to be free to reuse.</p></div></div></section>`;
}
function notFound(){app.innerHTML='<section class="section"><h1>Not found.</h1><p class="empty">That record is not in the working archive.</p><a class="back" href="#/">← Return home</a></section>';}
function renderSearch(q){
  q=q.trim().toLowerCase();if(!q){searchResults.innerHTML='<div class="empty">Start typing to search builders and pedals.</div>';return;}
  const bs=DATA.builders.filter(b=>`${b.name} ${b.aliases||''} ${b.country||''}`.toLowerCase().includes(q)).slice(0,10).map(b=>`<div class="search-result"><a href="#/builder/${encodeURIComponent(b.name)}" onclick="dialog.close()">${esc(b.name)}</a><small>Builder · ${esc(b.country||'')}</small></div>`);
  const ps=DATA.pedals.filter(p=>`${p.model_name} ${p.primary_category} ${p.subcategory||''}`.toLowerCase().includes(q)).slice(0,15).map(p=>`<div class="search-result"><a href="#/pedal/${encodeURIComponent(p.model_name)}" onclick="dialog.close()">${esc(p.model_name)}</a><small>${esc(p.primary_category||'Dirt')} · ${esc(builder(p.primary_builder_id)?.name||'')}</small></div>`);
  searchResults.innerHTML=[...bs,...ps].join('')||'<div class="empty">No matching records yet.</div>';
}
