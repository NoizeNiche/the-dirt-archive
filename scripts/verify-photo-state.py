#!/usr/bin/env python3
"""Fail-fast cross-file integrity check for the photo/research state."""

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
BACKLOG = ROOT / "research/PHOTO_BACKLOG.csv"
QUEUE = ROOT / "research/PHOTO_REVIEW_QUEUE.csv"


def key(builder, pedal):
    return (str(builder or "").strip(), str(pedal or "").strip())


def local_asset(image):
    value = str(image or "").strip()
    if not value or re.match(r"^https?://", value, re.I):
        return None
    normalized = value[2:] if value.startswith("./") else value
    if not normalized.startswith("assets/pedals/"):
        return None
    return ROOT / normalized


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise SystemExit(f"Could not parse {path}: {exc}")


def as_rows(data, label):
    if isinstance(data, dict):
        for field in ("pedals", "images", "entries", "data"):
            if isinstance(data.get(field), list):
                return data[field]
    if isinstance(data, list):
        return data
    raise SystemExit(f"{label} does not contain a supported row list")


def load_csv(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def require_unique(rows, label):
    seen = set()
    for row in rows:
        k = key(row.get("Builder") or row.get("builder") or row.get("Company") or row.get("company"),
                row.get("Pedal") or row.get("pedal"))
        if k in seen:
            raise SystemExit(f"Duplicate identity in {label}: {k}")
        seen.add(k)
    return seen


def main():
    tracker = load_csv(TRACKER)
    backlog = load_csv(BACKLOG)
    queue = load_csv(QUEUE)

    index_data = load_json(INDEX)
    manifest_data = load_json(MANIFEST)
    catalog = as_rows(index_data, "PEDAL_INDEX.json")
    manifest = as_rows(manifest_data, "PEDAL_IMAGES.json")

    tracker_keys = require_unique(tracker, "PRP_TRACKER.csv")
    catalog_keys = set()
    catalog_by_key = {}
    for row in catalog:
        k = key(row.get("company") or row.get("builder"), row.get("pedal"))
        if k in catalog_keys:
            raise SystemExit(f"Duplicate identity in PEDAL_INDEX.json: {k}")
        catalog_keys.add(k)
        catalog_by_key[k] = row

    manifest_keys = set()
    manifest_by_key = {}
    for row in manifest:
        k = key(row.get("company") or row.get("builder"), row.get("pedal"))
        if k in manifest_keys:
            raise SystemExit(f"Duplicate identity in PEDAL_IMAGES.json: {k}")
        manifest_keys.add(k)
        manifest_by_key[k] = row

    missing_catalog = sorted(tracker_keys - catalog_keys)
    if missing_catalog:
        raise SystemExit(f"Tracker identities missing from catalog: {missing_catalog[:8]}")

    missing_manifest = sorted(tracker_keys - manifest_keys)
    if missing_manifest:
        raise SystemExit(f"Tracker identities missing from photo manifest: {missing_manifest[:8]}")

    pending_tracker = set()
    for row in tracker:
        k = key(row.get("Builder"), row.get("Pedal"))
        entry = catalog_by_key[k]
        manifest_entry = manifest_by_key[k]
        image = str(entry.get("image") or "").strip()
        manifest_image = str(manifest_entry.get("image") or "").strip()
        picture_done = row.get("Picture") == "DONE"

        if picture_done:
            asset = local_asset(image)
            if asset is None or not asset.is_file():
                raise SystemExit(f"Picture=DONE without a local asset: {k} -> {image}")
            if manifest_image != image:
                raise SystemExit(f"Catalog/manifest image mismatch: {k} -> {image} vs {manifest_image}")
        else:
            pending_tracker.add(k)
            asset = local_asset(image)
            if asset is not None and asset.is_file():
                raise SystemExit(f"Picture=NEEDED but local catalog asset exists: {k} -> {image}")
            if image and not re.match(r"^https?://", image, re.I) and asset is not None:
                raise SystemExit(f"Catalog points at a missing local image: {k} -> {image}")
            if manifest_image and re.match(r"^https?://", manifest_image, re.I):
                pass
            elif manifest_image:
                manifest_asset = local_asset(manifest_image)
                if manifest_asset is None:
                    raise SystemExit(f"Unsupported manifest image path: {k} -> {manifest_image}")
                if manifest_asset.is_file():
                    raise SystemExit(f"Photo manifest has a local asset while tracker is unresolved: {k}")

    backlog_keys = require_unique(backlog, "PHOTO_BACKLOG.csv")
    queue_keys = require_unique(queue, "PHOTO_REVIEW_QUEUE.csv") if queue else set()

    if backlog_keys != pending_tracker:
        missing = sorted(pending_tracker - backlog_keys)
        stale = sorted(backlog_keys - pending_tracker)
        raise SystemExit(f"PHOTO_BACKLOG mismatch: missing={missing[:8]} stale={stale[:8]}")

    stale_queue = sorted(queue_keys - pending_tracker)
    if stale_queue:
        raise SystemExit(f"Photo review queue contains resolved identities: {stale_queue[:8]}")

    for row in queue:
        status = row.get("Status", "")
        if status not in {"DEEP_REVIEW", "PARKED"}:
            raise SystemExit(f"Unsupported photo review status: {row.get('Builder')} / {row.get('Pedal')} -> {status}")

    print(
        "Photo/research integrity check passed: "
        f"{len(tracker)} tracker rows, "
        f"{len(pending_tracker)} photo-pending, "
        f"{len(queue)} review-queue rows."
    )


if __name__ == "__main__":
    main()
