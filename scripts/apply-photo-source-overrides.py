#!/usr/bin/env python3
"""Apply curated exact photo-source page leads to unresolved catalog records.

This layer only supplies a source page. The browser recovery pass still performs
its normal page-identity checks and downloads the actual image itself.
"""

import csv
import json
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
OVERRIDES = Path("research/PHOTO_SOURCE_OVERRIDES.csv")


def key(builder: str, pedal: str) -> tuple[str, str]:
    return (builder.strip(), pedal.strip())


def main() -> None:
    if not INDEX.exists() or not OVERRIDES.exists():
        return

    overrides = {}
    with OVERRIDES.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            builder = row.get("Builder", "").strip()
            pedal = row.get("Pedal", "").strip()
            source_page = row.get("Image Source Page", "").strip()
            if builder and pedal and source_page:
                overrides[key(builder, pedal)] = source_page

    with INDEX.open(encoding="utf-8") as handle:
        catalog = json.load(handle)

    changed = 0
    for entry in catalog.get("pedals", []):
        if entry.get("image"):
            continue

        source_page = overrides.get(
            key(entry.get("company", ""), entry.get("pedal", ""))
        )
        if not source_page:
            continue

        if entry.get("image_source_page") == source_page:
            continue

        entry["image_source_page"] = source_page
        changed += 1

    if changed:
        INDEX.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Applied {changed} curated exact photo source leads.")


if __name__ == "__main__":
    main()
