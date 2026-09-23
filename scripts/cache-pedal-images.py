#!/usr/bin/env python3
"""Migrate verified pedal image URLs into the canonical local archive."""

import csv
import hashlib
import io
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
import html
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(".")
INDEX_PATH = ROOT / "research/PEDAL_INDEX.json"
MANIFEST_PATH = ROOT / "research/pedals/PEDAL_IMAGES.json"
REPORT_PATH = ROOT / "research/IMAGE_CACHE_REPORT.md"
TRACKER_PATH = ROOT / "research/PRP_TRACKER.csv"
ASSET_ROOT = ROOT / "assets/pedals"
MAX_BYTES = 25 * 1024 * 1024
TARGET_BUILDER = os.environ.get("PHOTO_CACHE_TARGET_BUILDER", "").strip()
TARGET_PEDAL = os.environ.get("PHOTO_CACHE_TARGET_PEDAL", "").strip()
MANIFEST_OWNERS = {}


def key(builder, pedal):
    return f"{builder}\0{pedal}"


def slug(value):
    value = str(value or "").strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", value).strip("-") or "unknown"
    if len(normalized) <= 90:
        return normalized
    digest = hashlib.sha1(value.encode("utf-8")).hexdigest()[:10]
    return normalized[:79].rstrip("-") + "-" + digest


def exact_identity(value):
    return str(value or "").strip().lower()


def collision_slug(value):
    raw = str(value or "").strip()
    readable = slug(raw.replace("+", " plus "))
    base = slug(raw)
    if readable != base:
        return readable
    return base + "-" + hashlib.sha1(raw.encode("utf-8")).hexdigest()[:8]


def same_manifest_owner(owner, entry):
    if not owner:
        return False
    builder = entry.get("company") or entry.get("builder") or ""
    return exact_identity(owner.get("builder")) == exact_identity(builder) and         exact_identity(owner.get("pedal")) == exact_identity(entry.get("pedal"))


def safe_asset_slug(builder, name, build_path, entry):
    base = slug(name)
    base_path = build_path(base)
    owner = MANIFEST_OWNERS.get(rel_path(base_path))
    if not base_path.exists() or not owner or same_manifest_owner(owner, entry):
        return base

    candidate = collision_slug(name)
    candidate_path = build_path(candidate)
    candidate_owner = MANIFEST_OWNERS.get(rel_path(candidate_path))
    if candidate_path.exists() and candidate_owner and not same_manifest_owner(candidate_owner, entry):
        candidate = base + "-" + hashlib.sha1(str(name or "").encode("utf-8")).hexdigest()[:8]
    return candidate


def pedal_dir(builder, pedal):
    return ASSET_ROOT / slug(builder) / slug(pedal)


def target_path(entry):
    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    parent = entry.get("parent_pedal")
    if entry.get("catalog_role") == "variation" and parent:
        parent_dir = pedal_dir(builder, parent) / "variants"
        variant = entry.get("variation_name") or pedal
        variant_slug = safe_asset_slug(builder, variant, lambda candidate: parent_dir / f"{candidate}.webp", entry)
        return parent_dir / f"{variant_slug}.webp"
    builder_slug = slug(builder)
    pedal_slug = safe_asset_slug(
        builder,
        pedal,
        lambda candidate: ASSET_ROOT / builder_slug / candidate / "primary.webp",
        entry,
    )
    return ASSET_ROOT / builder_slug / pedal_slug / "primary.webp"


def rel_path(path):
    return "./" + path.as_posix()


def is_local(value):
    return isinstance(value, str) and bool(re.match(r"^\.?/assets/pedals/", value, re.I))


def fetch_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; The Dirt Archive image cache/1.0)",
        "Accept": "text/html,application/xhtml+xml",
    }
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=15) as response:
        return response.read(2_000_000).decode("utf-8", errors="ignore")


def image_candidates_from_page(page_url):
    try:
        source_html = fetch_page(page_url)
    except Exception:
        return []

    candidates = []
    patterns = [
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']',
        r'<link[^>]+rel=["\']image_src["\'][^>]+href=["\']([^"\']+)["\']',
    ]
    for pattern in patterns:
        for match in re.findall(pattern, source_html, flags=re.I):
            candidates.append(html.unescape(urllib.parse.urljoin(page_url, match)))

    # JSON-LD product images are useful when the page does not expose og:image.
    for raw in re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', source_html, flags=re.I | re.S):
        try:
            data = json.loads(html.unescape(raw))
        except Exception:
            continue
        nodes = data if isinstance(data, list) else [data]
        for node in nodes:
            if not isinstance(node, dict):
                continue
            image = node.get("image")
            values = image if isinstance(image, list) else [image]
            for value in values:
                if isinstance(value, dict):
                    value = value.get("url") or value.get("contentUrl")
                if isinstance(value, str) and value:
                    candidates.append(html.unescape(urllib.parse.urljoin(page_url, value)))

    # Preserve order while removing duplicates.
    return list(dict.fromkeys(candidates))


def fetch_image(url, referer=None):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; The Dirt Archive image cache/1.0)",
        "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
    }
    if referer and referer.startswith("http"):
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    last_error = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                data = response.read()
                if len(data) > MAX_BYTES:
                    raise RuntimeError("image exceeds 25 MB download limit")
                return data
        except Exception as exc:
            last_error = exc
            if attempt < 1:
                time.sleep(2 ** attempt)
    raise RuntimeError(str(last_error))


def cache_entry_prepare(entry):
    image = entry.get("image")
    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    if not builder or not pedal:
        return ("skip", entry, None, None)

    target = target_path(entry)
    target.parent.mkdir(parents=True, exist_ok=True)

    # Browser-assisted recovery may have staged the exact source bytes next
    # to the canonical target. Convert them into the public WebP archive.
    if not target.exists():
        for staged in (target.with_suffix(".source"), target.with_suffix(".png"), target.with_suffix(".jpg"), target.with_suffix(".jpeg")):
            if staged.exists():
                with Image.open(staged) as source:
                    img = ImageOps.exif_transpose(source)
                    img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                    img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                    img.save(target, "WEBP", quality=88, method=6)
                try:
                    staged.unlink()
                except OSError:
                    pass
                return ("retain", entry, rel_path(target), None)

    # Curated direct-image overrides are authoritative over any legacy
    # external image URL still stored in the catalog. Prefer the verified
    # provenance URL before considering the stale public image field.
    curated_source_url = str(entry.get("image_source_url") or "").strip()
    if (
        curated_source_url
        and entry.get("image_source_page_verified") is True
        and re.match(r"^https?://", curated_source_url, re.I)
        and re.search(r"\\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$", curated_source_url, re.I)
    ):
        return ("download", entry, target, curated_source_url)

    # A photo-pending record can carry a verified provenance URL without
    # advertising that URL as the public runtime image. Use it as the cache
    # source and keep the public image field blank until a local file exists.
    if not image:
        source_url = entry.get("image_source_url")
        # Retry direct image provenance URLs, but never treat a product/source
        # page URL as if it were an image. Exact page sources are handled by
        # browser-photo-cache.mjs first.
        if source_url and re.match(r"^https?://", source_url, re.I) and re.search(r"\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$", source_url, re.I):
            return ("download", entry, target, source_url)
        return ("skip", entry, None, None)

    if is_local(image):
        existing = ROOT / image.lstrip("./")
        if existing.exists():
            # Preserve the declared local path exactly. This avoids relocating
            # legacy long-form slugs during a cache-only maintenance run.
            return ("retain", entry, image, None)
        # A local path can be declared before the first successful cache run.
        # When the file is absent, fall back to the stored provenance URL instead
        # of treating the missing local file as permanently uncacheable.
        source_url = entry.get("image_source_url")
        if source_url and source_url.startswith(("http://", "https://")):
            return ("download", entry, target, source_url)
        return ("failure", entry, image, "declared local cache file is missing and no provenance URL is available")

    if not image.startswith(("http://", "https://")):
        return ("failure", entry, image, "unsupported image URL/path")

    if target.exists():
        return ("retain_remote", entry, target, image)

    return ("download", entry, target, image)


def download_to_target(entry, target, source_url):
    sources = [source_url]
    page_url = entry.get("image_source_page") or entry.get("source_page")
    if page_url and page_url.startswith(("http://", "https://")):
        sources += image_candidates_from_page(page_url)

    errors = []
    for candidate in list(dict.fromkeys(sources)):
        try:
            data = fetch_image(candidate, page_url)
            with Image.open(io.BytesIO(data)) as source:
                img = ImageOps.exif_transpose(source)
                if img.width <= 0 or img.height <= 0:
                    raise RuntimeError("invalid image dimensions")
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                img.save(target, "WEBP", quality=88, method=6)
            return rel_path(target), candidate
        except Exception as exc:
            errors.append(f"{candidate}: {exc}")
    raise RuntimeError(" | ".join(errors[:4]))



def convert_staged_sources():
    """Turn browser-recovery .source files into canonical WebP assets.

    Browser recovery only writes a .source file after an exact pedal match has
    been verified. Converting these files here prevents a successful photo find
    from being stranded between discovery and the public catalog.
    """
    converted = 0
    failures = []
    for staged in ASSET_ROOT.rglob("*.source"):
        target = staged.with_suffix(".webp")
        if target.exists():
            try:
                staged.unlink()
            except OSError:
                pass
            continue
        try:
            data = staged.read_bytes()
            with Image.open(io.BytesIO(data)) as source:
                img = ImageOps.exif_transpose(source)
                if img.width <= 0 or img.height <= 0:
                    raise RuntimeError("invalid image dimensions")
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                img.save(target, "WEBP", quality=88, method=6)
            staged.unlink()
            converted += 1
        except Exception as exc:
            failures.append(f"{staged}: {exc}")
    if failures:
        raise RuntimeError("Staged photo conversion failures: " + " | ".join(failures[:8]))
    return converted


def main():
    from concurrent.futures import ThreadPoolExecutor, as_completed

    staged_converted = convert_staged_sources()
    if staged_converted:
        print(f"Converted {staged_converted} staged browser-recovery photos into canonical WebP assets.")

    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    global MANIFEST_OWNERS
    MANIFEST_OWNERS = {
        str(row.get("image")): {
            "builder": row.get("builder") or row.get("company") or "",
            "pedal": row.get("pedal") or "",
        }
        for row in manifest
        if row.get("image")
    }

    tracker_rows = []
    if TRACKER_PATH.exists():
        with TRACKER_PATH.open(newline="", encoding="utf-8") as handle:
            tracker_rows = list(csv.DictReader(handle))
    tracker_photo_pending = {
        (row.get("Builder", ""), row.get("Pedal", ""))
        for row in tracker_rows
        if row.get("Picture") != "DONE"
    }
    researched_photo_pending_keys = {
        (row.get("Builder", ""), row.get("Pedal", ""))
        for row in tracker_rows
        if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE"
    }

    cached = []
    retained = [0]
    failures = []
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)

    entries = catalog.get("pedals", [])
    if TARGET_BUILDER or TARGET_PEDAL:
        entries = [
            entry for entry in entries
            if (not TARGET_BUILDER or str(entry.get("company") or entry.get("builder") or "").strip() == TARGET_BUILDER)
            and (not TARGET_PEDAL or str(entry.get("pedal") or "").strip() == TARGET_PEDAL)
        ]
        if not entries:
            raise RuntimeError("Photo cache target not found in PEDAL_INDEX.json")
    else:
        # Bulk caching handles the normal photo backlog plus any catalog entries
        # that still point at an external image. The browser recovery lane can
        # verify a localizable copy of an externally hosted photo, so those
        # records must reach this conversion step even though their tracker
        # Picture field is already DONE.
        entries = [
            entry for entry in entries
            if (
                (str(entry.get("company") or entry.get("builder") or "").strip(),
                 str(entry.get("pedal") or "").strip()) in tracker_photo_pending
                or re.match(r"^https?://", str(entry.get("image") or ""), re.I)
            )
        ]
    preparations = [cache_entry_prepare(entry) for entry in entries]
    downloads = []
    for status, entry, target, source in preparations:
        if status == "retain":
            entry["image"] = target
            retained[0] += 1
        elif status == "retain_remote":
            entry["image_source_url"] = source
            entry["image"] = rel_path(target)
            retained[0] += 1
        elif status == "failure":
            failures.append((entry.get("company") or entry.get("builder"), entry.get("pedal"), target, source))
        elif status == "download":
            downloads.append((entry, target, source))

    # Six workers keeps the download stage bounded and avoids hammering source hosts.
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {
            executor.submit(download_to_target, entry, target, source): (entry, target, source)
            for entry, target, source in downloads
        }
        for future in as_completed(futures):
            entry, target, source = futures[future]
            builder = entry.get("company") or entry.get("builder")
            pedal = entry.get("pedal")
            try:
                local, fetched_source = future.result()
                entry["image_source_url"] = fetched_source
                entry["image"] = local
                cached.append((builder, pedal, local))
            except Exception as exc:
                failures.append((builder, pedal, source, str(exc)))

    catalog_by_key = {
        key(x.get("company"), x.get("pedal")): x
        for x in catalog.get("pedals", [])
    }
    for entry in manifest:
        builder = entry.get("builder") or entry.get("company")
        source = catalog_by_key.get(key(builder, entry.get("pedal")))
        if not source:
            continue
        if source.get("image"):
            entry["image"] = source["image"]
        if source.get("image_source_url"):
            entry["image_source_url"] = source["image_source_url"]

    catalog["photo_architecture"] = "local-first"

    # Report the true unresolved tracker-photo backlog after this pass.
    remaining_photo_backlog = sum(
        1
        for pending_key in tracker_photo_pending
        if not is_local(catalog_by_key.get(pending_key, {}).get("image"))
    )

    INDEX_PATH.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# Pedal Image Cache Report",
        "",
        f"- Cached in this run: **{len(cached)}**",
        f"- Staged browser photos converted: **{staged_converted}**",
        f"- Local images retained/reorganized: **{retained[0]}**",
        f"- Download failures: **{len(failures)}**",
        f"- Remaining tracker photo backlog: **{remaining_photo_backlog}**",
        f"- Researched, photo pending: **{len(researched_photo_pending_keys)}**",
        "",
        "## Storage layout",
        "",
        "- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`",
        "- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`",
        "- Original source URL remains stored as `image_source_url`.",
        "",
    ]
    if cached:
        lines += ["## Newly cached", ""]
        lines += [f"- {b} - {p} -> `{path}`" for b, p, path in sorted(cached)]
        lines += [""]
    if failures:
        lines += ["## Still external / failed", ""]
        lines += [f"- {b} - {p}: {reason} (`{url}`)" for b, p, url, reason in sorted(failures)]
        lines += ["", "These records remain externally referenced until a later cache run succeeds."]
    else:
        lines += ["All pictured pedal images are locally cached."]
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Cached {len(cached)} new images; retained/reorganized {retained[0]}; {len(failures)} failures.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
