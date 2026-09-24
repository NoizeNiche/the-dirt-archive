#!/usr/bin/env python3
"""Merge verified photo-recovery artifacts from parallel browser jobs."""

import json
import shutil
from pathlib import Path

ROOT = Path(".")
ARTIFACTS = ROOT / "recovery-artifacts"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"

def main():
    results = []
    for path in ARTIFACTS.rglob("photo-recovery-result.json"):
        try:
            results.append(json.loads(path.read_text(encoding="utf-8")))
        except Exception as exc:
            print(f"Skipping unreadable result {path}: {exc}")

    copied = 0
    seen_sources = set()
    for source in ARTIFACTS.rglob("*.source"):
        rel = None
        parts = source.parts
        if "assets" in parts and "pedals" in parts:
            i = parts.index("assets")
            candidate = Path(*parts[i:])
            rel = candidate
        if rel is None:
            continue
        target = ROOT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            continue
        shutil.copy2(source, target)
        copied += 1

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    catalog_by_key = {(p.get("company"), p.get("pedal")): p for p in catalog.get("pedals", [])}
    manifest_by_key = {(p.get("builder"), p.get("pedal")): p for p in manifest}

    provenance = 0
    for row in results:
        key = (row.get("builder"), row.get("pedal"))
        entry = catalog_by_key.get(key)
        mentry = manifest_by_key.get(key)
        if not entry:
            continue
        if row.get("image_source_url"):
            entry["image_source_url"] = row["image_source_url"]
        if row.get("image_source_page"):
            entry["image_source_page"] = row["image_source_page"]
        if mentry:
            if row.get("image_source_url"):
                mentry["image_source_url"] = row["image_source_url"]
            if row.get("image_source_page"):
                mentry["image_source_page"] = row["image_source_page"]
        provenance += 1

    INDEX.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Merged {copied} verified source files and {provenance} recovery-result records.")

if __name__ == "__main__":
    main()
