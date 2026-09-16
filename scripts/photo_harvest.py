import json,re,time,html
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request,urlopen

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
DATA=json.loads((PUBLIC/'data.json').read_text(encoding='utf-8'))
pedals=DATA.get('pedals',[])
builders={b.get('builder_id'):b.get('name','') for b in DATA.get('builders',[])}

# Reuse any already-curated reference media embedded in the repo.
existing={}
for path in PUBLIC.glob('catalog-thumbnails-*.js'):
    text=path.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r"['\"]([^'\"]+)['\"]\s*:\s*\{[^{}]*?src\s*:\s*['\"](https?://[^'\"]+)['\"]",text,re.S):
        existing.setdefault(m.group(1),m.group(2))

UA='The-Dirt-Archive/1.0 (historical reference; photo research)'

def get_json(url):
    req=Request(url,headers={'User-Agent':UA,'Accept':'application/json'})
    with urlopen(req,timeout=20) as r:
        return json.loads(r.read().decode('utf-8'))

def commons(query):
    url=('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
         '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata'
         '&iiurlwidth=800&format=json&origin=*'+'&gsrsearch='+quote(query))
    try:
        data=get_json(url)
    except Exception:
        return []
    out=[]
    for page in data.get('query',{}).get('pages',{}).values():
        ii=(page.get('imageinfo') or [{}])[0]
        md=ii.get('extmetadata') or {}
        src=ii.get('thumburl') or ii.get('url')
        if not src: continue
        title=page.get('title','').replace('File:','',1)
        lic=html.unescape(str((md.get('LicenseShortName') or md.get('UsageTerms') or {}).get('value','Wikimedia Commons')))
        artist=re.sub(r'<[^>]+>',' ',str((md.get('Artist') or {}).get('value',''))).strip()
        page_url=ii.get('descriptionurl') or 'https://commons.wikimedia.org/wiki/'+quote(page.get('title',''))
        out.append({'src':src,'page':page_url,'title':title,'credit':artist,'license':lic,'source':'Wikimedia Commons'})
    return out

def score(item,model,builder):
    t=(item.get('title') or '').lower()
    m=re.sub(r'[^a-z0-9 ]',' ',model.lower()).split()
    b=re.sub(r'[^a-z0-9 ]',' ',builder.lower()).split()
    s=sum(3 for x in m if x and x in t)+sum(2 for x in b if len(x)>2 and x in t)
    return s

manifest={}
rows=[]
for i,p in enumerate(pedals,1):
    model=str(p.get('model_name') or '').strip()
    builder=builders.get(p.get('primary_builder_id'),'')
    key=model
    hits=[]
    q1=f'"{model}" {builder} guitar pedal'
    q2=f'{builder} {model} effects pedal'
    for q in (q1,q2):
        hits.extend(commons(q))
        if len(hits)>=12: break
        time.sleep(0.08)
    dedup={x['src']:x for x in hits}
    hits=sorted(dedup.values(),key=lambda x:score(x,model,builder),reverse=True)[:6]
    if key in existing:
        lead={'src':existing[key],'page':'','title':key,'credit':'Existing Dirt Archive media registry','license':'Reference-only','source':'Archive registry'}
        hits=[lead]+[x for x in hits if x['src']!=lead['src']]
    manifest[key]={'src':hits[0]['src'],'page':hits[0].get('page',''),'credit':hits[0].get('credit',''),'license':hits[0].get('license',''),'source':hits[0].get('source',''),'gallery':hits[:6] } if hits else {'src':None,'page':'','credit':'','license':'','source':'','gallery':[]}
    rows.append((p.get('pedal_id',''),builder,model,len(hits),manifest[key]['source']))
    if i % 25 == 0: print(f'processed {i}/{len(pedals)}')

js='window.DIRT_PHOTO_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n'
(PUBLIC/'catalog-photo-manifest.js').write_text(js,encoding='utf-8')
status=['pedal_id\tbuilder\tmodel\tphoto_count\tprimary_photo_source']
status += ['\t'.join(map(str,row)) for row in rows]
(ROOT/'research'/'catalog-photo-harvest-status-01.tsv').write_text('\n'.join(status)+'\n',encoding='utf-8')
print('written',len(pedals),'pedals')
