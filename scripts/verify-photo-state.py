#!/usr/bin/env python3
"""Fail-fast cross-file integrity check for the photo/research state."""

import csv
import json
import re
import sys

from PIL import Image
from pathlib import Path

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
BACKLOG = ROOT / "research/PHOTO_BACKLOG.csv"
QUEUE = ROOT / "research/PHOTO_REVIEW_QUEUE.csv"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"


def key(builder, pedal):
    return (str(builder or "").strip(), str(pedal or "").strip())


def load_identity_quarantine():
    rows = {}
    try:
        with IDENTITY_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                k = key(row.get("Builder"), row.get("Pedal"))
                url = str(row.get("Blocked Image URL") or "").strip().lower()
                if k[0] and k[1] and url:
                    rows.setdefault(k, set()).add(url)
    except Exception:
        pass
    return rows


def load_hash_quarantine():
    # Only cross-builder byte collisions are hard quarantines. Same-builder
    # collisions remain review evidence because legitimate aliases, variants,
    # and shared manufacturer photography can be byte-identical.
    rows = []
    try:
        with PHOTO_HASH_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
    except Exception:
        return set()

    builders_by_hash = {}
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        builder = str(row.get("Builder") or "").strip()
        if digest and builder:
            builders_by_hash.setdefault(digest, set()).add(builder)

    hard = set()
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        k = key(row.get("Builder"), row.get("Pedal"))
        if k[0] and k[1] and len(builders_by_hash.get(digest, set())) > 1:
            hard.add(k)
    return hard


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


def suspicious_photo_provenance(manifest_entry, catalog_entry):
    """Return hard red flags for assets that are not plausibly pedal photographs."""
    values = [
        str(manifest_entry.get("image_source_url") or ""),
        str(manifest_entry.get("image_source_page") or ""),
        str(catalog_entry.get("image_source_url") or ""),
        str(catalog_entry.get("image_source_page") or ""),
    ]
    joined = " ".join(values).lower()
    reasons = []
    try:
        policy = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        for value in values:
            lowered = str(value or "").lower()
            for rule in policy.get("rules", []):
                kind = str(rule.get("type") or "")
                pattern = str(rule.get("pattern") or "")
                if kind == "exact_url" and lowered == pattern.lower():
                    reasons.append("blocked source policy: " + (rule.get("reason") or pattern))
                elif kind == "url_regex" and pattern:
                    try:
                        if re.search(pattern, lowered, re.I):
                            reasons.append("blocked source policy: " + (rule.get("reason") or pattern))
                    except re.error:
                        pass
    except Exception:
        pass
    if re.search(r"(^|[/.?=&_-])favicon(?:\\.ico)?([/?#=&_.-]|$)", joined):
        reasons.append("favicon source")
    if re.search(r"freepnglogos\\.com", joined):
        reasons.append("logo-library source")
    if re.search(r"playground\\.com/templates/", joined):
        reasons.append("generic template source")
    if re.search(r"(^|[/_-])logo(?:\\d*)?(?:\\.[a-z0-9]+)?([/?#=&_-]|$)", joined):
        reasons.append("logo asset source")
    if re.search(r"(?:favicon|(?:^|[/_.-])(?:loading|spinner|placeholder|sprite|avatar|badge|social|widget)(?:[/_.?-]|$))", joined):
        reasons.append("site asset source")
    return reasons


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
    direct_overrides = load_csv(DIRECT_OVERRIDES) if DIRECT_OVERRIDES.exists() else []
    manual_review = load_csv(MANUAL_REVIEW) if MANUAL_REVIEW.exists() else []
    manual_verified_keys = {
        key(row.get("Builder"), row.get("Pedal"))
        for row in manual_review
        if str(row.get("Status") or "").strip().upper() == "VERIFIED_PRIMARY"
    }
    identity_quarantine = load_identity_quarantine()
    hash_quarantine = load_hash_quarantine()

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
            red_flags = suspicious_photo_provenance(manifest_entry, entry)
            if k in hash_quarantine and k not in manual_verified_keys:
                red_flags.append("byte-identical photo quarantine")
            quarantine_urls = identity_quarantine.get(k, set())
            if quarantine_urls:
                for candidate in [
                    str(entry.get("image_source_url") or ""),
                    str(manifest_entry.get("image_source_url") or ""),
                ]:
                    if candidate.strip().lower() in quarantine_urls:
                        red_flags.append("identity-specific photo quarantine: " + candidate.strip())
            if red_flags:
                raise SystemExit(
                    f"Picture=DONE has non-product photo provenance for {k}: "
                    + ", ".join(red_flags)
                )
            try:
                with Image.open(asset) as im:
                    im.verify()
                    if str(im.format or "").upper() != "WEBP":
                        raise SystemExit(
                            f"Picture=DONE local asset is not actually WebP for {k}: "
                            f"{asset} ({im.format or 'unknown format'})"
                        )
            except SystemExit:
                raise
            except Exception as exc:
                raise SystemExit(f"Picture=DONE has an unreadable local photo for {k}: {exc}")
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

    # Competing direct-image leads require an explicit manual primary review.
    # This mirrors the fast downloader's safety gate and prevents a later append
    # from becoming canonical merely because it is newer.
    direct_groups = {}
    direct_primary = {}
    for row in direct_overrides:
        k = key(row.get("Builder"), row.get("Pedal"))
        image_url = str(row.get("Image URL") or "").strip()
        if not image_url:
            continue
        direct_groups.setdefault(k, set()).add(image_url)
        if "photo review: primary" in str(row.get("Notes") or "").lower():
            direct_primary.setdefault(k, []).append(row)

    pending_keys = {
        key(row.get("Builder"), row.get("Pedal"))
        for row in tracker
        if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE"
    }
    for k, images in direct_groups.items():
        if len(images) > 1:
            primaries = direct_primary.get(k, [])
            if len(primaries) != 1 and k in pending_keys:
                raise SystemExit(
                    f"Competing direct photos require exactly one PHOTO REVIEW: PRIMARY for pending identity: {k}"
                )

    manual_keys = set()
    for row in manual_review:
        k = key(row.get("Builder"), row.get("Pedal"))
        if k in manual_keys:
            raise SystemExit(f"Duplicate manual primary review identity: {k}")
        manual_keys.add(k)
        if str(row.get("Status") or "") != "VERIFIED_PRIMARY":
            raise SystemExit(f"Unsupported manual photo review status: {k}")
        matching = [
            candidate for candidate in direct_overrides
            if key(candidate.get("Builder"), candidate.get("Pedal")) == k
            and candidate.get("Image URL") == row.get("Image URL")
            and candidate.get("Image Source Page") == row.get("Source Page")
            and "photo review: primary" in str(candidate.get("Notes") or "").lower()
        ]
        if len(matching) != 1:
            raise SystemExit(
                f"Manual photo review does not resolve to one primary override: {k}"
            )

    print(
        "Photo/research integrity check passed: "
        f"{len(tracker)} tracker rows, "
        f"{len(pending_tracker)} photo-pending, "
        f"{len(queue)} review-queue rows."
    )


if __name__ == "__main__":
    main()
