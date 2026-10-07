function obsCanonicalFacet(record,group){
  const raw=Array.isArray(record?.[group])?record[group]:[];
  const out=new Set();
  for(const value of raw){
    const text=String(value||'').toLowerCase();
    if(group==='transistor'){
      if(/germanium|\bgerm\b/.test(text))out.add('Germ');
      else if(/silicon|\bsili\b|\bsi\b/.test(text))out.add('Sili');
      else if(/jfet|mosfet|op.?amp|integrated|\bic\b/.test(text))out.add('IC');
    }else if(group==='clipping'){
      if(/germanium|\bgerm\b/.test(text))out.add('Germ');
      else if(/silicon|\bsili\b|\bsi\b/.test(text))out.add('Sili');
      else out.add('Other');
    }
  }
  return [...out];
}

function obsPercent(value,total){
  return total ? (value/total*100).toFixed(1)+'%' : '0.0%';
}

function obsMetric(label,value,detail){
  return '<article class="obsMetric"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong><small>'+esc(detail)+'</small></article>';
}

function renderObservatory(data,facets){
  const items=(data.pedals||[]).filter(isCatalogEntry);
  const records=facets?.records||{};
  const builderSet=new Set(items.map(item=>item.company));
  const pictured=items.filter(isLocalArchiveImage).length;
  const deep=items.filter(item=>String(item.research_level||'').toLowerCase()==='deep').length;
  const withResearch=items.filter(item=>item.research_record).length;
  const withTech=items.filter(item=>{
    const r=records[entryKey(item)]||{};
    return ['transistor','clipping','power'].some(group=>Array.isArray(r[group])&&r[group].length);
  }).length;
  const versioned=items.filter(item=>item.version_of).length;
  const parents=new Set(items.filter(item=>item.version_of).map(item=>item.version_of));
  const families=items.filter(item=>!item.version_of&&items.some(child=>child.version_of===entryKey(item))).length;

  $('observatoryMetrics').innerHTML=[
    obsMetric('Pedal records',items.length.toLocaleString(),'canonical public records'),
    obsMetric('Builders',builderSet.size.toLocaleString(),'indexed makers'),
    obsMetric('Exact photos',pictured.toLocaleString(),obsPercent(pictured,items.length)+' of records'),
    obsMetric('Deep research',deep.toLocaleString(),obsPercent(deep,items.length)+' of records'),
    obsMetric('Structured tech',withTech.toLocaleString(),obsPercent(withTech,items.length)+' of records'),
    obsMetric('Versioned records',versioned.toLocaleString(),parents.size.toLocaleString()+' parent links')
  ].join('');

  const dirtCounts={Overdrive:0,Distortion:0,Fuzz:0};
  items.forEach(item=>(item.types||[]).forEach(type=>{if(type in dirtCounts)dirtCounts[type]++}));
  const totalTypes=Object.values(dirtCounts).reduce((a,b)=>a+b,0)||1;
  $('dirtMixGrid').innerHTML=Object.entries(dirtCounts).map(([label,count])=>
    '<a class="dirtMixItem" href="./index.html?type='+encodeURIComponent(label)+'"><div class="dirtMixTop"><strong>'+esc(label)+'</strong><span>'+count.toLocaleString()+'</span></div><div class="dirtMixTrack"><i style="width:'+((count/totalTypes)*100).toFixed(2)+'%"></i></div><small>'+obsPercent(count,items.length)+' of canonical records</small></a>'
  ).join('');

  const health=[
    ['Deep research',deep,items.length],
    ['Research records',withResearch,items.length],
    ['Exact photography',pictured,items.length],
    ['Structured technical data',withTech,items.length]
  ];
  $('healthGaugeGrid').innerHTML=health.map(([label,count,total])=>{
    const pct=total?count/total*100:0;
    return '<article class="healthGauge"><div class="gauge" style="--p:'+pct.toFixed(2)+'%"><strong>'+pct.toFixed(1)+'%</strong></div><div><span>'+esc(label)+'</span><small>'+count.toLocaleString()+' of '+total.toLocaleString()+'</small></div></article>';
  }).join('');

  const techRows=[
    ['Transistor','Germ','Germ'],
    ['Transistor','Sili','Sili'],
    ['Transistor','IC','IC'],
    ['Clipping','Germ','Germ'],
    ['Clipping','Sili','Sili'],
    ['Clipping','Other','Other']
  ];
  $('techMatrix').innerHTML=techRows.map(([group,label,value])=>{
    const count=items.filter(item=>obsCanonicalFacet(records[entryKey(item)]||{},group.toLowerCase()).includes(value)).length;
    const href='./index.html?'+(group==='Transistor'?'transistor':'clipping')+'='+encodeURIComponent(value);
    return '<a class="techRow" href="'+href+'"><span><b>'+esc(group)+'</b>'+esc(label)+'</span><strong>'+count.toLocaleString()+'</strong></a>';
  }).join('');

  const builderMap=new Map();
  items.forEach(item=>{
    const current=builderMap.get(item.company)||{count:0,photo:0,research:0,types:new Set()};
    current.count++;
    if(isLocalArchiveImage(item))current.photo++;
    if(String(item.research_level||'').toLowerCase()==='deep')current.research++;
    (item.types||[]).forEach(type=>current.types.add(type));
    builderMap.set(item.company,current);
  });
  const builders=[...builderMap.entries()].sort((a,b)=>b[1].count-a[1].count||a[0].localeCompare(b[0])).slice(0,16);
  const maxBuilder=builders[0]?.[1].count||1;
  $('builderSignalTable').innerHTML='<div class="builderTableHead"><span>Builder</span><span>Records</span><span>Photos</span><span>Deep research</span><span>Families</span></div>'+
    builders.map(([name,stats])=>{
      const familyCount=items.filter(item=>item.company===name&&!item.version_of&&items.some(child=>child.version_of===entryKey(item))).length;
      const bar=(stats.count/maxBuilder*100).toFixed(2);
      const href='./builder.html?builder='+encodeURIComponent(name);
      return '<a class="builderSignalRow" href="'+href+'"><span class="builderNameObs"><b>'+esc(name)+'</b><i style="width:'+bar+'%"></i><small>'+esc([...stats.types].join(' · '))+'</small></span><strong>'+stats.count.toLocaleString()+'</strong><span>'+stats.photo.toLocaleString()+'</span><span>'+stats.research.toLocaleString()+'</span><span>'+familyCount.toLocaleString()+'</span></a>';
    }).join('');

  const familyByBuilder=new Map();
  items.filter(item=>item.version_of).forEach(item=>{
    familyByBuilder.set(item.company,(familyByBuilder.get(item.company)||0)+1);
  });
  const familyLeaders=[...familyByBuilder.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
  const totalFamilyRecords=versioned;
  $('familyStats').innerHTML='<div class="familyStatLead"><strong>'+families.toLocaleString()+'</strong><span>documented parent records with connected versions</span></div><div class="familyStatLead"><strong>'+totalFamilyRecords.toLocaleString()+'</strong><span>canonical records carrying version ancestry</span></div><div class="familyLeaderList">'+familyLeaders.map(([name,count])=>'<a href="./builder.html?builder='+encodeURIComponent(name)+'"><span>'+esc(name)+'</span><strong>'+count.toLocaleString()+'</strong></a>').join('')+'</div>';

  renderPatternScanner(items,records);
}
function obsTechnicalGroups(item,records){
  const r=records[entryKey(item)]||{};
  const groups={};
  for(const group of ['transistor','clipping','power']){
    const values=Array.isArray(r[group])?r[group].map(v=>String(v||'').trim()).filter(Boolean):[];
    if(values.length)groups[group]=[...new Set(values)];
  }
  return groups;
}
function obsTechnicalSignature(item,records){
  const groups=obsTechnicalGroups(item,records);
  const ordered=['transistor','clipping','power'].filter(group=>groups[group]?.length);
  if(!ordered.length)return null;
  const key=ordered.map(group=>group+'='+groups[group].map(v=>v.toLowerCase()).sort().join('|')).join('||');
  const label=ordered.map(group=>group[0].toUpperCase()+group.slice(1)+': '+groups[group].join(' · ')).join(' / ');
  return {key,label,groups};
}
function obsSignatureDelta(parent,child,records){
  const a=obsTechnicalGroups(parent,records),b=obsTechnicalGroups(child,records);
  const changed=[];
  for(const group of ['transistor','clipping','power']){
    const left=(a[group]||[]).map(v=>v.toLowerCase()).sort().join('|');
    const right=(b[group]||[]).map(v=>v.toLowerCase()).sort().join('|');
    if(left!==right && left && right)changed.push(group);
  }
  return changed;
}
function obsDetailHref(item){
  return './pedal-detail.html?builder='+encodeURIComponent(item.company)+'&pedal='+encodeURIComponent(item.pedal);
}
function renderPatternScanner(items,records){
  const root=$('patternGrid');
  if(!root)return;
  const signatures=new Map();
  for(const item of items){
    const sig=obsTechnicalSignature(item,records);
    if(!sig)continue;
    const current=signatures.get(sig.key)||{label:sig.label,count:0,builders:new Set(),items:[]};
    current.count++;
    current.builders.add(item.company);
    if(current.items.length<6)current.items.push(item);
    signatures.set(sig.key,current);
  }
  const recurring=[...signatures.values()]
    .filter(x=>x.count>=2&&x.builders.size>=2)
    .sort((a,b)=>b.count-a.count||b.builders.size-a.builders.size||a.label.localeCompare(b.label))
    .slice(0,6);
  const rare=[...signatures.values()]
    .filter(x=>x.count===1&&Object.keys(obsTechnicalGroups(x.items[0],records)).length>=2)
    .sort((a,b)=>a.label.localeCompare(b.label))
    .slice(0,6);

  const byKey=new Map(items.map(item=>[entryKey(item),item]));
  const familyChanges=[];
  for(const child of items){
    if(!child.version_of)continue;
    const parent=byKey.get(child.version_of);
    if(!parent)continue;
    const changed=obsSignatureDelta(parent,child,records);
    if(changed.length)familyChanges.push({parent,child,changed});
  }
  familyChanges.sort((a,b)=>b.changed.length-a.changed.length||a.parent.company.localeCompare(b.parent.company)||a.parent.pedal.localeCompare(b.parent.pedal));

  const recurringHtml=recurring.length
    ? recurring.map((x,i)=>'<article class="patternCard"><div class="patternTop"><span class="patternIndex">'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(x.count.toLocaleString())+' records</strong></div><h3>'+esc(x.label)+'</h3><p>Exact documented facet combination recurring across <b>'+esc(x.builders.size.toLocaleString())+'</b> builders. This is a catalog pattern, not a claim that these pedals share the same circuit.</p><div class="patternBuilders">'+[...x.builders].slice(0,5).map(name=>'<span>'+esc(name)+'</span>').join('')+(x.builders.size>5?'<span>+'+(x.builders.size-5)+' more</span>':'')+'</div><div class="patternSpecimens">'+x.items.slice(0,3).map(item=>'<a href="'+obsDetailHref(item)+'">'+esc(item.company)+' · '+esc(item.pedal)+'</a>').join('')+'</div></article>').join('')
    : '<div class="patternEmpty"><strong>No multi-builder recurrence surfaced.</strong><span>The current structured facet data does not contain a repeated cross-builder signature at this threshold.</span></div>';

  const changesHtml=familyChanges.length
    ? familyChanges.slice(0,6).map((x,i)=>'<article class="changeCard"><span class="patternIndex">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+esc(x.parent.company)+' · '+esc(x.parent.pedal)+'</strong><span class="changeArrow">→</span><strong>'+esc(x.child.pedal)+'</strong><small>Documented technical change: '+x.changed.map(group=>esc(group)).join(' · ')+'</small></div></article>').join('')
    : '<div class="patternEmpty"><strong>No documented technical drift found.</strong><span>Version-linked records are present, but no fully documented transistor, clipping, or power-field changes are currently surfaced.</span></div>';

  const rareHtml=rare.length
    ? rare.map((x,i)=>{
        const item=x.items[0];
        return '<a class="rareCard" href="'+obsDetailHref(item)+'"><span class="patternIndex">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+esc(item.pedal)+'</strong><small>'+esc(item.company)+'</small><span>'+esc(x.label)+'</span></div></a>';
      }).join('')
    : '<div class="patternEmpty"><strong>No singleton multi-facet fingerprints.</strong><span>The technical facet vocabulary may simply be broad or sparse.</span></div>';

  root.innerHTML=
    '<section class="patternSection"><div class="patternSectionHead"><div><span class="patternEyebrow">A / recurrence</span><h3>Repeated fingerprints</h3></div><p>Exact combinations of documented transistor, clipping, and power fields that recur across different builders.</p></div><div class="patternCards">'+recurringHtml+'</div></section>'+
    '<section class="patternSection"><div class="patternSectionHead"><div><span class="patternEyebrow">B / lineage</span><h3>Technical drift across versions</h3></div><p>Parent → version pairs where documented technical fields change. Missing evidence is not treated as a change.</p></div><div class="changeCards">'+changesHtml+'</div></section>'+
    '<section class="patternSection"><div class="patternSectionHead"><div><span class="patternEyebrow">C / rarity</span><h3>Singleton fingerprints</h3></div><p>One-off multi-facet combinations worth opening as research specimens.</p></div><div class="rareCards">'+rareHtml+'</div></section>';
}

function bootObservatory(){
  if(typeof loadCatalog!=='function'||typeof loadFacets!=='function'){
    window.setTimeout(bootObservatory,25);
    return;
  }
  Promise.all([loadCatalog(),loadFacets()])
    .then(([data,facets])=>renderObservatory(data,facets))
    .catch(error=>{
      const target=document.getElementById('observatoryMetrics');
      if(target)target.innerHTML='<div class="empty"><strong>Observatory unavailable</strong><p>The canonical archive could not be loaded.</p></div>';
      console.error(error);
    });
}
bootObservatory();