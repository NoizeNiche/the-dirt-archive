import json,re,time,html
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request,urlopen

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
DATA=json.loads((PUBLIC/'data.json').read_text(encoding='utf-8'))
pedals=list(DATA.get('pedals',[]))
builders={b.get('builder_id'):b.get('name','') for b in DATA.get('builders',[])}

# Include discovered records. Preserve duplicate pedal IDs by making a stable
# builder/model fallback key rather than allowing a later discovery row to
# silently overwrite an earlier photo record.
seen={(str(p.get('primary_builder_id')),str(p.get('model_name','')).strip().lower()) for p in pedals}
for path in sorted(PUBLIC.glob('discovery-*.tsv')):
    for line in path.read_text(encoding='utf-8',errors='ignore').splitlines():
        if not line.strip(): continue
        parts=line.split('\t')
        if len(parts)<4: continue
        pedal_id,builder_id,category,model=parts[:4]
        key=(builder_id,model.strip().lower())
        if key in seen: continue
        seen.add(key)
        pedals.append({'pedal_id':pedal_id,'primary_builder_id':builder_id,'primary_category':category,'model_name':model.strip()})

BAD_RE=re.compile(r'\b(inside|internals?|pcb|circuit[-_ ]board|gutshot|schematic|audio|\.ogg|\.mp3|logo|icon|avatar|banner|sprite|favicon|placeholder|loading)\b',re.I)
def acceptable(value): return bool(value) and not BAD_RE.search(str(value))

def source_id(p):
    pid=str(p.get('pedal_id') or '').strip(); builder=builders.get(p.get('primary_builder_id'),''); model=str(p.get('model_name') or '').strip()
    if pid: return pid
    return f'{builder}::{model}'

existing={}
for path in PUBLIC.glob('catalog-thumbnails-*.js'):
    text=path.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r"['\"]([^'\"]+)['\"]\s*:\s*\{[^{}]*?src\s*:\s*['\"](https?://[^'\"]+)['\"]",text,re.S):
        key,url=m.group(1),m.group(2)
        if acceptable(url): existing.setdefault(key,url)

UA='The-Dirt-Archive/1.4 (historical reference; photo research)'
def get_json(url):
    req=Request(url,headers={'User-Agent':UA,'Accept':'application/json'})
    with urlopen(req,timeout=20) as r: return json.loads(r.read().decode('utf-8'))

def commons(query):
    url=('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
         '&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata'
         '&iiurlwidth=1000&format=json&origin=*'+'&gsrsearch='+quote(query))
    try: data=get_json(url)
    except Exception: return []
    out=[]
    for page in data.get('query',{}).get('pages',{}).values():
        ii=(page.get('imageinfo') or [{}])[0]; md=ii.get('extmetadata') or {}
        src=ii.get('thumburl') or ii.get('url')
        if not src: continue
        title=page.get('title','').replace('File:','',1)
        if not acceptable(title) or not acceptable(src): continue
        lic=html.unescape(str((md.get('LicenseShortName') or md.get('UsageTerms') or {}).get('value','Wikimedia Commons')))
        artist=re.sub(r'<[^>]+>',' ',str((md.get('Artist') or {}).get('value',''))).strip()
        page_url=ii.get('descriptionurl') or 'https://commons.wikimedia.org/wiki/'+quote(page.get('title',''))
        out.append({'src':src,'page':page_url,'title':title,'credit':artist,'license':lic,'source':'Wikimedia Commons'})
    return out

def score(item,model,builder):
    t=(item.get('title') or '').lower()
    mt=re.sub(r'[^a-z0-9 ]',' ',model.lower()).split(); bt=re.sub(r'[^a-z0-9 ]',' ',builder.lower()).split()
    stop={'guitar','pedal','effects','effect','fx','the','and','for','overdrive','distortion','fuzz'}
    s=sum((6 if len(x)>=6 else 4) for x in mt if x not in stop and x in t)
    s+=sum(3 for x in bt if len(x)>3 and x in t)
    return s

def identity_score(item,model,builder):
    t=(item.get('title') or '').lower(); s=score(item,model,builder)
    if builder and model and f'{builder} {model}'.lower() in t: s+=12
    if model and model.lower()==t.strip().lower(): s+=10
    return s

manifest={}; rows=[]; used_keys=set()
for i,p in enumerate(pedals,1):
    model=str(p.get('model_name') or '').strip(); builder=builders.get(p.get('primary_builder_id'),'')
    hits=[]
    queries=[f'"{model}" {builder}',f'{model} guitar pedal',f'"{builder}" "{model}"',model]
    for q in dict.fromkeys(queries):
        hits.extend(commons(q)); hits=list({x['src']:x for x in hits}.values())
        if len([x for x in hits if identity_score(x,model,builder)>=6])>=6: break
        time.sleep(.05)
    hits=sorted((x for x in hits if acceptable(x.get('title','')) and acceptable(x.get('src',''))),key=lambda x:identity_score(x,model,builder),reverse=True)[:6]
    legacy=existing.get(model)
    if legacy:
        lead={'src':legacy,'page':'','title':model,'credit':'Existing Dirt Archive media registry','license':'Reference-only','source':'Archive registry'}
        hits=[lead]+[x for x in hits if x['src']!=lead['src']]
    entry={'src':hits[0]['src'],'page':hits[0].get('page',''),'credit':hits[0].get('credit',''),'license':hits[0].get('license',''),'source':hits[0].get('source',''),'gallery':hits[:6]} if hits else {'src':None,'page':'','credit':'','license':'','source':'','gallery':[]}
    key=source_id(p)
    if key in used_keys: key=f'{key}::{builder}::{model}'
    used_keys.add(key)
    manifest[key]=dict(entry,builder=builder,model=model,pedal_id=str(p.get('pedal_id') or ''))
    rows.append((p.get('pedal_id',''),builder,model,len(hits),entry['source']))
    if i%50==0: print(f'processed {i}/{len(pedals)}')

(PUBLIC/'catalog-photo-manifest.js').write_text('window.DIRT_PHOTO_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
status=['pedal_id\tbuilder\tmodel\tphoto_count\tprimary_photo_source']+['\t'.join(map(str,row)) for row in rows]
(ROOT/'research'/'catalog-photo-harvest-status-01.tsv').write_text('\n'.join(status)+'\n',encoding='utf-8')
print('written',len(pedals),'visible/public catalog candidates')
