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

from PIL import Image, ImageStat, ImageFilter

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
ASSETS = ROOT / "assets/pedals"
KICK = ROOT / "research/PHOTO_CONTENT_AUDIT_KICK"
HIGH_CONFIDENCE = (
    "buy me a coffee",
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
    return re.sub(r"s+", " ", str(value or "").strip().lower())

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
            image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
            bands = []
            w, h = image.size
            bands.append(image)
            if h > 250:
                bands.extend([
                    image.crop((0, 0, w, min(h, int(h * 0.32)))),
                    image.crop((0, int(h * 0.68), w, h)),
                    image.crop((int(w * 0.60), 0, w, h)),
                ])
            text = " ".join(pytesseract.image_to_string(b, config="--psm 11") for b in bands)
            return norm(text)
    except Exception:
        return ""

def inspect(path: Path):
    flags = []
    ocr = ""
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
            ocr = ocr_text(path)
    except Exception as exc:
        flags.append("unreadable_image:" + str(exc)[:120])
    for phrase in HIGH_CONFIDENCE:
        if phrase in ocr:
            flags.append("donation_or_platform_overlay:" + phrase)
    return flags, ocr

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

    targets = resolve_targets(mode)
    rows = []
    high = []
    for image_path, entry in sorted(targets.items()):
        path = ROOT / image_path
        if not path.is_file():
            flags = ["missing_local_file"]
            ocr = ""
        else:
            flags, ocr = inspect(path)
        status = "SUSPECT" if flags else "PASS"
        if any(flag.startswith("donation_or_platform_overlay:") for flag in flags):
            high.append((entry.get("company") or "", entry.get("pedal") or "", image_path, flags))
        rows.append({
            "Builder": entry.get("company") or "",
            "Pedal": entry.get("pedal") or "",
            "Image": image_path,
            "Status": status,
            "Flags": "; ".join(flags),
            "OCR": ocr[:1200],
        })

    output = Path(args.output)
    write_csv(rows, output)
    suspects = [row for row in rows if row["Status"] == "SUSPECT"]
    print(f"Photo content audit mode={mode}; checked={len(rows)}; suspects={len(suspects)}; high_confidence={len(high)}")
    for builder, pedal, image, flags in high:
        print(f"HIGH-CONFIDENCE PHOTO CONTAMINATION: {builder} / {pedal} -> {image} :: {', '.join(flags)}")
    if suspects:
        for row in suspects[:100]:
            print(f"PHOTO SUSPECT: {row['Builder']} / {row['Pedal']} -> {row['Image']} :: {row['Flags']}")
    if high and args.fail_high_confidence:
        raise SystemExit("High-confidence non-product overlays were detected in one or more photos.")

if __name__ == "__main__":
    main()
