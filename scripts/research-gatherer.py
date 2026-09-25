#!/usr/bin/env python3
import json, os, re, subprocess, urllib.parse
from pathlib import Path
from html.parser import HTMLParser

OUT = Path("research-evidence")
OUT.mkdir(parents=True, exist_ok=True)

class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title=[]; self.h1=[]; self.body=[]; self.mode=""
    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.mode = "title"
        elif tag == "h1":
            self.mode = "h1"
        elif tag in ("script","style","noscript"):
            self.mode = "skip"
        elif self.mode != "skip":
            self.mode = "body"
    def handle_endtag(self, tag):
        if tag in ("title","h1"):
            self.mode = ""
    def handle_data(self, data):
        if self.mode == "title": self.title.append(data)
        elif self.mode == "h1": self.h1.append(data)
        elif self.mode == "body": self.body.append(data)

def norm(v):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", str(v or "").lower())).strip()

def tokens(v):
    stop={"the","and","with","for","overdrive","distortion","fuzz","drive","pedal","effects"}
    return [x for x in norm(v).split() if len(x) >= 3 and x not in stop]

def run(cmd, timeout):
    try:
        p=subprocess.run(cmd, capture_output=True, text=True, errors="ignore", timeout=timeout)
        return p.stdout or ""
    except Exception:
        return ""

def unwrap(u):
    u = u.replace("&amp;","&")
    try:
        q=urllib.parse.parse_qs(urllib.parse.urlparse(u).query)
        if "uddg" in q and q["uddg"]:
            return q["uddg"][0]
        if "url" in q and q["url"] and q["url"][0].startswith("http"):
            return q["url"][0]
    except Exception:
        pass
    return u

def search(q):
    endpoints=[
        "https://www.bing.com/search?q="+urllib.parse.quote(q),
        "https://html.duckduckgo.com/html/?q="+urllib.parse.quote(q),
        "https://www.google.com/search?q="+urllib.parse.quote(q)
    ]
    out=[]; seen=set()
    patterns=[
        r'<li[^>]+class=["\'][^"\']*b_algo[^"\']*["\'][\s\S]*?<h2[^>]*>\s*<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>',
        r'<a[^>]+class=["\']result__a["\'][^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>',
        r'<a[^>]+href=["\'](/url\?q=[^"\']+)["\'][^>]*>([\s\S]*?)</a>'
    ]
    for endpoint in endpoints:
        html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","2","--max-time","5",
                  "-A","Mozilla/5.0","-H","Accept-Language: en-US,en;q=0.9",endpoint],7)
        if not html:
            continue
        for pattern in patterns:
            for m in re.finditer(pattern, html, re.I):
                u=unwrap(m.group(1))
                title=re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",m.group(2))).strip()
                if u.startswith("http") and u not in seen:
                    seen.add(u); out.append({"url":u.split("#")[0],"search_title":title})
        if len(out) >= 18:
            break
    return out[:18]

def fetch(u):
    html=run(["curl","-L","--silent","--show-error","--compressed","--connect-timeout","2","--max-time","6",
              "-A","Mozilla/5.0 The-Dirt-Archive research worker","-H","Accept-Language: en-US,en;q=0.9",u],8)
    if not html:
        return None
    p=P(); p.feed(html[:600000])
    return {
        "url":u,
        "title":re.sub(r"\s+"," "," ".join(p.title)).strip(),
        "h1":re.sub(r"\s+"," "," ".join(p.h1)).strip(),
        "excerpt":re.sub(r"\s+"," "," ".join(p.body)).strip()[:6000]
    }

def host(url):
    try: return urllib.parse.urlparse(url).netloc.lower()
    except Exception: return ""

def source_pages_from_catalog(builder, pedal):
    urls=[]
    try:
        catalog=json.loads(Path("research/PEDAL_INDEX.json").read_text(encoding="utf-8"))
        for item in catalog.get("pedals", []):
            if item.get("company")==builder and item.get("pedal")==pedal:
                for k in ("source_page","image_source_page"):
                    v=str(item.get(k) or "").strip()
                    if v.startswith("http"): urls.append(v)
                for v in item.get("source_pages",[]) if isinstance(item.get("source_pages"),list) else []:
                    v=str(v).strip()
                    if v.startswith("http"): urls.append(v)
                break
    except Exception:
        pass
    return list(dict.fromkeys(urls))

def source_pages_from_photo_overrides(builder, pedal):
    urls=[]
    path=Path("research/PHOTO_SOURCE_OVERRIDES.csv")
    if not path.exists(): return urls
    try:
        import csv
        for r in csv.DictReader(path.open(newline="",encoding="utf-8")):
            if r.get("Builder")==builder and r.get("Pedal")==pedal:
                v=str(r.get("Image Source Page") or "").strip()
                if v.startswith("http"): urls.append(v)
    except Exception:
        pass
    return list(dict.fromkeys(urls))

def catalog_models_for_builder(builder):
    models=[]
    try:
        catalog=json.loads(Path("research/PEDAL_INDEX.json").read_text(encoding="utf-8"))
        models=[str(item.get("pedal") or "").strip() for item in catalog.get("pedals", [])
                if item.get("company")==builder and str(item.get("pedal") or "").strip()]
    except Exception:
        pass
    return list(dict.fromkeys(models))

def identity_match(builder,pedal,s,models=None):
    title_h1=norm((s.get("title") or "")+" "+(s.get("h1") or ""))
    excerpt=norm(s.get("excerpt") or "")
    hay=norm(title_h1+" "+excerpt)
    b=tokens(builder); p=tokens(pedal)
    target=norm(pedal)
    exact=target in hay if target else False
    p_hits=sum(1 for x in p if x in hay)
    b_hits=sum(1 for x in b if x in hay)

    # Reject a page whose heading claims the target but whose body is clearly
    # about another cataloged model from the same builder. This catches
    # mislabeled storefront/template pages such as a CRR page containing CFR
    # model documentation.
    if models and target and target not in excerpt:
        for other in models:
            other_n=norm(other)
            if other_n and other_n != target and other_n in excerpt:
                return False

    return bool((exact and (not b or b_hits >= 1)) or
                (p and p_hits >= max(1,min(2,len(p))) and (not b or b_hits >= 1)))

def source_kind(builder,url,exact_catalog_urls=None):
    h=host(url)
    compact=re.sub(r"[^a-z0-9]","",norm(builder))
    hc=re.sub(r"[^a-z0-9]","",h)
    if "effectsdatabase" in h: return "effects_database"
    if "reverb.com" in h: return "reverb"
    if compact and compact in hc: return "manufacturer"
    if exact_catalog_urls and url in exact_catalog_urls:
        return "catalog_verified"
    return "other"

builder=os.environ.get("RESEARCH_TARGET_BUILDER","").strip()
pedal=os.environ.get("RESEARCH_TARGET_PEDAL","").strip()
out_path=os.environ.get("RESEARCH_OUT","").strip()
if not builder or not pedal:
    raise SystemExit("RESEARCH_TARGET_BUILDER and RESEARCH_TARGET_PEDAL are required")

catalog_urls=set(source_pages_from_catalog(builder,pedal))
override_urls=set(source_pages_from_photo_overrides(builder,pedal))
exact_source_urls=catalog_urls | override_urls
models=catalog_models_for_builder(builder)
urls=[]
for u in list(catalog_urls)+list(override_urls):
    if u not in urls: urls.append(u)
for q in (f'"{builder}" "{pedal}"', f'"{builder}" "{pedal}" manual specs review', f'"{pedal}" "{builder}" Reverb Effects Database'):
    for x in search(q):
        if x["url"] not in urls: urls.append(x["url"])

sources=[]; seen_hosts=set()
for u in urls[:12]:
    s=fetch(u)
    if not s: continue
    s["source_host"]=host(s["url"])
    s["source_kind"]=source_kind(builder,s["url"],exact_source_urls)
    s["identity_match"]=identity_match(builder,pedal,s,models)
    if s["identity_match"]:
        sources.append(s)
    seen_hosts.add(s["source_host"])
record={"builder":builder,"pedal":pedal,"sources":sources,
        "source_hosts":sorted({s["source_host"] for s in sources if s.get("source_host")}),
        "collected_at":__import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()}
out=Path(out_path) if out_path else OUT/"candidate-0.json"
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(builder,"/",pedal,"sources=",len(sources),"hosts=",len(record["source_hosts"]))
