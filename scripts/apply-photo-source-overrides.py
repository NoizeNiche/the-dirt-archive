#!/usr/bin/env python3
"""Apply curated exact photo-source page leads to unresolved catalog records.

A curated lead is an explicitly vetted source page. The browser recovery pass
still chooses the actual rendered pedal image from that page; the verified flag
only prevents a missing builder token in the page title/H1 from rejecting an
otherwise exact source page. Newer rows in the curated source list receive a
higher priority so freshly researched exact-model leads reach hard-case recovery
before older curated records.
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
        for row_index, row in enumerate(csv.DictReader(handle), start=1):
            builder = row.get("Builder", "").strip()
            pedal = row.get("Pedal", "").strip()
            source_page = row.get("Image Source Page", "").strip()
            if builder and pedal and source_page:
                overrides.setdefault(key(builder, pedal), []).append((source_page, row_index))

    with INDEX.open(encoding="utf-8") as handle:
        catalog = json.load(handle)

    changed = 0
    for entry in catalog.get("pedals", []):
        if entry.get("image"):
            continue

        override = overrides.get(
            key(entry.get("company", ""), entry.get("pedal", ""))
        )
        if not override:
            continue

        pages = [page for page, _ in override]
        primary_page, primary_priority = override[-1]
        if entry.get("image_source_pages") != pages:
            entry["image_source_pages"] = pages
        if entry.get("image_source_page") != primary_page:
            entry["image_source_page"] = primary_page
        if entry.get("image_source_pages_verified") is not True:
            entry["image_source_pages_verified"] = True
        if entry.get("image_source_page_verified") is not True:
            entry["image_source_page_verified"] = True
        if entry.get("image_source_priority") != primary_priority:
            entry["image_source_priority"] = primary_priority
        changed += 1

    if changed:
        INDEX.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Applied {changed} curated exact photo source leads.")


if __name__ == "__main__":
    main()
