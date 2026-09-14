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
    ::selection{background:#8b2319;color:#fbf7ef}
    a{-webkit-tap-highlight-color:rgba(139,35,25,.14)}
    @media(max-width:780px){.detail-head:after{display:none}.polish-index{width:24px;height:24px}}
  `;
  document.head.appendChild(style);

  const slug = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  let lastHash = '';

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
  }

  function decorate(){
    decorateCards();
    decorateSections();
    highlightNav();
    const h = location.hash;
    if(h !== lastHash){ window.scrollTo({top:0,behavior:'instant'}); lastHash = h; }
  }

  new MutationObserver(decorate).observe(document.getElementById('app') || document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,25));
  window.addEventListener('load',()=>setTimeout(decorate,80));
  setTimeout(decorate,140);
})();
