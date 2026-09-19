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
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                data = response.read()
                if len(data) > MAX_BYTES:
                    raise RuntimeError("image exceeds 25 MB download limit")
                return data
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(2 ** attempt)
    raise RuntimeError(str(last_error))


def cache_entry(entry, cached, retained, failures):
    image = entry.get("image")
    if not image:
        return

    builder = entry.get("company") or entry.get("builder")
    pedal = entry.get("pedal")
    if not builder or not pedal:
        return

    target = target_path(entry)
    target.parent.mkdir(parents=True, exist_ok=True)

    if is_local(image):
        existing = ROOT / image.lstrip("./")
        canonical = rel_path(target)
        if existing.exists():
            if image != canonical:
                entry["image"] = canonical
            retained[0] += 1
            return
        failures.append((builder, pedal, image, "declared local cache file is missing"))
        return

    if not image.startswith(("http://", "https://")):
        failures.append((builder, pedal, image, "unsupported image URL/path"))
        return

    if target.exists():
        entry["image_source_url"] = image
        entry["image"] = rel_path(target)
        retained[0] += 1
        return

    try:
        data = fetch_image(image, entry.get("image_source_page") or entry.get("source_page"))
        with Image.open(io.BytesIO(data)) as source:
            img = ImageOps.exif_transpose(source)
            if img.width <= 0 or img.height <= 0:
                raise RuntimeError("invalid image dimensions")
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            img.save(target, "WEBP", quality=88, method=6)

        entry["image_source_url"] = image
        entry["image"] = rel_path(target)
        cached.append((builder, pedal, rel_path(target)))
    except Exception as exc:
        failures.append((builder, pedal, image, str(exc)))


def main():
    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    cached = []
    retained = [0]
    failures = []
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)

    for entry in catalog.get("pedals", []):
        cache_entry(entry, cached, retained, failures)

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

    # Keep the catalog metadata explicit about the photo model.
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
        lines += [f"- {b} - {p} -> `{path}`" for b, p, path in cached]
        lines += [""]
    if failures:
        lines += ["## Still external / failed", ""]
        lines += [f"- {b} - {p}: {reason} (`{url}`)" for b, p, url, reason in failures]
        lines += ["", "These records remain externally referenced until a later cache run succeeds."]
    else:
        lines += ["All pictured pedal images are locally cached."]
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Cached {len(cached)} new images; retained/reorganized {retained[0]}; {len(failures)} failures.")
    # Do not fail the run merely because some external sources are inaccessible.
    # The deploy gate decides whether publication is allowed.
    return 0


if __name__ == "__main__":
    sys.exit(main())
