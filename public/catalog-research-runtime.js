(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let catalog=null;
  let lineage=null;
  const load=()=>catalog||fetch('data.json').then(r=>r.json()).then(d=>(catalog=d));
  const loadLineage=()=>lineage||fetch('lineage.json').then(r=>r.json()).then(d=>(lineage=Array.isArray(d)?d:[]));

  const currentPedal = () => {
    const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0]!=='pedal'||!parts[1]) return null;
    const key=decodeURIComponent(parts[1]);
    return (catalog?.pedals||[]).find(p=>String(p.pedal_id)===key)
      || (catalog?.pedals||[]).find(p=>String(p.model_name||'').trim().toLowerCase()===key.trim().toLowerCase())
      || (catalog?.pedals||[]).find(p=>String(p.model_name||'').trim().toLowerCase()===key.trim().replace(/-/g,' ').toLowerCase());
  };

  const findResearchForPedal = p => p?.archive_research || null;

  function refreshCards(){
    document.querySelectorAll('.pedal-card').forEach(card => {
      const id=card.getAttribute('data-pedal-id');
      const title = card.querySelector('h3')?.textContent?.trim();
      const p=(catalog?.pedals||[]).find(x=>id&&String(x.pedal_id)===String(id))
        || (catalog?.pedals||[]).find(x=>String(x.model_name||'').trim().toLowerCase()===String(title||'').trim().toLowerCase());
      const r=findResearchForPedal(p);
      if(!r?.image || r.image.republish_status!=='Cleared') return;
      const holder = card.querySelector('.pedal-image');
      if(!holder || holder.querySelector('img')) return;
      holder.innerHTML=`<img src="${esc(r.image.image_url)}" alt="${esc(title)} reference photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(title)}</strong><small>Photo unavailable</small></div></div>'">`;
    });
  }

  const normalize=v=>String(v??'').trim().toLowerCase().replace(/[–—]/g,'-');
  const lineageMatches=(edge,name)=>normalize(edge.source)===normalize(name)||normalize(edge.target)===normalize(name);

  function refreshPedalLineage(){
    if(document.getElementById('lineage-map')) return;
    const heading=document.querySelector('.detail-title');
    const article=document.querySelector('.detail-layout article');
    if(!heading||!article) return;
    const name=heading.textContent.trim();
    loadLineage().then(edges=>{
      const related=edges.filter(e=>lineageMatches(e,name));
      if(!related.length) return;
      const rows=related.map(e=>{
        const source=normalize(e.source)===normalize(name);
        const counterpart=source?e.target:e.source;
        const arrow=source?'→':'←';
        return `<div class="source-row"><strong>${esc(arrow)} ${esc(counterpart)}</strong><small>${esc(e.relationship)} · confidence ${esc(e.confidence)}</small></div>`;
      }).join('');
      const section=document.createElement('section');
      section.className='detail-section';
      section.id='lineage-map';
      section.innerHTML=`<h2>Lineage & relationships</h2><p>Validated public lineage links. Marketed identities and physical builders remain separate records.</p><div class="source-list">${rows}</div>`;
      const about=article.querySelector('.detail-section');
      about?.after(section);
    }).catch(()=>{});
  }

  function refreshPedalPage(){
    const heading=document.querySelector('.detail-title');
    if(!heading || document.getElementById('research-dossier')) return;
    const p=currentPedal() || (catalog?.pedals||[]).find(x=>String(x.model_name||'').trim().toLowerCase()===heading.textContent.trim().toLowerCase());
    const r=findResearchForPedal(p);
    if(!r) return;
    const article=document.querySelector('.detail-layout article');
    if(!article) return;
    const sourceRows=(r.sources||[]).map(s=>`<div class="source-row"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a><small>${esc(s.type)} · ${esc(s.confidence)}</small></div>`).join('');
    const generationRows=(r.generations||[]).map(g=>`<div class="source-row"><strong>${esc(g.label||g.name||'Generation')}</strong><small>${esc(g.years||((g.from||'')+(g.to?`–${g.to}`:'')))} · ${esc(g.notes||g.summary||'')}</small></div>`).join('');
    const section=document.createElement('section');
    section.className='detail-section';
    section.id='research-dossier';
    section.innerHTML=`<h2>Research dossier</h2><p>${esc(r.summary||'')}</p>${r.identification_notes?`<h3>Identification notes</h3><p>${esc(r.identification_notes)}</p>`:''}${r.lineage_notes?`<h3>Lineage / relationships</h3><p>${esc(r.lineage_notes)}</p>`:''}${generationRows?`<h3>Generation / version map</h3><div class="source-list">${generationRows}</div>`:''}${sourceRows?`<h3>Research sources</h3><div class="source-list">${sourceRows}</div>`:''}`;
    const about=article.querySelector('.detail-section');
    about?.after(section);
  }

  function refresh(){load().then(()=>{refreshCards();refreshPedalPage();refreshPedalLineage();}).catch(()=>{});}
  window.addEventListener('hashchange',()=>setTimeout(refresh,30));
  setTimeout(refresh,120);
})();
