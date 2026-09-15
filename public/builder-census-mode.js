(()=>{
  const run=()=>{
    if(!window.DATA||!Array.isArray(DATA.builders)) return setTimeout(run,150);
    const app=document.getElementById('app'); if(!app) return;
    const dirt=(DATA.pedals||[]).filter(p=>['Fuzz','Overdrive','Distortion'].includes(p.primary_category));
    const countFor=b=>(b.dirt_count??dirt.filter(p=>p.primary_builder_id===b.builder_id).length);
    const builderHref=b=>`#/builder/${encodeURIComponent(b.name)}`;
    window.renderBuilderCensus=()=>{
      const rows=[...DATA.builders].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
      app.innerHTML=`<a class="eyebrow" href="#/">← Home</a>
      <section class="directory-head"><div class="eyebrow">THE DIRT ARCHIVE · BUILDER CENSUS</div><div class="detail-title">Builders</div>
      <p class="subhead">The people, companies, workshops and historical names that made dirt devices. This index is intentionally builder-first. Individual pedal catalogs can be expanded beneath each builder.</p>
      <div class="research-status"><span class="research-badge">BUILDER-FIRST MODE</span><span>${rows.length} builder records</span><span>${dirt.length} currently promoted dirt records</span></div></section>
      <div class="builder-census-grid">${rows.map((b,i)=>{const n=countFor(b);return `<a class="builder-feature" href="${builderHref(b)}"><div><div class="eyebrow">${String(i+1).padStart(3,'0')}</div><h2>${escText(b.name||'Unnamed builder')}</h2><p>${escText(b.description||b.notes||'Historical builder record. Pedal catalog pending or expanding.')}</p><div class="detail-meta"><span class="pill">${escText(b.country||b.region||'Origin unknown')}</span><span class="pill">${escText(b.status||'Research record')}</span></div></div><div class="statbox"><span class="n">${n}</span><span class="l">dirt records now</span></div></a>`}).join('')}</div>`;
    };
    function escText(v){return String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
    window.DIRT_BUILDER_CENSUS_READY=true;
    if(location.hash.replace(/^#\\/?/,'').split('/').filter(Boolean)[0]==='builders') window.renderBuilderCensus();
  };
  run();
})();
