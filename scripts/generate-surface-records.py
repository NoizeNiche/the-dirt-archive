#!/usr/bin/env python3
"""Create surface catalog records for catalog entries with no research record yet.

Surface records are factual and minimal. They mirror canonical Builder + Pedal
identity and catalog classification without inventing technical, historical,
or sonic claims. Deeper research later replaces a surface record only after
exact-pedal evidence clears the research foreman.
"""
import json
from pathlib import Path

INDEX=Path('research/PEDAL_INDEX.json')
ROOT=Path('research/pedals')

def kind(item):
    types=item.get('types')
    if isinstance(types,list) and types:
        return ' / '.join(str(x) for x in types)
    return str(item.get('type') or item.get('dirt_type') or 'Unknown')

def main():
    catalog=json.loads(INDEX.read_text(encoding='utf-8'))
    created=0
    normalized_existing=0
    for item in catalog.get('pedals',[]):
        if item.get('catalog_role')=='variation':
            if item.get('research_record') and not item.get('research_level'):
                item['research_level']='researched'
                item['deep_research_status']='PENDING_REVIEW'
                normalized_existing+=1
            continue
        builder=str(item.get('company') or '').strip()
        pedal=str(item.get('pedal') or '').strip()
        record=ROOT/builder/(pedal+'.md')
        if item.get('research_record'):
            if not record.is_file():
                raise SystemExit(f'Catalog points to missing research record: {item.get("research_record")}')
            if not item.get('research_level'):
                item['research_level']='researched'
                item['deep_research_status']='PENDING_REVIEW'
                normalized_existing+=1
            continue
        if record.exists():
            raise SystemExit(f'Refusing to overwrite orphan research file for {builder} / {pedal}: {record}')
        record.parent.mkdir(parents=True,exist_ok=True)
        source=str(item.get('source_page') or '').strip()
        image=str(item.get('image') or '').strip()
        local_photo=bool(image and image.replace('\\','/').replace('./','').startswith('assets/pedals/'))
        k=kind(item)
        record.write_text('\n'.join([
            f'# {builder} — {pedal}',
            '',
            '## Surface catalog record',
            f'- **Builder:** {builder}',
            f'- **Pedal:** {pedal}',
            f'- **Catalog type:** {k}',
            '- **Research level:** Surface',
            '- **Deep research status:** Pending',
            '- **Identity basis:** This page mirrors the canonical Builder + Pedal identity in `research/PEDAL_INDEX.json`. No additional technical, historical, or sonic claims are inferred here.',
            '',
            '## What this pedal is',
            f'The Dirt Archive currently catalogs **{pedal}** by **{builder}** as a **{k}** pedal. This statement is limited to the archive’s catalog classification. Deeper technical, historical, and sonic details remain pending verification.',
            '',
            '## Catalog source',
            f'- Catalog source page on file: {source}' if source else '- No source page is recorded in the current catalog metadata.',
            '',
            '## Photo',
            f'- **Archive photo:** A local catalog image is already recorded at `{image}`.' if local_photo else '- **Archive photo:** No verified local photo is currently archived.',
            '- Photo provenance and validation are handled separately from this surface research record.',
            '',
            '## Deep research',
            '- **Status:** Pending',
            '- Deeper passes will add only claims supported by exact-pedal evidence admitted by the archive’s research foreman.',
            ''
        ]),encoding='utf-8')
        item['research_record']='./'+record.as_posix()
        item['research_level']='surface'
        item['deep_research_status']='PENDING'
        created+=1
    INDEX.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'created':created,'normalized_existing':normalized_existing}))

if __name__=='__main__':
    main()
