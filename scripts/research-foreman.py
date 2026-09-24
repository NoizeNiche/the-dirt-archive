#!/usr/bin/env python3
import json, re
from pathlib import Path

ART=Path("research-evidence")
INDEX=Path("research/PEDAL_INDEX.json")
OUT=Path("research/pedals")

def norm(v): return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9]+"," ",str(v or "").lower())).strip()
def slug(v): return re.sub(r"[^A-Za-z0-9]+","_",str(v or "").strip()).strip("_")[:120] or "unknown"
def host(u):
    m=re.match(r"https?://([^/]+)",u or ""); return (m.group(1).lower() if m else "")
def exact(builder,pedal,title,h1):
    hay=norm((title or "")+" "+(h1 or "")); p=norm(pedal); b=[x for x in norm(builder).split() if len(x)>=3]
    pw=[x for x in norm(pedal).split() if len(x)>=3 and x not in {"the","and","with","for"}]
    return bool((p and p in hay and (not b or any(x in hay for x in b))) or (pw and all(x in hay for x in pw) and (not b or any(x in hay for x in b))))

def main():
    catalog=json.loads(INDEX.read_text(encoding="utf-8"))
    keys={(x.get("company"),x.get("pedal")) for x in catalog.get("pedals",[])}
    admitted=0; held=0
    for f in ART.rglob("candidate-*.json"):
        try: p=json.loads(f.read_text(encoding="utf-8"))
        except Exception: continue
        b, pedal=p.get("builder",""),p.get("pedal","")
        if (b,pedal) not in keys: continue
        good=[]; seen=set()
        for s in p.get("sources",[]):
            h=host(s.get("url",""))
            if h in seen: continue
            if s.get("identity_match") and exact(b,pedal,s.get("title",""),s.get("h1","")):
                seen.add(h); good.append(s)
        if len(good)<2:
            held+=1; print("HOLD",b,"/",pedal,"sources=",len(good)); continue
        path=OUT/slug(b)/(slug(pedal)+".md")
        if path.exists(): continue
        primary=good[0]
        lines=[f"- {s.get('title') or s.get('url')}: {s.get('url')}" for s in good[:6]]
        body=(primary.get("excerpt") or "").replace("\n"," ").strip()
        text=f"""# {b} - {pedal}

## Research identity
- **Builder:** {b}
- **Catalog identity:** {pedal}
- **Identity:** Exact-model identity passed a two-source verification gate.

## What this pedal is
Automatically gathered evidence for the exact model includes: {body[:1800]}

## Colorways
- **Documented colorways:** Not established by the automatic evidence pass.

## Versions and factory options
- **Documented versions/options:** Not established by the automatic evidence pass.

## Version changes
No dated factory revision chronology was established by this automatic evidence pass.

## Transistor
- **Exact transistor/device:** Not established in the gathered evidence.

## Diode
- **Exact clipping/rectification diode/device:** Not established in the gathered evidence.

## Sound
The automatic evidence pass did not establish enough exact-model evidence for a stronger sound claim.

## Sources checked
{chr(10).join(lines)}
"""
        path.parent.mkdir(parents=True,exist_ok=True); path.write_text(text,encoding="utf-8"); admitted+=1; print("ADMIT",b,"/",pedal)
    print(json.dumps({"admitted":admitted,"held":held}))

if __name__=="__main__": main()
