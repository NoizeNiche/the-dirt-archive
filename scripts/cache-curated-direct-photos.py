#!/usr/bin/env python3
"""Download curated exact pedal images without browser search.

This is a narrow finish-line lane. It only touches records that:
1. are still photo-pending in PRP_TRACKER.csv, and
2. have a matching row in PHOTO_DIRECT_IMAGE_OVERRIDES.csv.

The direct URL is already curator-supplied and tied to an exact source page,
so this step avoids search-engine/browser latency while keeping the existing
Pillow validation and .source -> WebP cache pipeline.
"""

from __future__ import annotations

import csv
import io
import json
import re
import urllib.request
from pathlib import Path

from PIL import Image, UnidentifiedImageError

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
DIRECT = ROOT / "research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv"
ASSET_ROOT = ROOT / "assets/pedals"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
)
TIMEOUT = 15
MIN_BYTES = 3000


def load_blocklist() -> list[tuple[str,str]]:
    try:
        data = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        return [(str(rule.get("type") or ""), str(rule.get("pattern") or "")) for rule in data.get("rules", []) if rule.get("pattern")]
    except Exception:
        return []

def blocked_photo_url(value: str, rules: list[tuple[str,str]]) -> bool:
    lowered = str(value or "").lower()
    for kind, pattern in rules:
        try:
            if kind == "exact_url" and lowered == pattern.lower():
                return True
            if kind.endswith("_regex") and re.search(pattern, lowered, re.I):
                return True
        except re.error:
            continue
    return False

def key(builder: str, pedal: str) -> tuple[str, str]:
    return builder.strip(), pedal.strip()


def slug(value: str) -> str:
    raw = str(value or "").strip().lower()
    return re.sub(r"[^a-z0-9]+", "-", raw).strip("-") or "unknown"


def is_http_image_url(value: str) -> bool:
    return bool(
        re.match(r"^https?://", value, re.I)
        and re.search(r"\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$", value, re.I)
    )


def target_path(entry: dict) -> Path:
    builder = entry.get("company") or entry.get("builder") or ""
    pedal = entry.get("pedal") or ""
    return ASSET_ROOT / slug(builder) / slug(pedal) / "primary.source"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
        data = response.read()
        content_type = str(response.headers.get("Content-Type") or "").lower()
        if not content_type.startswith("image/"):
            raise RuntimeError(f"unexpected content type: {content_type or 'missing'}")
        if len(data) < MIN_BYTES:
            raise RuntimeError(f"payload too small: {len(data)} bytes")
        return data


def validate(data: bytes) -> tuple[int, int]:
    try:
        with Image.open(io.BytesIO(data)) as image:
            width, height = image.size
            if width < 150 or height < 150:
                raise RuntimeError(f"image too small: {width}x{height}")
            image.verify()
        with Image.open(io.BytesIO(data)) as image:
            # Force a decode pass after verify. This catches truncated image
            # bodies that metadata parsing alone can accept.
            image.load()
            return image.size
    except UnidentifiedImageError as exc:
        raise RuntimeError(f"not a readable image: {exc}") from exc


def main() -> None:
    block_rules = load_blocklist()
    if not (INDEX.exists() and TRACKER.exists() and DIRECT.exists()):
        print("Direct-photo lane skipped: required archive files are missing.")
        return

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    catalog_by_key = {
        key(entry.get("company", ""), entry.get("pedal", "")): entry
        for entry in catalog.get("pedals", [])
    }

    pending = set()
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE":
                pending.add(key(row.get("Builder", ""), row.get("Pedal", "")))

    direct = {}
    with DIRECT.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            k = key(row.get("Builder", ""), row.get("Pedal", ""))
            image_url = str(row.get("Image URL") or "").strip()
            source_page = str(row.get("Image Source Page") or "").strip()
            if k in pending and image_url and source_page and is_http_image_url(image_url) and not blocked_photo_url(image_url, block_rules):
                direct.setdefault(k, []).append((image_url, source_page))

    recovered = 0
    skipped = 0
    failed = 0

    for k, rows in direct.items():
        entry = catalog_by_key.get(k)
        if not entry:
            failed += 1
            print(f"Missing catalog identity for direct photo override: {k[0]} / {k[1]}")
            continue

        target = target_path(entry)
        if target.exists():
            skipped += 1
            continue

        # Newest curated row wins. Older rows remain browser/cache fallbacks.
        image_url, source_page = rows[-1]
        try:
            data = fetch(image_url)
            width, height = validate(data)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            print(
                f"Staged exact direct photo: {k[0]} / {k[1]} "
                f"({width}x{height}) from {source_page}"
            )
            recovered += 1
        except Exception as exc:
            failed += 1
            print(f"Direct photo failed: {k[0]} / {k[1]} -> {image_url}: {exc}")

    print(
        "Curated direct-photo lane complete: "
        f"recovered={recovered}, skipped={skipped}, failed={failed}, "
        f"pending_with_direct_overrides={len(direct)}"
    )


if __name__ == "__main__":
    main()
