#!/usr/bin/env python3
"""Validate the Dirt Archive's data, relationships, runtime wiring, and file layout.

This is the single structural validation gate used by CI and deployment.
It intentionally checks invariants, not editorial completeness.
"""

from __future__ import annotations

import csv
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
CORE = ROOT / "assets/js/archive-core.js"
INDEX_JS = ROOT / "assets/js/archive-index.js"
DETAIL_JS = ROOT / "assets/js/archive-detail.js"
HOME = ROOT / "index.html"
DETAIL = ROOT / "pedal-detail.html"
LEGACY = ROOT / "pedal.html"


def key(company: str | None, pedal: str | None) -> tuple[str | None, str | None]:
    return company, pedal


def record_path(value: str) -> Path:
    cleaned = value[2:] if value.startswith("./") else value
    return ROOT / cleaned


def main() -> None:
    for required in (INDEX, MANIFEST, TRACKER, CORE, INDEX_JS, DETAIL_JS, HOME, DETAIL, LEGACY):
        if not required.is_file():
            raise SystemExit(f"Missing required archive file: {required.relative_to(ROOT)}")

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    pedals = catalog.get("pedals", [])
    if not isinstance(pedals, list):
        raise SystemExit("PEDAL_INDEX.json pedals must be a list.")
    if catalog.get("count") != len(pedals):
        raise SystemExit("Pedal index count mismatch.")

    catalog_keys = [key(x.get("company"), x.get("pedal")) for x in pedals]
    manifest_keys = [key(x.get("builder"), x.get("pedal")) for x in manifest]
    if len(catalog_keys) != len(set(catalog_keys)):
        raise SystemExit("Duplicate Builder + Pedal entries in PEDAL_INDEX.json.")
    if len(manifest_keys) != len(set(manifest_keys)):
        raise SystemExit("Duplicate Builder + Pedal entries in PEDAL_IMAGES.json.")
    if set(catalog_keys) != set(manifest_keys):
        raise SystemExit("PEDAL_INDEX.json and PEDAL_IMAGES.json identities disagree.")

    catalog_by_key = {key(x.get("company"), x.get("pedal")): x for x in pedals}
    manifest_by_key = {key(x.get("builder"), x.get("pedal")): x for x in manifest}

    for entry in pedals:
        k = key(entry.get("company"), entry.get("pedal"))
        rr = entry.get("research_record") or ""
        if rr and not record_path(rr).is_file():
            raise SystemExit(f"Missing research record: {k} -> {rr}")

        image = entry.get("image")
        if image and not re.match(r"^https?://", image):
            normalized = image.replace("\\", "/").lstrip("./")
            if not normalized.startswith("assets/pedals/"):
                raise SystemExit(f"Unsupported local image path: {k} -> {image}")
            image_file = ROOT / normalized
            if not image_file.is_file():
                raise SystemExit(f"Catalog image file missing: {k} -> {image}")
            if not entry.get("image_source_url") and not entry.get("source_page"):
                raise SystemExit(f"Local image missing provenance: {k}")
            if entry.get("catalog_role") == "variation" and "/variants/" not in normalized:
                raise SystemExit(f"Variation image is outside variants/: {k} -> {image}")

        if entry.get("catalog_role") == "variation":
            parent = key(entry.get("company"), entry.get("parent_pedal"))
            parent_entry = catalog_by_key.get(parent)
            if not parent_entry or parent_entry.get("catalog_role") == "variation":
                raise SystemExit(f"Variation has invalid parent: {k} -> {parent}")
        if entry.get("version_of"):
            if entry.get("version_of") not in {
                company + "\u0000" + pedal
                for company, pedal in catalog_keys
            }:
                raise SystemExit(f"Version parent missing: {k} -> {entry.get('version_of')}")

    for entry in manifest:
        k = key(entry.get("builder"), entry.get("pedal"))
        public = catalog_by_key[k]
        if (entry.get("image") or None) != (public.get("image") or None):
            raise SystemExit(f"Manifest/catalog photo mismatch: {k}")
        if (entry.get("research_record") or "") != (public.get("research_record") or ""):
            raise SystemExit(f"Manifest/catalog research mismatch: {k}")

    linked_records = {
        "./" + path.relative_to(ROOT).as_posix()
        for path in (ROOT / "research/pedals").rglob("*.md")
    }
    manifest_records = {
        "./" + path.lstrip("./")
        for path in (entry.get("research_record") or "" for entry in manifest)
        if path
    }
    if linked_records != manifest_records:
        missing = sorted(manifest_records - linked_records)
        extra = sorted(linked_records - manifest_records)
        raise SystemExit(f"Research record sync mismatch. Missing={missing[:5]} Extra={extra[:5]}")

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker = list(csv.DictReader(handle))
        fields = handle.seek(0) if False else None
    tracker_keys = [key(x.get("Builder"), x.get("Pedal")) for x in tracker]
    if len(tracker_keys) != len(set(tracker_keys)):
        raise SystemExit("Duplicate Builder + Pedal entries in PRP_TRACKER.csv.")
    if set(tracker_keys) != set(catalog_keys):
        raise SystemExit("PRP_TRACKER.csv identities disagree with PEDAL_INDEX.json.")

    for row in tracker:
        k = key(row.get("Builder"), row.get("Pedal"))
        public = catalog_by_key[k]
        expected_info = bool(public.get("research_record"))
        expected_picture = bool(public.get("image"))
        expected_complete = expected_info and expected_picture
        actual = {
            "Pedal Info": row.get("Pedal Info") == "DONE",
            "Picture": row.get("Picture") == "DONE",
            "PRP Complete": row.get("PRP Complete") == "DONE",
        }
        if actual != {
            "Pedal Info": expected_info,
            "Picture": expected_picture,
            "PRP Complete": expected_complete,
        }:
            raise SystemExit(f"Tracker status mismatch: {k}")
        if (row.get("Research Record") or "") != (public.get("research_record") or ""):
            raise SystemExit(f"Tracker research link mismatch: {k}")

    core_text = CORE.read_text(encoding="utf-8")
    version_match = re.search(r"const ARCHIVE_DATA_VERSION\s*=\s*['"]([^'"]+)['"]", core_text)
    if not version_match:
        raise SystemExit("Shared runtime version constant is missing.")
    if version_match.group(1) != catalog.get("version"):
        raise SystemExit("Shared runtime version and catalog version disagree.")

    home_text = HOME.read_text(encoding="utf-8")
    detail_text = DETAIL.read_text(encoding="utf-8")
    if "./assets/css/archive-index.css" not in home_text or "./assets/js/archive-index.js" not in home_text:
        raise SystemExit("Home page is not wired to shared external assets.")
    if "./assets/css/archive-detail.css" not in detail_text or "./assets/js/archive-detail.js" not in detail_text:
        raise SystemExit("Detail page is not wired to shared external assets.")
    if len(re.findall(r"<script(?![^>]*src=)[^>]*>", home_text, re.I)) != 0:
        raise SystemExit("Home page still contains inline JavaScript.")
    if len(re.findall(r"<script(?![^>]*src=)[^>]*>", detail_text, re.I)) != 0:
        raise SystemExit("Detail page still contains inline JavaScript.")
    if "No Photo Archived" not in home_text or "No Photo Archived" not in detail_text:
        raise SystemExit("No Photo Archived fallback is missing.")
    if "PEDAL_INDEX.json" not in CORE.read_text(encoding="utf-8"):
        raise SystemExit("Shared runtime catalog binding is missing.")
    if "location.replace('./pedal-detail.html'+location.search)" not in LEGACY.read_text(encoding="utf-8"):
        raise SystemExit("Legacy pedal.html redirect is missing.")
    if "Research confidence" in detail_text or "Sources checked" in detail_text:
        raise SystemExit("Internal research sections leaked into pedal-detail.html.")

    for js in (CORE, INDEX_JS, DETAIL_JS):
        result = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        if result.returncode:
            raise SystemExit(f"JavaScript syntax check failed for {js.relative_to(ROOT)}:\n{result.stderr}")

    researched = sum(bool(x.get("research_record")) for x in pedals)
    pictured = sum(bool(x.get("image")) for x in pedals)
    complete = sum(bool(x.get("research_record")) and bool(x.get("image")) for x in pedals)
    print(
        f"Archive structure valid: {len(pedals)} catalog entries; "
        f"{researched} researched; {pictured} pictured; {complete} complete."
    )


if __name__ == "__main__":
    main()
