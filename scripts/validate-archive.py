#!/usr/bin/env python3
"""Single structural validation gate for The Dirt Archive."""

from __future__ import annotations
import csv
import hashlib
import json
import re
import xml.etree.ElementTree as ET
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
PHOTO_REVIEW_QUEUE = ROOT / "research/PHOTO_REVIEW_QUEUE.csv"
PHOTO_BACKLOG = ROOT / "research/PHOTO_BACKLOG.csv"
PHOTO_SOURCE_OVERRIDES = ROOT / "research/PHOTO_SOURCE_OVERRIDES.csv"
PHOTO_DIRECT_IMAGE_OVERRIDES = ROOT / "research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv"
RESEARCH_SOURCE_OVERRIDES = ROOT / "research/RESEARCH_SOURCE_OVERRIDES.csv"
IDENTITY_ALIASES = ROOT / "research/PEDAL_IDENTITY_ALIASES.csv"
APPLY_PHOTO_SOURCE_OVERRIDES = ROOT / "scripts/apply-photo-source-overrides.py"
CORE = ROOT / "assets/js/archive-core.js"
INDEX_JS = ROOT / "assets/js/archive-index.js"
DETAIL_JS = ROOT / "assets/js/archive-detail.js"
DEPLOY_AUDIT = ROOT / "scripts/deploy-browser-audit.js"
LIVE_AUDIT = ROOT / "scripts/live-photo-audit.js"
HOME = ROOT / "index.html"
DETAIL = ROOT / "pedal-detail.html"
COMPARE = ROOT / "compare.html"
PHOTO_CONTENT_AUDIT = ROOT / "scripts/audit-photo-content.py"
PHOTO_CONTENT_WORKFLOW = ROOT / ".github/workflows/photo-content-audit.yml"
BUILDER = ROOT / "builder.html"
LEGACY = ROOT / "pedal.html"
DEPLOY = ROOT / ".github/workflows/deploy-pages.yml"
STATIC_SERVER = ROOT / "scripts/serve-static.js"
PHOTO_CACHE = ROOT / "scripts/browser-photo-cache.mjs"
FACET_BUILDER = ROOT / "scripts/build-pedal-facets.py"
SITEMAP = ROOT / "sitemap.xml"
ROBOTS = ROOT / "robots.txt"
SITEMAP_BUILDER = ROOT / "scripts/build-sitemap.py"

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

def forbidden_photo_provenance(value):
    try:
        from urllib.parse import urlparse
        parsed = urlparse(str(value or ""))
        haystack = (parsed.netloc + parsed.path + ("?" + parsed.query if parsed.query else "")).lower()
        basename = parsed.path.rstrip("/").split("/")[-1]
        if re.search(r"(?:buymeacoffee|patreon|donate|donation|sponsor|payment|checkout|support(?:[-_]?us)?|tracking|pixel|analytics|consent)", haystack, re.I):
            return True
        if re.search(r"(?:logo|favicon|sprite|avatar|badge|icon|social|banner|widget|placeholder|spinner)(?:[-_.]|$)", basename, re.I):
            return True
        if re.search(r"/graphics/(?:buymeacoffee|donate|support|sponsor|payment|banner|widget)", parsed.path, re.I):
            return True
    except Exception:
        return False
    return False

def main():
    required = (INDEX, MANIFEST, TRACKER, PHOTO_REVIEW_QUEUE, PHOTO_BACKLOG, PHOTO_SOURCE_OVERRIDES, PHOTO_DIRECT_IMAGE_OVERRIDES, RESEARCH_SOURCE_OVERRIDES, APPLY_PHOTO_SOURCE_OVERRIDES, CORE, INDEX_JS, DETAIL_JS, DEPLOY_AUDIT, LIVE_AUDIT, STATIC_SERVER, PHOTO_CACHE, FACET_BUILDER, HOME, DETAIL, COMPARE, BUILDER, LEGACY, PHOTO_CONTENT_AUDIT, PHOTO_CONTENT_WORKFLOW, DEPLOY, SITEMAP, ROBOTS, SITEMAP_BUILDER)
    missing = [p.relative_to(ROOT).as_posix() for p in required if not p.is_file()]
    if missing:
        raise SystemExit("Missing required archive files: " + ", ".join(missing))

    sitemap_text = SITEMAP.read_text(encoding="utf-8")
    try:
        sitemap_root = ET.fromstring(sitemap_text)
    except ET.ParseError as exc:
        raise SystemExit(f"Invalid sitemap.xml: {exc}")
    sitemap_locs = [
        node.text.strip()
        for node in sitemap_root.iter()
        if node.tag.endswith("loc") and node.text and node.text.strip()
    ]
    if len(sitemap_locs) != len(set(sitemap_locs)):
        raise SystemExit("sitemap.xml contains duplicate URLs.")
    expected_static = {
        "https://noizeniche.github.io/the-dirt-archive/",
        "https://noizeniche.github.io/the-dirt-archive/methodology.html",
        "https://noizeniche.github.io/the-dirt-archive/audit.html",
        "https://noizeniche.github.io/the-dirt-archive/compare.html",
    }
    robots_text = ROBOTS.read_text(encoding="utf-8")
    if "Sitemap: https://noizeniche.github.io/the-dirt-archive/sitemap.xml" not in robots_text:
        raise SystemExit("robots.txt is missing the archive sitemap declaration.")

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sitemap_pedals = [
        item for item in catalog.get("pedals", [])
        if item.get("catalog_role") != "variation"
        and str(item.get("company") or "").strip()
        and str(item.get("pedal") or "").strip()
    ]
    from urllib.parse import quote
    expected_builders = {
        "https://noizeniche.github.io/the-dirt-archive/builder.html?builder="
        + quote(builder, safe="")
        for builder in {
            str(item.get("company") or "").strip()
            for item in sitemap_pedals
            if str(item.get("company") or "").strip()
        }
    }
    expected_sitemap = set(expected_static) | expected_builders
    for item in sitemap_pedals:
        expected_sitemap.add(
            "https://noizeniche.github.io/the-dirt-archive/pedal-detail.html?builder="
            + quote(str(item.get("company")).strip(), safe="")
            + "&pedal="
            + quote(str(item.get("pedal")).strip(), safe="")
        )
    if set(sitemap_locs) != expected_sitemap:
        raise SystemExit(
            f"sitemap.xml does not match the canonical catalog: expected {len(expected_sitemap)} URLs, found {len(sitemap_locs)}."
        )
    pedals = catalog.get("pedals", [])
    if catalog.get("count") != len(pedals):
        raise SystemExit("PEDAL_INDEX.json count does not match pedals length.")

    catalog_keys = [pair(x.get("company"), x.get("pedal")) for x in pedals]
    blank_identity = [
        pair(x.get("company"), x.get("pedal"))
        for x in pedals
        if not str(x.get("company") or "").strip() or not str(x.get("pedal") or "").strip()
    ]
    if blank_identity:
        raise SystemExit("Canonical catalog contains blank Builder + Pedal identity: " + str(blank_identity[:12]))
    manifest_keys = [pair(x.get("builder"), x.get("pedal")) for x in manifest]
    if len(catalog_keys) != len(set(catalog_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PEDAL_INDEX.json.")
    if len(manifest_keys) != len(set(manifest_keys)):
        raise SystemExit("Duplicate Builder + Pedal identity in PEDAL_IMAGES.json.")
    if set(catalog_keys) != set(manifest_keys):
        raise SystemExit("PEDAL_INDEX.json and PEDAL_IMAGES.json identities disagree.")

    catalog_by_key = {pair(x.get("company"), x.get("pedal")): x for x in pedals}

    local_image_owners = {}
    for entry in pedals:
        image = entry.get("image")
        if not image or re.match(r"^https?://", str(image), re.I):
            continue
        image_path = local(image)
        if not image_path.is_file():
            continue
        digest = hashlib.sha256(image_path.read_bytes()).hexdigest()
        local_image_owners.setdefault(digest, []).append(
            pair(entry.get("company"), entry.get("pedal"))
        )
    duplicate_local_blobs = {
        digest: keys for digest, keys in local_image_owners.items() if len(set(keys)) > 1
    }
    if duplicate_local_blobs:
        examples = "; ".join(
            digest[:12] + ": " + ", ".join(f"{builder} / {pedal}" for builder, pedal in keys)
            for digest, keys in list(duplicate_local_blobs.items())[:8]
        )
        raise SystemExit(
            "Distinct pedal identities share identical local image bytes. "
            "Review photo provenance before publication: " + examples
        )

    with PHOTO_SOURCE_OVERRIDES.open(newline="", encoding="utf-8") as handle:
        overrides = list(csv.DictReader(handle))
    with PHOTO_DIRECT_IMAGE_OVERRIDES.open(newline="", encoding="utf-8") as handle:
        direct_overrides = list(csv.DictReader(handle))
    with RESEARCH_SOURCE_OVERRIDES.open(newline="", encoding="utf-8") as handle:
        research_overrides = list(csv.DictReader(handle))

    for label, rows in (
        ("PHOTO_SOURCE_OVERRIDES.csv", overrides),
        ("PHOTO_DIRECT_IMAGE_OVERRIDES.csv", direct_overrides),
        ("RESEARCH_SOURCE_OVERRIDES.csv", research_overrides),
    ):
        for row in rows:
            builder = (row.get("Builder") or "").strip()
            pedal = (row.get("Pedal") or "").strip()
            if builder and pedal and (builder, pedal) not in catalog_by_key:
                raise SystemExit(
                    f"{label} contains an orphaned catalog identity: {builder} / {pedal}"
                )
    if IDENTITY_ALIASES.is_file():
        with IDENTITY_ALIASES.open(newline="", encoding="utf-8") as handle:
            identity_aliases = list(csv.DictReader(handle))
        required_identity_alias_fields = {"Builder", "Canonical Pedal", "Alias Pedal", "Reason", "Status"}
        alias_pairs = set()
        allowed_alias_statuses = {"CONFIRMED", "REVIEW"}
        for row in identity_aliases:
            if not required_identity_alias_fields.issubset(row.keys()):
                raise SystemExit("PEDAL_IDENTITY_ALIASES.csv is missing required columns.")
            builder = (row.get("Builder") or "").strip()
            canonical = (row.get("Canonical Pedal") or "").strip()
            alias = (row.get("Alias Pedal") or "").strip()
            status = (row.get("Status") or "").strip().upper()
            if not builder or not canonical or not alias or canonical == alias:
                raise SystemExit(f"Invalid identity alias row: {row}")
            if status not in allowed_alias_statuses:
                raise SystemExit(f"Invalid identity alias status: {row}")
            k = (builder, canonical, alias)
            if k in alias_pairs:
                raise SystemExit(f"Duplicate identity alias: {k}")
            alias_pairs.add(k)
            if (builder, canonical) not in catalog_by_key:
                raise SystemExit(f"Identity alias canonical pedal is not in catalog: {k}")
            if (builder, alias) not in catalog_by_key:
                # REVIEW aliases can intentionally describe malformed legacy
                # spellings, but they still must resolve to a real archive identity
                # before they are promoted to CONFIRMED.
                if status == "CONFIRMED":
                    raise SystemExit(f"Confirmed identity alias is not in catalog: {k}")
    required_research_override_fields = {"Builder", "Pedal", "Source URL", "Note"}
    if not research_overrides:
        raise SystemExit("RESEARCH_SOURCE_OVERRIDES.csv contains no source rows.")
    research_source_keys = set()
    for row in research_overrides:
        if not required_research_override_fields.issubset(row.keys()):
            raise SystemExit("RESEARCH_SOURCE_OVERRIDES.csv is missing required columns.")
        k = pair(row.get("Builder"), row.get("Pedal"))
        url = (row.get("Source URL") or "").strip()
        if k not in catalog_by_key:
            raise SystemExit(f"Research source override contains an unknown catalog identity: {k}")
        if not re.match(r"^https?://", url, re.I):
            raise SystemExit(f"Research source override is not an HTTP(S) URL: {k} -> {url}")
        source_key = (k, url)
        if source_key in research_source_keys:
            raise SystemExit(f"Duplicate Builder + Pedal + source URL in RESEARCH_SOURCE_OVERRIDES.csv: {k} -> {url}")
        research_source_keys.add(source_key)

    required_photo_override_fields = {"Builder", "Pedal", "Image Source Page", "Notes"}
    if not overrides:
        raise SystemExit("PHOTO_SOURCE_OVERRIDES.csv contains no source rows.")
    override_by_key = {}
    override_page_keys = set()
    for row in overrides:
        if not required_photo_override_fields.issubset(row.keys()):
            raise SystemExit("PHOTO_SOURCE_OVERRIDES.csv is missing required columns.")
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
            for provenance in (entry.get("image_source_url"), entry.get("image_source_page"), entry.get("source_page")):
                if provenance and forbidden_photo_provenance(provenance):
                    raise SystemExit(f"Local image provenance points to a non-pedal asset: {k} -> {provenance}")
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
        ("dirt-photo-recovery-v4", fast_photo_workflow),
        ("cancel-in-progress: true", fast_photo_workflow),
        ('PHOTO_BROWSER_CACHE_LIMIT: "96"', fast_photo_workflow),
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
        ("timeout 30s env GIT_TERMINAL_PROMPT=0 git push", fast_photo_workflow),
        ("timeout 30s env GIT_TERMINAL_PROMPT=0 git push", cache_workflow),
        ("timeout 30s env GIT_TERMINAL_PROMPT=0 git push", parallel_photo_workflow),
    )
    for marker, source in required_queue_hardening:
        if marker not in source:
            raise SystemExit(f"Operational queue hardening is missing: {marker}")
    if "build-pedal-facets.py" not in deploy_text:
        raise SystemExit("Deployment workflow is not generating the public technical facet index.")
    facet_builder_text = FACET_BUILDER.read_text(encoding="utf-8")
    index_viewer_text = INDEX_JS.read_text(encoding="utf-8")
    home_text = HOME.read_text(encoding="utf-8")
    for marker, source in (
        ("PHOTO_RECOVERY_MANIFEST", PHOTO_CACHE.read_text(encoding="utf-8")),
        ("recoveredRecords", PHOTO_CACHE.read_text(encoding="utf-8")),
        ("photo-recovery-results.json", fast_photo_workflow),
        ("POWER_OPTIONS", facet_builder_text),
        ('"power": list(POWER_OPTIONS)', facet_builder_text),
        ("selectedPowers", index_viewer_text),
        ("powerFacetOptions", home_text),
    ):
        if marker not in source:
            raise SystemExit(f"Viewer/recovery integration is incomplete: {marker}")
    if "build-pedal-facets.py" not in research_workflow:
        raise SystemExit("Research worker publication is not refreshing the technical facet index.")
    if "build-pedal-facets.py" not in synth_workflow:
        raise SystemExit("Research synthesis publication is not refreshing the technical facet index.")
    if "sync-public-data-version.py" in architecture_text:
        raise SystemExit("Architecture still references the retired catalog-version synchronization script.")
    home_css = (ROOT / "assets/css/archive-index.css").read_text(encoding="utf-8")
    required_home_selectors = (
        ".grid{", ".card{", ".cardMedia{", ".cardImage{",
        ".cardPlaceholder", ".pagination{", ".pageButton{", ".heroPanel{}", ".technicalPanel", ".facetButton{"
    )
    missing_home_selectors = [selector for selector in required_home_selectors if selector not in home_css]
    if missing_home_selectors:
        raise SystemExit("Home archive stylesheet is missing required UI selectors: " + ", ".join(missing_home_selectors))
    if 'PHOTO_BROWSER_CACHE_LIMIT: "120"' not in cache_workflow:
        raise SystemExit("Photo cache workflow batch limit is not the optimized 120-record window.")
    if 'PHOTO_BROWSER_RECOVERY_DEADLINE_MS: "75000"' not in cache_workflow:
        raise SystemExit("Photo cache workflow recovery deadline is not the optimized 75-second window.")
    if "cache: 'no-cache'" not in CORE.read_text(encoding="utf-8"):
        raise SystemExit("Catalog/facet fetches are not using revalidating browser caches.")
    cache_script = (ROOT / "scripts/cache-pedal-images.py").read_text(encoding="utf-8")
    photo_cache_script = (ROOT / "scripts/browser-photo-cache.mjs").read_text(encoding="utf-8")
    if "directImageOverride" not in photo_cache_script or "candidates.filter(candidate => candidate.directImageOverride)" not in photo_cache_script:
        raise SystemExit("Browser photo cache is not prioritizing exact direct-image overrides.")
    if "function screenshotImageDocumentCandidate" not in photo_cache_script:
        raise SystemExit("Browser photo cache is missing the direct image-document capture fallback.")
    if "function isLikelyNonPedalAssetUrl" not in photo_cache_script:
        raise SystemExit("Browser photo cache is missing the global non-pedal asset veto.")
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
    if '<link rel="canonical" href="./index.html">' not in home_text:
        raise SystemExit("Home page is missing its canonical URL.")
    if 'application/ld+json' not in home_text or 'SearchAction' not in home_text:
        raise SystemExit("Home page is missing archive search structured data.")
    if '<link rel="canonical" href="./pedal-detail.html">' not in detail_text:
        raise SystemExit("Pedal detail page is missing its canonical URL hook.")
    if 'meta[property="og:url"]' not in detail_text or 'meta[property="og:image"]' not in detail_text:
        raise SystemExit("Pedal detail page is missing Open Graph URL/image hooks.")
    if 'id="pedalStructuredData"' not in detail_text:
        raise SystemExit("Pedal detail page is missing structured-data hook.")
    detail_js = (ROOT / "assets/js/archive-detail.js").read_text(encoding="utf-8")
    builder_text = BUILDER.read_text(encoding="utf-8")
    if "./assets/js/archive-builder.js" not in builder_text or "./assets/css/archive-builder.css" not in builder_text:
        raise SystemExit("Builder archive page is missing its required runtime assets.")
    if "const canonicalUrl=new URL('./pedal-detail.html',location.href)" not in detail_js:
        raise SystemExit("Pedal detail canonical URL is not normalized to the base record identity.")
    if "pedalStructuredData" not in detail_js:
        raise SystemExit("Pedal detail JavaScript is not populating structured data.")
    if 'class="skipLink" href="#mainContent"' not in detail_text or 'id="mainContent"' not in detail_text:
        raise SystemExit("Detail page is missing its keyboard skip-to-content path.")
    detail_js_text = DETAIL_JS.read_text(encoding="utf-8")
    if "renderCatalogBaseline(item)" not in detail_js_text or "Catalog baseline" not in detail_js_text:
        raise SystemExit("Detail page is missing the identity-safe catalog baseline for surface records.")
    for script_path in (CORE, INDEX_JS, DETAIL_JS, DEPLOY_AUDIT, LIVE_AUDIT):
        result = subprocess.run(["node", "--check", str(script_path)], capture_output=True, text=True)
        if result.returncode:
            raise SystemExit(f"JavaScript syntax check failed: {script_path.relative_to(ROOT)}\\n{result.stderr.strip()}")
    if "function loadCatalog() {" not in (ROOT / "assets/js/archive-core.js").read_text(encoding="utf-8"):
        raise SystemExit("Shared catalog loader declaration is malformed or missing its opening brace.")
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