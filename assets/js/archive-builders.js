let builderDirectoryData=[];
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
    return '<a class="builderDirectoryCard" href="'+esc(builderDirectoryUrl(row.name))+'">'+
      '<span class="builderDirectoryName">'+esc(row.name)+'</span>'+
      '<span class="builderDirectoryCounts">'+row.items.length.toLocaleString()+' records · '+families.toLocaleString()+' families · '+photos.toLocaleString()+' exact photos</span>'+
      '<span class="builderDirectoryTypes">'+
        (typeCounts.Overdrive?'OD '+typeCounts.Overdrive:'')+
        (typeCounts.Distortion?' · Dist '+typeCounts.Distortion:'')+
        (typeCounts.Fuzz?' · Fuzz '+typeCounts.Fuzz:'')+
      '</span>'+
    '</a>';
  }).join(''):'<div class="empty"><strong>No builders found</strong><p>Try another builder name.</p></div>';
}
loadCatalog().then(data=>{
  builderDirectoryData=data.pedals||[];
  renderBuilderDirectory();
  document.getElementById('buildersSearch').oninput=renderBuilderDirectory;
}).catch(error=>{
  document.getElementById('buildersMeta').textContent='Builder directory unavailable';
  document.getElementById('buildersGrid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong><p>The archive data could not be loaded.</p></div>';
  console.error(error);
});