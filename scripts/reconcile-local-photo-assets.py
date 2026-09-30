#!/usr/bin/env python3
"""Reattach recovered local pedal assets to the canonical catalog after a rebase."""

from __future__ import annotations

import csv
import hashlib
import json
import re
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")
OVERRIDES = Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv")
PHOTO_HASH_QUARANTINE = Path("research/PHOTO_HASH_QUARANTINE.csv")
ASSETS = Path("assets/pedals")


def slug(value: str) -> str:
    raw = str(value or "").strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", raw).strip("-") or "unknown"
    if len(normalized) <= 90:
        return normalized
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:10]
    return normalized[:79].rstrip("-") + "-" + digest


def rel(path: Path) -> str:
    return "./" + path.as_posix()


def load_photo_hash_quarantine() -> tuple[dict[str, set[tuple[str, str]]], dict[str, set[tuple[str, str]]]]:
    """Return quarantined image paths and SHA-1 digests keyed by Builder + Pedal."""
    paths: dict[str, set[tuple[str, str]]] = {}
    digests: dict[str, set[tuple[str, str]]] = {}
    if not PHOTO_HASH_QUARANTINE.exists():
        return paths, digests
    try:
        with PHOTO_HASH_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                key = ((row.get("Builder") or "").strip(), (row.get("Pedal") or "").strip())
                image_path = (row.get("Image Path") or "").strip().lstrip("./")
                digest = (row.get("Blob SHA256") or "").strip().lower()
                if not key[0] or not key[1]:
                    continue
                if image_path:
                    paths.setdefault(image_path, set()).add(key)
                if digest:
                    digests.setdefault(digest, set()).add(key)
    except OSError:
        pass
    return paths, digests


def load_overrides() -> dict[tuple[str, str], tuple[str, str]]:
    if not OVERRIDES.exists():
        return {}
    out = {}
    with OVERRIDES.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            builder = (row.get("Builder") or "").strip()
            pedal = (row.get("Pedal") or "").strip()
            source = (row.get("Source Page") or "").strip()
            image = (row.get("Direct Image URL") or "").strip()
            if builder and pedal and (source or image):
                out[(builder, pedal)] = (source, image)
    return out


def candidate_primary(builder: str, pedal: str) -> Path:
    return ASSETS / slug(builder) / slug(pedal) / "primary.webp"


def main() -> int:
    catalog_data = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest_data = json.loads(MANIFEST.read_text(encoding="utf-8"))

    catalog = catalog_data.get("pedals", [])
    manifest = manifest_data if isinstance(manifest_data, list) else manifest_data.get("images", [])
    manifest_by_key = {
        ((row.get("builder") or row.get("company") or "").strip(), (row.get("pedal") or "").strip()): row
        for row in manifest
    }
    overrides = load_overrides()
    quarantined_paths, quarantined_digests = load_photo_hash_quarantine()

    # Reconciliation runs after the invalid-photo reset pass. Never resurrect a
    # quarantined asset, and never attach an already-owned primary path to a
    # second public identity.
    declared_owners: dict[str, set[tuple[str, str]]] = {}
    for existing in catalog:
        existing_builder = str(existing.get("company") or existing.get("builder") or "").strip()
        existing_pedal = str(existing.get("pedal") or "").strip()
        existing_image = str(existing.get("image") or "").strip().lstrip("./")
        if existing_builder and existing_pedal and existing_image.startswith("assets/pedals/"):
            declared_owners.setdefault(existing_image, set()).add((existing_builder, existing_pedal))

    changed = 0
    repaired = []

    for item in catalog:
        builder = str(item.get("company") or item.get("builder") or "").strip()
        pedal = str(item.get("pedal") or "").strip()
        if not builder or not pedal:
            continue

        image = str(item.get("image") or "").strip()
        local_declared = image.startswith("./assets/pedals/") and Path(image[2:]).is_file()
        candidate = candidate_primary(builder, pedal)
        candidate_key = (builder, pedal)
        candidate_rel = candidate.as_posix()

        # Only repair a missing/non-local catalog image from a canonical primary
        # asset that already exists. Never overwrite a valid local path.
        if local_declared or not candidate.is_file():
            continue

        owners = declared_owners.get(candidate_rel, set())
        if owners and owners != {candidate_key}:
            print(
                f"Skipped shared candidate asset for {builder} - {pedal}: "
                + candidate_rel
                + " already belongs to "
                + ", ".join(f"{b} / {p}" for b, p in sorted(owners))
            )
            continue

        try:
            candidate_bytes = candidate.read_bytes()
            candidate_sha256 = hashlib.sha256(candidate_bytes).hexdigest().lower()
            candidate_sha1 = hashlib.sha1(candidate_bytes).hexdigest().lower()
        except OSError:
            continue

        quarantined_for_identity = (
            candidate_key in quarantined_digests.get(candidate_sha256, set())
            or candidate_key in quarantined_digests.get(candidate_sha1, set())
            or candidate_key in quarantined_paths.get(candidate_rel, set())
        )
        if quarantined_for_identity:
            print(
                f"Skipped quarantined candidate asset for {builder} - {pedal}: "
                + candidate_rel
            )
            continue

        item["image"] = rel(candidate)
        source_page, direct_image = overrides.get((builder, pedal), ("", ""))
        if direct_image:
            item["image_source_url"] = direct_image
        if source_page:
            item["image_source_page"] = source_page

        key = (builder, pedal)
        manifest_entry = manifest_by_key.get(key)
        if manifest_entry is None:
            manifest_entry = {
                "builder": builder,
                "pedal": pedal,
                "image": item["image"],
                "source_page": item.get("source_page"),
                "research_record": item.get("research_record"),
            }
            manifest.append(manifest_entry)
            manifest_by_key[key] = manifest_entry
        manifest_entry["image"] = item["image"]
        if item.get("image_source_url"):
            manifest_entry["image_source_url"] = item["image_source_url"]

        changed += 1
        repaired.append(f"{builder} - {pedal} -> {item['image']}")

    if changed:
        INDEX.write_text(json.dumps(catalog_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if isinstance(manifest_data, list):
            MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        else:
            manifest_data["images"] = manifest
            MANIFEST.write_text(json.dumps(manifest_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Local photo reconciliation: repaired {changed} catalog assets.")
    for row in repaired[:50]:
        print(" - " + row)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
