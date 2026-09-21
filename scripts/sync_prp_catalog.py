import csv
import json
import re
from pathlib import Path

ROOT = Path('.')
TRACKER = ROOT / 'research/PRP_TRACKER.csv'
INDEX = ROOT / 'research/PEDAL_INDEX.json'
MANIFEST = ROOT / 'research/pedals/PEDAL_IMAGES.json'


def norm(value):
    value = (value or '').lower().strip()
    value = value.replace('&', 'and')
    value = re.sub(r'\beffects?\b', '', value)
    value = re.sub(r'[^a-z0-9]+', '', value)
    return value


def md_record(path):
    text = path.read_text(encoding='utf-8', errors='replace')
    builder = re.search(r'^- \*\*Builder:\*\*\s*(.+)$', text, re.M)
    identity = re.search(r'^- \*\*Catalog identity:\*\*\s*(.+)$', text, re.M)
    title = re.search(r'^#\s+(.+)$', text, re.M)
    b = builder.group(1).strip() if builder else ''
    p = identity.group(1).strip() if identity else (title.group(1).strip() if title else '')
    return b, p

records = {}
for path in (ROOT / 'research/pedals').rglob('*.md'):
    b, p = md_record(path)
    if b and p:
        records[(norm(b), norm(p))] = './' + path.as_posix()

tracker_rows = []
with TRACKER.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        key = (norm(row.get('company')), norm(row.get('pedal')))
        rec = records.get(key)
        if rec:
            row['research_status'] = 'DONE'
            row['research_record'] = rec
        tracker_rows.append(row)

with TRACKER.open('w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(tracker_rows)

catalog = json.loads(INDEX.read_text(encoding='utf-8'))
manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))

catalog_items = catalog.get('pedals', [])
cat_by_key = {(norm(x.get('company')), norm(x.get('pedal'))): x for x in catalog_items}
manifest_by_key = {(norm(x.get('builder')), norm(x.get('pedal'))): x for x in manifest}

changed_index = 0
changed_manifest = 0
for row in tracker_rows:
    key = (norm(row.get('company')), norm(row.get('pedal')))
    rec = row.get('research_record')
    if not rec:
        continue
    item = cat_by_key.get(key)
    if item is not None and item.get('research_record') != rec:
        item['research_record'] = rec
        changed_index += 1
    m = manifest_by_key.get(key)
    if m is None and item is not None:
        manifest.append({
            'builder': item.get('company'),
            'pedal': item.get('pedal'),
            'image': item.get('image'),
            'source_page': item.get('source_page'),
            'research_record': rec,
        })
        changed_manifest += 1
    elif m is not None and m.get('research_record') != rec:
        m['research_record'] = rec
        changed_manifest += 1

INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'catalog links changed: {changed_index}')
print(f'manifest links changed: {changed_manifest}')
print(f'research records discovered: {len(records)}')
