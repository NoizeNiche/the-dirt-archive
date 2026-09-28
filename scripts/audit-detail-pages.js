#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.cwd());
const BASE = process.env.ARCHIVE_AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const WORKERS = Math.max(1, Math.min(10, Number(process.env.DETAIL_AUDIT_WORKERS || 8)));
const LIMIT = Math.max(0, Number(process.env.DETAIL_AUDIT_LIMIT || 0));

function isLocalImage(value){
  const image = String(value || '').trim();
  return image.startsWith('./assets/pedals/') || image.startsWith('assets/pedals/');
}
function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

(async()=>{
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT,'research/PEDAL_INDEX.json'),'utf8'));
  const entries = (catalog.pedals || []).filter(x => x && x.catalog_role !== 'variation' && x.company && x.pedal);
  const targetEntries = LIMIT ? entries.slice(0, LIMIT) : entries;
  if(!targetEntries.length) throw new Error('No public pedal records found.');

  const browser = await chromium.launch({headless:true});
  let cursor = 0;
  const failures = [];
  const workerErrors = [];
  const started = Date.now();

  async function auditEntry(page, entry){
    const url = BASE + '/pedal-detail.html?builder=' + encodeURIComponent(entry.company) + '&pedal=' + encodeURIComponent(entry.pedal);
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForFunction(() => {
      const record=document.querySelector('#record');
      const research=document.querySelector('#research');
      return !!record && !record.hidden && !!research && research.textContent.trim().length>40;
    },null,{timeout:15000});

    const result = await page.evaluate(() => {
      const name=(document.querySelector('#name')?.textContent||'').trim();
      const builder=(document.querySelector('#builder')?.textContent||'').trim();
      const record=document.querySelector('#record');
      const research=(document.querySelector('#research')?.textContent||'').trim();
      const photo=document.querySelector('#photoBox');
      const photos=[...document.querySelectorAll('.photo')];
      const image=photo?.querySelector('.photoImage');
      const fallback=photo?.querySelector('.photoFallback');
      const rect=photo?.getBoundingClientRect();
      return {
        name,builder,researchLength:research.length,
        recordVisible:!!record && !record.hidden,
        photoCount:photos.length,photoBoxCount:photo?1:0,
        photoWidth:rect?.width||0,photoHeight:rect?.height||0,
        imageCount:photo?.querySelectorAll('img').length||0,
        imageLoaded:!!image && image.complete && image.naturalWidth>0,
        imageSrc:image?.getAttribute('src')||'',
        fallbackCount:fallback?1:0,
        fallbackText:(fallback?.textContent||'').trim()
      };
    });

    const problems=[];
    if(result.name !== entry.pedal) problems.push('name mismatch');
    if(result.builder !== entry.company) problems.push('builder mismatch');
    if(!result.recordVisible) problems.push('record hidden');
    if(result.researchLength<=40) problems.push('Pedal Info unexpectedly short');
    if(result.photoCount!==1 || result.photoBoxCount!==1) problems.push('unexpected primary photo container count');
    if(result.photoHeight>600) problems.push('primary photo container oversized');
    if(isLocalImage(entry.image)){
      if(result.imageCount!==1) problems.push('expected local primary image element missing');
      if(!result.imageLoaded) problems.push('local primary image did not load');
    }else{
      if(result.fallbackCount!==1) problems.push('missing-photo fallback missing');
      const fallbackLower=result.fallbackText.toLowerCase();
      if(!fallbackLower.includes(String(entry.pedal).toLowerCase()) || !fallbackLower.includes(String(entry.company).toLowerCase())){
        problems.push('missing-photo fallback is not self-identifying');
      }
    }
    if(problems.length) failures.push({
      builder:entry.company,pedal:entry.pedal,url,problems,
      diagnostics:result
    });
  }

  async function worker(id){
    const context=await browser.newContext({
      viewport:{width:1440,height:1000},
      serviceWorkers:'block'
    });
    const page=await context.newPage();
    page.setDefaultTimeout(10000);
    await page.route('**/*',async route=>{
      const request=route.request();
      const url=request.url();
      if(/.(?:png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(url) && !url.startsWith(BASE+'/assets/')){
        await route.abort().catch(()=>{});
      }else{
        await route.continue().catch(()=>{});
      }
    });
    try{
      while(true){
        const index=cursor++;
        if(index>=targetEntries.length) break;
        const entry=targetEntries[index];
        try{
          await auditEntry(page,entry);
        }catch(error){
          failures.push({
            builder:entry.company,pedal:entry.pedal,
            url:BASE+'/pedal-detail.html?builder='+encodeURIComponent(entry.company)+'&pedal='+encodeURIComponent(entry.pedal),
            problems:['page load/audit error: '+String(error?.message||error)]
          });
        }
      }
    }catch(error){
      workerErrors.push({worker:id,error:String(error?.message||error)});
    }finally{
      await context.close().catch(()=>{});
    }
  }

  await Promise.all(Array.from({length:Math.min(WORKERS,targetEntries.length)},(_,i)=>worker(i+1)));
  await browser.close();

  const output={
    generatedAt:new Date().toISOString(),
    base:BASE,
    totalCatalogRecords:entries.length,
    audited:targetEntries.length,
    failures:failures.length,
    workerErrors,
    durationSeconds:Math.round((Date.now()-started)/1000),
    failureDetails:failures.slice(0,500)
  };
  const outPath=process.env.DETAIL_AUDIT_REPORT || 'detail-page-audit-report.json';
  fs.writeFileSync(outPath,JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify({
    audited:output.audited,
    failures:output.failures,
    workerErrors:output.workerErrors.length,
    durationSeconds:output.durationSeconds,
    report:outPath
  },null,2));
  if(failures.length || workerErrors.length) process.exit(1);
})();