(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const normalize = v => String(v ?? '').trim().toLowerCase().replace(/[–—]/g,'-');
  let lineage = null;
  let catalog = null;
  let lastRoute = '';

  const load = () => Promise.all([
    lineage || fetch('lineage.json').then(r=>r.json()).then(d => (lineage = Array.isArray(d) ? d : [])),
    catalog || fetch('data.json').then(r=>r.json()).then(d => (catalog = d || {}))
  ]);

  const currentPedal = () => {
    const parts = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0] !== 'pedal' || !parts[1]) return null;
    const key = decodeURIComponent(parts[1]);
    return (catalog?.pedals || []).find(p => String(p.pedal_id) === key)
      || (catalog?.pedals || []).find(p => normalize(p.model_name) === normalize(key));
  };

  const matches = (edge, name) => {
    const n = normalize(name);
    return normalize(edge.source) === n || normalize(edge.target) === n;
  };

  const render = () => {
    load().then(([edges]) => {
      const route = location.hash;
      const pedal = currentPedal();
      const name = pedal?.model_name;
      if(route === lastRoute && document.getElementById('lineage-map')) return;
      lastRoute = route;
      document.getElementById('lineage-map')?.remove();
      if(!name) return;
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
  };

  const waitForPage = () => {
    if(location.hash === lastRoute && document.getElementById('lineage-map')) return;
    render();
    if(location.hash.startsWith('#/pedal/')) {
      setTimeout(() => {
        if(!document.querySelector('.detail-layout article')) render();
        else if(!document.getElementById('lineage-map')) render();
      }, 50);
      setTimeout(() => {
        if(location.hash !== lastRoute || (document.querySelector('.detail-layout article') && !document.getElementById('lineage-map'))) render();
      }, 250);
    }
  };

  window.addEventListener('hashchange', waitForPage);
  window.addEventListener('load', waitForPage);
  const observer = new MutationObserver(() => {
    if(location.hash.startsWith('#/pedal/')) waitForPage();
  });
  observer.observe(document.getElementById('app') || document.body, {childList:true,subtree:true});
  waitForPage();
})();
