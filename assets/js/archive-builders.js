let builderDirectoryData=[]; let builderDirectoryFacets={};
function builderDirectoryUrl(name){const u=new URL('./builder.html',location.href);u.searchParams.set('builder',name);return u.href}
function renderBuilderDirectory(){
  const q=normalizeSearchText(document.getElementById('buildersSearch')?.value||'');
  const map=new Map();
  for(const item of builderDirectoryData){
    if(!isCatalogEntry(item)||!item.company)continue;
    if(!map.has(item.company))map.set(item.company,{name:item.company,items:[],variations:0});
    const row=map.get(item.company);
    row.items.push(item);
  }
  for(const item of builderDirectoryData){
    if(item.catalog_role==='variation'&&item.company&&map.has(item.company))map.get(item.company).variations++;
  }
  const rows=[...map.values()]
    .filter(row=>!q||normalizeSearchText(row.name).includes(q))
    .sort((a,b)=>a.name.localeCompare(b.name));
  const meta=document.getElementById('buildersMeta');
  meta.textContent=rows.length.toLocaleString()+' builder'+(rows.length===1?'':'s')+' represented in the archive';
  document.getElementById('buildersGrid').innerHTML=rows.length?rows.map(row=>{
    const typeCounts={Overdrive:0,Distortion:0,Fuzz:0};
    row.items.forEach(item=>(item.types||[]).forEach(type=>{if(typeCounts[type]!==undefined)typeCounts[type]++}));
    const families=row.items.filter(item=>!item.version_of).length;
    const photos=row.items.filter(isLocalArchiveImage).length;
    const deep=row.items.filter(item=>String(item.research_level||'').toLowerCase()==='deep').length;
    const tech=row.items.filter(item=>{
      const record=builderDirectoryFacets.records?.[entryKey(item)]||{};
      return ['transistor','clipping'].some(group=>Array.isArray(record[group])&&record[group].length);
    }).length;
    const coverage=row.items.length?photos/row.items.length*100:0;
    return '<a class="builderDirectoryCard" href="'+esc(builderDirectoryUrl(row.name))+'">'+
      '<div class="builderDirectoryTop"><span class="builderDirectoryName">'+esc(row.name)+'</span><span class="builderDirectoryArrow">↗</span></div>'+
      '<span class="builderDirectoryCounts">'+row.items.length.toLocaleString()+' records · '+families.toLocaleString()+' families</span>'+
      '<div class="builderDirectoryBars"><span><i style="width:'+coverage.toFixed(1)+'%"></i></span><b>'+photos.toLocaleString()+' photos</b><span><i style="width:'+(row.items.length?deep/row.items.length*100:0).toFixed(1)+'%"></i></span><b>'+deep.toLocaleString()+' deep</b></div>'+
      '<span class="builderDirectoryTypes">'+
        (typeCounts.Overdrive?'OD '+typeCounts.Overdrive:'')+
        (typeCounts.Distortion?' · Dist '+typeCounts.Distortion:'')+
        (typeCounts.Fuzz?' · Fuzz '+typeCounts.Fuzz:'')+
        (tech?' · Tech '+tech:'')+
      '</span>'+
    '</a>';
  }).join(''):'<div class="empty"><strong>No builders found</strong><p>Try another builder name.</p></div>';
}
Promise.all([loadCatalog(),loadFacets()]).then(([data,facets])=>{
  builderDirectoryData=data.pedals||[];
  builderDirectoryFacets=facets||{};
  renderBuilderDirectory();
  document.getElementById('buildersSearch').oninput=renderBuilderDirectory;
}).catch(error=>{
  document.getElementById('buildersMeta').textContent='Builder directory unavailable';
  document.getElementById('buildersGrid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong><p>The archive data could not be loaded.</p></div>';
  console.error(error);
});