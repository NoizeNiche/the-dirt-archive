(() => {
  const recentNames=['Old Zoo Lion Meat','Wah-ocTo-Fuzz','Arabica','Limited Edition Fluff Drive','Bearded Vulture'];
  const waitForData=()=>{
    if(!Array.isArray(window.DATA?.builders)||!Array.isArray(window.DATA?.pedals)) return setTimeout(waitForData,100);
    const safeHome=()=>{
      const dirt=p=>window.DIRT_CORE?.inDirt?window.DIRT_CORE.inDirt(p):['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
      const researchLabel=p=>{const r=p?.archive_research||null;return r?.status?.toLowerCase().includes('verified')?'RESEARCH VERIFIED':r?'RESEARCHED':'DISCOVERY';};
      const researchBadge=p=>`<span class="research-badge">${researchLabel(p)}</span>`;
      const builders=[...DATA.builders].filter(b=>DATA.pedals.some(p=>p.primary_builder_id===b.builder_id&&dirt(p))).sort((a,b)=>String(a.name).localeCompare(String(b.name))).slice(0,24);
      const recent=recentNames.map(name=>DATA.pedals.find(p=>p.model_name===name)).filter(Boolean).slice(0,5);
      if(recent.length<5){
        const seen=new Set(recent.map(p=>p.pedal_id));
        const fallback=DATA.pedals.filter(dirt).filter(p=>!seen.has(p.pedal_id)).slice(-5).reverse();
        for(const p of fallback){
          if(recent.length>=5) break;
          recent.push(p);
        }
      }
      app.innerHTML=`<section class="hero"><div><div class="eyebrow">FOUNDING COLLECTION · DIRT</div><h1>Document<br>the dirt.</h1><p class="hero-copy">An independent reference project for <strong>overdrive, distortion and fuzz</strong>. Browse the builders, follow the lineage, compare production periods, and figure out which version of the box you own.</p><div class="catalog-callout"><div class="callout"><span class="num">${DATA.builders.length}</span><span class="label">builders represented</span></div><div class="callout"><span class="num">${DATA.pedals.filter(dirt).length}</span><span class="label">dirt records</span></div><div class="callout"><span class="num">${(DATA.generations||[]).length}</span><span class="label">structured generations</span></div></div></div><aside class="hero-side"><div class="big">01</div><div class="label">Founding issue</div><div class="big" style="margin-top:25px;font-size:62px">${(DATA.sources||[]).length}</div><div class="label">source records</div></aside></section><section class="section"><div class="section-head"><h2>Browse by builder</h2><div class="section-note">The builder is the front door</div></div><div class="builder-grid">${builders.map(b=>builderCard(b)).join('')}</div><div style="margin-top:17px"><a class="eyebrow" href="#/builders">View the complete builder index →</a></div></section><section class="section"><div class="section-head"><h2>Archive highlights</h2><div class="section-note">Selected dirt records</div></div><div class="pedal-grid">${recent.map(pedalCard).join('')||'<div class="empty">Archive records will appear here.</div>'}</div></section><section class="section"><div class="editorial-grid"><a class="paper-box" href="#/identify"><h3>Identify a pedal →</h3><p>Start with the physical clues you can actually see. Narrow the archive by category, builder and era, then compare candidate records.</p><span class="eyebrow">Open the identification desk</span></a><a class="paper-box" href="#/photos"><h3>Build the picture →</h3><p>See which dirt records have archive-ready photography and which generations still need a usable exterior reference.</p><span class="eyebrow">Open the photo desk</span></a><div class="paper-box"><h3>Document the object, not the recipe.</h3><p>Meaningful historical and identification distinctions may be recorded when they help separate production periods. The archive does not publish schematics, PCB layouts, gutshot libraries, complete bills of materials or cloning instructions.</p></div></div></section>`;
      app.querySelectorAll('.pedal-card').forEach((card,i)=>{
        const p=recent[i];
        if(p&&!card.querySelector('.research-badge')) card.insertAdjacentHTML('beforeend',researchBadge(p));
      });
    };
    if(!document.getElementById('dirtArchiveBackgroundStyle')){
      const style=document.createElement('style');
      style.id='dirtArchiveBackgroundStyle';
      style.textContent=`body{background-color:#efe7d8 !important;background-image:url('dirt-archive-background.svg') !important;background-repeat:no-repeat !important;background-position:center center !important;background-size:cover !important;background-attachment:fixed !important}.site-header{background:rgba(239,231,216,.94) !important}main{background:rgba(239,231,216,.76)}.section,.hero{background:rgba(239,231,216,.2)}@media(max-width:700px){body{background-position:center center !important;background-size:auto 100vh !important}main{background:rgba(239,231,216,.84)}}`;
      document.head.appendChild(style);
    }
    window.home=safeHome;
    window.DIRT_ORIGINAL_HOME=safeHome;
    const page=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean)[0];
    if(!page&&document.getElementById('app')) safeHome();
  };
  waitForData();
})();
