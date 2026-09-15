(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const normalize = v => String(v ?? '').trim().toLowerCase().replace(/[–—]/g,'-');
  let lineage = null;

  const load = () => lineage || fetch('lineage.json').then(r=>r.json()).then(d => (lineage = Array.isArray(d) ? d : []));
  const findPedal = key => {
    const catalog = window.DATA || {};
    const decoded = decodeURIComponent(String(key || ''));
    return (catalog.pedals || []).find(p => String(p.pedal_id) === decoded)
      || (catalog.pedals || []).find(p => normalize(p.model_name) === normalize(decoded))
      || (catalog.pedals || []).find(p => normalize(p.model_name) === normalize(decoded).replace(/-/g,' '));
  };

  function renderForPedal(p) {
    if (!p) return;
    const article = document.querySelector('.detail-layout article');
    if (!article || document.getElementById('lineage-map')) return;
    load().then(edges => {
      const related = edges.filter(e => {
        const name = normalize(p.model_name);
        return normalize(e.source) === name || normalize(e.target) === name;
      });
      if (!related.length) return;
      const rows = related.map(e => {
        const source = normalize(e.source) === normalize(p.model_name);
        const counterpart = source ? e.target : e.source;
        const direction = source ? '→' : '←';
        return `<div class="source-row"><strong>${esc(direction)} ${esc(counterpart)}</strong><small>${esc(e.relationship)} · confidence ${esc(e.confidence)}</small></div>`;
      }).join('');
      const section = document.createElement('section');
      section.className = 'detail-section';
      section.id = 'lineage-map';
      section.innerHTML = `<h2>Lineage & relationships</h2><p>Validated public lineage links. Marketed identities and physical builders remain separate records.</p><div class="source-list">${rows}</div>`;
      article.querySelector('.detail-section')?.after(section);
    }).catch(() => {});
  }

  if (typeof window.pedalPage === 'function' && !window.__dirtArchiveLineagePageWrapped) {
    const originalPedalPage = window.pedalPage;
    window.__dirtArchiveLineagePageWrapped = true;
    window.pedalPage = function(key) {
      const result = originalPedalPage(key);
      renderForPedal(findPedal(key));
      return result;
    };
  }
})();
