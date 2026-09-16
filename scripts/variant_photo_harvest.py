import csv, html, json, re, time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
TARGETS = ROOT / 'research' / 'photo-variant-targets-01.tsv'
UA = 'The-Dirt-Archive/1.0 (historical reference; variant photo research)'
GENERIC = {'the','and','for','with','from','vintage','original','period','family','historical','photo','gallery','pedal','fuzz','overdrive','distortion','sound','box','version','enclosure'}


def fetch_html(url):
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml'})
    with urlopen(req, timeout=25) as r:
        return r.read().decode('utf-8', 'ignore')


def clean(s):
    return html.unescape(re.sub(r'\s+', ' ', s or '')).strip()


def tokens(label, parent):
    words = re.findall(r'[a-z0-9]+', f'{parent} {label}'.lower())
    return [w for w in words if len(w) > 2 and w not in GENERIC]


def extract_images(page_url, text, label, parent):
    found = []
    target_tokens = tokens(label, parent)

    for pat in [
        r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+name=[\"\']twitter:image[\"\'][^>]+content=[\"\']([^\"\']+)',
        r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:image[\"\']',
    ]:
        found += [{'src': x, 'context': label} for x in re.findall(pat, text, flags=re.I)]

    for m in re.finditer(r'<img\b([^>]*?)(?:src|data-src|data-lazy-src)=[\"\']([^\"\']+)', text, flags=re.I):
        attrs, src = m.group(1), m.group(2)
        alt = re.search(r'alt=[\"\']([^\"\']*)', attrs, flags=re.I)
        title = re.search(r'title=[\"\']([^\"\']*)', attrs, flags=re.I)
        context = clean(f'{alt.group(1) if alt else ""} {title.group(1) if title else ""} {src}')
        found.append({'src': src, 'context': context})

    for m in re.finditer(r'<img\b([^>]*?)srcset=[\"\']([^\"\']+)', text, flags=re.I):
        attrs, srcset = m.group(1), m.group(2)
        alt = re.search(r'alt=[\"\']([^\"\']*)', attrs, flags=re.I)
        base_context = clean(alt.group(1) if alt else '')
        for part in srcset.split(','):
            found.append({'src': part.strip().split(' ')[0], 'context': base_context})

    scored=[]
    seen=set()
    for item in found:
        u = urljoin(page_url, html.unescape(item['src']))
        p = urlparse(u)
        if p.scheme not in ('http','https') or u in seen:
            continue
        low = u.lower()
        if any(x in low for x in ['logo','icon','avatar','sprite','tracking','favicon','banner','button']):
            continue
        if not re.search(r'\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$', low):
            continue
        seen.add(u)
        context = item.get('context','').lower()
        score = 0
        for tok in target_tokens:
            if tok in context:
                score += 5
        if any(x in context for x in ['image:', 'pedal', 'tone bender', 'big muff', 'tube screamer', 'rat', 'fuzz']):
            score += 2
        if 'og:image' in item.get('context','').lower():
            score += 1
        scored.append((score, {'src':u, 'page':page_url, 'context':clean(context)}))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored[:12]]


def write_manifest(rows):
    manifest = {}
    status = ['variant_id\tparent_model\tvariant_label\tphoto_count\tprimary_photo_source\tstatus']
    for row in rows:
        key = row['variant_label']
        manifest[key] = {
            'variant_id': row['variant_id'],
            'parent_model': row['parent_model'],
            'source_page': row['source_url'],
            'source_type': row['source_type'],
            'photos': row['photos'],
        }
        status.append('\t'.join([
            row['variant_id'], row['parent_model'], row['variant_label'],
            str(len(row['photos'])), row['source_type'],
            'FOUND' if row['photos'] else 'NO_IMAGE_EXTRACTED'
        ]))
    (PUBLIC / 'catalog-variant-photo-manifest.js').write_text(
        'window.DIRT_VARIANT_PHOTOS = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8'
    )
    (ROOT / 'research' / 'catalog-variant-photo-status-01.tsv').write_text('\n'.join(status) + '\n', encoding='utf-8')


def main():
    rows=[]
    with TARGETS.open(encoding='utf-8') as f:
        for idx, row in enumerate(csv.DictReader(f, delimiter='\t'), 1):
            try:
                text = fetch_html(row['source_url'])
                photos = extract_images(row['source_url'], text, row['variant_label'], row['parent_model'])
            except Exception as exc:
                photos=[]
            row['photos']=photos
            rows.append(row)
            if idx % 10 == 0:
                print(f'processed {idx}')
            time.sleep(0.08)
    write_manifest(rows)
    print('written', len(rows), 'variant targets')


if __name__ == '__main__':
    main()
