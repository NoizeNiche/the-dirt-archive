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
    "Maxon / Nisshin Onpa": "Maxon",
}

ANNOTATION_MARKERS = (
    "explicitly", "explicit", "historical/current", "historical", "current",
    "authoritative", "documentation", "manufacturer", "official", "lineage",
    "family", "product family", "product relationship", "described as",
    "identified as", "documentation.", "source", "sources", "catalog",
    "derived", "variant", "editions", "reviewed material", "same product",
)


def norm(value: str) -> str:
    value = value.strip().lower().replace("’", "'").replace("æ", "ae")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def load_builder_aliases() -> dict[str, str]:
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
    cleaned = observed.strip().strip("*")
    key = norm(cleaned)
    if key in aliases:
        return aliases[key]

    for alias_key, canonical in aliases.items():
        if key.startswith(alias_key + " ") or key.startswith(alias_key + "/"):
            return canonical

    return cleaned


def category_from_heading(heading: str) -> list[str]:
    lower = heading.lower()
    types: list[str] = []
    if "fuzz" in lower:
        types.append("Fuzz")
    if "distortion" in lower:
        types.append("Distortion")
    if "overdrive" in lower or re.search(r"\bod\b", lower) or re.search(r"\bdrive\b", lower):
        types.append("Overdrive")
    return types


def strip_embedded_annotations(text: str) -> str:
    text = re.sub(r"(?:cite|filecite|url|video|entity).*?", "", text)
    return re.sub(r"\s+", " ", text).strip()


def clean_pedal_text(text: str) -> str | None:
    text = strip_embedded_annotations(text.strip())
    if not text or text.startswith(("http://", "https://")):
        return None

    lower = text.lower()
    placeholder_markers = (
        "no standalone ", "no verified ", "no separate ",
        "none established", "none separately", "not counted",
    )
    if any(marker in lower for marker in placeholder_markers):
        return None

    note_markers = (
        " is an overdrive", " is a distortion", " is a fuzz",
        " not fuzz", " recorded below", " should not be confused",
    )
    if any(marker in lower for marker in note_markers):
        return None

    if " / " in text:
        slash_lower = lower
        if any(marker in slash_lower for marker in ANNOTATION_MARKERS):
            return None
        if text.count(" / ") >= 2:
            return None

    for dash in (" - ", " — ", " – "):
        if dash not in text:
            continue
        left, right = text.split(dash, 1)
        right_lower = right.lower()
        if any(marker in right_lower for marker in ANNOTATION_MARKERS):
            text = left.strip()
            break
        if re.search(r"\bcombined\b.*\bpedal\b", right_lower):
            text = left.strip()
            break

    text = text.replace("**", "").replace("__", "").strip(" .;")
    return text or None


def canonical_key(text: str) -> str:
    return norm(text)


def extract_rows() -> tuple[list[tuple[str, str, str]], int]:
    aliases = load_builder_aliases()
    rows: set[tuple[str, str, str]] = set()
    builder_sections = 0

    for path in sorted(BLOCK_DIR.glob("BLOCK-*.md")):
        lines = path.read_text(encoding="utf-8").splitlines()
        current_builder = ""
        active_types: list[str] = []
        collecting = False
        awaiting_builder_name = False

        for raw in lines:
            line = raw.strip()

            if awaiting_builder_name and line:
                observed = line.strip().strip("*")
                current_builder = resolve_builder(observed, aliases)
                builder_sections += 1
                active_types = []
                collecting = False
                awaiting_builder_name = False
                continue

            if re.match(r"^##\s+Builder\s*$", line, re.I):
                awaiting_builder_name = True
                current_builder = ""
                active_types = []
                collecting = False
                continue

            builder_match = re.match(r"^Builder\s*/\s*brand:\s*(.+?)\s*$", line, re.I)
            if builder_match:
                current_builder = resolve_builder(builder_match.group(1), aliases)
                builder_sections += 1
                active_types = []
                collecting = False
                awaiting_builder_name = False
                continue

            numbered_match = re.match(r"^##\s+\d+\.\s+(.+?)\s*$", line)
            if numbered_match:
                current_builder = resolve_builder(numbered_match.group(1), aliases)
                builder_sections += 1
                active_types = []
                collecting = False
                awaiting_builder_name = False
                continue

            if line.startswith("## Block boundary") or line.startswith("## Checkpoint"):
                current_builder = ""
                active_types = []
                collecting = False
                awaiting_builder_name = False
                continue

            heading_match = re.match(r"^#{2,3}\s+(.+?)\s*$", line)
            if heading_match and current_builder and not awaiting_builder_name:
                heading = heading_match.group(1).strip()
                structural = {
                    "builder", "verification basis", "category-overlap decisions",
                    "historical / variant handling", "exclusions", "primary source urls",
                    "checkpoint", "notes", "sources",
                }
                if heading.lower() in structural:
                    active_types = []
                    collecting = False
                    continue
                active_types = category_from_heading(heading)
                collecting = bool(active_types)
                continue

            if line.startswith("Sources:") or line.startswith("## Primary source URLs") or line.startswith("### Notes") or line.startswith("Notes:") or line.startswith("Verification notes:"):
                collecting = False
                continue

            if collecting and current_builder and active_types and line.startswith("-"):
                pedal = clean_pedal_text(line[1:].strip())
                if not pedal:
                    continue
                for pedal_type in active_types:
                    rows.add((current_builder, pedal, pedal_type))

    # Remove simple duplicate naming variants when a name only adds a generic
    # category word to an otherwise identical product name for the same builder/type.
    generic_suffixes = (" fuzz", " overdrive", " distortion", " drive")
    existing_keys = {(norm(b), pedal_type, canonical_key(pedal)) for b, pedal, pedal_type in rows}
    clean_rows: set[tuple[str, str, str]] = set()
    for builder, pedal, pedal_type in rows:
        key = canonical_key(pedal)
        remove = False
        for suffix in generic_suffixes:
            if key.endswith(suffix):
                base = key[: -len(suffix)].strip()
                if (norm(builder), pedal_type, base) in existing_keys:
                    remove = True
                    break
        if not remove:
            clean_rows.add((builder, pedal, pedal_type))

    ordered = sorted(clean_rows, key=lambda row: (norm(row[0]), norm(row[1]), row[2]))
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
