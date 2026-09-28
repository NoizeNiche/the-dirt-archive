const builderParams=new URLSearchParams(location.search);
const requestedBuilder=builderParams.get('builder')||'';
const PAGE_SIZE_BUILDER=48;
let builderAll=[],builderItems=[],builderType='All',builderQuery='',builderPage=Math.max(1,parseInt(builderParams.get('page')||'1',10)||1);

function builderDetail(item){
  return detailUrl(item,null,item.types?.[0]||'');
}

function builderFilterUrl(builder){
  const url=new URL('./index.html',location.href);
  url.searchParams.set('builder',builder);
  return url.href;
}

function builderShare(){
  const button=$('shareBuilder');
  if(!button)return;
  const url=location.href;
  let copied=false;
  navigator.share
    ? navigator.share({title:document.title,url}).catch(error=>{if(error?.name!=='AbortError')console.warn('Could not share builder.',error)})
    : Promise.resolve().then(async()=>{
        try{await navigator.clipboard.writeText(url);copied=true}catch{
          const input=document.createElement('textarea');
          input.value=url;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';
          document.body.appendChild(input);input.select();copied=document.execCommand('copy');input.remove();
        }
        const original=button.textContent;button.textContent=copied?'Link copied':'Copy failed';
        setTimeout(()=>button.textContent=original,1400);
      });
}

function builderChildren(item){
  const key=entryKey(item);
  return {
    versions:builderAll.filter(x=>isCatalogEntry(x)&&x.version_of===key),
    variations:builderAll.filter(x=>x.catalog_role==='variation'&&x.parent_pedal===item.pedal)
  };
}

function filteredBuilderItems(){
  const needle=normalizeSearchText(builderQuery);
  return builderItems.filter(item=>{
    const typeOk=builderType==='All'||(item.types||[]).includes(builderType);
    if(!typeOk)return false;
    if(!needle)return true;
    const text=normalizeSearchText([item.pedal,item.version_label,...(item.types||[])].join(' '));
    return text.includes(needle);
  }).sort((a,b)=>{
    const av=(a.pedal||'').localeCompare(b.pedal||'');
    if(av)return av;
    return String(a.version_label||'').localeCompare(String(b.version_label||''));
  });
}

function renderBuilderTypes(items){
  const counts={All:items.length,Overdrive:0,Distortion:0,Fuzz:0};
  items.forEach(item=>(item.types||[]).forEach(type=>{if(type in counts)counts[type]++}));
  const types=['All','Overdrive','Distortion','Fuzz'];
  $('builderTypeToggle').innerHTML=types.map(type=>
    '<button class="builderTypeButton '+(builderType===type?'active':'')+'" type="button" data-builder-type="'+type+'" aria-pressed="'+(builderType===type?'true':'false')+'">'+
      esc(type==='All'?'All':type)+'<span>'+counts[type].toLocaleString()+'</span></button>'
  ).join('');
  document.querySelectorAll('[data-builder-type]').forEach(btn=>btn.onclick=()=>{
    builderType=btn.dataset.builderType;
    builderPage=1;
    syncBuilderUrl();
    renderBuilder();
  });
}

function syncBuilderUrl(){
  const url=new URL(location.href);
  if(builderQuery)url.searchParams.set('q',builderQuery);else url.searchParams.delete('q');
  if(builderType!=='All')url.searchParams.set('type',builderType);else url.searchParams.delete('type');
  if(builderPage>1)url.searchParams.set('page',String(builderPage));else url.searchParams.delete('page');
  history.replaceState({},'',url.href);
}

function renderBuilder(){
  const visible=filteredBuilderItems();
  const totalPages=Math.max(1,Math.ceil(visible.length/PAGE_SIZE_BUILDER));
  if(builderPage>totalPages)builderPage=totalPages;
  const start=(builderPage-1)*PAGE_SIZE_BUILDER;
  const pageItems=visible.slice(start,start+PAGE_SIZE_BUILDER);

  renderBuilderTypes(builderItems);
  $('builderMeta').textContent=visible.length
    ? 'Showing '+(start+1).toLocaleString()+'–'+Math.min(start+PAGE_SIZE_BUILDER,visible.length).toLocaleString()+' of '+visible.length.toLocaleString()+' records'
    : '0 records match this builder view';

  $('builderGrid').innerHTML=pageItems.length?pageItems.map(item=>{
    const img=isLocalArchiveImage(item)?item.image:'';
    const family=builderChildren(item);
    const parent=item.version_of ? builderItems.find(x=>entryKey(x)===item.version_of) : null;
    const familyText=family.versions.length
      ? family.versions.length.toLocaleString()+' version'+(family.versions.length===1?'':'s')
      : parent
        ? 'Part of '+parent.pedal
        : family.variations.length
          ? family.variations.length.toLocaleString()+' edition'+(family.variations.length===1?'':'s')
          : '';
    const media=img
      ? '<img src="'+esc(img)+'" alt="'+esc(item.company+' '+item.pedal)+' pedal" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
      : '<div class="builderCardPlaceholder" aria-label="Exact photo not archived yet">Exact photo not archived yet</div>';
    return '<article class="builderCard">'+
      '<a class="builderCardLink" href="'+esc(builderDetail(item))+'">'+
        '<div class="builderCardMedia">'+media+'</div>'+
        '<div class="builderCardBody">'+
          '<span class="builderCardName">'+esc(item.pedal)+'</span>'+
          (item.version_label?'<span class="builderCardVersion">'+esc(item.version_label)+'</span>':'')+
          '<span class="builderCardTypes">'+esc((item.types||[]).join(' · '))+'</span>'+
          (familyText?'<span class="builderCardFamily">'+esc(familyText)+'</span>':'')+
        '</div>'+
      '</a>'+
      '</article>';
  }).join(''):'<div class="empty"><strong>No catalog records found</strong><p>Try another search or dirt type.</p></div>';

  renderBuilderPagination(totalPages);
}

function renderBuilderPagination(totalPages){
  const nav=$('builderPagination');
  if(totalPages<=1){nav.hidden=true;nav.innerHTML='';return}
  nav.hidden=false;
  const buttons=[];
  const add=(n,label,disabled=false,current=false)=>buttons.push('<button class="pageButton '+(current?'active':'')+'" type="button" data-builder-page="'+n+'" '+(disabled?'disabled ':'')+(current?'aria-current="page"':'')+'>'+label+'</button>');
  add(Math.max(1,builderPage-1),'←',builderPage===1);
  const start=Math.max(1,builderPage-2),end=Math.min(totalPages,builderPage+2);
  for(let n=start;n<=end;n++)add(n,String(n),false,n===builderPage);
  add(Math.min(totalPages,builderPage+1),'→',builderPage===totalPages);
  nav.innerHTML=buttons.join('');
  nav.querySelectorAll('[data-builder-page]').forEach(btn=>btn.onclick=()=>{
    builderPage=Number(btn.dataset.builderPage)||1;
    syncBuilderUrl();
    renderBuilder();
    document.querySelector('.builderHero')?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
}

function renderBuilderStats(){
  const families=builderItems.filter(item=>!item.version_of);
  const versions=builderAll.filter(item=>isCatalogEntry(item)&&item.version_of&&item.company===requestedBuilder);
  const editions=builderAll.filter(item=>item.catalog_role==='variation'&&item.company===requestedBuilder);
  const photos=builderItems.filter(isLocalArchiveImage).length;
  $('statPedals').textContent=builderItems.length.toLocaleString();
  $('statFamilies').textContent=families.length.toLocaleString();
  $('statVersions').textContent=versions.length.toLocaleString();
  $('statEditions').textContent=editions.length.toLocaleString();
  $('statPhotos').textContent=photos.toLocaleString();
}

function renderBuilderHeader(){
  $('builderName').textContent=requestedBuilder;
  $('builderHeadline').textContent=requestedBuilder;
  $('builderIntro').textContent='Browse '+builderItems.length.toLocaleString()+' cataloged dirt record'+(builderItems.length===1?'':'s')+' from '+requestedBuilder+'. Product versions and cosmetic editions remain connected to their parent records.';
  $('builderFilterLink').href=builderFilterUrl(requestedBuilder);
  document.title=requestedBuilder+' Builder Archive · The Dirt Archive';
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content','Browse '+requestedBuilder+' overdrive, distortion, and fuzz records in The Dirt Archive.');
  const canonical=new URL('./builder.html',location.href);
  canonical.searchParams.set('builder',requestedBuilder);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href',canonical.href);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content',canonical.href);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content','Browse '+requestedBuilder+' overdrive, distortion, and fuzz records in The Dirt Archive.');
}

function renderNotFound(){
  $('builderHeadline').textContent='Builder not found';
  $('builderName').textContent='Builder not found';
  $('builderIntro').textContent='The requested builder is not represented by a canonical public catalog identity.';
  $('builderGrid').innerHTML='<div class="empty"><strong>Builder not found</strong><p>Return to the archive and choose a builder from the indexed catalog.</p><a class="action primary" href="./index.html">Browse builders</a></div>';
  $('builderMeta').textContent='No builder catalog loaded';
  document.querySelector('.builderControls')?.setAttribute('hidden','');
}

Promise.all([loadCatalog()]).then(([data])=>{
  builderAll=data.pedals||[];
  builderItems=builderAll.filter(x=>isCatalogEntry(x)&&x.company===requestedBuilder);
  if(!requestedBuilder||!builderItems.length){renderNotFound();return}
  const initialType=builderParams.get('type')||'All';
  builderType=['All','Overdrive','Distortion','Fuzz'].includes(initialType)?initialType:'All';
  builderQuery=builderParams.get('q')||'';
  $('builderSearch').value=builderQuery;
  renderBuilderHeader();
  renderBuilderStats();
  renderBuilder();
  $('builderSearch').oninput=e=>{builderQuery=e.target.value.trim();builderPage=1;syncBuilderUrl();renderBuilder()};
  $('shareBuilder').onclick=builderShare;
}).catch(error=>{
  $('builderMeta').textContent='Builder data could not be loaded.';
  $('builderGrid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong><p>The archive data could not be loaded.</p></div>';
  console.error(error);
});