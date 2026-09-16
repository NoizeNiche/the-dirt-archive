import csv, html, json, re, time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
TARGETS = ROOT / 'research' / 'hard-case-photo-sources-01.tsv'
UA = 'The-Dirt-Archive/1.0 (historical reference; hard-case photo research)'


def fetch_html(url):
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml'})
    with urlopen(req, timeout=25) as r:
        return r.read().decode('utf-8', 'ignore')


def clean(s):
    return html.unescape(re.sub(r'\s+', ' ', s or '')).strip()


def relevance(url, alt, model, builder):
    hay = clean(' '.join([url, alt])).lower()
    toks = [x for x in re.sub(r'[^a-z0-9]+', ' ', model.lower()).split() if len(x) > 2]
    btoks = [x for x in re.sub(r'[^a-z0-9]+', ' ', builder.lower()).split() if len(x) > 2]
    score = sum(4 for t in toks if t in hay) + sum(2 for t in btoks if t in hay)
    bad = ['logo','banner','avatar','icon','sprite','tracking','favicon','facebook','instagram','youtube']
    if any(x in hay for x in bad):
        score -= 8
    return score


def extract_images(page_url, text, model, builder):
    candidates=[]
    for pat in [
        r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+name=[\"\']twitter:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:image[\"\']',
    ]:
        for raw in re.findall(pat, text, flags=re.I):
            candidates.append((raw, ''))
    for m in re.finditer(r'<img\b([^>]*?)>', text, flags=re.I):
        tag=m.group(1)
        srcs=[]
        for attr in ('src','data-src','data-lazy-src','data-original'):
            mm=re.search(fr'{attr}=[\"\']([^\"\']+)', tag, flags=re.I)
            if mm: srcs.append(mm.group(1))
        ss=re.search(r'srcset=[\"\']([^\"\']+)', tag, flags=re.I)
        if ss:
            srcs += [p.strip().split(' ')[0] for p in ss.group(1).split(',')]
        alt=''
        am=re.search(r'alt=[\"\']([^\"\']*)', tag, flags=re.I)
        if am: alt=am.group(1)
        for raw in srcs:
            candidates.append((raw, alt))

    out=[]
    for raw,alt in candidates:
        u=urljoin(page_url, html.unescape(raw))
        p=urlparse(u)
        if p.scheme not in ('http','https'): continue
        low=u.lower()
        if not re.search(r'\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$', low): continue
        s=relevance(u,alt,model,builder)
        if s < 0: continue
        if any(u == x['src'] for x in out): continue
        out.append({'src':u,'page':page_url,'alt':clean(alt),'score':s})
    out.sort(key=lambda x:x['score'], reverse=True)
    return out[:8]


def main():
    manifest={}
    status=['pedal_id\tbuilder\tmodel\tphoto_count\tprimary_source\tstatus']
    with TARGETS.open(encoding='utf-8') as f:
        for idx,row in enumerate(csv.DictReader(f, delimiter='\t'),1):
            try:
                text=fetch_html(row['source_url'])
                photos=extract_images(row['source_url'],text,row['model'],row['builder'])
            except Exception:
                photos=[]
            key=row['model']
            manifest.setdefault(key,[])
            manifest[key].extend(photos)
            # Deduplicate while preserving best score.
            ded={p['src']:p for p in manifest[key]}
            manifest[key]=sorted(ded.values(), key=lambda x:x.get('score',0), reverse=True)[:18]
            status.append('\t'.join([row['pedal_id'],row['builder'],row['model'],str(len(photos)),row['source_type'],'FOUND' if photos else 'NO_IMAGE_EXTRACTED']))
            if idx % 5 == 0: print('processed',idx)
            time.sleep(0.08)
    (PUBLIC/'catalog-hardcase-photo-manifest.js').write_text('window.DIRT_HARDCASE_PHOTOS = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    (ROOT/'research/catalog-hardcase-photo-status-01.tsv').write_text('\n'.join(status)+'\n',encoding='utf-8')
    print('written',len(manifest),'models')

if __name__ == '__main__':
    main()
