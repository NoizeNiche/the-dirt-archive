#!/usr/bin/env python3
"""Research foreman: verify evidence packets and stage only strong evidence.

This layer never guesses undocumented pedal facts and never publishes weak
machine-written prose as canonical research. It creates a verified evidence
inbox for the main research pass.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

ALIAS_PATH=Path("research/PEDAL_IDENTITY_ALIASES.csv")

sys.stdout.reconfigure(errors="backslashreplace")

ART=Path("research-evidence")
INBOX=Path("research/RESEARCH_INBOX")
INDEX=Path("research/PEDAL_INDEX.json")

def norm(v):
    safe = str(v or "").strip().lower()
    safe = safe.replace("ø","o").replace("æ","ae").replace("œ","oe").replace("ß","ss")
    safe = unicodedata.normalize("NFKD", safe)
    safe = "".join(ch for ch in safe if not unicodedata.combining(ch))
    safe = safe.encode("utf-8", "backslashreplace").decode("utf-8")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", safe)).strip()

def slug(v):
    return re.sub(r"[^A-Za-z0-9]+","_",str(v or "").strip()).strip("_")[:120] or "unknown"

def host(url):
    m=re.match(r"https?://([^/]+)",url or "")
    return (m.group(1).lower() if m else "")

def identity_ok(builder,pedal,title,h1,excerpt="",url=""):
    # Include the exact source URL in the identity check. This matters for
    # manuals and archived PDFs whose filename carries the model name while
    # the parsed document title/body is sparse or binary.
    hay=norm(str(title or "")+" "+str(h1 or "")+" "+str(excerpt or "")+" "+str(url or ""))
    raw_pedal=str(pedal or "").strip()
    variants=[raw_pedal]
    core=re.split(r"\s+—\s+",raw_pedal,maxsplit=1)[0].strip()
    if core and core not in variants:
        variants.append(core)

    # Historical archive names can carry relationship descriptors. Recognize the
    # underlying model and any explicitly named former model while retaining the
    # same exact Builder + source evidence requirements.
    former_match=re.search(r"\bformerly\s+(.+)$",raw_pedal,re.IGNORECASE)
    former_name=(former_match.group(1) if former_match else "").rstrip(" .,:;").strip()
    if former_name and former_name not in variants:
        variants.append(former_name)

    for value_text in (raw_pedal, core):
        code_match=re.match(r"^(.*?)\s*\(([^()]{2,10})\)\s*$",value_text)
        if not code_match:
            continue
        base_name=code_match.group(1).strip()
        code=code_match.group(2).strip()
        if base_name and base_name not in variants:
            variants.append(base_name)
            variants.append(f"{base_name} {code}")
            variants.append(f"{code} {base_name}")
        if re.match(r"^[A-Z0-9][A-Z0-9._-]{1,9}$",code,re.IGNORECASE) and code not in variants:
            variants.append(code)

    relationship_base=re.sub(r"\s*\/\s*formerly\s+.+$","",raw_pedal,flags=re.IGNORECASE)
    relationship_base=re.sub(r"\s+legacy\s+reissue.*$","",relationship_base,flags=re.IGNORECASE)
    relationship_base=re.sub(r"\s+—\s+consolidated.*$","",relationship_base,flags=re.IGNORECASE).strip()
    if relationship_base and relationship_base not in variants:
        variants.append(relationship_base)

    if "rammstein rd distortion combo emulator" in norm(raw_pedal):
        variants.append("Rammstein Du Hast")
    raw_pedal=str(pedal or "").strip()
    if raw_pedal.endswith(")") and "(" in raw_pedal:
        base,alias=raw_pedal.rsplit("(",1)
        alias=alias[:-1].strip()
        if 2 <= len(alias) <= 8 and alias.isalnum() and alias.upper()==alias:
            base=base.strip()
            if base:
                variants.append(base)
    variants=list(dict.fromkeys(variants))
    bw=[x for x in norm(builder).split() if len(x)>=3]
    for variant in variants:
        p=norm(variant)
        pw=[x for x in p.split() if len(x)>=3 and x not in {"the","and","with","for"}]
        if (p and p in hay and (not bw or any(x in hay for x in bw))) or (pw and all(x in hay for x in pw) and (not bw or any(x in hay for x in bw))):
            return True
    return False

def catalog_identity_variants(value):
    raw=str(value or "").strip()
    variants={raw}
    core=re.split(r"\s+—\s+",raw,maxsplit=1)[0].strip()
    if core:
        variants.add(core)

    former=re.search(r"\bformerly\s+(.+)$",raw,re.IGNORECASE)
    if former:
        variants.add(re.sub(r"[\s.,;:]+$","",former.group(1)).strip())

    for value_text in (raw,core):
        match=re.match(r"^(.*?)\s*\(([^()]{2,10})\)\s*$",value_text)
        if not match:
            continue
        base=match.group(1).strip()
        code=match.group(2).strip()
        if base:
            variants.add(base)
            variants.add(f"{base} {code}")
            variants.add(f"{code} {base}")
        if re.match(r"^[A-Z0-9][A-Z0-9._-]{1,9}$",code,re.IGNORECASE):
            variants.add(code)

    relationship_base=re.sub(r"\s*\/\s*formerly\s+.+$","",raw,flags=re.IGNORECASE)
    relationship_base=re.sub(r"\s+legacy\s+reissue.*$","",relationship_base,flags=re.IGNORECASE)
    relationship_base=re.sub(r"\s+—\s+consolidated.*$","",relationship_base,flags=re.IGNORECASE).strip()
    if relationship_base:
        variants.add(relationship_base)

    try:
        for row in csv.DictReader(ALIAS_PATH.open(newline="",encoding="utf-8")):
            if str(row.get("Status") or "").strip().upper()!="CONFIRMED":
                continue
            canonical=str(row.get("Canonical Pedal") or "").strip()
            alias=str(row.get("Alias Pedal") or "").strip()
            if canonical==raw and alias:
                variants.add(alias)
            elif alias==raw and canonical:
                variants.add(canonical)
    except Exception:
        pass

    return {norm(v) for v in variants if str(v).strip()}


def resolve_catalog_key(builder,pedal,catalog_keys):
    exact=(builder,pedal)
    if exact in catalog_keys:
        return exact
    builder_norm=norm(builder)
    packet_variants=catalog_identity_variants(pedal)
    matches=[]
    for key in catalog_keys:
        catalog_builder,catalog_pedal=key
        if norm(catalog_builder)!=builder_norm:
            continue
        if packet_variants & catalog_identity_variants(catalog_pedal):
            matches.append(key)
    return matches[0] if len(matches)==1 else None


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
            canonical_key=resolve_catalog_key(b,p,keys)
            if not canonical_key:
                continue
            canonical_builder,canonical_pedal=canonical_key
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
                if exact and identity_ok(canonical_builder,canonical_pedal,title,h1,excerpt,s.get("url","")):
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
                print("HOLD",canonical_builder,"/",canonical_pedal,"independent_exact_sources=",len(good))
                continue
            out=INBOX/slug(canonical_builder)/(slug(canonical_pedal)+".json")
            out.parent.mkdir(parents=True,exist_ok=True)
            out.write_text(json.dumps({
                "builder":canonical_builder,
                "pedal":canonical_pedal,
                "original_builder":b,
                "original_pedal":p,
                "status":"VERIFIED_EVIDENCE_STAGED",
                "independent_exact_source_count":len(good),
                "sources":good,
                "next_action":"Use this evidence to write the canonical research record; do not infer unsupported component/version claims."
            },ensure_ascii=True,indent=2)+"\n",encoding="utf-8")
            staged+=1
            staged_files.append(out.as_posix())
            print("STAGED",canonical_builder,"/",canonical_pedal,"sources=",len(good))
    summary = {"staged": staged, "held": held, "staged_files": staged_files}
    Path("research-evidence/foreman-summary.json").write_text(
        json.dumps(summary, ensure_ascii=True, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(summary,ensure_ascii=True))

if __name__=="__main__":
    main()
