(() => {
  if (typeof pedalPage === 'function' && !window.__dirtArchivePedalPageWrapped) {
    const originalPedalPage = pedalPage;
    window.__dirtArchivePedalPageWrapped = true;
    window.__dirtArchiveOriginalPedalPage = originalPedalPage;

    pedalPage = function(key) {
      const target = (DATA.pedals || []).find(p => String(p.pedal_id) === String(key));
      if (!target) return originalPedalPage(key);

      const previous = DATA.pedals;
      DATA.pedals = [target, ...previous.filter(p => p !== target)];
      try {
        return originalPedalPage(target.model_name);
      } finally {
        DATA.pedals = previous;
      }
    };

    const originalPedalCard = pedalCard;
    pedalCard = function(p) {
      const b = builder(p.primary_builder_id), im = imageFor(p);
      const art = im
        ? `<img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(p.model_name)}</strong><small>Photo pending rights clearance</small></div></div>'">`
        : `<div class="no-image"><div><strong>${esc(p.model_name)}</strong><small>Archive photography pending</small></div></div>`;
      const research = p?.archive_research;
      const label = research?.status?.toLowerCase().includes('verified') ? 'RESEARCH VERIFIED' : research ? 'RESEARCHED' : 'DISCOVERY';
      const badge = `<span class="research-badge">${label}</span>`;
      return `<a class="pedal-card" data-pedal-id="${esc(p.pedal_id)}" href="#/pedal/${encodeURIComponent(p.pedal_id)}"><div class="pedal-image">${art}</div><div class="pedal-body"><div class="builder">${esc(b?.name||'Builder not established')}</div><h3>${esc(p.model_name)}</h3><div class="meta">${esc(years(p))} · ${esc(p.primary_category)}</div>${badge}</div></a>`;
    };
  }
})();
