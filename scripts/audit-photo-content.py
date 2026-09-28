#!/usr/bin/env python3
"""Audit local pedal photos for blank assets and obvious non-product overlays.

This is intentionally conservative. It reports exact high-confidence donation/
support platform phrases and hard blank-image failures. It does not attempt to
decide whether ordinary product text, builder logos, or watermarks are harmful
without review.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageStat, ImageFilter
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
ASSETS = ROOT / "assets/pedals"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"
KICK = ROOT / "research/PHOTO_CONTENT_AUDIT_KICK"
HIGH_CONFIDENCE = (
    "buy me a coffee",
    "buy me coffee",
    "buymeacoffee",
    "ko-fi",
    "ko fi",
    "patreon",
    "paypal.me",
    "paypal dot me",
    "cash.app",
    "venmo",
)

def norm(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())

def load_source_blocklist():
    try:
        data = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        return data.get("rules", []) if isinstance(data, dict) else []
    except Exception:
        return []

def blocked_source(value: str, rules) -> str:
    raw = str(value or "").strip().lower()
    for rule in rules:
        kind = str(rule.get("type") or "")
        pattern = str(rule.get("pattern") or "")
        if not pattern:
            continue
        if kind == "exact_url" and raw == pattern.lower():
            return pattern
        if kind.endswith("_regex"):
            try:
                if re.search(pattern, raw, re.I):
                    return pattern
            except re.error:
                pass
    return ""

def known_bad_image_hashes(rules):
    hashes = {}
    for rule in rules:
        if str(rule.get("type") or "") != "exact_url":
            continue
        url = str(rule.get("pattern") or "").strip()
        if not re.match(r"^https?://", url, re.I):
            continue
        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0 The Dirt Archive photo audit/1.0"})
            with urlopen(req, timeout=8) as response:
                data = response.read(5 * 1024 * 1024 + 1)
            if len(data) <= 5 * 1024 * 1024:
                hashes[hashlib.sha256(data).hexdigest()] = url
        except Exception:
            pass
    return hashes

def catalog_map():
    data = json.loads(INDEX.read_text(encoding="utf-8"))
    out = {}
    for entry in data.get("pedals", []):
        image = str(entry.get("image") or "").strip()
        if not image or re.match(r"^https?://", image, re.I):
            continue
        path = image.lstrip("./")
        if path.startswith("assets/pedals/"):
            out[path] = entry
    return out

def resolve_targets(mode: str):
    mapped = catalog_map()
    if mode == "all":
        return mapped
    changed = []
    try:
        names = subprocess.check_output(
            ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD^", "HEAD"],
            text=True,
        ).splitlines()
    except Exception:
        names = []
    changed_assets = {
        str(x).strip().replace("\\", "/")
        for x in names
        if str(x).strip().startswith("assets/pedals/")
    }
    for path, entry in mapped.items():
        if path in changed_assets:
            changed.append((path, entry))
    if mode == "changed":
        return dict(changed)
    # Auto mode uses changed files when possible, otherwise a deterministic
    # 32-image smoke sample so every push gets some content-quality coverage.
    if changed:
        return dict(changed)
    items = sorted(mapped.items())[:32]
    return dict(items)

def ocr_text(image_path: Path) -> str:
    try:
        import pytesseract
        with Image.open(image_path) as image:
            image = image.convert("RGB")
            image.thumbnail((900, 900), Image.Resampling.LANCZOS)
            text = norm(pytesseract.image_to_string(image, config="--psm 11"))
            if any(term in text for term in HIGH_CONFIDENCE):
                return text
            # Most unwanted donation/platform overlays appear at the top or
            # bottom edge of listing screenshots. Only run a second OCR pass
            # when the full-frame result was inconclusive.
            w, h = image.size
            edge_band = image.crop((0, max(0, int(h * 0.72)), w, h))
            text += " " + norm(pytesseract.image_to_string(edge_band, config="--psm 11"))
            return text
    except Exception:
        return ""

def inspect(path: Path):
    flags = []
    ocr = ""
    digest = ""
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            rgba = image.convert("RGBA")
            width, height = rgba.size
            if width < 120 or height < 120:
                flags.append("tiny_dimensions")
            if path.stat().st_size < 3000:
                flags.append("tiny_file")
            stat = ImageStat.Stat(rgba.convert("RGB"))
            variance = sum(stat.var) / 3
            mean = sum(stat.mean) / 3
            if variance < 8 and mean > 245:
                flags.append("nearly_blank_light")
            if variance < 8 and mean < 10:
                flags.append("nearly_blank_dark")
            alpha = rgba.getchannel("A")
            alpha_mean = ImageStat.Stat(alpha).mean[0]
            if alpha_mean < 2:
                flags.append("fully_or_nearly_transparent")
            edge = rgba.convert("RGB").filter(ImageFilter.FIND_EDGES).resize((120,120))
            edge_mean = ImageStat.Stat(edge).mean
            if sum(edge_mean) / 3 < 3 and variance < 30:
                flags.append("extremely_low_visual_detail")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            ocr = ocr_text(path)
    except Exception as exc:
        flags.append("unreadable_image:" + str(exc)[:120])
    for phrase in HIGH_CONFIDENCE:
        if phrase in ocr:
            flags.append("donation_or_platform_overlay:" + phrase)
    return flags, ocr, digest

def write_csv(rows, output):
    with output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["Builder","Pedal","Image","Status","Flags","OCR"],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["auto","all","changed"], default="auto")
    parser.add_argument("--output", default="photo-content-audit.csv")
    parser.add_argument("--fail-high-confidence", action="store_true")
    args = parser.parse_args()

    mode = "all" if args.mode == "all" else ("changed" if args.mode == "changed" else "auto")
    if os.environ.get("PHOTO_CONTENT_AUDIT_MODE") in {"all","changed"}:
        mode = os.environ["PHOTO_CONTENT_AUDIT_MODE"]
    if os.environ.get("PHOTO_CONTENT_AUDIT_KICK") == "1" or KICK.exists() and args.mode == "auto":
        if args.mode == "auto":
            try:
                changed_text = subprocess.check_output(
                    ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD^", "HEAD"],
                    text=True,
                )
            except Exception:
                changed_text = ""
            if "research/PHOTO_CONTENT_AUDIT_KICK" in changed_text:
                mode = "all"

    rules = load_source_blocklist()
    bad_hashes = known_bad_image_hashes(rules)
    targets = resolve_targets(mode)
    rows = []
    high = []
    ordered_targets = sorted(targets.items())
    def audit_one(pair):
        image_path, entry = pair
        path = ROOT / image_path
        if not path.is_file():
            flags, ocr, digest = ["missing_local_file"], "", ""
        else:
            flags, ocr, digest = inspect(path)
            if digest in bad_hashes:
                flags.append("known_blocked_image_hash")
            for field in ("image_source_url", "image_source_page", "source_page"):
                matched = blocked_source(entry.get(field), rules)
                if matched:
                    flags.append("blocked_provenance:" + field + ":" + matched)
        row = {
            "Builder": entry.get("company") or "",
            "Pedal": entry.get("pedal") or "",
            "Image": image_path,
            "Status": "SUSPECT" if flags else "PASS",
            "Flags": "; ".join(flags),
            "OCR": ocr[:1200],
        }
        # Tiny/corrupt local images are not acceptable canonical photos. The
        # recovery/cache lane already enforces the same 3000-byte and 120px
        # minimums, so these failures can safely return to photo recovery.
        contaminated = (
            any(flag.startswith("donation_or_platform_overlay:") for flag in flags)
            or "known_blocked_image_hash" in flags
            or any(flag.startswith("blocked_provenance:") for flag in flags)
            or "tiny_file" in flags
            or "tiny_dimensions" in flags
            or any(flag.startswith("unreadable_image:") for flag in flags)
        )
        return row, contaminated
    with ThreadPoolExecutor(max_workers=max(2, min(6, (os.cpu_count() or 4)))) as executor:
        futures = [executor.submit(audit_one, pair) for pair in ordered_targets]
        results = [future.result() for future in futures]
    for row, contaminated in results:
        rows.append(row)
        if contaminated:
            high.append((row["Builder"], row["Pedal"], row["Image"], row["Flags"]))

    output = Path(args.output)
    write_csv(rows, output)
    suspects = [row for row in rows if row["Status"] == "SUSPECT"]
    bad_hash_count = sum("known_blocked_image_hash" in row["Flags"] for row in rows)
    print(f"Photo content audit mode={mode}; checked={len(rows)}; suspects={len(suspects)}; high_confidence={len(high)}; known_bad_hash_matches={bad_hash_count}")
    for builder, pedal, image, flags in high:
        print(f"HIGH-CONFIDENCE PHOTO CONTAMINATION: {builder} / {pedal} -> {image} :: {', '.join(flags)}")
    if suspects:
        for row in suspects[:100]:
            print(f"PHOTO SUSPECT: {row['Builder']} / {row['Pedal']} -> {row['Image']} :: {row['Flags']}")
    if high and args.fail_high_confidence:
        raise SystemExit("High-confidence non-product overlays were detected in one or more photos.")

if __name__ == "__main__":
    main()
