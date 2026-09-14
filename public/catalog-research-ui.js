(() => {
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function decorate(){
    const data=window.DATA||null;
    if(!data?.pedals)return;
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.research-badge'))return;
      const id=card.getAttribute('data-pedal-id');
      const title=card.querySelector('h3')?.textContent?.trim();
      const p=data.pedals.find(x=>(id&&String(x.pedal_id)===String(id))||String(x.model_name||'').trim()===title);
      if(!p)return;
      const r=p.archive_research;
      const label=r?.status?.toLowerCase().includes('verified')?'RESEARCH VERIFIED':r?'RESEARCHED':'DISCOVERY';
      const badge=document.createElement('span');
      badge.className='research-badge';
      badge.textContent=label;
      card.querySelector('.pedal-body')?.appendChild(badge);
    });
    const detail=document.querySelector('.detail-head');
    if(detail&&!detail.querySelector('.research-status')){
      const hash=location.hash.replace(/^#\/?/,'').split('/');
      if(hash[0]==='pedal'&&hash[1]){
        const p=data.pedals.find(x=>String(x.pedal_id)===decodeURIComponent(hash[1])||String(x.model_name||'')===decodeURIComponent(hash[1]));
        if(p){
          const r=p.archive_research;
          const row=document.createElement('div');
          row.className='research-status';
          row.innerHTML=`<span class="research-badge">${esc(r?'RESEARCH DOSSIER':'DISCOVERY RECORD')}</span><span>${r?.sources?.length||0} linked sources · ${r?.generations?.length||0} documented generations</span>`;
          detail.appendChild(row);
        }
      }
    }
  }
  const observer=new MutationObserver(decorate);
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,20));
  window.addEventListener('load',()=>setTimeout(decorate,50));
})();
