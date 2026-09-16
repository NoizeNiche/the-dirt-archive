(() => {
  const manifest = window.DIRT_VARIANT_PHOTOS || {};
  const style = document.createElement('style');
  style.textContent = `
    .variant-photo-archive{margin:10px 0 0;padding:10px 0 0;border-top:1px dotted #b9aa92}
    .variant-photo-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px}
    .variant-photo-label{font:700 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#1d1712}
    .variant-photo-note{font:8px/1.35 Arial,Helvetica,sans-serif;color:#766a5b}
    .variant-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
    .variant-photo-item{background:#e7dfd1;border:1px solid #cbbda7;padding:4px}
    .variant-photo-item img{width:100%;aspect-ratio:1/1;object-fit:contain;display:block;background:#fbf7ef}
    .variant-photo-title{font:700 7px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.04em;margin-top:4px;color:#1d1712}
    .variant-photo-credit{font:7px/1.25 Arial,Helvetica,sans-serif;margin-top:2px;color:#766a5b}
    @media(max-width:700px){.variant-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const variants = Object.values(manifest);
  const groups = {};
  variants.forEach(v => (groups[norm(v.parent_model)] ||= []).push(v));

  function render(card){
    if(card.querySelector('.variant-photo-archive')) return;
    const title = card.querySelector('h3')?.textContent?.trim();
    if(!title) return;
    const hits = groups[norm(title)];
    if(!hits?.length) return;
    const usable = hits.flatMap(v => (v.photos || []).map(p => ({...p, label:v.variant_label, sourceType:v.source_type, sourcePage:v.source_page}))).filter(p => /^https?:\\/\\//i.test(p.src));
    if(!usable.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'variant-photo-archive';
    wrap.innerHTML = `<div class="variant-photo-head"><span class="variant-photo-label">VARIANT PHOTO RECORD</span><span class="variant-photo-note">${usable.length} reference image${usable.length === 1 ? '' : 's'}</span></div>`;
    const grid = document.createElement('div');
    grid.className = 'variant-photo-grid';
    usable.slice(0,18).forEach(item => {
      const box = document.createElement('div');
      box.className='variant-photo-item';
      const a=document.createElement('a');
      a.href=item.sourcePage || item.page || '#';
      a.target='_blank'; a.rel='noopener noreferrer';
      const img=document.createElement('img');
      img.src=item.src; img.alt=item.label+' reference photograph'; img.loading='lazy'; img.referrerPolicy='no-referrer';
      img.onerror=()=>box.remove();
      a.appendChild(img); box.appendChild(a);
      const titleEl=document.createElement('div'); titleEl.className='variant-photo-title'; titleEl.textContent=item.label; box.appendChild(titleEl);
      const credit=document.createElement('div'); credit.className='variant-photo-credit'; credit.textContent=item.sourceType+' · open source page'; box.appendChild(credit);
      grid.appendChild(box);
    });
    wrap.appendChild(grid);
    (card.querySelector('.pedal-body') || card).appendChild(wrap);
  }

  function scan(){ document.querySelectorAll('.pedal-card').forEach(render); }
  const observer=new MutationObserver(()=>{clearTimeout(window.__DIRT_VARIANT_PHOTO_TIMER);window.__DIRT_VARIANT_PHOTO_TIMER=setTimeout(scan,120);});
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(scan,120));
  window.addEventListener('load',()=>setTimeout(scan,250));
  setTimeout(scan,350);
})();
