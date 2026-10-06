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

function combineEvidence(primary,structured){
  const first=String(primary||'').trim();
  const second=String(structured||'').trim();
  if(!first&&(!second||second===COMPARE_PLACEHOLDER))return '';
  if(!second||second===COMPARE_PLACEHOLDER)return first;
  if(!first||first===COMPARE_PLACEHOLDER)return second;
  return first+'\n\nStructured archive value: '+second;
}

function comparePhoto(item){
  const image=isLocalArchiveImage(item)?item.image:'';
  return image
    ? '<img class="comparePhoto" src="'+esc(image)+'" alt="'+esc(item.company+' '+item.pedal)+' pedal">'
    : '<div class="noPhoto">No exact archive photo</div>';
}

function versionFamilyLabel(item){
  const raw=String(item?.version_of||'').trim();
  if(!raw)return COMPARE_PLACEHOLDER;
  const parts=raw.split('\u0000');
  return parts.length===2 ? parts[0]+' · '+parts[1] : raw;
}

function compareLinks(item){
  const source=item.source_page ? '<a class="action" href="'+esc(item.source_page)+'" target="_blank" rel="noopener">Source page</a>' : '';
  const detail='<a class="action" href="'+esc(detailUrl(item,null,''))+'">Open record</a>';
  const remove='<button class="action compareRemove" type="button" data-remove-builder="'+esc(item.company)+'" data-remove-pedal="'+esc(item.pedal)+'" aria-label="Remove '+esc(item.company+' '+item.pedal)+' from comparison">Remove</button>';
  return detail+source+remove;
}

function parseResearchSections(markdown){
  const sections=[];
  let current=null;
  for(const line of String(markdown||'').split(/\r?\n/)){
    const heading=line.match(/^#{2,6}\s+(.+?)\s*$/);
    if(heading){
      if(current)current.text=current.lines.join('\n').trim();
      current={title:heading[1].trim(),lines:[]};
      sections.push(current);
    }else if(current){
      current.lines.push(line);
    }
  }
  if(current)current.text=current.lines.join('\n').trim();
  return sections.filter(section=>section.text);
}

function normalizeHeading(value){
  return String(value||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
}

function findSection(sections, aliases){
  const wanted=aliases.map(normalizeHeading);
  return sections.find(section=>{
    const title=normalizeHeading(section.title);
    return wanted.some(alias=>title===alias||title.startsWith(alias+' ')||title.includes(alias));
  })?.text||'';
}

function formatInlineResearch(text){
  let safe=esc(String(text||''));
  safe=safe.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  safe=safe.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
  return safe;
}

function formatResearchText(text){
  const raw=String(text||'').trim();
  if(!raw)return '<div class="compareMuted">'+COMPARE_PLACEHOLDER+'</div>';
  const lines=raw.split(/\r?\n/);
  const chunks=[];
  let bullets=[];
  const flushBullets=()=>{
    if(!bullets.length)return;
    chunks.push('<ul>'+bullets.map(line=>'<li>'+formatInlineResearch(line.replace(/^\s*[-*]\s+/,'').trim())+'</li>').join('')+'</ul>');
    bullets=[];
  };
  for(const line of lines){
    const trimmed=line.trim();
    if(!trimmed){flushBullets();continue}
    if(/^[-*]\s+/.test(trimmed)){bullets.push(trimmed);continue}
    flushBullets();
    chunks.push('<p>'+formatInlineResearch(trimmed)+'</p>');
  }
  flushBullets();
  return '<div class="compareResearch">'+chunks.join('')+'</div>';
}

function compactCompareText(text,maxChars=720){
  const value=String(text||'').trim();
  if(!value)return '<div class="compareMuted">'+COMPARE_PLACEHOLDER+'</div>';
  if(value.length<=maxChars)return formatResearchText(value);
  const clipped=value.slice(0,maxChars).replace(/\s+\S*$/,'').trim();
  return '<details class="compareDetails"><summary>'+formatInlineResearch(clipped)+'… <span>read full</span></summary>'+formatResearchText(value)+'</details>';
}

function technicalFallback(sections,group){
  return group==='transistor'
    ? findSection(sections,['transistor','semiconductor','device architecture','technology'])
    : findSection(sections,['diode','clipping','rectifier']);
}

function researchRecordUrl(item){
  const raw=String(item?.research_record||'').trim();
  if(!raw)return null;
  try{return new URL(raw.replace(/^\.\//,''),location.href).href}catch{return null}
}

async function loadResearchRecord(item){
  const url=researchRecordUrl(item);
  if(!url)return {sections:[],error:'No research record path is attached to this catalog entry.'};
  try{
    const response=await fetch(url,{cache:'no-cache'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    return {sections:parseResearchSections(await response.text()),url};
  }catch(error){
    console.warn('Research record unavailable for comparison',item.company,item.pedal,error);
    return {sections:[],url,error:String(error?.message||error)};
  }
}

function buildResearchRows(item,research){
  const sections=research.sections||[];
  const rows=[];
  const add=(label,text,options={})=>rows.push({label,text:text||'',group:options.group||null,kind:options.kind||'text',link:options.link||null});
  const addGroup=label=>rows.push({group:label});

  addGroup('Identity');
  add('Photo','',{kind:'photoImage'});
  add('Builder',item.company);
  add('Dirt type',compareText(item.types));
  add('Catalog role',String(item.catalog_role||'model').trim());
  add('Version label',String(item.version_label||'').trim());
  add('Parent / base model',String(item.version_of||'').trim()||COMPARE_PLACEHOLDER);
  add('Catalog identity',findSection(sections,['prp identity']));
  add('What this pedal is',findSection(sections,['what this pedal is','verified description','description','overview']));
  add('Version / factory options',findSection(sections,['versions and factory options','versions and options','factory options']));
  add('Version changes',findSection(sections,['version changes','revision changes','changes']));
  add('Version family',versionFamilyLabel(item));

  addGroup('Controls & Electronics');
  add('Controls / hardware',findSection(sections,['controls and architecture','controls and hardware','verified controls and hardware','controls']));
  add('Circuit / architecture',findSection(sections,['circuit / architecture','circuit architecture','circuit','architecture','device architecture']));
  const transistorFacet=compareFacet(item,'transistor');
  add('Transistor / device type',transistorFacet===COMPARE_PLACEHOLDER?technicalFallback(sections,'transistor'):transistorFacet);
  const clippingFacet=compareFacet(item,'clipping');
  add('Clipping / diode',combineEvidence(findSection(sections,['diode','clipping','rectifier']),clippingFacet));
  const powerFacet=compareFacet(item,'power');
  add('Power',combineEvidence(findSection(sections,['power','power supply','power requirements','power input','operating voltage']),powerFacet));

  addGroup('Tone & Use');
  add('Sound / character',findSection(sections,['sound','tone','sonic character','character']));
  add('Features / applications',findSection(sections,['features','applications','application','use cases']));
  add('Performance / behavior',findSection(sections,['performance','behavior','response']));

  addGroup('History & Editions');
  add('History / lineage',findSection(sections,['history','lineage','origin','development']));
  add('Colorways / editions',findSection(sections,['colorways','colorways / editions','editions','finishes']));
  add('Related versions',findSection(sections,['related versions','related models','related pedals']));

  addGroup('Evidence & Media');
  add('Research status',String(item.research_level||'').trim()+(item.deep_research_status?' · '+String(item.deep_research_status).trim():''));
  add('Archived photo',isLocalArchiveImage(item)?'Yes':'No',{kind:'photo'});
  add('Representative demo',item.youtube_demo?.url?item.youtube_demo.title||'Watch demo':'',{kind:'demo',link:item.youtube_demo?.url||null});
  add('Source page',item.source_page||'',{kind:'link',link:item.source_page||null});
  add('Sources checked',findSection(sections,['sources checked','sources','references']));
  add('Photo notes',findSection(sections,['photo']));

  const knownTitles=new Set([
    'prp identity','what this pedal is','verified description','description','overview',
    'versions and factory options','versions and options','factory options','version changes','revision changes','changes',
    'controls and architecture','controls and hardware','verified controls and hardware','controls',
    'circuit architecture','circuit','architecture','device architecture',
    'transistor','semiconductor','technology','diode','clipping','rectifier',
    'power','power supply','power requirements','power input','operating voltage',
    'sound','tone','sonic character','character','features','applications','application','use cases',
    'performance','behavior','response','history','lineage','origin','development',
    'colorways','colorways editions','editions','finishes','related versions','related models','related pedals',
    'sources checked','sources','references','photo'
  ].map(normalizeHeading));
  const extras=sections.filter(section=>!knownTitles.has(normalizeHeading(section.title)));
  if(extras.length){
    addGroup('Other documented research');
    for(const section of extras)add(section.title,section.text);
  }
  return rows;
}

function renderCell(row,item){
  if(row.kind==='photoImage')return comparePhoto(item);
  if(row.kind==='photo')return '<div class="compareValue compareStatus">'+esc(row.text||COMPARE_PLACEHOLDER)+'</div>';
  if(row.kind==='demo')return row.link?'<a class="action" href="'+esc(row.link)+'" target="_blank" rel="noopener">'+esc(row.text||'Watch demo')+'</a>':'<div class="compareMuted">'+COMPARE_PLACEHOLDER+'</div>';
  if(row.kind==='link')return row.link?'<a class="sourceLink" href="'+esc(row.link)+'" target="_blank" rel="noopener">'+esc(row.link)+'</a>':'<div class="compareMuted">'+COMPARE_PLACEHOLDER+'</div>';
  return compactCompareText(row.text);
}


function comparisonValueKey(value){
  return String(value||'').replace(/\s+/g,' ').trim().toLowerCase();
}

function compactInsightValue(value,maxChars=180){
  const clean=String(value||'').replace(/\s+/g,' ').trim();
  if(!clean||clean===COMPARE_PLACEHOLDER.toLowerCase()||clean===COMPARE_PLACEHOLDER)return COMPARE_PLACEHOLDER;
  if(clean.length<=maxChars)return clean;
  return clean.slice(0,maxChars).replace(/\s+\S*$/,'').trim()+'…';
}

function buildComparisonMatrix(items){
  const byLabel=new Map();
  const groups=[];
  items.forEach((item,itemIndex)=>{
    const rows=buildResearchRows(item,item.__research||{sections:[]});
    let currentGroup='';
    for(const row of rows){
      if(row.group){
        currentGroup=row.group;
        if(!groups.includes(currentGroup))groups.push(currentGroup);
        continue;
      }
      if(!byLabel.has(row.label))byLabel.set(row.label,{label:row.label,group:currentGroup,values:new Array(items.length).fill('')});
      byLabel.get(row.label).values[itemIndex]=row.text||'';
    }
  });
  return {groups,rows:[...byLabel.values()]};
}

function renderCompareInsights(items,researchResults){
  const root=document.getElementById('compareInsights');
  const strip=document.getElementById('compareEvidenceStrip');
  const grid=document.getElementById('compareInsightGrid');
  if(!root||!strip||!grid||!items.length){if(root)root.hidden=true;return;}

  items.forEach((item,index)=>{item.__research=researchResults[index].research;});
  const {rows}=buildComparisonMatrix(items);

  const evidence=items.map((item,index)=>{
    const research=researchResults[index].research;
    const techKeys=['transistor','clipping','power'].filter(group=>{
      const record=facetRecords.get(entryKey(item))||{};
      return Array.isArray(record[group])&&record[group].length;
    });
    const status=String(item.research_level||'').trim()||'Not documented';
    const verified=String(item.deep_research_status||'').trim();
    return '<article class="compareEvidenceCard">'+
      '<strong>'+esc(item.pedal)+'</strong>'+
      '<span>'+esc(item.company)+'</span>'+
      '<div class="compareEvidenceFacts">'+
        '<span><b>'+esc(status)+'</b> research'+(verified?' · '+esc(verified):'')+'</span>'+
        '<span><b>'+techKeys.length+'</b> structured tech groups</span>'+
        '<span><b>'+(isLocalArchiveImage(item)?'YES':'NO')+'</b> exact photo</span>'+
        '<span><b>'+(item.source_page?'YES':'NO')+'</b> source page</span>'+
      '</div>'+
    '</article>';
  }).join('');
  strip.innerHTML=evidence;

  const meaningful=rows.filter(row=>{
    const vals=row.values.map(v=>String(v||'').trim()).map(v=>v||COMPARE_PLACEHOLDER);
    const keys=vals.map(comparisonValueKey).filter(v=>v!==comparisonValueKey(COMPARE_PLACEHOLDER));
    return new Set(keys).size>0;
  });

  const shared=meaningful.filter(row=>{
    const vals=row.values.map(v=>String(v||'').trim()||COMPARE_PLACEHOLDER);
    const known=vals.filter(v=>comparisonValueKey(v)!==comparisonValueKey(COMPARE_PLACEHOLDER));
    return known.length===items.length&&new Set(known.map(comparisonValueKey)).size===1;
  }).slice(0,8);

  const differences=meaningful.filter(row=>{
    const vals=row.values.map(v=>String(v||'').trim()||COMPARE_PLACEHOLDER);
    const known=vals.filter(v=>comparisonValueKey(v)!==comparisonValueKey(COMPARE_PLACEHOLDER));
    return known.length>=2&&new Set(known.map(comparisonValueKey)).size>1;
  }).slice(0,8);

  const gaps=rows.filter(row=>{
    const vals=row.values.map(v=>String(v||'').trim()||COMPARE_PLACEHOLDER);
    const missing=vals.filter(v=>comparisonValueKey(v)===comparisonValueKey(COMPARE_PLACEHOLDER)).length;
    return missing>0&&missing<items.length;
  }).slice(0,8);

  const card=(title,eyebrow,list,emptyText,kind)=>{
    const body=list.length ? list.map(row=>{
      const values=row.values.map((v,i)=>'<div class="insightItem"><span>'+esc(items[i].pedal)+'</span><p>'+esc(compactInsightValue(v))+'</p></div>').join('');
      return '<article class="insightRow"><div class="insightLabel"><span class="insightKind '+kind+'"></span><strong>'+esc(row.label)+'</strong></div><div class="insightValues">'+values+'</div></article>';
    }).join('') : '<div class="insightEmpty">'+esc(emptyText)+'</div>';
    return '<section class="compareInsightCard"><div class="insightCardHead"><span class="label">'+esc(eyebrow)+'</span><h3>'+esc(title)+'</h3></div>'+body+'</section>';
  };

  grid.innerHTML=[
    card('Shared evidence','COMMON GROUND',shared,'No fully shared documented fields surfaced yet.','shared'),
    card('Where they differ','KEY DIFFERENCES',differences,'No documented field-level differences surfaced yet.','different'),
    card('Where the archive is still quiet','DOCUMENTATION GAPS',gaps,'Both records are documented for the fields checked here.','gap')
  ].join('');
  root.hidden=false;
}

function csvEscape(value){
  const text=String(value??'');
  return '"'+text.replaceAll('"','""')+'"';
}

function exportComparisonCsv(items,researchResults){
  if(!items.length)return;
  const rowMap=new Map();
  for(const [index,item] of items.entries()){
    const rows=buildResearchRows(item,researchResults[index].research);
    for(const row of rows){
      if(row.group)continue;
      if(!rowMap.has(row.label))rowMap.set(row.label,new Array(items.length).fill(''));
      rowMap.get(row.label)[index]=row.text||'';
    }
  }
  const lines=[['Field',...items.map(item=>item.pedal+' · '+item.company)].map(csvEscape).join(',')];
  for(const [label,values] of rowMap)lines.push([label,...values].map(csvEscape).join(','));
  const blob=new Blob([lines.join('\\r\\n')+'\\r\\n'],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download='dirt-department-comparison.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function renderComparison(items,facets,researchResults){
  facetRecords=new Map(Object.entries(facets?.records||{}));
  const wrap=document.getElementById('comparisonWrap');
  const empty=document.getElementById('empty');
  const meta=document.getElementById('compareMeta');
  if(!items.length){
    empty.hidden=false;wrap.hidden=true;meta.textContent='0 exact records selected';
    return;
  }
  empty.hidden=true;wrap.hidden=false;
  const failed=researchResults.filter(result=>result.research?.error).length;
  meta.textContent=items.length+' exact record'+(items.length===1?'':'s')+' selected · '+(failed?'Some research notes unavailable':'Research notes loaded')+' · compare documented differences, not opinions.';

  document.getElementById('comparisonHead').innerHTML='<tr><th scope="col">Field</th>'+items.map(item=>
    '<th scope="col"><span class="comparePedalName">'+esc(item.pedal)+'</span><span class="compareBuilder">'+esc(item.company)+'</span><div class="compareLinks">'+compareLinks(item)+'</div></th>'
  ).join('')+'</tr>';

  document.querySelectorAll('[data-remove-builder]').forEach(button=>{
    button.onclick=()=>{
      const item=items.find(x=>x.company===button.dataset.removeBuilder&&x.pedal===button.dataset.removePedal);
      if(item)toggleCompare(item);
    };
  });

  const matrix=buildComparisonMatrix(researchResults.map((result,index)=>Object.assign(items[index],{__research:result.research})));
  let body='';
  let activeGroup='';
  matrix.rows.forEach(row=>{
    if(row.group!==activeGroup){
      activeGroup=row.group;
      body+='<tr class="compareGroup"><th scope="row" colspan="'+(items.length+1)+'">'+esc(activeGroup)+'</th></tr>';
    }
    body+='<tr><th scope="row">'+esc(row.label)+'</th>'+items.map((item,index)=>'<td>'+renderCell({label:row.label,text:row.values[index]},item)+'</td>').join('')+'</tr>';
  });
  document.getElementById('comparisonBody').innerHTML=body;
  renderCompareInsights(items,researchResults);
}

async function loadAndRenderComparison(allItems,facets){
  const selected=readWorkbench().compare;
  const items=findWorkbenchEntries(allItems,selected).filter(isCatalogEntry);
  if(!items.length){
    renderComparison([],facets,[]);
    return;
  }
  const researchResults=await Promise.all(items.map(async item=>({item,research:await loadResearchRecord(item)})));
  renderComparison(items,facets,researchResults);
}

Promise.all([loadCatalog(),loadFacets()])
.then(async([data,facets])=>{
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
  await loadAndRenderComparison(allItems,facets);
  document.getElementById('exportCompare')?.addEventListener('click',async()=>{
    const selected=readWorkbench().compare;
    const compareItems=findWorkbenchEntries(allItems,selected).filter(isCatalogEntry);
    const research=await Promise.all(compareItems.map(async item=>({item,research:await loadResearchRecord(item)})));
    exportComparisonCsv(compareItems,research);
  });
  document.getElementById('copyCompareLink')?.addEventListener('click',()=>{
    const currentSelection=readWorkbench().compare;
    const currentItems=findWorkbenchEntries(allItems,currentSelection).filter(isCatalogEntry);
    copyComparisonLink(currentItems);
  });
})
.catch(error=>{
  document.getElementById('compareMeta').textContent='Comparison data could not be loaded.';
  console.error(error);
});

document.getElementById('clearCompare')?.addEventListener('click',()=>{
  clearCompare();
  const empty=document.getElementById('empty');
  const wrap=document.getElementById('comparisonWrap');
  empty.hidden=false;wrap.hidden=true;
  document.getElementById('compareInsights')?.setAttribute('hidden','');
  document.getElementById('compareMeta').textContent='0 exact records selected';
});

window.addEventListener('workbenchchange',async()=>{
  try{
    const data=await loadCatalog();
    const facets=await loadFacets();
    await loadAndRenderComparison(data.pedals||[],facets);
  }catch(error){
    console.error('Could not refresh comparison',error);
  }
});
