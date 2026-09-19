#!/usr/bin/env python3
"""Migrate verified pedal image URLs into the canonical local archive."""

import hashlib
import io
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(".")
INDEX_PATH = ROOT / "research/PEDAL_INDEX.json"
MANIFEST_PATH = ROOT / "research/pedals/PEDAL_IMAGES.json"
REPORT_PATH = ROOT / "research/IMAGE_CACHE_REPORT.md"
ASSET_ROOT = ROOT / "assets/pedals"
MAX_BYTES = 25 * 1024 * 1024


def key(builder, pedal):
    return f"{builder}\0{pedal}"


def slug(value):
    value = str(value or "").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "unknown"


def pedal_dir(builder, pedal):
    return ASSET_ROOT / slug(builder) / slug(pedal)


def target_path(entry):
    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    parent = entry.get("parent_pedal")
    if entry.get("catalog_role") == "variation" and parent:
        return pedal_dir(builder, parent) / "variants" / f"{slug(entry.get('variation_name') or pedal)}.webp"
    return pedal_dir(builder, pedal) / "primary.webp"


def rel_path(path):
    return "./" + path.as_posix()


def is_local(value):
    return isinstance(value, str) and bool(re.match(r"^\.?/assets/pedals/", value, re.I))


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
    if not image:
        return ("skip", entry, None, None)

    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    if not builder or not pedal:
        return ("skip", entry, None, None)

    target = target_path(entry)
    target.parent.mkdir(parents=True, exist_ok=True)

    if is_local(image):
        existing = ROOT / image.lstrip("./")
        canonical = rel_path(target)
        if existing.exists():
            return ("retain", entry, canonical, None)
        return ("failure", entry, image, "declared local cache file is missing")

    if not image.startswith(("http://", "https://")):
        return ("failure", entry, image, "unsupported image URL/path")

    if target.exists():
        return ("retain_remote", entry, target, image)

    return ("download", entry, target, image)


def download_to_target(entry, target, source_url):
    data = fetch_image(
        source_url,
        entry.get("image_source_page") or entry.get("source_page"),
    )
    with Image.open(io.BytesIO(data)) as source:
        img = ImageOps.exif_transpose(source)
        if img.width <= 0 or img.height <= 0:
            raise RuntimeError("invalid image dimensions")
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        img.save(target, "WEBP", quality=88, method=6)
    return rel_path(target)


def main():
    from concurrent.futures import ThreadPoolExecutor, as_completed

    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    cached = []
    retained = [0]
    failures = []
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)

    preparations = [cache_entry_prepare(entry) for entry in catalog.get("pedals", [])]
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

    # Eight workers gives a controlled speedup without hammering source hosts.
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {
            executor.submit(download_to_target, entry, target, source): (entry, target, source)
            for entry, target, source in downloads
        }
        for future in as_completed(futures):
            entry, target, source = futures[future]
            builder = entry.get("company") or entry.get("builder")
            pedal = entry.get("pedal")
            try:
                local = future.result()
                entry["image_source_url"] = source
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

    INDEX_PATH.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# Pedal Image Cache Report",
        "",
        f"- Cached in this run: **{len(cached)}**",
        f"- Local images retained/reorganized: **{retained[0]}**",
        f"- Download failures: **{len(failures)}**",
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
        lines += [f"- {b} - {p}: {reason} ("+q+"{url}"+q+")" for b, p, url, reason in sorted(failures)]
        lines += ["", "These records remain externally referenced until a later cache run succeeds."]
    else:
        lines += ["All pictured pedal images are locally cached."]
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Cached {len(cached)} new images; retained/reorganized {retained[0]}; {len(failures)} failures.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
