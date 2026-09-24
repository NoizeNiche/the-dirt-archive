
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ARTIFACTS = path.join(ROOT, 'research-evidence-artifacts');
const OUT = path.join(ROOT, 'research/RESEARCH_EVIDENCE_QUEUE.json');
const map = new Map();
function key(r) { return String(r.builder || '') + '\0' + String(r.pedal || ''); }

function add(record) {
  const k = key(record);
  const prior = map.get(k);
  if (!prior) { map.set(k, { ...record, sources: [...(record.sources || [])] }); return; }
  const urls = new Map((prior.sources || []).map(s => [s.url, s]));
  for (const s of record.sources || []) urls.set(s.url, s);
  prior.sources = [...urls.values()].sort((a,b) => (b.identity?.score || 0) - (a.identity?.score || 0)).slice(0,10);
  prior.sourceCount = prior.sources.length;
  prior.distinctHostCount = new Set(prior.sources.map(s => s.host).filter(Boolean)).size;
  prior.strongSourceCount = prior.sources.filter(s => s.identity?.exactPedal).length;
  prior.foremanVerdict = prior.distinctHostCount >= 2 && prior.strongSourceCount >= 1 ? 'EVIDENCE_READY' :
    prior.sourceCount ? 'MORE_SOURCES_NEEDED' : 'NO_USABLE_EVIDENCE';
  prior.collectedAt = String(record.collectedAt || '') > String(prior.collectedAt || '') ? record.collectedAt : prior.collectedAt;
}

if (fs.existsSync(ARTIFACTS)) {
  for (const f of fs.readdirSync(ARTIFACTS, { recursive: true }).map(String).filter(x => x.endsWith('research-evidence.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(ARTIFACTS, f), 'utf8'));
      for (const row of data.records || []) add(row);
    } catch (e) { console.warn('Skipping unreadable dossier: ' + f + ' ' + e.message); }
  }
}
const records = [...map.values()].sort((a,b) => String(a.builder).localeCompare(String(b.builder)) || String(a.pedal).localeCompare(String(b.pedal)));
const payload = {
  version: 'research-evidence-v1',
  generatedAt: new Date().toISOString(),
  purpose: 'Autonomous evidence collection. Canonical research prose is written only after verification.',
  foremanRule: 'At least 2 distinct source hosts plus 1 strong exact-identity source before synthesis.',
  counts: {
    targetsWithEvidence: records.filter(r => r.sourceCount > 0).length,
    evidenceReady: records.filter(r => r.foremanVerdict === 'EVIDENCE_READY').length,
    moreSourcesNeeded: records.filter(r => r.foremanVerdict === 'MORE_SOURCES_NEEDED').length,
    noUsableEvidence: records.filter(r => r.foremanVerdict === 'NO_USABLE_EVIDENCE').length
  },
  records
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
const lines = [
  '# Research Evidence Queue',
  '',
  'Generated: ' + payload.generatedAt,
  '',
  'Evidence-bearing targets: ' + payload.counts.targetsWithEvidence,
  'Evidence-ready targets: ' + payload.counts.evidenceReady,
  'More sources needed: ' + payload.counts.moreSourcesNeeded,
  'No usable evidence: ' + payload.counts.noUsableEvidence,
  '',
  'This is a staging queue, not canonical pedal research. Evidence-ready means two distinct hosts and one strong exact-identity source.',
  ''
];
for (const r of records.slice(0,120)) lines.push('- ' + r.builder + ' / ' + r.pedal + ': **' + r.foremanVerdict + '** (' + r.sourceCount + ' sources, ' + r.distinctHostCount + ' hosts)');
fs.writeFileSync('research/RESEARCH_EVIDENCE_REPORT.md', lines.join('\n') + '\n', 'utf8');
console.log(JSON.stringify(payload.counts, null, 2));
