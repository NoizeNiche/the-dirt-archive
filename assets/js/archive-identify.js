const identifyParams=new URLSearchParams(location.search);
let identifyItems=[],identifyFacets={},selectedIdentifyType=identifyParams.get('type')||'All',selectedIdentifyBuilder=identifyParams.get('builder')||'',identifyQuery=identifyParams.get('q')||'';let identifyPhotoOnly=identifyParams.get('photo')==='archived';
let selectedIdentifyTransistors=new Set((identifyParams.get('transistor')||'').split(',').filter(Boolean));
let selectedIdentifyClippings=new Set((identifyParams.get('clipping')||'').split(',').filter(Boolean));
let selectedIdentifyPowers=new Set((identifyParams.get('power')||'').split(',').filter(Boolean));

function identifyFacet(item,group){return identifyFacets.records?.[entryKey(item)]?.[group]||[]}
function identifyMatches(item){
  if(selectedIdentifyType!=='All'&&!(item.types||[]).includes(selectedIdentifyType))return false;
  if(selectedIdentifyBuilder&&item.company!==selectedIdentifyBuilder)return false;
  if(identifyPhotoOnly&&!isLocalArchiveImage(item))return false;
  if([...selectedIdentifyTransistors].some(v=>!identifyFacet(item,'transistor').includes(v)))return false;
  if([...selectedIdentifyClippings].some(v=>!identifyFacet(item,'clipping').includes(v)))return false;
  if([...selectedIdentifyPowers].some(v=>!identifyFacet(item,'power').includes(v)))return false;
  if(identifyQuery){
    const needle=normalizeSearchText(identifyQuery);
    const facet=identifyFacets.records?.[entryKey(item)]||{};
    const hay=[item.company,item.pedal,item.version_label,...(facet.aliases||[]),facet.search||''].join(' ');
    if(!normalizeSearchText(hay).includes(needle))return false;
  }
  return true;
}
function filteredIdentify(){return identifyItems.filter(identifyMatches).sort((a,b)=>a.company.localeCompare(b.company)||a.pedal.localeCompare(b.pedal))}
function syncIdentifyUrl(){
  const u=new URL(location.href);
  if(selectedIdentifyType!=='All')u.searchParams.set('type',selectedIdentifyType);else u.searchParams.delete('type');
  if(selectedIdentifyBuilder)u.searchParams.set('builder',selectedIdentifyBuilder);else u.searchParams.delete('builder');
  if(identifyQuery)u.searchParams.set('q',identifyQuery);else u.searchParams.delete('q');
  for(const [key,set] of [['transistor',selectedIdentifyTransistors],['clipping',selectedIdentifyClippings],['power',selectedIdentifyPowers]]){if(set.size)u.searchParams.set(key,[...set].join(','));else u.searchParams.delete(key)}
  history.replaceState({},'',u.href);
}
function choiceButtons(values,selected,attribute){
  return values.map(value=>'<button class="identifyChoice '+(selected.has(value)?'active':'')+'" type="button" data-identify-'+attribute+'="'+esc(value)+'" aria-pressed="'+selected.has(value)+'">'+esc(value)+'</button>').join('');
}
function renderTypes(){
  const types=['All','Overdrive','Distortion','Fuzz'];
  $('typeChoices').innerHTML=types.map(type=>'<button class="identifyChoice '+(selectedIdentifyType===type?'active':'')+'" type="button" data-identify-type="'+type+'" aria-pressed="'+(selectedIdentifyType===type)+'">'+esc(type==='All'?'Any dirt family':type)+'</button>').join('');
  document.querySelectorAll('[data-identify-type]').forEach(b=>b.onclick=()=>{selectedIdentifyType=b.dataset.identifyType;syncIdentifyUrl();renderIdentify()});
}
function renderFacets(){
  const opts=identifyFacets.options||{};
  $('transistorChoices').innerHTML=choiceButtons(opts.transistor||[],selectedIdentifyTransistors,'transistor');
  $('clippingChoices').innerHTML=choiceButtons(opts.clipping||[],selectedIdentifyClippings,'clipping');
  $('powerChoices').innerHTML=choiceButtons(opts.power||[],selectedIdentifyPowers,'power');
  document.querySelectorAll('[data-identify-transistor]').forEach(b=>b.onclick=()=>toggleIdentifySet(selectedIdentifyTransistors,b.dataset.identifyTransistor));
  document.querySelectorAll('[data-identify-clipping]').forEach(b=>b.onclick=()=>toggleIdentifySet(selectedIdentifyClippings,b.dataset.identifyClipping));
  document.querySelectorAll('[data-identify-power]').forEach(b=>b.onclick=()=>toggleIdentifySet(selectedIdentifyPowers,b.dataset.identifyPower));
}
function toggleIdentifySet(set,value){set.has(value)?set.delete(value):set.add(value);syncIdentifyUrl();renderIdentify()}
function builderRows(){
  const q=normalizeSearchText($('builderSearch')?.value||'');
  const names=[...new Set(identifyItems.map(x=>x.company))].sort((a,b)=>a.localeCompare(b));
  return q?names.filter(n=>normalizeSearchText(n).includes(q)).slice(0,10):names.slice(0,10);
}
function renderBuilderSuggestions(){
  const box=$('builderSuggestions'),query=$('builderSearch').value.trim();
  if(!query){box.hidden=true;return}
  const rows=builderRows();
  box.innerHTML=rows.map(name=>'<button type="button" class="identifySuggestion" data-builder-value="'+esc(name)+'"><strong>'+esc(name)+'</strong><span>'+identifyItems.filter(x=>x.company===name).length+' records</span></button>').join('');
  box.hidden=!rows.length;
  box.querySelectorAll('[data-builder-value]').forEach(b=>b.onclick=()=>{selectedIdentifyBuilder=b.dataset.builderValue;$('builderSearch').value=selectedIdentifyBuilder;$('builderChosen').textContent='Builder: '+selectedIdentifyBuilder;$('builderChosen').hidden=false;$('clearBuilder').hidden=false;box.hidden=true;syncIdentifyUrl();renderIdentify()});
}
function renderBuilderChosen(){
  const chosen=$('builderChosen');
  if(selectedIdentifyBuilder){chosen.textContent='Builder: '+selectedIdentifyBuilder;chosen.hidden=false;$('clearBuilder').hidden=false;$('builderSearch').value=selectedIdentifyBuilder}
  else{chosen.hidden=true;$('clearBuilder').hidden=true}
}
function makeIdentifyUrl(item){
  const u=new URL('./pedal-detail.html',location.href);
  u.searchParams.set('builder',item.company);u.searchParams.set('pedal',item.pedal);return u.href;
}
function renderResults(){
  const rows=filteredIdentify(), meta=$('resultMeta'), grid=$('resultGrid');
  $('resultTitle').textContent=rows.length===identifyItems.length?'All archived dirt pedals':rows.length===1?'1 possible match':rows.length.toLocaleString()+' possible matches';
  meta.textContent=(rows.length||0).toLocaleString()+' matching record'+(rows.length===1?'':'s');
  const u=new URL('./index.html',location.href);
  if(selectedIdentifyType!=='All')u.searchParams.set('type',selectedIdentifyType);
  if(selectedIdentifyBuilder)u.searchParams.set('builder',selectedIdentifyBuilder);
  if(identifyQuery)u.searchParams.set('q',identifyQuery);
  if(selectedIdentifyTransistors.size)u.searchParams.set('transistor',[...selectedIdentifyTransistors].join(','));
  if(selectedIdentifyClippings.size)u.searchParams.set('clipping',[...selectedIdentifyClippings].join(','));
  if(selectedIdentifyPowers.size)u.searchParams.set('power',[...selectedIdentifyPowers].join(','));
  $('openResults').href=u.href;
  $('photoOnly').checked=identifyPhotoOnly;
  grid.innerHTML=rows.slice(0,48).map(item=>{
    const facet=identifyFacets.records?.[entryKey(item)]||{};
    const bits=[...(item.types||[])];
    if(item.version_label)bits.push(item.version_label);
    if(facet.transistor?.length)bits.push(facet.transistor.join('/'));
    if(facet.clipping?.length)bits.push(facet.clipping.join('/'));
    const image=isLocalArchiveImage(item)?'<img src="'+esc(item.image)+'" alt="'+esc(item.company+' '+item.pedal)+' pedal" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'<span class="identifyNoPhoto">Exact photo not archived</span>';
    return '<a class="identifyResult" href="'+esc(makeIdentifyUrl(item))+'"><span class="identifyResultMedia">'+image+'</span><span class="identifyResultBody"><span class="identifyResultName">'+esc(item.pedal)+'</span><span class="identifyResultBuilder">'+esc(item.company)+'</span><span class="identifyResultBits">'+esc(bits.join(' · '))+'</span></span></a>';
  }).join('')||'<div class="empty"><strong>No exact archive matches</strong><p>Remove one clue or try a different documented term. The archive does not infer missing facts.</p></div>';
  if(rows.length>48)grid.insertAdjacentHTML('beforeend','<div class="identifyMore">Showing the first 48 matches. Open results in the archive for the full filtered set.</div>');
}
function renderIdentify(){
  renderTypes();renderFacets();renderBuilderChosen();renderResults();
}
$('builderSearch').oninput=()=>renderBuilderSuggestions();
$('builderSearch').onkeydown=e=>{if(e.key==='Escape'){$('builderSuggestions').hidden=true;return}if(e.key==='Enter'){const first=$('builderSuggestions').querySelector('.identifySuggestion');if(first){e.preventDefault();first.click()}}};
$('clueSearch').oninput=e=>{identifyQuery=e.target.value.trim();syncIdentifyUrl();renderIdentify()};
$('clearBuilder').onclick=()=>{selectedIdentifyBuilder='';$('builderSearch').value='';$('builderChosen').hidden=true;$('clearBuilder').hidden=true;syncIdentifyUrl();renderIdentify()};
$('photoOnly').onchange=e=>{identifyPhotoOnly=e.target.checked;syncIdentifyUrl();renderIdentify()};
$('resetIdentify').onclick=()=>{selectedIdentifyType='All';selectedIdentifyBuilder='';identifyQuery='';identifyPhotoOnly=false;selectedIdentifyTransistors.clear();selectedIdentifyClippings.clear();selectedIdentifyPowers.clear();$('builderSearch').value='';$('clueSearch').value='';syncIdentifyUrl();renderIdentify()};
document.addEventListener('click',e=>{if(!e.target.closest('.identifyBuilderWrap'))$('builderSuggestions').hidden=true});
Promise.all([loadCatalog(),loadFacets()]).then(([data,facets])=>{identifyItems=(data.pedals||[]).filter(isCatalogEntry);identifyFacets=facets;renderIdentify()}).catch(e=>{$('resultMeta').textContent='Catalog unavailable';$('resultGrid').innerHTML='<div class="empty"><strong>Catalog unavailable</strong><p>The archive data could not be loaded.</p></div>';console.error(e)});
