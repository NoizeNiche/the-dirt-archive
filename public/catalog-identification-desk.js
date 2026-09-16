(() => {
  const esc = window.DIRT_CORE?.esc || (v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const slug = window.DIRT_CORE?.slug || (v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
  const dirt = p => window.DIRT_CORE?.inDirt ? window.DIRT_CORE.inDirt(p) : ['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
  const pedalById = id => (window.DATA?.pedals || []).find(p => String(p.pedal_id) === String(id));
  const builderName = p => (window.DATA?.builders || []).find(b => b.builder_id === p?.primary_builder_id)?.name || 'Builder not established';
  const gens = p => window.DIRT_CORE?.gensFor ? window.DIRT_CORE.gensFor(window.DATA,p) : (window.DATA?.generations || []).filter(g=>g.pedal_id===p?.pedal_id);
  const distinguishers = p => window.DIRT_CORE?.distinguishersFor ? window.DIRT_CORE.distinguishersFor(window.DATA,p) : [];
  const haystack = p => {
    const ar = p.archive_research || {};
    return [p.model_name,p.variant,p.primary_category,p.subcategory,p.description,ar.summary,ar.identification_notes,ar.lineage_notes,...gens(p).flatMap(g=>[g.name,g.summary,g.description]),...distinguishers(p).flatMap(d=>[d.type,d.description,d.identification_value])].filter(Boolean).join(' ').toLowerCase();
  };
  const yearBand = p => {
    const y = Number(p.introduced_year || gens(p)[0]?.start_year);
    if(!y) return 'unknown';
    if(y < 1970) return 'pre1970';
    if(y < 1980) return '1970s';
    if(y < 1990) return '1980s';
    if(y < 2000) return '1990s';
    if(y < 2010) return '2000s';
    if(y < 2020) return '2010s';
    return '2020s';
  };
  const imageFor = p => typeof window.imageFor === 'function' ? window.imageFor(p) : null;
  const evidence = p => {
    const v = String(p?.confidence || p?.archive_research?.status || 'Discovery').toLowerCase();
    if(v.includes('verified')) return 'Verified';
    if(v.includes('strong')) return 'Strong evidence';
    if(v.includes('probable')) return 'Probable';
    if(v.includes('contested')) return 'Contested';
    return 'Discovery';
  };

  let state = {query:'', category:'all', builder:'all', era:'all'};

  function render(){
    if(!location.hash.replace(/^#\/?/,'').startsWith('identify')) return;
    const app = document.getElementById('app');
    if(!app || !Array.isArray(window.DATA?.pedals)) return;
    const builders = [...new Map((window.DATA.builders||[]).filter(b=> (window.DATA.pedals||[]).some(p=>p.primary_builder_id===b.builder_id&&dirt(p))).map(b=>[b.builder_id,b])).values()].sort((a,b)=>String(a.name).localeCompare(String(b.name)));
    const eraButtons = [['all','Any era'],['pre1970','Before 1970'],['1970s','1970s'],['1980s','1980s'],['1990s','1990s'],['2000s','2000s'],['2010s','2010s'],['2020s','2020s']];
    const matches = (window.DATA.pedals||[]).filter(dirt).filter(p=>{
      const q=state.query.trim().toLowerCase();
      return (!q || haystack(p).includes(q)) && (state.category==='all'||p.primary_category===state.category) && (state.builder==='all'||p.primary_builder_id===state.builder) && (state.era==='all'||yearBand(p)===state.era);
    }).sort((a,b)=>String(a.model_name).localeCompare(String(b.model_name)));
    app.innerHTML = `<div class="identify-shell"><a class="eyebrow" href="#/">← Home</a><section class="directory-head"><div class="eyebrow">IDENTIFICATION DESK</div><div class="detail-title">Identify a pedal</div><p class="identify-intro">Start with what you can see. Search the Archive's documented clues, narrow by category, builder or era, then open the candidate record and compare its generation guide.</p><div class="research-status"><span class="research-badge">FORENSIC WORKBENCH</span><span>Start broad</span><span>Narrow with physical clues</span><span>Verify against generation evidence</span></div></section><section class="section"><div class="identify-controls"><div class="identify-control"><label for="identifyQuery">Visible clue or model</label><input id="identifyQuery" type="search" value="${esc(state.query)}" placeholder="round enclosure, two knobs, orange, block logo…" autocomplete="off"></div><div class="identify-control"><label for="identifyCategory">Category</label><select id="identifyCategory"><option value="all">All dirt</option><option value="Fuzz">Fuzz</option><option value="Overdrive">Overdrive</option><option value="Distortion">Distortion</option></select></div><div class="identify-control"><label for="identifyBuilder">Builder</label><select id="identifyBuilder"><option value="all">All builders</option>${builders.map(b=>`<option value="${esc(b.builder_id)}">${esc(b.name)}</option>`).join('')}</select></div></div><div class="identify-filter-label">Approximate production era</div><div class="identify-era">${eraButtons.map(([v,l])=>`<button type="button" data-era="${v}" class="${state.era===v?'active':''}">${l}</button>`).join('')}</div><div class="identify-results-head"><h2>Candidate records</h2><div class="identify-results-count">${matches.length} match${matches.length===1?'':'es'}</div></div><div class="identify-results">${matches.slice(0,100).map(candidate).join('') || '<div class="identify-empty">No candidates match those clues. Remove a filter or try a simpler visual description.</div>'}</div>${matches.length>100?`<p class="section-note" style="margin-top:12px">Showing the first 100 matches. Narrow the clues for a tighter field.</p>`:''}</section></div>`;
    const q=document.getElementById('identifyQuery'); if(q) q.addEventListener('input',()=>{state.query=q.value;render();const n=document.getElementById('identifyQuery');n?.focus();n?.setSelectionRange(n.value.length,n.value.length)});
    const c=document.getElementById('identifyCategory'); if(c){c.value=state.category;c.addEventListener('change',()=>{state.category=c.value;render()})}
    const b=document.getElementById('identifyBuilder'); if(b){b.value=state.builder;b.addEventListener('change',()=>{state.builder=b.value;render()})}
    app.querySelectorAll('[data-era]').forEach(btn=>btn.addEventListener('click',()=>{state.era=btn.dataset.era;render()}));
  }

  function candidate(p){
    const im=imageFor(p), g=gens(p), d=distinguishers(p), matchText=state.query?d.find(x=>`${x.type} ${x.description} ${x.identification_value}`.toLowerCase().includes(state.query.toLowerCase())):null;
    const art=im?`<img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" loading="lazy" referrerpolicy="no-referrer">`:`<div class="no-image"><div><strong>${esc(p.model_name)}</strong><small>Photo pending clearance</small></div></div>`;
    return `<a class="identify-result" href="#/pedal/${encodeURIComponent(p.model_name)}"><div class="identify-result-image">${art}</div><div class="identify-result-main"><div class="eyebrow">${esc(p.primary_category||'Dirt')} · ${esc(builderName(p))}</div><h3>${esc(p.model_name)}</h3><p>${esc((p.archive_research?.summary||p.description||'Historical record in progress.').slice(0,280))}</p>${matchText?`<div class="identify-match">Matched clue: ${esc(matchText.type||'documented identifier')}</div>`:''}<div class="identify-generation-chips">${g.slice(0,6).map(x=>`<span title="${esc(x.summary||x.description||'')}" style="padding:5px 7px;border:1px solid var(--rule);font:700 6px var(--sans);letter-spacing:.07em;text-transform:uppercase;color:var(--muted)">${esc(x.name)}</span>`).join('')}</div></div><div class="identify-result-meta"><div class="meta-line"><strong>${esc(evidence(p))}</strong> evidence state</div><div class="meta-line"><strong>${g.length||0}</strong> generation${g.length===1?'':'s'} documented</div><div class="meta-line"><strong>${im?'Photo available':'Photo hunt queued'}</strong> visual coverage</div></div></a>`;
  }

  function ensure(){ if(location.hash.replace(/^#\/?/,'').startsWith('identify') && Array.isArray(window.DATA?.pedals)) render(); }
  window.addEventListener('hashchange',()=>setTimeout(ensure,30));
  window.addEventListener('load',()=>setTimeout(ensure,80));
  const poll=()=>{if(Array.isArray(window.DATA?.pedals)&&window.DATA.pedals.length) ensure(); else setTimeout(poll,80)};
  poll();
  window.DIRT_IDENTIFICATION_DESK=true;
})();
