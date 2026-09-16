(() => {
  const recentNames=['Old Zoo Lion Meat','Wah-ocTo-Fuzz','Arabica','Limited Edition Fluff Drive','Bearded Vulture'];
  const waitForData=()=>{
    if(!Array.isArray(window.DATA?.builders)||!Array.isArray(window.DATA?.pedals)) return setTimeout(waitForData,100);
    const safeHome=()=>{
      const dirt=p=>window.DIRT_CORE?.inDirt?window.DIRT_CORE.inDirt(p):['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
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
      const shelf=(DATA.pedals||[]).filter(dirt).filter(p=>typeof window.imageFor==='function'&&window.imageFor(p)).sort((a,b)=>String(a.model_name).localeCompare(String(b.model_name))).slice(0,8);
      const shelfHtml=shelf.length?`<div class="photo-shelf-grid">${shelf.map(p=>{const im=window.imageFor(p);return `<a class="photo-shelf-card" href="#/pedal/${encodeURIComponent(p.pedal_id)}"><div class="photo-shelf-image"><img src="${esc(im.src)}" alt="${esc(p.model_name)} reference photograph" loading="lazy" referrerpolicy="no-referrer"></div><div class="photo-shelf-caption"><strong>${esc(p.model_name)}</strong><span>${esc(p.primary_category||'Dirt')} · ${esc(yearLabel(p))}</span></div></a>`}).join('')}</div>`:'<div class="empty">Archive-ready photography is being assembled.</div>';
      app.innerHTML=`<section class="hero"><div><div class="eyebrow">FOUNDING COLLECTION · DIRT</div><h1>Document<br>the dirt.</h1><p class="hero-copy">An independent reference project for <strong>overdrive, distortion and fuzz</strong>. Browse the builders, follow the lineage, compare production periods, and figure out which version of the box you own.</p><div class="hero-actions"><a class="hero-action-primary" href="#/identify">Identify a pedal →</a><a class="hero-action-secondary" href="#/photos">Explore the photo desk →</a></div><div class="catalog-callout"><div class="callout"><span class="num">${DATA.builders.length}</span><span class="label">builders represented</span></div><div class="callout"><span class="num">${DATA.pedals.filter(dirt).length}</span><span class="label">dirt records</span></div><div class="callout"><span class="num">${(DATA.generations||[]).length}</span><span class="label">structured generations</span></div></div></div><aside class="hero-side"><div class="big">01</div><div class="label">Founding issue</div><div class="big" style="margin-top:25px;font-size:62px">${(DATA.sources||[]).length}</div><div class="label">source records</div></aside></section><section class="section"><div class="section-head"><h2>Browse the archive</h2><div class="section-note">Choose your way in</div></div><div class="editorial-grid"><a class="paper-box" href="#/builders"><h3>Builders →</h3><p>Companies, designers, workshops and brands behind the dirt.</p><span class="eyebrow">Open builder index</span></a><a class="paper-box" href="#/era"><h3>Eras →</h3><p>Browse the dirt collection by production decade without needing to know the builder first.</p><span class="eyebrow">Open era index</span></a><div class="paper-box"><h3>Categories</h3><p>Explore fuzz, overdrive and distortion independently of manufacturer.</p><div class="link-list"><a href="#/category/fuzz">Fuzz →</a><a href="#/category/overdrive">Overdrive →</a><a href="#/category/distortion">Distortion →</a></div></div><a class="paper-box" href="#/identify"><h3>Identification →</h3><p>Use production periods, generations and physical characteristics to narrow down an unknown pedal.</p><span class="eyebrow">Open the identification desk</span></a></div></section><section class="section"><div class="section-head"><h2>Photo reference shelf</h2><div class="section-note">Archive-ready exterior references</div></section><section class="section"><div class="section-head"><h2>Photo reference shelf</h2><div class="section-note">Archive-ready exterior references</div></div><p class="section-intro">A quick visual doorway into the collection. These photographs are cleared for public display under their recorded source terms. More records join this shelf as the photo research progresses.</p>${shelfHtml}<div style="margin-top:17px"><a class="eyebrow" href="#/photos">Open the full photo desk →</a></div></section><section class="section"><div class="section-head"><h2>Archive highlights</h2><div class="section-note">Selected dirt records</div></div><div class="pedal-grid">${recent.map(pedalCard).join('')||'<div class="empty">Archive records will appear here.</div>'}</div></section><section class="section"><div class="editorial-grid"><a class="paper-box" href="#/identify"><h3>Identify a pedal →</h3><p>Start with the physical clues you can actually see. Narrow the archive by category, builder and era, then compare candidate records.</p><span class="eyebrow">Open the identification desk</span></a><a class="paper-box" href="#/photos"><h3>Build the picture →</h3><p>See which dirt records have archive-ready photography and which generations still need a usable exterior reference.</p><span class="eyebrow">Open the photo desk</span></a><div class="paper-box"><h3>Document the object, not the recipe.</h3><p>Meaningful historical and identification distinctions may be recorded when they help separate production periods. The archive does not publish schematics, PCB layouts, gutshot libraries, complete bills of materials or cloning instructions.</p></div></div></section>`;
    };
    const esc=window.DIRT_CORE?.esc || (v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
    const yearLabel=p=>p.introduced_year?`${p.introduced_year}${p.discontinued_year?`–${p.discontinued_year}`:'–present'}`:'Date unknown';
    const dirt=p=>window.DIRT_CORE?.inDirt?window.DIRT_CORE.inDirt(p):['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
    const eraFor=p=>{const y=Number(p?.introduced_year);if(!Number.isFinite(y))return 'Date not established';const decade=Math.floor(y/10)*10;return `${decade}s`;};
    const renderEra=()=>{
      if(!location.hash.replace(/^#\/?/,'').startsWith('era'))return false;
      const decadeRaw=location.hash.split('/')[2]||'';
      const all=DATA.pedals.filter(dirt);
      const groups=new Map();
      for(const p of all){const era=eraFor(p);if(!groups.has(era))groups.set(era,[]);groups.get(era).push(p)}
      const eras=[...groups.keys()].sort((a,b)=>{if(a==='Date not established')return 1;if(b==='Date not established')return -1;return Number(a.slice(0,4))-Number(b.slice(0,4))});
      const selected=eras.includes(decadeRaw)?decadeRaw:null;
      const records=selected?groups.get(selected).sort((a,b)=>String(a.model_name).localeCompare(String(b.model_name))):[];
      const appNode=document.getElementById('app');
      if(!appNode)return false;
      appNode.innerHTML=`<a class="eyebrow" href="#/">← Home</a><section class="directory-head"><div class="eyebrow">ARCHIVE DIRECTORY</div><div class="detail-title">Eras</div><p class="subhead">Browse the dirt collection by the decade a model entered the catalog. Dating remains provisional where the archive has not established an introduction year.</p></section><section class="section"><div class="section-head"><h2>Production decades</h2><div class="section-note">${all.length} dirt records</div></div><div class="builder-grid">${eras.map(era=>`<a class="builder-card" href="#/era/${encodeURIComponent(era)}"><div class="name">${esc(era)}</div><div class="meta">${groups.get(era).length} dirt record${groups.get(era).length===1?'':'s'}</div></a>`).join('')}</div></section>${selected?`<section class="section"><div class="section-head"><h2>${esc(selected)}</h2><div class="section-note">${records.length} records</div></div><div class="pedal-grid">${records.map(pedalCard).join('')}</div></section>`:'<section class="section"><div class="empty">Choose a production decade above to browse its dirt records.</div></section>'}`;
      return true;
    };
    const ensureEraNav=()=>{const nav=document.querySelector('.main-nav');if(!nav||nav.querySelector('[data-era-nav]'))return;const a=document.createElement('a');a.href='#/era';a.dataset.eraNav='';a.textContent='Eras';nav.insertBefore(a,nav.querySelector('a[href="#/identify"]')||null)};
    ensureEraNav();
    if(!location.hash.replace(/^#\/?/,'').split('/').filter(Boolean)[0]) safeHome();
    if(!location.hash.replace(/^#\/?/,'').split('/').filter(Boolean)[0]&&document.getElementById('app')) safeHome();
    renderEra();
  };
  window.addEventListener('hashchange',()=>setTimeout(()=>{ensureEraNav();if(renderEra())return;const page=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean)[0];if(!page&&Array.isArray(window.DATA?.pedals))safeHome();},35));
  waitForData();
})();
