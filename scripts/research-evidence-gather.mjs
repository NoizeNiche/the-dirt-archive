import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const TRACKER = path.join(process.cwd(), 'research/PRP_TRACKER.csv');
const OVERRIDES = path.join(process.cwd(), 'research/PHOTO_SOURCE_OVERRIDES.csv');
const RESEARCH_SOURCE_OVERRIDES = path.join(process.cwd(), 'research/RESEARCH_SOURCE_OVERRIDES.csv');
const VERIFIED_SOURCE_CACHE = path.join(process.cwd(), 'research/RESEARCH_VERIFIED_SOURCE_CACHE.json');
const INDEX = path.join(process.cwd(), 'research/PEDAL_INDEX.json');
const OUT = path.join(process.cwd(), 'artifact');
const WORKER_INDEX = Math.max(0, Number(process.env.RESEARCH_WORKER_INDEX || 0));
const WORKER_COUNT = Math.max(1, Number(process.env.RESEARCH_WORKER_COUNT || 20));
const TARGETS_PER_WORKER = Math.max(1, Number(process.env.RESEARCH_TARGETS_PER_WORKER || 4));
const EXPLICIT_TARGETS_JSON = String(process.env.RESEARCH_TARGETS_JSON || '').trim();
const TIMEOUT = Math.max(2500, Number(process.env.RESEARCH_REQUEST_TIMEOUT_MS || 5000));

function csvRows(raw) {
  const lines=raw.split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  function parse(line){
    const out=[]; let v=''; let q=false;
    for(let i=0;i<line.length;i++){
      const c=line[i], n=line[i+1];
      if(q){ if(c==='"' && n==='"'){v+='"';i++;} else if(c==='"') q=false; else v+=c; }
      else if(c==='"') q=true;
      else if(c===','){out.push(v);v='';}
      else v+=c;
    }
    out.push(v); return out;
  }
  const h=parse(lines[0]);
  return lines.slice(1).map(line=>Object.fromEntries(parse(line).map((v,i)=>[h[i],(v||'').trim()])));
}
function norm(v){return String(v||'').toLowerCase().replace(/\+/g,' plus ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
function slug(v){return String(v||'').trim().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,120)||'unknown';}
function toks(v){return norm(v).split(/\s+/).filter(x=>x.length>=3||/\d/.test(x));}
function pedalIdentityVariants(pedal){
  const raw=String(pedal||'').trim();
  const variants=[raw];
  // Catalog records sometimes append a descriptive effect class after an em dash,
  // while source pages use only the model name. Treat the left-hand model name as
  // an exact identity variant without weakening ordinary hyphenated model names.
  const core=raw.split(/\\s+—\\s+/)[0].trim();
  if(core && core!==raw) variants.push(core);
  // Historical and retailer pages frequently collapse compound pedal names
  // (for example FatRock or TightRock) into one token. Accept that spelling as
  // an exact identity variant when the page title/H1/URL uses it.
  for(const value of [raw, core]){
    const compact=norm(value).replace(/\\s+/g,'');
    if(compact && !variants.some(v=>norm(v)===compact)) variants.push(compact);
  }
  // The archive's AMT catalog name and surviving listings use a documented
  // alias for the same Rammstein distortion: "Rammstein Du Hast". Accept that
  // model spelling as an exact identity variant for this specific record.
  if(norm(raw).includes('rammstein rd distortion combo emulator')){
    variants.push('Rammstein Du Hast');
  }
  return [...new Set(variants)];
}
function fit(builder,pedal,text){
  const h=norm(text), bt=toks(builder), variants=pedalIdentityVariants(pedal);
  const bh=bt.filter(x=>h.includes(x)).length;
  const variantStats=variants.map(v=>({v, n:norm(v), toks:toks(v)})).filter(x=>x.n);
  let best={pedalHits:0,exact:false,n:''};
  for(const v of variantStats){
    const pedalHits=v.toks.filter(x=>h.includes(x)).length;
    const exact=h.includes(v.n);
    if((exact&&!best.exact) || (exact===best.exact && pedalHits>best.pedalHits)) best={pedalHits,exact,n:v.n};
  }
  const ph=best.pedalHits, exact=best.exact;
  return {score:ph*18+bh*10+(exact?70:0),builderHits:bh,pedalHits:ph,exactPedal:exact};
}
function host(url){try{return new URL(url).hostname.toLowerCase();}catch{return '';}}

async function boundedMap(items, limit, fn){
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({length: Math.min(limit, items.length)}, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      try { out[index] = await fn(items[index], index); }
      catch { out[index] = null; }
    }
  });
  await Promise.all(workers);
  return out;
}
async function get(url){
  const ac=new AbortController(), timer=setTimeout(()=>ac.abort(),TIMEOUT);
  let tempDir='';
  try{
    const r=await fetch(url,{signal:ac.signal,redirect:'follow',headers:{
      'User-Agent':'Mozilla/5.0 The-Dirt-Archive research worker',
      'Accept-Language':'en-US,en;q=0.8'
    }});
    if(!r.ok) return null;
    const finalUrl=r.url||url;
    const type=String(r.headers.get('content-type')||'').toLowerCase();
    const bytes=Buffer.from(await r.arrayBuffer());
    const isPdf=type.includes('application/pdf') || /\\.pdf(?:$|[?#])/i.test(finalUrl);
    if(isPdf){
      // GitHub runners include pdftotext. Extract readable manual/review text so
      // binary PDF bytes never become canonical research excerpts.
      tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'dirt-pdf-'));
      const pdfPath=path.join(tempDir,'source.pdf');
      fs.writeFileSync(pdfPath,bytes);
      const text=execFileSync('pdftotext',['-layout',pdfPath,'-'],{encoding:'utf8',maxBuffer:8*1024*1024})
        .replace(/\\s+$/,'').slice(0,600000);
      return {url:finalUrl,text};
    }
    return {url:finalUrl,text:bytes.toString('utf8').slice(0,600000)};
  }catch{return null;} finally{
    clearTimeout(timer);
    if(tempDir) try{fs.rmSync(tempDir,{recursive:true,force:true});}catch{}
  }
}
function strip(s){
  const raw=String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  // Decode HTML entities after tag removal so model names and punctuation
  // remain searchable (e.g. &#8211; in scraped product titles).
  return raw
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
    .trim();
}
function parseResults(html){
  const out=[];
  const patterns=[
    /<li[^>]+class=["'][^"']*b_algo[^"']*["'][\s\S]*?<h2[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>([\s\S]*?)<\/li>/gi,
    /<a[^>]+class=["']result__a["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    /<a[^>]+href=["'](\/url\?q=[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  ];
  for(const p of patterns) for(const m of html.matchAll(p)){
    let u=String(m[1]||'').replace(/&amp;/g,'&');
    try{
      const q=new URL(u,'https://www.google.com').searchParams;
      if(q.get('uddg')) u=q.get('uddg');
      else if(q.get('q') && u.startsWith('/url')) u=q.get('q');
    }catch{}
    if(/^https?:/i.test(u)) out.push({url:u.split('#')[0],title:strip(m[2])});
  }
  return out;
}
function parseLinks(html,baseUrl){
  const out=[]; const seen=new Set();
  const re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for(const m of html.matchAll(re)){
    let u=String(m[1]||'').replace(/&amp;/g,'&').trim();
    if(!u || /^javascript:|^mailto:|^tel:/i.test(u)) continue;
    try{ u=new URL(u,baseUrl).href.split('#')[0]; }catch{ continue; }
    if(!/^https?:/i.test(u)) continue;
    if(seen.has(u)) continue;
    seen.add(u);
    out.push({url:u,title:strip(m[2])});
  }
  return out.slice(0,60);
}
async function search(q){
  const endpoints=[
    'https://www.bing.com/search?q='+encodeURIComponent(q),
    'https://html.duckduckgo.com/html/?q='+encodeURIComponent(q),
    'https://www.google.com/search?q='+encodeURIComponent(q)
  ];
  const out=[]; const seen=new Set();
  const results = await boundedMap(endpoints, 3, async endpoint => {
    const r=await get(endpoint);
    return r ? parseResults(r.text) : [];
  });
  // Take a small tranche from each engine so one engine does not monopolize
  // the discovery budget when its index happens to rank many low-value pages.
  for(const batch of results){
    for(const x of (batch || []).slice(0,6)){
      if(seen.has(x.url)) continue;
      seen.add(x.url); out.push(x);
      if(out.length>=18) break;
    }
    if(out.length>=18) break;
  }
  return out.slice(0,18);
}
function catalogModels(builder){
  try{
    const c=JSON.parse(fs.readFileSync(INDEX,'utf8'));
    return [...new Set((c.pedals||[])
      .filter(x=>x.company===builder)
      .map(x=>String(x.pedal||'').trim())
      .filter(Boolean))];
  }catch{return [];}
}
function sourcePages(builder,pedal){
  const urls=[];
  // Reuse previously foreman-verified exact source leads as a cache. These
  // packets have already cleared the archive's identity gate, so they are
  // safe to re-seed for another independent verification pass instead of
  // forcing search engines to rediscover the same obscure listings.
  try{
    const inboxPath=path.join(process.cwd(),'research/RESEARCH_INBOX',slug(builder),slug(pedal)+'.json');
    const packet=JSON.parse(fs.readFileSync(inboxPath,'utf8'));
    if(packet.status==='VERIFIED_EVIDENCE_STAGED' && Array.isArray(packet.sources)){
      for(const source of packet.sources){
        const u=String(source?.url||'').trim();
        if(/^https?:/i.test(u)) urls.push(u);
      }
    }
  }catch{}
  try{
    const c=JSON.parse(fs.readFileSync(INDEX,'utf8'));
    for(const item of c.pedals||[]){
      if(item.company===builder && item.pedal===pedal){
        for(const k of ['source_page','image_source_page']) if(String(item[k]||'').startsWith('http')) urls.push(item[k]);
        if(Array.isArray(item.source_pages)) for(const v of item.source_pages) if(String(v).startsWith('http')) urls.push(v);
        break;
      }
    }
  }catch{}
  try{
    const rows=csvRows(fs.readFileSync(OVERRIDES,'utf8'));
    for(const r of rows) if(r.Builder===builder && r.Pedal===pedal && /^https?:/i.test(r['Image Source Page']||'')) urls.push(r['Image Source Page']);
  }catch{}
  try{
    const rows=csvRows(fs.readFileSync(RESEARCH_SOURCE_OVERRIDES,'utf8'));
    for(const r of rows) if(r.Builder===builder && r.Pedal===pedal && /^https?:/i.test(r['Source URL']||'')) urls.push(r['Source URL']);
  }catch{}
  return [...new Set(urls)];
}
function pageInfo(html){
  return {
    title:strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),
    h1:strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||''),
    description:strip(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]||''),
    body:strip(html.slice(0,260000)).slice(0,4000)
  };
}
function signals(s){
  const rules={
    controls:/\b(volume|level|gain|drive|tone|bass|treble|mid|mix|blend|bias|fuzz|boost|controls?|knobs?)\b/gi,
    transistor:/\b(?:2N\d+[A-Z]?|BC\d+[A-Z]?|AC\d+[A-Z0-9-]*|germanium transistor|silicon transistor)\b/gi,
    diode:/\b(?:1N\d+[A-Z]?|BAT\d+[A-Z]?|LEDs?|germanium diode|silicon diode)\b/gi,
    power:/\b(?:9\s*V|12\s*V|18\s*V|24\s*V|battery|center[- ]negative|center[- ]positive|adapter|supply)\b/gi,
    versions:/\b(?:v1|v2|v3|version \d|revision|mk ?[ivx0-9]+|reissue|limited edition)\b/gi
  };
  const out={};
  for(const [k,re] of Object.entries(rules)) out[k]=[...new Set(String(s||'').match(re)||[])].slice(0,24);
  return out;
}
function sourceKind(builder,url,exactCatalogUrls=new Set(),originalUrl=''){
  const h=host(url), hc=h.replace(/[^a-z0-9]/g,''), bc=norm(builder).replace(/[^a-z0-9]/g,'');
  if(h.includes('effectsdatabase')) return 'effects_database';
  if(h.includes('reverb.com')) return 'reverb';
  if(bc && hc.includes(bc)) return 'manufacturer';
  // Curated research overrides remain catalog-verified even when the source
  // redirects to a new canonical URL. Preserve the stronger provenance class.
  if(exactCatalogUrls.has(url) || exactCatalogUrls.has(originalUrl)) return 'catalog_verified';
  return 'other';
}
function romanAscii(v){
  return String(v||'')
    .replace(/[Ⅰ]/g,'I').replace(/[Ⅱ]/g,'II').replace(/[Ⅲ]/g,'III')
    .replace(/[Ⅳ]/g,'IV').replace(/[Ⅴ]/g,'V').replace(/[Ⅵ]/g,'VI')
    .replace(/[Ⅶ]/g,'VII').replace(/[Ⅷ]/g,'VIII').replace(/[Ⅸ]/g,'IX')
    .replace(/[Ⅹ]/g,'X');
}
function searchQueries(builder,pedal){
  const b=String(builder||'').trim(), p=String(pedal||'').trim();
  const pa=romanAscii(p);
  const pn=norm(p);
  const variants=[
    '"'+b+'" "'+p+'"',
    '"'+b+'" "'+pa+'"',
    '"'+b+'" "'+p+'" manual specs review',
    '"'+p+'" "'+b+'" Reverb Effects Database',
    'site:effectsdatabase.com/model "'+b+'" "'+p+'"',
    'site:reverb.com/item "'+b+'" "'+p+'"',
    'site:manualslib.com "'+b+'" "'+p+'"'
  ];
  // Prefer a compact discovery fan-out when exact source leads are already
  // wired for the target. The gatherer still verifies those URLs and can
  // fall back to independent search when the exact leads do not yield enough
  // usable evidence. This keeps each worker focused on evidence collection
  // instead of spending most of its budget issuing near-duplicate searches.
  if(pn.includes('tone bender')){
    variants.push('"'+b+'" "Tone Bender"');
    variants.push('"'+b+'" "TONE BENDER M.K"');
  }
  return [...new Set(variants.filter(Boolean))];
}
async function targetRecord(builder,pedal,type){
  const urls=sourcePages(builder,pedal);
  const exactCatalogUrls=new Set(urls);
  const verifiedCache=new Map();
  try{
    const inboxPath=path.join(process.cwd(),'research/RESEARCH_INBOX',slug(builder),slug(pedal)+'.json');
    const packet=JSON.parse(fs.readFileSync(inboxPath,'utf8'));
    if(packet.status==='VERIFIED_EVIDENCE_STAGED' && Array.isArray(packet.sources)){
      for(const source of packet.sources){
        const u=String(source?.url||'').trim();
        if(/^https?:/i.test(u)) verifiedCache.set(u,source);
      }
    }
  }catch{}
  // Reuse externally inspected exact-model excerpts when a live page is
  // unavailable or unstable. This cache is evidence, not publication: the
  // ordinary foreman identity and multi-host checks still apply.
  try{
    const cache=JSON.parse(fs.readFileSync(VERIFIED_SOURCE_CACHE,'utf8'));
    for(const record of cache.records || []){
      if(record?.builder!==builder || record?.pedal!==pedal || !Array.isArray(record.sources)) continue;
      for(const source of record.sources){
        const u=String(source?.url||'').trim();
        if(/^https?:/i.test(u)) verifiedCache.set(u,{
          ...source,
          source_kind:source.source_kind || 'catalog_verified'
        });
      }
    }
  }catch{}
  const models=catalogModels(builder);
  const queries=searchQueries(builder,pedal);
  const found=new Map();
  for(const u of urls){
    const cached=verifiedCache.get(u);
    found.set(u,{
      url:u,
      title:cached?.title || 'catalog/override source',
      h1:cached?.h1 || '',
      description:cached?.description || '',
      bodyExcerpt:cached?.excerpt || ''
    });
  }
  // When exact source pages are known, mine a bounded set of external links
  // from those pages before relying on search-engine discovery. This is
  // especially useful for punctuation-heavy vintage model names that search
  // engines may normalize poorly.
  const minedLinks = await boundedMap(urls, 3, async u => {
    if(verifiedCache.has(u)) return [];
    const page=await get(u);
    if(!page) return [];
    const baseHost=host(page.url||u);
    return parseLinks(page.text,page.url||u).filter(x => {
      const xHost=host(x.url);
      if(!xHost || xHost===baseHost) return false;
      const f=fit(builder,pedal,(x.title||'')+' '+x.url);
      return Boolean(f.builderHits || f.pedalHits || /youtube|reverb|effectsdatabase|guitar|pedal/i.test(xHost+' '+x.title));
    });
  });
  for(const batch of minedLinks){
    for(const x of batch || []) if(!found.has(x.url)) found.set(x.url,x);
  }
  // Only count hosts that already produced verified cached evidence as
  // established coverage. Merely having two override URLs is not enough:
  // either URL may be dead, blocked, or redirect to an unusable page. This
  // prevents curated leads from accidentally suppressing the discovery
  // search that can supply a second independent source.
  const cachedHosts = new Set([...verifiedCache.keys()].map(host).filter(Boolean));
  if(cachedHosts.size < 2){
    const queryResults = await boundedMap(queries, 3, q => search(q));
    for(const batch of queryResults){
      for(const x of batch || []) if(!found.has(x.url)) found.set(x.url,x);
    }
  }
  const candidates=[...found.values()];
  const ranked=candidates.map(x=>({x,f:fit(builder,pedal,x.title+' '+x.url)}))
    .sort((a,b)=>b.f.score-a.f.score).slice(0,12);
  const fetched = await boundedMap(ranked, 3, async item => {
    const cached=verifiedCache.get(item.x.url);
    const p=cached ? null : await get(item.x.url);
    const info=cached
      ? {
          title:String(cached.title||item.x.title||''),
          h1:String(cached.h1||''),
          description:String(cached.description||''),
          body:String(cached.excerpt||'')
        }
      : p
        ? pageInfo(p.text)
        : {title:item.x.title,h1:'',description:'',body:''};
    const u=p?.url||item.x.url;
    const fullText=info.title+' '+info.h1+' '+info.description+' '+info.body+' '+u;
    const f=fit(builder,pedal,fullText);
    if(!f.pedalHits || !f.builderHits) return null;
    const target=norm(pedal);
    const bodyNorm=norm(info.body);
    if(models.length && target && !bodyNorm.includes(target)){
      const conflicting=models.some(other=>{
        const on=norm(other);
        return on && on!==target && bodyNorm.includes(on);
      });
      // Exact-model pages often contain a builder-wide catalog/footer that
      // mentions sibling pedals. If the page title/H1/URL itself carries the
      // exact pedal identity, do not reject it merely because that noisy body
      // also mentions another model.
      if(conflicting && !f.exactPedal) return null;
    }
    return {
      url:u,host:host(u),title:info.title,h1:info.h1,description:info.description,
      snippet:item.x.title,bodyExcerpt:info.body,identity:f,
      signals:signals(fullText),
      sourceKind:cached?.source_kind || sourceKind(builder,u,exactCatalogUrls,item.x.url),
      collectedAt:new Date().toISOString(),
      reusedVerifiedEvidence:Boolean(cached)
    };
  });
  const sources=[];
  const acceptedUrls=new Set();
  for(const source of fetched){
    if(!source || acceptedUrls.has(source.url)) continue;
    acceptedUrls.add(source.url);
    sources.push(source);
  }
  const hosts=new Set(sources.map(x=>x.host).filter(Boolean));
  const strong=sources.filter(x=>x.identity.exactPedal);
  return {
    builder,pedal,catalogType:type,sources,
    sourceCount:sources.length,distinctHostCount:hosts.size,strongSourceCount:strong.length,
    foremanVerdict:hosts.size>=2&&strong.length>=1?'EVIDENCE_READY':sources.length?'MORE_SOURCES_NEEDED':'NO_USABLE_EVIDENCE'
  };
}

const rows=csvRows(fs.readFileSync(TRACKER,'utf8')).filter(r=>r['Pedal Info']!=='DONE')
  .map((r,i)=>({...r,_order:Number(r.Order)||i})).sort((a,b)=>a._order-b._order);
const span=WORKER_COUNT*TARGETS_PER_WORKER;
// Keep the autonomous evidence crew locked to the same canonical A→Z
// frontier as the main research workers. Do not rotate across the entire
// remaining catalog, or C can starve while later letters are researched.
// The coordinator supplies exact target identities through the matrix.
// Honor that handoff instead of reconstructing a second queue in each worker.
let frontier;
try{
  const explicit=JSON.parse(EXPLICIT_TARGETS_JSON);
  frontier=Array.isArray(explicit) ? explicit.map(r => ({
    Builder: String(r?.builder || '').trim(),
    Pedal: String(r?.pedal || '').trim()
  })).filter(r => r.Builder && r.Pedal) : [];
}catch{
  frontier=[];
}
if(!frontier.length){
  // Safe fallback for manual/local runs without an explicit matrix.
  frontier=rows.slice(0,span).map(r => ({Builder:r.Builder,Pedal:r.Pedal}));
}
const targets=frontier.slice(
  0,
  TARGETS_PER_WORKER
);

fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const records = await Promise.all(
  targets.map(r => targetRecord(r.Builder, r.Pedal, r.Type || r['Catalog Type'] || ''))
 );
fs.writeFileSync(path.join(OUT,'research-evidence.json'),JSON.stringify({
  workerIndex:WORKER_INDEX,workerCount:WORKER_COUNT,targetCount:records.length,records
},null,2)+'\n','utf8');
console.log(JSON.stringify({
  workerIndex:WORKER_INDEX,
  targets:records.map(r=>r.builder+' / '+r.pedal),
  ready:records.filter(r=>r.foremanVerdict==='EVIDENCE_READY').length,
  sources:records.reduce((n,r)=>n+r.sourceCount,0)
},null,2));
