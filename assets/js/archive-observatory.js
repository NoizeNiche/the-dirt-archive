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
}

Promise.all([loadCatalog(),loadFacets()]).then(([data,facets])=>renderObservatory(data,facets)).catch(error=>{
  document.getElementById('observatoryMetrics').innerHTML='<div class="empty"><strong>Observatory unavailable</strong><p>The canonical archive could not be loaded.</p></div>';
  console.error(error);
});