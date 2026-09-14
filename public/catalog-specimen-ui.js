(() => {
  const style=document.createElement('style');
  style.textContent=`
    .specimen-strip{margin-top:12px;border-top:3px double #1d1712;padding-top:12px}
    .specimen-kicker{font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#8b2319;margin-bottom:7px}
    .specimen-strip p{margin:0 0 10px;color:#766a5b;font:10px/1.45 Arial,Helvetica,sans-serif}
    .specimen-links{display:flex;flex-wrap:wrap;gap:7px}
    .specimen-links a{display:inline-flex;align-items:center;padding:7px 9px;border:1px solid #b9aa92;background:#fbf7ef;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase}
    .specimen-links a:hover{background:#1d1712;color:#fbf7ef;border-color:#1d1712}
    .specimen-label{display:inline-block;margin-left:7px;padding:3px 5px;border:1px solid #b9aa92;color:#766a5b;font:700 6px Arial,Helvetica,sans-serif;letter-spacing:.1em}
    .specimen-plate-note{margin-top:10px;padding-top:10px;border-top:1px dotted #b9aa92;color:#766a5b;font:8px/1.45 Arial,Helvetica,sans-serif}
  `;
  document.head.appendChild(style);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const buildUrl=(title,extra='')=>`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${title} ${extra} guitar pedal vintage`)}`;
  function addBlock(){
    const layout=document.querySelector('.detail-layout');
    const heading=document.querySelector('.detail-title');
    if(!layout||!heading||layout.querySelector('.specimen-strip')) return;
    const title=heading.textContent.trim();
    const card=layout.querySelector('.plate');
    if(!card) return;
    const strip=document.createElement('div');
    strip.className='specimen-strip';
    strip.innerHTML=`<div class="specimen-kicker">Visual specimen index</div><p>Use these external references to compare enclosure shape, graphics, controls, treadle hardware and known production variants. External photographs are identification aids, not automatically cleared archive assets.</p><div class="specimen-links"><a href="${buildUrl(title,'front')}" target="_blank" rel="noopener">Front examples ↗</a><a href="${buildUrl(title,'vintage')}" target="_blank" rel="noopener">Vintage examples ↗</a><a href="${buildUrl(title,'variant')}" target="_blank" rel="noopener">Variants ↗</a></div><div class="specimen-plate-note">Rights status: external reference only. Republishing requires an independently cleared image source.</div>`;
    card.appendChild(strip);
  }
  function decorate(){addBlock();}
  new MutationObserver(decorate).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,30));
  window.addEventListener('load',()=>setTimeout(decorate,100));
  setTimeout(decorate,200);
})();
