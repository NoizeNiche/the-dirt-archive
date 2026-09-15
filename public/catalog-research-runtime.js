(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const researchFor = p => p?.archive_research || null;
  const findPedal = key => (window.DATA?.pedals || []).find(p => String(p.pedal_id) === String(key))
    || (window.DATA?.pedals || []).find(p => String(p.model_name || '') === String(key));

  function wrapCard(){
    if(typeof window.pedalCard !== 'function' || window.__dirtArchiveResearchDataCardWrapped) return;
    const original = window.pedalCard;
    window.__dirtArchiveResearchDataCardWrapped = true;
    window.pedalCard = function(p){
      return original(p);
    };
  }

  function renderDossier(p){
    const r = researchFor(p);
    if(!r || document.getElementById('research-dossier')) return;
    const sections = [];
    if(r.summary) sections.push(`<p>${esc(r.summary)}</p>`);
    if(r.identification_notes) sections.push(`<h3>Identification notes</h3><p>${esc(r.identification_notes)}</p>`);
    if(r.lineage_notes) sections.push(`<h3>Lineage / relationships</h3><p>${esc(r.lineage_notes)}</p>`);
    const generations = (r.generations || []).map(g => `<div class="source-row"><strong>${esc(g.label || g.name || 'Generation')}</strong><small>${esc(g.years || ((g.from || '') + (g.to ? `–${g.to}` : '')))} · ${esc(g.notes || g.summary || '')}</small></div>`).join('');
    const sources = (r.sources || []).map(s => `<div class="source-row"><a href="${esc(s.url || '#')}" target="_blank" rel="noopener">${esc(s.title || 'Source')} ↗</a><small>${esc(s.type || 'Source')} · ${esc(s.confidence || '')}</small></div>`).join('');
    if(generations) sections.push(`<h3>Generation / version map</h3><div class="source-list">${generations}</div>`);
    if(sources) sections.push(`<h3>Research sources</h3><div class="source-list">${sources}</div>`);
    if(!sections.length) return;
    const section = document.createElement('section');
    section.className = 'archive-section';
    section.id = 'research-dossier';
    section.innerHTML = `<div class="section-head"><h2>Research dossier</h2></div>${sections.join('')}`;
    const evidence = [...document.querySelectorAll('.archive-section')].find(s => s.textContent.includes('Documentation & Evidence'));
    evidence ? evidence.before(section) : document.querySelector('.archive-section:last-of-type')?.after(section);
  }

  function wrapPage(){
    if(typeof window.pedalPage !== 'function' || window.__dirtArchiveResearchDataPageWrapped) return;
    const original = window.pedalPage;
    window.__dirtArchiveResearchDataPageWrapped = true;
    window.pedalPage = function(key){
      const result = original(key);
      renderDossier(findPedal(key));
      return result;
    };
  }

  wrapCard();
  wrapPage();
})();
