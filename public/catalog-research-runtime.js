(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let catalog=null;
  const load=()=>catalog||fetch('data.json').then(r=>r.json()).then(d=>(catalog=d));
  const findResearch = name => (catalog?.pedals || []).find(p=>String(p.model_name||'').trim().toLowerCase()===String(name||'').trim().toLowerCase())?.archive_research || null;

  function refreshCards(){
    document.querySelectorAll('.pedal-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent?.trim();
      const r = findResearch(title);
      if(!r?.image || r.image.republish_status!=='Cleared') return;
      const holder = card.querySelector('.pedal-image');
      if(!holder || holder.querySelector('img')) return;
      holder.innerHTML=`<img src="${esc(r.image.image_url)}" alt="${esc(title)} reference photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(title)}</strong><small>Photo unavailable</small></div></div>'">`;
    });
  }

  function refreshPedalPage(){
    const heading=document.querySelector('.detail-title');
    if(!heading) return;
    const r=findResearch(heading.textContent.trim());
    if(!r || document.getElementById('research-dossier')) return;
    const article=document.querySelector('.detail-layout article');
    if(!article) return;
    const sourceRows=(r.sources||[]).map(s=>`<div class="source-row"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a><small>${esc(s.type)} · ${esc(s.confidence)}</small></div>`).join('');
    const section=document.createElement('section');
    section.className='detail-section';
    section.id='research-dossier';
    section.innerHTML=`<h2>Research dossier</h2><p>${esc(r.summary||'')}</p>${r.identification_notes?`<h3>Identification notes</h3><p>${esc(r.identification_notes)}</p>`:''}${r.lineage_notes?`<h3>Lineage / relationships</h3><p>${esc(r.lineage_notes)}</p>`:''}${sourceRows?`<h3>Research sources</h3><div class="source-list">${sourceRows}</div>`:''}`;
    const about=article.querySelector('.detail-section');
    about?.after(section);
  }

  function refresh(){load().then(()=>{refreshCards();refreshPedalPage();}).catch(()=>{});}
  window.addEventListener('hashchange',()=>setTimeout(refresh,30));
  setTimeout(refresh,120);
})();
