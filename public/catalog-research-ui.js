(() => {
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const researchFor=p=>p?.archive_research||null;
  const researchLabel=p=>{const r=researchFor(p);return r?.status?.toLowerCase().includes('verified')?'RESEARCH VERIFIED':r?'RESEARCHED':'DISCOVERY'};
  const researchBadge=p=>`<span class="research-badge">${researchLabel(p)}</span>`;
  const researchStatus=p=>{const r=researchFor(p);return `<div class="research-status">${researchBadge(p)}<span>${r?.sources?.length||0} linked sources · ${r?.generations?.length||0} documented generations</span></div>`};

  const targetForCard=card=>{
    const id=card?.dataset?.pedalId;
    const title=card?.querySelector('h3')?.textContent?.trim();
    return (DATA.pedals||[]).find(p=>id&&String(p.pedal_id)===String(id))||(DATA.pedals||[]).find(p=>title&&String(p.model_name||'').trim()===title)||null;
  };

  const ensureCardBadges=()=>{
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('.research-badge')) return;
      const body=card.querySelector('.pedal-body');
      if(!body) return;
      const target=targetForCard(card);
      body.insertAdjacentHTML('beforeend',researchBadge(target));
    });
  };

  const ensurePageStatus=()=>{
    const key=decodeURIComponent(location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).slice(1,2)[0]||'');
    if(!key) return;
    const target=(DATA.pedals||[]).find(p=>String(p.pedal_id)===key)||(DATA.pedals||[]).find(p=>String(p.model_name||'')===key);
    const detail=document.querySelector('.detail-head');
    if(detail&&target&&!detail.querySelector('.research-status'))detail.insertAdjacentHTML('beforeend',researchStatus(target));
  };

  let pageAttempts=0;
  let pageTimer=null;
  const settle=()=>{
    ensureCardBadges();
    ensurePageStatus();
    const cards=document.querySelectorAll('.pedal-card').length;
    const pedal=location.hash.toLowerCase().includes('/pedal/');
    if(cards||pedal){pageAttempts=0;pageTimer=null;return;}
    if(pageAttempts>=30){pageAttempts=0;pageTimer=null;return;}
    pageAttempts+=1;
    pageTimer=setTimeout(settle,100);
  };

  const schedule=()=>{
    pageAttempts=0;
    if(pageTimer)clearTimeout(pageTimer);
    settle();
  };

  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('dirtarchive:runtime-ready',schedule);
  schedule();

  window.DIRT_RESEARCH_UI={ensureCardBadges,ensurePageStatus,schedule};
})();
