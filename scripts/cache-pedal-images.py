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
import subprocess
from pathlib import Path

from PIL import Image, ImageFile, ImageOps

ROOT = Path(".")
INDEX_PATH = ROOT / "research/PEDAL_INDEX.json"
MANIFEST_PATH = ROOT / "research/pedals/PEDAL_IMAGES.json"
REPORT_PATH = ROOT / "research/IMAGE_CACHE_REPORT.md"
TRACKER_PATH = ROOT / "research/PRP_TRACKER.csv"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"
PHOTO_HASH_QUARANTINE = ROOT / "research/PHOTO_HASH_QUARANTINE.csv"
ASSET_ROOT = ROOT / "assets/pedals"
MAX_BYTES = 25 * 1024 * 1024
TARGET_BUILDER = os.environ.get("PHOTO_CACHE_TARGET_BUILDER", "").strip()
TARGET_PEDAL = os.environ.get("PHOTO_CACHE_TARGET_PEDAL", "").strip()
MANIFEST_OWNERS = {}
PHOTO_BLOCK_PATTERNS = []
MANUAL_VERIFIED_PHOTOS = set()
HARD_QUARANTINED_PHOTOS = set()
RESEARCHED_PHOTO_PENDING_KEYS = set()
PROTECTED_SHARED_ASSETS = set()
CURRENT_RUN_ACCEPTED_PHOTOS = set()


def load_photo_blocklist():
    global PHOTO_BLOCK_PATTERNS
    try:
        data = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        PHOTO_BLOCK_PATTERNS = [
            (str(rule.get("type") or ""), str(rule.get("pattern") or ""), str(rule.get("severity") or ""))
            for rule in data.get("rules", [])
            if str(rule.get("pattern") or "")
        ]
    except Exception:
        PHOTO_BLOCK_PATTERNS = []

def normalize_mislabelled_webp_assets():
    """Rewrite legacy files named .webp whose bytes are another supported image format."""
    if not ASSET_ROOT.exists():
        return 0
    normalized = 0
    for path in ASSET_ROOT.rglob("*.webp"):
        try:
            with Image.open(path) as source:
                source_format = str(source.format or "").upper()
                if not source_format or source_format == "WEBP":
                    continue
                if source_format not in {"JPEG", "PNG", "GIF", "BMP", "TIFF", "AVIF"}:
                    continue
                img = ImageOps.exif_transpose(source)
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                tmp = path.with_name(path.name + ".normalize.tmp")
                img.save(tmp, "WEBP", quality=88, method=6)
                os.replace(tmp, path)
                normalized += 1
                print(f"Normalized mislabelled WebP asset: {path} ({source_format} -> WEBP)")
        except Exception as exc:
            # Some legacy sources were saved with a truncated image stream.
            # Only on a normalizer read failure, retry once with Pillow's
            # truncated-image loader, then verify the newly encoded WebP before
            # replacing the source file. This never bypasses the later
            # identity/provenance checks.
            repaired = False
            tmp = path.with_name(path.name + ".normalize.tmp")
            try:
                if tmp.exists():
                    tmp.unlink()
                ImageFile.LOAD_TRUNCATED_IMAGES = True
                with Image.open(path) as source:
                    source.load()
                    img = ImageOps.exif_transpose(source)
                    img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                    img.save(tmp, "WEBP", quality=88, method=6)
                with Image.open(tmp) as check:
                    check.verify()
                    if str(check.format or "").upper() != "WEBP":
                        raise RuntimeError(f"repaired output reported as {check.format or 'unknown'}")
                    if check.width < 120 or check.height < 120:
                        raise RuntimeError("repaired output dimensions below 120px")
                os.replace(tmp, path)
                repaired = True
                normalized += 1
                print(f"Repaired truncated image stream and normalized WebP asset: {path} ({source_format} -> WEBP)")
            except Exception as repair_exc:
                print(f"Could not normalize {path}: {exc}; truncated-stream repair failed: {repair_exc}")
                try:
                    if tmp.exists():
                        tmp.unlink()
                except OSError:
                    pass
            finally:
                ImageFile.LOAD_TRUNCATED_IMAGES = False
            if repaired:
                continue
    return normalized


def blocked_photo_url(value):
    text = str(value or "")
    lowered = text.lower()
    for kind, pattern, _severity in PHOTO_BLOCK_PATTERNS:
        try:
            if kind == "exact_url" and text.strip().lower() == pattern.strip().lower():
                return True
            if kind.endswith("_regex") and re.search(pattern, lowered, re.I):
                return True
        except re.error:
            continue
    return False

def key(builder, pedal):
    return f"{builder}\0{pedal}"

def load_current_run_accepted_photos():
    """Honor Photo Foreman's final acceptance for this exact recovery pass.

    A recovered photo can be present in the historical collision quarantine because
    the old byte-identical asset was previously untrusted. Once the current pass
    verifies the exact Builder + Pedal identity, that fresh acceptance must outrank
    the stale quarantine for this run so the asset can reach canonical state.
    """
    global CURRENT_RUN_ACCEPTED_PHOTOS
    verdict_path = ROOT / "recovery-artifacts" / "photo-foreman-verdict.json"
    CURRENT_RUN_ACCEPTED_PHOTOS = set()
    try:
        data = json.loads(verdict_path.read_text(encoding="utf-8"))
    except Exception:
        return
    for row in data.get("verdicts", []):
        if row.get("accepted") is True:
            builder = str(row.get("builder") or "").strip()
            pedal = str(row.get("pedal") or "").strip()
            if builder and pedal:
                CURRENT_RUN_ACCEPTED_PHOTOS.add(key(builder, pedal))


def load_hard_quarantined_photos():
    global HARD_QUARANTINED_PHOTOS
    rows = []
    try:
        with PHOTO_HASH_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
    except Exception:
        HARD_QUARANTINED_PHOTOS = set()
        return

    builders_by_hash = {}
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        builder = str(row.get("Builder") or "").strip()
        if digest and builder:
            builders_by_hash.setdefault(digest, set()).add(builder)

    HARD_QUARANTINED_PHOTOS = set()
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        builder = str(row.get("Builder") or "").strip()
        pedal = str(row.get("Pedal") or "").strip()
        if digest and builder and pedal and len(builders_by_hash.get(digest, set())) > 1:
            HARD_QUARANTINED_PHOTOS.add(key(builder, pedal))


def load_manual_verified_photos():
    global MANUAL_VERIFIED_PHOTOS
    path = ROOT / "research/PHOTO_MANUAL_REVIEW.csv"
    MANUAL_VERIFIED_PHOTOS = set()
    try:
        with path.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                if str(row.get("Status") or "").strip().upper() == "VERIFIED_PRIMARY":
                    builder = str(row.get("Builder") or "").strip()
                    pedal = str(row.get("Pedal") or "").strip()
                    if builder and pedal:
                        MANUAL_VERIFIED_PHOTOS.add(key(builder, pedal))
                    # A direct override explicitly marked PHOTO REVIEW: PRIMARY
                    # is equivalent review evidence, even if an older/manual
                    # roster entry has not yet synchronized.
                    try:
                        direct_path = ROOT / "research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv"
                        with direct_path.open(newline="", encoding="utf-8") as direct_handle:
                            for direct_row in csv.DictReader(direct_handle):
                                note = str(direct_row.get("Notes") or "").lower()
                                db = str(direct_row.get("Builder") or "").strip()
                                dp = str(direct_row.get("Pedal") or "").strip()
                                if db and dp and "photo review: primary" in note:
                                    MANUAL_VERIFIED_PHOTOS.add(key(db, dp))
                    except Exception:
                        pass
    except Exception:
        pass


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
    if blocked_photo_url(url):
        raise RuntimeError("photo source is blocked by PHOTO_SOURCE_BLOCKLIST")
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

    # Some marketplace CDNs reject urllib's HTTP fingerprint while allowing
    # a conventional browser-style curl request. Keep this fallback bounded
    # and only return bytes that still satisfy the archive size contract.
    curl_cmd = [
        "curl", "-L", "--silent", "--show-error", "--fail", "--compressed",
        "--connect-timeout", "4", "--max-time", "12",
        "-A", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
              "Chrome/140.0.0.0 Safari/537.36",
        "-H", headers["Accept"],
    ]
    if referer and referer.startswith("http"):
        curl_cmd += ["-e", referer]
    curl_cmd.append(url)
    try:
        proc = subprocess.run(
            curl_cmd,
            capture_output=True,
            timeout=15,
            check=False,
        )
        if proc.returncode == 0:
            data = proc.stdout
            if len(data) > MAX_BYTES:
                raise RuntimeError("image exceeds 25 MB download limit")
            if data:
                return data
            last_error = RuntimeError("curl returned no image bytes")
        else:
            stderr = (proc.stderr or b"").decode("utf-8", "replace").strip()
            last_error = RuntimeError(stderr or f"curl exited {proc.returncode}")
    except Exception as exc:
        last_error = exc

    raise RuntimeError(str(last_error))


MIN_PHOTO_BYTES = 3000
MIN_PHOTO_DIMENSION = 120


def valid_photo_file(path):
    try:
        if not path.is_file() or path.stat().st_size < MIN_PHOTO_BYTES:
            return False
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            return image.width >= MIN_PHOTO_DIMENSION and image.height >= MIN_PHOTO_DIMENSION
    except Exception:
        return False


def valid_photo_bytes(data):
    if len(data) < MIN_PHOTO_BYTES:
        raise RuntimeError("source image too small")
    try:
        with Image.open(io.BytesIO(data)) as image:
            image.verify()
        with Image.open(io.BytesIO(data)) as image:
            if image.width < MIN_PHOTO_DIMENSION or image.height < MIN_PHOTO_DIMENSION:
                raise RuntimeError("source image dimensions below 120px")
    except Exception as exc:
        if "below 120px" in str(exc) or "too small" in str(exc):
            raise
        raise RuntimeError(f"invalid image data: {exc}") from exc


def cache_entry_prepare(entry):
    image = entry.get("image")
    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    if not builder or not pedal:
        return ("skip", entry, None, None)

    target = target_path(entry)
    target.parent.mkdir(parents=True, exist_ok=True)

    entry_key = key(builder, pedal)

    # A hard-quarantined image that is not manually verified is never allowed
    # to resurrect from an old local file while the tracker is photo-pending.
    # This prevents sync-prp-tracker.py from turning a known-collision asset
    # back into Picture=DONE merely because the stale file still exists.
    if (
        target.exists()
        and entry_key in HARD_QUARANTINED_PHOTOS
        and entry_key not in MANUAL_VERIFIED_PHOTOS
        and entry_key not in CURRENT_RUN_ACCEPTED_PHOTOS
        and entry_key in RESEARCHED_PHOTO_PENDING_KEYS
    ):
        if str(target) in PROTECTED_SHARED_ASSETS:
            return ("clear", entry, None, "shared asset protected by verified sibling")
        for candidate in (target, target.with_suffix(".source")):
            try:
                if candidate.exists() and candidate.is_file():
                    candidate.unlink()
                    print(f"Removed quarantined local photo awaiting manual verification: {candidate}")
            except OSError:
                pass
        return ("clear", entry, None, "hard-quarantined local asset removed")

    # A prior browser-recovery pass may already have converted the staged
    # source into the canonical local asset. Reattach it only when the file
    # satisfies the same minimum photo contract used by the recovery foreman.
    # Invalid stale assets are removed so they cannot be silently republished.
    if target.exists():
        if valid_photo_file(target):
            return ("retain", entry, rel_path(target), None)
        print(f"Removing invalid local photo before cache conversion: {target}")
        try:
            target.unlink()
        except OSError:
            pass

    # Browser-assisted recovery may have staged the exact source bytes next
    # to the canonical target. Convert them into the public WebP archive.
    if not target.exists():
        for staged in (target.with_suffix(".source"), target.with_suffix(".png"), target.with_suffix(".jpg"), target.with_suffix(".jpeg")):
            if staged.exists():
                data = staged.read_bytes()
                valid_photo_bytes(data)
                with Image.open(io.BytesIO(data)) as source:
                    img = ImageOps.exif_transpose(source)
                    img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                    img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                    img.save(target, "WEBP", quality=88, method=6)
                if not valid_photo_file(target):
                    try:
                        target.unlink()
                    except OSError:
                        pass
                    raise RuntimeError("converted staged photo failed canonical size/dimension validation")
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
        and key(entry.get("company") or entry.get("builder"), entry.get("pedal")) in MANUAL_VERIFIED_PHOTOS
        and re.match(r"^https?://", curated_source_url, re.I)
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
        if (
            source_url
            and key(entry.get("company") or entry.get("builder"), entry.get("pedal")) in MANUAL_VERIFIED_PHOTOS
            and re.match(r"^https?://", source_url, re.I)
        ):
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
        if (
            source_url
            and key(entry.get("company") or entry.get("builder"), entry.get("pedal")) in MANUAL_VERIFIED_PHOTOS
            and source_url.startswith(("http://", "https://"))
        ):
            return ("download", entry, target, source_url)
        return ("clear", entry, None, "declared local cache file is missing")

    if not image.startswith(("http://", "https://")):
        return ("failure", entry, image, "unsupported image URL/path")

    if target.exists():
        return ("retain_remote", entry, target, image)

    entry_key = key(builder, pedal)
    if entry_key in RESEARCHED_PHOTO_PENDING_KEYS and entry_key not in MANUAL_VERIFIED_PHOTOS:
        # A pending archive record may still carry an old external runtime image.
        # Do not silently promote that stale URL into the canonical local archive
        # without an explicit visual review or a browser-captured exact source.
        return ("skip", entry, None, None)

    return ("download", entry, target, image)


def download_to_target(entry, target, source_url):
    # Curated direct-image overrides may contain several exact fallback URLs.
    # Try every explicit URL before falling back to images discovered from the
    # already verified source page. Previously only image_source_url was used,
    # which left alternate exact images stranded in metadata when the primary
    # CDN URL returned 401/403/500.
    sources = []
    for value in entry.get("image_source_urls") or []:
        value = str(value or "").strip()
        if value and value.startswith(("http://", "https://")):
            sources.append(value)
    if source_url and source_url.startswith(("http://", "https://")):
        sources.insert(0, source_url)

    page_url = entry.get("image_source_page") or entry.get("source_page")
    if page_url and page_url.startswith(("http://", "https://")):
        sources += image_candidates_from_page(page_url)

    errors = []
    for candidate in list(dict.fromkeys(sources)):
        try:
            data = fetch_image(candidate, page_url)
            valid_photo_bytes(data)
            with Image.open(io.BytesIO(data)) as source:
                img = ImageOps.exif_transpose(source)
                if img.width <= 0 or img.height <= 0:
                    raise RuntimeError("invalid image dimensions")
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
                img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                img.save(target, "WEBP", quality=88, method=6)
            if not valid_photo_file(target):
                try:
                    target.unlink()
                except OSError:
                    pass
                raise RuntimeError("downloaded photo failed canonical size/dimension validation")
            return rel_path(target), candidate
        except Exception as exc:
            errors.append(f"{candidate}: {exc}")
    raise RuntimeError(" | ".join(errors[:6]))



def convert_staged_sources():
    """Turn browser-recovery .source files into canonical WebP assets.

    Browser recovery only writes a .source file after an exact pedal match has
    been verified. Converting these files here prevents a successful photo find
    from being stranded between discovery and the public catalog.
    """
    converted = 0
    discarded = 0
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
            # A corrupt or truncated .source must never block the other
            # successfully recovered photos in the same pass. Discard the
            # unusable staging file so the next browser-recovery pass can
            # retry that pedal from its verified provenance instead.
            discarded += 1
            print(f"Discarding unreadable staged photo {staged}: {exc}")
            try:
                staged.unlink()
            except OSError:
                pass
    if discarded:
        print(f"Discarded {discarded} unreadable staged browser-recovery photos for retry.")
    return converted


def main():
    from concurrent.futures import ThreadPoolExecutor, as_completed

    load_photo_blocklist()
    load_manual_verified_photos()
    load_current_run_accepted_photos()
    load_hard_quarantined_photos()
    normalized_existing = normalize_mislabelled_webp_assets()
    if normalized_existing:
        print(f"Normalized {normalized_existing} existing mislabelled .webp assets.")

    staged_converted = convert_staged_sources()
    if staged_converted:
        print(f"Converted {staged_converted} staged browser-recovery photos into canonical WebP assets.")

    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    global MANIFEST_OWNERS, PROTECTED_SHARED_ASSETS
    PROTECTED_SHARED_ASSETS = {
        str(Path(str(entry.get("image")).lstrip("./")))
        for entry in catalog.get("pedals", [])
        if key(entry.get("company") or entry.get("builder"), entry.get("pedal")) in MANUAL_VERIFIED_PHOTOS
        and is_local(str(entry.get("image") or ""))
    }

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
        key(row.get("Builder", ""), row.get("Pedal", ""))
        for row in tracker_rows
        if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE"
    }
    global RESEARCHED_PHOTO_PENDING_KEYS
    RESEARCHED_PHOTO_PENDING_KEYS = researched_photo_pending_keys

    cached = []
    retained = [0]
    cleared = []
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
        elif status == "clear":
            entry["image"] = ""
            cleared.append((
                entry.get("company") or entry.get("builder"),
                entry.get("pedal"),
                source or "local image cleared",
            ))
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
        if "image" in source:
            entry["image"] = source.get("image") or ""
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
        f"- Cleared stale/quarantined local image references: **{len(cleared)}**",
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

    print(
        f"Cached {len(cached)} new images; retained/reorganized {retained[0]}; "
        f"cleared {len(cleared)} stale/quarantined references; {len(failures)} failures."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
