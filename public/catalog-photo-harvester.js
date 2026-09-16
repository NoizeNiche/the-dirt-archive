(() => {
  // Photo Harvester: identification-first visual research layer.
  // It discovers multiple Wikimedia Commons images per pedal at runtime,
  // while keeping image discovery separate from the Archive's cleared-media registry.
  const MAX_IMAGES = 6;
  const CACHE_KEY = 'dirt-archive-photo-harvest-v2';
  const inflight = new Map();
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch (_) { cache = {}; }

  const style = document.createElement('style');
  style.textContent = `
    .photo-harvest{margin:10px 0 0;padding:10px 0 0;border-top:1px dotted #b9aa92}
    .photo-harvest-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:7px}
    .photo-harvest-label{font:700 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#1d1712}
    .photo-harvest-status{font:8px/1 Arial,Helvetica,sans-serif;color:#766a5b}
    .photo-harvest-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
    .photo-harvest-grid a{display:block;aspect-ratio:1/1;background:#e7dfd1;overflow:hidden;border:1px solid #cbbda7}
    .photo-harvest-grid img{width:100%;height:100%;display:block;object-fit:cover}
    .photo-harvest-note{margin-top:6px;font:8px/1.35 Arial,Helvetica,sans-serif;color:#766a5b}
    .photo-harvest-note a{color:inherit}
    .photo-harvest-lead{position:relative}
    .photo-harvest-lead img{width:100%;height:100%;display:block;object-fit:contain}
    .photo-harvest-badge{position:absolute;left:7px;bottom:7px;background:#fbf7ef;padding:5px 6px;border:1px solid #b9aa92;font:700 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#1d1712}
    @media (max-width:700px){.photo-harvest-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

  function cacheSet(key,value){
    cache[key]=value;
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (_) {}
  }

  async function searchCommons(title){
    const key=normalize(title);
    if(cache[key]) return cache[key];
    if(inflight.has(key)) return inflight.get(key);
    const p=(async()=>{
      try{
        const q=encodeURIComponent(`${title} guitar pedal`);
        const url=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=${MAX_IMAGES}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json&origin=*`;
        const res=await fetch(url,{credentials:'omit'});
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const json=await res.json();
        const pages=Object.values(json?.query?.pages || {});
        const out=pages.map(page=>{
          const ii=page?.imageinfo?.[0];
          const md=ii?.extmetadata || {};
          const titleText=String(page?.title || '').replace(/^File:/,'');
          const thumb=ii?.thumburl || ii?.url;
          const source=ii?.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page?.title || '')}`;
          const license=String(md?.LicenseShortName?.value || md?.UsageTerms?.value || 'Wikimedia Commons');
          const artist=String(md?.Artist?.value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
          return {src:thumb,page:source,title:titleText,license,artist};
        }).filter(x=>x.src);
        cacheSet(key,out);
        return out;
      }catch(e){
        cacheSet(key,[]);
        return [];
      }finally{ inflight.delete(key); }
    })();
    inflight.set(key,p);
    return p;
  }

  function validImageSource(src){
    return /^https:\/\/(commons\.wikimedia\.org|upload\.wikimedia\.org)\//i.test(src || '');
  }

  function promoteLead(card,title,usable){
    if(!usable.length) return;
    const holder=card.querySelector('.pedal-image');
    if(!holder || holder.querySelector('img')) return;
    const im=usable[0];
    holder.classList.add('photo-harvest-lead');
    holder.innerHTML='';
    const a=document.createElement('a');
    a.href=im.page;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.title=`${im.title || title} · ${im.license || 'Wikimedia Commons'}`;
    const img=document.createElement('img');
    img.src=im.src;
    img.alt=`${title} reference photograph`;
    img.loading='lazy';
    img.referrerPolicy='no-referrer';
    img.addEventListener('error',()=>{ holder.classList.remove('photo-harvest-lead'); holder.innerHTML=`<div class="no-image"><div><strong>${esc(title)}</strong><small>Archive photography pending</small></div></div>`; });
    a.appendChild(img);
    holder.appendChild(a);
    const badge=document.createElement('span');
    badge.className='photo-harvest-badge';
    badge.textContent='PUBLIC PHOTO REFERENCE';
    holder.appendChild(badge);
  }

  function render(card,title,items){
    if(card.querySelector('.photo-harvest')) return;
    const usable=items.filter(x=>validImageSource(x.src)).slice(0,MAX_IMAGES);
    promoteLead(card,title,usable);
    const wrap=document.createElement('div');
    wrap.className='photo-harvest';
    wrap.innerHTML=`<div class="photo-harvest-head"><span class="photo-harvest-label">PHOTO ARCHIVE</span><span class="photo-harvest-status">${usable.length ? `${usable.length} public-media result${usable.length===1?'':'s'}` : 'no Commons match'}</span></div>`;
    if(usable.length){
      const grid=document.createElement('div');
      grid.className='photo-harvest-grid';
      usable.forEach((im,i)=>{
        const a=document.createElement('a');
        a.href=im.page;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.title=`${im.title || title} · ${im.license || 'Wikimedia Commons'}`;
        const img=document.createElement('img');
        img.src=im.src;
        img.alt=`${title} reference photograph ${i+1}`;
        img.loading='lazy';
        img.referrerPolicy='no-referrer';
        img.addEventListener('error',()=>a.remove());
        a.appendChild(img);
        grid.appendChild(a);
      });
      wrap.appendChild(grid);
      const note=document.createElement('div');
      note.className='photo-harvest-note';
      note.innerHTML='Public-media discovery references from Wikimedia Commons. Open an image for its source page, photographer/creator and license information. These references remain separate from cleared Archive media.';
      wrap.appendChild(note);
    } else {
      const note=document.createElement('div');
      note.className='photo-harvest-note';
      const q=encodeURIComponent(`${title} guitar pedal`);
      note.innerHTML=`No Wikimedia Commons match found yet. <a href="https://commons.wikimedia.org/w/index.php?search=${q}&title=Special:MediaSearch&type=image" target="_blank" rel="noopener noreferrer">Search Commons ↗</a>`;
      wrap.appendChild(note);
    }
    (card.querySelector('.pedal-body') || card).appendChild(wrap);
  }

  async function hydrate(card){
    if(card.dataset.photoHarvested || card.dataset.photoHarvestBusy) return;
    const title=card.querySelector('h3')?.textContent?.trim();
    if(!title) return;
    card.dataset.photoHarvestBusy='1';
    const items=await searchCommons(title);
    render(card,title,items);
    card.dataset.photoHarvested='1';
    delete card.dataset.photoHarvestBusy;
  }

  async function scan(){
    const cards=[...document.querySelectorAll('.pedal-card')];
    for(const card of cards){
      await hydrate(card);
      await sleep(80);
    }
  }

  const observer=new MutationObserver(()=>{ clearTimeout(window.__DIRT_PHOTO_TIMER); window.__DIRT_PHOTO_TIMER=setTimeout(scan,120); });
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(scan,120));
  window.addEventListener('load',()=>setTimeout(scan,220));
  setTimeout(scan,250);
})();
