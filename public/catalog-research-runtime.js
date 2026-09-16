(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const researchFor = p => p?.archive_research || null;
  const researchLabel = p => {
    const r = researchFor(p);
    return r?.status?.toLowerCase().includes('verified') ? 'RESEARCH VERIFIED' : r ? 'RESEARCHED' : 'DISCOVERY';
  };
  const researchBadge = p => `<span class="research-badge">${researchLabel(p)}</span>`;
  const researchStatus = p => {
    const r = researchFor(p);
    return `<div class="research-status">${researchBadge(p)}<span>${r?.sources?.length || 0} linked sources · ${r?.generations?.length || 0} documented generations</span></div>`;
  };
  const findPedal = key => (window.DATA?.pedals || []).find(p => String(p.pedal_id) === String(key))
    || (window.DATA?.pedals || []).find(p => String(p.model_name || '') === String(key));
  const targetForCard = card => {
    const id = card?.dataset?.pedalId;
    const title = card?.querySelector('h3')?.textContent?.trim();
    return (window.DATA?.pedals || []).find(p => id && String(p.pedal_id) === String(id))
      || (window.DATA?.pedals || []).find(p => title && String(p.model_name || '').trim() === title)
      || null;
  };

  const ensureCardBadges = () => {
    document.querySelectorAll('.pedal-card').forEach(card => {
      if (card.querySelector('.research-badge')) return;
      const body = card.querySelector('.pedal-body');
      if (!body) return;
      body.insertAdjacentHTML('beforeend', researchBadge(targetForCard(card)));
    });
  };

  const ensurePageStatus = () => {
    const key = decodeURIComponent(location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).slice(1,2)[0] || '');
    if (!key) return;
    const target = findPedal(key);
    const detail = document.querySelector('.detail-head');
    if (detail && target && !detail.querySelector('.research-status')) {
      detail.insertAdjacentHTML('beforeend', researchStatus(target));
    }
  };

  function renderDossier(p) {
    const r = researchFor(p);
    if (!r || document.getElementById('research-dossier')) return;
    const sections = [];
    if (r.summary) sections.push(`<p>${esc(r.summary)}</p>`);
    if (r.identification_notes) sections.push(`<h3>Identification notes</h3><p>${esc(r.identification_notes)}</p>`);
    if (r.lineage_notes) sections.push(`<h3>Lineage / relationships</h3><p>${esc(r.lineage_notes)}</p>`);
    const generations = (r.generations || []).map(g => `<div class="source-row"><strong>${esc(g.label || g.name || 'Generation')}</strong><small>${esc(g.years || ((g.from || '') + (g.to ? `–${g.to}` : '')))} · ${esc(g.notes || g.summary || '')}</small></div>`).join('');
    const sources = (r.sources || []).map(s => `<div class="source-row"><a href="${esc(s.url || '#')}" target="_blank" rel="noopener">${esc(s.title || 'Source')} ↗</a><small>${esc(s.type || 'Source')} · ${esc(s.confidence || '')}</small></div>`).join('');
    if (generations) sections.push(`<h3>Generation / version map</h3><div class="source-list">${generations}</div>`);
    if (sources) sections.push(`<h3>Research sources</h3><div class="source-list">${sources}</div>`);
    if (!sections.length) return;
    const section = document.createElement('section');
    section.className = 'archive-section';
    section.id = 'research-dossier';
    section.innerHTML = `<div class="section-head"><h2>Research dossier</h2></div>${sections.join('')}`;
    const evidence = [...document.querySelectorAll('.archive-section')].find(s => s.textContent.includes('Documentation & Evidence'));
    evidence ? evidence.before(section) : document.querySelector('.archive-section:last-of-type')?.after(section);
  }

  const settle = () => {
    ensureCardBadges();
    ensurePageStatus();
  };

  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      settle();
      const cards = document.querySelectorAll('.pedal-card').length;
      const pedal = location.hash.toLowerCase().includes('/pedal/');
      if (cards || pedal || attempts >= 30) {
        timer = null;
        return;
      }
      timer = setTimeout(tick, 100);
    };
    tick();
  };

  function wrapPage() {
    if (typeof window.pedalPage !== 'function' || window.__dirtArchiveResearchDataPageWrapped) return;
    const original = window.pedalPage;
    window.__dirtArchiveResearchDataPageWrapped = true;
    window.pedalPage = function(key) {
      const result = original(key);
      const p = findPedal(key);
      renderDossier(p);
      ensurePageStatus();
      return result;
    };
  }

  wrapPage();
  document.addEventListener('DOMContentLoaded', schedule, {once:true});
  window.addEventListener('load', schedule, {once:true});
  window.addEventListener('hashchange', schedule);
  window.addEventListener('dirtarchive:runtime-ready', schedule);

  window.DIRT_RESEARCH_UI = {ensureCardBadges, ensurePageStatus, schedule};
  schedule();
})();
