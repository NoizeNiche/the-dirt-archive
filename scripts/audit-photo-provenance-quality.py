#!/usr/bin/env python3
"""Report pictured pedal photos with weak source-page provenance.

This is intentionally review-only. It never declares a photo wrong from URL
shape alone. Exact-model sources are separated from generic builder/category/
article sources so human visual review can focus on the weakest provenance.
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
MANUAL = ROOT / "research/PHOTO_MANUAL_REVIEW.csv"
OUTPUT = ROOT / "research/PHOTO_PROVENANCE_REVIEW.csv"


def key(builder: str, pedal: str) -> tuple[str, str]:
    return str(builder or "").strip(), str(pedal or "").strip()


def classify(url: str) -> str:
    raw = str(url or "").strip()
    if not raw:
        return "NO_SOURCE"
    try:
        parsed = urlparse(raw)
        host = parsed.hostname.lower() if parsed.hostname else ""
        parts = [part for part in parsed.path.lower().split("/") if part]
    except Exception:
        return "INVALID_SOURCE"

    if "effectsdatabase.com" in host:
        if parts[:1] == ["model"] and len(parts) >= 3:
            return "EXACT_MODEL_PAGE"
        if parts[:1] == ["model"] and len(parts) == 2:
            return "GENERIC_BUILDER_PAGE"
        if any(part in {"type", "taxonomy", "tag", "category", "categories", "brand", "brands"} for part in parts):
            return "GENERIC_CATEGORY_PAGE"
        if any(part in {"blog", "news", "article", "articles", "review", "reviews"} for part in parts):
            return "ARTICLE_PAGE"

    if "reverb.com" in host:
        if "item" in parts:
            return "EXACT_MARKETPLACE_LISTING"
        return "GENERIC_MARKETPLACE_PAGE"

    if any(part in {"product", "products", "pedal", "pedals", "model", "models", "gear", "stompbox"} for part in parts):
        return "PRODUCT_LIKE_PAGE"

    if any(part in {"blog", "news", "article", "articles", "review", "reviews", "guide", "guides"} for part in parts):
        return "ARTICLE_PAGE"

    if any(part in {"shop", "store", "collections", "collection", "catalog", "catalogue", "brands", "categories"} for part in parts):
        return "GENERIC_STORE_PAGE"

    return "OTHER_PAGE"


def main() -> int:
    catalog = json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])
    catalog_by_key = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog
    }

    manual = set()
    if MANUAL.exists():
        with MANUAL.open(newline="", encoding="utf-8") as handle:
            manual = {
                key(row.get("Builder"), row.get("Pedal"))
                for row in csv.DictReader(handle)
                if str(row.get("Status") or "").strip().upper() == "VERIFIED_PRIMARY"
            }

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker = list(csv.DictReader(handle))

    rows = []
    counts = {}
    for track in tracker:
        if str(track.get("Picture") or "").strip().upper() != "DONE":
            continue
        identity = key(track.get("Builder"), track.get("Pedal"))
        entry = catalog_by_key.get(identity)
        if not entry:
            continue
        source_page = str(entry.get("image_source_page") or "").strip()
        quality = classify(source_page)
        counts[quality] = counts.get(quality, 0) + 1
        status = "PASS"
        reason = ""
        if identity not in manual and quality not in {"EXACT_MODEL_PAGE", "EXACT_MARKETPLACE_LISTING", "PRODUCT_LIKE_PAGE"}:
            status = "REVIEW"
            reason = "pictured record uses non-exact or missing source-page provenance"
        rows.append({
            "Builder": identity[0],
            "Pedal": identity[1],
            "Status": status,
            "Source Quality": quality,
            "Image Source Page": source_page,
            "Manually Verified": "YES" if identity in manual else "NO",
            "Reason": reason,
        })

    rows.sort(key=lambda row: (row["Status"] != "REVIEW", row["Builder"].lower(), row["Pedal"].lower()))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "Builder", "Pedal", "Status", "Source Quality",
            "Image Source Page", "Manually Verified", "Reason"
        ])
        writer.writeheader()
        writer.writerows(rows)

    review = sum(1 for row in rows if row["Status"] == "REVIEW")
    print(
        "Photo provenance audit: "
        f"{len(rows)} pictured records checked, {review} weak-provenance review candidates. "
        f"Quality counts={counts}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
