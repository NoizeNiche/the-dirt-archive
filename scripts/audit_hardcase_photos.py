import json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
OUT=ROOT/'research'/'hardcase-photo-audit-01.tsv'
MANIFEST=PUBLIC/'catalog-hardcase-photo-manifest.js'

BAD_RE=re.compile(r'\b(inside|internals?|pcb|circuit[-_ ]board|gutshot|schematic|logo|icon|avatar|banner|sprite|favicon|tracking|placeholder|loading)\b',re.I)

def load_manifest():
    if not MANIFEST.exists():
        return {}
    text=MANIFEST.read_text(encoding='utf-8',errors='ignore')
    m=re.search(r'window\.DIRT_HARDCASE_PHOTOS\s*=\s*(\{.*\})\s*;?\s*$',text,re.S)
    return json.loads(m.group(1)) if m else {}

def tokens(s):
    return [x for x in re.sub(r'[^a-z0-9]+',' ',str(s).lower()).split() if len(x)>2]

def main():
    data=load_manifest()
    rows=['model\tbuilder\tphoto_count\tduplicate_urls\tunsafe_urls\tidentity_flags\tstatus']
    url_to_models={}
    for model,entry in data.items():
        gallery=entry.get('gallery') or []
        builder=str(entry.get('builder') or '')
        model_text=str(entry.get('model') or model)
        for p in gallery:
            url=p.get('src')
            if url: url_to_models.setdefault(url,[]).append(model)
    for model,entry in sorted(data.items()):
        gallery=entry.get('gallery') or []
        builder=str(entry.get('builder') or '')
        model_text=str(entry.get('model') or model)
        dup=sum(1 for p in gallery if len(url_to_models.get(p.get('src',''),[]))>1)
        unsafe=sum(1 for p in gallery if BAD_RE.search(' '.join([str(p.get('src','')),str(p.get('alt',''))])))
        mt=tokens(model_text); bt=tokens(builder)
        flags=[]
        for p in gallery:
            hay=' '.join([str(p.get('src','')),str(p.get('alt',''))]).lower()
            model_hits=sum(1 for t in mt if t in hay)
            builder_hits=sum(1 for t in bt if len(t)>3 and t in hay)
            if mt and model_hits==0 and builder_hits==0:
                flags.append('no-model-or-builder-token')
        flags=sorted(set(flags))
        if unsafe or flags or dup:
            status='REVIEW'
        elif gallery:
            status='PASS'
        else:
            status='NO_PHOTOS'
        rows.append('\t'.join([
            model_text.replace('\t',' '),builder.replace('\t',' '),str(len(gallery)),str(dup),str(unsafe),';'.join(flags),status
        ]))
    OUT.write_text('\n'.join(rows)+'\n',encoding='utf-8')
    print('audited',len(data),'hard-case models')

if __name__=='__main__':
    main()
