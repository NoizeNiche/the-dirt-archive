#!/usr/bin/env python3
"""Verify the manually approved photo ledger stays synchronized with direct leads.

The manual review ledger is the human/visual gate for exact pedal photos. Every
VERIFIED_PRIMARY identity must have a matching direct-photo override using the
same image URL and exact source page, while REVIEW_REVISION rows must never be
eligible for direct publication.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

MANUAL = Path("research/PHOTO_MANUAL_REVIEW.csv")
DIRECT = Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv")
INDEX = Path("research/PEDAL_INDEX.json")


def key(row: dict) -> tuple[str, str]:
    return (str(row.get("Builder") or "").strip(), str(row.get("Pedal") or "").strip())


def rows(path: Path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    manual_rows = rows(MANUAL)
    direct_rows = rows(DIRECT)

    approved: dict[tuple[str, str], dict] = {}
    review_rows: dict[tuple[str, str], dict] = {}

    for row in manual_rows:
        identity = key(row)
        status = str(row.get("Status") or "").strip().upper()
        if not identity[0] or not identity[1]:
            raise SystemExit(f"Manual review row has incomplete identity: {row}")
        if status == "VERIFIED_PRIMARY":
            if identity in approved:
                raise SystemExit(f"Duplicate VERIFIED_PRIMARY identity: {identity}")
            approved[identity] = row
        elif status == "REVIEW_REVISION":
            review_rows[identity] = row

    direct_latest: dict[tuple[str, str], dict] = {}
    for row in direct_rows:
        identity = key(row)
        if not identity[0] or not identity[1]:
            raise SystemExit(f"Direct override row has incomplete identity: {row}")
        direct_latest[identity] = row

    errors = []

    for identity, row in approved.items():
        direct = direct_latest.get(identity)
        if not direct:
            errors.append(f"VERIFIED_PRIMARY has no direct override: {identity}")
            continue
        manual_url = str(row.get("Image URL") or "").strip()
        direct_url = str(direct.get("Image URL") or "").strip()
        manual_page = str(row.get("Source Page") or "").strip()
        direct_page = str(direct.get("Image Source Page") or "").strip()
        if not manual_url or manual_url != direct_url:
            errors.append(f"Verified image URL mismatch: {identity}")
        if manual_page and direct_page and manual_page != direct_page:
            errors.append(f"Verified source-page mismatch: {identity}")

    for identity in review_rows:
        direct = direct_latest.get(identity)
        if not direct:
            continue
        # A direct row may remain as historical research, but it must never be
        # promoted while the manual ledger explicitly says the revision needs review.
        errors.append(f"REVIEW_REVISION identity still has a direct override: {identity}")

    catalog = {}
    try:
        data = json.loads(INDEX.read_text(encoding="utf-8"))
        for row in data.get("pedals", []):
            identity = (str(row.get("company") or row.get("builder") or "").strip(),
                        str(row.get("pedal") or "").strip())
            if identity[0] and identity[1]:
                catalog[identity] = row
    except Exception as exc:
        errors.append(f"Could not parse catalog for manual-photo sync: {exc}")

    verified_keys = set(approved)
    for identity, row in catalog.items():
        source_url = str(row.get("image_source_url") or "").strip()
        source_urls = [str(v or "").strip() for v in (row.get("image_source_urls") or []) if str(v or "").strip()]
        if source_url or source_urls:
            if identity not in verified_keys:
                errors.append(f"Catalog exposes unreviewed direct photo URL: {identity}")
            else:
                approved_url = str(approved[identity].get("Image URL") or "").strip()
                if source_url and source_url != approved_url:
                    errors.append(f"Catalog direct image URL differs from visually verified URL: {identity}")
                bad_extras = [value for value in source_urls if value != approved_url]
                if bad_extras:
                    errors.append(f"Catalog retains unreviewed direct image fallback URLs: {identity}")

    if errors:
        print("Photo manual-review synchronization FAILED:")
        for error in errors:
            print(" - " + error)
        raise SystemExit(1)

    print(
        "Photo manual-review synchronization passed: "
        f"{len(approved)} VERIFIED_PRIMARY, "
        f"{len(review_rows)} REVIEW_REVISION, "
        f"{len(direct_latest)} direct identities checked."
    )


if __name__ == "__main__":
    main()
