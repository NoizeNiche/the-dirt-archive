(() => {
  const style=document.createElement('style');
  style.textContent=`
    .specimen-strip{margin-top:12px;border-top:3px double #1d1712;padding-top:12px}
    .specimen-kicker{font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#8b2319;margin-bottom:7px}
    .specimen-strip p{margin:0 0 10px;color:#766a5b;font:10px/1.45 Arial,Helvetica,sans-serif}
    .specimen-links{display:flex;flex-wrap:wrap;gap:7px}
    .specimen-links a{display:inline-flex;align-items:center;padding:7px 9px;border:1px solid #b9aa92;background:#fbf7ef;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase}
    .specimen-links a:hover{background:#1d1712;color:#fbf7ef;border-color:#1d1712}
    .specimen-plate-note{margin-top:10px;padding-top:10px;border-top:1px dotted #b9aa92;color:#766a5b;font:8px/1.45 Arial,Helvetica,sans-serif}
    .specimen-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:12px 0 2px}
    .specimen-item{margin:0;border:1px solid #b9aa92;background:#fbf7ef}
    .specimen-item a{display:block}
    .specimen-item img{display:block;width:100%;aspect-ratio:4/3;object-fit:contain;background:#e5dccb}
    .specimen-meta{padding:8px 9px 9px;border-top:1px solid #b9aa92}
    .specimen-role{font:700 7px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8b2319}
    .specimen-caption{margin-top:4px;font:9px/1.35 Georgia,'Times New Roman',serif;color:#1d1712}
    .specimen-source{margin-top:5px;font:7px/1.3 Arial,Helvetica,sans-serif;color:#766a5b}
    .specimen-status{margin-top:5px;font:700 6px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase}
    .specimen-status.cleared{color:#48634d}
    .specimen-status.reference{color:#8b2319}
    .specimen-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:8px}
    .specimen-fact{padding:7px 8px;border-top:1px solid #d0c2aa;background:#f2ebde}
    .specimen-fact-label{font:700 6px Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#766a5b}
    .specimen-fact-value{margin-top:3px;font:8px/1.35 Arial,Helvetica,sans-serif;color:#1d1712}
    .card-specimen-count{display:block;margin-top:7px;color:#766a5b;font:700 7px Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase}
    @media(max-width:640px){.specimen-gallery{grid-template-columns:1fr 1fr}.specimen-item img{aspect-ratio:1/1}.specimen-facts{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const buildUrl=(title,extra='')=>`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${title} ${extra} guitar pedal vintage`)}`;
  const specs=()=>Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  const forTitle=title=>specs().filter(s=>s.title===title);
  const fact=(label,value)=>value?`<div class="specimen-fact"><div class="specimen-fact-label">${esc(label)}</div><div class="specimen-fact-value">${esc(value)}</div></div>`:'';

  function addCardSpecimens(){
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.card-specimen-count')) return;
      const title=card.querySelector('h3')?.textContent?.trim();
      if(!title) return;
      const list=forTitle(title);
      if(!list.length) return;
      const body=card.querySelector('.pedal-body')||card;
      const el=document.createElement('div');
      el.className='card-specimen-count';
      el.textContent=`${list.length} visual specimen${list.length===1?'':'s'} indexed`;
      body.appendChild(el);
    });
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
      const electronics=s.electronics||{};
      const facts=[fact('Appearance',s.appearance),fact('Variant',s.variant),fact('Electronics',electronics.semiconductor_family),fact('Circuit note',electronics.notes) ].join('');
      return `<figure class="specimen-item"><a href="${esc(s.src)}" target="_blank" rel="noopener"><img src="${esc(s.src)}" alt="${esc(title)} ${esc(s.role||'specimen')} photograph" loading="lazy" referrerpolicy="no-referrer"></a><figcaption class="specimen-meta"><div class="specimen-role">${esc(s.role||'Specimen')}${s.era?` · ${esc(s.era)}`:''}</div><div class="specimen-caption">${esc(s.caption||'Visual identification specimen.')}</div>${facts?`<div class="specimen-facts">${facts}</div>`:''}<div class="specimen-source"><a href="${esc(s.page||s.src)}" target="_blank" rel="noopener">Source / file page ↗</a><br>${esc(s.credit||'Source credit recorded in registry.')}</div><div class="specimen-status ${cls}">${status==='cleared'?'Rights status: cleared for Archive use':'Rights status: external reference only'}</div></figcaption></figure>`;
    }).join('')}</div>`:'';

    const strip=document.createElement('div');
    strip.className='specimen-strip';
    strip.innerHTML=`<div class="specimen-kicker">Visual specimen index</div><p>${list.length?`This page currently indexes ${list.length} documented visual specimen${list.length===1?'':'s'}. A specimen may document appearance without implying an electronics change. Where evidence supports a circuit or component distinction, it is recorded separately.`:'No independently registered specimen image yet. External searches provide a visual reference doorway until a source is documented and rights-reviewed.'}</p>${gallery}<div class="specimen-links"><a href="${buildUrl(title,'front')}" target="_blank" rel="noopener">Front examples ↗</a><a href="${buildUrl(title,'vintage')}" target="_blank" rel="noopener">Vintage examples ↗</a><a href="${buildUrl(title,'variant')}" target="_blank" rel="noopener">Variants ↗</a><a href="${buildUrl(title,'inside electronics components')}" target="_blank" rel="noopener">Component references ↗</a></div><div class="specimen-plate-note">Identification workflow: compare enclosure shape, graphics, controls, labeling and production era first. Then compare documented generation, OEM identity and electronics evidence. Color alone never establishes a circuit variant.</div>`;
    card.appendChild(strip);
  }

  function decorate(){addCardSpecimens();addBlock();}
  new MutationObserver(()=>setTimeout(decorate,20)).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,50));
  window.addEventListener('load',()=>setTimeout(decorate,120));
  setTimeout(decorate,220);
})();
