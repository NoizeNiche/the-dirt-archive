#!/usr/bin/env python3
"""Research foreman: verify evidence packets and stage only strong evidence.

This layer never guesses undocumented pedal facts and never publishes weak
machine-written prose as canonical research. It creates a verified evidence
inbox for the main research pass.
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(errors="backslashreplace")

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

def identity_ok(builder,pedal,title,h1,excerpt=""):
    hay=norm(str(title or "")+" "+str(h1 or "")+" "+str(excerpt or ""))
    p=norm(pedal)
    bw=[x for x in norm(builder).split() if len(x)>=3]
    pw=[x for x in norm(pedal).split() if len(x)>=3 and x not in {"the","and","with","for"}]
    return bool((p and p in hay and (not bw or any(x in hay for x in bw))) or
                (pw and all(x in hay for x in pw) and (not bw or any(x in hay for x in bw))))

def source_is_strong_single(source):
    kind = str(source.get("source_kind") or "").strip().lower()
    excerpt = str(source.get("excerpt") or "").strip()
    if kind in {"manufacturer", "effects_database", "reverb"}:
        return len(excerpt) >= 160
    # A curated catalog/override URL has already been tied to this exact
    # Builder + Pedal identity. Do not require a long page body when the
    # canonical source itself is sparse.
    if kind == "catalog_verified":
        return len(excerpt) >= 40
    return False

def main():
    catalog=json.loads(INDEX.read_text(encoding="utf-8"))
    keys={(x.get("company"),x.get("pedal")) for x in catalog.get("pedals",[])}
    INBOX.mkdir(parents=True,exist_ok=True)
    staged=0; held=0
    staged_files=[]
    for f in ART.rglob("*.json"):
        try: packet=json.loads(f.read_text(encoding="utf-8"))
        except Exception: continue
        dossiers = packet.get("records") if isinstance(packet.get("records"), list) else [packet]
        for dossier in dossiers:
            b=str(dossier.get("builder","")).strip()
            p=str(dossier.get("pedal","")).strip()
            if (b,p) not in keys: continue
            good=[]; seen=set()
            raw_sources=dossier.get("sources",[]) if isinstance(dossier.get("sources"),list) else []
            for s in raw_sources:
                h=host(s.get("url",""))
                if not h or h in seen: continue
                identity=s.get("identity") if isinstance(s.get("identity"),dict) else {}
                exact=bool(s.get("identity_match") or identity.get("exactPedal"))
                title=s.get("title","")
                h1=s.get("h1","")
                excerpt=s.get("excerpt",s.get("bodyExcerpt",""))
                if exact and identity_ok(b,p,title,h1,excerpt):
                    seen.add(h)
                    good.append({
                        "url":s.get("url"),
                        "title":title,
                        "h1":h1,
                        "excerpt":str(excerpt or "")[:6000],
                        "host":h,
                        "source_kind":s.get("source_kind",s.get("sourceKind","other"))
                    })
            if len(good)<2 and not (len(good)==1 and source_is_strong_single(good[0])):
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
            staged_files.append(out.as_posix())
            print("STAGED",b,"/",p,"sources=",len(good))
    summary = {"staged": staged, "held": held, "staged_files": staged_files}
    Path("research-evidence/foreman-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(summary,ensure_ascii=False))

if __name__=="__main__":
    main()
