#!/usr/bin/env python3
import io, json, re, urllib.request
from pathlib import Path
from html.parser import HTMLParser
from PIL import Image

ART=Path("recovery-artifacts")
OUT=Path("verified-recovery")
OUT.mkdir(parents=True,exist_ok=True)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=[]; self.h1=[]; self.mode=""
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

def norm(v):
    return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9]+"," ",str(v or "").lower())).strip()

def identity_ok(builder,pedal,title,h1):
    hay=norm(str(title or "")+" "+str(h1 or ""))
    p=norm(pedal)
    bw=[x for x in norm(builder).split() if len(x)>=3]
    pw=[x for x in norm(pedal).split() if len(x)>=3 and x not in {"the","and","with","for"}]
    return bool((p and p in hay and (not bw or any(x in hay for x in bw))) or
                (pw and all(x in hay for x in pw) and (not bw or any(x in hay for x in bw))))

def valid_image(p):
    try:
        data=p.read_bytes()
        with Image.open(io.BytesIO(data)) as im: im.verify()
        with Image.open(io.BytesIO(data)) as im: return im.width>=200 and im.height>=200
    except Exception:
        return False

def source_identity(url,builder,pedal):
    try:
        req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0","Accept-Language":"en-US,en;q=0.9"})
        with urllib.request.urlopen(req,timeout=7) as resp:
            html=resp.read(300000).decode("utf-8","ignore")
        q=Page(); q.feed(html)
        title=re.sub(r"\s+"," "," ".join(q.title)).strip()
        h1=re.sub(r"\s+"," "," ".join(q.h1)).strip()
        return identity_ok(builder,pedal,title,h1),title,h1
    except Exception as exc:
        return False,"",str(exc)

accepted=[]; rejected=[]
for result in ART.rglob("photo-recovery-result.json"):
    try: row=json.loads(result.read_text(encoding="utf-8"))
    except Exception as exc:
        rejected.append({"file":str(result),"reason":"unreadable result: "+str(exc)}); continue
    builder,pedal=row.get("builder",""),row.get("pedal","")
    sources=[s for s in result.parent.rglob("*.source") if valid_image(s)]
    page=row.get("image_source_page")
    if not sources or not page:
        rejected.append({"builder":builder,"pedal":pedal,"reason":"missing valid image or provenance"}); continue
    ok,title,h1=source_identity(page,builder,pedal)
    if not ok:
        rejected.append({"builder":builder,"pedal":pedal,"reason":"foreman source-page identity check failed","source_page":page,"title":title,"h1":h1}); continue
    row["foreman_identity_verified"]=True
    row["foreman_source_title"]=title
    row["foreman_source_h1"]=h1
    dest=OUT/f"photo-{len(accepted)}"; dest.mkdir(parents=True,exist_ok=True)
    import shutil
    shutil.copy2(sources[0],dest/sources[0].name)
    (dest/"photo-recovery-result.json").write_text(json.dumps(row,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    accepted.append(row)

Path("photo-foreman-results.json").write_text(json.dumps({"accepted":accepted,"rejected":rejected},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"accepted":len(accepted),"rejected":len(rejected)}))
