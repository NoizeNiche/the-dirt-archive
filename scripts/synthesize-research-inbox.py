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
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
TRACKER = Path("research/PRP_TRACKER.csv")
INBOX = Path("research/RESEARCH_INBOX")
RESEARCH_ROOT = Path("research/pedals")

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
    return text.encode("utf-8", "backslashreplace").decode("utf-8")


def slug(value):
    return re.sub(r"[^A-Za-z0-9]+", "_", str(value or "").strip()).strip("_")[:120] or "unknown"


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
        title = norm(source.get("title")) or norm(source.get("h1")) or source.get("url")
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
    created_paths = []
    skipped = 0
    held = 0
    packet_paths = sorted(INBOX.rglob("*.json"))
    if allowed_files is not None:
        packet_paths = [p for p in packet_paths if p.as_posix() in allowed_files]
    for packet_path in packet_paths:
        try:
            packet = json.loads(packet_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if packet.get("status") != "VERIFIED_EVIDENCE_STAGED":
            continue
        key = (packet.get("builder", ""), packet.get("pedal", ""))
        item = by_key.get(key)
        if not item:
            held += 1
            continue
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
            created_paths.append(reason)
        else:
            skipped += 1
    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"created": created, "deepened": deepened, "created_paths": created_paths, "skipped": skipped, "held": held}, ensure_ascii=True))
    

if __name__ == "__main__":
    main()
