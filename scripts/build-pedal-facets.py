#!/usr/bin/env python3
"""Build the public technical facet index from explicit research fields.

Only component technology that is explicitly documented in the research record
is published to the facet index. Missing or non-specific statements are omitted,
rather than converted into a guessed value.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
OUTPUT = ROOT / "research/PEDAL_FACETS.json"

TRANSISTOR_LABELS = (
    "Technology",
    "Exact transistor/device",
    "Exact transistor type",
)
DIODE_LABELS = (
    "Technology",
    "Exact diode type",
    "Exact clipping diode/device",
    "Exact clipping diode",
    "Clipping device",
)

VALID_TRANSISTOR = ("Germanium", "Silicon", "JFET", "MOSFET", "Tube", "Mixed")
VALID_CLIPPING = ("Germanium", "Silicon", "LED", "MOSFET", "Mixed")


def sections(markdown: str) -> dict[str, str]:
    result: dict[str, str] = {}
    current: str | None = None
    bucket: list[str] = []
    for line in markdown.splitlines():
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if match:
            if current is not None:
                result[current] = "\n".join(bucket).strip()
            current = match.group(1).strip().lower()
            bucket = []
        elif current is not None:
            bucket.append(line)
    if current is not None:
        result[current] = "\n".join(bucket).strip()
    return result


def labelled_values(section: str, labels: tuple[str, ...]) -> list[str]:
    values: list[str] = []
    for label in labels:
        pattern = re.compile(
            rf"^[-*]\s*\*\*{re.escape(label)}\s*:\s*\*\*\s*(.+?)\s*$",
            re.IGNORECASE,
        )
        values.extend(
            match.group(1).strip()
            for match in pattern.finditer(section, re.MULTILINE)
        )
    return values


def classify(text: str, allowed: tuple[str, ...], *, diode: bool = False) -> list[str]:
    value = re.sub(r"[*_]", "", text).replace(chr(96), "").strip().lower()
    if not value or any(term in value for term in (
        "unknown",
        "not documented",
        "not publicly documented",
        "not established",
        "not specified",
        "not reliably documented",
    )):
        return []

    found: list[str] = []
    if re.search(r"\bgermanium\b", value):
        found.append("Germanium")
    if re.search(r"\bsilicon\b", value):
        found.append("Silicon")
    if not diode and re.search(r"\bjfet\b|junction\s+field.effect", value):
        found.append("JFET")
    if not diode and re.search(r"\bmosfet\b|\bmos\s+fet\b", value):
        found.append("MOSFET")
    if not diode and re.search(r"\btube\b|\bvalve\b", value):
        found.append("Tube")
    if diode and re.search(r"\bleds?\b|light.emitting", value):
        found.append("LED")
    if diode and re.search(r"\bmosfet\b|\bmos\s+fet\b", value):
        found.append("MOSFET")

    deduped = [item for item in allowed if item in found]
    if "Germanium" in deduped and "Silicon" in deduped and "Mixed" in allowed:
        return ["Mixed"]
    return deduped


def build() -> dict:
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    public_by_key = {
        (
            pedal.get("company", ""),
            pedal.get("pedal", ""),
        ): pedal
        for pedal in catalog.get("pedals", [])
        if pedal.get("catalog_role") != "variation"
    }

    records: dict[str, dict[str, list[str]]] = {}
    tracked = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", "HEAD", "--", "research/pedals"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    ).stdout.splitlines()
    if not tracked:
        tracked = [
            str(path.relative_to(ROOT))
            for path in (ROOT / "research/pedals").rglob("*.md")
        ]

    files_seen = 0
    records_seen = 0

    for relative_path in tracked:
        source = ROOT / relative_path
        if not source.is_file():
            continue
        files_seen += 1
        markdown = source.read_text(encoding="utf-8")
        parsed = sections(markdown)
        identity_section = parsed.get("prp identity", "")

        builder_values = labelled_values(identity_section, ("Builder",))
        parent_values = labelled_values(identity_section, ("Archive parent",))
        builder = builder_values[0].strip() if builder_values else source.parent.name
        pedal = parent_values[0].strip() if parent_values else source.stem
        key_tuple = (builder, pedal)

        if key_tuple not in public_by_key:
            continue
        records_seen += 1

        transistor_values = labelled_values(
            parsed.get("transistor", ""),
            TRANSISTOR_LABELS,
        )
        diode_values = labelled_values(
            parsed.get("diode", ""),
            DIODE_LABELS,
        )

        transistor: list[str] = []
        for value in transistor_values:
            for item in classify(value, VALID_TRANSISTOR):
                if item not in transistor:
                    transistor.append(item)

        clipping: list[str] = []
        for value in diode_values:
            for item in classify(value, VALID_CLIPPING, diode=True):
                if item not in clipping:
                    clipping.append(item)

        if "Germanium" in transistor and "Silicon" in transistor:
            transistor = ["Mixed"]
        if "Germanium" in clipping and "Silicon" in clipping:
            clipping = ["Mixed"]

        search_text = " ".join(
            value.strip()
            for value in (
                labelled_values(
                    identity_section,
                    ("Identity", "Archive parent", "Catalog type"),
                )
            )
            if value.strip()
        ).lower()

        if not transistor and not clipping and not search_text:
            continue

        key = f"{builder}\u0000{pedal}"
        records[key] = {
            **({"transistor": transistor} if transistor else {}),
            **({"clipping": clipping} if clipping else {}),
            **({"search": search_text} if search_text else {}),
        }

    result = {
        "version": 1,
        "records": dict(sorted(records.items(), key=lambda pair: pair[0].casefold())),
        "options": {
            "transistor": list(VALID_TRANSISTOR),
            "clipping": list(VALID_CLIPPING),
        },
    }
    result["_build"] = {
        "research_files_seen": files_seen,
        "catalog_records_matched": records_seen,
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify the committed output is current",
    )
    args = parser.parse_args()

    expected = json.dumps(build(), ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not OUTPUT.is_file():
            raise SystemExit("PEDAL_FACETS.json is missing.")
        actual = OUTPUT.read_text(encoding="utf-8")
        if actual != expected:
            raise SystemExit(
                "PEDAL_FACETS.json is stale; rebuild it with scripts/build-pedal-facets.py."
            )
        print("Pedal facet index: PASS")
        return 0

    OUTPUT.write_text(expected, encoding="utf-8")
    output = json.loads(expected)
    record_count = len(output["records"])
    build_info = output.get("_build", {})
    print(
        "Pedal facet index: wrote "
        f"{record_count} documented records from "
        f"{build_info.get('research_files_seen', 0)} research files "
        f"({build_info.get('catalog_records_matched', 0)} catalog matches)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
