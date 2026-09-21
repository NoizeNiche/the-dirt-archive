const PAGE_SIZE = 72;
const initialParams=new URLSearchParams(location.search);
let items=[];let allItems=[];let currentPage=Math.max(1,parseInt(initialParams.get('page')||'1',10)||1);let pedalImages=new Map();let variationSearchText=new Map();let selectedType=initialParams.get('type')||'All';let selectedBuilder=initialParams.get('builder')||'';let q=initialParams.get('q')||'';
if(!['All','Overdrive','Distortion','Fuzz'].includes(selectedType))selectedType='All';


function syncUrl(replace=true){
  const p=new URLSearchParams();
  if(selectedType!=='All')p.set('type',selectedType);
  if(selectedBuilder)p.set('builder',selectedBuilder);
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
  currentPage=Math.max(1,parseInt(params.get('page')||'1',10)||1);
  $('search').value=q;
}

function slugParams(x){ return detailUrl(x); }

function typeMatches(x){
  return selectedType==='All'||x.types.includes(selectedType)
}

function searchMatches(x){
  if(!q)return true;
  const needle=q.toLowerCase();
  if(x.company.toLowerCase().includes(needle)||x.pedal.toLowerCase().includes(needle))return true;
  return (variationSearchText.get(entryKey(x))||'').includes(needle);
}

function builderRows(){
  const map=new Map();
  for(const x of items){
    if(!typeMatches(x))continue;
    if(q&&!searchMatches(x))continue;
    map.set(x.company,(map.get(x.company)||0)+1);
  }
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
}

function filteredItems(){
  return items.filter(x=>
    typeMatches(x)&&
    (!selectedBuilder||x.company===selectedBuilder)&&
    searchMatches(x)
  );
}

function renderTypeMenu(){
  const counts={All:new Set(items.map(x=>entryKey(x))).size};
  for(const t of ['Overdrive','Distortion','Fuzz']){
    counts[t]=new Set(items.filter(x=>x.types.includes(t)).map(x=>entryKey(x))).size;
  }
  const types=[
    ['All','Everything in the archive'],
    ['Overdrive',counts.Overdrive+' pedals'],
    ['Distortion',counts.Distortion+' pedals'],
    ['Fuzz',counts.Fuzz+' pedals']
  ];
  $('typeMenu').innerHTML=types.map(([t,sub])=>
    '<button class="typeButton '+(selectedType===t?'active':'')+'" data-type="'+t+'">'+
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

  const allCount=items.filter(x=>typeMatches(x)&&searchMatches(x)).length;
  let html='<button class="builder allBuilder '+(!selectedBuilder?'active':'')+'" data-builder=""><span class="builderName">All builders</span><span class="builderCount">'+allCount+'</span></button>';
  html+=rows.map(([name,count])=>
    '<button class="builder '+(selectedBuilder===name?'active':'')+'" data-builder="'+esc(name)+'">'+
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
  if(selectedBuilder&&!items.some(x=>x.company===selectedBuilder&&typeMatches(x)))selectedBuilder='';
  renderTypeMenu();
  renderBuilders();

  const visible=filteredItems();
  const totalPages=Math.max(1,Math.ceil(visible.length/PAGE_SIZE));
  currentPage=Math.min(currentPage,totalPages);
  const pageStart=(currentPage-1)*PAGE_SIZE;
  const pageItems=visible.slice(pageStart,pageStart+PAGE_SIZE);

  // The builder total describes the current archive filter context,
  // not the single builder selected for the result view.
  const builderContext=items.filter(x=>typeMatches(x)&&searchMatches(x));
  const builderCount=new Set(builderContext.map(x=>x.company)).size;

  let title='All Pedals';
  if(selectedType!=='All')title=selectedType;
  if(selectedBuilder)title=selectedBuilder;
  if(selectedBuilder&&selectedType!=='All')title=selectedBuilder+' · '+selectedType;
  if(q)title='Search: '+q;

  $('title').textContent=title;
  const rangeStart=visible.length?pageStart+1:0;
  const rangeEnd=Math.min(pageStart+PAGE_SIZE,visible.length);
  $('meta').textContent=(visible.length
    ? 'Showing '+rangeStart.toLocaleString()+'–'+rangeEnd.toLocaleString()+' of '+visible.length.toLocaleString()
    : '0')+' pedal'+(visible.length===1?'':'s')+' · '+builderCount.toLocaleString()+' builder'+(builderCount===1?'':'s');

  $('grid').innerHTML=pageItems.length
    ? pageItems.map(x=>
      (()=>{
        const img=pedalImages.get(entryKey(x));
        const media=img && img.image
          ? '<div class="cardMedia"><img class="cardImage" src="'+esc(img.image)+'" alt="'+esc(x.company+' '+x.pedal)+' pedal" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="cardPlaceholder" hidden>No Photo Archived</div></div>'
          : '<div class="cardPlaceholder">No Photo Archived</div>';
        return '<a class="card" href="'+slugParams(x)+'">'+
          media+
          '<span class="cardBody">'+
            '<span class="name">'+esc(x.pedal)+'</span>'+
            '<span class="builderNameCard">'+esc(x.company)+'</span>'+
            '<span class="chips">'+x.types.map(t=>'<span class="chip">'+esc(t)+'</span>').join('')+'</span>'+
          '</span>'+
        '</a>';
      })()
    ).join('')
    : '<div class="empty"><strong>No pedals found</strong>Try another search, dirt type, or builder.</div>';

  renderPagination(totalPages);
}

$('search').value=q;
$('search').oninput=e=>{
  q=e.target.value.trim();
  selectedBuilder='';
  currentPage=1;
  syncUrl(true);
  render();
};

function renderPagination(totalPages){
  const wrap=$('paginationWrap'),nav=$('pagination');
  if(totalPages<=1){wrap.hidden=true;nav.innerHTML='';return}
  wrap.hidden=false;
  const pages=[]; const add=n=>pages.push(n);
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
    ? '<button class="pageButton '+(n===currentPage?'active':'')+'" type="button" data-page="'+n+'" aria-current="'+(n===currentPage?'page':'false')+'">'+n+'</button>'
    : '<span class="pageEllipsis" aria-hidden="true">…</span>'
  ).join('')+next;
  nav.querySelectorAll('[data-page]').forEach(btn=>btn.onclick=()=>{
    currentPage=Number(btn.dataset.page)||1;
    syncUrl(false); render();
    document.querySelector('.heroPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

window.addEventListener('popstate',()=>{
  readUrlState();
  render();
});

loadCatalog()
.then(data=>{
  allItems=data.pedals||[];
  items=allItems.filter(isCatalogEntry);
  pedalImages=new Map(allItems.map(x=>[entryKey(x),x]));
  variationSearchText=new Map();
  for(const v of allItems.filter(x=>x.catalog_role==='variation')){
    const k=v.company+'\u0000'+v.parent_pedal;
    const text=(v.variation_name||'')+' '+(v.pedal||'');
    variationSearchText.set(k,((variationSearchText.get(k)||'')+' '+text).toLowerCase());
  }
  render();
  syncUrl();
}).catch(e=>{
  $('meta').textContent='Catalog unavailable';
  $('grid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong>The archive data could not be loaded.</div>';
  console.error(e);
});
