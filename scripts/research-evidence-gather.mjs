
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TRACKER = path.join(ROOT, 'research/PRP_TRACKER.csv');
const OUT = path.join(ROOT, 'artifact');
const WORKER_INDEX = Math.max(0, Number(process.env.RESEARCH_WORKER_INDEX || 0));
const WORKER_COUNT = Math.max(1, Number(process.env.RESEARCH_WORKER_COUNT || 20));
const TARGETS_PER_WORKER = Math.max(1, Number(process.env.RESEARCH_TARGETS_PER_WORKER || 4));
const RUN_NUMBER = Math.max(1, Number(process.env.GITHUB_RUN_NUMBER || 1));
const TIMEOUT = Math.max(2500, Number(process.env.RESEARCH_REQUEST_TIMEOUT_MS || 5000));

function csvRows(raw) {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  function parse(line) {
    const out = []; let v = ''; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i], n = line[i + 1];
      if (q) { if (c === '"' && n === '"') { v += '"'; i++; } else if (c === '"') q = false; else v += c; }
      else if (c === '"') q = true;
      else if (c === ',') { out.push(v); v = ''; }
      else v += c;
    }
    out.push(v); return out;
  }
  const h = parse(lines[0]);
  return lines.slice(1).map(line => Object.fromEntries(parse(line).map((v, i) => [h[i], (v || '').trim()])));
}

function norm(v) {
  return String(v || '').toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function toks(v) { return norm(v).split(/\s+/).filter(x => x.length >= 3 || /\d/.test(x)); }
function fit(builder, pedal, text) {
  const h = norm(text);
  const bt = toks(builder), pt = toks(pedal);
  const bh = bt.filter(x => h.includes(x)).length;
  const ph = pt.filter(x => h.includes(x)).length;
  const exact = norm(pedal) && h.includes(norm(pedal));
  return { score: ph * 18 + bh * 10 + (exact ? 70 : 0), builderHits: bh, pedalHits: ph, exactPedal: Boolean(exact) };
}
function host(url) { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } }

async function get(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 The-Dirt-Archive research worker', 'Accept-Language': 'en-US,en;q=0.8' } });
    if (!r.ok) return null;
    return { url: r.url || url, text: (await r.text()).slice(0, 500000) };
  } catch { return null; } finally { clearTimeout(t); }
}

function strip(s) {
  return String(s || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ').trim();
}
function bing(html) {
  const out = [];
  for (const m of String(html || '').matchAll(/<li[^>]+class=["'][^"']*b_algo[^"']*["'][\s\S]*?<h2[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>([\s\S]*?)<\/li>/gi)) {
    const url = String(m[1] || '').replace(/&amp;/g, '&');
    if (/^https?:/i.test(url)) out.push({ url: url.split('#')[0], title: strip(m[2]), snippet: strip(m[3]).slice(0, 1200) });
  }
  return out;
}
function pageInfo(html) {
  return {
    title: strip(String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''),
    h1: strip(String(html).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || ''),
    description: strip(String(html).match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || ''),
    body: strip(html.slice(0, 220000)).slice(0, 2200)
  };
}
function signals(s) {
  const out = {};
  const rules = {
    controls: /\b(volume|level|gain|drive|tone|bass|treble|mid|mix|blend|bias|fuzz|boost|controls?|knobs?)\b/gi,
    transistor: /\b(?:2N\d+[A-Z]?|BC\d+[A-Z]?|AC\d+[A-Z0-9-]*|germanium transistor|silicon transistor)\b/gi,
    diode: /\b(?:1N\d+[A-Z]?|BAT\d+[A-Z]?|LEDs?|germanium diode|silicon diode)\b/gi,
    power: /\b(?:9\s*V|12\s*V|18\s*V|24\s*V|battery|center[- ]negative|center[- ]positive|adapter|supply)\b/gi,
    versions: /\b(?:v1|v2|v3|version \d|revision|mk ?[ivx0-9]+|reissue|limited edition)\b/gi
  };
  for (const k of Object.keys(rules)) out[k] = [...new Set((s.match(rules[k]) || []).map(x => x.replace(/\s+/g, ' ').trim()))].slice(0, 24);
  return out;
}

async function search(q) {
  const r = await get('https://www.bing.com/search?q=' + encodeURIComponent(q));
  return r ? bing(r.text) : [];
}

async function targetRecord(builder, pedal, type) {
  const queries = ['"' + builder + '" "' + pedal + '"', '"' + builder + '" "' + pedal + '" manual review specs'];
  const map = new Map();
  for (const q of queries) for (const x of await search(q)) if (!map.has(x.url)) map.set(x.url, { ...x, query: q });
  const ranked = [...map.values()].map(x => ({ x, f: fit(builder, pedal, x.title + ' ' + x.snippet + ' ' + x.url) }))
    .filter(x => x.f.builderHits >= 1 && x.f.pedalHits >= 1).sort((a, b) => b.f.score - a.f.score).slice(0, 4);
  const sources = [];
  for (const x of ranked) {
    const p = await get(x.x.url);
    const info = p ? pageInfo(p.text) : { title: x.x.title, h1: '', description: '', body: x.x.snippet };
    const finalFit = fit(builder, pedal, info.title + ' ' + info.h1 + ' ' + info.body + ' ' + x.x.url);
    if (!finalFit.pedalHits || !finalFit.builderHits) continue;
    const h = host(p?.url || x.x.url);
    sources.push({
      url: p?.url || x.x.url, host: h, title: info.title, h1: info.h1,
      description: info.description, snippet: x.x.snippet, bodyExcerpt: info.body,
      identity: finalFit, signals: signals(info.title + ' ' + info.h1 + ' ' + info.description + ' ' + info.body),
      collectedAt: new Date().toISOString()
    });
  }
  const hosts = new Set(sources.map(x => x.host).filter(Boolean));
  const strong = sources.filter(x => x.identity.exactPedal);
  return {
    builder, pedal, catalogType: type, sources,
    sourceCount: sources.length, distinctHostCount: hosts.size, strongSourceCount: strong.length,
    foremanVerdict: hosts.size >= 2 && strong.length >= 1 ? 'EVIDENCE_READY' : sources.length ? 'MORE_SOURCES_NEEDED' : 'NO_USABLE_EVIDENCE'
  };
}

const rows = csvRows(fs.readFileSync(TRACKER, 'utf8')).filter(r => r['Pedal Info'] !== 'DONE')
  .map((r, i) => ({ ...r, _order: Number(r.Order) || i })).sort((a, b) => a._order - b._order);
const span = WORKER_COUNT * TARGETS_PER_WORKER;
const start = rows.length ? (((RUN_NUMBER - 1) * span) % rows.length) : 0;
const targets = [];
for (let j = 0; j < TARGETS_PER_WORKER && rows.length; j++) targets.push(rows[(start + WORKER_INDEX * TARGETS_PER_WORKER + j) % rows.length]);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const records = [];
for (const r of targets) records.push(await targetRecord(r.Builder, r.Pedal, r.Type || r['Catalog Type'] || ''));
fs.writeFileSync(path.join(OUT, 'research-evidence.json'), JSON.stringify({
  workerIndex: WORKER_INDEX, workerCount: WORKER_COUNT, runNumber: RUN_NUMBER,
  targetCount: records.length, records
}, null, 2) + '\n');
console.log(JSON.stringify({ workerIndex: WORKER_INDEX, targets: records.map(r => r.builder + ' / ' + r.pedal), ready: records.filter(r => r.foremanVerdict === 'EVIDENCE_READY').length }, null, 2));
