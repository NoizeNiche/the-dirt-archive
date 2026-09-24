#!/usr/bin/env python3
"""Clear known-invalid local photo state before a recovery pass.

This utility only resets records that are still Picture=NEEDED in the live
tracker and whose existing local photo provenance is one of the archive's
known non-product classes. Curated source-page leads are preserved so the next
browser recovery pass can retry them.
"""

import csv
import json
import os
import re
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")
TRACKER = Path("research/PRP_TRACKER.csv")

TARGET_BUILDER = os.environ.get("PHOTO_RESET_TARGET_BUILDER", "").strip()
TARGET_PEDAL = os.environ.get("PHOTO_RESET_TARGET_PEDAL", "").strip()


def key(builder, pedal):
    return (str(builder or "").strip(), str(pedal or "").strip())


def is_local_image(value):
    value = str(value or "").strip()
    if not value or re.match(r"^https?://", value, re.I):
        return False
    normalized = value[2:] if value.startswith("./") else value
    return normalized.startswith("assets/pedals/")


def suspicious_values(entry):
    values = [
        str(entry.get("image_source_url") or ""),
        str(entry.get("image_source_page") or ""),
    ]
    values.extend(str(value or "") for value in (entry.get("image_source_urls") or []))
    values.extend(str(value or "") for value in (entry.get("image_source_pages") or []))
    joined = " ".join(values).lower()
    reasons = []
    if re.search(r"(^|[/.?=&_-])favicon(?:\\.ico)?([/?#=&_.-]|$)", joined):
        reasons.append("favicon source")
    if re.search(r"freepnglogos\\.com", joined):
        reasons.append("logo-library source")
    if re.search(r"playground\\.com/templates/", joined):
        reasons.append("generic template source")
    if re.search(r"(^|[/_-])logo(?:\\d*)?(?:\\.[a-z0-9]+)?([/?#=&_-]|$)", joined):
        reasons.append("logo asset source")
    return reasons


def clear_entry(entry, role):
    image = entry.get("image")
    removed_files = []

    if is_local_image(image):
        asset = Path(str(image)[2:] if str(image).startswith("./") else str(image))
        for candidate in (asset, asset.with_suffix(".source")):
            if candidate.exists() and candidate.is_file():
                candidate.unlink()
                removed_files.append(str(candidate))

    entry.pop("image", None)
    entry.pop("image_source_url", None)
    entry.pop("image_source_urls", None)
    return removed_files


def main():
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker_rows = list(csv.DictReader(handle))

    if TARGET_BUILDER or TARGET_PEDAL:
        targets = {
            (TARGET_BUILDER, TARGET_PEDAL),
        }
    else:
        targets = {
            key(row.get("Builder"), row.get("Pedal"))
            for row in tracker_rows
            if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE"
        }

    catalog_map = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog.get("pedals", [])
    }
    manifest_map = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in manifest
    }

    reset = 0
    removed = []
    for target_key in sorted(targets):
        entry = catalog_map.get(target_key)
        if not entry:
            continue
        tracker = next(
            (
                row
                for row in tracker_rows
                if key(row.get("Builder"), row.get("Pedal")) == target_key
            ),
            None,
        )
        if not tracker or tracker.get("Picture") == "DONE":
            continue

        reasons = suspicious_values(entry)
        manifest_entry = manifest_map.get(target_key)
        if not reasons and manifest_entry:
            reasons = suspicious_values(manifest_entry)

        if not reasons:
            continue

        files = clear_entry(entry, "catalog")
        if manifest_entry is not None:
            files.extend(clear_entry(manifest_entry, "manifest"))

        reset += 1
        removed.extend(files)
        print(
            f"Reset invalid photo state for {target_key[0]} / {target_key[1]}: "
            + ", ".join(reasons)
        )

    if reset:
        INDEX.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        MANIFEST.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Reset {reset} invalid photo records; removed {len(removed)} local files.")


if __name__ == "__main__":
    main()
