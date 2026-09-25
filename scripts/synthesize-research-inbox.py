#!/usr/bin/env python3
"""Promote foreman-approved research evidence packets into canonical pedal records.

Only packets marked VERIFIED_EVIDENCE_STAGED are eligible. The synthesizer is
deliberately conservative: it summarizes claims already present in the verified
packet and leaves undocumented fields explicitly unknown rather than guessing.
"""

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
    return re.sub(r"\s+", " ", str(value or "").strip())


def slug(value):
    return re.sub(r"[^A-Za-z0-9]+", "_", str(value or "").strip()).strip("_")[:120] or "unknown"


def split_sentences(text):
    clean = norm(re.sub(r"\[[0-9]+\]", "", text))
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", clean) if len(s.strip()) >= 35]


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
        text = norm(source.get("excerpt"))
        sentences = split_sentences(text)
        for sentence in sentences:
            hay = sentence.lower()
            if pedal.lower() in hay and any(
                marker in hay
                for marker in (" is ", " are ", " designed ", " delivers ", " offers ", " features ")
            ):
                return sentence
        for sentence in sentences:
            if any(x in sentence.lower() for x in ("fuzz pedal", "overdrive pedal", "distortion pedal", "boost pedal")):
                return sentence
    type_name = kind or "effects"
    return f"{builder}'s {pedal} is cataloged as a {type_name} pedal."


def choose_sound(sources):
    candidates = []
    for source in sources:
        for sentence in split_sentences(source.get("excerpt")):
            if SOUND_WORDS.search(sentence):
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
    builder = item.get("company") or ""
    pedal = item.get("pedal") or ""
    kind = tracker_type or (item.get("types") or [""])[0] if isinstance(item.get("types"), list) else tracker_type
    sources = exact_sources(packet)
    if len(sources) < 2 and not strong_single_source(sources):
        return False, "insufficient independent exact-source evidence"

    record_path = RESEARCH_ROOT / builder / f"{pedal}.md"
    if record_path.exists() or item.get("research_record"):
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
    return True, str(record_path)


def main():
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    by_key = {(x.get("company"), x.get("pedal")): x for x in catalog.get("pedals", [])}
    tracker_rows = list(csv.DictReader(TRACKER.open(newline="", encoding="utf-8")))
    type_by_key = {(r.get("Builder"), r.get("Pedal")): r.get("Catalog Type", "") for r in tracker_rows}

    created = 0
    skipped = 0
    held = 0
    for packet_path in sorted(INBOX.rglob("*.json")):
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
        ok, reason = write_record(item, type_by_key.get(key, ""), packet)
        if ok:
            created += 1
        else:
            skipped += 1
    print(json.dumps({"created": created, "skipped": skipped, "held": held}))
    

if __name__ == "__main__":
    main()
