import json,re,time,html
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request,urlopen

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
DATA=json.loads((PUBLIC/'data.json').read_text(encoding='utf-8'))
pedals=list(DATA.get('pedals',[]))
builders={b.get('builder_id'):b.get('name','') for b in DATA.get('builders',[])}

# The public site also injects discovery records from discovery-01..10.tsv.
# Include those records so every visible pedal card participates in photo harvesting.
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

# Reuse existing reference media already mapped in the repository.
existing={}
for path in PUBLIC.glob('catalog-thumbnails-*.js'):
    text=path.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r"['\"]([^'\"]+)['\"]\s*:\s*\{[^{}]*?src\s*:\s*['\"](https?://[^'\"]+)['\"]",text,re.S):
        existing.setdefault(m.group(1),m.group(2))

UA='The-Dirt-Archive/1.2 (historical reference; photo research)'

def get_json(url):
    req=Request(url,headers={'User-Agent':UA,'Accept':'application/json'})
    with urlopen(req,timeout=20) as r:
        return json.loads(r.read().decode('utf-8'))

def commons(query):
    url=('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
         '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata'
         '&iiurlwidth=800&format=json&origin=*'+'&gsrsearch='+quote(query))
    try: data=get_json(url)
    except Exception: return []
    out=[]
    for page in data.get('query',{}).get('pages',{}).values():
        ii=(page.get('imageinfo') or [{}])[0]; md=ii.get('extmetadata') or {}
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
    mt=re.sub(r'[^a-z0-9 ]',' ',model.lower()).split()
    bt=re.sub(r'[^a-z0-9 ]',' ',builder.lower()).split()
    stop={'guitar','pedal','effects','effect','fx','the','and','for','overdrive','distortion','fuzz'}
    s=sum((5 if len(x)>=5 else 3) for x in mt if x not in stop and x in t)
    s+=sum(2 for x in bt if len(x)>3 and x in t)
    return s

manifest={}; rows=[]
for i,p in enumerate(pedals,1):
    model=str(p.get('model_name') or '').strip(); builder=builders.get(p.get('primary_builder_id'),'')
    hits=[]
    queries=[]
    for q in [f'"{model}" {builder}',f'{model} guitar pedal',model,f'{builder} {model}']:
        if q and q not in queries: queries.append(q)
    for q in queries:
        hits.extend(commons(q))
        hits=list({x['src']:x for x in hits}.values())
        strong=[x for x in hits if score(x,model,builder)>=5]
        if len(strong)>=6: break
        time.sleep(0.05)
    hits=sorted({x['src']:x for x in hits}.values(),key=lambda x:score(x,model,builder),reverse=True)[:6]
    if model in existing:
        lead={'src':existing[model],'page':'','title':model,'credit':'Existing Dirt Archive media registry','license':'Reference-only','source':'Archive registry'}
        hits=[lead]+[x for x in hits if x['src']!=lead['src']]
    manifest[model]={'src':hits[0]['src'],'page':hits[0].get('page',''),'credit':hits[0].get('credit',''),'license':hits[0].get('license',''),'source':hits[0].get('source',''),'gallery':hits[:6]} if hits else {'src':None,'page':'','credit':'','license':'','source':'','gallery':[]}
    rows.append((p.get('pedal_id',''),builder,model,len(hits),manifest[model]['source']))
    if i % 50 == 0: print(f'processed {i}/{len(pedals)}')

(PUBLIC/'catalog-photo-manifest.js').write_text('window.DIRT_PHOTO_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
status=['pedal_id\tbuilder\tmodel\tphoto_count\tprimary_photo_source']+['\t'.join(map(str,row)) for row in rows]
(ROOT/'research'/'catalog-photo-harvest-status-01.tsv').write_text('\n'.join(status)+'\n',encoding='utf-8')
print('written',len(pedals),'visible/public catalog candidates')
