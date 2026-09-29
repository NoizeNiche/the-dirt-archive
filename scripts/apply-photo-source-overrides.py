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
import re
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
OVERRIDES = Path("research/PHOTO_SOURCE_OVERRIDES.csv")
DIRECT_OVERRIDES = Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv")
MANUAL_REVIEW = Path("research/PHOTO_MANUAL_REVIEW.csv")


def key(builder: str, pedal: str) -> tuple[str, str]:
    return (builder.strip(), pedal.strip())

def is_known_site_asset(value: str) -> bool:
    haystack = str(value or "").strip().lower()
    return bool(
        re.search(r"(^|[/.?=&_-])favicon(?:\\.ico)?([/?#=&_.-]|$)", haystack)
        or "freepnglogos.com" in haystack
        or "playground.com/templates/" in haystack
        or re.search(r"(^|[/_-])logo(?:\\d*)?(?:\\.[a-z0-9]+)?([/?#=&_-]|$)", haystack)
        or re.search(r"(?:^|[/.?=&_-])(?:loading|spinner|placeholder|sprite|avatar|badge|social|widget)(?:[/.?#=&_-]|$)", haystack)
    )


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

    manual_verified = {}
    if MANUAL_REVIEW.exists():
        with MANUAL_REVIEW.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                if str(row.get("Status") or "").strip().upper() != "VERIFIED_PRIMARY":
                    continue
                builder = row.get("Builder", "").strip()
                pedal = row.get("Pedal", "").strip()
                image_url = row.get("Image URL", "").strip()
                source_page = row.get("Source Page", "").strip()
                if builder and pedal:
                    manual_verified[key(builder, pedal)] = (source_page, image_url)

    direct_overrides = {}
    if DIRECT_OVERRIDES.exists():
        with DIRECT_OVERRIDES.open(newline="", encoding="utf-8") as handle:
            for row_index, row in enumerate(csv.DictReader(handle), start=1):
                builder = row.get("Builder", "").strip()
                pedal = row.get("Pedal", "").strip()
                source_page = row.get("Image Source Page", "").strip()
                image_url = row.get("Image URL", "").strip()
                if builder and pedal and source_page and image_url:
                    notes = row.get("Notes", "").strip()
                    direct_overrides.setdefault(key(builder, pedal), []).append((source_page, image_url, row_index, notes))

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
            stale_bad_asset = is_known_site_asset(stale_image) or any(
                is_known_site_asset(value) for value in stale_urls
            )
            stale_reverb = "rvb-img.reverb.com" in stale_image or any(
                "rvb-img.reverb.com" in value.lower() for value in stale_urls
            )
            if stale_bad_asset or stale_reverb:
                entry.pop("image_source_url", None)
                entry.pop("image_source_urls", None)
                entry.pop("image", None)

        override = override or []
        pages = list(dict.fromkeys(page for page, _, _ in override))
        if direct:
            for direct_page, _, _, _ in direct:
                if direct_page not in pages:
                    pages.append(direct_page)
        if direct:
            # A newer marketplace photograph is not automatically a better
            # historical representative. When competing direct leads exist,
            # require an explicit PHOTO REVIEW: PRIMARY marker before exposing
            # a direct URL to the fast publication lane.
            reviewed = [
                row for row in direct
                if entry_key in manual_verified
                and manual_verified[entry_key][1]
                and row[1] == manual_verified[entry_key][1]
                and "photo review: primary" in str(row[3] or "").lower()
            ]
            if not reviewed:
                matching_manual = [
                    row for row in direct
                    if entry_key in manual_verified
                    and manual_verified[entry_key][1]
                    and row[1] == manual_verified[entry_key][1]
                ]
                reviewed = matching_manual[-1:] if matching_manual else []
            if reviewed:
                primary = reviewed[-1]
                primary_page, primary_priority = primary[0], 1000000
            elif direct:
                primary_page, primary_priority = direct[-1][0], 50000
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
            # Keep the newest curated lead first because the browser
            # recovery worker intentionally bounds direct-image retries.
            # Older rows remain as fallbacks, but must not crowd the newest
            # verified image out of the first retry window.
            manual_image = manual_verified.get(entry_key, ("", ""))[1]
            reviewed = [
                row for row in direct
                if manual_image and row[1] == manual_image
            ]
            if reviewed:
                primary = reviewed[-1]
                direct_urls = list(dict.fromkeys(
                    image_url for _, image_url, _, _ in reversed(reviewed)
                ))
                direct_page = primary[0]
                direct_url = primary[1]
            else:
                # Unreviewed direct URLs remain research leads only. Do not expose
                # them as catalog image_source_url fields that the browser lane can
                # treat as high-confidence direct images.
                direct_urls = []
                direct_page = direct[-1][0]
                direct_url = ""
            if entry.get("image_source_page") != direct_page:
                entry["image_source_page"] = direct_page
            if direct_url:
                if entry.get("image_source_url") != direct_url:
                    entry["image_source_url"] = direct_url
            else:
                entry.pop("image_source_url", None)
            if entry.get("image_source_urls") != direct_urls:
                if direct_urls:
                    entry["image_source_urls"] = direct_urls
                else:
                    entry.pop("image_source_urls", None)
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
