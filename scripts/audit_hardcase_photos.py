import json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
OUT=ROOT/'research'/'hardcase-photo-audit-01.tsv'
MANIFEST=PUBLIC/'catalog-hardcase-photo-manifest.js'

BAD_RE=re.compile(r'\b(inside|internals?|pcb|circuit[-_ ]board|gutshot|schematic|logo|icon|avatar|banner|sprite|favicon|tracking|placeholder|loading|audio|\.ogg|\.mp3)\b',re.I)

def load_manifest():
    if not MANIFEST.exists():
        return {}
    text=MANIFEST.read_text(encoding='utf-8',errors='ignore')
    m=re.search(r'window\.DIRT_HARDCASE_PHOTOS\s*=\s*(\{.*\})\s*;?\s*$',text,re.S)
    return json.loads(m.group(1)) if m else {}

def tokens(s):
    return [x for x in re.sub(r'[^a-z0-9]+',' ',str(s).lower()).split() if len(x)>2]

def identity_counts(hay,model_text,builder):
    mt=tokens(model_text); bt=tokens(builder)
    model_hits=sum(1 for t in mt if t in hay)
    builder_hits=sum(1 for t in bt if len(t)>3 and t in hay)
    return model_hits,builder_hits

def main():
    data=load_manifest()
    rows=['pedal_id\tmodel\tbuilder\tphoto_count\tduplicate_urls\tunsafe_urls\tweak_identity_urls\tsource_count\tstatus']
    url_to_records={}
    for key,entry in data.items():
        pedal_id=str(entry.get('pedal_id') or key)
        for p in entry.get('gallery') or []:
            url=p.get('src')
            if url:
                url_to_records.setdefault(url,[]).append(pedal_id)
    for key,entry in sorted(data.items()):
        pedal_id=str(entry.get('pedal_id') or key)
        gallery=entry.get('gallery') or []
        builder=str(entry.get('builder') or '')
        model_text=str(entry.get('model') or key)
        dup=sum(1 for p in gallery if len(set(url_to_records.get(p.get('src',''),[])))>1)
        unsafe=sum(1 for p in gallery if BAD_RE.search(' '.join([str(p.get('src','')),str(p.get('alt',''))])))
        weak=0
        for p in gallery:
            hay=' '.join([str(p.get('src','')),str(p.get('alt',''))]).lower()
            model_hits,builder_hits=identity_counts(hay,model_text,builder)
            if model_hits==0 and builder_hits==0:
                weak+=1
        sources=len(entry.get('sources') or [])
        if unsafe or dup or weak:
            status='REVIEW'
        elif gallery:
            status='PASS'
        else:
            status='NO_PHOTOS'
        rows.append('\t'.join([
            pedal_id.replace('\t',' '),model_text.replace('\t',' '),builder.replace('\t',' '),str(len(gallery)),
            str(dup),str(unsafe),str(weak),str(sources),status
        ]))
    OUT.write_text('\n'.join(rows)+'\n',encoding='utf-8')
    print('audited',len(data),'identity-safe hard-case records')

if __name__=='__main__':
    main()
