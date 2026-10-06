const detailParams = new URLSearchParams(location.search);
const wantedBuilder = detailParams.get('builder') || '';
const wantedPedal = detailParams.get('pedal') || '';
let wantedVariation = detailParams.get('variation') || '';
let wantedType = detailParams.get('type') || '';
if(!ARCHIVE_DIRT_TYPES.includes(wantedType))wantedType='';

function initializeDetailNavDrawer(){
  const drawer=document.querySelector('.detailNavDrawer');
  if(!drawer)return;
  drawer.open=window.matchMedia('(min-width:1001px)').matches;
}
initializeDetailNavDrawer();

function restoreReturnLink(){
  const link=document.querySelector('.back');
  if(!link)return;
  const fallback=new URL('./index.html',location.href);
  const referrer=document.referrer;
  if(referrer){
    try{
      const url=new URL(referrer);
      const sameOrigin=url.origin===location.origin;
      const archivePath=new URL('./index.html',location.href).pathname;
      if(sameOrigin && url.pathname===archivePath){
        link.href=url.href;
        link.textContent='← Back to results';
        return;
      }
    }catch(e){
      console.warn('Could not restore archive return link.',e);
    }
  }
  link.href=fallback.href;
  link.textContent='← Back to the archive';
}

function contextIndexUrl(){
  const url=new URL('./index.html',location.href);
  if(wantedType)url.searchParams.set('type',wantedType);
  return url;
}

function renderDetailNavState(currentItem=null){
  const state=$('detailNavState');
  if(!state)return;
  const parts=[];
  if(wantedType)parts.push(wantedType);
  if(currentItem?.company)parts.push(currentItem.company);
  state.textContent=parts.length?parts.join(' · '):'All builders';
}

function renderPageNav(items,currentItem=null){
  const scopedItems=items.filter(x=>isCatalogEntry(x)&&(!wantedType || (x.types||[]).includes(wantedType)));
  const builders=[...new Set(scopedItems.map(x=>x.company))].sort((a,b)=>a.localeCompare(b));
  renderDetailNavState(currentItem);
  const currentTypes=new Set(currentItem?.types||[]);
  const search=$('pageSearch');
  if(search){
    search.value='';
    search.onkeydown=e=>{
      if(e.key!=='Enter')return;
      const q=e.target.value.trim();
      const url=contextIndexUrl();
      if(q)url.searchParams.set('q',q);
      url.searchParams.delete('builder');
      location.href=url.href;
    };
  }
  const types=ARCHIVE_DIRT_TYPES.map(t=>[t,t==='All'?'All Pedals':t]);
  $('pageTypeMenu').innerHTML=types.map(([t,label])=>{
    const url=new URL('./index.html',location.href);
    if(t!=='All')url.searchParams.set('type',t);
    const active=currentItem ? (t!=='All' && currentTypes.has(t)) : t==='All';
    return '<a class="pageTypeLink '+(active?'active':'')+'" href="'+url.href+'"'+(active?' aria-current="page"':'')+'>'+label+'</a>';
  }).join('');
  $('pageBuilders').innerHTML=
    '<a class="pageBuilderLink '+(!wantedBuilder?'active':'')+'" href="'+contextIndexUrl().href+'">All builders<strong>'+builders.length+'</strong></a>'+
    builders.map(name=>{
      const url=contextIndexUrl();
      url.searchParams.set('builder',name);
      const count=scopedItems.filter(x=>x.company===name).length;
      return '<a class="pageBuilderLink '+(name===wantedBuilder?'active':'')+'" href="'+url.href+'">'+esc(name)+'<strong>'+count+'</strong></a>';
    }).join('');
}

function decodeResearchEntities(value){
  return String(value||'')
    .replace(/&ndash;|&mdash;/gi,'—')
    .replace(/&nbsp;/gi,' ')
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&#x27;/gi,"'")
    .replace(/&amp;/gi,'&')
    .replace(/&lt;/gi,'<')
    .replace(/&gt;/gi,'>');
}

function isResearchSourceCitation(line){
  return /^\s*\d+\.\s+.+https?:\/\//i.test(String(line||''));
}

function isObviousScrapeResidue(line){
  const value=String(line||'');
  const lower=value.toLowerCase();
  if(/skip to (?:main )?content/.test(lower))return true;
  if(/var\s+productimageandprice|mmmenus?trings|data-rte-preserve-empty|\\<\\\/?(?:p|div|span|strong|em)\b|["']variants["']\s*:\s*\[/i.test(value))return true;
  if(/home\s*\/\s*blog\s*\/|home\s+blog\s+categories\s+authors\s+about/.test(lower))return true;
  if(/home\s+store\b.*\b(?:faqs?|terms|about)\b.*\b(?:dealers|contact)\b.*\b(?:basket|cart)\b.*\bhome\s*\/\s*(?:pedals?|products?)\s*\//i.test(value))return true;
  if(/country\/region\s+[^|]+\|\s*(?:usd|cad|eur|gbp|aud|jpy|cny)\b/i.test(value))return true;
  if(/(?:javascript is disabled|show me how to enable it|listen online for free on soundcloud)/i.test(value))return true;
  if(/(?:your cart is empty|your cart loading|estimated total|select currency|add to (?:wish|shopping) list|continue shopping)/i.test(lower))return true;
  if(/(?:regular price\s*[$€£]|shipping calculated at checkout|add to cart|shopping cart|buy now|free shipping|(?:^|\s)out of stock(?:\s|$)|(?:^|\s)available:\s*in stock\b)/i.test(value))return true;
  if(value.length>1800 && /\b(?:home|search|login|log in|menu|categories|brands|shop by|related tags|related brands)\b/i.test(value))return true;
  return false;
}


function cleanSourceLabel(label,url){
  let value=decodeResearchEntities(String(label||'')).replace(/\s+/g,' ').trim();
  let host='';
  try{host=new URL(url,location.href).hostname.replace(/^www\./,'').toLowerCase()}catch(e){}
  const navNoise=/(?:facebook|youtube|instagram|tiktok|threads)\b.*(?:facebook|youtube|instagram|tiktok|threads)\b|(?:mobile gift card|gear card|menu|search|login|account).*(?:facebook|youtube|instagram|tiktok|threads)/i;
  if(!value)return host||'Source';
  if(value.length>120 || navNoise.test(value)){
    const known={
      'guitarcenter.com':'Guitar Center',
      'sweetwater.com':'Sweetwater',
      'musicradar.com':'MusicRadar',
      'reverb.com':'Reverb',
      'robertkeeley.com':'Keeley Electronics',
      'perfectcircuit.com':'Perfect Circuit'
    };
    return known[host]||host||value.slice(0,96).replace(/\s+$/,'')+'…';
  }
  return value;
}

function renderMarkdown(md){
  const rawLines=String(md||'').split(/\r?\n/);
  const lines=rawLines.map(line=>isResearchSourceCitation(line)?decodeResearchEntities(line):decodeResearchEntities(line))
    .filter(line=>!isObviousScrapeResidue(line));
  const hidden=new Set(['research confidence','photo','prp identity','sources checked','sources','deep research verification']);
  let html='',inList=false,skip=false;
  const inline=s=>{
    let value=esc(s)
      .replace(/\s*\[\d+\]/g,'')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\x60(.+?)\x60/g,'<code>$1</code>');
    value=value.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,(match,label,url)=>
      '<a class="sourceLink" href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>'
    );
    return value.replace(/(https?:\/\/[^\s<]+)/g, url=>{
      const trailing=(url.match(/[),.;!?]+$/)||[''])[0];
      const href=trailing?url.slice(0,-trailing.length):url;
      return '<a class="sourceLink" href="'+href+'" target="_blank" rel="noopener noreferrer">'+href+'</a>'+trailing;
    });
  };
  for(const line of lines){
    const sourceMatch=line.match(/^\s*\d+\.\s+(https?:\/\/[^\s]+)(?:\s+[—-]\s+(.+))?\s*$/);
    const labeledSourceMatch=line.match(/^\s*\d+\.\s+(.+?)\s*[:;-]\s+(https?:\/\/[^\s]+)\s*$/);
    if((sourceMatch||labeledSourceMatch)&&!skip){
      if(inList){html+='</ul>';inList=false}
      const rawUrl=(sourceMatch?.[1]||labeledSourceMatch?.[2]||'').replace(/[),.;!?]+$/,'');
      const label=cleanSourceLabel(labeledSourceMatch
        ? labeledSourceMatch[1].trim()
        : rawUrl.replace(/^https?:\/\//,'').split('/')[0],rawUrl);
      const description=sourceMatch?.[2] ? ' — '+inline(sourceMatch[2]) : '';
      html+='<p class="sourceRow"><a class="sourceLink" href="'+esc(rawUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>'+description+'</p>';
      continue;
    }
    if(/^## /.test(line)){
      if(inList){html+='</ul>';inList=false}
      const heading=line.slice(3).trim().toLowerCase();
      skip=hidden.has(heading);
      if(skip)continue;
      html+='<h2>'+inline(line.slice(3))+'</h2>';
      continue;
    }
    if(skip)continue;
    if(/^### /.test(line)){if(inList){html+='</ul>';inList=false}html+='<h3>'+inline(line.slice(4))+'</h3>';continue}
    if(/^# /.test(line)){if(inList){html+='</ul>';inList=false}continue}
    if(/^- /.test(line)){
      const listText=line.slice(2).trim().toLowerCase();
      if(listText.startsWith('**research confidence:**') || listText.startsWith('**sources checked:**'))continue;
      if(!inList){html+='<ul>';inList=true}
      html+='<li>'+inline(line.slice(2))+'</li>';
      continue
    }
    if(!line.trim()){if(inList){html+='</ul>';inList=false}continue}
    if(inList){html+='</ul>';inList=false}
    html+='<p>'+inline(line)+'</p>';
  }
  if(inList)html+='</ul>';
  return html;
}

function showPhoto(item,label){
  const box=$('photoBox');
  const identityName=label||item?.pedal||'Pedal';
  const identityBuilder=item?.company||'Builder not recorded';
  const fallbackMarkup='<span class="photoFallback"><span class="photoFallbackEyebrow">Exact photo not archived</span><strong>'+esc(identityName)+'</strong><span>'+esc(identityBuilder)+'</span></span>';
  if(item && item.image){
    box.classList.add('photoHasImage');
    box.innerHTML='<img class="photoImage" src="'+esc(item.image)+'" alt="'+esc(item.company+' '+item.pedal+(label?' '+label:''))+'" decoding="async" referrerpolicy="no-referrer">'+fallbackMarkup;
    const image=box.querySelector('.photoImage');
    const fallback=box.querySelector('.photoFallback');
    fallback.hidden=true;
    image.addEventListener('error',()=>{
      image.hidden=true;
      fallback.hidden=false;
      box.classList.remove('photoHasImage');
    });
  }else{
    box.classList.remove('photoHasImage');
    box.innerHTML=fallbackMarkup;
  }
}

function wireThumbnailFallbacks(selector){
  document.querySelectorAll(selector).forEach(image=>{
    const fallback=image.parentElement?.querySelector('.thumbFallback');
    const showFallback=()=>{
      image.hidden=true;
      if(fallback)fallback.hidden=false;
    };
    image.addEventListener('error',showFallback,{once:true});
    if(image.complete && image.naturalWidth===0)showFallback();
  });
}

function renderColorways(item, colorways){
  if(!colorways.length){$('colorwaysSection').hidden=true;return}
  $('colorwaysSection').hidden=false;
  $('colorways').innerHTML=colorways.map((v,i)=>{
    const name=v.variation_name||v.pedal||('Variation '+(i+1));
    const media=v.image
      ? '<img src="'+esc(v.image)+'" alt="'+esc(item.company+' '+name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="thumbFallback" hidden aria-hidden="true"></span>'
      : '<span aria-label="Photo unavailable"></span>';
    return '<button class="colorwayCard" type="button" data-variation="'+esc(name)+'" aria-pressed="false">'+
      '<span class="colorwayThumb">'+media+'</span><span class="colorwayName">'+esc(name)+'</span>'+
    '</button>';
  }).join('');
  wireThumbnailFallbacks('.colorwayThumb img');
  const buttons=[...document.querySelectorAll('[data-variation]')];
  buttons.forEach(btn=>{
    btn.onclick=()=>{
      const name=btn.dataset.variation;
      const v=colorways.find(x=>(x.variation_name||x.pedal)===name);
      showPhoto(v||item,name);
      wantedVariation=name;
      const url=new URL(location.href);
      url.searchParams.set('variation',name);
      history.replaceState({},'',url.href);
      buttons.forEach(b=>{
        b.classList.remove('selected');
        b.setAttribute('aria-pressed','false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed','true');
    };
  });
  if(wantedVariation){
    const active=buttons.find(b=>b.dataset.variation===wantedVariation);
    if(active)active.click();
  }
}

function renderVersionFamily(item, allItems){
  const section=$('versionFamilySection');
  const target=$('versionFamily');
  if(!section||!target)return;
  const parentKey=String(item?.version_of||'').trim();
  const parent=parentKey ? allItems.find(x=>isCatalogEntry(x)&&entryKey(x)===parentKey) : null;
  const children=allItems.filter(x=>isCatalogEntry(x)&&x.version_of===entryKey(item)&&entryKey(x)!==entryKey(item));
  if(!parent&&!children.length){section.hidden=true;target.innerHTML='';return}
  const parentLink=parent
    ? '<a class="familyParent" href="'+esc(detailUrl(parent,null,wantedType))+'"><span class="familyRole">Parent record</span><strong>'+esc(parent.pedal)+'</strong><span>'+esc(parent.company)+'</span></a>'
    : '<div class="familyParent current"><span class="familyRole">Base record</span><strong>'+esc(item.pedal)+'</strong><span>'+esc(item.company)+'</span></div>';
  const siblingHtml=children.length
    ? '<div class="familySiblings"><span class="familyRole">Documented versions from this record</span>'+children.map(v=>'<a class="familySibling" href="'+esc(detailUrl(v,null,wantedType))+'">'+esc(v.version_label||v.pedal)+'</a>').join('')+'</div>'
    : '';
  target.innerHTML=parentLink+siblingHtml;
  section.hidden=false;
}

function renderFamily(item, allItems){
  const section=$('familySection'),card=$('familyCard');
  if(!section||!card)return;
  if(!item?.version_of){section.hidden=true;card.innerHTML='';return}
  const parent=allItems.find(x=>isCatalogEntry(x)&&entryKey(x)===item.version_of);
  if(!parent){section.hidden=true;card.innerHTML='';return}
  const type=(wantedType&&parent.types?.includes(wantedType))?wantedType:'';
  card.innerHTML='<a class="familyCardLink" href="'+esc(detailUrl(parent,null,type))+'"><span class="familyCardEyebrow">Parent model</span><strong>'+esc(parent.pedal)+'</strong><span>'+esc(parent.company)+'</span></a>';
  section.hidden=false;
}

function renderRelated(allItems,item){
  const section=$('relatedSection');
  const target=$('related');
  if(!section||!target)return;

  const currentKey=entryKey(item);
  const currentTypes=new Set(item?.types||[]);
  const sameBuilder=allItems.filter(x=>
    isCatalogEntry(x) &&
    x.company===item.company &&
    entryKey(x)!==currentKey &&
    !x.catalog_role
  );

  sameBuilder.sort((a,b)=>{
    const aType=a.types?.some(t=>currentTypes.has(t))?0:1;
    const bType=b.types?.some(t=>currentTypes.has(t))?0:1;
    if(aType!==bType)return aType-bType;
    return String(a.pedal).localeCompare(String(b.pedal));
  });

  const related=sameBuilder.slice(0,6);
  if(!related.length){
    section.hidden=true;
    target.innerHTML='';
    return;
  }

  target.innerHTML=related.map(x=>{
    const media=isLocalArchiveImage(x)
      ? '<img src="'+esc(x.image)+'" alt="'+esc(x.company+' '+x.pedal)+' pedal" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
      : '<span>Exact photo not archived</span>';
    return '<a class="relatedCard" href="'+esc(detailUrl(x,null,wantedType))+'">'+
      '<span class="relatedThumb">'+media+'</span>'+
      '<span class="relatedName">'+esc(x.pedal)+'</span>'+
      '<span class="relatedBuilder">'+esc(x.company)+'</span>'+
    '</a>';
  }).join('');

  wireThumbnailFallbacks('.relatedThumb img');
  section.hidden=false;
}

function renderDemo(item){
  const demo=item.youtube_demo;
  if(!demo || !demo.url){$('demoSection').hidden=true;return}
  $('demoSection').hidden=false;
  $('demo').innerHTML='<span>'+esc(demo.title||'Best representative demo')+'</span>'+
    '<a class="action primary" href="'+esc(demo.url)+'" target="_blank" rel="noopener">Watch demo ↗</a>';
}

function syncWorkbenchButtons(item){
  const save=$('savePedal');
  const compare=$('comparePedal');
  const counts=workbenchCounts();
  if(save){
    const saved=isSaved(item);
    save.textContent=saved?'Saved to workbench':'Save pedal';
    save.setAttribute('aria-pressed',String(saved));
  }
  if(compare){
    const compared=isInCompare(item);
    compare.textContent=compared?'Comparing':'Compare';
    compare.classList.toggle('compareActive',compared);
    compare.setAttribute('aria-pressed',String(compared));
    compare.disabled=!compared && counts.compare>=4;
    compare.title=compare.disabled?'Comparison holds up to four exact records.':'';
  }
}
function wireWorkbenchButtons(item){
  $('savePedal')?.addEventListener('click',()=>{
    toggleSaved(item);
    syncWorkbenchButtons(item);
  });
  $('comparePedal')?.addEventListener('click',()=>{
    const result=toggleCompare(item);
    syncWorkbenchButtons(item);
    if(result.reason==='limit'){
      window.location.href='./compare.html';
    }
  });
  window.addEventListener('workbenchchange',()=>syncWorkbenchButtons(item));
  syncWorkbenchButtons(item);
}

function updateMetaDescription(item){
  const types=(item.types||[]).filter(Boolean).join(', ')||'guitar dirt';
  const title=item.pedal+' · The Dirt Archive';
  const description='Explore '+item.pedal+', a '+types+' pedal by '+item.company+', in The Dirt Archive.';
  const canonicalUrl=new URL('./pedal-detail.html',location.href);
  canonicalUrl.searchParams.set('builder',item.company);
  canonicalUrl.searchParams.set('pedal',item.pedal);
  const url=canonicalUrl.href;
  const image=item?.image && /^\.?\/assets\/pedals\//.test(String(item.image))
    ? new URL(String(item.image).replace(/^\.\//,''),location.href).href
    : '';
  const shareImage=image || new URL('./assets/dirt-archive-share.png',location.href).href;
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content',description);
  const canonical=document.querySelector('link[rel="canonical"]');
  if(canonical)canonical.setAttribute('href',url);
  document.title=title;
  for(const [selector,content] of [
    ['meta[property="og:title"]',title],
    ['meta[property="og:description"]',description],
    ['meta[property="og:url"]',url],
    ['meta[property="og:image"]',shareImage],
    ['meta[name="twitter:title"]',title],
    ['meta[name="twitter:description"]',description],
    ['meta[name="twitter:image"]',shareImage]
  ]){
    const el=document.querySelector(selector);
    if(el)el.setAttribute('content',content);
  }

  const structured=document.getElementById('pedalStructuredData');
  if(structured){
    structured.textContent=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'Product',
      name:item.pedal,
      brand:{'@type':'Brand',name:item.company},
      category:types,
      description:description,
      url:url,
      ...(image?{image:[image]}:{})
    });
  }
}


function renderSpecimenReadout(item,facets){
  const root=$('specimenReadout');
  const grid=$('specimenReadoutGrid');
  const note=$('specimenEvidenceNote');
  if(!root||!grid)return;
  const record=facets?.records?.[entryKey(item)]||{};
  const techGroups=['transistor','clipping','power'].filter(group=>Array.isArray(record[group])&&record[group].length);
  const value=(data,fallback='Not documented')=>{
    if(Array.isArray(data))return data.length?data.join(' · '):fallback;
    const text=String(data??'').trim();
    return text||fallback;
  };
  const source=item.source_page?'<a href="'+esc(item.source_page)+'" target="_blank" rel="noopener noreferrer">Source ↗</a>':'Not recorded';
  const fields=[
    ['Dirt type',value(item.types?.join(' · ')),'identity'],
    ['Version',value(item.version_label||((item.catalog_role||'model')==='model'?'Base record':item.catalog_role)),'identity'],
    ['Transistor',value(record.transistor),'tech'],
    ['Clipping',value(record.clipping),'tech'],
    ['Power',value(record.power),'tech'],
    ['Research',value(String(item.research_level||'').trim()+(item.deep_research_status?' · '+String(item.deep_research_status).trim():'')),'evidence'],
    ['Exact photo',isLocalArchiveImage(item)?'Archived locally':'Photo needed','evidence'],
    ['Demo',item.youtube_demo?.url?'Available':'Not documented','evidence']
  ];
  grid.innerHTML=fields.map(([label,text,kind])=>
    '<div class="specimenReadoutCard '+kind+'"><span>'+esc(label)+'</span><strong>'+esc(text)+'</strong></div>'
  ).join('')+
  '<div class="specimenReadoutCard source evidence"><span>Primary source</span><strong>'+source+'</strong></div>';
  if(note){
    note.textContent=techGroups.length
      ? techGroups.length+' structured technical '+(techGroups.length===1?'group':'groups')+' documented'
      : 'Technical details remain undocumented';
  }
  root.hidden=false;
}

function renderCatalogBaseline(item){
  const typeLabel=(item.types||[]).filter(Boolean).join(', ')||'Not classified';
  const source=String(item.source_page||'').trim();
  const hasLocalPhoto=typeof item.image==='string' && (item.image.startsWith('./assets/pedals/') || item.image.startsWith('assets/pedals/'));
  const sourceHtml=/^https?:\/\//i.test(source)
    ? '<a href="'+esc(source)+'" target="_blank" rel="noopener">'+esc(source)+'</a>'
    : '<span>Not recorded in catalog</span>';
  $('research').innerHTML=
    '<div class="catalogBaseline">'+
      '<p><strong>Catalog entry</strong></p>'+
      '<p><strong>'+esc(item.pedal)+'</strong> is cataloged as a '+esc(typeLabel)+' pedal by '+esc(item.company)+'.</p>'+
      '<p>Pedal information is being expanded as the archive grows. Undocumented specifications are not inferred.</p>'+
    '</div>';
}

function researchRecordUrl(path){
  const value=String(path||'');
  if(value.startsWith('http://') || value.startsWith('https://')) return new URL(value).href;
  const base=new URL('./',location.href);
  let relative=value;
  if(relative.startsWith('./')) relative=relative.slice(2);
  while(relative.startsWith('/')) relative=relative.slice(1);
  const encoded=relative.split('/').map(segment=>encodeURIComponent(segment)).join('/');
  return new URL(encoded,base).href;
}

async function loadResearchMarkdown(path){
  const researchUrl=researchRecordUrl(path);
  let lastError=null;
  for(let attempt=1;attempt<=3;attempt++){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),5000);
    try{
      const response=await fetch(researchUrl,{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('Research record request failed: HTTP '+response.status);
      const text=await response.text();
      if(!text.trim())throw new Error('Research record is empty.');
      // A small set of older research records was stored with literal escaped
      // newline sequences. Normalize that representation at the loading boundary
      // so the renderer sees real markdown line breaks without rewriting the
      // underlying archive records.
      const normalizedText = text.includes('\\n') ? text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n') : text;
      return normalizedText;
    }catch(error){
      lastError=error?.name==='AbortError'
        ? new Error('Research record request timed out.')
        : error;
      if(attempt<3)await new Promise(resolve=>setTimeout(resolve,150));
    }finally{
      clearTimeout(timeout);
    }
  }
  throw lastError||new Error('Research record request failed.');
}

restoreReturnLink();
$('sharePedal')?.addEventListener('click',sharePedal);

Promise.all([loadCatalog(),loadFacets()])
.then(([data,facets])=>{
  const allItems=data.pedals||[];
  let requested=allItems.find(x=>x.company===wantedBuilder&&x.pedal===wantedPedal);
  if(!requested){
    renderPageNav(allItems);
    document.title='Pedal not found · The Dirt Archive';
    $('empty').hidden=false;
    return;
  }

  let item=requested;
  let redirectedFromVariation=false;
  if(requested.catalog_role==='variation' && requested.parent_pedal){
    const parent=allItems.find(x=>x.company===requested.company&&x.pedal===requested.parent_pedal&&isCatalogEntry(x));
    if(parent){
      item=parent;
      wantedVariation=requested.variation_name||requested.pedal;
      redirectedFromVariation=true;
      const u=new URL(location.href);
      u.searchParams.set('builder',item.company);
      u.searchParams.set('pedal',item.pedal);
      if(wantedVariation)u.searchParams.set('variation',wantedVariation);
      history.replaceState({},'',u.href);
    }
  }

  if(wantedType && wantedType!=='All' && !(item.types||[]).includes(wantedType)) wantedType='';
  document.title=item.pedal+' · The Dirt Archive';
  updateMetaDescription(item);
  $('record').hidden=false;
  renderPageNav(allItems,item);
  $('crumb').textContent=(item.types||[]).join(' · ')+' · '+item.company;
  $('name').textContent=item.pedal;
  $('builder').textContent=item.company;
  const correctionUrl=new URL('./corrections.html',location.href);
  correctionUrl.searchParams.set('builder',item.company);
  correctionUrl.searchParams.set('pedal',item.pedal);
  if(!item.image)correctionUrl.searchParams.set('issue','photo');
  $('photoCorrectionLink')?.setAttribute('href',correctionUrl.href);
  const builderArchiveUrl=new URL('./builder.html',location.href);builderArchiveUrl.searchParams.set('builder',item.company);
  $('builderLink').href=builderArchiveUrl.href;
  const builderFilterUrl=contextIndexUrl();builderFilterUrl.searchParams.set('builder',item.company);$('builderFilterLink').href=builderFilterUrl.href;

  $('types').innerHTML=(item.types||[]).map(t=>'<span class="chip">'+esc(t)+'</span>').join('');
  showPhoto(item);
  wireWorkbenchButtons(item);
  renderSpecimenReadout(item,facets);

  const colorways=allItems.filter(x=>x.catalog_role==='variation'&&x.company===item.company&&x.parent_pedal===item.pedal);

  if(redirectedFromVariation){
    $('variationNotice').hidden=false;
    $('variationNotice').textContent='Showing '+wantedVariation+' as a variation of '+item.pedal+'.';
  }

  renderVersionFamily(item,allItems);
  renderColorways(item,colorways);
  renderFamily(item,allItems);
  renderDemo(item);
  renderRelated(allItems,item);

  const researchEl=$('research');
  if(item.research_record){
    loadResearchMarkdown(item.research_record)
      .then(md=>{
        researchEl.innerHTML=renderMarkdown(md);
      })
      .catch(e=>{
        researchEl.innerHTML='<p>Pedal information could not be loaded.</p>';
        console.error(e)
      })
  }else{
    renderRecordStatus(item);
    renderCatalogBaseline(item);
  }

  const link=contextIndexUrl();
  link.searchParams.set('builder',item.company);
  $('builderLink').href=link.href;
})
.catch(e=>{
  $('empty').hidden=false;
  $('empty').querySelector('p').textContent='The catalog data could not be loaded.';
  console.error(e);
});