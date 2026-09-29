#!/usr/bin/env python3
"""Clear known-invalid local photo state before a recovery pass.

The utility preserves healthy pictured records. It resets only records with
known non-product provenance or a missing local asset, whether the tracker
currently says Picture=NEEDED or Picture=DONE. Curated source-page leads are
preserved so the next browser recovery pass can retry them.
"""

import csv
import json
import os
import re

from PIL import Image

from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")
TRACKER = Path("research/PRP_TRACKER.csv")
PHOTO_SOURCE_BLOCKLIST = Path("research/PHOTO_SOURCE_BLOCKLIST.json")
PHOTO_IDENTITY_QUARANTINE = Path("research/PHOTO_IDENTITY_QUARANTINE.csv")
PHOTO_HASH_QUARANTINE = Path("research/PHOTO_HASH_QUARANTINE.csv")

TARGET_BUILDER = os.environ.get("PHOTO_RESET_TARGET_BUILDER", "").strip()
TARGET_PEDAL = os.environ.get("PHOTO_RESET_TARGET_PEDAL", "").strip()


def key(builder, pedal):
    return (str(builder or "").strip(), str(pedal or "").strip())


def blocked_photo_values(values):
    try:
        policy = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
    except Exception:
        return []
    reasons = []
    for value in values:
        lowered = str(value or "").strip().lower()
        if not lowered:
            continue
        for rule in policy.get("rules", []):
            kind = str(rule.get("type") or "")
            pattern = str(rule.get("pattern") or "")
            try:
                if kind == "exact_url" and lowered == pattern.lower():
                    reasons.append(str(rule.get("reason") or pattern))
                elif kind.endswith("_regex") and pattern and re.search(pattern, lowered, re.I):
                    reasons.append(str(rule.get("reason") or pattern))
            except re.error:
                continue
    return list(dict.fromkeys(reasons))


def load_identity_quarantine():
    rows = {}
    try:
        with PHOTO_IDENTITY_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                k = key(row.get("Builder"), row.get("Pedal"))
                url = str(row.get("Blocked Image URL") or "").strip().lower()
                if k[0] and k[1] and url:
                    rows.setdefault(k, set()).add(url)
    except Exception:
        pass
    return rows


def identity_quarantine_reasons(identity, values, quarantine):
    blocked = quarantine.get(identity, set())
    if not blocked:
        return []
    reasons = []
    for value in values:
        lowered = str(value or "").strip().lower()
        if lowered and lowered in blocked:
            reasons.append("identity-specific photo quarantine: " + lowered)
    return list(dict.fromkeys(reasons))


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


def is_local_image(value):
    value = str(value or "").strip()
    if not value or re.match(r"^https?://", value, re.I):
        return False
    normalized = value[2:] if value.startswith("./") else value
    return normalized.startswith("assets/pedals/")


def suspicious_values(entry):
    values = [
        str(entry.get("image_source_url") or ""),
        str(entry.get("image_source_page") or ""),
    ]
    values.extend(str(value or "") for value in (entry.get("image_source_urls") or []))
    values.extend(str(value or "") for value in (entry.get("image_source_pages") or []))
    joined = " ".join(values).lower()
    reasons = []
    if re.search(r"(^|[/.?=&_-])favicon(?:\\.ico)?([/?#=&_.-]|$)", joined):
        reasons.append("favicon source")
    if re.search(r"freepnglogos\\.com", joined):
        reasons.append("logo-library source")
    if re.search(r"playground\\.com/templates/", joined):
        reasons.append("generic template source")
    if re.search(r"(^|[/_-])logo(?:\\d*)?(?:\\.[a-z0-9]+)?([/?#=&_-]|$)", joined):
        reasons.append("logo asset source")
    if re.search(r"(?:favicon|(?:^|[/.?=&_-])(?:loading|spinner|placeholder|sprite|avatar|badge|social|widget)(?:[/.?#=&_-]|$))", joined):
        reasons.append("site asset source")
    return reasons


def clear_entry(entry, role, preserve_file=False):
    image = entry.get("image")
    removed_files = []

    if is_local_image(image) and not preserve_file:
        asset = Path(str(image)[2:] if str(image).startswith("./") else str(image))
        for candidate in (asset, asset.with_suffix(".source")):
            if candidate.exists() and candidate.is_file():
                candidate.unlink()
                removed_files.append(str(candidate))

    entry.pop("image", None)
    entry.pop("image_source_url", None)
    entry.pop("image_source_urls", None)
    return removed_files


def main():
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker_rows = list(csv.DictReader(handle))

    if TARGET_BUILDER or TARGET_PEDAL:
        targets = {
            (TARGET_BUILDER, TARGET_PEDAL),
        }
    else:
        targets = {
            key(row.get("Builder"), row.get("Pedal"))
            for row in tracker_rows
            if row.get("Pedal Info") == "DONE"
        }

    catalog_map = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog.get("pedals", [])
    }
    manifest_map = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in manifest
    }

    identity_quarantine = load_identity_quarantine()
    manual_review = set()
    try:
        with (Path("research/PHOTO_MANUAL_REVIEW.csv")).open(newline="", encoding="utf-8") as handle:
            manual_review = {
                key(row.get("Builder"), row.get("Pedal"))
                for row in csv.DictReader(handle)
                if str(row.get("Status") or "").strip().upper() == "VERIFIED_PRIMARY"
            }
            # Direct overrides explicitly marked as PHOTO REVIEW: PRIMARY are
            # equivalent manual evidence for quarantine/recovery safety.
            try:
                with Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv").open(newline="", encoding="utf-8") as direct_handle:
                    for direct_row in csv.DictReader(direct_handle):
                        if "photo review: primary" in str(direct_row.get("Notes") or "").lower():
                            db = str(direct_row.get("Builder") or "").strip()
                            dp = str(direct_row.get("Pedal") or "").strip()
                            if db and dp:
                                manual_review.add(key(db, dp))
            except Exception:
                pass
    except Exception:
        pass
    hash_quarantine = load_hash_quarantine()
    reset = 0
    removed = []
    for target_key in sorted(targets):
        entry = catalog_map.get(target_key)
        if not entry:
            continue
        tracker = next(
            (
                row
                for row in tracker_rows
                if key(row.get("Builder"), row.get("Pedal")) == target_key
            ),
            None,
        )
        if not tracker:
            continue

        reasons = suspicious_values(entry)
        manifest_entry = manifest_map.get(target_key)
        if not reasons and manifest_entry:
            reasons = suspicious_values(manifest_entry)

        source_values = [
            str(entry.get("image_source_url") or ""),
            str(entry.get("image_source_page") or ""),
        ]
        source_values.extend(str(value or "") for value in (entry.get("image_source_urls") or []))
        source_values.extend(str(value or "") for value in (entry.get("image_source_pages") or []))
        if not reasons:
            reasons.extend(identity_quarantine_reasons(target_key, source_values, identity_quarantine))
        if not reasons and target_key in hash_quarantine and target_key not in manual_review:
            reasons.append("byte-identical photo quarantine")
        if not reasons:
            blocked = blocked_photo_values(source_values)
            if blocked:
                reasons.extend("blocked photo source: " + reason for reason in blocked)

        image = entry.get("image")
        if not reasons and tracker.get("Picture") == "DONE" and is_local_image(image):
            asset = Path(str(image)[2:] if str(image).startswith("./") else str(image))
            if not asset.is_file():
                reasons.append("missing local photo")
            else:
                try:
                    with Image.open(asset) as im:
                        image_format = str(im.format or "").upper()
                        im.verify()
                    if image_format != "WEBP":
                        reasons.append(f"local photo is not WebP ({image_format or 'unknown format'})")
                except Exception as exc:
                    reasons.append("unreadable local photo: " + str(exc))
        if not reasons:
            continue

        # Duplicate/case-variant catalog identities can legitimately share a
        # canonical asset path. Never delete that physical asset when another
        # identity at the same path has a verified manual primary.
        shared_verified_asset = False
        if is_local_image(image):
            sibling_keys = {
                key(row.get("company") or row.get("builder"), row.get("pedal"))
                for row in catalog.get("pedals", [])
                if row is not entry and row.get("image") == image
            }
            shared_verified_asset = any(sibling in manual_review for sibling in sibling_keys)

        files = clear_entry(entry, "catalog", preserve_file=shared_verified_asset)
        if manifest_entry is not None:
            files.extend(clear_entry(manifest_entry, "manifest", preserve_file=shared_verified_asset))

        reset += 1
        removed.extend(files)
        print(
            f"Reset invalid photo state for {target_key[0]} / {target_key[1]}: "
            + ", ".join(reasons)
        )

    if reset:
        INDEX.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        MANIFEST.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Reset {reset} invalid photo records; removed {len(removed)} local files.")


if __name__ == "__main__":
    main()
