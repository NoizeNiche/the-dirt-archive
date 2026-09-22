#!/usr/bin/env node
'use strict';

// Push-triggered canary support: health fixes can be verified immediately.

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { chromium } = require('playwright');

const ROOT = process.cwd();
const SITE_API = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/pages`;
const RUNS_API = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/deploy-pages.yml/runs?branch=main&per_page=10`;
const TOKEN = process.env.GITHUB_TOKEN || '';
const currentSha = process.env.GITHUB_SHA || cp.execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim();
const runningScheduledHealth = process.env.GITHUB_EVENT_NAME === 'schedule';
async function currentMainSha() {
  if (!runningScheduledHealth) return currentSha;
  try {
    cp.execFileSync('git', ['fetch','origin','main'], {stdio:'ignore'});
    return cp.execFileSync('git', ['rev-parse','origin/main'], {encoding:'utf8'}).trim();
  } catch {
    return currentSha;
  }
}

function apiHeaders() {
  return {accept:'application/vnd.github+json', authorization:`Bearer ${TOKEN}`, 'x-github-api-version':'2022-11-28', 'user-agent':'dirt-archive-hourly-health'};
}
async function jsonFetch(url, options={}) {
  const res = await fetch(url, {headers:{...apiHeaders(), ...(options.headers||{})}, ...options});
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch {}
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}: ${body?.message || text.slice(0,240)}`);
  return body;
}
function readJson(rel){ return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
function gitShow(rel, rev){ return cp.execFileSync('git', ['show', `${rev}:${rel}`], {encoding:'utf8'}); }
function gitPathExists(rev, rel){
  try { cp.execFileSync('git', ['cat-file', '-e', `${rev}:${rel}`], {stdio:'ignore'}); return true; }
  catch { return false; }
}
function previousImageWasArchived(image){
  if(!image || !isLocalImagePath(image)) return false;
  return gitPathExists('HEAD^', image.replace(/^\.\//,''));
}
function key(x){ return `${x.company}\u0000${x.pedal}`; }
function isLocalImagePath(value){
  return typeof value === 'string' && /^(?:\.\/)?assets\/pedals\//i.test(value);
}
function resolveLocalImagePath(value){
  if (!isLocalImagePath(value)) return null;
  return path.join(ROOT, value.replace(/^\.\//,''));
}
function hasArchivedImage(value){
  const resolved = resolveLocalImagePath(value);
  return !!resolved && fs.existsSync(resolved);
}
function parseCsvLine(line){
  const cells=[];
  let cell='';
  let quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted && line[i+1]==='"'){ cell+='"'; i++; }
      else quoted=!quoted;
    } else if(ch===',' && !quoted){
      cells.push(cell);
      cell='';
    } else {
      cell+=ch;
    }
  }
  cells.push(cell);
  return cells;
}
function trackerMap(text){
  const lines=text.trimEnd().split(/\r?\n/);
  const head=parseCsvLine(lines.shift());
  return new Map(lines.map(line=>{
    const cells=parseCsvLine(line);
    const row={}; head.forEach((h,i)=>row[h]=cells[i]??'');
    return [`${row.Builder}\u0000${row.Pedal}`, row];
  }));
}
function checkDataIntegrity() {
  const current=readJson('research/PEDAL_INDEX.json');
  const manifest=readJson('research/pedals/PEDAL_IMAGES.json');
  const tracker=trackerMap(fs.readFileSync(path.join(ROOT,'research/PRP_TRACKER.csv'),'utf8'));
  const pedals=current.pedals||[];
  const publicEntries=pedals.filter(x=>x.catalog_role!=='variation');
  const researchedEntries=publicEntries.filter(x=>x.research_record);
  const picturedEntries=researchedEntries.filter(x=>hasArchivedImage(x.image));
  const typeCanary=publicEntries.find(x=>Array.isArray(x.types)&&x.types.includes('Fuzz'))||publicEntries[0];
  const builderCanary=typeCanary||publicEntries[0];
  const positiveCanary=picturedEntries[0]||researchedEntries[0];
  const noPhotoCanary=researchedEntries.find(x=>!x.image);
  const noResearchCanary=publicEntries.find(x=>!x.research_record);
  const variationCanary=pedals.find(x=>x.catalog_role==='variation'&&x.parent_pedal&&x.variation_name);
  if(!positiveCanary||!builderCanary) throw new Error('Catalog does not contain enough real records for health canaries.');
  if (current.count !== pedals.length) throw new Error(`Catalog count mismatch: ${current.count} vs ${pedals.length}`);
  const cKeys=new Set(pedals.map(key));
  if (cKeys.size !== pedals.length) throw new Error('Duplicate Builder + Pedal identity in PEDAL_INDEX.json');
  const mKeys=new Set(manifest.map(x=>`${x.builder}\u0000${x.pedal}`));
  if (mKeys.size !== manifest.length) throw new Error('Duplicate Builder + Pedal identity in PEDAL_IMAGES.json');
  if (tracker.size !== pedals.length) throw new Error(`Tracker row count mismatch: ${tracker.size} vs ${pedals.length}`);
  for (const p of pedals) {
    const k=key(p);
    if (!tracker.has(k)) throw new Error(`Tracker missing catalog identity: ${p.company} / ${p.pedal}`);
    const row=tracker.get(k);
    const info=!!p.research_record, picture=hasArchivedImage(p.image), complete=info&&picture;
    if ((row['Pedal Info']==='DONE')!==info) throw new Error(`Tracker Pedal Info mismatch: ${p.company} / ${p.pedal}`);
    if ((row.Picture==='DONE')!==picture) throw new Error(`Tracker Picture mismatch: ${p.company} / ${p.pedal}`);
    if ((row['PRP Complete']==='DONE')!==complete) throw new Error(`Tracker PRP Complete mismatch: ${p.company} / ${p.pedal}`);
    if ((row['Research Record']||'') !== (p.research_record||'')) throw new Error(`Tracker research record mismatch: ${p.company} / ${p.pedal}`);
    if (p.research_record && !fs.existsSync(path.join(ROOT,p.research_record.replace(/^\.\//,'')))) throw new Error(`Missing research file: ${p.research_record}`);
  }
  const liveManifestRecords=new Set(manifest.filter(x=>x.research_record).map(x=>x.research_record));
  const indexRecords=new Set(pedals.filter(x=>x.research_record).map(x=>x.research_record));
  if (liveManifestRecords.size!==indexRecords.size || [...liveManifestRecords].some(x=>!indexRecords.has(x))) throw new Error('Research-record links disagree between index and photo manifest');

  const manifestByKey=new Map(manifest.map(x=>[`${x.builder}\u0000${x.pedal}`,x]));
  for (const p of pedals) {
    const k=key(p);
    const m=manifestByKey.get(k);
    if (!m) throw new Error(`Photo manifest missing catalog identity: ${p.company} / ${p.pedal}`);
    if ((m.image||null)!==(p.image||null)) throw new Error(`Photo path mismatch between index and manifest: ${p.company} / ${p.pedal}`);
    if (isLocalImagePath(p.image) && !hasArchivedImage(p.image)) {
      throw new Error(`Local archived photo is missing: ${p.company} / ${p.pedal} -> ${p.image}`);
    }
    if (p.catalog_role==='variation' && p.parent_pedal && isLocalImagePath(p.image)) {
      const parent=p.image.split('/').slice(-3,-2)[0] || '';
      if (!p.image.includes('/variants/')) throw new Error(`Variation photo is not stored under variants/: ${p.company} / ${p.pedal}`);
    }
  }

  let previous=null;
  try { previous=JSON.parse(gitShow('research/PEDAL_INDEX.json','HEAD^')); } catch {}
  if (previous) {
    const prevMap=new Map((previous.pedals||[]).map(x=>[key(x),x]));
    const removed=[...prevMap.keys()].filter(k=>!cKeys.has(k));
    if (removed.length) throw new Error(`Destructive catalog removal detected (${removed.length} identities): ${removed.slice(0,8).join(' | ')}`);
    const researchRegressions=[], imageRegressions=[], changedState=[];
    let localPhotoMigrations=0;
    for (const [k,old] of prevMap) {
      const now=pedals.find(x=>key(x)===k);
      if (!now) continue;
      if (old.research_record && !now.research_record) researchRegressions.push(k);
      if (previousImageWasArchived(old.image) && !now.image) imageRegressions.push(k);
      const imageChanged=(old.image||null)!==(now.image||null);
      const researchChanged=(old.research_record||null)!==(now.research_record||null);
      const localMigration=imageChanged && isLocalImagePath(now.image) && !!now.image_source_url;
      if (localMigration) localPhotoMigrations++;
      if (researchChanged || (imageChanged && !localMigration)) changedState.push(k);
    }
    if (researchRegressions.length) throw new Error(`Research records disappeared from existing pedals: ${researchRegressions.slice(0,12).join(' | ')}`);
    if (imageRegressions.length) throw new Error(`Previously archived photos disappeared from existing pedals: ${imageRegressions.slice(0,12).join(' | ')}`);
    if (changedState.length>75) throw new Error(`Unusually large PRP state change detected: ${changedState.length} existing pedals changed research/photo state.`);
    if (localPhotoMigrations) console.log(`Local photo migrations accepted: ${localPhotoMigrations}`);
    const deletedFiles=cp.execFileSync('git',['diff','--name-status','HEAD^','--','research/pedals'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean).filter(x=>/^D\s/.test(x));
    if (deletedFiles.length) throw new Error(`Research files were deleted from the latest commit: ${deletedFiles.slice(0,12).join(' | ')}`);
  }
  const researched=pedals.filter(x=>x.research_record).length;
  const pictured=pedals.filter(x=>hasArchivedImage(x.image)).length;
  const complete=pedals.filter(x=>x.research_record&&hasArchivedImage(x.image)).length;
  console.log(`PRP data: ${pedals.length} pedals / ${researched} researched / ${pictured} pictured / ${complete} complete`);
  return {current, pedals, researched, pictured, complete, canaries:{builderCanary,positiveCanary,noPhotoCanary,variationCanary}};
}
const DEPLOY_TRIGGER_PATHS = [
  'index.html',
  'pedal.html',
  'pedal-detail.html',
  'assets/**',
  'research/PEDAL_INDEX.json',
  'research/pedals/**',
  'assets/js/**',
  'assets/css/**',
  'scripts/deploy-browser-audit.js',
  'scripts/serve-static.js',
  'scripts/live-photo-audit.js',
  'scripts/validate-archive.py',
  '.github/workflows/deploy-pages.yml'
];

function deploymentPathChanged(file) {
  return DEPLOY_TRIGGER_PATHS.some(pattern => {
    if (pattern.endsWith('/**')) return file.startsWith(pattern.slice(0, -2));
    return file === pattern;
  });
}

async function changedFilesBetween(baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  try {
    const data = await jsonFetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/compare/${baseSha}...${headSha}`);
    return (data.files || []).map(file => file.filename).filter(Boolean);
  } catch {
    return null;
  }
}

async function waitForDeployment() {
  const pages=await jsonFetch(SITE_API);
  const liveUrl=(pages.html_url||'').replace(/\/$/,'');
  if (!liveUrl) throw new Error('GitHub Pages API did not return a live URL');

  let targetSha = await currentMainSha();
  let run=null;
  let lastInProgressSha=null;
  let lastComparedTargetSha=null;
  // Allow enough time for a real Pages deployment to finish. Internal-only
  // checkpoint/doc commits do not need a new site deployment, so when no exact
  // SHA match exists we compare the latest successful deployment against main
  // and accept it when the intervening files are outside the deploy trigger set.
  for (let attempt=0; attempt<24; attempt++) {
    if (runningScheduledHealth) targetSha = await currentMainSha();
    const runs=await jsonFetch(RUNS_API);
    const workflowRuns=[...(runs.workflow_runs||[])];
    const successful=workflowRuns.filter(x => x.status==='completed' && x.conclusion==='success');

    run = successful.find(x=>x.head_sha===targetSha) || null;
    if (run) break;

    const latestSuccessful=successful[0] || null;
    if (latestSuccessful && lastComparedTargetSha!==targetSha) {
      lastComparedTargetSha=targetSha;
      const changed=await changedFilesBetween(latestSuccessful.head_sha,targetSha);
      if (changed && !changed.some(deploymentPathChanged)) {
        run=latestSuccessful;
        console.log(`Pages deployment: PASS (${latestSuccessful.html_url}); only non-deploying files changed after deployed SHA.`);
        break;
      }
    }

    const inProgress=workflowRuns.find(x =>
      x.status==='in_progress' &&
      x.head_branch==='main' &&
      x.head_sha===targetSha
    );
    if (inProgress) {
      if (lastInProgressSha!==inProgress.head_sha) {
        console.log(`Pages deployment still running for ${inProgress.head_sha} (${inProgress.html_url}). Waiting for completion.`);
        lastInProgressSha=inProgress.head_sha;
      }
    } else {
      lastInProgressSha=null;
    }

    await new Promise(r=>setTimeout(r,15000));
  }

  if (!run) throw new Error(`No successful Deploy Pages workflow run covers main ${targetSha} after waiting for the deployment lane`);
  if (!run.html_url) console.log(`Pages deployment: PASS (${run.head_sha})`);
  else if (run.head_sha!==targetSha) console.log(`Pages deployment: PASS (${run.html_url})`);
  return liveUrl;
}
async function browserCheck(liveUrl, pedals, canaries) {
  const {builderCanary,positiveCanary,noPhotoCanary,variationCanary}=canaries;
  const browser=await chromium.launch({headless:true});
  const results=[];
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const consoleErrors=[], pageErrors=[];
    page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text())});
    page.on('pageerror',e=>pageErrors.push(String(e)));
    const home=await page.goto(liveUrl+'/?health='+Date.now(),{waitUntil:'networkidle',timeout:30000});
    if(!home || !home.ok()) throw new Error(`Catalog HTTP failure: ${home?.status()}`);
    if(await page.locator('#search').count()!==1) throw new Error('Search control missing');
    if(await page.locator('[data-type]').count()<4) throw new Error('Dirt-type filters missing');
    if(await page.locator('[data-builder]').count()<2) throw new Error('Builder controls missing');
    if(await page.locator('#grid .card').count()===0) throw new Error('Catalog rendered zero cards');
    const firstHref=await page.locator('#grid .card').first().getAttribute('href');
    if(!firstHref || !firstHref.includes('pedal-detail.html?builder=')) throw new Error('Catalog card routing is malformed');

    if(variationCanary){
      await page.locator('#search').fill(String(variationCanary.variation_name));
      if(await page.locator('#grid .card').filter({hasText:String(variationCanary.parent_pedal)}).count()===0) throw new Error('Variation search canary failed.');
    }
    await page.locator('#search').fill('ZZZZ_NOT_A_PEDAL_9f4a');
    if(await page.locator('#grid .card').count()!==0) throw new Error('No-result search failed');

    await page.goto(liveUrl+'/?health='+Date.now(),{waitUntil:'networkidle',timeout:30000});
    await page.locator('[data-type="Fuzz"]').click();
    for(const chipText of await page.locator('#grid .card .chips').allTextContents()){
      if(!chipText.includes('Fuzz')) throw new Error('Fuzz filter leaked a non-Fuzz card');
    }

    await page.goto(liveUrl+'/?health='+Date.now(),{waitUntil:'networkidle',timeout:30000});
    const builder=page.locator('[data-builder="'+String(builderCanary.company).replace(/"/g,'\\"')+'"]');
    if(await builder.count()!==1) throw new Error('Catalog-derived builder canary missing');
    await builder.click();
    const bt=await page.locator('#grid .builderNameCard').allTextContents();
    if(!bt.length || bt.some(x=>x.trim()!==String(builderCanary.company))) throw new Error('Builder filter is leaking other builders');

    const ched=positiveCanary;
    const astro=noPhotoCanary;

    async function detail(item, expectPhoto) {
      await page.goto(liveUrl+'/pedal-detail.html?builder='+encodeURIComponent(item.company)+'&pedal='+encodeURIComponent(item.pedal)+'&health='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForFunction(()=>{const r=document.querySelector('#record');return r&&!r.hidden},null,{timeout:10000});
      await page.waitForFunction(()=>{
        const r=document.querySelector('#research');
        const t=(r?.textContent||'').trim();
        return t.length>=40 || /could not be loaded|has not been added yet/i.test(t);
      },null,{timeout:15000});
      const info=await page.locator('#research').textContent();
      if(!info || /could not be loaded/i.test(info) || info.trim().length<40) throw new Error(`Pedal Info failed: ${item.company} / ${item.pedal}`);
      if(expectPhoto){
        const img=page.locator('#photoBox img');
        if(await img.count()!==1) throw new Error(`Photo element missing: ${item.company} / ${item.pedal}`);
        const src=await img.getAttribute('src');
        const normalizedExpected = item.image ? new URL(item.image, liveUrl + '/').pathname : item.image;
        const normalizedSrc = src ? new URL(src, liveUrl + '/').pathname : src;
        if(normalizedSrc!==normalizedExpected) throw new Error('Photo wiring mismatch: '+item.company+' / '+item.pedal+': expected '+normalizedExpected+', got '+normalizedSrc);
        const handled=await page.evaluate(()=>{const box=document.querySelector('#photoBox');const img=box?.querySelector('img');const fallback=[...box?.querySelectorAll('span')||[]].find(s=>!s.hidden);return !!img && ((img.complete&&img.naturalWidth>0)||!!fallback)});
        if(!handled) throw new Error(`Photo did not render or fall back gracefully: ${item.company} / ${item.pedal}`);
      } else {
        const fallback=await page.locator('#photoBox').getByText(/No Photo Archived/).count();
        if(!fallback) throw new Error(`No Photo Archived fallback missing: ${item.company} / ${item.pedal}`);
      }
    }
    await detail(ched,!!ched.image);
    if(astro) await detail(astro,false);

    const localPhoto = pedals.find(x => isLocalImagePath(x.image) && x.catalog_role !== 'variation');
    if (localPhoto) await detail(localPhoto,true);

    await page.setViewportSize({width:390,height:844});
    await page.goto(liveUrl+'/?health='+Date.now(),{waitUntil:'networkidle',timeout:30000});
    if(await page.locator('#grid .card').count()===0) throw new Error('Mobile catalog rendered zero cards');

    if(consoleErrors.length) throw new Error('Browser console errors: '+consoleErrors.slice(0,10).join(' | '));
    if(pageErrors.length) throw new Error('Browser page errors: '+pageErrors.slice(0,10).join(' | '));
    console.log('Browser canaries: PASS (catalog/search/filter/detail/Pedal Info/photo/mobile)');
  } finally { await browser.close(); }
}
(async()=>{
  console.log(`Hourly site health for ${currentSha}`);
  const data=checkDataIntegrity();
  const liveUrl=await waitForDeployment();
  await browserCheck(liveUrl,data.pedals,data.canaries);
  console.log('HEALTH CHECK PASSED');
})().catch(err=>{console.error('HEALTH CHECK FAILED:',err.message);process.exit(1)});
