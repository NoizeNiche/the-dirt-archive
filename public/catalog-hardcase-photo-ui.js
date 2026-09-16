(() => {
  const manifest = window.DIRT_HARDCASE_PHOTOS || {};
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const esc = s => String(s || '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent=`.hardcase-photo-archive{margin:10px 0 0;padding:10px 0 0;border-top:1px dotted #b9aa92}.hardcase-photo-label{font:700 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#1d1712}.hardcase-photo-note{font:8px/1.35 Arial,Helvetica,sans-serif;color:#766a5b}.hardcase-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-top:7px}.hardcase-photo-grid a{display:block;aspect-ratio:1/1;background:#e7dfd1;overflow:hidden;border:1px solid #cbbda7}.hardcase-photo-grid img{width:100%;height:100%;object-fit:contain;display:block;background:#fbf7ef}@media(max-width:700px){.hardcase-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(style);
  function scan(){
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.hardcase-photo-archive')) return;
      const title=card.querySelector('h3')?.textContent?.trim(); if(!title) return;
      const hits=manifest[title] || manifest[Object.keys(manifest).find(k=>norm(k)===norm(title))];
      if(!hits?.length) return;
      const usable=hits.slice(0,18).filter(x=>x?.src && /^https?:\\/\\//i.test(x.src)); if(!usable.length) return;
      const wrap=document.createElement('div'); wrap.className='hardcase-photo-archive';
      wrap.innerHTML=`<div class="hardcase-photo-label">HARD-CASE PHOTO REFERENCES</div><div class="hardcase-photo-note">${usable.length} source image${usable.length===1?'':'s'} found in specialist archive/dealer pages</div>`;
      const grid=document.createElement('div'); grid.className='hardcase-photo-grid';
      usable.forEach((item,i)=>{const a=document.createElement('a');a.href=item.page;a.target='_blank';a.rel='noopener noreferrer';a.title=`${title} reference ${i+1}`;const img=document.createElement('img');img.src=item.src;img.alt=`${esc(title)} hard-case reference photo ${i+1}`;img.loading='lazy';img.referrerPolicy='no-referrer';img.onerror=()=>a.remove();a.appendChild(img);grid.appendChild(a)});
      wrap.appendChild(grid); (card.querySelector('.pedal-body')||card).appendChild(wrap);
    });
  }
  const observer=new MutationObserver(()=>{clearTimeout(window.__DIRT_HARDCASE_PHOTO_TIMER);window.__DIRT_HARDCASE_PHOTO_TIMER=setTimeout(scan,120)});
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(scan,150)); window.addEventListener('load',()=>setTimeout(scan,300)); setTimeout(scan,500);
})();
