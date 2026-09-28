#!/usr/bin/env python3
"""Promote foreman-approved research evidence packets into canonical pedal records.

Only packets marked VERIFIED_EVIDENCE_STAGED are eligible. The synthesizer is
deliberately conservative: it summarizes claims already present in the verified
packet and leaves undocumented fields explicitly unknown rather than guessing.
"""

import argparse
import html
import csv
import json
import re
import unicodedata
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
TRACKER = Path("research/PRP_TRACKER.csv")
INBOX = Path("research/RESEARCH_INBOX")
RESEARCH_ROOT = Path("research/pedals")
ALIAS_PATH = Path("research/PEDAL_IDENTITY_ALIASES.csv")

SOUND_WORDS = re.compile(
    r"\b(sound|tone|gain|fuzz|drive|overdrive|distortion|response|texture|"
    r"dynamic|compression|compressed|saturation|saturated|gated|sputter|"
    r"harmonic|headroom|breakup|grit|boost)\b",
    re.I,
)
VERSION_RE = re.compile(r"\b(?:v\.?\s*\d+|version\s*\d+|mk\s*[ivx0-9]+|revision)\b", re.I)
TRANSISTOR_RE = re.compile(
    r"\b(?:2N\d+[A-Z]?|BC\d+[A-Z]?|AC\d+[A-Z0-9-]*|"
    r"germanium transistor|silicon transistor(?:s)?|germanium fuzz)\b",
    re.I,
)
DIODE_RE = re.compile(
    r"\b(?:1N\d+[A-Z]?|BAT\d+[A-Z]?|germanium diode|silicon diode|"
    r"LED(?:s)?)\b",
    re.I,
)
COLOR_RE = re.compile(
    r"\b(?:black|white|red|blue|green|yellow|orange|purple|pink|silver|"
    r"gold|natural|raw|finish|powder coat|enclosure color|colorway|artwork)\b",
    re.I,
)


def norm(value):
    text = html.unescape(re.sub(r"\s+", " ", str(value or "").strip()))
    text = text.replace("ø","o").replace("Ø","O").replace("æ","ae").replace("Æ","AE").replace("œ","oe").replace("Œ","OE").replace("ß","ss")
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text.encode("utf-8", "backslashreplace").decode("utf-8")


def slug(value):
    return re.sub(r"[^A-Za-z0-9]+", "_", str(value or "").strip()).strip("_")[:120] or "unknown"


def identity_variants(value):
    raw = norm(value).lower()
    variants = {raw}
    # Explicit archive aliases are data, not heuristics. CONFIRMED aliases may
    # resolve directly; REVIEW aliases still require the ordinary source gates.
    try:
        for row in csv.DictReader(ALIAS_PATH.open(newline="", encoding="utf-8")):
            if str(row.get("Canonical Pedal") or "").strip().lower() == raw and str(row.get("Status") or "").strip().upper() == "CONFIRMED":
                variants.add(norm(row.get("Alias Pedal")).lower())
            if str(row.get("Alias Pedal") or "").strip().lower() == raw and str(row.get("Status") or "").strip().upper() == "CONFIRMED":
                variants.add(norm(row.get("Canonical Pedal")).lower())
    except Exception:
        pass
    core = re.split(r"\s+—\s+", raw, maxsplit=1)[0].strip()
    if core:
        variants.add(core)

    # Catalog display names may carry historical relationship descriptors.
    base = re.sub(r"\s*\/\s*formerly\s+.+$", "", raw, flags=re.I).strip()
    base = re.sub(r"\s+legacy\s+reissue.*$", "", base, flags=re.I).strip()
    base = re.sub(r"\s+—\s+consolidated.*$", "", base, flags=re.I).strip()
    if base:
        variants.add(base)

    former = re.search(r"\bformerly\s+(.+)$", raw, flags=re.I)
    if former:
        variants.add(re.sub(r"[\s.,;:]+$", "", former.group(1)).strip())

    # Product codes may be reordered or omitted by manuals/retailer titles.
    for value_text in (raw, core):
        match = re.match(r"^(.*?)\s*\(([^()]{2,10})\)\s*$", value_text)
        if not match:
            continue
        base_name = match.group(1).strip()
        code = match.group(2).strip()
        if base_name:
            variants.add(base_name)
            variants.add(f"{base_name} {code}")
            variants.add(f"{code} {base_name}")
        if re.match(r"^[a-z0-9][a-z0-9._-]{1,9}$", code, flags=re.I):
            variants.add(code)

    return {v for v in variants if v}


def resolve_catalog_key(builder, pedal, by_key):
    exact = (builder, pedal)
    if exact in by_key:
        return exact
    packet_builder = norm(builder).lower()
    packet_variants = identity_variants(pedal)
    matches = []
    for key in by_key:
        catalog_builder, catalog_pedal = key
        if norm(catalog_builder).lower() != packet_builder:
            continue
        catalog_variants = identity_variants(catalog_pedal)
        if packet_variants & catalog_variants:
            matches.append(key)
    if len(matches) == 1:
        return matches[0]
    return None


def source_metadata_matches_identity(source, builder, pedal):
    hay = norm(" ".join([
        source.get("title", ""),
        source.get("h1", ""),
        source.get("url", ""),
    ])).lower()
    builder_tokens = [token for token in norm(builder).lower().split() if len(token) >= 3]
    if not builder_tokens or not any(token in hay for token in builder_tokens):
        return False
    return any(norm(value).lower() in hay for value in identity_variants(pedal))


def orphan_packet_is_adoptable(packet):
    sources = [source for source in packet.get("sources", []) if isinstance(source, dict)]
    builder = packet.get("builder", "")
    pedal = packet.get("pedal", "")
    metadata_exact = sum(
        1 for source in sources
        if source_metadata_matches_identity(source, builder, pedal)
    )
    # Old packets are allowed to be adopted only when two independent source
    # pages themselves identify the exact model in title/H1/URL. Body-only mentions
    # do not qualify for this recovery path.
    return metadata_exact >= 2


def split_sentences(text):
    clean = norm(re.sub(r"\[[0-9]+\]", "", text))
    # Evidence excerpts can be page dumps rather than prose. Split on common
    # scraper separators as well as sentence punctuation, then discard
    # navigation-heavy fragments and cap candidates to keep canonical records
    # readable.
    parts = re.split(r"(?<=[.!?])\s+|\s+--?>\s+|\s+•\s+|\s+\|\s+", clean)
    out = []
    for part in parts:
        s = re.sub(r"\s+", " ", part).strip(" -|>\t\r\n")
        if not (35 <= len(s) <= 320):
            continue
        low = s.lower()
        boilerplate = (
            "skip to navigation", "browse by", "categories menu", "mi cuenta",
            "carrito", "newsletter", "copyright", "privacy policy", "where to find one",
            "ads! this site", "related -->", "myfxdb user reviews", "your browser",
            "skip to content", "skip to main content", "log in", "sign in", "add to wishlist",
            "view wishlist", "share this", "category", "tags", "search", "magazin", "magazine",
            "software /", "news /", "features", "all products", "all pedals", "more pedals",
            "technical data", "technical specifications", "pedalpedia", "pedalpedia", "manuals",
            "reviews", "where to find one", "this site contains affiliate links"
        )
        if any(marker in low for marker in boilerplate):
            continue
        out.append(s)
    return out


def exact_sources(packet):
    out = []
    seen = set()
    for source in packet.get("sources", []):
        url = norm(source.get("url"))
        host = norm(source.get("host"))
        if not url or not host or host in seen:
            continue
        seen.add(host)
        out.append(source)
    return out

def strong_single_source(sources):
    if len(sources) != 1:
        return False
    source = sources[0]
    kind = str(source.get("source_kind") or "").strip().lower()
    excerpt_len = len(norm(source.get("excerpt")))
    if kind in {"manufacturer", "effects_database", "reverb"}:
        return excerpt_len >= 160
    if kind == "catalog_verified":
        return excerpt_len >= 40
    return False



def choose_description(builder, pedal, kind, sources):
    for source in sources:
        for sentence in split_sentences(source.get("excerpt")):
            low_sentence = sentence.lower()
            if any(marker in low_sentence for marker in (
                "skip to", "log in", "sign in", "pedalpedia", "pedalpedia",
                "add to wishlist", "view wishlist", "category", "tags", "share this",
                "newsletter", "magazin", "magazine", "software /", "news /",
                "technical data", "all pedals", "all products"
            )):
                continue
            hay = low_sentence
            if pedal.lower() in hay and any(
                marker in hay
                for marker in (" is ", " are ", " designed ", " delivers ", " offers ", " features ")
            ):
                return sentence
        for sentence in split_sentences(source.get("excerpt")):
            if any(x in sentence.lower() for x in ("fuzz pedal", "overdrive pedal", "distortion pedal", "boost pedal")):
                return sentence
    type_name = kind or "effects"
    article = "an" if type_name[:1].lower() in {"a", "e", "i", "o", "u"} else "a"
    return f"{builder}'s {pedal} is cataloged as {article} {type_name.lower()} pedal."


def choose_sound(sources):
    candidates = []
    reject_markers = (
        "ed sheeran", "nirvana", "never mind", "skip to", "add to wishlist",
        "view wishlist", "category", "tags", "share this", "newsletter",
        "magazin", "magazine", "software /", "news /", "features", "pedalpedia",
        "technical data", "all pedals", "all products", "your browser"
    )
    for source in sources:
        for sentence in split_sentences(source.get("excerpt")):
            low = sentence.lower()
            if any(marker in low for marker in reject_markers):
                continue
            if SOUND_WORDS.search(sentence) and any(
                marker in low for marker in (
                    "tone", "gain", "fuzz", "drive", "distortion", "overdrive",
                    "response", "texture", "saturation", "breakup", "grit",
                    "boost", "crunch", "cleaner", "dynamic", "headroom"
                )
            ):
                if sentence not in candidates:
                    candidates.append(sentence)
    return candidates[:3]


def extracted_terms(regex, sources):
    found = []
    for source in sources:
        hay = " ".join([norm(source.get("excerpt")), norm(source.get("title")), norm(source.get("h1"))])
        for match in regex.findall(hay):
            value = norm(match)
            if value and value.lower() not in {x.lower() for x in found}:
                found.append(value)
    return found[:8]


def color_sentences(sources):
    out = []
    for source in sources:
        for sentence in split_sentences(source.get("excerpt")):
            if COLOR_RE.search(sentence) and any(
                x in sentence.lower()
                for x in ("finish", "color", "colour", "enclosure", "artwork", "black", "white", "red", "blue")
            ):
                out.append(sentence)
    return list(dict.fromkeys(out))[:3]


def write_record(item, tracker_type, packet):
    builder = norm(item.get("company") or "")
    pedal = norm(item.get("pedal") or "")
    kind = norm(tracker_type or (item.get("types") or [""])[0] if isinstance(item.get("types"), list) else tracker_type)
    sources = exact_sources(packet)
    if len(sources) < 2 and not strong_single_source(sources):
        return False, "insufficient independent exact-source evidence"

    linked_record = str(item.get("research_record") or "").strip()
    record_path = (
        Path(linked_record[2:] if linked_record.startswith("./") else linked_record)
        if linked_record
        else RESEARCH_ROOT / builder / f"{pedal}.md"
    )
    existing_revisitable = record_path.exists() and str(item.get("research_level") or "").strip().lower() in {"surface", "researched"}
    if (record_path.exists() or item.get("research_record")) and not existing_revisitable:
        return False, "record already exists"

    description = choose_description(builder, pedal, kind, sources)
    sounds = choose_sound(sources)
    transistors = extracted_terms(TRANSISTOR_RE, sources)
    diodes = extracted_terms(DIODE_RE, sources)
    versions = sorted(set(m.group(0) for s in sources for m in VERSION_RE.finditer(" ".join([
        norm(s.get("excerpt")), norm(s.get("title")), norm(s.get("h1"))
    ]))))
    colors = color_sentences(sources)

    record_path.parent.mkdir(parents=True, exist_ok=True)

    # A deepening pass must never erase a richer record merely because the
    # newly admitted evidence packet is sparse. Preserve the existing
    # researched record and append only the new, verified evidence. Surface
    # placeholders are still replaced with the canonical first deep-research
    # record below.
    if existing_revisitable and str(item.get("research_level") or "").strip().lower() == "researched":
        existing_text = record_path.read_text(encoding="utf-8")
        verified_lines = [
            "",
            "## Deep research verification",
            "",
            "This pass adds only claims supported by the newly admitted exact-model evidence. Earlier archive research is retained unchanged.",
            "",
            "### Verified description",
            description,
        ]
        if colors:
            verified_lines += ["", "### Verified color/finish evidence"]
            verified_lines.extend(f"- {s}" for s in colors)
        if versions:
            verified_lines += ["", "### Verified version references"]
            verified_lines.append(f"- The evidence references: {', '.join(versions)}.")
        if transistors:
            verified_lines += ["", "### Verified transistor/device terms"]
            verified_lines.append("- " + ", ".join(transistors) + ".")
        if diodes:
            verified_lines += ["", "### Verified diode terms"]
            verified_lines.append("- " + ", ".join(diodes) + ".")
        if sounds:
            verified_lines += ["", "### Verified sound evidence"]
            verified_lines.extend(sounds)
        verified_lines += ["", "### Sources checked in this pass"]
        for i, source in enumerate(sources, start=1):
            title = str(source.get("title") or source.get("h1") or source.get("url") or "").strip()
            verified_lines.append(f"{i}. {title}: {source.get('url')}")
        record_path.write_text(existing_text.rstrip() + "\n" + "\n".join(verified_lines) + "\n", encoding="utf-8")
        item["research_level"] = "deep"
        item["deep_research_status"] = "VERIFIED"
        return True, str(record_path)

    lines = [
        f"# {builder} — {pedal}",
        "",
        "## PRP identity",
        f"- **Archive parent:** {pedal}",
        f"- **Builder:** {builder}",
        f"- **Catalog type:** {kind or 'Unknown'}",
        f"- **Identity:** {builder}'s {pedal}.",
        "",
        "## What this pedal is",
        description,
        "",
        "## Colorways",
    ]
    if colors:
        lines.extend([f"- {s}" for s in colors])
    else:
        lines.append("- No specific factory colorway information was established in the verified evidence packet.")
    lines += ["", "## Versions and factory options"]
    if versions:
        lines.append(f"- The verified evidence references: {', '.join(versions)}.")
        lines.append("- The packet does not by itself establish a complete factory revision history; undocumented version changes are left unresolved.")
    else:
        lines.append("- No distinct factory revision was established in the verified evidence packet.")
    lines += ["", "## Version changes", "- No specific factory version changes were established in the verified evidence packet."]
    lines += ["", "## Transistor"]
    if transistors:
        lines.append("- Documented terms in the verified sources: " + ", ".join(transistors) + ".")
        lines.append("- The archive records only the component information explicitly present in these sources.")
    else:
        lines.append("- Exact production transistor/device information was not established in the verified evidence packet.")
        lines.append("- **Exact transistor/device:** Unknown.")
    lines += ["", "## Diode"]
    if diodes:
        lines.append("- Documented terms in the verified sources: " + ", ".join(diodes) + ".")
        lines.append("- The archive records only the component information explicitly present in these sources.")
    else:
        lines.append("- Exact production clipping/rectifier diode information was not established in the verified evidence packet.")
        lines.append("- **Exact part:** Unknown.")
    lines += ["", "## Sound"]
    if sounds:
        lines.extend(sounds)
    else:
        lines.append("The verified evidence packet did not contain enough pedal-specific sonic description to make a more detailed sound summary without adding unsupported interpretation.")
    lines += ["", "## Sources checked"]
    for i, source in enumerate(sources, start=1):
        title = str(source.get("title") or source.get("h1") or source.get("url") or "").strip()
        lines.append(f"{i}. {title}: {source.get('url')}")
    lines += ["", "## Photo", "- **Archive status:** Photo recovery is handled separately; no local photo is created by this synthesis pass."]
    record_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    item["research_level"] = "deep"
    item["deep_research_status"] = "VERIFIED"
    return True, str(record_path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--only",
        help="Foreman summary JSON containing staged_files to synthesize from this pass only.",
    )
    args = parser.parse_args()

    allowed_files = None
    if args.only:
        summary = json.loads(Path(args.only).read_text(encoding="utf-8"))
        allowed_files = {str(Path(p)) for p in summary.get("staged_files", [])}

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    by_key = {(x.get("company"), x.get("pedal")): x for x in catalog.get("pedals", [])}
    tracker_rows = list(csv.DictReader(TRACKER.open(newline="", encoding="utf-8")))
    type_by_key = {(r.get("Builder"), r.get("Pedal")): r.get("Catalog Type", "") for r in tracker_rows}

    created = 0
    deepened = 0
    adopted = 0
    created_paths = []
    deepened_paths = []
    adopted_paths = []
    skipped = 0
    held = 0
    packet_paths = sorted(INBOX.rglob("*.json"))
    if allowed_files is not None:
        direct_paths = [p for p in packet_paths if p.as_posix() in allowed_files]
        direct_set = {p.as_posix() for p in direct_paths}
        orphan_paths = []
        for candidate_path in packet_paths:
            if candidate_path.as_posix() in direct_set:
                continue
            try:
                candidate = json.loads(candidate_path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if candidate.get("status") != "VERIFIED_EVIDENCE_STAGED":
                continue
            candidate_key = (candidate.get("builder", ""), candidate.get("pedal", ""))
            if candidate_key in by_key:
                continue
            if resolve_catalog_key(candidate_key[0], candidate_key[1], by_key) and orphan_packet_is_adoptable(candidate):
                orphan_paths.append(candidate_path)
        packet_paths = sorted(direct_paths + orphan_paths)

    for packet_path in packet_paths:
        try:
            packet = json.loads(packet_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if packet.get("status") != "VERIFIED_EVIDENCE_STAGED":
            continue
        packet_builder = packet.get("builder", "")
        packet_pedal = packet.get("pedal", "")
        packet_key = (packet_builder, packet_pedal)
        key = resolve_catalog_key(packet_builder, packet_pedal, by_key)
        item = by_key.get(key) if key else None
        if not item:
            held += 1
            continue
        is_orphan = key != packet_key
        existing_revisitable = (
            str(item.get("research_level") or "").strip().lower() in {"surface", "researched"}
            and bool(item.get("research_record"))
        )
        ok, reason = write_record(item, type_by_key.get(key, ""), packet)
        if ok:
            if existing_revisitable:
                deepened += 1
            else:
                created += 1
            if existing_revisitable:
                deepened_paths.append(reason)
            else:
                created_paths.append(reason)
            if is_orphan:
                adopted += 1
                adopted_paths.append(reason)
        else:
            skipped += 1
    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "created": created,
        "deepened": deepened,
        "adopted": adopted,
        "created_paths": created_paths,
        "deepened_paths": deepened_paths,
        "adopted_paths": adopted_paths,
        "skipped": skipped,
        "held": held,
    }, ensure_ascii=True))
    

if __name__ == "__main__":
    main()
