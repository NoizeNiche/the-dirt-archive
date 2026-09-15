(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const searchUrl = p => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${p?.model_name || ''} ${p?.primary_category || ''} guitar pedal vintage photograph`)}`;
  const link = (label,p,extra='') => `<a class="visual-reference${extra}" href="${esc(searchUrl(p))}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

  const style = document.createElement('style');
  style.textContent = `
    .visual-reference{display:inline-flex;align-items:center;gap:7px;margin-top:12px;padding:8px 10px;border:1px solid #b9aa92;background:#fbf7ef;color:#1d1712;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;transition:.15s}
    .visual-reference:hover{background:#1d1712;color:#fbf7ef;border-color:#1d1712}
    .visual-reference-block{margin-top:10px;padding-top:10px;border-top:1px dotted #b9aa92}
    .visual-reference-block small{display:block;margin-top:5px;color:#766a5b;font:8px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.03em}
  `;
  document.head.appendChild(style);

  function wrapCard(){
    if(typeof window.pedalCard !== 'function' || window.__dirtArchiveVisualCardWrapped) return;
    const original = window.pedalCard;
    window.__dirtArchiveVisualCardWrapped = true;
    window.pedalCard = function(p){
      const html = original(p);
      return html.replace('</div></a>', `${link('PHOTO REFERENCES',p)}</div></a>`);
    };
  }

  function wrapPage(){
    if(typeof window.pedalPage !== 'function' || window.__dirtArchiveVisualPageWrapped) return;
    const original = window.pedalPage;
    window.__dirtArchiveVisualPageWrapped = true;
    window.pedalPage = function(key){
      const result = original(key);
      const p = (window.DATA?.pedals || []).find(x => String(x.pedal_id) === String(key))
        || (window.DATA?.pedals || []).find(x => String(x.model_name || '') === String(key));
      const plate = document.querySelector('.plate');
      if(p && plate && !plate.parentElement?.querySelector('.visual-reference-block')){
        const block = document.createElement('div');
        block.className = 'visual-reference-block';
        block.innerHTML = `${link('VIEW PHOTO REFERENCES',p)}<small>External image search only. Reference imagery may be copyrighted and is not automatically cleared for republication.</small>`;
        plate.after(block);
      }
      return result;
    };
  }

  wrapCard();
  wrapPage();
})();
