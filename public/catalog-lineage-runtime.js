(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const normalize = v => String(v ?? '').trim().toLowerCase().replace(/[–—]/g,'-');
  let lineage = null;

  const load = () => lineage || fetch('lineage.json').then(r=>r.json()).then(d => (lineage = Array.isArray(d) ? d : []));
  const currentName = () => {
    const parts = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0] !== 'pedal' || !parts[1]) return null;
    return decodeURIComponent(parts[1]);
  };

  const matches = (edge, name) => {
    const n = normalize(name);
    return normalize(edge.source) === n || normalize(edge.target) === n;
  };

  function refresh(){
    load().then(edges => {
      const name = currentName();
      if(!name || document.getElementById('lineage-map')) return;
      const related = edges.filter(e => matches(e,name));
      if(!related.length) return;
      const article = document.querySelector('.detail-layout article');
      if(!article) return;
      const rows = related.map(e => {
        const isSource = normalize(e.source) === normalize(name);
        const counterpart = isSource ? e.target : e.source;
        const direction = isSource ? '→' : '←';
        return `<div class="source-row"><strong>${esc(direction)} ${esc(counterpart)}</strong><small>${esc(e.relationship)} · confidence ${esc(e.confidence)}</small></div>`;
      }).join('');
      const section = document.createElement('section');
      section.className = 'detail-section';
      section.id = 'lineage-map';
      section.innerHTML = `<h2>Lineage & relationships</h2><p>Validated public lineage links. Marketed identities and physical builders remain separate records.</p><div class="source-list">${rows}</div>`;
      const first = article.querySelector('.detail-section');
      first?.after(section);
    }).catch(()=>{});
  }

  window.addEventListener('hashchange',()=>setTimeout(refresh,50));
  setTimeout(refresh,180);
})();
