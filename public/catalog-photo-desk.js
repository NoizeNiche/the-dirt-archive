(() => {
  const esc = window.DIRT_CORE?.esc || (v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const dirt = p => window.DIRT_CORE?.inDirt ? window.DIRT_CORE.inDirt(p) : ['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
  const builderName = p => (window.DATA?.builders || []).find(b=>b.builder_id===p?.primary_builder_id)?.name || 'Builder not established';
  const imageFor = p => typeof window.imageFor === 'function' ? window.imageFor(p) : null;
  const rightsReady = im => !!im;
  const sourceUrl = title => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${title} guitar pedal vintage`)}`;
  const commonsUrl = title => `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(title+' guitar pedal')}&title=Special:MediaSearch&type=image`;
  const manufacturerUrl = title => `https://www.google.com/search?q=${encodeURIComponent(`site:${title.replace(/[^a-z0-9]+/gi,'')}.com ${title}`)}`;
  const getMediaRecord = p => window.DIRT_MEDIA?.[p?.model_name] || null;
  const status = (p,im) => {
    const m=getMediaRecord(p);
    if(im || (m && ['Licensed','Permission granted','Owned','Public domain','CC-BY','CC-BY-SA'].includes(m.rights_status) && m.public_use_decision==='approved')) return 'Archive-ready';
    if(m) return String(m.public_use_decision||m.rights_status||'Reference lead').replace(/_/g,' ');
    return 'Photo hunt queued';
  };
  const statusClass = s => s==='Archive-ready'?'ready':s==='Reference lead'?'reference':'';
  let state={query:'',category:'all',coverage:'all'};

  function render(){
    if(!location.hash.replace(/^#\/?/,'').startsWith('photos')) return;
    const app=document.getElementById('app');
    if(!app || !Array.isArray(window.DATA?.pedals)) return;
    const all=(window.DATA.pedals||[]).filter(dirt).sort((a,b)=>String(a.model_name).localeCompare(String(b.model_name)));
    const rows=all.filter(p=>{
      const q=state.query.trim().toLowerCase();
      const im=imageFor(p), s=status(p,im);
      return (!q || `${p.model_name} ${builderName(p)} ${p.primary_category}`.toLowerCase().includes(q)) && (state.category==='all'||p.primary_category===state.category) && (state.coverage==='all'||(state.coverage==='ready'&&s==='Archive-ready')||(state.coverage==='queued'&&s!=='Archive-ready'));
    });
    const ready=all.filter(p=>status(p,imageFor(p))==='Archive-ready').length;
    const leads=all.filter(p=>getMediaRecord(p)).length;
    app.innerHTML=`<div class="photo-desk-shell"><a class="eyebrow" href="#/">← Home</a><section class="directory-head"><div class="eyebrow">PHOTO DESK</div><div class="detail-title">Build the picture</div><p class="photo-desk-intro">Every dirt record gets a visual research slot. Archive-ready images may be displayed; other photographs remain source leads until their rights and provenance are reviewed. This keeps the collection comprehensive without quietly republishing somebody else's work.</p><div class="photo-desk-summary"><div class="photo-desk-stat"><span class="n">${all.length}</span><span class="l">dirt records in hunt</span></div><div class="photo-desk-stat"><span class="n">${ready}</span><span class="l">archive-ready images</span></div><div class="photo-desk-stat"><span class="n">${Math.max(0,all.length-ready)}</span><span class="l">photo hunts remaining</span></div><div class="photo-desk-stat"><span class="n">${leads}</span><span class="l">source leads indexed</span></div></div></section><section class="section"><div class="photo-desk-toolbar"><input id="photoQuery" type="search" value="${esc(state.query)}" placeholder="Search pedal or builder…"><select id="photoCategory"><option value="all">All dirt</option><option value="Fuzz">Fuzz</option><option value="Overdrive">Overdrive</option><option value="Distortion">Distortion</option></select><select id="photoCoverage"><option value="all">All photo states</option><option value="ready">Archive-ready</option><option value="queued">Needs research</option></select></div><div class="section-head"><h2>Every record</h2><div class="section-note">${rows.length} shown</div></div><div class="photo-desk-grid">${rows.map(photoCard).join('')}</div></section></div>`;
    const q=document.getElementById('photoQuery'); q?.addEventListener('input',()=>{state.query=q.value;render();const n=document.getElementById('photoQuery');n?.focus();n?.setSelectionRange(n.value.length,n.value.length)});
    const c=document.getElementById('photoCategory'); if(c){c.value=state.category;c.addEventListener('change',()=>{state.category=c.value;render()})}
    const v=document.getElementById('photoCoverage'); if(v){v.value=state.coverage;v.addEventListener('change',()=>{state.coverage=v.value;render()})}
  }

  function photoCard(p){
    const im=imageFor(p), s=status(p,im), media=im?`<img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" loading="lazy" referrerpolicy="no-referrer">`:`<div class="no-image"><div><strong>${esc(p.model_name)}</strong><small>Photo hunt in progress</small></div></div>`;
    const google=sourceUrl(p.model_name), commons=commonsUrl(p.model_name), manufacturer=manufacturerUrl(p.model_name);
    return `<article class="photo-card"><div class="photo-card-media">${media}</div><h3 class="photo-card-title">${esc(p.model_name)}</h3><div class="photo-card-builder">${esc(builderName(p))}</div><div class="photo-card-status ${statusClass(s)}">${esc(s)}</div><small>${esc(p.primary_category||'Dirt')} · ${esc(p.introduced_year||'Date unknown')}</small><div class="photo-card-actions"><a href="${esc(google)}" target="_blank" rel="noopener">Image search ↗</a><a href="${esc(commons)}" target="_blank" rel="noopener">Commons ↗</a><a href="${esc(manufacturer)}" target="_blank" rel="noopener">Maker/source ↗</a><a href="#/pedal/${encodeURIComponent(p.model_name)}">Open record →</a></div></article>`;
  }

  function navLink(){
    const nav=document.querySelector('.main-nav');
    if(!nav||nav.querySelector('[data-photo-desk]'))return;
    const a=document.createElement('a'); a.href='#/photos'; a.dataset.photoDesk=''; a.textContent='Photos'; nav.appendChild(a);
  }
  function ensure(){ navLink(); if(location.hash.replace(/^#\/?/,'').startsWith('photos')&&Array.isArray(window.DATA?.pedals)) render(); }
  window.addEventListener('hashchange',()=>setTimeout(ensure,35));
  window.addEventListener('load',()=>setTimeout(ensure,100));
  const poll=()=>{if(Array.isArray(window.DATA?.pedals)&&window.DATA.pedals.length)ensure();else setTimeout(poll,80)};
  poll();
  window.DIRT_PHOTO_DESK=true;
})();
