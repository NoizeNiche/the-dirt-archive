#!/usr/bin/env python3
"""Quarantine high-confidence contaminated pedal photos.

Reads a photo-content audit CSV, removes only high-confidence unusable or
non-product images from the canonical catalog, preserves the research record,
rebuilds the photo manifest/tracker, and records the quarantined identities for review.

This script intentionally does not replace an image with a guess. A quarantined
record becomes photo-needed, the photo backlog is rebuilt, and it returns to
the normal recovery lane.
"""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
from pathlib import Path

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
QUARANTINE = ROOT / "research/PHOTO_CONTENT_QUARANTINE.csv"

HIGH_PREFIXES = (
    "donation_or_platform_overlay:",
    "known_blocked_image_hash",
    "blocked_provenance:",
    "tiny_file",
    "tiny_dimensions",
    "unreadable_image:",
    "fully_or_nearly_transparent",
)

def load_audit(path: Path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("audit_csv")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    audit = load_audit(Path(args.audit_csv))
    flagged = [
        row for row in audit
        if any(flag.strip().startswith(HIGH_PREFIXES) for flag in str(row.get("Flags") or "").split(";"))
    ]
    if not flagged:
        print("No high-confidence photo contamination found.")
        return 0

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    by_key = {(x.get("company"), x.get("pedal")): x for x in catalog.get("pedals", [])}

    quarantined = []
    missing = []
    for row in flagged:
        key = (row.get("Builder", ""), row.get("Pedal", ""))
        entry = by_key.get(key)
        if not entry:
            missing.append(key)
            continue
        image = str(entry.get("image") or "").strip()
        if not image:
            continue
        quarantined.append({
            "Builder": key[0],
            "Pedal": key[1],
            "Image": image,
            "Image Source URL": entry.get("image_source_url") or "",
            "Image Source Page": entry.get("image_source_page") or entry.get("source_page") or "",
            "Reason": row.get("Flags", ""),
        })
        if args.dry_run:
            continue
        entry["image"] = None
        entry.pop("image_source_url", None)
        entry.pop("image_source_pages", None)
        entry.pop("image_source_page_verified", None)
        entry.pop("image_source_pages_verified", None)

    if missing:
        print("Audit rows without canonical catalog identity:", missing[:20])

    if args.dry_run:
        for row in quarantined:
            print("QUARANTINE:", row)
        return 0

    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    prior = []
    if QUARANTINE.is_file():
        with QUARANTINE.open(newline="", encoding="utf-8") as handle:
            prior = list(csv.DictReader(handle))
    seen = {(r.get("Builder"), r.get("Pedal"), r.get("Image")) for r in prior}
    for row in quarantined:
        marker = (row["Builder"], row["Pedal"], row["Image"])
        if marker not in seen:
            prior.append(row)
            seen.add(marker)

    with QUARANTINE.open("w", newline="", encoding="utf-8") as handle:
        fields = ["Builder","Pedal","Image","Image Source URL","Image Source Page","Reason"]
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(prior)

    # Rebuild the derived mirror/tracker through their canonical owners.
    subprocess.run(["python", "scripts/sync_prp_catalog.py"], check=True)
    subprocess.run(["python", "scripts/sync-prp-tracker.py"], check=True)
    subprocess.run(["python", "scripts/sync-photo-backlog.py"], check=True)

    # Remove quarantined local assets only when no other catalog identity owns
    # the exact same path.
    remaining_paths = {
        str(x.get("image") or "").strip().lstrip("./")
        for x in catalog.get("pedals", [])
        if x.get("image")
    }
    removed = 0
    for row in quarantined:
        rel = str(row["Image"]).lstrip("./")
        path = ROOT / rel
        if rel not in remaining_paths and path.is_file():
            path.unlink()
            removed += 1

    print(f"Quarantined {len(quarantined)} contaminated photo record(s); removed {removed} orphaned local asset(s).")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
