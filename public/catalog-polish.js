(() => {
  const style = document.createElement('style');
  style.textContent = `
    .polish-index{position:absolute;top:11px;right:11px;z-index:2;width:27px;height:27px;border:1px solid currentColor;background:rgba(239,231,216,.9);display:grid;place-items:center;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.06em;color:#1d1712}
    .pedal-card .polish-index{color:#8b2319}
    .pedal-card .pedal-body{position:relative}
    .pedal-card .pedal-body:before{content:"CATALOG OBJECT";display:block;margin-bottom:6px;font:700 7px Arial,Helvetica,sans-serif;letter-spacing:.16em;color:#9a8c78}
    .builder-card .name,.builder-feature h2,.pedal-body h3,.detail-title{overflow-wrap:anywhere;text-wrap:balance}
    .detail-head{position:relative;overflow:hidden}
    .detail-head:after{content:"ARCHIVE OBJECT";position:absolute;right:0;bottom:20px;font:700 7px Arial,Helvetica,sans-serif;letter-spacing:.2em;color:#a99a84;transform:rotate(-90deg);transform-origin:right bottom;opacity:.8}
    .research-status{border-top:1px dotted #b9aa92;padding-top:10px}
    .research-status .research-badge{margin-top:0}
    .catalog-section-label{display:flex;align-items:center;gap:10px;margin-bottom:12px;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#766a5b}
    .catalog-section-label:before{content:"";display:block;width:26px;height:2px;background:#8b2319}
    .pedal-card{position:relative;overflow:hidden}
    .pedal-card:after{content:"";position:absolute;inset:0;pointer-events:none;border:1px solid rgba(29,23,18,.05)}
    .pedal-card:hover .pedal-image{filter:saturate(.92) contrast(1.03)}
    .pedal-image{transition:filter .16s,transform .16s}
    .pedal-card:hover .pedal-image{transform:scale(1.012)}
    .source-row{transition:background .15s,transform .15s}
    .source-row:hover{background:rgba(221,208,184,.32);transform:translateX(2px)}
    .source-row a{text-decoration-thickness:1px;text-underline-offset:3px}
    .search-dialog{border-radius:0}
    .search-panel input:focus{border-color:#8b2319;box-shadow:inset 0 0 0 1px #8b2319}
    .search-results{max-height:55vh;overflow:auto}
    .search-result{display:block;padding:10px 12px;border-bottom:1px dotted #b9aa92;color:#1d1712;text-decoration:none}
    .search-result:hover{background:#f4ecdf}
    .search-result strong{display:block;font:700 11px/1.25 Georgia,serif}
    .search-result small{display:block;margin-top:3px;font:8px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#766a5b}
    .search-empty{padding:14px 12px;color:#766a5b;font:9px/1.5 Arial,Helvetica,sans-serif}
    .main-nav a:focus-visible,.search-button:focus-visible,.builder-card:focus-visible,.pedal-card:focus-visible,.alphabet a:focus-visible,.category-tabs a:focus-visible,.link-list a:focus-visible,.source-row a:focus-visible{outline:2px solid #8b2319;outline-offset:2px}
    ::selection{background:#8b2319;color:#fbf7ef}
    a{-webkit-tap-highlight-color:rgba(139,35,25,.14)}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.pedal-card,.builder-card,.source-row,.pedal-image{transition:none!important}.pedal-card:hover{transform:none}.pedal-card:hover .pedal-image{transform:none;filter:none}}
    @media(max-width:780px){.detail-head:after{display:none}.polish-index{width:24px;height:24px}}
  `;
  document.head.appendChild(style);

  let lastHash = '';
  let attempts = 0;
  let timer = null;

  function decorateCards(){
    document.querySelectorAll('.pedal-card').forEach((card, i) => {
      if(card.querySelector('.polish-index')) return;
      const n = String(i + 1).padStart(2,'0');
      const badge = document.createElement('span');
      badge.className = 'polish-index';
      badge.textContent = n;
      card.appendChild(badge);
    });
  }

  function decorateSections(){
    document.querySelectorAll('.section').forEach(section => {
      if(section.querySelector('.catalog-section-label')) return;
      const h = section.querySelector('.section-head h2');
      if(!h) return;
      const label = document.createElement('div');
      label.className = 'catalog-section-label';
      label.textContent = 'Archive section';
      h.before(label);
    });
  }

  function highlightNav(){
    const hash = location.hash.toLowerCase();
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    if(hash.includes('/category/fuzz')) document.querySelector('.main-nav a[href="#/category/fuzz"]')?.classList.add('active');
    else if(hash.includes('/category/overdrive')) document.querySelector('.main-nav a[href="#/category/overdrive"]')?.classList.add('active');
    else if(hash.includes('/category/distortion')) document.querySelector('.main-nav a[href="#/category/distortion"]')?.classList.add('active');
    else if(hash.includes('/builders') || hash.includes('/builder/')) document.querySelector('.main-nav a[href="#/builders"]')?.classList.add('active');
    else if(hash.includes('/identify')) document.querySelector('.main-nav a[href="#/identify"]')?.classList.add('active');
    else if(hash.includes('/photos')) document.querySelector('.main-nav a[href="#/photos"]')?.classList.add('active');
    else if(hash.includes('/about')) document.querySelector('.main-nav a[href="#/about"]')?.classList.add('active');
  }

  function searchRecords(query){
    const q = String(query || '').trim().toLowerCase();
    const pedals = Array.isArray(window.DATA?.pedals) ? window.DATA.pedals : [];
    const builders = Array.isArray(window.DATA?.builders) ? window.DATA.builders : [];
    if(!q) return [];
    const builderNames = new Map(builders.map(b => [b.builder_id, b.name]));
    const ranked = [];
    for(const p of pedals){
      const builderName = builderNames.get(p.primary_builder_id) || '';
      const hay = `${p.model_name || ''} ${builderName} ${p.primary_category || ''}`.toLowerCase();
      if(!hay.includes(q)) continue;
      const exact = String(p.model_name || '').toLowerCase() === q;
      const starts = String(p.model_name || '').toLowerCase().startsWith(q);
      ranked.push({p,builderName,score:exact?0:(starts?1:2)});
    }
    ranked.sort((a,b)=>a.score-b.score || String(a.p.model_name).localeCompare(String(b.p.model_name)));
    return ranked.slice(0,24);
  }

  function renderSearch(query){
    const resultsEl = document.getElementById('searchResults');
    if(!resultsEl) return;
    const q = String(query || '').trim();
    if(!q){ resultsEl.innerHTML='<div class="search-empty">Type a builder, pedal, or category.</div>'; return; }
    const hits = searchRecords(q);
    if(!hits.length){ resultsEl.innerHTML='<div class="search-empty">No archive records matched that search.</div>'; return; }
    resultsEl.innerHTML = hits.map(({p,builderName})=>`<a class="search-result" href="#/pedal/${encodeURIComponent(p.pedal_id || p.model_name || '')}"><strong>${esc(p.model_name || 'Untitled record')}</strong><small>${esc(builderName || 'Builder not established')} · ${esc(p.primary_category || 'Dirt')}</small></a>`).join('');
  }

  function wireSearch(){
    const btn = document.getElementById('searchBtn');
    const dlg = document.getElementById('searchDialog');
    const input = document.getElementById('searchInput');
    if(!btn || !dlg || !input) return;
    if(btn.dataset.dirtSearchBound === '1') return;
    btn.dataset.dirtSearchBound = '1';
    btn.addEventListener('click', event => {
      event.preventDefault();
      if(typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open','open');
      renderSearch(input.value);
      queueMicrotask(() => input.focus());
    });
    input.addEventListener('input', () => renderSearch(input.value));
    dlg.addEventListener('click', event => {
      if(event.target === dlg && typeof dlg.close === 'function') dlg.close();
    });
    renderSearch(input.value);
  }

  function decorate(){
    decorateCards();
    decorateSections();
    highlightNav();
    wireSearch();
    const h = location.hash;
    if(h !== lastHash){ window.scrollTo(0,0); lastHash = h; }
    const ready = !!document.querySelector('#app > *');
    if(ready){attempts=0;timer=null;return;}
    if(attempts>=30){attempts=0;timer=null;return;}
    attempts += 1;
    timer = setTimeout(decorate,100);
  }

  function schedule(){
    attempts=0;
    if(timer) clearTimeout(timer);
    decorate();
  }

  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('dirtarchive:runtime-ready',schedule);
  schedule();
})();
