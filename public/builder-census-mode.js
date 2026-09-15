(()=>{
  const run=()=>{
    if(!window.DATA||!Array.isArray(DATA.builders)) return setTimeout(run,150);
    const app=document.getElementById('app'); if(!app) return;
    const dirt=(DATA.pedals||[]).filter(p=>['Fuzz','Overdrive','Distortion'].includes(p.primary_category));
    const countFor=b=>(b.dirt_count??dirt.filter(p=>p.primary_builder_id===b.builder_id).length);
    const escText=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
    const builderHref=b=>`#/builder/${encodeURIComponent(b.name)}`;
    window.renderBuilderCensus=()=>{
      const rows=[...DATA.builders].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
      app.innerHTML=`<a class="eyebrow" href="#/">← Home</a>
      <section class="directory-head"><div class="eyebrow">THE DIRT ARCHIVE · BUILDER CENSUS</div><div class="detail-title">Builders</div>
      <p class="subhead">The people, companies, workshops and historical names that made dirt devices. This index is intentionally builder-first. Individual pedal catalogs can be expanded beneath each builder.</p>
      <div class="research-status"><span class="research-badge">BUILDER-FIRST MODE</span><span>${rows.length} builder records</span><span>${dirt.length} currently promoted dirt records</span></div></section>
      <div class="builder-census-grid">${rows.map((b,i)=>{const n=countFor(b);return `<a class="builder-feature" href="${builderHref(b)}"><div><div class="eyebrow">${String(i+1).padStart(3,'0')}</div><h2>${escText(b.name||'Unnamed builder')}</h2><p>${escText(b.description||b.notes||'Historical builder record. Pedal catalog pending or expanding.')}</p><div class="detail-meta"><span class="pill">${escText(b.country||b.region||'Origin unknown')}</span><span class="pill">${escText(b.status||'Research record')}</span></div></div><div class="statbox"><span class="n">${n}</span><span class="l">dirt records now</span></div></a>`}).join('')}</div>`;
    };
    const originalHome=window.home;
    window.home=()=>{
      const rows=[...DATA.builders].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''))).slice(0,24);
      const recent=['Old Zoo Lion Meat','Wah-ocTo-Fuzz','Arabica','Limited Edition Fluff Drive','Bearded Vulture'].map(n=>DATA.pedals.find(p=>p.model_name===n)).filter(Boolean);
      app.innerHTML=`<section class="hero"><div><div class="eyebrow">FOUNDING COLLECTION · DIRT</div><h1>Document<br>the dirt.</h1><p class="hero-copy">An independent reference project for <strong>overdrive, distortion and fuzz</strong>. Browse the builders first, then descend into the pedals.</p><div class="catalog-callout"><div class="callout"><span class="num">${DATA.builders.length}</span><span class="label">builder records</span></div><div class="callout"><span class="num">${dirt.length}</span><span class="label">dirt records</span></div><div class="callout"><span class="num">${(DATA.generations||[]).length}</span><span class="label">structured generations</span></div></div></div><aside class="hero-side"><div class="big">01</div><div class="label">Founding issue</div><div class="big" style="margin-top:25px;font-size:62px">${(DATA.sources||[]).length}</div><div class="label">source records</div></aside></section><section class="section"><div class="section-head"><h2>Builder census</h2><div class="section-note">The builder is the front door</div></div><div class="builder-grid">${rows.map(b=>{const n=countFor(b);return `<a class="builder-card" href="${builderHref(b)}"><div class="name">${escText(b.name||'Unnamed builder')}</div><div class="meta">${n} dirt record${n===1?'':'s'} · ${escText(b.country||b.region||'origin not established')}</div></a>`}).join('')}</div><div style="margin-top:17px"><a class="eyebrow" href="#/builders">View the complete builder index →</a></div></section><section class="section"><div class="section-head"><h2>Recently added / updated</h2><div class="section-note">Latest five archive changes</div></div><div class="pedal-grid">${recent.map(pedalCard).join('')||'<div class="empty">Recent archive activity will appear here.</div>'}</div></section><section class="section"><div class="editorial-grid"><div class="paper-box"><h3>Browse the dirt</h3><p>Start with the kind of dirt you want to explore.</p><div class="link-list"><a href="#/builders">Builders →</a><a href="#/category/fuzz">Fuzz →</a><a href="#/category/overdrive">Overdrive →</a><a href="#/category/distortion">Distortion →</a></div></div><div class="paper-box"><h3>Document the object, not the recipe.</h3><p>Meaningful technical distinctions may be recorded when they help identify a production period. The archive does not publish schematics, PCB layouts, gutshot libraries, complete bills of materials or cloning instructions.</p></div></div></section>`;
    };
    window.DIRT_BUILDER_CENSUS_READY=true;
    setTimeout(()=>{const page=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean)[0];if(page==='builders')window.renderBuilderCensus();else if(!page)window.home()},50);
  };
  run();
})();
