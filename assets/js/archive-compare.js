function encodeCompareKeys(keys){
  try{return btoa(encodeURIComponent(JSON.stringify(keys||[])))}catch{return ''}
}
function decodeCompareKeys(value){
  try{
    const parsed=JSON.parse(decodeURIComponent(atob(value||'')));
    return Array.isArray(parsed)?parsed.filter(x=>typeof x==='string'): [];
  }catch{return []}
}
async function copyComparisonLink(items){
  const url=new URL(location.href);
  const keys=items.map(workbenchKey);
  if(keys.length)url.searchParams.set('compare',encodeCompareKeys(keys));else url.searchParams.delete('compare');
  let copied=false;
  try{
    await navigator.clipboard.writeText(url.href);
    copied=true;
  }catch{
    const input=document.createElement('textarea');
    input.value=url.href;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';
    document.body.appendChild(input);input.select();copied=document.execCommand('copy');input.remove();
  }
  const button=document.getElementById('copyCompareLink');
  if(button){
    const original=button.textContent;
    button.textContent=copied?'Link copied':'Copy failed';
    setTimeout(()=>button.textContent=original,1500);
  }
}
let facetRecords=new Map();
const COMPARE_PLACEHOLDER='Not documented';
function compareText(value){
  if(Array.isArray(value))return value.length?value.join(', '):COMPARE_PLACEHOLDER;
  return String(value||'').trim()||COMPARE_PLACEHOLDER;
}
function compareFacet(item,group){
  const record=facetRecords.get(entryKey(item))||{};
  return compareText(record[group]);
}
function comparePhoto(item){
  const image=isLocalArchiveImage(item)?item.image:'';
  return image
    ? '<img class="comparePhoto" src="'+esc(image)+'" alt="'+esc(item.company+' '+item.pedal)+'">'
    : '<div class="noPhoto">No exact archive photo</div>';
}
function versionFamilyLabel(item){
  const raw=String(item?.version_of||'').trim();
  if(!raw)return COMPARE_PLACEHOLDER;
  const parts=raw.split('\u0000');
  return parts.length===2 ? parts[0]+' · '+parts[1] : raw;
}
function compareLinks(item){
  const parts=[
    '<a class="action" href="'+esc(detailUrl(item,null,''))+'">Open record</a>'
  ];
  return parts.join('');
}
function renderComparison(items, facets){
  facetRecords=new Map(Object.entries(facets?.records||{}));
  const wrap=document.getElementById('comparisonWrap');
  const empty=document.getElementById('empty');
  const meta=document.getElementById('compareMeta');
  if(!items.length){
    empty.hidden=false;wrap.hidden=true;meta.textContent='0 exact records selected';
    return;
  }
  empty.hidden=true;wrap.hidden=false;
  meta.textContent=items.length+' exact record'+(items.length===1?'':'s')+' selected. Compare documented differences, not opinions.';
  const headRows='<tr><th scope="col">Field</th>'+items.map(item=>
    '<th scope="col"><span class="comparePedalName">'+esc(item.pedal)+'</span><span class="compareBuilder">'+esc(item.company)+'</span><div class="compareLinks">'+compareLinks(item)+'</div></th>'
  ).join('')+'</tr>';
  document.getElementById('comparisonHead').innerHTML=headRows;
  const rows=[
    ['Photo',item=>comparePhoto(item),true],
    ['Dirt type',item=>'<div class="compareValue">'+esc(compareText(item.types))+'</div>'],
    ['Version',item=>'<div class="compareValue">'+esc(compareText(item.version_label))+'</div>'],
    ['Transistor',item=>'<div class="compareValue">'+esc(compareFacet(item,'transistor'))+'</div>'],
    ['Clipping',item=>'<div class="compareValue">'+esc(compareFacet(item,'clipping'))+'</div>'],
    ['Power',item=>'<div class="compareValue">'+esc(compareFacet(item,'power'))+'</div>'],
    ['Research',item=>'<div class="compareValue">'+esc(String(item.research_level||'').trim()||COMPARE_PLACEHOLDER)+'</div>'],
    ['Archived photo',item=>'<div class="compareValue">'+(isLocalArchiveImage(item)?'Yes':'No')+'</div>'],
    ['Version family',item=>'<div class="compareValue">'+esc(versionFamilyLabel(item))+'</div>'],
    ['Representative demo',item=>item.youtube_demo?.url?'<a class="action" href="'+esc(item.youtube_demo.url)+'" target="_blank" rel="noopener">'+esc(item.youtube_demo.title||'Watch demo')+'</a>':'<div class="compareMuted">'+COMPARE_PLACEHOLDER+'</div>']
  ];
  document.getElementById('comparisonBody').innerHTML=rows.map(row=>
    '<tr><th scope="row">'+esc(row[0])+'</th>'+items.map(item=>'<td>'+row[1](item)+'</td>').join('')+'</tr>'
  ).join('');
}
Promise.all([loadCatalog(),loadFacets()]).then(([data,facets])=>{
  const allItems=data.pedals||[];
  const params=new URLSearchParams(location.search);
  const shared=params.get('compare');
  if(shared){
    const valid=decodeCompareKeys(shared).filter(key=>allItems.some(item=>isCatalogEntry(item)&&workbenchKey(item)===key)).slice(0,4);
    if(valid.length){
      const current=readWorkbench();
      writeWorkbench({saved:current.saved,compare:valid});
    }
  }
  const selected=readWorkbench().compare;
  const items=findWorkbenchEntries(allItems,selected).filter(isCatalogEntry);
  renderComparison(items,facets);
  document.getElementById('copyCompareLink')?.addEventListener('click',()=>copyComparisonLink(items));
}).catch(error=>{
  document.getElementById('compareMeta').textContent='Comparison data could not be loaded.';
  console.error(error);
});
document.getElementById('clearCompare')?.addEventListener('click',()=>{
  clearCompare();
  const empty=document.getElementById('empty');
  const wrap=document.getElementById('comparisonWrap');
  empty.hidden=false;wrap.hidden=true;
  document.getElementById('compareMeta').textContent='0 exact records selected';
});
window.addEventListener('workbenchchange',()=>{
  loadCatalog().then(data=>{
    const items=findWorkbenchEntries(data.pedals||[],readWorkbench().compare).filter(isCatalogEntry);
    return loadFacets().then(facets=>renderComparison(items,facets));
  });
});
