import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cases = [
  { key:'compulsive-jimi-octave-fuzz', builder:'Compulsive Audio', pedal:'Jimi - Octave Fuzz',
    pages:['https://www.effectsdatabase.com/type/octave/fuzz/1up'],
    archive:['https://www.effectsdatabase.com/type/octave/fuzz/1up'] },
  { key:'bjfe-sun-burst-fuzz', builder:'BJFE / BJF Electronics', pedal:'Sun Burst Fuzz',
    pages:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261'],
    archive:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261','https://bjornjuhl.com/forum/viewtopic.php?f=6&t=1555.html'] },
  { key:'captain-fx-war-pig', builder:'Captain FX', pedal:'War Pig',
    pages:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'],
    archive:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'] },
  { key:'bad-penny-lollygagger', builder:'Bad Penny FX', pedal:'Lollygagger Overdrive',
    pages:['https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts'],
    archive:['http://badpennyfx.com/*lollygagger*','https://badpennyfx.com/*lollygagger*','https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts'] }
];

const root=path.resolve('final-four-targeted');
await fs.rm(root,{recursive:true,force:true});
await fs.mkdir(root,{recursive:true});

async function cdx(pattern){
  const u='https://web.archive.org/cdx/search/cdx?url='+encodeURIComponent(pattern)+'&output=json&filter=statuscode:200&filter=mimetype:text/html&collapse=digest&fl=timestamp,original,statuscode&limit=3';
  try{
    const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'}});
    if(!r.ok) return [];
    const d=await r.json(); if(!Array.isArray(d)||d.length<2) return [];
    return d.slice(1).map(x=>({timestamp:x[0],original:x[1],status:x[2]}));
  }catch{return []}
}

function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\\s+/g,' ').trim()}
function needleVariants(pedal){
  const base=norm(pedal); const first=norm(pedal.split(' - ')[0]); const words=base.split(' ');
  return [...new Set([base,first,words.slice(0,2).join(' ')].filter(Boolean))];
}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',locale:'en-US'});

const summary=[];
for(const item of cases){
  const pages=[]; const seen=new Set();
  for(const u of item.pages) if(!seen.has(u)){seen.add(u);pages.push({url:u,kind:'current'})}
  for(const pat of item.archive){
    const snaps=await cdx(pat);
    for(const s of snaps){
      const u='https://web.archive.org/web/'+s.timestamp+'id_/'+s.original;
      if(!seen.has(u)){seen.add(u);pages.push({url:u,kind:'wayback',original:s.original,timestamp:s.timestamp})}
    }
  }
  for(let i=0;i<Math.min(pages.length,5);i++){
    const p=pages[i];
    const dir=path.join(root,item.key,String(i).padStart(2,'0'));
    await fs.mkdir(dir,{recursive:true});
    const page=await context.newPage();
    const rec={builder:item.builder,pedal:item.pedal,url:p.url,kind:p.kind,original:p.original||null,timestamp:p.timestamp||null,status:'error',title:'',h1:'',matches:[],images:[]};
    try{
      await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:10000});
      await page.waitForTimeout(700);
      rec.status='loaded';
      rec.title=(await page.title().catch(()=>'' )).replace(/\s+/g,' ').trim();
      rec.h1=(await page.locator('h1').first().textContent().catch(()=>'' )).replace(/\s+/g,' ').trim();
      const variants=needleVariants(item.pedal);
      const info=await page.evaluate((variants)=>{
        const els=[...document.querySelectorAll('body *')];
        const scored=[];
        for(const el of els){
          const txt=(el.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();
          if(!txt||txt.length>1200) continue;
          let score=0;
          for(const v of variants) if(txt.includes(v)) score=Math.max(score,v.length);
          if(score) {
            const r=el.getBoundingClientRect();
            scored.push({elTag:el.tagName,score,text:txt.slice(0,300),top:r.top+scrollY,height:r.height});
          }
        }
        scored.sort((a,b)=>b.score-a.score || a.height-b.height);
        const targetTop=scored[0]?.top ?? null;
        const imgs=[...document.images].map((img,index)=>{
          const r=img.getBoundingClientRect(); if(r.width<80||r.height<80) return null;
          const alt=(img.alt||'')+' '+(img.title||'')+' '+(img.parentElement?.innerText||'');
          const dist=targetTop==null?999999:Math.abs((r.top+scrollY)-targetTop);
          let relevance=0;
          const hay=(alt||'').replace(/\s+/g,' ').toLowerCase();
          for(const v of variants) if(hay.includes(v)) relevance+=v.length;
          return {index,src:img.currentSrc||img.src||'',alt:(img.alt||'').slice(0,160),width:Math.round(r.width),height:Math.round(r.height),top:Math.round(r.top+scrollY),distance:Math.round(dist),relevance};
        }).filter(Boolean).sort((a,b)=>b.relevance-a.relevance || a.distance-b.distance || (b.width*b.height)-(a.width*a.height));
        return {matches:scored.slice(0,8),images:imgs.slice(0,12)};
      },variants);
      rec.matches=info.matches;
      rec.images=info.images;
      if(info.matches[0]){
        await page.evaluate(top=>window.scrollTo(0,Math.max(0,top-180)),info.matches[0].top);
        await page.waitForTimeout(500);
        const target = page.locator('body *').filter({hasText:item.pedal.split(' - ')[0]}).first();
        await page.screenshot({path:path.join(dir,'target-view.png'),fullPage:false});
      }
      for(const im of info.images.slice(0,8)){
        try{
          const loc=page.locator('img').nth(im.index);
          await loc.scrollIntoViewIfNeeded({timeout:1500});
          const safe='img-'+String(im.index).padStart(2,'0');
          await loc.screenshot({path:path.join(dir,safe+'.png'),timeout:2500});
          im.capture=safe+'.png';
        }catch{}
      }
      await page.screenshot({path:path.join(dir,'page.png'),fullPage:true});
    }catch(e){rec.error=String(e)}
    await fs.writeFile(path.join(dir,'record.json'),JSON.stringify(rec,null,2));
    summary.push(rec);
    await page.close();
  }
}
await browser.close();
await fs.writeFile(path.join(root,'SUMMARY.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(x=>({builder:x.builder,pedal:x.pedal,kind:x.kind,url:x.url,status:x.status,title:x.title,h1:x.h1,matches:x.matches.slice(0,2),images:x.images.map(i=>({file:i.capture||null,src:i.src,alt:i.alt,width:i.width,height:i.height,distance:i.distance,relevance:i.relevance}))})),null,2));
