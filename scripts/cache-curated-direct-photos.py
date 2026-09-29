#!/usr/bin/env python3
"""Download curated exact pedal images without browser search.

This is a narrow finish-line lane. It only touches records that:
1. are still photo-pending in PRP_TRACKER.csv, and
2. have a matching row in PHOTO_DIRECT_IMAGE_OVERRIDES.csv.

The direct URL is already curator-supplied and tied to an exact source page,
so this step avoids search-engine/browser latency while keeping the existing
Pillow validation and .source -> WebP cache pipeline.
"""

from __future__ import annotations

import csv
import io
import json
import re
import subprocess
import urllib.request
from urllib.parse import quote
from pathlib import Path

from PIL import Image, UnidentifiedImageError

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
DIRECT = ROOT / "research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv"
ASSET_ROOT = ROOT / "assets/pedals"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
)
TIMEOUT = 15
MIN_BYTES = 3000


def load_blocklist() -> list[tuple[str,str]]:
    try:
        data = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        return [(str(rule.get("type") or ""), str(rule.get("pattern") or "")) for rule in data.get("rules", []) if rule.get("pattern")]
    except Exception:
        return []

def blocked_photo_url(value: str, rules: list[tuple[str,str]]) -> bool:
    lowered = str(value or "").lower()
    for kind, pattern in rules:
        try:
            if kind == "exact_url" and lowered == pattern.lower():
                return True
            if kind.endswith("_regex") and re.search(pattern, lowered, re.I):
                return True
        except re.error:
            continue
    return False

def key(builder: str, pedal: str) -> tuple[str, str]:
    return builder.strip(), pedal.strip()


def slug(value: str) -> str:
    raw = str(value or "").strip().lower()
    return re.sub(r"[^a-z0-9]+", "-", raw).strip("-") or "unknown"


def is_http_image_url(value: str) -> bool:
    # Curated direct overrides are already tied to an exact source page. Do not
    # require a filename extension here because some legitimate CDN/image
    # endpoints are extensionless or use signed query URLs. Pillow validation
    # remains the final byte-level image gate.
    return bool(re.match(r"^https?://", value, re.I))


def target_path(entry: dict) -> Path:
    builder = entry.get("company") or entry.get("builder") or ""
    pedal = entry.get("pedal") or ""
    return ASSET_ROOT / slug(builder) / slug(pedal) / "primary.source"


def fetch(url: str, source_page: str = "") -> bytes:
    last_error: Exception | None = None

    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                **({"Referer": source_page} if source_page else {}),
            },
            method="GET",
        )
        with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
            data = response.read()
            content_type = str(response.headers.get("Content-Type") or "").lower()
            if not content_type.startswith("image/"):
                raise RuntimeError(f"unexpected content type: {content_type or 'missing'}")
            if len(data) < MIN_BYTES:
                raise RuntimeError(f"payload too small: {len(data)} bytes")
            return data
    except Exception as exc:
        last_error = exc

    # Some retail/CDN image hosts behave differently for curl than urllib.
    # Retry with the same browser identity and the verified source page as the
    # Referer before abandoning a curator-supplied exact image URL.
    try:
        command = [
            "curl", "-L", "--fail", "--silent", "--show-error", "--compressed",
            "--retry", "2", "--retry-delay", "1",
            "--connect-timeout", "5", "--max-time", str(TIMEOUT),
            "-A", USER_AGENT,
            "-H", "Accept: image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
        ]
        if source_page:
            command.extend(["-e", source_page])
        command.append(url)
        proc = subprocess.run(command, check=True, capture_output=True, timeout=TIMEOUT + 8)
        data = proc.stdout or b""
        if len(data) < MIN_BYTES:
            raise RuntimeError(f"curl payload too small: {len(data)} bytes")
        return data
    except Exception as exc:
        last_error = exc

    # Finish-line exact-image leads sometimes live behind a CDN that rejects
    # direct requests but is still fetchable through a plain image relay.
    # The bytes are still sourced from the curator-supplied exact image URL;
    # the relay only changes transport.
    proxy_urls = [
        "https://wsrv.nl/?url=" + quote(url, safe=""),
        "https://images.weserv.nl/?url=" + quote(url, safe=""),
        "https://external-content.duckduckgo.com/iu/?u=" + quote(url, safe="") + "&f=1&nofb=1",
    ]
    for proxy_url in proxy_urls:
        try:
            command = [
                "curl", "-L", "--fail", "--silent", "--show-error", "--compressed",
                "--connect-timeout", "5", "--max-time", str(TIMEOUT),
                "-A", USER_AGENT,
                "-H", "Accept: image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
                proxy_url,
            ]
            proc = subprocess.run(command, check=True, capture_output=True, timeout=TIMEOUT + 8)
            data = proc.stdout or b""
            if len(data) < MIN_BYTES:
                continue
            try:
                validate(data)
            except Exception:
                continue
            return data
        except Exception as exc:
            last_error = exc

    raise RuntimeError(str(last_error or "image request failed"))


def validate(data: bytes) -> tuple[int, int]:
    try:
        with Image.open(io.BytesIO(data)) as image:
            width, height = image.size
            if width < 150 or height < 150:
                raise RuntimeError(f"image too small: {width}x{height}")
            image.verify()
        with Image.open(io.BytesIO(data)) as image:
            # Force a decode pass after verify. This catches truncated image
            # bodies that metadata parsing alone can accept.
            image.load()
            return image.size
    except UnidentifiedImageError as exc:
        raise RuntimeError(f"not a readable image: {exc}") from exc


def main() -> None:
    block_rules = load_blocklist()
    if not (INDEX.exists() and TRACKER.exists() and DIRECT.exists()):
        print("Direct-photo lane skipped: required archive files are missing.")
        return

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    catalog_by_key = {
        key(entry.get("company", ""), entry.get("pedal", "")): entry
        for entry in catalog.get("pedals", [])
    }

    pending = set()
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE":
                pending.add(key(row.get("Builder", ""), row.get("Pedal", "")))

    direct = {}
    with DIRECT.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            k = key(row.get("Builder", ""), row.get("Pedal", ""))
            image_url = str(row.get("Image URL") or "").strip()
            source_page = str(row.get("Image Source Page") or "").strip()
            if k in pending and image_url and source_page and is_http_image_url(image_url) and not blocked_photo_url(image_url, block_rules):
                direct.setdefault(k, []).append((image_url, source_page))

    recovered = 0
    skipped = 0
    failed = 0
    direct_results = []

    for k, rows in direct.items():
        entry = catalog_by_key.get(k)
        if not entry:
            failed += 1
            print(f"Missing catalog identity for direct photo override: {k[0]} / {k[1]}")
            continue

        target = target_path(entry)
        if target.exists():
            try:
                validate(target.read_bytes())
                skipped += 1
                continue
            except Exception:
                # A stale/corrupt staged source must not permanently suppress
                # recovery retries for an otherwise valid exact-image lead.
                try:
                    target.unlink()
                except Exception:
                    pass

        # Newest curated row wins. Older rows remain browser/cache fallbacks.
        image_url, source_page = rows[-1]
        try:
            data = fetch(image_url, source_page)
            width, height = validate(data)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            direct_results.append({
                "builder": k[0],
                "pedal": k[1],
                "image": "./" + target.with_suffix(".webp").as_posix(),
                "image_source_url": image_url,
                "image_source_page": source_page,
                "imageFile": "./" + target.with_suffix(".webp").as_posix(),
                "verification": {
                    "method": "direct_exact",
                    "identityVerified": True,
                    "sourceScore": 1400,
                    "strongSearchIdentity": False,
                },
            })
            print(
                f"Staged exact direct photo: {k[0]} / {k[1]} "
                f"({width}x{height}) from {source_page}"
            )
            recovered += 1
        except Exception as exc:
            failed += 1
            print(f"Direct photo failed: {k[0]} / {k[1]} -> {image_url}: {exc}")

    (ROOT / "photo-recovery-direct-results.json").write_text(
        json.dumps({"version": 1, "recovered": direct_results}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        "Curated direct-photo lane complete: "
        f"recovered={recovered}, skipped={skipped}, failed={failed}, "
        f"pending_with_direct_overrides={len(direct)}, manifest_rows={len(direct_results)}"
    )


if __name__ == "__main__":
    main()
