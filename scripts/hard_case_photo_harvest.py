import csv, html, json, re, time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
TARGETS = ROOT / 'research' / 'hard-case-photo-sources-01.tsv'
UA = 'The-Dirt-Archive/1.1 (historical reference; hard-case photo research)'

BAD = re.compile(r'\b(?:logo|banner|avatar|icon|sprite|tracking|favicon|facebook|instagram|youtube|schematic|pcb|gutshot|inside|internals?|circuit[-_ ]board|audio|\.ogg|\.mp3|placeholder|loading)\b', re.I)


def fetch_html(url):
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml'})
    with urlopen(req, timeout=25) as r:
        return r.read().decode('utf-8', 'ignore')


def clean(s):
    return html.unescape(re.sub(r'\s+', ' ', s or '')).strip()


def tokens(value):
    return [x for x in re.sub(r'[^a-z0-9]+', ' ', value.lower()).split() if len(x) > 2]


def relevance(url, alt, model, builder):
    hay = clean(' '.join([url, alt])).lower()
    if BAD.search(hay):
        return -99
    mtoks = tokens(model)
    btoks = tokens(builder)
    score = sum(5 for t in mtoks if t in hay)
    score += sum(3 for t in btoks if t in hay)
    if any(t in hay for t in ('vintage', 'original', 'professional', 'mark ii', 'mkii', 'mk ii', 'mk iii', 'mkiii', 'mk iv', 'mkiv')):
        score += 1
    return score


def extract_images(page_url, text, model, builder):
    candidates = []
    meta_patterns = [
        r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+name=[\"\']twitter:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:image[\"\']',
    ]
    for pat in meta_patterns:
        for raw in re.findall(pat, text, flags=re.I):
            candidates.append((raw, ''))
    for m in re.finditer(r'<img\b([^>]*?)>', text, flags=re.I):
        tag = m.group(1)
        srcs = []
        for attr in ('src', 'data-src', 'data-lazy-src', 'data-original'):
            mm = re.search(fr'{attr}=[\"\']([^\"\']+)', tag, flags=re.I)
            if mm:
                srcs.append(mm.group(1))
        ss = re.search(r'srcset=[\"\']([^\"\']+)[\"\']', tag, flags=re.I)
        if ss:
            srcs += [p.strip().split(' ')[0] for p in ss.group(1).split(',')]
        am = re.search(r'alt=[\"\']([^\"\']*)', tag, flags=re.I)
        alt = am.group(1) if am else ''
        for raw in srcs:
            candidates.append((raw, alt))

    out = []
    for raw, alt in candidates:
        u = urljoin(page_url, html.unescape(raw))
        p = urlparse(u)
        if p.scheme not in ('http', 'https'):
            continue
        low = u.lower()
        if not re.search(r'\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$', low):
            continue
        score = relevance(u, alt, model, builder)
        if score < 4:
            continue
        if any(u == x['src'] for x in out):
            continue
        out.append({'src': u, 'page': page_url, 'alt': clean(alt), 'score': score})
    out.sort(key=lambda x: (-x['score'], x['src']))
    return out[:10]


def main():
    manifest = {}
    status = ['pedal_id\tbuilder\tmodel\tphoto_count\tprimary_source\tstatus']
    with TARGETS.open(encoding='utf-8') as f:
        for idx, row in enumerate(csv.DictReader(f, delimiter='\t'), 1):
            try:
                text = fetch_html(row['source_url'])
                photos = extract_images(row['source_url'], text, row['model'], row['builder'])
            except Exception:
                photos = []
            key = row['pedal_id'] or f"{row['builder']}::{row['model']}"
            entry = manifest.setdefault(key, {
                'pedal_id': row['pedal_id'],
                'builder': row['builder'],
                'model': row['model'],
                'sources': [],
                'gallery': []
            })
            entry['sources'].append({
                'url': row['source_url'],
                'type': row['source_type'],
                'note': row.get('research_note', '')
            })
            entry['gallery'].extend(photos)
            ded = {p['src']: p for p in entry['gallery']}
            entry['gallery'] = sorted(ded.values(), key=lambda x: (-x.get('score', 0), x['src']))[:18]
            primary = entry['gallery'][0]['src'] if entry['gallery'] else ''
            status.append('\t'.join([
                row['pedal_id'], row['builder'], row['model'], str(len(photos)), row['source_type'],
                'FOUND' if photos else 'NO_IDENTITY_SAFE_IMAGE_EXTRACTED'
            ]))
            if idx % 5 == 0:
                print('processed', idx)
            time.sleep(0.08)
    payload = {k: {
        'pedal_id': v['pedal_id'], 'builder': v['builder'], 'model': v['model'],
        'sources': v['sources'], 'src': (v['gallery'][0]['src'] if v['gallery'] else None),
        'page': (v['gallery'][0]['page'] if v['gallery'] else ''),
        'gallery': v['gallery']
    } for k, v in manifest.items()}
    (PUBLIC / 'catalog-hardcase-photo-manifest.js').write_text(
        'window.DIRT_HARDCASE_PHOTOS = ' + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8'
    )
    (ROOT / 'research' / 'catalog-hardcase-photo-status-01.tsv').write_text(
        '\n'.join(status) + '\n', encoding='utf-8'
    )
    print('written', len(payload), 'hard-case records')


if __name__ == '__main__':
    main()
