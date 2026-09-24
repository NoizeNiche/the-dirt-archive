#!/usr/bin/env python3
"""Reattach recovered local pedal assets to the canonical catalog after a rebase."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")
OVERRIDES = Path("research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv")
ASSETS = Path("assets/pedals")


def slug(value: str) -> str:
    raw = str(value or "").strip().lower()
    return re.sub(r"[^a-z0-9]+", "-", raw).strip("-") or "unknown"


def rel(path: Path) -> str:
    return "./" + path.as_posix()


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

        # Only repair a missing/non-local catalog image from a canonical primary
        # asset that already exists. Never overwrite a valid local path.
        if local_declared or not candidate.is_file():
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
