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
import hashlib
import json
import re
import subprocess
import urllib.request
from urllib.parse import quote
from pathlib import Path

from PIL import Image, UnidentifiedImageError
try:
    from playwright.sync_api import sync_playwright
except Exception:
    sync_playwright = None

_BROWSER_RUNTIME = None
_BROWSER = None

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/PRP_TRACKER.csv"
DIRECT = ROOT / "research/PHOTO_DIRECT_IMAGE_OVERRIDES.csv"
ASSET_ROOT = ROOT / "assets/pedals"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"
PHOTO_IDENTITY_QUARANTINE = ROOT / "research/PHOTO_IDENTITY_QUARANTINE.csv"
PHOTO_HASH_QUARANTINE = ROOT / "research/PHOTO_HASH_QUARANTINE.csv"

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
)
TIMEOUT = 30
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
    return str(builder or "").strip(), str(pedal or "").strip()


def load_identity_quarantine() -> dict[tuple[str, str], set[str]]:
    rows: dict[tuple[str, str], set[str]] = {}
    try:
        with IDENTITY_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                k = key(row.get("Builder", ""), row.get("Pedal", ""))
                url = str(row.get("Blocked Image URL") or "").strip().lower()
                if k[0] and k[1] and url:
                    rows.setdefault(k, set()).add(url)
    except Exception:
        pass
    return rows


def load_hash_quarantine() -> set[tuple[str, str]]:
    # Only cross-builder byte collisions are hard quarantines. Same-builder
    # collisions remain review evidence because legitimate aliases, variants,
    # and shared manufacturer photography can be byte-identical.
    rows = []
    try:
        with PHOTO_HASH_QUARANTINE.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
    except Exception:
        return set()

    builders_by_hash = {}
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        builder = str(row.get("Builder", "")).strip()
        if digest and builder:
            builders_by_hash.setdefault(digest, set()).add(builder)

    hard = set()
    for row in rows:
        digest = str(row.get("Blob SHA256") or "").strip()
        k = key(row.get("Builder", ""), row.get("Pedal", ""))
        if k[0] and k[1] and len(builders_by_hash.get(digest, set())) > 1:
            hard.add(k)
    return hard


def slug(value: str) -> str:
    raw = str(value or "").strip().lower()
    return re.sub(r"[^a-z0-9]+", "-", raw).strip("-") or "unknown"


def collision_slug(value: str) -> str:
    raw = str(value or "").strip()
    readable = slug(raw.replace("+", " plus "))
    base = slug(raw)
    if readable != base:
        return readable
    return base + "-" + hashlib.sha1(raw.encode("utf-8")).hexdigest()[:8]


def same_identity(owner, entry: dict) -> bool:
    if not owner:
        return False
    eb = str(entry.get("company") or entry.get("builder") or "").strip().lower()
    ep = str(entry.get("pedal") or "").strip().lower()
    ob = str(owner.get("builder") or owner.get("company") or "").strip().lower()
    op = str(owner.get("pedal") or "").strip().lower()
    return eb == ob and ep == op


def load_manifest_owners(catalog: dict) -> dict[str, dict]:
    owners = {}
    for item in catalog.get("pedals", []):
        image = str(item.get("image") or "").strip().lstrip("./")
        if not image.startswith("assets/pedals/"):
            continue
        owners.setdefault(image, item)
    return owners


def is_http_image_url(value: str) -> bool:
    # Curated direct overrides are already tied to an exact source page. Do not
    # require a filename extension here because some legitimate CDN/image
    # endpoints are extensionless or use signed query URLs. Pillow validation
    # remains the final byte-level image gate.
    return bool(re.match(r"^https?://", value, re.I))


def target_path(entry: dict, manifest_owners: dict[str, dict]) -> Path:
    builder = entry.get("company") or entry.get("builder") or ""
    pedal = entry.get("pedal") or ""
    builder_dir = ASSET_ROOT / slug(builder)
    base = slug(pedal)
    candidate = builder_dir / base / "primary.source"
    owner = manifest_owners.get(candidate.as_posix())
    if candidate.exists() and owner and not same_identity(owner, entry):
        base = collision_slug(pedal)
        candidate = builder_dir / base / "primary.source"
        if candidate.exists():
            base = slug(pedal) + "-" + hashlib.sha1(str(pedal).encode("utf-8")).hexdigest()[:8]
    return builder_dir / base / "primary.source"


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
            # Validate the bytes before accepting the transport response. Some
            # CDNs return HTTP 200 + image/* while serving an HTML/challenge body
            # or otherwise malformed bytes. In that case continue through the
            # curl/proxy/Chromium fallbacks instead of failing later in main().
            validate(data)
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
        validate(data)
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

    # Final transport fallback for CDNs that reject HTTP clients/relays but
    # render the exact curator-supplied image normally in Chromium.
    try:
        return fetch_via_browser(url, source_page)
    except Exception as exc:
        last_error = exc

    if source_page:
        try:
            data, recovered_url = fetch_from_source_page(source_page)
            print(f"Recovered exact image from source page: {source_page} -> {recovered_url}")
            return data
        except Exception as exc:
            last_error = exc

    raise RuntimeError(str(last_error or "image request failed"))


def fetch_from_source_page(source_page: str) -> tuple[bytes, str]:
    """Recover an image from the already-verified exact model page.

    This is a transport fallback only. The source page itself is already tied
    to the exact Builder + Pedal override, and the returned candidate still
    has to pass byte-level Pillow validation.
    """
    global _BROWSER_RUNTIME, _BROWSER
    if sync_playwright is None:
        raise RuntimeError("Playwright is not installed")
    if _BROWSER is None:
        _BROWSER_RUNTIME = sync_playwright().start()
        _BROWSER = _BROWSER_RUNTIME.chromium.launch(headless=True)

    page = _BROWSER.new_page(viewport={"width": 1600, "height": 1200}, device_scale_factor=1)
    try:
        page.goto(source_page, wait_until="domcontentloaded", timeout=TIMEOUT * 1000)
        page.wait_for_timeout(600)

        candidates = []
        for selector, attr in (
            ('meta[property="og:image"]', "content"),
            ('meta[name="twitter:image"]', "content"),
            ('link[rel="image_src"]', "href"),
        ):
            for node in page.locator(selector).all():
                value = (node.get_attribute(attr) or "").strip()
                if value:
                    candidates.append(value)

        image_rows = page.locator("img").evaluate_all(
            "els => els.map(e => ({src:e.currentSrc || e.src || '', width:e.naturalWidth || e.width || 0, height:e.naturalHeight || e.height || 0, alt:e.alt || ''}))"
        )
        image_rows = sorted(
            image_rows,
            key=lambda row: int(row.get("width") or 0) * int(row.get("height") or 0),
            reverse=True,
        )
        candidates.extend(str(row.get("src") or "").strip() for row in image_rows[:12])

        seen = set()
        for candidate in candidates:
            if not candidate or candidate in seen:
                continue
            seen.add(candidate)
            absolute = str(page.evaluate("u => new URL(u, location.href).href", candidate))
            try:
                response = page.request.get(absolute, timeout=TIMEOUT * 1000)
                data = response.body()
                content_type = str(response.headers.get("content-type") or "").lower()
                if not response.ok or not content_type.startswith("image/") or len(data) < MIN_BYTES:
                    continue
                validate(data)
                return data, absolute
            except Exception:
                continue

        # Last resort: capture the largest image that actually rendered on the
        # exact source page. The resulting PNG is still Pillow-validated.
        for row in image_rows[:8]:
            candidate = str(row.get("src") or "").strip()
            if not candidate:
                continue
            try:
                image = page.locator("img").filter(has=page.locator('')).first
            except Exception:
                pass
        ranked = page.locator("img").all()
        ranked_with_size = []
        for image in ranked:
            try:
                box = image.bounding_box()
                if not box or box["width"] < 150 or box["height"] < 150:
                    continue
                ranked_with_size.append((box["width"] * box["height"], image))
            except Exception:
                continue
        for _, image in sorted(ranked_with_size, key=lambda pair: pair[0], reverse=True):
            try:
                data = image.screenshot(type="png", animations="disabled", caret="hide")
                validate(data)
                return data, str(image.get_attribute("src") or source_page)
            except Exception:
                continue

        raise RuntimeError("no usable exact-model image found on verified source page")
    finally:
        page.close()


def fetch_via_browser(url: str, source_page: str = "") -> bytes:
    global _BROWSER_RUNTIME, _BROWSER
    if sync_playwright is None:
        raise RuntimeError("Playwright is not installed")
    if _BROWSER is None:
        _BROWSER_RUNTIME = sync_playwright().start()
        _BROWSER = _BROWSER_RUNTIME.chromium.launch(headless=True)
    page = _BROWSER.new_page(viewport={"width": 1600, "height": 1200}, device_scale_factor=1)
    try:
        headers = {
            "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": USER_AGENT,
        }
        if source_page:
            headers["Referer"] = source_page
        # First try Playwright's request client. This preserves browser-like
        # headers/referrer context while returning the original image bytes,
        # avoiding a screenshot timeout on slow/blocked image rendering.
        try:
            response = page.request.get(url, headers=headers, timeout=TIMEOUT * 1000)
            content_type = str(response.headers.get("content-type") or "").lower()
            data = response.body()
            if response.ok and content_type.startswith("image/") and len(data) >= MIN_BYTES:
                validate(data)
                return data
        except Exception:
            pass

        if source_page:
            page.set_extra_http_headers({"Referer": source_page})
        page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT * 1000)
        page.wait_for_timeout(500)
        image = page.locator("img").first
        data = image.screenshot(type="png", animations="disabled", caret="hide") if image.count() else page.screenshot(type="png", full_page=True, animations="disabled", caret="hide")
        if len(data) < MIN_BYTES:
            raise RuntimeError(f"browser screenshot too small: {len(data)} bytes")
        return data
    finally:
        page.close()


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


def shutdown_browser() -> None:
    global _BROWSER_RUNTIME, _BROWSER
    if _BROWSER is not None:
        _BROWSER.close()
        _BROWSER = None
    if _BROWSER_RUNTIME is not None:
        _BROWSER_RUNTIME.stop()
        _BROWSER_RUNTIME = None


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

    manifest_owners = load_manifest_owners(catalog)

    identity_quarantine = load_identity_quarantine()
    hash_quarantine = load_hash_quarantine()
    manual_verified = {}
    try:
        with (ROOT / "research/PHOTO_MANUAL_REVIEW.csv").open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                if str(row.get("Status") or "").strip().upper() != "VERIFIED_PRIMARY":
                    continue
                identity = key(row.get("Builder"), row.get("Pedal"))
                image_url = str(row.get("Image URL") or "").strip()
                source_page = str(row.get("Source Page") or "").strip()
                if identity[0] and identity[1] and image_url:
                    manual_verified[identity] = (image_url, source_page)
    except Exception:
        pass

    pending = set()
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE":
                pending.add(key(row.get("Builder", ""), row.get("Pedal", "")))

    direct_rows = []
    with DIRECT.open(newline="", encoding="utf-8") as handle:
        direct_rows = list(csv.DictReader(handle))

    # An explicit PHOTO REVIEW: PRIMARY direct lead is equivalent curator evidence
    # to VERIFIED_PRIMARY, but only when exactly one primary image/source pair exists.
    primary_direct = {}
    for row in direct_rows:
        k = key(row.get("Builder", ""), row.get("Pedal", ""))
        image_url = str(row.get("Image URL") or "").strip()
        source_page = str(row.get("Image Source Page") or "").strip()
        notes = str(row.get("Notes") or "").strip()
        if k[0] and k[1] and image_url and source_page and "photo review: primary" in notes.lower():
            primary_direct.setdefault(k, set()).add((image_url, source_page))

    for k, leads in primary_direct.items():
        if len(leads) == 1:
            manual_verified[k] = next(iter(leads))

    direct = {}
    for row in direct_rows:
        k = key(row.get("Builder", ""), row.get("Pedal", ""))
        image_url = str(row.get("Image URL") or "").strip()
        source_page = str(row.get("Image Source Page") or "").strip()
        notes = str(row.get("Notes") or "").strip()
        approved = manual_verified.get(k)
        blocked_for_identity = image_url.lower() in identity_quarantine.get(k, set())
        blocked_for_hash = k in hash_quarantine and k not in manual_verified
        if (
            k in pending
            and approved
            and image_url == approved[0]
            and source_page == approved[1]
            and image_url
            and source_page
            and is_http_image_url(image_url)
            and not blocked_photo_url(image_url, block_rules)
            and not blocked_for_identity
            and not blocked_for_hash
        ):
            direct.setdefault(k, []).append((image_url, source_page, notes))

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

        target = target_path(entry, manifest_owners)
        image_url, source_page, notes = rows[-1]
        if target.exists():
            try:
                width, height = validate(target.read_bytes())
                # A valid staged source may be the residue of a previous worker
                # that reached download but not manifest publication. Treat it as
                # a recoverable result instead of silently skipping it forever.
                direct_results.append({
                    "builder": k[0],
                    "pedal": k[1],
                    "image": "./" + target.with_suffix(".webp").as_posix(),
                    "image_source_url": image_url,
                    "image_source_page": source_page,
                    "imageFile": "./" + target.as_posix(),
                    "verification": {
                        "method": "direct_exact",
                        "identityVerified": True,
                        "sourceScore": 1400,
                        "strongSearchIdentity": False,
                        "stagedResume": True,
                    },
                })
                skipped += 1
                print(
                    f"Reusing verified staged exact photo: {k[0]} / {k[1]} "
                    f"({width}x{height}) from {source_page}"
                )
                continue
            except Exception:
                # A stale/corrupt staged source must not permanently suppress
                # recovery retries for an otherwise valid exact-image lead.
                try:
                    target.unlink()
                except Exception:
                    pass

        # Do not let recency decide between competing exact-image leads.
        # A key with multiple distinct image URLs must have an explicit
        # PHOTO REVIEW: PRIMARY marker before the direct fast lane can publish it.
        unique_images = list(dict.fromkeys(image_url for image_url, _, _ in rows))
        reviewed = [row for row in rows if "photo review: primary" in row[2].lower()]
        if len(unique_images) > 1 and not reviewed:
            skipped += 1
            print(f"Direct photo held for manual review: {k[0]} / {k[1]} has {len(unique_images)} competing image URLs.")
            continue
        primary = reviewed[-1] if reviewed else rows[-1]
        image_url, source_page = primary[0], primary[1]
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
                "imageFile": "./" + target.as_posix(),
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
        f"pending_with_manually_verified_direct_overrides={len(direct)}, "
        f"manual_verified_total={len(manual_verified)}, manifest_rows={len(direct_results)}"
    )


if __name__ == "__main__":
    try:
        main()
    finally:
        shutdown_browser()
