(() => {
  const app = document.getElementById('app');
  const esc = v => String(v ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function render(){
    if(!app || !window.DATA || !location.hash.startsWith('#/pedal/')) return;
    const research = window.DATA.pedals?.find(p=>location.hash.toLowerCase().includes(encodeURIComponent(p.model_name).toLowerCase()))?.archive_research;
    if(!research || document.getElementById('variant-research-panel')) return;
    const rows=(research.distinguishers||[]).map(d=>`<tr><td>${esc(d.type)}</td><td>${esc(d.description)}</td><td>${esc(d.value)}</td><td>${esc(d.confidence)}</td></tr>`).join('');
    const variants=(research.variants||[]).map(v=>`<div class="timeline-item"><div class="date">${esc(v.label)}</div><h3>${esc(v.type||'variant')}</h3><p>${esc(v.notes)}</p><p><strong>Identification:</strong> ${esc(v.identification)}</p></div>`).join('');
    const source=(research.sources||[]).map(s=>`<div class="source-row"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a><small>${esc(s.type)} · ${esc(s.confidence)}</small></div>`).join('');
    const section=document.createElement('section'); section.className='section'; section.id='variant-research-panel';
    section.innerHTML=`<div class="section-head"><h2>Variant & identification record</h2><div class="section-note">${esc(research.family_status||'Research')}</div></div><div class="paper-box"><p>${esc(research.identity_note||'Variant research attached to this catalog record.')}</p></div>${variants?`<div class="section-head" style="margin-top:22px"><h3>Known variants</h3></div><div class="timeline">${variants}</div>`:''}${rows?`<div class="section-head" style="margin-top:22px"><h3>What makes them different?</h3><div class="section-note">Identification clues</div></div><table class="table"><thead><tr><th>Type</th><th>Characteristic</th><th>Identification value</th><th>Confidence</th></tr></thead><tbody>${rows}</tbody></table>`:''}${source?`<div class="section-head" style="margin-top:22px"><h3>Variant evidence</h3></div><div class="source-list">${source}</div>`:''}`;
    const anchor=[...app.querySelectorAll('.section')].pop() || app.lastElementChild; if(anchor) anchor.insertAdjacentElement('afterend',section); else app.appendChild(section);
  }
  window.addEventListener('hashchange',()=>setTimeout(render,50));
  const mo=new MutationObserver(()=>render()); mo.observe(app,{childList:true,subtree:true});
  setTimeout(render,150);
})();
