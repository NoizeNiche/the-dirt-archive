const detailParams = new URLSearchParams(location.search);
const wantedBuilder = detailParams.get('builder') || '';
const wantedPedal = detailParams.get('pedal') || '';
let wantedVariation = detailParams.get('variation') || '';

function renderPageNav(items){
  const builders=[...new Set(items.filter(isCatalogEntry).map(x=>x.company))].sort((a,b)=>a.localeCompare(b));
  const search=$('pageSearch');
  if(search){
    search.value='';
    search.onkeydown=e=>{
      if(e.key!=='Enter')return;
      const q=e.target.value.trim();
      const url=new URL('./index.html',location.href);
      if(q)url.searchParams.set('q',q);
      location.href=url.href;
    };
  }
  const types=[['All','All Pedals'],['Overdrive','Overdrive'],['Distortion','Distortion'],['Fuzz','Fuzz']];
  $('pageTypeMenu').innerHTML=types.map(([t,label])=>{
    const url=new URL('./index.html',location.href);
    if(t!=='All')url.searchParams.set('type',t);
    return '<a class="pageTypeLink '+(t==='All'?'active':'')+'" href="'+url.href+'">'+label+'</a>';
  }).join('');
  $('pageBuilders').innerHTML=
    '<a class="pageBuilderLink active" href="./index.html">All builders<strong>'+builders.length+'</strong></a>'+
    builders.map(name=>{
      const url=new URL('./index.html',location.href);
      url.searchParams.set('builder',name);
      return '<a class="pageBuilderLink '+(name===wantedBuilder?'active':'')+'" href="'+url.href+'">'+esc(name)+'<strong>'+items.filter(x=>isCatalogEntry(x)&&x.company===name).length+'</strong></a>';
    }).join('');
}

function renderMarkdown(md){
  const lines=md.split(/\r?\n/);
  const hidden=new Set(['research confidence','photo','sources checked','prp identity']);
  let html='',inList=false,skip=false;
  const inline=s=>esc(s)
    .replace(/\s*\[\d+\]/g,'')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\x60(.+?)\x60/g,'<code>$1</code>');
  for(const line of lines){
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
      if(listText.startsWith('**research confidence:**') || listText.startsWith('**sources checked:**')) continue;
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
  const fallbackLabel=label?'No Photo Archived · '+label:'No Photo Archived';
  if(item && item.image){
    box.innerHTML='<img src="'+esc(item.image)+'" alt="'+esc(item.company+' '+item.pedal+(label?' '+label:''))+'" style="width:100%;height:100%;object-fit:contain;border-radius:12px" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>'+esc(fallbackLabel)+'</span>';
    box.style.padding='10px';
  }else{
    box.innerHTML='<span>'+esc(fallbackLabel)+'</span>';
    box.style.padding='20px';
  }
}

function renderColorways(item, colorways){
  if(!colorways.length){$('colorwaysSection').hidden=true;return}
  $('colorwaysSection').hidden=false;
  $('colorways').innerHTML=colorways.map((v,i)=>{
    const name=v.variation_name||v.pedal||('Variation '+(i+1));
    const media=v.image
      ? '<img src="'+esc(v.image)+'" alt="'+esc(item.company+' '+name)+'" loading="lazy" referrerpolicy="no-referrer">'
      : '<span>No Photo Archived</span>';
    return '<button class="colorwayCard" type="button" data-variation="'+esc(name)+'">'+
      '<span class="colorwayThumb">'+media+'</span><span class="colorwayName">'+esc(name)+'</span>'+
    '</button>';
  }).join('');
  const buttons=[...document.querySelectorAll('[data-variation]')];
  buttons.forEach(btn=>{
    btn.onclick=()=>{
      const name=btn.dataset.variation;
      const v=colorways.find(x=>(x.variation_name||x.pedal)===name);
      showPhoto(v||item,name);
      wantedVariation=name;
      buttons.forEach(b=>b.style.outline='');
      btn.style.outline='2px solid #111';
    };
  });
  if(wantedVariation){
    const active=buttons.find(b=>b.dataset.variation===wantedVariation);
    if(active)active.click();
  }
}

function renderVersions(item, versions){
  if(!versions.length){$('versionsSection').hidden=true;return}
  $('versionsSection').hidden=false;
  $('versions').innerHTML=versions.map(v=>{
    const label=v.version_label||v.pedal;
    const media=v.image
      ? '<img src="'+esc(v.image)+'" alt="'+esc(item.company+' '+label)+'" loading="lazy" referrerpolicy="no-referrer">'
      : '<span>No Photo Archived</span>';
    return '<a class="variantCard" href="'+detailUrl(v)+'">'+
      '<span class="variantThumb">'+media+'</span><span class="variantName">'+esc(label)+'</span>'+
    '</a>';
  }).join('');
}

function renderDemo(item){
  const demo=item.youtube_demo;
  if(!demo || !demo.url){$('demoSection').hidden=true;return}
  $('demoSection').hidden=false;
  $('demo').innerHTML='<span>'+esc(demo.title||'Best representative demo')+'</span>'+
    '<a class="action primary" href="'+esc(demo.url)+'" target="_blank" rel="noopener">Watch demo ↗</a>';
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

function loadResearchMarkdown(path){
  const researchUrl=researchRecordUrl(path);
  return new Promise((resolve,reject)=>{
    let attempt=0;
    let lastError=null;
    const run=()=>{
      attempt++;
      const request=new XMLHttpRequest();
      request.open('GET',researchUrl,true);
      request.timeout=5000;
      request.responseType='text';
      request.onload=()=>{
        if(request.status<200 || request.status>=300){
          lastError=new Error('Research record request failed: HTTP '+request.status);
        }else if(!request.responseText.trim()){
          lastError=new Error('Research record is empty.');
        }else{
          resolve(request.responseText);
          return;
        }
        if(attempt<3){setTimeout(run,150);return}
        reject(lastError);
      };
      request.onerror=()=>{
        lastError=new Error('Research record request failed.');
        if(attempt<3){setTimeout(run,150);return}
        reject(lastError);
      };
      request.ontimeout=()=>{
        lastError=new Error('Research record request timed out.');
        if(attempt<3){setTimeout(run,150);return}
        reject(lastError);
      };
      request.send();
    };
    run();
  });
}

loadCatalog()
.then(data=>{
  const allItems=data.pedals||[];
  renderPageNav(allItems);

  let requested=allItems.find(x=>x.company===wantedBuilder&&x.pedal===wantedPedal);
  if(!requested){
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

  document.title=item.pedal+' · The Dirt Archive';
  $('record').hidden=false;
  $('crumb').textContent=item.company;
  $('name').textContent=item.pedal;
  $('builder').textContent='The Dirt Archive pedal record';
  $('types').innerHTML=(item.types||[]).map(t=>'<span class="chip">'+esc(t)+'</span>').join('');
  showPhoto(item);

  const colorways=allItems.filter(x=>x.catalog_role==='variation'&&x.company===item.company&&x.parent_pedal===item.pedal);
  const versions=allItems.filter(x=>isCatalogEntry(x)&&x.version_of===entryKey(item));

  if(redirectedFromVariation){
    $('variationNotice').hidden=false;
    $('variationNotice').textContent='Showing '+wantedVariation+' as a variation of '+item.pedal+'.';
  }

  renderColorways(item,colorways);
  renderVersions(item,versions);
  renderDemo(item);

  const researchEl=$('research');
  if(item.research_record){
    loadResearchMarkdown(item.research_record)
      .then(md=>{researchEl.innerHTML=renderMarkdown(md)})
      .catch(e=>{researchEl.innerHTML='<p>Pedal information could not be loaded.</p>';console.error(e)})
  }else{
    researchEl.innerHTML='<p>Pedal information has not been added yet.</p>';
  }

  const link=new URL('./index.html',location.href);
  link.searchParams.set('builder',item.company);
  $('builderLink').href=link.href;
})
.catch(e=>{
  $('empty').hidden=false;
  $('empty').querySelector('p').textContent='The catalog data could not be loaded.';
  console.error(e);
});
