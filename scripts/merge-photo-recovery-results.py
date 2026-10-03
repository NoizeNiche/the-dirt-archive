#!/usr/bin/env python3
"""Merge verified photo-recovery artifacts from parallel browser jobs."""

import json
import shutil
import re
from pathlib import Path

ROOT = Path(".")
ARTIFACTS = ROOT / "recovery-artifacts"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"
FOREMAN_VERDICT = ARTIFACTS / "photo-foreman-verdict.json"


def blocked_photo_url(value: str) -> bool:
    raw = str(value or "").strip()
    if not raw:
        return False
    lowered = raw.lower()
    try:
        policy = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
    except Exception:
        return False
    for rule in policy.get("rules", []):
        kind = str(rule.get("type") or "")
        pattern = str(rule.get("pattern") or "")
        if not pattern:
            continue
        try:
            if kind == "exact_url" and lowered == pattern.lower():
                return True
            if kind.endswith("_regex") and re.search(pattern, lowered, re.I):
                return True
        except Exception:
            continue
    return False

def main():
    results = []
    for path in ARTIFACTS.rglob("photo-recovery-result.json"):
        try:
            results.append(json.loads(path.read_text(encoding="utf-8")))
        except Exception as exc:
            print(f"Skipping unreadable result {path}: {exc}")

    # The Photo Foreman is the final acceptance gate. Only records explicitly
    # accepted by that gate may alter canonical image assets or provenance.
    accepted_keys = None
    if FOREMAN_VERDICT.exists():
        try:
            verdict = json.loads(FOREMAN_VERDICT.read_text(encoding="utf-8"))
            accepted_keys = {
                (str(row.get("builder") or "").strip(), str(row.get("pedal") or "").strip())
                for row in verdict.get("verdicts", [])
                if row.get("accepted") is True
            }
        except Exception as exc:
            raise RuntimeError(f"Could not read Photo Foreman verdict: {exc}") from exc
        results = [
            row for row in results
            if (str(row.get("builder") or "").strip(), str(row.get("pedal") or "").strip()) in accepted_keys
        ]
        print(f"Photo Foreman accepted {len(results)} recovery records for canonical merge.")

    copied = 0
    seen_sources = set()
    # Current recovery artifacts package the verified image as .webp. Keep
    # accepting legacy .source artifacts, but only for records that passed the
    # current Photo Foreman verdict.
    accepted_images = {
        str(row.get("imageFile") or "").lstrip("./")
        for row in results
        if row.get("imageFile")
    }
    for source in [*ARTIFACTS.rglob("*.webp"), *ARTIFACTS.rglob("*.source")]:
        parts = source.parts
        if "assets" not in parts or "pedals" not in parts:
            continue
        i = parts.index("assets")
        relative_path = Path(*parts[i:])
        if relative_path.as_posix() not in accepted_images:
            continue
        target = ROOT / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        source_key = (str(target), str(source))
        if source_key in seen_sources:
            continue
        seen_sources.add(source_key)
        if target.exists():
            continue
        shutil.copy2(source, target)
        copied += 1

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    catalog_by_key = {(p.get("company"), p.get("pedal")): p for p in catalog.get("pedals", [])}
    manifest_by_key = {(p.get("builder"), p.get("pedal")): p for p in manifest}

    # Scrub blocked provenance from the whole canonical catalog, not just the
    # records touched by the current recovery artifact. This prevents a bad
    # logo/UI URL from surviving indefinitely after the blocklist learns it.
    scrubbed = 0
    for catalog_entry in catalog.get("pedals", []):
        source_url = str(catalog_entry.get("image_source_url") or "").strip()
        if source_url and blocked_photo_url(source_url):
            catalog_entry.pop("image_source_url", None)
            scrubbed += 1
        source_urls = catalog_entry.get("image_source_urls")
        if isinstance(source_urls, list):
            cleaned = [u for u in source_urls if u and not blocked_photo_url(u)]
            if cleaned != source_urls:
                if cleaned:
                    catalog_entry["image_source_urls"] = cleaned
                else:
                    catalog_entry.pop("image_source_urls", None)
                scrubbed += 1
    if scrubbed:
        print(f"Scrubbed {scrubbed} blocked photo-provenance fields from the canonical catalog.")

    provenance = 0
    for row in results:
        key = (row.get("builder"), row.get("pedal"))
        entry = catalog_by_key.get(key)
        mentry = manifest_by_key.get(key)
        if not entry:
            continue
        source_url = str(row.get("image_source_url") or "").strip()
        source_page = str(row.get("image_source_page") or "").strip()
        if source_url and not blocked_photo_url(source_url):
            entry["image_source_url"] = source_url
        elif blocked_photo_url(source_url):
            entry.pop("image_source_url", None)
        if source_page:
            entry["image_source_page"] = source_page
        if mentry:
            if source_url and not blocked_photo_url(source_url):
                mentry["image_source_url"] = source_url
            elif blocked_photo_url(source_url):
                mentry.pop("image_source_url", None)
            if source_page:
                mentry["image_source_page"] = source_page
        provenance += 1

    INDEX.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Merged {copied} verified source files and {provenance} recovery-result records.")

if __name__ == "__main__":
    main()
