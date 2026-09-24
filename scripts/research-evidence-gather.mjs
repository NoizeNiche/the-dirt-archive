import fs from 'node:fs';
import path from 'node:path';

const TRACKER = path.join(process.cwd(), 'research/PRP_TRACKER.csv');
const OVERRIDES = path.join(process.cwd(), 'research/PHOTO_SOURCE_OVERRIDES.csv');
const INDEX = path.join(process.cwd(), 'research/PEDAL_INDEX.json');
const OUT = path.join(process.cwd(), 'artifact');
const WORKER_INDEX = Math.max(0, Number(process.env.RESEARCH_WORKER_INDEX || 0));
const WORKER_COUNT = Math.max(1, Number(process.env.RESEARCH_WORKER_COUNT || 20));
const TARGETS_PER_WORKER = Math.max(1, Number(process.env.RESEARCH_TARGETS_PER_WORKER || 4));
const RUN_NUMBER = Math.max(1, Number(process.env.GITHUB_RUN_NUMBER || 1));
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
function toks(v){return norm(v).split(/\s+/).filter(x=>x.length>=3||/\d/.test(x));}
function fit(builder,pedal,text){
  const h=norm(text), bt=toks(builder), pt=toks(pedal);
  const bh=bt.filter(x=>h.includes(x)).length, ph=pt.filter(x=>h.includes(x)).length;
  const exact=!!norm(pedal)&&h.includes(norm(pedal));
  return {score:ph*18+bh*10+(exact?70:0),builderHits:bh,pedalHits:ph,exactPedal:exact};
}
function host(url){try{return new URL(url).hostname.toLowerCase();}catch{return '';}}
async function get(url){
  const ac=new AbortController(), timer=setTimeout(()=>ac.abort(),TIMEOUT);
  try{
    const r=await fetch(url,{signal:ac.signal,redirect:'follow',headers:{
      'User-Agent':'Mozilla/5.0 The-Dirt-Archive research worker',
      'Accept-Language':'en-US,en;q=0.8'
    }});
    if(!r.ok) return null;
    return {url:r.url||url,text:(await r.text()).slice(0,600000)};
  }catch{return null;} finally{clearTimeout(timer);}
}
function strip(s){
  return String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,' ').replace(/\s+/g,' ').trim();
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
async function search(q){
  const endpoints=[
    'https://www.bing.com/search?q='+encodeURIComponent(q),
    'https://html.duckduckgo.com/html/?q='+encodeURIComponent(q),
    'https://www.google.com/search?q='+encodeURIComponent(q)
  ];
  const out=[]; const seen=new Set();
  for(const endpoint of endpoints){
    const r=await get(endpoint);
    if(!r) continue;
    for(const x of parseResults(r.text)){
      if(seen.has(x.url)) continue;
      seen.add(x.url); out.push(x);
    }
    if(out.length>=18) break;
  }
  return out.slice(0,18);
}
function sourcePages(builder,pedal){
  const urls=[];
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
function sourceKind(builder,url){
  const h=host(url), hc=h.replace(/[^a-z0-9]/g,''), bc=norm(builder).replace(/[^a-z0-9]/g,'');
  if(h.includes('effectsdatabase')) return 'effects_database';
  if(h.includes('reverb.com')) return 'reverb';
  if(bc && hc.includes(bc)) return 'manufacturer';
  return 'other';
}
async function targetRecord(builder,pedal,type){
  const urls=sourcePages(builder,pedal);
  const queries=[
    '"'+builder+'" "'+pedal+'"',
    '"'+builder+'" "'+pedal+'" manual specs review',
    '"'+pedal+'" "'+builder+'" Reverb Effects Database'
  ];
  const found=new Map();
  for(const u of urls) found.set(u,{url:u,title:'catalog/override source'});
  for(const q of queries) for(const x of await search(q)) if(!found.has(x.url)) found.set(x.url,x);
  const candidates=[...found.values()];
  const ranked=candidates.map(x=>({x,f:fit(builder,pedal,x.title+' '+x.url)}))
    .sort((a,b)=>b.f.score-a.f.score).slice(0,12);
  const sources=[];
  for(const item of ranked){
    const p=await get(item.x.url);
    const info=p?pageInfo(p.text):{title:item.x.title,h1:'',description:'',body:''};
    const u=p?.url||item.x.url;
    const f=fit(builder,pedal,info.title+' '+info.h1+' '+info.description+' '+info.body+' '+u);
    if(!f.pedalHits || !f.builderHits) continue;
    sources.push({
      url:u,host:host(u),title:info.title,h1:info.h1,description:info.description,
      snippet:item.x.title,bodyExcerpt:info.body,identity:f,
      signals:signals(info.title+' '+info.h1+' '+info.description+' '+info.body),
      sourceKind:sourceKind(builder,u),collectedAt:new Date().toISOString()
    });
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
const start=rows.length?(((RUN_NUMBER-1)*span)%rows.length):0;
const targets=[];
for(let j=0;j<TARGETS_PER_WORKER&&rows.length;j++) targets.push(rows[(start+WORKER_INDEX*TARGETS_PER_WORKER+j)%rows.length]);

fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const records=[];
for(const r of targets) records.push(await targetRecord(r.Builder,r.Pedal,r.Type||r['Catalog Type']||''));
fs.writeFileSync(path.join(OUT,'research-evidence.json'),JSON.stringify({
  workerIndex:WORKER_INDEX,workerCount:WORKER_COUNT,runNumber:RUN_NUMBER,targetCount:records.length,records
},null,2)+'\n','utf8');
console.log(JSON.stringify({
  workerIndex:WORKER_INDEX,
  targets:records.map(r=>r.builder+' / '+r.pedal),
  ready:records.filter(r=>r.foremanVerdict==='EVIDENCE_READY').length,
  sources:records.reduce((n,r)=>n+r.sourceCount,0)
},null,2));
