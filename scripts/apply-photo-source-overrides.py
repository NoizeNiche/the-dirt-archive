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
DIRECT_OVERRIDES = Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv")


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
                overrides.setdefault(key(builder, pedal), []).append((source_page, row_index, ""))

    direct_overrides = {}
    if DIRECT_OVERRIDES.exists():
        with DIRECT_OVERRIDES.open(newline="", encoding="utf-8") as handle:
            for row_index, row in enumerate(csv.DictReader(handle), start=1):
                builder = row.get("Builder", "").strip()
                pedal = row.get("Pedal", "").strip()
                source_page = row.get("Image Source Page", "").strip()
                image_url = row.get("Image URL", "").strip()
                if builder and pedal and source_page and image_url:
                    direct_overrides.setdefault(key(builder, pedal), []).append((source_page, image_url, row_index))

    with INDEX.open(encoding="utf-8") as handle:
        catalog = json.load(handle)

    changed = 0
    for entry in catalog.get("pedals", []):
        existing_image = str(entry.get("image") or "").strip().lower()
        # Keep already-archived local photos untouched, but continue applying
        # curated recovery leads to records whose current image is an external
        # URL. Those external links are often the very records that need a
        # second source when the host starts returning 401/403/500 responses.
        if existing_image.startswith("./assets/pedals/") or existing_image.startswith("assets/pedals/"):
            continue

        entry_key = key(entry.get("company", ""), entry.get("pedal", ""))
        override = overrides.get(entry_key)
        direct = direct_overrides.get(entry_key)
        if not override and not direct:
            continue

        # When the curated path is a source page rather than a direct image,
        # an old external runtime URL must not survive and keep winning the
        # cache lane. Remove stale Reverb CDN fields unconditionally so the
        # browser recovery pass starts from the verified page lead.
        if not direct:
            stale_image = str(entry.get("image") or "").strip()
            stale_urls = [
                str(value or "").strip()
                for value in (entry.get("image_source_urls") or [])
                if str(value or "").strip()
            ]
            stale_single = str(entry.get("image_source_url") or "").strip()
            if stale_single:
                stale_urls.append(stale_single)
            stale_reverb = "rvb-img.reverb.com" in stale_image.lower() or any(
                "rvb-img.reverb.com" in value.lower() for value in stale_urls
            )
            if stale_reverb:
                entry.pop("image_source_url", None)
                entry.pop("image_source_urls", None)
                entry.pop("image", None)

        override = override or []
        pages = list(dict.fromkeys(page for page, _, _ in override))
        if direct:
            for direct_page, _, _ in direct:
                if direct_page not in pages:
                    pages.append(direct_page)
        if direct:
            # Direct overrides are append-only research leads. The newest verified
            # lead is the one we actually want the browser to try first, otherwise
            # an old blocked/expired CDN URL can keep shadowing a newer exact photo.
            primary_page, primary_priority = direct[-1][0], 100000
        else:
            primary_page, primary_priority, _ = override[-1]
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

        direct = direct_overrides.get(key(entry.get("company", ""), entry.get("pedal", ""))) or []
        if direct:
            # Preserve manifest order so the newest curated lead remains
            # the active direct URL. Reversing before taking the last item
            # accidentally reinstated the oldest blocked CDN URL.
            direct_urls = list(dict.fromkeys(image_url for _, image_url, _ in direct))
            direct_page = direct[-1][0]
            direct_url = direct[-1][1]
            if entry.get("image_source_page") != direct_page:
                entry["image_source_page"] = direct_page
            if entry.get("image_source_url") != direct_url:
                entry["image_source_url"] = direct_url
            if entry.get("image_source_urls") != direct_urls:
                entry["image_source_urls"] = direct_urls
            if entry.get("image_source_page_verified") is not True:
                entry["image_source_page_verified"] = True
        changed += 1

    if changed:
        INDEX.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Applied {changed} curated exact photo source leads.")


if __name__ == "__main__":
    main()
