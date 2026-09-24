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
    for m in re.finditer(r'<li[^>]+class=["\\']b_algo[^>]*>[\\s\\S]*?<h2[^>]*>\s*<a[^>]+href=["\\']([^"\\']+)["\\'][^>]*>([\\s\\S]*?)</a>',html,re.I):
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

rows=list(csv.DictReader(open("research/PRP_TRACKER.csv",newline="",encoding="utf-8")))
targets=[{"builder":r["Builder"],"pedal":r["Pedal"]} for r in rows if r.get("Pedal Info")!="DONE"][:64]
for i,t in enumerate(targets):
    q1=f'"{t["builder"]}" "{t["pedal"]}"'
    q2=f'{t["builder"]} {t["pedal"]} manual'
    urls=[]
    for q in (q1,q2):
        for x in search(q):
            if x["url"] not in urls: urls.append(x["url"])
    sources=[]
    for u in urls[:10]:
        s=fetch(u)
        if s: 
            hay=norm(s["title"]+" "+s["h1"])
            p=norm(t["pedal"]); b=words(t["builder"]); pw=words(t["pedal"])
            exact=(p in hay and (not b or any(x in hay for x in b))) or (pw and all(x in hay for x in pw) and (not b or any(x in hay for x in b)))
            s["identity_match"]=bool(exact); sources.append(s)
    out=OUT/f"candidate-{i}.json"
    out.write_text(json.dumps({"builder":t["builder"],"pedal":t["pedal"],"sources":sources},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(t["builder"],"/",t["pedal"],len(sources))
