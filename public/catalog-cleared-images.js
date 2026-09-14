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
    'BOSS OD-1 OverDrive': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/BOSS_OD-1.jpg',
      page:'https://commons.wikimedia.org/wiki/File:BOSS_OD-1.jpg',
      credit:'zynke · CC BY 2.0'
    },
    'BOSS SD-1 Super OverDrive': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss_SD-1_Super_Overdrive.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss_SD-1_Super_Overdrive.jpg',
      credit:'Kuriosatempel · CC BY-SA 4.0; photo credited on Commons to Johan Rosén'
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
    },
    'TS808 Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_TS808_Tube_Screamer_%2848588080527%29_cropped.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_TS808_Tube_Screamer_%2848588080527%29_%28cropped%29.jpg',
      credit:'Guitar Chalk · CC BY 2.0'
    },
    'Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_TS808_Tube_Screamer_%2848588080527%29_cropped.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_TS808_Tube_Screamer_%2848588080527%29_%28cropped%29.jpg',
      credit:'Guitar Chalk · CC BY 2.0'
    },
    'Big Muff Pi': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Electro_Harmonix_Big_Muff.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Electro_Harmonix_Big_Muff.jpg',
      credit:'Skimel · CC BY-SA 4.0'
    },
    'RAT': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Proco-rat.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Proco-rat.jpg',
      credit:'Jazzman · Wikimedia Commons · see file page for license'
    },
    'Fuzz Face': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dallas_Arbiter_Fuzz_Face.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Dallas_Arbiter_Fuzz_Face.jpg',
      credit:'sploshette · CC BY 2.0'
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
