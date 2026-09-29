#!/usr/bin/env python3
"""Build a review roster for same-builder byte-identical pedal photos.

Cross-builder collisions remain hard quarantine candidates. Same-builder
collisions are intentionally review-only because aliases, variants, and shared
manufacturer photography can legitimately use identical bytes.
"""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

ROOT = Path(".")
HASH_QUARANTINE = ROOT / "research/PHOTO_HASH_QUARANTINE.csv"
OUTPUT = ROOT / "research/PHOTO_HASH_REVIEW.csv"


def main() -> None:
    if not HASH_QUARANTINE.exists():
        OUTPUT.write_text(
            "Builder,Pedal,Image Path,Blob SHA256,Source URL,Source Page,Review Reason\n",
            encoding="utf-8",
        )
        print("Photo hash review: source quarantine ledger missing; wrote empty roster.")
        return

    with HASH_QUARANTINE.open(newline="", encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))

    grouped = defaultdict(list)
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        builder = str(row.get("Builder") or "").strip()
        if digest and builder:
            grouped[digest].append(row)

    review_rows = []
    for digest, group in grouped.items():
        builders = {str(row.get("Builder") or "").strip() for row in group}
        if len(builders) != 1:
            continue

        pedals = {str(row.get("Pedal") or "").strip() for row in group}
        if len(pedals) <= 1:
            continue

        source_pages = {str(row.get("Source Page") or "").strip() for row in group if row.get("Source Page")}
        for row in group:
            review_rows.append({
                "Builder": row.get("Builder") or "",
                "Pedal": row.get("Pedal") or "",
                "Image Path": row.get("Image Path") or "",
                "Blob SHA256": digest,
                "Source URL": row.get("Source URL") or "",
                "Source Page": row.get("Source Page") or "",
                "Review Reason": (
                    "Same-builder byte-identical photo shared across "
                    + str(len(pedals))
                    + " distinct catalog identities"
                    + ("; source page shared" if len(source_pages) == 1 else "; source pages differ")
                ),
            })

    review_rows.sort(key=lambda r: (r["Builder"].lower(), r["Pedal"].lower()))
    headers = [
        "Builder", "Pedal", "Image Path", "Blob SHA256",
        "Source URL", "Source Page", "Review Reason"
    ]
    with OUTPUT.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=headers)
        writer.writeheader()
        writer.writerows(review_rows)

    groups_count = sum(
        1
        for group in grouped.values()
        if len({str(row.get("Builder") or "").strip() for row in group}) == 1
        and len({str(row.get("Pedal") or "").strip() for row in group}) > 1
    )
    print(f"Photo hash review: {len(review_rows)} records across {groups_count} same-builder collision groups.")


if __name__ == "__main__":
    main()
