#!/usr/bin/env python3
"""Audit duplicate local pedal photos by exact file bytes.

This report is deliberately review-oriented. It does not decide that every
duplicate image is wrong because legitimate revisions, aliases, and historical
records can sometimes share a photograph.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
OUTPUT = ROOT / "research/PHOTO_DUPLICATE_REVIEW.csv"
BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"

def load_catalog():
    return json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])

def load_blocklist():
    try:
        data = json.loads(BLOCKLIST.read_text(encoding="utf-8"))
        return data.get("rules", []) if isinstance(data, dict) else []
    except Exception:
        return []

def blocked(value, rules):
    raw = str(value or "").lower()
    for rule in rules:
        kind = str(rule.get("type") or "")
        pattern = str(rule.get("pattern") or "")
        if kind == "exact_url" and raw == pattern.lower():
            return True
        if kind == "url_regex" and pattern:
            try:
                if re.search(pattern, raw, re.I):
                    return True
            except re.error:
                pass
    return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(OUTPUT))
    args = parser.parse_args()

    catalog = load_catalog()
    rules = load_blocklist()
    groups = defaultdict(list)

    for entry in catalog:
        image = str(entry.get("image") or "").strip()
        if not image or re.match(r"^https?://", image, re.I):
            continue
        relative = image[2:] if image.startswith("./") else image
        if not relative.startswith("assets/pedals/"):
            continue
        path = ROOT / relative
        if not path.is_file():
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        groups[digest].append((entry, relative, path.stat().st_size))

    rows = []
    for digest, entries in groups.items():
        if len(entries) < 2:
            continue
        builders = {str(e.get("company") or "").strip() for e, _, _ in entries}
        source_urls = [str(e.get("image_source_url") or "").strip() for e, _, _ in entries if e.get("image_source_url")]
        shared_source_urls = [u for u, count in Counter(source_urls).items() if count > 1]
        pages = [str(e.get("image_source_page") or e.get("source_page") or "").strip() for e, _, _ in entries if e.get("image_source_page") or e.get("source_page")]
        shared_pages = [u for u, count in Counter(pages).items() if count > 1]

        flags = []
        if any(blocked(e.get("image_source_url"), rules) for e, _, _ in entries):
            flags.append("BLOCKLISTED_SOURCE")
        if shared_source_urls:
            flags.append("EXACT_SOURCE_REUSED")
        if len(builders) > 1:
            flags.append("CROSS_BUILDER")
        if any(size < 3000 for _, _, size in entries):
            flags.append("TINY_ASSET")
        if len(shared_pages) > 0 and not shared_source_urls:
            flags.append("SHARED_SOURCE_PAGE")

        record_text = " | ".join(
            f"{e.get('company','')} / {e.get('pedal','')}"
            for e, _, _ in sorted(entries, key=lambda x: (str(x[0].get('company') or ''), str(x[0].get('pedal') or '')))
        )
        rows.append({
            "SHA256": digest,
            "Size Bytes": entries[0][2],
            "Record Count": len(entries),
            "Builder Count": len(builders),
            "Shared Source URL Count": len(shared_source_urls),
            "Shared Source Page Count": len(shared_pages),
            "Flags": "; ".join(flags) or "REVIEW",
            "Records": record_text,
        })

    rows.sort(key=lambda r: (-int(r["Record Count"]), int(r["Size Bytes"]), r["Records"]))

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    fields = ["SHA256","Size Bytes","Record Count","Builder Count","Shared Source URL Count","Shared Source Page Count","Flags","Records"]
    with output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(
        f"Duplicate photo audit: {len(rows)} duplicate byte groups across "
        f"{sum(int(r['Record Count']) for r in rows)} catalog records."
    )
    print(
        "High-priority groups:",
        sum("BLOCKLISTED_SOURCE" in r["Flags"] for r in rows),
        "blocklisted-source;",
        sum("CROSS_BUILDER" in r["Flags"] for r in rows),
        "cross-builder;"
    )
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
