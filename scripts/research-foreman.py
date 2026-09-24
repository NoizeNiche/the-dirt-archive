#!/usr/bin/env python3
"""Research foreman: verify evidence packets and stage only strong evidence.

This layer never guesses undocumented pedal facts and never publishes weak
machine-written prose as canonical research. It creates a verified evidence
inbox for the main research pass.
"""
import json
import re
from pathlib import Path

ART=Path("research-evidence")
INBOX=Path("research/RESEARCH_INBOX")
INDEX=Path("research/PEDAL_INDEX.json")

def norm(v):
    return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9]+"," ",str(v or "").lower())).strip()

def slug(v):
    return re.sub(r"[^A-Za-z0-9]+","_",str(v or "").strip()).strip("_")[:120] or "unknown"

def host(url):
    m=re.match(r"https?://([^/]+)",url or "")
    return (m.group(1).lower() if m else "")

def identity_ok(builder,pedal,title,h1):
    hay=norm(str(title or "")+" "+str(h1 or ""))
    p=norm(pedal)
    bw=[x for x in norm(builder).split() if len(x)>=3]
    pw=[x for x in norm(pedal).split() if len(x)>=3 and x not in {"the","and","with","for"}]
    return bool((p and p in hay and (not bw or any(x in hay for x in bw))) or
                (pw and all(x in hay for x in pw) and (not bw or any(x in hay for x in bw))))

def main():
    catalog=json.loads(INDEX.read_text(encoding="utf-8"))
    keys={(x.get("company"),x.get("pedal")) for x in catalog.get("pedals",[])}
    INBOX.mkdir(parents=True,exist_ok=True)
    staged=0; held=0
    for f in ART.rglob("candidate-*.json"):
        try: packet=json.loads(f.read_text(encoding="utf-8"))
        except Exception: continue
        b,p=packet.get("builder",""),packet.get("pedal","")
        if (b,p) not in keys: continue
        good=[]; seen=set()
        for s in packet.get("sources",[]):
            h=host(s.get("url",""))
            if not h or h in seen: continue
            if s.get("identity_match") and identity_ok(b,p,s.get("title",""),s.get("h1","")):
                seen.add(h)
                good.append({
                    "url":s.get("url"),
                    "title":s.get("title"),
                    "h1":s.get("h1"),
                    "excerpt":s.get("excerpt","")[:6000],
                    "host":h
                })
        if len(good)<2:
            held+=1
            print("HOLD",b,"/",p,"independent_exact_sources=",len(good))
            continue
        out=INBOX/slug(b)/(slug(p)+".json")
        out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text(json.dumps({
            "builder":b,
            "pedal":p,
            "status":"VERIFIED_EVIDENCE_STAGED",
            "independent_exact_source_count":len(good),
            "sources":good,
            "next_action":"Use this evidence to write the canonical research record; do not infer unsupported component/version claims."
        },ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        staged+=1
        print("STAGED",b,"/",p,"sources=",len(good))
    print(json.dumps({"staged":staged,"held":held},ensure_ascii=False))

if __name__=="__main__":
    main()
