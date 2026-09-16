#!/usr/bin/env python3
"""Audit builder-logo references for source quality and obvious false positives."""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MANIFEST = PUBLIC / "catalog-builder-logo-manifest.js"
OUT = ROOT / "research" / "catalog-builder-logo-audit-01.tsv"

BAD = re.compile(
    r"\b(?:album|person|guitar|pedal|stompbox|event|poster|building|banner|favicon|icon|avatar|sprite)\b",
    re.I,
)

def load_manifest() -> dict:
    if not MANIFEST.exists():
        return {}
    text = MANIFEST.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r"window\.DIRT_BUILDER_LOGOS\s*=\s*(\{.*\})\s*;?\s*$", text, re.S)
    return json.loads(m.group(1)) if m else {}


def classify(entry: dict) -> tuple[str, str]:
    src = str(entry.get("src") or "")
    page = str(entry.get("page") or "")
    st = str(entry.get("source_type") or "")
    hay = " ".join([src, page, st]).lower()
    if not src:
        return "NO_LOGO", "no image reference"
    if BAD.search(hay):
        return "REVIEW", "possible non-logo asset"
    host = urlparse(page).netloc.lower()
    if "commons.wikimedia.org" in host or "Official builder page" not in st and "Wikimedia" in st:
        return "COMMONS_OR_REFERENCE", "review attribution and brand identity"
    if "Official builder page" in st:
        return "OFFICIAL_CANDIDATE", "official source page"
    return "REVIEW", "source type not explicit"


def main() -> None:
    data = load_manifest()
    rows = [["builder", "status", "source_type", "source_domain", "image_url", "source_page", "note"]]
    for builder, entry in sorted(data.items(), key=lambda x: x[0].lower()):
        status, note = classify(entry)
        page = str(entry.get("page") or "")
        rows.append([
            builder,
            status,
            str(entry.get("source_type") or ""),
            urlparse(page).netloc,
            str(entry.get("src") or ""),
            page,
            note,
        ])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        csv.writer(f, delimiter="\t", lineterminator="\n").writerows(rows)
    print(f"Audited {len(data)} builder logo references")


if __name__ == "__main__":
    main()
