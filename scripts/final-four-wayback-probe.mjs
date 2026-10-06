import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cases = [
  {
    key:'compulsive-jimi-octave-fuzz', builder:'Compulsive Audio', pedal:'Jimi - Octave Fuzz',
    current:['https://www.effectsdatabase.com/type/octave/fuzz/1up'],
    archivePatterns:['https://www.effectsdatabase.com/type/octave/fuzz/1up','https://www.effectsdatabase.com/model/compulsive/jimioctavefuzz']
  },
  {
    key:'bjfe-sun-burst-fuzz', builder:'BJFE / BJF Electronics', pedal:'Sun Burst Fuzz',
    current:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261','https://bjornjuhl.com/forum/viewtopic.php?f=6&t=1555.html'],
    archivePatterns:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261','https://bjornjuhl.com/forum/viewtopic.php?f=6&t=1555.html']
  },
  {
    key:'captain-fx-war-pig', builder:'Captain FX', pedal:'War Pig',
    current:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'],
    archivePatterns:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/']
  },
  {
    key:'bad-penny-lollygagger', builder:'Bad Penny FX', pedal:'Lollygagger Overdrive',
    current:[
      'https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts',
      'https://www.boostguitarpedals.co.uk/collections/bad-penny-fx'
    ],
    archivePatterns:[
      'http://badpennyfx.com/*',
      'https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts'
    ]
  }
];

const root=path.resolve('final-four-wayback-probe');
await fs.rm(root,{recursive:true,force:true});
await fs.mkdir(root,{recursive:true});

async function cdx(pattern){
  const u='https://web.archive.org/cdx/search/cdx?url='+encodeURIComponent(pattern)+'&output=json&filter=statuscode:200&filter=mimetype:text/html&collapse=digest&fl=timestamp,original,statuscode&limit=8';
  try{
    const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'}});
    if(!r.ok) return [];
    const d=await r.json();
    if(!Array.isArray(d)||d.length<2) return [];
    const rows=d.slice(1);
    return rows.map(x=>({timestamp:x[0],original:x[1],status:x[2]}));
  }catch{return []}
}

function abs(base,u){try{return new URL(u,base).href}catch{return null}}
function looks(u){return /\.(?:jpe?g|png|webp|gif|avif)(?:[?#].*)?$/i.test(u||'')||/(?:image|img|media|photo|picture|upload|cdn)/i.test(u||'')}

async function collect(page,base){
  return await page.evaluate(()=>{
    const out=[]; const add=(u,k,a='')=>{if(u)out.push({u,k,a})};
    for(const e of document.images){add(e.currentSrc,'current',e.alt);add(e.src,'src',e.alt);add(e.getAttribute('data-src'),'data-src',e.alt);add(e.getAttribute('data-lazy-src'),'data-lazy',e.alt);add(e.getAttribute('srcset'),'srcset',e.alt);add(e.getAttribute('data-srcset'),'data-srcset',e.alt)}
    for(const e of document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]')) add(e.content,'meta');
    for(const e of document.querySelectorAll('link[rel="preload"][as="image"]')) add(e.href,'preload');
    for(const e of document.querySelectorAll('a[href]')){ const h=e.href; if(looks(h)) add(h,'anchor',String(e.textContent||'').trim().slice(0,120)); }
    return out;
  });
}

async function downloadCandidates(request, dir, raw, base){
  const expanded=[];
  for(const r of raw){
    for(const u0 of (String(r.u||'').includes(',') ? String(r.u).split(',').map(x=>x.trim().split(/\s+/)[0]) : [r.u])){
      const u=abs(base,u0); if(u&&looks(u)) expanded.push({...r,u});
    }
  }
  const uniq=[...new Map(expanded.map(x=>[x.u,x])).values()].slice(0,25);
  const out=[]; let idx=0;
  await Promise.all(uniq.map(async c=>{
    try{
      const res=await request.get(c.u,{timeout:5000,failOnStatusCode:false});
      const ct=res.headers()['content-type']||''; const body=await res.body();
      if(!ct.startsWith('image/')||body.length<3000) return;
      const ext=ct.includes('png')?'png':ct.includes('webp')?'webp':ct.includes('gif')?'gif':ct.includes('avif')?'avif':'jpg';
      const n=idx++;
      const f=path.join(dir,'image-'+String(n).padStart(2,'0')+'.'+ext);
      await fs.writeFile(f,body);
      out.push({file:path.basename(f),url:c.u,kind:c.k,alt:c.a||'',bytes:body.length,contentType:ct});
    }catch{}
  }));
  return out.slice(0,20);
}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',locale:'en-US'});
const request=context.request;
const summary=[];

for(const item of cases){
  const archive=[];
  for(const p of item.archivePatterns) archive.push(...await cdx(p));
  const pages=[];
  const seen=new Set();
  for(const u of item.current) if(!seen.has(u)){seen.add(u);pages.push({url:u,kind:'current'})}
  for(const a of archive.slice(-6)) {
    const u='https://web.archive.org/web/'+a.timestamp+'id_/'+a.original;
    if(!seen.has(u)){seen.add(u);pages.push({url:u,kind:'wayback',original:a.original,timestamp:a.timestamp})}
  }
  const itemDir=path.join(root,item.key); await fs.mkdir(itemDir,{recursive:true});
  for(let i=0;i<pages.length && i<8;i++){
    const p=pages[i], dir=path.join(itemDir,String(i).padStart(2,'0')); await fs.mkdir(dir,{recursive:true});
    const page=await context.newPage();
    const rec={builder:item.builder,pedal:item.pedal,url:p.url,sourceKind:p.kind,original:p.original||null,timestamp:p.timestamp||null,status:'error',title:'',h1:'',images:[]};
    try{
      await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:10000});
      await page.waitForTimeout(700);
      if(p.kind==='current'||p.kind==='wayback'){
        const text=(await page.locator('body').innerText().catch(()=>'' )).replace(/\s+/g,' ').trim();
        const needle=(item.pedal.split(' ')[0]||'').toLowerCase();
        rec.keywordPresent=text.toLowerCase().includes(needle);
      }
      rec.status='loaded'; rec.title=(await page.title().catch(()=>'' )).replace(/\s+/g,' ').trim();
      rec.h1=(await page.locator('h1').first().textContent().catch(()=>'' )).replace(/\s+/g,' ').trim();
      const raw=await collect(page,p.url);
      rec.images=await downloadCandidates(request,dir,raw,p.url);
      await page.screenshot({path:path.join(dir,'page.png'),fullPage:true});
    }catch(e){rec.error=String(e)}
    await fs.writeFile(path.join(dir,'record.json'),JSON.stringify(rec,null,2));
    summary.push(rec);
    await page.close();
  }
}
await browser.close();
await fs.writeFile(path.join(root,'SUMMARY.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(x=>({builder:x.builder,pedal:x.pedal,sourceKind:x.sourceKind,url:x.url,status:x.status,title:x.title,h1:x.h1,keywordPresent:x.keywordPresent,imageCount:x.images.length,images:x.images})),null,2));
