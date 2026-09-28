const PAGE_SIZE = 72;
const initialParams=new URLSearchParams(location.search);
let items=[];let allItems=[];let currentPage=Math.max(1,parseInt(initialParams.get('page')||'1',10)||1);
let pedalImages=new Map();let variationSearchText=new Map();
let selectedType=initialParams.get('type')||'All';let selectedBuilder=initialParams.get('builder')||'';let q=initialParams.get('q')||'';
let selectedTransistors=new Set((initialParams.get('transistor')||'').split(',').map(x=>x.trim()).filter(Boolean));
let selectedClippings=new Set((initialParams.get('clipping')||'').split(',').map(x=>x.trim()).filter(Boolean));
let selectedPowers=new Set((initialParams.get('power')||'').split(',').map(x=>x.trim()).filter(Boolean));
let selectedResearch=initialParams.get('research')||'all';
let selectedPhoto=initialParams.get('photo')||'all';
if(!['all','deep','not-deep'].includes(selectedResearch))selectedResearch='all';
if(!['all','archived','needed'].includes(selectedPhoto))selectedPhoto='all';
let facetRecords=new Map();let facetOptions={transistor:[],clipping:[],power:[]};
if(!['All','Overdrive','Distortion','Fuzz'].includes(selectedType))selectedType='All';

function initializeFilterDrawer(){
  const drawer=document.querySelector('.filterDrawer');
  if(!drawer)return;
  drawer.open=window.matchMedia('(min-width:821px)').matches;
}
initializeFilterDrawer();

function hasActiveFilters(){
  return selectedType!=='All'||Boolean(selectedBuilder)||Boolean(q)||selectedTransistors.size>0||selectedClippings.size>0||selectedResearch!=='all'||selectedPhoto!=='all';
}

function renderFilterSummary(){
  const state=$('filterSummaryState');
  if(!state)return;
  const parts=[];
  if(selectedType!=='All')parts.push(selectedType);
  if(selectedBuilder)parts.push(selectedBuilder);
  for(const value of selectedTransistors)parts.push(value+' transistor');
  for(const value of selectedClippings)parts.push(value+' clipping');
  for(const value of selectedPowers)parts.push(value+' power');
  if(selectedResearch==='deep')parts.push('Deep research');
  if(selectedResearch==='not-deep')parts.push('Not deep');
  if(selectedPhoto==='archived')parts.push('Exact photo');
  if(selectedPhoto==='needed')parts.push('Photo needed');
  if(q)parts.push('Search: '+q);
  state.textContent=parts.length?parts.join(' · '):'All pedals';
}

function renderClearFilters(){
  const button=$('clearFilters');
  if(!button)return;
  button.hidden=!hasActiveFilters();
  button.setAttribute('aria-label',hasActiveFilters()?'Clear all active filters':'Clear filters');
}

function clearFilters(){
  selectedType='All';
  selectedBuilder='';
  q='';
  selectedTransistors.clear();
  selectedClippings.clear();
  selectedPowers.clear();
  selectedResearch='all';
  selectedPhoto='all';
  currentPage=1;
  $('researchFilter').value='all';
  $('photoFilter').value='all';
  $('search').value='';
  syncUrl(false);
  render();
}

function discoverPedal(){
  const visible=filteredItems();
  if(!visible.length)return;
  const picked=visible[Math.floor(Math.random()*visible.length)];
  location.href=slugParams(picked);
}

function syncUrl(replace=true){
  const p=new URLSearchParams();
  if(selectedType!=='All')p.set('type',selectedType);
  if(selectedBuilder)p.set('builder',selectedBuilder);
  if(selectedTransistors.size)p.set('transistor',[...selectedTransistors].join(','));
  if(selectedClippings.size)p.set('clipping',[...selectedClippings].join(','));
  if(selectedPowers.size)p.set('power',[...selectedPowers].join(','));
  if(selectedResearch!=='all')p.set('research',selectedResearch);
  if(selectedPhoto!=='all')p.set('photo',selectedPhoto);
  if(q)p.set('q',q);
  if(currentPage>1)p.set('page',currentPage);
  const target=p.toString()?('./index.html?'+p.toString()):'./index.html';
  history[replace?'replaceState':'pushState']({},'',target);
}

function readUrlState(){
  const params=new URLSearchParams(location.search);
  selectedType=params.get('type')||'All';
  if(!['All','Overdrive','Distortion','Fuzz'].includes(selectedType))selectedType='All';
  selectedBuilder=params.get('builder')||'';
  q=params.get('q')||'';
  selectedTransistors=new Set((params.get('transistor')||'').split(',').map(x=>x.trim()).filter(Boolean));
  selectedClippings=new Set((params.get('clipping')||'').split(',').map(x=>x.trim()).filter(Boolean));
  selectedPowers=new Set((params.get('power')||'').split(',').map(x=>x.trim()).filter(Boolean));
  selectedResearch=['all','deep','not-deep'].includes(params.get('research')||'')?(params.get('research')||'all'):'all';
  selectedPhoto=['all','archived','needed'].includes(params.get('photo')||'')?(params.get('photo')||'all'):'all';
  currentPage=Math.max(1,parseInt(params.get('page')||'1',10)||1);
  $('search').value=q;
  $('researchFilter').value=selectedResearch;
  $('photoFilter').value=selectedPhoto;
}

function slugParams(x){ return detailUrl(x, null, selectedType); }

function typeMatches(x){
  return selectedType==='All'||(x.types||[]).includes(selectedType);
}

function coverageMatches(x){
  const research=String(x.research_level||'').toLowerCase();
  if(selectedResearch==='deep'&&research!=='deep')return false;
  if(selectedResearch==='not-deep'&&research==='deep')return false;
  const hasPhoto=isLocalArchiveImage(x);
  if(selectedPhoto==='archived'&&!hasPhoto)return false;
  if(selectedPhoto==='needed'&&hasPhoto)return false;
  return true;
}

function searchMatches(x){
  if(!q)return true;
  const needle=q.toLowerCase();
  const normalizedNeedle=normalizeSearchText(q);
  if(x.company.toLowerCase().includes(needle)||x.pedal.toLowerCase().includes(needle))return true;
  if(normalizeSearchText(x.company).includes(normalizedNeedle)||normalizeSearchText(x.pedal).includes(normalizedNeedle))return true;
  const variation=String(variationSearchText.get(entryKey(x))||'');
  if(variation.includes(needle)||normalizeSearchText(variation).includes(normalizedNeedle))return true;
  const facetSearch=String(facetRecords.get(entryKey(x))?.search||'');
  return facetSearch.includes(needle)||normalizeSearchText(facetSearch).includes(normalizedNeedle);
}

function facetValues(x,group){
  return facetRecords.get(entryKey(x))?.[group]||[];
}

function hasSelectedFacet(x,group,selected){
  if(!selected.size)return true;
  const values=facetValues(x,group);
  return [...selected].some(value=>values.includes(value));
}

function facetMatches(x){
  return hasSelectedFacet(x,'transistor',selectedTransistors)&&hasSelectedFacet(x,'clipping',selectedClippings)&&hasSelectedFacet(x,'power',selectedPowers);
}

function matchesOtherFacets(x,exceptGroup){
  return (!typeMatches(x)||!coverageMatches(x)||!(!selectedBuilder||x.company===selectedBuilder)||!searchMatches(x))?false:
    (exceptGroup==='transistor'||hasSelectedFacet(x,'transistor',selectedTransistors))&&
    (exceptGroup==='clipping'||hasSelectedFacet(x,'clipping',selectedClippings))&&
    (exceptGroup==='power'||hasSelectedFacet(x,'power',selectedPowers));
}

function facetCount(group,option){
  let count=0;
  for(const x of items){
    if(!matchesOtherFacets(x,group))continue;
    if(facetValues(x,group).includes(option))count++;
  }
  return count;
}

function renderTechnicalFilters(){
  const panel=$('technicalFilters');
  if(!panel)return;
  const hasRecords=facetRecords.size>0;
  panel.hidden=!hasRecords;
  if(!hasRecords)return;

  const groups=[
    ['transistor','Transistor',selectedTransistors],
    ['clipping','Clipping',selectedClippings],
    ['power','Power',selectedPowers]
  ];
  for(const [group,label,selected] of groups){
    const target=$(
      group==='transistor'
        ? 'transistorFacetOptions'
        : group==='clipping'
          ? 'clippingFacetOptions'
          : 'powerFacetOptions'
    );
    if(!target)continue;
    const options=facetOptions[group]||[];
    target.innerHTML=options.map(option=>{
      const count=facetCount(group,option);
      const active=selected.has(option);
      return '<button class="facetButton '+(active?'active':'')+'" type="button" data-facet-group="'+group+'" data-facet="'+esc(option)+'" aria-pressed="'+(active?'true':'false')+'" '+(count?'':'disabled')+'>'+
        '<span class="facetName">'+esc(option)+'</span><span class="facetCount">'+count.toLocaleString()+'</span>'+
      '</button>';
    }).join('');
  }

  document.querySelectorAll('[data-facet-group]').forEach(button=>{
    button.onclick=()=>{
      const group=button.dataset.facetGroup;
      const value=button.dataset.facet;
      const selected=group==='transistor'?selectedTransistors:group==='clipping'?selectedClippings:selectedPowers;
      if(selected.has(value))selected.delete(value);else selected.add(value);
      currentPage=1;
      syncUrl(false);
      render();
    };
  });
}

function builderRows(){
  const map=new Map();
  for(const x of items){
    if(!typeMatches(x))continue;
    if(!coverageMatches(x))continue;
    if(q&&!searchMatches(x))continue;
    if(!facetMatches(x))continue;
    map.set(x.company,(map.get(x.company)||0)+1);
  }
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
}

function searchScore(x){
  if(!q)return 0;
  const needle=q.toLowerCase();
  const normalizedNeedle=normalizeSearchText(q);
  const pedal=x.pedal.toLowerCase();
  const company=x.company.toLowerCase();
  const normalizedPedal=normalizeSearchText(x.pedal);
  const normalizedCompany=normalizeSearchText(x.company);
  const variation=(variationSearchText.get(entryKey(x))||'');
  const normalizedVariation=normalizeSearchText(variation);
  if(company===needle||normalizedCompany===normalizedNeedle)return 0;
  if(pedal===needle||normalizedPedal===normalizedNeedle)return 1;
  if(company.startsWith(needle)||normalizedCompany.startsWith(normalizedNeedle))return 2;
  if(pedal.startsWith(needle)||normalizedPedal.startsWith(normalizedNeedle))return 3;
  if(company.includes(needle)||normalizedCompany.includes(normalizedNeedle))return 4;
  if(pedal.includes(needle)||normalizedPedal.includes(normalizedNeedle))return 5;
  if(variation.includes(needle)||normalizedVariation.includes(normalizedNeedle))return 6;
  const facetSearch=String(facetRecords.get(entryKey(x))?.search||'');
  if(facetSearch.includes(needle)||normalizeSearchText(facetSearch).includes(normalizedNeedle))return 7;
  return 99;
}

function searchMatchReason(x){
  if(!q)return '';
  const needle=q.toLowerCase();
  const normalizedNeedle=normalizeSearchText(q);
  const pedal=x.pedal.toLowerCase();
  const company=x.company.toLowerCase();
  const normalizedPedal=normalizeSearchText(x.pedal);
  const normalizedCompany=normalizeSearchText(x.company);
  const variation=(variationSearchText.get(entryKey(x))||'');
  const normalizedVariation=normalizeSearchText(variation);
  const facetSearch=String(facetRecords.get(entryKey(x))?.search||'');
  const normalizedFacet=normalizeSearchText(facetSearch);

  if(company===needle||normalizedCompany===normalizedNeedle)return 'Exact builder match';
  if(pedal===needle||normalizedPedal===normalizedNeedle)return 'Exact pedal match';
  if(company.startsWith(needle)||normalizedCompany.startsWith(normalizedNeedle))return 'Builder starts with search';
  if(pedal.startsWith(needle)||normalizedPedal.startsWith(normalizedNeedle))return 'Pedal starts with search';
  if(company.includes(needle)||normalizedCompany.includes(normalizedNeedle))return 'Builder contains search';
  if(pedal.includes(needle)||normalizedPedal.includes(normalizedNeedle))return 'Pedal contains search';
  if(variation.includes(needle)||normalizedVariation.includes(normalizedNeedle))return 'Version or colorway match';
  if(facetSearch.includes(needle)||normalizedFacet.includes(normalizedNeedle))return 'Documented technical match';
  return '';
}

function filteredItems(){
  const result=items.filter(x=>
    typeMatches(x)&&
    coverageMatches(x)&&
    (!selectedBuilder||x.company===selectedBuilder)&&
    searchMatches(x)&&
    facetMatches(x)
  );
  if(!q)return result;
  return result.sort((a,b)=>{
    const rank=searchScore(a)-searchScore(b);
    if(rank)return rank;
    const pedalRank=a.pedal.localeCompare(b.pedal);
    if(pedalRank)return pedalRank;
    return a.company.localeCompare(b.company);
  });
}

function renderTypeMenu(){
  const typeContext=x=>
    coverageMatches(x)&&
    (!selectedBuilder||x.company===selectedBuilder)&&
    searchMatches(x)&&
    facetMatches(x);
  const counts={All:new Set(items.filter(typeContext).map(x=>entryKey(x))).size};
  for(const t of ['Overdrive','Distortion','Fuzz']){
    counts[t]=new Set(items.filter(x=>typeContext(x)&&(x.types||[]).includes(t)).map(x=>entryKey(x))).size;
  }
  const types=[
    ['All','Everything in the archive'],
    ['Overdrive',counts.Overdrive+' pedals'],
    ['Distortion',counts.Distortion+' pedals'],
    ['Fuzz',counts.Fuzz+' pedals']
  ];
  $('typeMenu').innerHTML=types.map(([t,sub])=>
    '<button class="typeButton '+(selectedType===t?'active':'')+'" data-type="'+t+'" aria-pressed="'+(selectedType===t?'true':'false')+'">'+
      (t==='All'?'All Pedals':t)+
      '<span class="typeSub">'+sub+'</span>'+
    '</button>'
  ).join('');
  document.querySelectorAll('[data-type]').forEach(btn=>btn.onclick=()=>{
    selectedType=btn.dataset.type;
    selectedBuilder='';
    currentPage=1;
    syncUrl(false);
    render();
  });
}

function renderBuilders(){
  const rows=builderRows();
  $('builderCount').textContent=rows.length+' builders';
  $('builderListCount').textContent=rows.length;

  const allCount=items.filter(x=>typeMatches(x)&&coverageMatches(x)&&searchMatches(x)&&facetMatches(x)).length;
  let html='<button class="builder allBuilder '+(!selectedBuilder?'active':'')+'" data-builder="" aria-pressed="'+(!selectedBuilder?'true':'false')+'"><span class="builderName">All builders</span><span class="builderCount">'+allCount+'</span></button>';
  html+=rows.map(([name,count])=>
    '<button class="builder '+(selectedBuilder===name?'active':'')+'" data-builder="'+esc(name)+'" aria-pressed="'+(selectedBuilder===name?'true':'false')+'">'+
      '<span class="builderName">'+esc(name)+'</span>'+
      '<span class="builderCount">'+count+'</span>'+
    '</button>'
  ).join('');
  $('builders').innerHTML=html;
  document.querySelectorAll('[data-builder]').forEach(btn=>btn.onclick=()=>{
    selectedBuilder=btn.dataset.builder||'';
    currentPage=1;
    syncUrl(false);
    render();
  });
}

function render(){
  let normalized=false;
  if(selectedBuilder&&!items.some(x=>x.company===selectedBuilder&&typeMatches(x)&&coverageMatches(x)&&searchMatches(x)&&facetMatches(x))){
    selectedBuilder='';
    normalized=true;
  }
  renderTypeMenu();
  renderTechnicalFilters();
  renderBuilders();
  renderClearFilters();
  renderFilterSummary();

  const visible=filteredItems();
  const discoverButton=$('discoverPedal');
  if(discoverButton)discoverButton.disabled=!visible.length;
  const totalPages=Math.max(1,Math.ceil(visible.length/PAGE_SIZE));
  const normalizedPage=Math.min(currentPage,totalPages);
  if(normalizedPage!==currentPage){
    currentPage=normalizedPage;
    normalized=true;
  }
  const pageStart=(currentPage-1)*PAGE_SIZE;
  const pageItems=visible.slice(pageStart,pageStart+PAGE_SIZE);

  const builderContext=items.filter(x=>typeMatches(x)&&coverageMatches(x)&&searchMatches(x)&&facetMatches(x));
  const builderCount=new Set(builderContext.map(x=>x.company)).size;

  const titleParts=[];
  if(q)titleParts.push('Search: '+q);
  else if(selectedBuilder)titleParts.push(selectedBuilder);
  if(selectedType!=='All')titleParts.push(selectedType);
  for(const value of selectedTransistors)titleParts.push(value+' transistor');
  for(const value of selectedClippings)titleParts.push(value+' clipping');
  if(selectedResearch==='deep')titleParts.push('Deep research');
  if(selectedResearch==='not-deep')titleParts.push('Not deep');
  if(selectedPhoto==='archived')titleParts.push('Exact photo');
  if(selectedPhoto==='needed')titleParts.push('Photo needed');
  $('title').textContent=titleParts.length?titleParts.join(' · '):'All Pedals';

  const rangeStart=visible.length?pageStart+1:0;
  const rangeEnd=Math.min(pageStart+PAGE_SIZE,visible.length);
  $('meta').textContent=(visible.length
    ? 'Showing '+rangeStart.toLocaleString()+'–'+rangeEnd.toLocaleString()+' of '+visible.length.toLocaleString()
    : '0')+' pedal'+(visible.length===1?'':'s')+' · '+builderCount.toLocaleString()+' builder'+(builderCount===1?'':'s');

  $('grid').innerHTML=pageItems.length
    ? pageItems.map(x=>
      (()=>{
        const img=pedalImages.get(entryKey(x));
        const media=img&&img.image
          ? '<div class="cardMedia"><img class="cardImage" src="'+esc(img.image)+'" alt="'+esc(x.company+' '+x.pedal)+' pedal" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="cardPlaceholder" hidden aria-label="Photo unavailable"></div></div>'
          : '<div class="cardPlaceholder" aria-label="Photo unavailable"></div>';
        return '<a class="card" href="'+slugParams(x)+'">'+
          media+
          '<span class="cardBody">'+
            '<span class="name">'+esc(x.pedal)+'</span>'+
            '<span class="builderNameCard">'+esc(x.company)+'</span>'+
            (q && searchMatchReason(x) ? '<span class="searchMatchReason">'+esc(searchMatchReason(x))+'</span>' : '')+
            '<span class="chips">'+x.types.map(t=>'<span class="chip">'+esc(t)+'</span>').join('')+'</span>'+
          '</span>'+
        '</a>';
      })()
    ).join('')
    : '<div class="empty"><strong>No pedals found</strong>Try another search, dirt type, builder, or technical filter.</div>';

  renderPagination(totalPages);
  if(normalized)syncUrl(true);
}

async function copyViewLink(){
  const button=$('copyViewLink');
  if(!button)return;
  const url=location.href;
  let copied=false;
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(url);
      copied=true;
    }else{
      const field=document.createElement('textarea');
      field.value=url;
      field.setAttribute('readonly','');
      field.style.position='fixed';
      field.style.opacity='0';
      document.body.appendChild(field);
      field.select();
      copied=document.execCommand('copy');
      field.remove();
    }
  }catch(e){
    console.error('Could not copy archive view link',e);
  }
  const original=button.textContent;
  button.textContent=copied?'Link copied':'Copy failed';
  button.setAttribute('aria-live','polite');
  window.setTimeout(()=>{
    button.textContent=original;
  },1600);
}

$('clearFilters').onclick=clearFilters;
$('discoverPedal').onclick=discoverPedal;
$('copyViewLink').onclick=copyViewLink;
$('researchFilter').onchange=e=>{
  selectedResearch=e.target.value;
  currentPage=1;
  syncUrl(true);
  render();
};
$('photoFilter').onchange=e=>{
  selectedPhoto=e.target.value;
  currentPage=1;
  syncUrl(true);
  render();
};

$('search').value=q;
$('researchFilter').value=selectedResearch;
$('photoFilter').value=selectedPhoto;
$('search').oninput=e=>{
  q=e.target.value.trim();
  selectedBuilder='';
  currentPage=1;
  syncUrl(true);
  render();
};

window.addEventListener('keydown',e=>{
  if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'){
    e.preventDefault();
    $('search')?.focus();
  }
  if(e.key==='Escape'&&document.activeElement?.tagName==='INPUT'&&document.activeElement?.id==='search'&&q){
    e.preventDefault();
    q='';
    $('search').value='';
    currentPage=1;
    syncUrl(true);
    render();
  }
});

function renderPagination(totalPages){
  const wrap=$('paginationWrap'),nav=$('pagination');
  if(totalPages<=1){wrap.hidden=true;nav.innerHTML='';return}
  wrap.hidden=false;
  const pages=[];const add=n=>pages.push(n);
  if(totalPages<=7){for(let n=1;n<=totalPages;n++)add(n)}
  else{
    add(1);
    const start=Math.max(2,currentPage-2),end=Math.min(totalPages-1,currentPage+2);
    if(start>2)pages.push('…');
    for(let n=start;n<=end;n++)add(n);
    if(end<totalPages-1)pages.push('…');
    add(totalPages);
  }
  const prev=currentPage>1?'<button class="pageButton" type="button" data-page="'+(currentPage-1)+'" aria-label="Previous page">←</button>':'<button class="pageButton" type="button" disabled aria-label="Previous page">←</button>';
  const next=currentPage<totalPages?'<button class="pageButton" type="button" data-page="'+(currentPage+1)+'" aria-label="Next page">→</button>':'<button class="pageButton" type="button" disabled aria-label="Next page">→</button>';
  nav.innerHTML=prev+pages.map(n=>typeof n==='number'
    ? '<button class="pageButton '+(n===currentPage?'active':'')+'" type="button" data-page="'+n+'"'+(n===currentPage?' aria-current="page"':'')+'>'+n+'</button>'
    : '<span class="pageEllipsis" aria-hidden="true">…</span>'
  ).join('')+next;
  nav.querySelectorAll('[data-page]').forEach(btn=>btn.onclick=()=>{
    currentPage=Number(btn.dataset.page)||1;
    syncUrl(false);render();
    document.querySelector('.heroPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

window.addEventListener('popstate',()=>{
  readUrlState();
  render();
});

Promise.all([loadCatalog(),loadFacets()])
.then(([data,facets])=>{
  allItems=data.pedals||[];
  items=allItems.filter(isCatalogEntry);
  facetRecords=new Map(Object.entries(facets?.records||{}));
  facetOptions={
    transistor:Array.isArray(facets?.options?.transistor)?facets.options.transistor:[],
    clipping:Array.isArray(facets?.options?.clipping)?facets.options.clipping:[]
  };

  pedalImages=new Map();
  for(const x of items){
    const key=entryKey(x);
    const current=pedalImages.get(key);
    if(!current||(!current.image&&x.image))pedalImages.set(key,x);
  }
  variationSearchText=new Map();
  for(const v of allItems.filter(x=>x.catalog_role==='variation')){
    const k=v.company+'\u0000'+v.parent_pedal;
    const text=(v.variation_name||'')+' '+(v.pedal||'');
    variationSearchText.set(k,((variationSearchText.get(k)||'')+' '+text).toLowerCase());
  }
  const builderTotal=new Set(items.map(x=>x.company)).size;
  const picturedTotal=[...pedalImages.values()].filter(isLocalArchiveImage).length;
  const deepResearchTotal=items.filter(x=>String(x.research_level||'').toLowerCase()==='deep').length;
  $('pulsePedals').textContent=items.length.toLocaleString();
  $('pulseBuilders').textContent=builderTotal.toLocaleString();
  $('pulsePhotos').textContent=picturedTotal.toLocaleString();
  const coverage=items.length?(picturedTotal/items.length)*100:0;
  $('pulseCoverage').textContent=coverage.toFixed(1)+'%';
  const researchCoverage=items.length?(deepResearchTotal/items.length)*100:0;
  $('pulseResearch').textContent=researchCoverage.toFixed(1)+'%';

  render();
  syncUrl();
}).catch(e=>{
  $('meta').textContent='Catalog unavailable';
  $('grid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong>The archive data could not be loaded.</div>';
  console.error(e);
});