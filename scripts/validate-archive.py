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
PHOTO_REVIEW_QUEUE = ROOT / "research/PHOTO_REVIEW_QUEUE.csv"
PHOTO_BACKLOG = ROOT / "research/PHOTO_BACKLOG.csv"
PHOTO_SOURCE_OVERRIDES = ROOT / "research/PHOTO_SOURCE_OVERRIDES.csv"
APPLY_PHOTO_SOURCE_OVERRIDES = ROOT / "scripts/apply-photo-source-overrides.py"
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
PHOTO_CACHE = ROOT / "scripts/browser-photo-cache.mjs"

def pair(a, b):
    return (a, b)

def local(path):
    value = path[2:] if path.startswith("./") else path
    return ROOT / value


def archived_image(image):
    if not image or re.match(r"^https?://", image, re.I):
        return False
    normalized = image.replace("\\", "/").lstrip("./")
    return normalized.startswith("assets/pedals/") and (ROOT / normalized).is_file()

def main():
    required = (INDEX, MANIFEST, TRACKER, PHOTO_REVIEW_QUEUE, PHOTO_BACKLOG, PHOTO_SOURCE_OVERRIDES, APPLY_PHOTO_SOURCE_OVERRIDES, CORE, INDEX_JS, DETAIL_JS, DEPLOY_AUDIT, LIVE_AUDIT, STATIC_SERVER, PHOTO_CACHE, HOME, DETAIL, LEGACY, DEPLOY)
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

    with PHOTO_SOURCE_OVERRIDES.open(newline="", encoding="utf-8") as handle:
        overrides = list(csv.DictReader(handle))
    override_by_key = {}
    override_page_keys = set()
    for row in overrides:
        k = pair(row.get("Builder"), row.get("Pedal"))
        source_page = (row.get("Image Source Page") or "").strip()
        if k not in catalog_by_key:
            raise SystemExit(f"Photo source override contains an unknown catalog identity: {k}")
        if not re.match(r"^https?://", source_page, re.I):
            raise SystemExit(f"Photo source override is not an HTTP(S) page: {k} -> {source_page}")
        page_key = (k, source_page)
        if page_key in override_page_keys:
            raise SystemExit(f"Duplicate Builder + Pedal + source page in PHOTO_SOURCE_OVERRIDES.csv: {k} -> {source_page}")
        override_page_keys.add(page_key)
        override_by_key.setdefault(k, []).append(source_page)

    for entry in pedals:
        k = pair(entry.get("company"), entry.get("pedal"))
        record = entry.get("research_record") or ""
        level = str(entry.get("research_level") or "").strip().lower()
        if not record:
            raise SystemExit(f"Catalog pedal has no surface/deep research record: {k}")
        if level not in {"surface", "researched", "deep"}:
            raise SystemExit(f"Catalog pedal has invalid research level: {k} -> {level}")
        if level == "surface" and "Surface catalog record" not in local(record).read_text(encoding="utf-8", errors="replace"):
            raise SystemExit(f"Surface research record is missing its required baseline marker: {k} -> {record}")
        if record and not local(record).is_file():
            raise SystemExit(f"Missing research record: {k} -> {record}")

        if entry.get("image_source_page_verified") is True:
            curated_pages = override_by_key.get(k, [])
            if not curated_pages or (entry.get("image_source_page") or "").strip() not in curated_pages:
                raise SystemExit(f"Verified photo source flag has no matching curated override: {k}")

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
        picture = archived_image(public.get("image"))
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

    with PHOTO_REVIEW_QUEUE.open(newline="", encoding="utf-8") as handle:
        review = list(csv.DictReader(handle))
    review_keys = [pair(x.get("Builder"), x.get("Pedal")) for x in review]
    if len(review_keys) != len(set(review_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PHOTO_REVIEW_QUEUE.csv.")
    allowed_review_statuses = {"DEEP_REVIEW", "PARKED"}
    for row in review:
        k = pair(row.get("Builder"), row.get("Pedal"))
        if k not in catalog_by_key:
            raise SystemExit(f"Photo review queue contains an unknown catalog identity: {k}")
        tracker_row = next(x for x in tracker if pair(x.get("Builder"), x.get("Pedal")) == k)
        if tracker_row.get("Picture") == "DONE":
            raise SystemExit(f"Resolved pedal remains in photo review queue: {k}")
        if row.get("Status") not in allowed_review_statuses:
            raise SystemExit(f"Invalid photo review queue status: {k} -> {row.get('Status')}")
        try:
            attempts = int(row.get("Attempts") or "0")
        except ValueError:
            raise SystemExit(f"Invalid photo review attempt count: {k} -> {row.get('Attempts')}")
        if attempts < 0:
            raise SystemExit(f"Negative photo review attempt count: {k}")
        if row.get("Status") == "PARKED" and attempts < 12:
            raise SystemExit(f"Parked photo review record has not reached the cutoff: {k} -> {attempts}")

    with PHOTO_BACKLOG.open(newline="", encoding="utf-8") as handle:
        backlog = list(csv.DictReader(handle))
    backlog_keys = [pair(x.get("Builder"), x.get("Pedal")) for x in backlog]
    missing_keys = [pair(x.get("Builder"), x.get("Pedal")) for x in tracker if x.get("Picture") != "DONE"]
    if len(backlog_keys) != len(set(backlog_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PHOTO_BACKLOG.csv.")
    if set(backlog_keys) != set(missing_keys):
        raise SystemExit("PHOTO_BACKLOG.csv identities disagree with unresolved tracker photo records.")
    review_by_key = {pair(x.get("Builder"), x.get("Pedal")): x for x in review}
    tracker_by_key = {pair(x.get("Builder"), x.get("Pedal")): x for x in tracker}
    for row in backlog:
        k = pair(row.get("Builder"), row.get("Pedal"))
        tracker_row = tracker_by_key[k]
        review_row = review_by_key.get(k)
        if review_row:
            expected_action = "DEEP_REVIEW"
            expected_attempts = review_row.get("Attempts", "0")
        elif tracker_row.get("Pedal Info") == "DONE":
            expected_action = "PHOTO_NEEDED"
            expected_attempts = "0"
        else:
            expected_action = "RESEARCH_AND_PHOTO_NEEDED"
            expected_attempts = "0"
        if row.get("Action") != expected_action or row.get("Attempts") != expected_attempts:
            raise SystemExit(f"Photo backlog drift: {k}")

    home_text = HOME.read_text(encoding="utf-8")
    detail_text = DETAIL.read_text(encoding="utf-8")
    deploy_text = DEPLOY.read_text(encoding="utf-8")
    health_workflow = (ROOT / ".github/workflows/hourly-site-health.yml").read_text(encoding="utf-8")
    research_workflow = (ROOT / ".github/workflows/research-worker-team.yml").read_text(encoding="utf-8")
    fast_photo_workflow = (ROOT / ".github/workflows/fast-photo-catchup.yml").read_text(encoding="utf-8")
    parallel_photo_workflow = (ROOT / ".github/workflows/parallel-photo-recovery.yml").read_text(encoding="utf-8")
    synth_workflow = (ROOT / ".github/workflows/research-synthesis.yml").read_text(encoding="utf-8")
    architecture_text = (ROOT / "SITE_ARCHITECTURE.md").read_text(encoding="utf-8")
    cache_workflow = (ROOT / ".github/workflows/cache-pedal-images.yml").read_text(encoding="utf-8")

    required_queue_hardening = (
        ("dirt-research-workers-v5", research_workflow),
        ("cancel-in-progress: false", research_workflow),
        ("span=min(60,len(frontier))", research_workflow),
        ("canonical_delta", research_workflow),
        ("No canonical research movement in this pass; stopping self-chain", research_workflow),
        ("dirt-photo-recovery-v3", fast_photo_workflow),
        ("cancel-in-progress: false", fast_photo_workflow),
        ("targets = targets[:60]", fast_photo_workflow),
        ("Production deployment verified", fast_photo_workflow),
        ("Production deployment verified", parallel_photo_workflow),
        ("Deployment image audit scope:", deploy_text),
        ("imageAuditMode", deploy_text),
        ("researchAuditMode", deploy_text),
        ("changed/smoke researched parent pages", deploy_text),
        ("dirt-image-cache", cache_workflow),
        ("cancel-in-progress: false", cache_workflow),
        ("dirt-research-synthesis", synth_workflow),
        ("workflow_dispatch:", synth_workflow),
    )
    for marker, source in required_queue_hardening:
        if marker not in source:
            raise SystemExit(f"Operational queue hardening is missing: {marker}")
    if "sync-public-data-version.py" in architecture_text:
        raise SystemExit("Architecture still references the retired catalog-version synchronization script.")
    home_css = (ROOT / "assets/css/archive-index.css").read_text(encoding="utf-8")
    required_home_selectors = (
        ".grid{", ".card{", ".cardMedia{", ".cardImage{",
        ".cardPlaceholder", ".pagination{", ".pageButton{", ".heroPanel{"
    )
    missing_home_selectors = [selector for selector in required_home_selectors if selector not in home_css]
    if missing_home_selectors:
        raise SystemExit("Home archive stylesheet is missing required UI selectors: " + ", ".join(missing_home_selectors))
    if 'PHOTO_BROWSER_CACHE_LIMIT: "240"' not in cache_workflow:
        raise SystemExit("Photo cache workflow batch limit is not the optimized 240-record window.")
    if 'PHOTO_BROWSER_RECOVERY_DEADLINE_MS: "120000"' not in cache_workflow:
        raise SystemExit("Photo cache workflow recovery deadline is not the optimized two-minute window.")
    cache_script = (ROOT / "scripts/cache-pedal-images.py").read_text(encoding="utf-8")
    photo_cache_script = (ROOT / "scripts/browser-photo-cache.mjs").read_text(encoding="utf-8")
    if "directImageOverride" not in photo_cache_script or "candidates.filter(candidate => candidate.directImageOverride)" not in photo_cache_script:
        raise SystemExit("Browser photo cache is not prioritizing exact direct-image overrides.")
    if "function screenshotImageDocumentCandidate" not in photo_cache_script:
        raise SystemExit("Browser photo cache is missing the direct image-document capture fallback.")
    if "pedalInfoDone" not in photo_cache_script:
        raise SystemExit("Browser photo cache is not prioritizing researched records that only need photos.")
    if 'or re.match(r"^https?://"' not in cache_script:
        raise SystemExit("Bulk photo cache is not including externally pictured records for localization.")
    if "function preferredSourcePage" not in photo_cache_script or "const pageUrl = preferredSourcePage(entry);" not in photo_cache_script:
        raise SystemExit("Photo cache is not preferring a real pedal source page over a generic marketplace homepage.")
    cache_image_script = (ROOT / "scripts/cache-pedal-images.py").read_text(encoding="utf-8")
    if "ThreadPoolExecutor(max_workers=6)" not in cache_image_script:
        raise SystemExit("Image download concurrency is not bounded at six workers.")
    if "Remaining tracker photo backlog" not in cache_image_script:
        raise SystemExit("Photo cache report is missing the remaining backlog count.")
    if "site:effectsdatabase.com/model" not in photo_cache_script or "site:reverb.com/item" not in photo_cache_script:
        raise SystemExit("Deep photo review is missing targeted Effects Database and Reverb searches.")
    if "function isReverbListingUrl" not in photo_cache_script:
        raise SystemExit("Browser photo cache is missing the shared Reverb listing URL matcher.")
    if "isReverbListingUrl(href)" in photo_cache_script:
        raise SystemExit("Browser-page Reverb filtering is calling a Node-only helper.")
    if "function reverbListingMatchesIdentity" not in photo_cache_script:
        raise SystemExit("Browser photo cache is missing the Reverb listing identity fallback.")
    if "return builderMatch && (" not in photo_cache_script:
        raise SystemExit("Photo identity fallback is not requiring builder context.")
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
    if "renderCatalogBaseline(item)" not in detail_js_text or "Catalog baseline" not in detail_js_text:
        raise SystemExit("Detail page is missing the identity-safe catalog baseline for surface records.")
    for script_path in (DETAIL_JS, LIVE_AUDIT):
        result = subprocess.run(["node", "--check", str(script_path)], capture_output=True, text=True)
        if result.returncode:
            raise SystemExit(f"JavaScript syntax check failed: {script_path.relative_to(ROOT)}\\n{result.stderr.strip()}")
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