import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cases = [
  { key:'compulsive-jimi-octave-fuzz', builder:'Compulsive Audio', pedal:'Jimi - Octave Fuzz',
    pages:['https://www.effectsdatabase.com/type/octave/fuzz/1up'] },
  { key:'bjfe-sun-burst-fuzz', builder:'BJFE / BJF Electronics', pedal:'Sun Burst Fuzz',
    pages:['https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261'] },
  { key:'captain-fx-war-pig', builder:'Captain FX', pedal:'War Pig',
    pages:['https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'] },
  { key:'bad-penny-lollygagger', builder:'Bad Penny FX', pedal:'Lollygagger Overdrive',
    pages:[
      'https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts',
      'https://www.boostguitarpedals.co.uk/collections/bad-penny-fx'
    ] }
];

const root = path.resolve('final-four-probe-fast');
await fs.rm(root,{recursive:true,force:true});
await fs.mkdir(root,{recursive:true});

function abs(base, value){ try{return new URL(value,base).href}catch{return null} }
function srcset(v,base){ return String(v||'').split(',').map(x=>x.trim().split(/\s+/)[0]).map(x=>abs(base,x)).filter(Boolean) }
function looks(u){ return /\.(?:jpe?g|png|webp|gif|avif)(?:[?#].*)?$/i.test(u) || /(?:image|img|media|photo|picture|upload|cdn)/i.test(u) }

async function collect(page, base){
  const raw = await page.evaluate(() => {
    const out=[]; const add=(u,k,a='')=>{if(u)out.push({u,k,a})};
    for(const e of document.images){
      add(e.currentSrc,'current',e.alt); add(e.src,'src',e.alt);
      add(e.getAttribute('data-src'),'data-src',e.alt); add(e.getAttribute('data-lazy-src'),'data-lazy',e.alt);
      add(e.getAttribute('srcset'),'srcset',e.alt); add(e.getAttribute('data-srcset'),'data-srcset',e.alt);
    }
    for(const e of document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]')) add(e.content,'meta');
    for(const e of document.querySelectorAll('link[rel="preload"][as="image"]')) add(e.href,'preload');
    for(const e of document.querySelectorAll('script[type="application/ld+json"]')){
      try{
        const walk=v=>{
          if(typeof v==='string'){add(v,'jsonld');return}
          if(Array.isArray(v)){v.forEach(walk);return}
          if(v&&typeof v==='object'){ if(v.image)walk(v.image); if(v.contentUrl)walk(v.contentUrl) }
        };
        walk(JSON.parse(e.textContent||''));
      }catch{}
    }
    return out;
  });
  const expanded=[];
  for(const r of raw){
    const list = String(r.u||'').includes(',') ? srcset(r.u,base) : [abs(base,r.u)];
    for(const u of list) if(u && looks(u)) expanded.push({...r,u});
  }
  return [...new Map(expanded.map(x=>[x.u,x])).values()].slice(0,30);
}

async function runLimited(items, limit, fn){
  const out=[]; let i=0;
  const workers=Array.from({length:limit},async()=>{
    while(true){
      const n=i++; if(n>=items.length) return;
      try{const v=await fn(items[n],n); if(v)out.push(v)}catch{}
    }
  });
  await Promise.all(workers); return out;
}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({
  userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
  locale:'en-US'
});
const request=context.request;
const summary=[];

for(const item of cases){
  for(let pi=0;pi<item.pages.length;pi++){
    const url=item.pages[pi];
    const dir=path.join(root,item.key,String(pi).padStart(2,'0'));
    await fs.mkdir(dir,{recursive:true});
    const page=await context.newPage();
    const rec={builder:item.builder,pedal:item.pedal,url,status:'error',title:'',h1:'',images:[],screenshot:null};
    try{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:10000});
      await page.waitForTimeout(800);
      rec.status='loaded';
      rec.title=String(await page.title().catch(()=>'' )).replace(/\s+/g,' ').trim();
      rec.h1=String(await page.locator('h1').first().textContent().catch(()=>'' )).replace(/\s+/g,' ').trim();
      const candidates=await collect(page,url);
      const saved=await runLimited(candidates,5,async(c,idx)=>{
        const response=await request.get(c.u,{timeout:3500,failOnStatusCode:false});
        const headers=response.headers(); const ct=headers['content-type']||'';
        if(!ct.startsWith('image/')) return null;
        const body=await response.body();
        if(body.length<3000) return null;
        const ext=ct.includes('png')?'png':ct.includes('webp')?'webp':ct.includes('gif')?'gif':ct.includes('avif')?'avif':'jpg';
        const f=path.join(dir,'image-'+String(idx).padStart(2,'0')+'.'+ext);
        await fs.writeFile(f,body);
        return {file:path.basename(f),url:c.u,kind:c.k,alt:c.a||'',bytes:body.length,contentType:ct};
      });
      rec.images=saved.slice(0,12);
      const shot=path.join(dir,'page.png');
      await page.screenshot({path:shot,fullPage:true});
      rec.screenshot='page.png';
    }catch(e){rec.error=String(e)}
    await fs.writeFile(path.join(dir,'record.json'),JSON.stringify(rec,null,2));
    summary.push(rec);
    await page.close();
  }
}
await browser.close();
await fs.writeFile(path.join(root,'SUMMARY.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(x=>({builder:x.builder,pedal:x.pedal,url:x.url,status:x.status,title:x.title,h1:x.h1,imageCount:x.images.length,images:x.images})),null,2));
