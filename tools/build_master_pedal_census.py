#!/usr/bin/env python3
"""Build the master Builder -> Pedals census from research blocks.

The source of truth for this phase is the research/builders/*.md collection.
The generated CSV deliberately stays simple:

    Builder ID, Builder, Pedal, Type

No evidence, verification, confidence, or source fields are added to the
master census.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOCK_DIR = ROOT / "research" / "builders"
BUILDER_INDEX = ROOT / "research" / "BUILDER_MASTER_INDEX.md"
OUTPUT = ROOT / "research" / "MASTER_PEDAL_CENSUS.csv"

CATEGORY_WORDS = {
    "Overdrive": re.compile(r"overdrive|\bod\b|drive", re.I),
    "Distortion": re.compile(r"distortion", re.I),
    "Fuzz": re.compile(r"fuzz", re.I),
}

# A few block headings use display forms that differ from the canonical
# builder name in BUILDER_MASTER_INDEX.md.
MANUAL_ALIASES = {
    "DOD": "DOD Electronics",
    "Lovepedal / Sean Michael": "Lovepedal",
    "MOOER Audio": "MOOER Audio / MOOER",
    "NUX Audio": "NUX Audio / NUX",
    "MXR / Dunlop Manufacturing, Inc.": "MXR",
    "Blackout Effectors": "BlackOutEffectors",
    "Catalinbread": "Catalinbread Effects",
    "Foxrox Electronics / Dave Fox": "Foxrox Electronics",
    "Pete Cornish Effects": "Pete Cornish",
    "Way Huge / George Tripps": "Way Huge",
}


def norm(value: str) -> str:
    value = value.strip().lower()
    value = value.replace("’", "'")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def load_builder_map() -> tuple[dict[str, tuple[str, str]], dict[str, tuple[str, str]]]:
    """Return maps for canonical builder names and observed aliases."""
    canonical: dict[str, tuple[str, str]] = {}
    aliases: dict[str, tuple[str, str]] = {}

    table_re = re.compile(
        r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*)\|\s*$"
    )

    for line in BUILDER_INDEX.read_text(encoding="utf-8").splitlines():
        match = table_re.match(line)
        if not match or not match.group(1).isdigit():
            continue
        builder_id, builder, _blocks, alias = [x.strip() for x in match.groups()]
        if builder == "Canonical builder":
            continue
        value = (builder_id.zfill(3), builder)
        canonical[norm(builder)] = value
        if alias:
            for alias_part in alias.split(" / "):
                aliases[norm(alias_part)] = value
            aliases[norm(alias)] = value

    for observed, target in MANUAL_ALIASES.items():
        target_value = canonical.get(norm(target))
        if target_value:
            aliases[norm(observed)] = target_value

    return canonical, aliases


def resolve_builder(observed: str, canonical: dict[str, tuple[str, str]], aliases: dict[str, tuple[str, str]]) -> tuple[str, str]:
    cleaned = observed.strip()
    key = norm(cleaned)
    if key in canonical:
        return canonical[key]
    if key in aliases:
        return aliases[key]

    # Common display forms such as "Lovepedal / Sean Michael" can be
    # resolved by their leading canonical name.
    for known, value in {**canonical, **aliases}.items():
        if key.startswith(known + " ") or key.startswith(known + "/"):
            return value

    return ("", cleaned)


def category_from_heading(heading: str) -> list[str]:
    """Convert a dirt-category heading into one or more simple type labels."""
    types: list[str] = []
    lower = heading.lower()
    if "fuzz" in lower:
        types.append("Fuzz")
    if "distortion" in lower:
        types.append("Distortion")
    # 'drive' can appear inside words such as 'overdrive'.
    if "overdrive" in lower or re.search(r"\bod\b", lower) or re.search(r"\bdrive\b", lower):
        types.append("Overdrive")
    return types


def clean_pedal_text(text: str) -> str | None:
    text = text.strip()
    if not text:
        return None
    if text.startswith("http://") or text.startswith("https://"):
        return None

    # A handful of research notes are written as bullets inside a category
    # section. They describe another pedal rather than naming a product.
    lower = text.lower()
    note_markers = (
        " is an overdrive",
        " is a distortion",
        " is a fuzz",
        " not fuzz",
        " recorded below",
        " section within a",
    )
    if any(marker in lower for marker in note_markers):
        return None

    # Drop a descriptive suffix when the text uses an em/en dash for the
    # manufacturer's function description. Preserve compound product names
    # such as "EHX by JHS — Big Muff 2" when the right side is itself a
    # product identity rather than a category description.
    for dash in (" — ", " – "):
        if dash in text:
            left, right = text.split(dash, 1)
            right_lower = right.lower()
            descriptor_words = (
                "overdrive", "distortion", "fuzz", "drive", "booster",
                "power amp", "low signal", "dynamic", "germanium fuzz",
                "octave distortion", "fuzz driver", "fuzz tone", "fuzz blaster",
                "sustainer", "natural overdrive", "grinder", "dirt doubler",
            )
            if any(word in right_lower for word in descriptor_words):
                text = left.strip()
            break

    # Remove accidental markdown emphasis around a name.
    text = text.replace("**", "").replace("__", "").strip()
    return text or None


def extract_rows() -> tuple[list[tuple[str, str, str, str]], list[str], int]:
    canonical, aliases = load_builder_map()
    rows: set[tuple[str, str, str, str]] = set()
    unmatched_builders: set[str] = set()
    builder_section_count = 0

    for path in sorted(BLOCK_DIR.glob("BLOCK-*.md")):
        lines = path.read_text(encoding="utf-8").splitlines()
        builder_id = ""
        builder_name = ""
        active_types: list[str] = []
        collecting = False
        stop_collection = False

        for raw in lines:
            line = raw.strip()

            # A builder section begins with headings such as "## 1. Fulltone".
            match = re.match(r"^##\s+\d+\.\s+(.+?)\s*$", line)
            if match:
                observed = match.group(1).strip()
                builder_id, builder_name = resolve_builder(observed, canonical, aliases)
                if not builder_id:
                    unmatched_builders.add(observed)
                builder_section_count += 1
                active_types = []
                collecting = False
                stop_collection = False
                continue

            # Leave the builder section when the generic block boundary is hit.
            if line.startswith("## Block boundary"):
                collecting = False
                stop_collection = True
                continue

            # Category headings are the subheadings immediately underneath a
            # builder section. Non-dirt headings are ignored.
            heading_match = re.match(r"^###\s+(.+?)\s*$", line)
            if heading_match and not stop_collection:
                active_types = category_from_heading(heading_match.group(1))
                collecting = bool(active_types)
                continue

            if line.startswith("Sources:") or line.startswith("### Notes") or line.startswith("Notes:"):
                collecting = False
                continue

            if collecting and active_types and line.startswith("-"):
                pedal = clean_pedal_text(line[1:].strip())
                if not pedal or not builder_name:
                    continue
                for pedal_type in active_types:
                    rows.add((builder_id, builder_name, pedal, pedal_type))

    return sorted(rows, key=lambda r: (int(r[0]) if r[0].isdigit() else 999, norm(r[1]), norm(r[2]), r[3])), sorted(unmatched_builders), builder_section_count


def write_csv(rows: list[tuple[str, str, str, str]]) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Builder ID", "Builder", "Pedal", "Type"])
        writer.writerows(rows)


def main() -> int:
    rows, unmatched, section_count = extract_rows()
    write_csv(rows)

    print(f"Builder sections parsed: {section_count}")
    print(f"Master census rows: {len(rows)}")
    if unmatched:
        print("Unmapped builder display names:")
        for name in unmatched:
            print(f"- {name}")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
