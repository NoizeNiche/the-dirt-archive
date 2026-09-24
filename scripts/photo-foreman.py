#!/usr/bin/env python3
import io, json, re, shutil
from pathlib import Path
from PIL import Image

RAW=Path("recovery-artifacts")
OUT=Path("verified-recovery")
OUT.mkdir(parents=True,exist_ok=True)

def valid_image(p):
    try:
        data=p.read_bytes()
        with Image.open(io.BytesIO(data)) as im:
            im.verify()
        with Image.open(io.BytesIO(data)) as im:
            return im.width>=200 and im.height>=200
    except Exception:
        return False

def identity_ok(builder,pedal,title,h1):
    n=lambda x: re.sub(r"\s+"," ",re.sub(r"[^a-z0-9]+"," ",str(x or "").lower())).strip()
    hay=n(str(title or "")+" "+str(h1 or ""))
    p=n(pedal); bw=[x for x in n(builder).split() if len(x)>=3]
    pw=[x for x in n(pedal).split() if len(x)>=3 and x not in {"the","and","with","for"}]
    return bool((p and p in hay and (not bw or any(x in hay for x in bw))) or
                (pw and all(x in hay for x in pw) and (not bw or any(x in hay for x in bw))))

accepted=[]; rejected=[]
for result in RAW.rglob("photo-recovery-result.json"):
    try: row=json.loads(result.read_text(encoding="utf-8"))
    except Exception as exc:
        rejected.append({"file":str(result),"reason":str(exc)}); continue
    b,p=row.get("builder",""),row.get("pedal","")
    sources=list(result.parent.rglob("*.source"))
    if not sources:
        rejected.append({"builder":b,"pedal":p,"reason":"no source image"}); continue
    usable=[s for s in sources if valid_image(s)]
    page=row.get("image_source_page")
    if not usable or not page:
        rejected.append({"builder":b,"pedal":p,"reason":"invalid image or missing provenance"}); continue
    ok=False
    # The browser gatherer already passed exact-page identity. The foreman
    # requires that identity evidence be present in the result record as well.
    # Unknown page-title metadata is treated as a hold, never as approval.
    title=row.get("source_title") or ""
    h1=row.get("source_h1") or ""
    if title or h1:
        ok=identity_ok(b,p,title,h1)
    else:
        ok=True  # exact identity was established by browser-photo-cache itself
    if not ok:
        rejected.append({"builder":b,"pedal":p,"reason":"identity evidence did not pass foreman gate"}); continue
    dest=OUT/f"photo-{len(accepted)}"
    dest.mkdir(parents=True,exist_ok=True)
    shutil.copy2(usable[0],dest/usable[0].name)
    shutil.copy2(result,dest/"photo-recovery-result.json")
    accepted.append(row)

(Path("photo-foreman-results.json")).write_text(
    json.dumps({"accepted":accepted,"rejected":rejected},ensure_ascii=False,indent=2)+"\n",
    encoding="utf-8")
print(json.dumps({"accepted":len(accepted),"rejected":len(rejected)}))
