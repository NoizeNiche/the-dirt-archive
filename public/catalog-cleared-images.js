(() => {
  const images = {
    'Colorsound Supa Tonebender': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png',
      page:'https://commons.wikimedia.org/wiki/File:Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png',
      credit:'Wikimedia Commons · licensed image, see file page'
    },
    'MXR M-104 Distortion+': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1979_MXR_Distortion_%2B.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1979_MXR_Distortion_%2B.jpg',
      credit:'Wikimedia Commons · licensed image, see file page'
    },
    'BOSS DS-1 Distortion': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss-DS-1.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss-DS-1.jpg',
      credit:'Matt Eason · CC BY-SA 3.0 / GFDL'
    },
    'Vox Tone Bender': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Vox_Tone_Bender.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Vox_Tone_Bender.jpg',
      credit:'Johann Burkard · CC BY 2.0'
    },
    'Ibanez TS-9 Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_ts9_tube_screamer.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_ts9_tube_screamer.jpg',
      credit:'Mataresephotos · CC BY 3.0 US'
    }
  };
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function decorate(){
    const data=window.DATA||{};
    document.querySelectorAll('.pedal-card').forEach(card=>{
      if(card.querySelector('img')) return;
      const title=card.querySelector('h3')?.textContent?.trim();
      const im=images[title];
      if(!im) return;
      const holder=card.querySelector('.pedal-image');
      if(!holder) return;
      holder.innerHTML=`<img src="${esc(im.src)}" alt="${esc(title)} reference photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;><div><strong>${esc(title)}</strong><small>Reference image unavailable</small></div></div>'">`;
    });

    const heading=document.querySelector('.detail-title');
    const plateImage=document.querySelector('.plate-image');
    if(!heading||!plateImage||plateImage.querySelector('img')) return;
    const im=images[heading.textContent.trim()];
    if(!im) return;
    plateImage.innerHTML=`<img src="${esc(im.src)}" alt="${esc(heading.textContent.trim())} reference photograph" referrerpolicy="no-referrer">`;
    const cap=plateImage.parentElement?.querySelector('.plate-caption');
    if(cap) cap.innerHTML=`<a href="${esc(im.page)}" target="_blank" rel="noopener">Reference image source ↗</a><br>${esc(im.credit)}`;
  }

  const observer=new MutationObserver(()=>setTimeout(decorate,20));
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(decorate,50));
  window.addEventListener('load',()=>setTimeout(decorate,100));
  setTimeout(decorate,180);
})();
