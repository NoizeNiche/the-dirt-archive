(() => {
  const style = document.createElement('style');
  style.textContent = `
    .visual-reference{display:inline-flex;align-items:center;gap:7px;margin-top:12px;padding:8px 10px;border:1px solid #b9aa92;background:#fbf7ef;color:#1d1712;font:700 8px Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;transition:.15s}
    .visual-reference:hover{background:#1d1712;color:#fbf7ef;border-color:#1d1712}
    .visual-reference-block{margin-top:10px;padding-top:10px;border-top:1px dotted #b9aa92}
    .visual-reference-block small{display:block;margin-top:5px;color:#766a5b;font:8px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.03em}
  `;
  document.head.appendChild(style);

  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const searchUrl = p => {
    const q = encodeURIComponent(`${p.model_name || ''} ${p.primary_category || ''} guitar pedal vintage photograph`);
    return `https://www.google.com/search?tbm=isch&q=${q}`;
  };

  function decorateCards(){
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.visual-reference')) return;
      const title=card.querySelector('h3')?.textContent?.trim();
      if(!title) return;
      const a=document.createElement('a');
      a.className='visual-reference';
      a.href=searchUrl({model_name:title,primary_category:''});
      a.target='_blank';
      a.rel='noopener noreferrer';
      a.textContent='PHOTO REFERENCES ↗';
      a.addEventListener('click',e=>e.stopPropagation());
      card.querySelector('.pedal-body')?.appendChild(a);
    });
  }

  function decorateDetail(){
    const heading=document.querySelector('.detail-title');
    const layout=document.querySelector('.detail-layout');
    if(!heading||!layout||layout.querySelector('.visual-reference-block')) return;
    const card=layout.querySelector('.plate');
    if(!card) return;
    const b=document.querySelector('.detail-head .eyebrow')?.textContent || '';
    const block=document.createElement('div');
    block.className='visual-reference-block';
    block.innerHTML=`<a class="visual-reference" href="${searchUrl({model_name:heading.textContent.trim(),primary_category:b})}" target="_blank" rel="noopener noreferrer">VIEW PHOTO REFERENCES ↗</a><small>External image search only. Reference imagery may be copyrighted and is not automatically cleared for republication.</small>`;
    card.parentElement.appendChild(block);
  }

  function decorate(){decorateCards();decorateDetail();}
  new MutationObserver(decorate).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,30));
  window.addEventListener('load',()=>setTimeout(decorate,90));
  setTimeout(decorate,150);
})();
