#!/usr/bin/env python3
"""Research foreman: verify evidence packets and stage only strong evidence.

This layer never guesses undocumented pedal facts and never publishes weak
machine-written prose as canonical research. It creates a verified evidence
inbox for the main research pass.
"""
import csv
import json
from functools import lru_cache
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

def load_confirmed_aliases():
    aliases={}
    try:
        for row in csv.DictReader(ALIAS_PATH.open(newline="",encoding="utf-8")):
            if str(row.get("Status") or "").strip().upper()!="CONFIRMED":
                continue
            canonical=str(row.get("Canonical Pedal") or "").strip()
            alias=str(row.get("Alias Pedal") or "").strip()
            if canonical and alias:
                aliases.setdefault(canonical,set()).add(alias)
                aliases.setdefault(alias,set()).add(canonical)
    except Exception:
        pass
    return aliases


CONFIRMED_ALIASES=load_confirmed_aliases()


@lru_cache(maxsize=4096)
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

    for alias in CONFIRMED_ALIASES.get(raw,set()):
        variants.add(alias)

    return {norm(v) for v in variants if str(v).strip()}


def build_catalog_identity_index(catalog_keys):
    index={}
    for key in catalog_keys:
        builder,catalog_pedal=key
        builder_norm=norm(builder)
        for variant in catalog_identity_variants(catalog_pedal):
            index.setdefault((builder_norm,variant),set()).add(key)
    return index


def resolve_catalog_key(builder,pedal,catalog_index,catalog_keys):
    exact=(builder,pedal)
    if exact in catalog_keys:
        return exact
    builder_norm=norm(builder)
    packet_variants=catalog_identity_variants(pedal)
    matches=set()
    for variant in packet_variants:
        matches.update(catalog_index.get((builder_norm,variant),set()))
    return next(iter(matches)) if len(matches)==1 else None


SCRAPE_RESIDUE_MARKERS = (
    "skip to navigation", "skip to content", "browse by", "effect types",
    "countries", "install effects database app", "forum", "newsletter",
    "reviews myfxdb user reviews", "where to find one", "add to cart",
    "shopping cart", "shop pay", "gear card", "javascript is disabled",
    "related brands", "related tags", "my account", "log in", "sign in",
    "mobile gift card", "payment methods", "menu"
)


def scrape_residue_score(text):
    low = str(text or "").lower()
    score = sum(low.count(marker) for marker in SCRAPE_RESIDUE_MARKERS)
    score += 2 * len(re.findall(r"\b(?:display|font-family|margin|padding|background|color)\s*:\s*[^;{}]+;", low))
    score += 2 * len(re.findall(r"\b(?:var|const|let)\s+[A-Za-z_$][\w$]*\s*=", low))
    score += 2 * len(re.findall(r"""["\']variants["\']\s*:\s*\[""", low))
    if len(low) > 7000 and score < 4 and low.count(" | ") > 35:
        score += 4
    return score


def clean_evidence_excerpt(text, builder="", pedal=""):
    value = str(text or "")
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\\x[0-9a-fA-F]{2}", " ", value)

    # Page scrapers frequently prepend a giant navigation shell before the
    # exact product heading. When the exact pedal name is present, discard a
    # navigation-heavy prefix and retain the product body that follows it.
    identity_variants = [str(pedal or "").strip()]
    core = re.split(r"\s+—\s+", str(pedal or "").strip(), maxsplit=1)[0].strip()
    if core and core not in identity_variants:
        identity_variants.append(core)
    for identity in identity_variants:
        if len(identity) < 3:
            continue
        match = re.search(re.escape(identity), value, flags=re.I)
        if match and match.start() > 0 and scrape_residue_score(value[:match.start()]) >= 3:
            value = value[match.start():]
            break

    # Drop common footer/navigation tails when they occur after the product
    # copy. This prevents UI labels from becoming canonical evidence.
    tail_markers = (
        "Video all |", "Reviews myFXDB user reviews", "Where to find one?",
        "Related brands", "Related tags", "Install Effects Database App"
    )
    lower = value.lower()
    cut = None
    for marker in tail_markers:
        pos = lower.find(marker.lower(), 300)
        if pos >= 0:
            cut = pos if cut is None else min(cut, pos)
    if cut is not None:
        value = value[:cut]

    # CSS/JSON residue can survive HTML stripping on some sources.
    value = re.sub(r"\{[^{}]{0,3000}\}", " ", value, flags=re.S)
    value = re.sub(r"--[a-z0-9_-]+\s*:\s*[^;{}]+;?", " ", value, flags=re.I)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:6000]


def source_has_usable_excerpt(source, builder, pedal):
    raw = str(source.get("excerpt") or source.get("bodyExcerpt") or "")
    cleaned = clean_evidence_excerpt(raw, builder, pedal)
    if len(cleaned) < 40:
        return False
    residue = scrape_residue_score(cleaned)
    if residue >= 5:
        # A source can carry one or two UI labels legitimately. Five or more
        # distinct residue signals means the excerpt is dominated by scraping
        # rather than pedal-specific evidence.
        return False
    return True


def source_is_strong_single(source):
    kind = str(source.get("source_kind") or "").strip().lower()
    excerpt = clean_evidence_excerpt(source.get("excerpt"), source.get("builder", ""), source.get("pedal", "")).strip()
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
    catalog_index=build_catalog_identity_index(keys)
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
            canonical_key=resolve_catalog_key(b,p,catalog_index,keys)
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
                    cleaned_excerpt=clean_evidence_excerpt(excerpt,canonical_builder,canonical_pedal)
                    candidate={
                        "url":s.get("url"),
                        "title":title,
                        "h1":h1,
                        "excerpt":cleaned_excerpt,
                        "host":h,
                        "source_kind":s.get("source_kind",s.get("sourceKind","other"))
                    }
                    if source_has_usable_excerpt(candidate,canonical_builder,canonical_pedal):
                        seen.add(h)
                        good.append(candidate)
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
