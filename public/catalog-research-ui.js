(() => {
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const researchFor=p=>p?.archive_research||null;
  const researchLabel=p=>{const r=researchFor(p);return r?.status?.toLowerCase().includes('verified')?'RESEARCH VERIFIED':r?'RESEARCHED':'DISCOVERY'};
  const researchBadge=p=>`<span class="research-badge">${researchLabel(p)}</span>`;
  const researchStatus=p=>{const r=researchFor(p);return `<div class="research-status">${researchBadge(p)}<span>${r?.sources?.length||0} linked sources · ${r?.generations?.length||0} documented generations</span></div>`};

  if(typeof pedalCard==='function'&&!window.__dirtArchiveResearchCardWrapped){
    const originalPedalCard=pedalCard;
    window.__dirtArchiveResearchCardWrapped=true;
    pedalCard=function(p){
      const html=originalPedalCard(p);
      const badge=researchBadge(p);
      return html.replace(/(<div class="pedal-body">[\s\S]*?)(<\/div><\/a>)$/,`$1${badge}$2`);
    };
  }

  if(typeof pedalPage==='function'&&!window.__dirtArchiveResearchPageWrapped){
    const originalPedalPage=pedalPage;
    window.__dirtArchiveResearchPageWrapped=true;
    pedalPage=function(key){
      const result=originalPedalPage(key);
      const target=(DATA.pedals||[]).find(p=>String(p.pedal_id)===String(key))||(DATA.pedals||[]).find(p=>String(p.model_name||'')===String(key));
      const detail=document.querySelector('.detail-head');
      if(detail&&target&&!detail.querySelector('.research-status'))detail.insertAdjacentHTML('beforeend',researchStatus(target));
      return result;
    };
  }
})();
