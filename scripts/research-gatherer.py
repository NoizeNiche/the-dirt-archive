#!/usr/bin/env python3
import csv, json, os, re, subprocess, urllib.parse
from pathlib import Path
from html.parser import HTMLParser

OUT=Path("research-evidence")
OUT.mkdir(parents=True, exist_ok=True)

class P(HTMLParser):
    def __init__(self): super().__init__(); self.title=[]; self.h1=[]; self.body=[]; self.mode=""
    def handle_starttag(self,t,a):
        if t=="title": self.mode="title"
        elif t=="h1": self.mode="h1"
        elif t in ("script","style","noscript"): self.mode="skip"
        elif self.mode!="skip": self.mode="body"
    def handle_endtag(self,t):
        if t in ("title","h1"): self.mode=""
    def handle_data(self,d):
        if self.mode=="title": self.title.append(d)
        elif self.mode=="h1": self.h1.append(d)
        elif self.mode=="body": self.body.append(d)

def norm(v): return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9]+"," ",str(v or "").lower())).strip()
def words(v): return [x for x in norm(v).split() if len(x)>=3 and x not in {"the","and","with","for","overdrive","distortion","fuzz","drive","pedal","effects"}]

def run(cmd, timeout):
    try:
        p=subprocess.run(cmd,capture_output=True,text=True,errors="ignore",timeout=timeout)
        return p.stdout or ""
    except Exception: return ""

def search(q):
    html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","3","--max-time","7",
              "-A","Mozilla/5.0","https://www.bing.com/search?q="+urllib.parse.quote(q)],10)
    out=[]; seen=set()
    for m in re.finditer(r"<li[^>]+class=[\"']b_algo[^>]*>[\\s\\S]*?<h2[^>]*>\s*<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>([\\s\\S]*?)</a>",html,re.I):
        u=m.group(1); title=re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",m.group(2))).strip()
        if u.startswith("http") and u not in seen:
            seen.add(u); out.append({"url":u,"search_title":title})
    return out[:7]

def fetch(u):
    html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","3","--max-time","8",
              "-A","Mozilla/5.0","-H","Accept-Language: en-US,en;q=0.9",u],11)
    if not html: return None
    p=P(); p.feed(html[:400000])
    title=re.sub(r"\s+"," "," ".join(p.title)).strip()
    h1=re.sub(r"\s+"," "," ".join(p.h1)).strip()
    body=re.sub(r"\s+"," "," ".join(p.body)).strip()
    return {"url":u,"title":title,"h1":h1,"excerpt":body[:6000]}

def source_pages_from_catalog(builder, pedal):
    try:
        catalog=json.loads(Path("research/PEDAL_INDEX.json").read_text(encoding="utf-8"))
    except Exception:
        return []
    for item in catalog.get("pedals", []):
        if item.get("company") == builder and item.get("pedal") == pedal:
            pages=[]
            for k in ("source_page","image_source_page"):
                v=str(item.get(k) or "").strip()
                if v.startswith("http"): pages.append(v)
            for v in item.get("source_pages",[]) if isinstance(item.get("source_pages"),list) else []:
                v=str(v).strip()
                if v.startswith("http"): pages.append(v)
            return list(dict.fromkeys(pages))[:5]
    return []

def host(url):
    try: return urllib.parse.urlparse(url).netloc.lower()
    except Exception: return ""

def search(q):
    engines=[
        ("bing","https://www.bing.com/search?q="+urllib.parse.quote(q)),
        ("duckduckgo","https://html.duckduckgo.com/html/?q="+urllib.parse.quote(q)),
    ]
    out=[]; seen=set()
    for _, endpoint in engines:
        html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","3","--max-time","7",
                  "-A","Mozilla/5.0","-H","Accept-Language: en-US,en;q=0.9",endpoint],10)
        if not html: continue
        patterns=[
            r'<li[^>]+class=["\']b_algo[^>]*>[\s\S]*?<h2[^>]*>\s*<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>',
            r'<a[^>]+class=["\']result__a["\'][^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>',
        ]
        for pattern in patterns:
            for m in re.finditer(pattern,html,re.I):
                u=m.group(1)
                title=re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",m.group(2))).strip()
                if u.startswith("http") and u not in seen:
                    seen.add(u); out.append({"url":u.split("#")[0],"search_title":title})
        if len(out)>=12: break
    return out[:12]

def fetch(u):
    html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","3","--max-time","9",
              "-A","Mozilla/5.0","-H","Accept-Language: en-US,en;q=0.9",u],12)
    if not html: return None
    p=P(); p.feed(html[:500000])
    title=re.sub(r"\s+"," "," ".join(p.title)).strip()
    h1=re.sub(r"\s+"," "," ".join(p.h1)).strip()
    body=re.sub(r"\s+"," "," ".join(p.body)).strip()
    return {"url":u,"title":title,"h1":h1,"excerpt":body[:6000]}

def gather_one(builder,pedal):
    q1=f'"{builder}" "{pedal}"'
    q2=f'"{builder}" "{pedal}" manual specs review'
    seed=source_pages_from_catalog(builder,pedal)
    urls=list(seed)
    for q in (q1,q2):
        for x in search(q):
            if x["url"] not in urls: urls.append(x["url"])
    sources=[]
    for u in urls[:12]:
        s=fetch(u)
        if not s: continue
        hay=norm(s["title"]+" "+s["h1"])
        pnorm=norm(pedal); bwords=words(builder); pwords=words(pedal)
        exact=(pnorm in hay and (not bwords or any(x in hay for x in bwords))) or (pwords and all(x in hay for x in pwords) and (not bwords or any(x in hay for x in bwords)))
        source_host=host(u)
        source_kind=(
            "effects_database" if "effectsdatabase" in source_host else
            "reverb" if "reverb.com" in source_host else
            "manufacturer" if any(norm(builder).replace(" ","") in source_host.replace(".","") for _ in [0]) else
            "other"
        )
        s["identity_match"]=bool(exact)
        s["source_host"]=source_host
        s["source_kind"]=source_kind
        sources.append(s)
    return {"builder":builder,"pedal":pedal,"sources":sources}

builder=os.environ.get("RESEARCH_TARGET_BUILDER","").strip()
pedal=os.environ.get("RESEARCH_TARGET_PEDAL","").strip()
out_path=os.environ.get("RESEARCH_OUT","").strip()
if not builder or not pedal:
    raise SystemExit("RESEARCH_TARGET_BUILDER and RESEARCH_TARGET_PEDAL are required")

record=gather_one(builder,pedal)
if out_path:
    out=Path(out_path)
else:
    out=OUT/"candidate-0.json"
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(builder,"/",pedal,len(record["sources"]))

