#!/usr/bin/env python3
"""Audit photo provenance for explicit pedal-revision conflicts.

This is a review detector, not an automatic photo rejection system. It compares
explicit revision markers in each pedal's research record with explicit revision
markers in its image source page/path. CDN cache query parameters such as ?v=...
are intentionally ignored because they are not product revisions.
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
RESEARCH_ROOT = ROOT / "research/pedals"
OUTPUT = ROOT / "research/PHOTO_REVISION_AUDIT.csv"

REVISION_RE = re.compile(
    r"(?<![a-z0-9])(?:v(?:ersion)?\s*([0-9]{1,2})|mk\s*([ivx]{1,4}|[0-9]{1,2})|"
    r"rev(?:ision)?\s*([0-9]{1,2}))(?![a-z0-9])",
    re.I,
)


def key(builder: str, pedal: str) -> tuple[str, str]:
    return str(builder or "").strip(), str(pedal or "").strip()


def revisions(text: str) -> list[str]:
    found = []
    for match in REVISION_RE.finditer(str(text or "")):
        value = next((part for part in match.groups() if part), "")
        if value:
            value = value.upper()
            if value not in found:
                found.append(value)
    return found


def research_records() -> dict[tuple[str, str], Path]:
    out = {}
    if not RESEARCH_ROOT.exists():
        return out
    for path in RESEARCH_ROOT.rglob("*.md"):
        builder = path.parent.name
        pedal = path.stem
        out[key(builder, pedal)] = path
    return out


def target_revision_evidence(text: str) -> list[str]:
    section = str(text or "")
    match = re.search(
        r"##\s+Versions and factory options\s*(.*?)(?:\n##\s+|\Z)",
        section,
        re.I | re.S,
    )
    if match:
        section = match.group(1)
    # Explicitly favor lines that state the archive's verified revision evidence.
    lines = [line for line in section.splitlines() if line.strip()]
    focused = [line for line in lines if re.search(r"verified evidence references|exact revision|^[-*]\s*\*\*v|^[-*]\s*\*\*mk", line, re.I)]
    return revisions("\n".join(focused or lines))


def source_revision_markers(entry: dict) -> list[str]:
    values = [
        str(entry.get("image_source_page") or ""),
        str(entry.get("image_source_url") or ""),
        *(str(v or "") for v in (entry.get("image_source_pages") or [])),
        *(str(v or "") for v in (entry.get("image_source_urls") or [])),
    ]
    # Strip query strings before matching so CDN cache tokens like ?v=177...
    # cannot be mistaken for product revision markers.
    cleaned = []
    for value in values:
        cleaned.append(re.sub(r"[?#].*$", "", value))
    return revisions(" ".join(cleaned))


def main() -> None:
    catalog = json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])
    catalog_by_key = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog
    }

    with TRACKER.open(newline="", encoding="utf-8") as fh:
        tracker = list(csv.DictReader(fh))

    records = research_records()
    rows = []
    for track in tracker:
        if track.get("Picture") != "DONE":
            continue
        identity = key(track.get("Builder"), track.get("Pedal"))
        entry = catalog_by_key.get(identity)
        if not entry:
            continue
        record = records.get(identity)
        if not record:
            continue

        try:
            text = record.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue

        target = target_revision_evidence(text)
        source = source_revision_markers(entry)
        status = "PASS"
        reason = ""
        if target and source and not set(target) & set(source):
            status = "REVIEW"
            reason = (
                "Research record explicitly references revision "
                + ", ".join(target)
                + " but photo provenance explicitly references "
                + ", ".join(source)
                + "."
            )
        rows.append({
            "Builder": identity[0],
            "Pedal": identity[1],
            "Status": status,
            "Research Revisions": " | ".join(target),
            "Source Revisions": " | ".join(source),
            "Image": str(entry.get("image") or ""),
            "Source Page": str(entry.get("image_source_page") or ""),
            "Source URL": str(entry.get("image_source_url") or ""),
            "Reason": reason,
        })

    rows.sort(key=lambda row: (row["Status"] != "REVIEW", row["Builder"].lower(), row["Pedal"].lower()))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "Builder", "Pedal", "Status", "Research Revisions", "Source Revisions",
        "Image", "Source Page", "Source URL", "Reason",
    ]
    with OUTPUT.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    review = sum(row["Status"] == "REVIEW" for row in rows)
    print(f"Photo revision fidelity audit: {len(rows)} pictured records checked, {review} revision conflicts flagged.")


if __name__ == "__main__":
    main()
