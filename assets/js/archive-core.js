// The Dirt Archive shared browser runtime.
// Keep catalog identity, escaping, URLs, and loading here.
// Page-specific files should focus only on rendering and interaction.

const ARCHIVE_DATA_INDEX = new URL('./research/PEDAL_INDEX.json', location.href).href;
const ARCHIVE_FACETS_INDEX = new URL('./research/PEDAL_FACETS.json', location.href).href;
const ARCHIVE_DIRT_TYPES = Object.freeze(['All', 'Overdrive', 'Distortion', 'Fuzz']);

const $ = id => document.getElementById(id);

function markCurrentNavigation(){
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.siteNav a[href]').forEach(link=>{
    try{
      const target=(new URL(link.href,location.href).pathname.split('/').pop()||'index.html').toLowerCase();
      const active=target===current;
      link.classList.toggle('navActive',active);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    }catch{}
  });
}
markCurrentNavigation();

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function catalogKey(company, pedal) {
  return String(company ?? '') + '\u0000' + String(pedal ?? '');
}

function entryKey(entry) {
  return catalogKey(entry.company, entry.pedal);
}

function isLocalArchiveImage(item) {
  const value=String(item?.image||'').trim();
  return value.startsWith('./assets/pedals/') || value.startsWith('assets/pedals/');
}

function normalizeSearchText(value) {
  return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function isCatalogEntry(entry) {
  return entry?.catalog_role !== 'variation';
}

function detailUrl(entry, variation, type) {
  const url = new URL('./pedal-detail.html', location.href);
  url.searchParams.set('builder', entry.company);
  url.searchParams.set('pedal', entry.pedal);
  if (variation) url.searchParams.set('variation', variation);
  if (type && ARCHIVE_DIRT_TYPES.includes(type) && type !== 'All') url.searchParams.set('type', type);
  return url.href;
}

let archiveCatalogPromise = null;
let archiveFacetsPromise = null;

function loadFacets() {
  if (archiveFacetsPromise) return archiveFacetsPromise;

  archiveFacetsPromise = fetch(ARCHIVE_FACETS_INDEX, {cache: 'no-cache'})
    .then(response => {
      if (!response.ok) return {version: 1, records: {}, options: {}};
      return response.json();
    })
    .then(data => {
      if (!data || typeof data !== 'object' || typeof data.records !== 'object') {
        return {version: 1, records: {}, options: {}};
      }
      return data;
    })
    .catch(error => {
      console.warn('Technical facet index unavailable.', error);
      return {version: 1, records: {}, options: {}};
    });
  return archiveFacetsPromise;
}

function loadCatalog() {
  if (archiveCatalogPromise) return archiveCatalogPromise;

  archiveCatalogPromise = fetch(ARCHIVE_DATA_INDEX, {cache: 'no-cache'})
    .then(response => {
      if (!response.ok) throw new Error('Catalog request failed: HTTP ' + response.status);
      return response.json();
    })
    .then(async data => {
      if (!data || !Array.isArray(data.pedals)) {
        throw new Error('Catalog payload is missing the pedals array.');
      }

      return data;
    })
    .catch(error => {
      archiveCatalogPromise = null;
      throw error;
    });

  return archiveCatalogPromise;
}

const LOCAL_WORKBENCH_KEY = 'dirt-archive-workbench-v1';

function readWorkbench(){
  try{
    const raw=localStorage.getItem(LOCAL_WORKBENCH_KEY);
    const data=raw?JSON.parse(raw):{};
    return {
      saved:Array.isArray(data.saved)?data.saved.filter(v=>typeof v==='string'):[],
      compare:Array.isArray(data.compare)?data.compare.filter(v=>typeof v==='string').slice(0,4):[]
    };
  }catch{
    return {saved:[],compare:[]};
  }
}

function writeWorkbench(data){
  try{
    localStorage.setItem(LOCAL_WORKBENCH_KEY,JSON.stringify({
      saved:[...new Set(data.saved||[])],
      compare:[...new Set(data.compare||[])].slice(0,4)
    }));
  }catch{}
}

function workbenchKey(entry){ return entryKey(entry); }

function isSaved(entry){
  return readWorkbench().saved.includes(workbenchKey(entry));
}

function toggleSaved(entry){
  const data=readWorkbench();
  const key=workbenchKey(entry);
  const index=data.saved.indexOf(key);
  if(index>=0)data.saved.splice(index,1);
  else data.saved.unshift(key);
  writeWorkbench(data);
  window.dispatchEvent(new CustomEvent('workbenchchange'));
  return index<0;
}

function compareState(){
  return readWorkbench().compare;
}

function isInCompare(entry){
  return compareState().includes(workbenchKey(entry));
}

function toggleCompare(entry){
  const data=readWorkbench();
  const key=workbenchKey(entry);
  const index=data.compare.indexOf(key);
  if(index>=0){
    data.compare.splice(index,1);
  }else{
    if(data.compare.length>=4)return {added:false,reason:'limit'};
    data.compare.push(key);
  }
  writeWorkbench(data);
  window.dispatchEvent(new CustomEvent('workbenchchange'));
  return {added:index<0,reason:null};
}

function clearCompare(){
  const data=readWorkbench();
  data.compare=[];
  writeWorkbench(data);
  window.dispatchEvent(new CustomEvent('workbenchchange'));
}

function clearSaved(){
  const data=readWorkbench();
  data.saved=[];
  writeWorkbench(data);
  window.dispatchEvent(new CustomEvent('workbenchchange'));
}

function workbenchCounts(){
  const data=readWorkbench();
  return {saved:data.saved.length,compare:data.compare.length};
}

function findWorkbenchEntries(items, keys){
  const byKey=new Map((items||[]).map(item=>[workbenchKey(item),item]));
  return (keys||[]).map(key=>byKey.get(key)).filter(Boolean);
}
