(() => {
  // Full-catalog photo presentation layer.
  // The GitHub Actions harvester writes catalog-photo-manifest.js with the best
  // discoverable image candidates and provenance. This layer presents them on cards.
  const MAX_IMAGES=6;
  const style=document.createElement('style');
  style.textContent=`
    .photo-harvest{margin:9px 0 0;padding:9px 0 0;border-top:1px dotted #b9aa92}
    .photo-harvest-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px}
    .photo-harvest-label{font:700 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#1d1712}
    .photo-harvest-status{font:8px/1 Arial,Helvetica,sans-serif;color:#766a5b}
    .photo-harvest-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
    .photo-harvest-grid a{display:block;aspect-ratio:1/1;background:#e7dfd1;overflow:hidden;border:1px solid #cbbda7}
    .photo-harvest-grid img{width:100%;height:100%;display:block;object-fit:cover}
    .photo-harvest-note{margin-top:6px;font:8px/1.35 Arial,Helvetica,sans-serif;color:#766a5b}
    .photo-harvest-badge{position:absolute;left:7px;bottom:7px;background:#fbf7ef;padding:5px 6px;border:1px solid #b9aa92;font:700 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#1d1712}
    .photo-harvest-lead{position:relative}
    .photo-harvest-lead img{width:100%;height:100%;display:block;object-fit:contain}
    @media(max-width:700px){.photo-harvest-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let manifestPromise;

  function loadManifest(){
    if(window.DIRT_PHOTO_MANIFEST) return Promise.resolve();
    if(manifestPromise) return manifestPromise;
    manifestPromise=new Promise(resolve=>{
      const s=document.createElement('script');
      s.src='/catalog-photo-manifest.js?v='+Date.now();
      s.onload=resolve;s.onerror=resolve;
      document.head.appendChild(s);
    });
    return manifestPromise;
  }

  function resolver(){
    if(window.__DIRT_PHOTO_RESOLVER) return;
    const previous=window.imageFor;
    window.imageFor=p=>{
      const hit=(window.DIRT_PHOTO_MANIFEST||{})[p?.model_name];
      if(hit?.src) return hit;
      return previous?previous(p):null;
    };
    window.__DIRT_PHOTO_RESOLVER=true;
  }

  function render(card,title,entry){
    const gallery=(entry?.gallery||[]).filter(x=>x?.src).slice(0,MAX_IMAGES);
    if(!gallery.length && entry?.src) gallery.push(entry);
    if(!gallery.length) return;
    const holder=card.querySelector('.pedal-image');
    if(holder && !holder.querySelector('img')){
      const im=gallery[0];
      holder.classList.add('photo-harvest-lead');
      holder.innerHTML='';
      const a=document.createElement('a');a.href=im.page||im.src;a.target='_blank';a.rel='noopener noreferrer';
      const img=document.createElement('img');img.src=im.src;img.alt=`${title} reference photograph`;img.loading='lazy';img.referrerPolicy='no-referrer';
      img.onerror=()=>{a.remove();};a.appendChild(img);holder.appendChild(a);
      const badge=document.createElement('span');badge.className='photo-harvest-badge';badge.textContent='PHOTO REFERENCE';holder.appendChild(badge);
    }
    let wrap=card.querySelector('.photo-harvest');
    if(!wrap){wrap=document.createElement('div');wrap.className='photo-harvest';card.querySelector('.pedal-body')?.appendChild(wrap);}
    wrap.innerHTML='';
    const head=document.createElement('div');head.className='photo-harvest-head';head.innerHTML=`<span class="photo-harvest-label">PHOTO ARCHIVE</span><span class="photo-harvest-status">${gallery.length} reference${gallery.length===1?'':'s'}</span>`;wrap.appendChild(head);
    const grid=document.createElement('div');grid.className='photo-harvest-grid';
    gallery.forEach((im,i)=>{const a=document.createElement('a');a.href=im.page||im.src;a.target='_blank';a.rel='noopener noreferrer';a.title=`${im.title||title} · ${im.license||''}`;const img=document.createElement('img');img.src=im.src;img.alt=`${title} reference photograph ${i+1}`;img.loading='lazy';img.referrerPolicy='no-referrer';img.onerror=()=>a.remove();a.appendChild(img);grid.appendChild(a);});
    wrap.appendChild(grid);
    const note=document.createElement('div');note.className='photo-harvest-note';note.textContent='Collected reference photography. Source and license metadata are preserved with the record; discovery does not automatically grant republication permission.';wrap.appendChild(note);
  }

  async function run(){
    await loadManifest();
    resolver();
    document.querySelectorAll('.pedal-card').forEach(card=>{const title=card.querySelector('h3')?.textContent?.trim();if(title)render(card,title,(window.DIRT_PHOTO_MANIFEST||{})[title]);});
  }

  const observer=new MutationObserver(()=>{clearTimeout(window.__DIRT_PHOTO_TIMER);window.__DIRT_PHOTO_TIMER=setTimeout(run,90);});
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(run,120));
  window.addEventListener('load',()=>setTimeout(run,180));
  setTimeout(run,100);
})();
