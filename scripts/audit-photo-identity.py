#!/usr/bin/env python3
"""Conservative archive-wide audit for photographed pedal identity conflicts.

Checks only evidence available inside the repository:
- exact duplicate local image bytes reused across different identities;
- OCR text that strongly matches another model from the same builder while
  failing to support the cataloged model.

This tool intentionally reports review candidates instead of declaring that a
photo is wrong from weak evidence.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import unicodedata
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageOps

try:
    import pytesseract
except Exception:
    pytesseract = None

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"

COMMON = {
    "the", "and", "with", "for", "from", "pedal", "guitar", "bass",
    "fuzz", "distortion", "overdrive", "drive", "effect", "effects",
    "audio", "fx", "unit", "device", "amp", "boost", "preamp", "pro",
    "mini", "micro", "mk", "mkii", "mki", "series", "edition", "version",
}

TOKEN_RE = re.compile(r"[a-z0-9]+")


def key(builder: str, pedal: str) -> tuple[str, str]:
    return (str(builder or "").strip(), str(pedal or "").strip())


def norm(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value or ""))
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return " ".join(TOKEN_RE.findall(value.lower()))


def tokens(value: str) -> list[str]:
    return [
        token for token in TOKEN_RE.findall(str(value or "").lower())
        if len(token) >= 4 or any(ch.isdigit() for ch in token)
    ]


def strong_tokens(value: str) -> list[str]:
    return [t for t in tokens(value) if t not in COMMON]


def local_path(value: str) -> Path | None:
    raw = str(value or "").strip()
    if not raw or raw.startswith(("http://", "https://")):
        return None
    normalized = raw[2:] if raw.startswith("./") else raw
    if not normalized.startswith("assets/pedals/"):
        return None
    return ROOT / normalized


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def prepare_for_ocr(path: Path):
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((1100, 1100), Image.Resampling.LANCZOS)
        gray = ImageOps.grayscale(image)
        gray = ImageOps.autocontrast(gray)
        return gray


def ocr_text(path: Path) -> str:
    if pytesseract is None:
        return ""
    try:
        image = prepare_for_ocr(path)
        text = pytesseract.image_to_string(image, config="--psm 11")
        return " ".join(str(text or "").lower().split())
    except Exception:
        return ""


def build_builder_index(catalog):
    by_builder = defaultdict(list)
    for row in catalog:
        builder = str(row.get("company") or row.get("builder") or "").strip()
        pedal = str(row.get("pedal") or "").strip()
        if not builder or not pedal:
            continue
        unique = [t for t in strong_tokens(pedal) if t not in {"tone", "model", "custom"}]
        by_builder[builder].append({
            "builder": builder,
            "pedal": pedal,
            "key": key(builder, pedal),
            "norm": norm(pedal),
            "tokens": unique,
        })
    return by_builder


def probable_conflicts(entry, text, builder_models, all_builder_tokens):
    if not text:
        return [], [], []

    target_norm = norm(entry["pedal"])
    target_tokens = set(strong_tokens(entry["pedal"]))
    target_hits = sorted(token for token in target_tokens if re.search(r"\b" + re.escape(token) + r"\b", text))
    target_phrase = bool(target_norm and len(target_norm) >= 6 and target_norm in text)

    candidate_scores = []
    for model in builder_models:
        if model["pedal"] == entry["pedal"]:
            continue
        hits = sorted(token for token in model["tokens"] if re.search(r"\b" + re.escape(token) + r"\b", text))
        phrase = bool(model["norm"] and len(model["norm"]) >= 6 and model["norm"] in text)
        score = len(hits) * 2 + (4 if phrase else 0)
        if score:
            candidate_scores.append((score, phrase, hits, model["pedal"]))

    candidate_scores.sort(reverse=True)
    suspicious = []
    for score, phrase, hits, pedal in candidate_scores[:5]:
        if score >= 4 and not target_phrase and len(target_hits) == 0:
            suspicious.append({
                "other_pedal": pedal,
                "score": score,
                "phrase_match": phrase,
                "token_hits": hits,
            })

    builder_hits = sorted(
        builder for builder, tokens_for_builder in all_builder_tokens.items()
        if builder != entry["builder"]
        and tokens_for_builder
        and any(
            re.search(r"\b" + re.escape(token) + r"\b", text)
            for token in tokens_for_builder
        )
    )
    target_builder_hits = sorted(
        token for token in all_builder_tokens.get(entry["builder"], set())
        if re.search(r"\\b" + re.escape(token) + r"\\b", text)
    )
    builder_conflicts = builder_hits[:5] if builder_hits and not target_builder_hits else []

    return target_hits, suspicious, builder_conflicts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="photo-identity-audit.csv")
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--shard", type=int, default=0)
    parser.add_argument("--shards", type=int, default=1)
    args = parser.parse_args()
    if args.shards < 1 or args.shard < 0 or args.shard >= args.shards:
        raise SystemExit("--shard must be between 0 and --shards-1")

    catalog = json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest_by_key = {
        key(row.get("builder") or row.get("company"), row.get("pedal")): row
        for row in manifest
    }

    tracker_rows = []
    with TRACKER.open(newline="", encoding="utf-8") as fh:
        tracker_rows = list(csv.DictReader(fh))

    catalog_by_key = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog
    }
    builder_index = build_builder_index(catalog)
    builder_tokens = {}
    for builder in builder_index:
        builder_tokens[builder] = set(
            token for token in strong_tokens(builder)
            if token not in {"audio", "effects", "pedals", "electronics", "devices"}
        )

    targets = []
    for tracker in tracker_rows:
        if tracker.get("Picture") != "DONE":
            continue
        identity = key(tracker.get("Builder"), tracker.get("Pedal"))
        entry = catalog_by_key.get(identity)
        if not entry:
            continue
        path = local_path(entry.get("image"))
        if not path or not path.is_file():
            continue
        targets.append((identity, entry, path))

    digest_groups = defaultdict(list)
    for identity, entry, path in targets:
        try:
            digest_groups[sha256(path)].append({
                "builder": identity[0],
                "pedal": identity[1],
                "image": str(entry.get("image") or ""),
                "source_page": str(
                    entry.get("image_source_page")
                    or manifest_by_key.get(identity, {}).get("image_source_page")
                    or ""
                ),
            })
        except OSError:
            pass

    duplicate_flags = {}
    for digest, rows in digest_groups.items():
        identities = {(row["builder"], row["pedal"]) for row in rows}
        # Different pedal identities sharing identical local bytes are always
        # worth review. A shared source page can simply mean the wrong/default
        # image was copied from a generic catalog page, so it is not an
        # acceptable exemption from the identity check.
        if len(identities) > 1:
            for row in rows:
                duplicate_flags[key(row["builder"], row["pedal"])] = {
                    "sha256": digest,
                    "records": rows,
                }

    if args.shards > 1:
        targets = [target for index, target in enumerate(sorted(targets, key=lambda row: (row[0][0].casefold(), row[0][1].casefold()))) if index % args.shards == args.shard]

    ocr_results = {}
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {
            pool.submit(ocr_text, path): identity
            for identity, _, path in targets
            if pytesseract is not None
        }
        for future in as_completed(futures):
            identity = futures[future]
            try:
                ocr_results[identity] = future.result()
            except Exception:
                ocr_results[identity] = ""

    report_rows = []
    for identity, entry, path in targets:
        text_value = ocr_results.get(identity, "")
        target_hits, probable, builder_conflicts = probable_conflicts(
            {
                "builder": identity[0],
                "pedal": identity[1],
            },
            text_value,
            builder_index.get(identity[0], []),
            builder_tokens,
        )

        status = "PASS"
        reasons = []
        if identity in duplicate_flags:
            status = "REVIEW"
            reasons.append("identical local image bytes reused across different identities")
        if probable:
            status = "REVIEW"
            reasons.append("OCR strongly matches another same-builder model")
        if builder_conflicts:
            status = "REVIEW"
            reasons.append("OCR appears to name a different builder")

        report_rows.append({
            "Builder": identity[0],
            "Pedal": identity[1],
            "Image": str(entry.get("image") or ""),
            "Status": status,
            "Reasons": " | ".join(reasons),
            "OCR Target Tokens": " | ".join(target_hits),
            "OCR Suspected Other Models": " | ".join(
                f"{item['other_pedal']} [{','.join(item['token_hits'])}]"
                for item in probable
            ),
            "OCR Suspected Other Builders": " | ".join(builder_conflicts),
            "OCR Text": text_value[:1000],
            "Duplicate SHA256": duplicate_flags.get(identity, {}).get("sha256", ""),
        })

    report_rows.sort(key=lambda row: (row["Status"] != "REVIEW", row["Builder"].lower(), row["Pedal"].lower()))

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(report_rows[0].keys()) if report_rows else [
            "Builder", "Pedal", "Image", "Status", "Reasons",
            "OCR Target Tokens", "OCR Suspected Other Models", "OCR Suspected Other Builders", "OCR Text", "Duplicate SHA256"
        ])
        writer.writeheader()
        writer.writerows(report_rows)

    review_count = sum(row["Status"] == "REVIEW" for row in report_rows)
    duplicate_count = len(duplicate_flags)
    print(
        "Photo identity audit: "
        f"{len(report_rows)} pictured records inspected, "
        f"{review_count} review candidates, "
        f"{duplicate_count} duplicate-image identities."
    )

    for row in report_rows:
        if row["Status"] == "REVIEW":
            print(
                f"REVIEW: {row['Builder']} / {row['Pedal']} -> "
                f"{row['Reasons']}"
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
