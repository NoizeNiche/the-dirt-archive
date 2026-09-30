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

    // Local primary images can still be loading after the research block is ready.
    // Wait briefly for the image load/error event before declaring a broken asset.
    if (isLocalImage(entry.image)) {
      await page.waitForFunction(() => {
        const image = document.querySelector('#photoBox .photoImage');
        const fallback = document.querySelector('#photoBox .photoFallback');
        const fallbackVisible = !!fallback && !fallback.hidden &&
          getComputedStyle(fallback).display !== 'none' &&
          getComputedStyle(fallback).visibility !== 'hidden';
        return !image || image.complete || fallbackVisible;
      }, null, { timeout: 5000 }).catch(() => {});
    }

    const result = await page.evaluate(() => {
      const name=(document.querySelector('#name')?.textContent||'').trim();
      const builder=(document.querySelector('#builder')?.textContent||'').trim();
      const record=document.querySelector('#record');
      const research=(document.querySelector('#research')?.textContent||'').trim();
      const researchLower=research.toLowerCase();
      const scrapeResidueSignals=[
        'add to cart',
        'shopping cart',
        'shipping calculated at checkout',
        'sign in',
        'view cart',
        'buy now',
        'automotive / parts accessories',
        'average product review',
        'skip to content'
      ];
      const visibleScrapeResidue=scrapeResidueSignals.filter(signal=>{
        // Match scrape phrases as actual words. Plain substring matching makes
        // normal research prose such as "design intended" look like "sign in".
        const pattern="(^|[^a-z0-9])"+signal.replace(/\s+/g,"\\s+")+"([^a-z0-9]|$)";
        return new RegExp(pattern,"i").test(research);
      });
      const photo=document.querySelector('#photoBox');
      const photos=[document.querySelector('#photoBox')].filter(Boolean);
      const image=photo?.querySelector('.photoImage');
      const fallback=photo?.querySelector('.photoFallback');
      const fallbackStyle=fallback ? getComputedStyle(fallback) : null;
      const fallbackVisible=!!fallback && !fallback.hidden && fallbackStyle?.display !== 'none' && fallbackStyle?.visibility !== 'hidden';
      const rect=photo?.getBoundingClientRect();
      const main=document.querySelector('#mainContent');
      const board=document.querySelector('.boardSurface');
      const pageLayout=document.querySelector('.pageLayout');
      const pageMain=document.querySelector('.pageMain');
      const header=document.querySelector('.siteHeaderDetail');
      const firstContent=document.querySelector('#record') || document.querySelector('#empty');
      const mainRect=main?.getBoundingClientRect();
      const boardRect=board?.getBoundingClientRect();
      const layoutRect=pageLayout?.getBoundingClientRect();
      const pageMainRect=pageMain?.getBoundingClientRect();
      const firstContentRect=firstContent?.getBoundingClientRect();
      const headerRect=header?.getBoundingClientRect();
      return {
        name,builder,researchLength:research.length,visibleScrapeResidue,
        recordVisible:!!record && !record.hidden,
        photoCount:photos.length,photoBoxCount:photo?1:0,
        photoWidth:rect?.width||0,photoHeight:rect?.height||0,
        imageCount:photo?.querySelectorAll('img').length||0,
        imageLoaded:!!image && image.complete && image.naturalWidth>0,
        imageSrc:image?.getAttribute('src')||'',
        imageAlt:image?.getAttribute('alt')||'',
        fallbackCount:fallback?1:0,
        fallbackVisible,
        fallbackText:(fallback?.textContent||'').trim(),
        headerHeight:headerRect?.height||0,
        headerToMainGap:mainRect && headerRect ? Math.max(0,mainRect.top-(headerRect.bottom)) : 0,
        boardTopPadding:boardRect && layoutRect ? Math.max(0,layoutRect.top-boardRect.top) : 0,
        pageMainTopGap:pageMainRect && layoutRect ? Math.max(0,pageMainRect.top-layoutRect.top) : 0,
        firstContentTopGap:firstContentRect && pageMainRect ? Math.max(0,firstContentRect.top-pageMainRect.top) : 0
      };
    });

    const problems=[];
    if(result.name !== entry.pedal) problems.push('name mismatch');
    if(result.builder !== entry.company) problems.push('builder mismatch');
    if(!result.recordVisible) problems.push('record hidden');
    if(result.researchLength<=40) problems.push('Pedal Info unexpectedly short');
    if(result.visibleScrapeResidue?.length) problems.push('visible research contains scrape residue: '+result.visibleScrapeResidue.join(', '));
    if(result.photoCount!==1 || result.photoBoxCount!==1) problems.push('unexpected primary photo container count');
    if(result.photoHeight>600) problems.push('primary photo container oversized');
    if(result.fallbackVisible && result.photoHeight>220) problems.push('no-photo fallback reserves excessive vertical space');
    if(result.headerToMainGap>48) problems.push('excessive gap between detail header and main content');
    if(result.pageMainTopGap>2) problems.push('unexpected top gap before detail record');
    if(result.firstContentTopGap>2) problems.push('unexpected top gap inside detail content');
    if(result.boardTopPadding>36) problems.push('board surface reserves excessive top padding before the record');
    if(isLocalImage(entry.image)){
      if(result.imageCount!==1) problems.push('expected local primary image element missing');
      if(!result.imageLoaded) problems.push('local primary image did not load');
      if(!result.imageAlt.toLowerCase().includes(String(entry.pedal).toLowerCase()) ||
         !result.imageAlt.toLowerCase().includes(String(entry.company).toLowerCase())){
        problems.push('local primary image alt text is not self-identifying');
      }
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
    let context=null;
    let page=null;
    let processed=0;

    async function openFreshPage(){
      if(context) await context.close().catch(()=>{});
      context=await browser.newContext({
        viewport:{width:1440,height:1000},
        serviceWorkers:'block'
      });
      page=await context.newPage();
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
    }

    try{
      await openFreshPage();
      while(true){
        const index = cursor++;
        if(index>=targetEntries.length) break;

        // Recycle the browser context regularly. This keeps a 4,000+ page
        // archive sweep from accumulating page/request state in one context.
        if(processed > 0 && processed % 80 === 0){
          await openFreshPage();
        }

        const entry=targetEntries[index];
        let succeeded=false;
        for(let attempt=0; attempt<2 && !succeeded; attempt++){
          try{
            await auditEntry(page,entry);
            succeeded=true;
          }catch(error){
            const message=String(error?.message||error);
            const closed=/Target page, context or browser has been closed|Browser has been closed|Target page has been closed/i.test(message);
            if(closed && attempt===0){
              try{
                await openFreshPage();
                continue;
              }catch(reopenError){
                failures.push({
                  builder:entry.company,pedal:entry.pedal,
                  url:BASE+'/pedal-detail.html?builder='+encodeURIComponent(entry.company)+'&pedal='+encodeURIComponent(entry.pedal),
                  problems:['page/context recovery failed: '+String(reopenError?.message||reopenError)]
                });
              }
            }else{
              failures.push({
                builder:entry.company,pedal:entry.pedal,
                url:BASE+'/pedal-detail.html?builder='+encodeURIComponent(entry.company)+'&pedal='+encodeURIComponent(entry.pedal),
                problems:['page load/audit error: '+message]
              });
            }
          }
        }
        processed++;
      }
    }catch(error){
      workerErrors.push({worker:id,error:String(error?.message||error)});
    }finally{
      if(context) await context.close().catch(()=>{});
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