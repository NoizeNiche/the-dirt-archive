import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cases = [
 {key:'compulsive-jimi-octave-fuzz',builder:'Compulsive Audio',pedal:'Jimi - Octave Fuzz',
  pages:['https://www.effectsdatabase.com/type/octave/fuzz/1up'],
  archive:['https://www.effectsdatabase.com/type/octave/fuzz/1up'],
  search:'https://www.bing.com/images/search?q=%22Compulsive+Audio%22+%22Jimi+-+Octave+Fuzz%22'},
 {key:'bjfe-sun-burst-fuzz',builder:'BJFE / BJF Electronics',pedal:'Sun Burst Fuzz',
  pages:['https://www.bjornjuhl.com/forum/viewtopic.php-f=6&t=1555.html','https://www.bjornjuhl.com/forum/viewtopic.php?f=6&t=2261'],
  archive:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261','https://bjornjuhl.com/forum/viewtopic.php?f=6&t=1555.html'],
  search:'https://www.bing.com/images/search?q=%22Sun+Burst+Fuzz%22+BJFE'},
 {key:'captain-fx-war-pig',builder:'Captain FX',pedal:'War Pig',
  pages:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'],
  archive:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'],
  search:'https://www.bing.com/images/search?q=%22Captain+FX%22+%22War+Pig%22'},
 {key:'bad-penny-lollygagger',builder:'Bad Penny FX',pedal:'Lollygagger Overdrive',
  pages:['https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts'],
  archive:['http://badpennyfx.com/*lollygagger*','https://badpennyfx.com/*lollygagger*','https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts'],
  search:'https://www.bing.com/images/search?q=%22Bad+Penny+FX%22+%22Lollygagger+Overdrive%22'}
];

const root=path.resolve('final-four-targeted');
await fs.rm(root,{recursive:true,force:true}); await fs.mkdir(root,{recursive:true});

async function cdx(pattern){
 const u='https://web.archive.org/cdx/search/cdx?url='+encodeURIComponent(pattern)+'&output=json&filter=statuscode:200&filter=mimetype:text/html&collapse=digest&fl=timestamp,original,statuscode&limit=2';
 const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),5000);
 try{const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'},signal:controller.signal}); if(!r.ok)return[];
  const d=await r.json(); return Array.isArray(d)&&d.length>1?d.slice(1).map(x=>({timestamp:x[0],original:x[1],status:x[2]})):[];
 }catch{return[]}finally{clearTimeout(timer)}
}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\\s+/g,' ').trim()}
function variants(p){const b=norm(p), words=b.split(' ');return [...new Set([b,norm(p.split(' - ')[0]),words.slice(0,2).join(' ')].filter(Boolean))]}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',locale:'en-US'});
const summary=[];

for(const item of cases){
 const pages=[],seen=new Set();
 const add=(url,kind,meta={})=>{if(!seen.has(url)){seen.add(url);pages.push({url,kind,...meta})}};
 for(const u of item.pages)add(u,'current');
 for(const pat of item.archive)for(const s of await cdx(pat))add('https://web.archive.org/web/'+s.timestamp+'id_/'+s.original,'wayback',{original:s.original,timestamp:s.timestamp});
 add(item.search,'image-search');
 for(let i=0;i<Math.min(pages.length,4);i++){
  const p=pages[i],dir=path.join(root,item.key,String(i).padStart(2,'0')); await fs.mkdir(dir,{recursive:true});
  const page=await context.newPage(), rec={builder:item.builder,pedal:item.pedal,url:p.url,kind:p.kind,original:p.original||null,timestamp:p.timestamp||null,status:'error',title:'',h1:'',matches:[],images:[],links:[],bingResults:[]};
  try{
   await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:8000}); await page.waitForTimeout(500); rec.status='loaded';
   rec.title=(await page.title().catch(()=>'' )).replace(/\s+/g,' ').trim();
   rec.h1=(await page.locator('h1').first().textContent().catch(()=>'' )).replace(/\s+/g,' ').trim();
   const vs=variants(item.pedal);
   const info=await page.evaluate((vs)=>{
    const all=[...document.querySelectorAll('body *')],matches=[];
    for(const el of all){const txt=(el.innerText||'').replace(/\s+/g,' ').trim().toLowerCase(); if(!txt||txt.length>1000)continue; let score=0; for(const v of vs)if(txt.includes(v))score=Math.max(score,v.length); if(score){const r=el.getBoundingClientRect();matches.push({tag:el.tagName,score,text:txt.slice(0,300),top:r.top+scrollY,height:r.height})}}
    matches.sort((a,b)=>b.score-a.score||a.height-b.height); const targetTop=matches[0]?.top??null;
    const imgs=[...document.images].map((img,index)=>{const r=img.getBoundingClientRect();if(r.width<80||r.height<80)return null;const near=((img.parentElement?.innerText||'')+' '+(img.alt||'')+' '+(img.title||'')).replace(/\s+/g,' ').trim().toLowerCase();let relevance=0;for(const v of vs)if(near.includes(v))relevance+=v.length;return{index,src:img.currentSrc||img.src||'',dataSrc:img.getAttribute('data-src')||'',alt:(img.alt||'').slice(0,200),width:Math.round(r.width),height:Math.round(r.height),top:Math.round(r.top+scrollY),distance:targetTop==null?999999:Math.round(Math.abs(r.top+scrollY-targetTop)),relevance}}).filter(Boolean).sort((a,b)=>b.relevance-a.relevance||a.distance-b.distance||(b.width*b.height)-(a.width*a.height));
    const links=[...document.querySelectorAll('a[href]')].map(a=>({href:a.href,text:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,200)})).filter(x=>x.href&&(/youtube\.com\/watch/.test(x.href)||vs.some(v=>norm(x.text).includes(v))));
    const br=[...document.querySelectorAll('a.iusc')].map(a=>{try{return JSON.parse(a.getAttribute('m')||'{}')}catch{return{}}}).filter(x=>x.murl||x.purl).slice(0,30).map(x=>({murl:x.murl||'',purl:x.purl||'',t:x.t||'',desc:x.desc||''}));
    return{matches:matches.slice(0,8),images:imgs.slice(0,15),links:links.slice(0,20),bingResults:br};
   },vs);
   Object.assign(rec,info);
   if(rec.kind==='image-search'){await page.screenshot({path:path.join(dir,'search.png'),fullPage:false});}
   else {const anchor=info.matches[0]?.top??0;await page.evaluate(top=>window.scrollTo(0,Math.max(0,top-150)),anchor);await page.waitForTimeout(200);await page.screenshot({path:path.join(dir,'target-view.png'),fullPage:false});}
   for(const im of rec.images.slice(0,6)){try{const loc=page.locator('img').nth(im.index);await loc.scrollIntoViewIfNeeded({timeout:1000});const f='img-'+String(im.index).padStart(2,'0')+'.png';await loc.screenshot({path:path.join(dir,f),timeout:1800});im.capture=f;}catch{}}
  }catch(e){rec.error=String(e)}
  await fs.writeFile(path.join(dir,'record.json'),JSON.stringify(rec,null,2)); summary.push(rec); await page.close();
 }
}
await browser.close(); await fs.writeFile(path.join(root,'SUMMARY.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(x=>({builder:x.builder,pedal:x.pedal,kind:x.kind,url:x.url,status:x.status,title:x.title,h1:x.h1,matches:x.matches.slice(0,2),links:x.links,bingResults:x.bingResults,images:x.images.map(i=>({file:i.capture||null,src:i.src,dataSrc:i.dataSrc,alt:i.alt,width:i.width,height:i.height,distance:i.distance,relevance:i.relevance}))})),null,2));
