(() => {
  const style=document.createElement('style');
  style.textContent=`
    .specimen-strip{margin-top:12px;border-top:3px double #1d1712;padding-top:12px}
    .specimen-kicker{font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#8b2319;margin-bottom:7px}
    .specimen-strip p{margin:0 0 10px;color:#766a5b;font:10px/1.45 Arial,Helvetica,sans-serif}
    .specimen-links{display:flex;flex-wrap:wrap;gap:7px}
    .specimen-links a{display:inline-flex;align-items:center;padding:7px 9px;border:1px solid #b9aa92;background:#fbf7ef;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase}
    .specimen-links a:hover{background:#1d1712;color:#fbf7ef;border-color:#1d1712}
    .specimen-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:12px 0 2px}
    .specimen-item{margin:0;border:1px solid #b9aa92;background:#fbf7ef}
    .specimen-item img{display:block;width:100%;aspect-ratio:4/3;object-fit:contain;background:#e5dccb}
    .specimen-reference{min-height:150px;display:flex;align-items:center;justify-content:center;padding:18px;text-align:center;background:repeating-linear-gradient(135deg,#eee5d5 0,#eee5d5 8px,#e8decc 8px,#e8decc 16px)}
    .specimen-reference strong{display:block;font:700 8px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8b2319}
    .specimen-reference span{display:block;margin-top:6px;font:9px/1.45 Georgia,'Times New Roman',serif;color:#1d1712}
    .specimen-reference a{display:inline-block;margin-top:9px;font:700 7px Arial,Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase}
    .specimen-meta{padding:8px 9px 9px;border-top:1px solid #b9aa92}
    .specimen-role{font:700 7px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8b2319}
    .specimen-caption{margin-top:4px;font:9px/1.35 Georgia,'Times New Roman',serif;color:#1d1712}
    .specimen-attribute{margin-top:6px;padding-top:6px;border-top:1px dotted #b9aa92;font:7px/1.4 Arial,Helvetica,sans-serif;color:#766a5b}
    .specimen-attribute b{color:#1d1712;letter-spacing:.06em;text-transform:uppercase}
    .specimen-source{margin-top:7px;font:7px/1.3 Arial,Helvetica,sans-serif;color:#766a5b}
    .specimen-status{margin-top:6px;font:700 6px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase}
    .specimen-status.cleared{color:#48634d}
    .specimen-status.reference{color:#8b2319}
    .card-specimen-count{display:block;margin-top:7px;color:#766a5b;font:700 7px Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase}
    .card-specimen-count .dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:#48634d;margin-right:5px;vertical-align:middle}
    @media(max-width:640px){.specimen-gallery{grid-template-columns:1fr 1fr}.specimen-item img{aspect-ratio:1/1}}
  `;
  document.head.appendChild(style);

  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const buildUrl=(title,extra='')=>`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${title} ${extra} guitar pedal vintage`)}`;
  const specs=()=>Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  const forTitle=title=>specs().filter(s=>s.title===title);

  function addCardSpecimens(){
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.card-specimen-count')) return;
      const title=card.querySelector('h3')?.textContent?.trim();
      if(!title) return;
      const list=forTitle(title);
      if(!list.length) return;
      const cleared=list.filter(s=>(s.rights||'Reference').toLowerCase()==='cleared').length;
      const body=card.querySelector('.pedal-body')||card;
      const el=document.createElement('div');
      el.className='card-specimen-count';
      el.innerHTML=`${cleared?'<span class="dot"></span>':''}${list.length} visual specimen${list.length===1?'':'s'} indexed${cleared?` · ${cleared} archive-cleared`:''}`;
      body.appendChild(el);
    });
  }

  function specimenVisual(s,title){
    const status=(s.rights||'Reference').toLowerCase();
    if(status==='cleared'){
      return `<a href="${esc(s.src)}" target="_blank" rel="noopener"><img src="${esc(s.src)}" alt="${esc(title)} ${esc(s.role||'specimen')} photograph" loading="lazy" referrerpolicy="no-referrer"></a>`;
    }
    return `<div class="specimen-reference"><div><strong>External visual reference</strong><span>Photograph retained as an identification lead, not an Archive asset.</span><a href="${esc(s.page||s.src)}" target="_blank" rel="noopener">Open source / specimen ↗</a></div></div>`;
  }

  function addBlock(){
    const layout=document.querySelector('.detail-layout');
    const heading=document.querySelector('.detail-title');
    if(!layout||!heading||layout.querySelector('.specimen-strip')) return;
    const title=heading.textContent.trim();
    const card=layout.querySelector('.plate');
    if(!card) return;
    const list=forTitle(title);
    const gallery=list.length?`<div class="specimen-gallery">${list.map(s=>{
      const status=(s.rights||'Reference').toLowerCase();
      const cls=status==='cleared'?'cleared':'reference';
      const electronics=s.electronics||'';
      return `<figure class="specimen-item">${specimenVisual(s,title)}<figcaption class="specimen-meta"><div class="specimen-role">${esc(s.role||'Specimen')}${s.era?` · ${esc(s.era)}`:''}</div><div class="specimen-caption">${esc(s.caption||'Visual identification specimen.')}</div>${s.variant_type?`<div class="specimen-attribute"><b>Variant identity</b><br>${esc(s.variant_type)}</div>`:''}${s.appearance?`<div class="specimen-attribute"><b>Appearance</b><br>${esc(s.appearance)}</div>`:''}${electronics?(typeof electronics==='string'?`<div class="specimen-attribute"><b>Electronics</b><br>${esc(electronics)}</div>`:`<div class="specimen-attribute"><b>Semiconductor family</b><br>${esc(electronics.semiconductor_family||'Not specified')}${electronics.notes?`<br>${esc(electronics.notes)}`:''}</div>`):''}<div class="specimen-source"><a href="${esc(s.page||s.src)}" target="_blank" rel="noopener">Source / file page ↗</a><br>${esc(s.credit||'Source credit recorded in registry.')}</div><div class="specimen-status ${cls}">${status==='cleared'?'Rights status: cleared for Archive use':'Rights status: external reference only'}</div></figcaption></figure>`;
    }).join('')}</div>`:'';

    const strip=document.createElement('div');
    strip.className='specimen-strip';
    strip.innerHTML=`<div class="specimen-kicker">Visual specimen index</div><p>${list.length?`This page currently indexes ${list.length} documented visual specimen${list.length===1?'':'s'}. Specimens can represent factory variants, colorways, OEM versions, reissues and unusual production changes.`:'No independently registered specimen image yet. External searches provide a visual reference doorway until a source is documented and rights-reviewed.'}</p>${gallery}<div class="specimen-links"><a href="${buildUrl(title,'front')}" target="_blank" rel="noopener">Front examples ↗</a><a href="${buildUrl(title,'vintage')}" target="_blank" rel="noopener">Vintage examples ↗</a><a href="${buildUrl(title,'variant')}" target="_blank" rel="noopener">Variants ↗</a></div><div class="specimen-plate-note">Identification workflow: compare enclosure shape, graphics, controls, treadle hardware, labeling and known production variants. External photographs are identification aids, not automatically cleared Archive assets. Electronics distinctions are recorded only when supported by source-backed evidence.</div>`;
    card.appendChild(strip);
  }

  function decorate(){addCardSpecimens();addBlock();}
  new MutationObserver(()=>setTimeout(decorate,20)).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,50));
  window.addEventListener('load',()=>setTimeout(decorate,120));
  setTimeout(decorate,220);
})();
