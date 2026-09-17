#!/usr/bin/env python3
"""Build the master Builder -> Pedals census from every research block.

Generated schema:
    Builder, Pedal, Type

The research blocks remain the working source material. This script simply
pulls the named dirt products into one deduplicated, comparable table.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOCK_DIR = ROOT / "research" / "builders"
BUILDER_INDEX = ROOT / "research" / "BUILDER_MASTER_INDEX.md"
OUTPUT = ROOT / "research" / "MASTER_PEDAL_CENSUS.csv"

MANUAL_ALIASES = {
    "DOD": "DOD Electronics",
    "Lovepedal / Sean Michael": "Lovepedal",
    "MOOER Audio": "MOOER Audio / MOOER",
    "NUX Audio": "NUX Audio / NUX",
    "MXR / Dunlop Manufacturing, Inc.": "MXR",
    "Blackout Effectors": "BlackOutEffectors",
    "Beetronics": "Beetronics FX",
    "Catalinbread": "Catalinbread Effects",
    "Foxrox Electronics / Dave Fox": "Foxrox Electronics",
    "Pete Cornish Effects": "Pete Cornish",
    "Way Huge / George Tripps": "Way Huge",
    "LICHTLÆRM AUDIO": "Lichtlaerm Audio",
    "Xotic California / Xotic Effects": "Xotic Effects",
}


def norm(value: str) -> str:
    value = value.strip().lower().replace("’", "'").replace("æ", "ae")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def load_builder_aliases() -> dict[str, str]:
    """Load canonical names and observed aliases from the builder index."""
    aliases: dict[str, str] = {}
    table_re = re.compile(
        r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*)\|\s*$"
    )

    if BUILDER_INDEX.exists():
        for line in BUILDER_INDEX.read_text(encoding="utf-8").splitlines():
            match = table_re.match(line)
            if not match:
                continue
            _builder_id, builder, _blocks, alias = [x.strip() for x in match.groups()]
            if builder == "Canonical builder":
                continue
            aliases[norm(builder)] = builder
            if alias:
                aliases[norm(alias)] = builder
                for part in alias.split(" / "):
                    aliases[norm(part)] = builder

    for observed, canonical in MANUAL_ALIASES.items():
        aliases[norm(observed)] = canonical

    return aliases


def resolve_builder(observed: str, aliases: dict[str, str]) -> str:
    cleaned = observed.strip()
    key = norm(cleaned)
    if key in aliases:
        return aliases[key]

    # Handle display forms where a canonical name leads the string.
    for alias_key, canonical in aliases.items():
        if key.startswith(alias_key + " ") or key.startswith(alias_key + "/"):
            return canonical

    # This is a real builder name encountered in the research collection but
    # not yet added to the older builder index. Keep it as-is in the census.
    return cleaned


def category_from_heading(heading: str) -> list[str]:
    """Normalize a dirt category heading to one or more archive types."""
    lower = heading.lower()
    types: list[str] = []
    if "fuzz" in lower:
        types.append("Fuzz")
    if "distortion" in lower:
        types.append("Distortion")
    if "overdrive" in lower or re.search(r"\bod\b", lower) or re.search(r"\bdrive\b", lower):
        types.append("Overdrive")
    return types


def clean_pedal_text(text: str) -> str | None:
    text = text.strip()
    if not text or text.startswith(("http://", "https://")):
        return None

    lower = text.lower()
    # These are explanatory bullets embedded in a product section, not names.
    note_markers = (
        " is an overdrive",
        " is a distortion",
        " is a fuzz",
        " not fuzz",
        " recorded below",
    )
    if any(marker in lower for marker in note_markers):
        return None

    # Most blocks use an em/en dash to append a generic function description.
    # Remove that description when it is plainly descriptive, while preserving
    # cases where the right side is actually part of the marketed product name.
    for dash in (" — ", " – "):
        if dash not in text:
            continue
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

    return text.replace("**", "").replace("__", "").strip() or None


def extract_rows() -> tuple[list[tuple[str, str, str]], int]:
    aliases = load_builder_aliases()
    rows: set[tuple[str, str, str]] = set()
    builder_sections = 0

    for path in sorted(BLOCK_DIR.glob("BLOCK-*.md")):
        lines = path.read_text(encoding="utf-8").splitlines()
        current_builder = ""
        active_types: list[str] = []
        collecting = False

        for raw in lines:
            line = raw.strip()

            # The Builder / brand field is more reliable than relying on a
            # particular heading style. It also catches blocks containing more
            # than one builder.
            builder_match = re.match(r"^Builder\s*/\s*brand:\s*(.+?)\s*$", line, re.I)
            if builder_match:
                current_builder = resolve_builder(builder_match.group(1), aliases)
                builder_sections += 1
                active_types = []
                collecting = False
                continue

            if line.startswith("## Block boundary"):
                current_builder = ""
                active_types = []
                collecting = False
                continue

            heading_match = re.match(r"^###\s+(.+?)\s*$", line)
            if heading_match and current_builder:
                active_types = category_from_heading(heading_match.group(1))
                collecting = bool(active_types)
                continue

            if line.startswith("Sources:") or line.startswith("Notes:") or line.startswith("### Notes"):
                collecting = False
                continue

            if collecting and current_builder and active_types and line.startswith("-"):
                pedal = clean_pedal_text(line[1:].strip())
                if not pedal:
                    continue
                for pedal_type in active_types:
                    rows.add((current_builder, pedal, pedal_type))

    ordered = sorted(rows, key=lambda row: (norm(row[0]), norm(row[1]), row[2]))
    return ordered, builder_sections


def write_csv(rows: list[tuple[str, str, str]]) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Builder", "Pedal", "Type"])
        writer.writerows(rows)


def main() -> int:
    rows, builder_sections = extract_rows()
    write_csv(rows)
    print(f"Builder sections parsed: {builder_sections}")
    print(f"Master census rows: {len(rows)}")
    print(f"Unique builders in census: {len({row[0] for row in rows})}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
