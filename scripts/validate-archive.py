#!/usr/bin/env python3
"""Single structural validation gate for The Dirt Archive."""

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
DEPLOY_AUDIT = ROOT / "scripts/deploy-browser-audit.js"
LIVE_AUDIT = ROOT / "scripts/live-photo-audit.js"
HOME = ROOT / "index.html"
DETAIL = ROOT / "pedal-detail.html"
LEGACY = ROOT / "pedal.html"
DEPLOY = ROOT / ".github/workflows/deploy-pages.yml"
STATIC_SERVER = ROOT / "scripts/serve-static.js"

def pair(a, b):
    return (a, b)

def local(path):
    value = path[2:] if path.startswith("./") else path
    return ROOT / value

def main():
    required = (INDEX, MANIFEST, TRACKER, CORE, INDEX_JS, DETAIL_JS, DEPLOY_AUDIT, LIVE_AUDIT, STATIC_SERVER, HOME, DETAIL, LEGACY, DEPLOY)
    missing = [p.relative_to(ROOT).as_posix() for p in required if not p.is_file()]
    if missing:
        raise SystemExit("Missing required archive files: " + ", ".join(missing))

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    pedals = catalog.get("pedals", [])
    if catalog.get("count") != len(pedals):
        raise SystemExit("PEDAL_INDEX.json count does not match pedals length.")

    catalog_keys = [pair(x.get("company"), x.get("pedal")) for x in pedals]
    manifest_keys = [pair(x.get("builder"), x.get("pedal")) for x in manifest]
    if len(catalog_keys) != len(set(catalog_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PEDAL_INDEX.json.")
    if len(manifest_keys) != len(set(manifest_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PEDAL_IMAGES.json.")
    if set(catalog_keys) != set(manifest_keys):
        raise SystemExit("PEDAL_INDEX.json and PEDAL_IMAGES.json identities disagree.")

    catalog_by_key = {pair(x.get("company"), x.get("pedal")): x for x in pedals}

    for entry in pedals:
        k = pair(entry.get("company"), entry.get("pedal"))
        record = entry.get("research_record") or ""
        if record and not local(record).is_file():
            raise SystemExit(f"Missing research record: {k} -> {record}")

        image = entry.get("image")
        if image and not re.match(r"^https?://", image):
            normalized = image.replace("\\", "/").lstrip("./")
            if not normalized.startswith("assets/pedals/"):
                raise SystemExit(f"Unsupported local image path: {k} -> {image}")
            if not (ROOT / normalized).is_file():
                raise SystemExit(f"Missing local catalog image: {k} -> {image}")
            if not entry.get("image_source_url") and not entry.get("source_page"):
                raise SystemExit(f"Local image is missing provenance: {k}")
            if entry.get("catalog_role") == "variation" and "/variants/" not in normalized:
                raise SystemExit(f"Variation image is outside /variants/: {k} -> {image}")

        if entry.get("catalog_role") == "variation":
            parent = pair(entry.get("company"), entry.get("parent_pedal"))
            parent_entry = catalog_by_key.get(parent)
            if not parent_entry or parent_entry.get("catalog_role") == "variation":
                raise SystemExit(f"Variation has invalid parent: {k} -> {parent}")

        if entry.get("version_of") not in (None, ""):
            allowed = {f"{c}\u0000{p}" for c, p in catalog_keys}
            if entry.get("version_of") not in allowed:
                raise SystemExit(f"Version parent is missing: {k} -> {entry.get('version_of')}")

    manifest_by_key = {pair(x.get("builder"), x.get("pedal")): x for x in manifest}
    for k, public in catalog_by_key.items():
        mirror = manifest_by_key[k]
        if (mirror.get("image") or None) != (public.get("image") or None):
            raise SystemExit(f"Manifest/catalog photo mismatch: {k}")
        if (mirror.get("research_record") or "") != (public.get("research_record") or ""):
            raise SystemExit(f"Manifest/catalog research mismatch: {k}")

    linked_records = {"./" + p.relative_to(ROOT).as_posix() for p in (ROOT / "research/pedals").rglob("*.md")}
    manifest_records = {x.get("research_record") for x in manifest if x.get("research_record")}
    if linked_records != manifest_records:
        raise SystemExit("Research record files and manifest links are out of sync.")

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker = list(csv.DictReader(handle))
    tracker_keys = [pair(x.get("Builder"), x.get("Pedal")) for x in tracker]
    if len(tracker_keys) != len(set(tracker_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PRP_TRACKER.csv.")
    if set(tracker_keys) != set(catalog_keys):
        raise SystemExit("PRP_TRACKER.csv identities disagree with PEDAL_INDEX.json.")

    for row in tracker:
        k = pair(row.get("Builder"), row.get("Pedal"))
        public = catalog_by_key[k]
        info = bool(public.get("research_record"))
        picture = bool(public.get("image"))
        complete = info and picture
        expected = {
            "Pedal Info": "DONE" if info else "NEEDED",
            "Picture": "DONE" if picture else "NEEDED",
            "PRP Complete": "DONE" if complete else "NEEDED",
            "Research Record": public.get("research_record") or "",
        }
        actual = {field: row.get(field, "") for field in expected}
        if actual != expected:
            raise SystemExit(f"Tracker status mismatch: {k}")

    home_text = HOME.read_text(encoding="utf-8")
    detail_text = DETAIL.read_text(encoding="utf-8")
    deploy_text = DEPLOY.read_text(encoding="utf-8")
    health_workflow = (ROOT / ".github/workflows/hourly-site-health.yml").read_text(encoding="utf-8")
    architecture_text = (ROOT / "SITE_ARCHITECTURE.md").read_text(encoding="utf-8")
    if "sync-public-data-version.py" in architecture_text:
        raise SystemExit("Architecture still references the retired catalog-version synchronization script.")
    cache_workflow = (ROOT / ".github/workflows/cache-pedal-images.yml").read_text(encoding="utf-8")
    if "node-version: 20" not in deploy_text:
        raise SystemExit("Deployment workflow is not pinned to Node 20.")
    if "node-version: 20" not in cache_workflow:
        raise SystemExit("Photo cache workflow is not pinned to Node 20.")
    if "node-version: 20" not in health_workflow:
        raise SystemExit("Hourly health workflow is not pinned to Node 20.")
    if "git fetch origin main --depth=2" not in health_workflow or "git reset --hard origin/main" not in health_workflow:
        raise SystemExit("Scheduled hourly health workflow is not refreshing its checkout to latest main.")
    if "./assets/css/archive-index.css" not in home_text or "./assets/js/archive-index.js" not in home_text:
        raise SystemExit("Home page is not wired to external assets.")
    if 'class="skipLink" href="#mainContent"' not in home_text or 'id="mainContent"' not in home_text:
        raise SystemExit("Home page is missing its keyboard skip-to-content path.")
    if 'class="skipLink" href="#mainContent"' not in detail_text or 'id="mainContent"' not in detail_text:
        raise SystemExit("Detail page is missing its keyboard skip-to-content path.")
    detail_js_text = DETAIL_JS.read_text(encoding="utf-8")
    if "loadCatalog()" not in detail_js_text:
        raise SystemExit("Detail page controller is not using the shared catalog loader.")
    if "loadCatalog()\n.then(r=>{if(!r.ok)" in detail_js_text:
        raise SystemExit("Detail page controller contains the retired duplicate catalog loader.")
    if Path(".github/workflows/reconcile-prp-manifest.yml").exists():
        raise SystemExit("Retired duplicate manifest reconciliation workflow is still present.")
    if "./assets/css/archive-detail.css" not in detail_text or "./assets/js/archive-detail.js" not in detail_text:
        raise SystemExit("Detail page is not wired to external assets.")
    if re.search(r"<script(?![^>]*src=)[^>]*>", home_text, re.I):
        raise SystemExit("Home page contains inline JavaScript.")
    if re.search(r"<script(?![^>]*src=)[^>]*>", detail_text, re.I):
        raise SystemExit("Detail page contains inline JavaScript.")
    index_js_text = INDEX_JS.read_text(encoding="utf-8")
    detail_js_text = DETAIL_JS.read_text(encoding="utf-8")
    if "No Photo Archived" not in index_js_text or "No Photo Archived" not in detail_text:
        raise SystemExit("No Photo Archived fallback is missing.")
    if "Research confidence" in detail_text or "Sources checked" in detail_text:
        raise SystemExit("Internal research sections leaked into the public detail page.")
    if "style=" in detail_js_text or ".style." in detail_js_text:
        raise SystemExit("Detail controller contains inline presentation styling; presentation belongs in archive-detail.css.")
    if "node - <<'JS'" in deploy_text or "node -e \"const http=require('http')" in deploy_text:
        raise SystemExit("Deployment workflow still embeds browser server source.")
    if "node scripts/serve-static.js" not in deploy_text:
        raise SystemExit("Deployment workflow is not using the owned static server script.")
    if "node scripts/deploy-browser-audit.js" not in deploy_text or "node scripts/live-photo-audit.js" not in deploy_text:
        raise SystemExit("Deployment workflow is not wired to the external audit scripts.")
    if "python scripts/validate-archive.py" not in deploy_text:
        raise SystemExit("Deployment workflow is not using the shared validator.")
    for script_path in ("scripts/deploy-browser-audit.js", "scripts/serve-static.js", "scripts/live-photo-audit.js", "scripts/validate-archive.py"):
        if script_path not in deploy_text:
            raise SystemExit(f"Deployment workflow is not watching required operational script: {script_path}")
    if "location.replace('./pedal-detail.html'+location.search)" not in LEGACY.read_text(encoding="utf-8"):
        raise SystemExit("Legacy pedal.html redirect is missing.")

    for js in (CORE, INDEX_JS, DETAIL_JS, DEPLOY_AUDIT, LIVE_AUDIT, STATIC_SERVER):
        result = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        if result.returncode:
            raise SystemExit(f"JavaScript syntax check failed for {js.relative_to(ROOT)}:\n{result.stderr}")

    researched = sum(bool(x.get("research_record")) for x in pedals)
    pictured = sum(bool(x.get("image")) for x in pedals)
    complete = sum(bool(x.get("research_record")) and bool(x.get("image")) for x in pedals)
    print(f"Archive structure valid: {len(pedals)} entries; {researched} researched; {pictured} pictured; {complete} complete.")

if __name__ == "__main__":
    main()
