#!/usr/bin/env python3
"""Audit pictured pedal photos for suspicious cross-identity reuse.

This is intentionally conservative. It does not decide that two pedals are the
same from appearance. It only reports cases where the canonical local image
bytes are identical across distinct catalog identities, with an exception when
the records intentionally share the same verified source page.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"


def key(builder: str, pedal: str) -> tuple[str, str]:
    return (str(builder or "").strip(), str(pedal or "").strip())


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


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="/tmp/photo-hash-collisions.csv")
    parser.add_argument("--fail", action="store_true")
    args = parser.parse_args()

    catalog = load_json(INDEX).get("pedals", [])
    manifest = load_json(MANIFEST)
    manifest_by_key = {
        key(row.get("builder") or row.get("company"), row.get("pedal")): row
        for row in manifest
    }

    tracker_rows = []
    with TRACKER.open(newline="", encoding="utf-8") as fh:
        tracker_rows = list(csv.DictReader(fh))

    groups: dict[str, list[dict]] = defaultdict(list)
    missing = 0

    catalog_by_key = {
        key(row.get("company") or row.get("builder"), row.get("pedal")): row
        for row in catalog
    }

    for tracker in tracker_rows:
        if tracker.get("Picture") != "DONE":
            continue
        identity = key(tracker.get("Builder"), tracker.get("Pedal"))
        entry = catalog_by_key.get(identity)
        if not entry:
            continue
        image = local_path(entry.get("image"))
        if not image or not image.is_file():
            missing += 1
            continue
        try:
            digest = sha256(image)
        except OSError:
            continue

        manifest_entry = manifest_by_key.get(identity, {})
        groups[digest].append({
            "builder": identity[0],
            "pedal": identity[1],
            "image": str(entry.get("image") or ""),
            "source_page": str(
                entry.get("image_source_page")
                or manifest_entry.get("image_source_page")
                or ""
            ),
            "source_url": str(
                entry.get("image_source_url")
                or manifest_entry.get("image_source_url")
                or ""
            ),
        })

    collisions = []
    for digest, rows in groups.items():
        identities = {(row["builder"], row["pedal"]) for row in rows}
        if len(identities) <= 1:
            continue

        source_pages = {row["source_page"] for row in rows if row["source_page"]}
        # The same exact source page reused across aliases/duplicate catalog roles
        # is an intentional sharing pattern, not a suspicious collision.
        suspicious = not (
            len(source_pages) == 1
            and source_pages
        )
        collisions.append({
            "sha256": digest,
            "suspicious": suspicious,
            "records": rows,
        })

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "SHA256",
                "Suspicious",
                "Record Count",
                "Builders",
                "Pedals",
                "Source Pages",
            ],
        )
        writer.writeheader()
        for collision in sorted(collisions, key=lambda row: (not row["suspicious"], row["sha256"])):
            rows = collision["records"]
            writer.writerow({
                "SHA256": collision["sha256"],
                "Suspicious": "YES" if collision["suspicious"] else "SHARED_SOURCE_PAGE",
                "Record Count": len(rows),
                "Builders": " | ".join(sorted({row["builder"] for row in rows})),
                "Pedals": " | ".join(sorted({row["pedal"] for row in rows})),
                "Source Pages": " | ".join(sorted({row["source_page"] for row in rows if row["source_page"]})),
            })

    suspicious_count = sum(1 for row in collisions if row["suspicious"])
    print(
        "Pictured photo hash audit: "
        f"{len(groups)} unique local image hashes, "
        f"{len(collisions)} cross-identity collision groups, "
        f"{suspicious_count} suspicious, "
        f"{missing} Picture=DONE records missing readable local assets."
    )

    for collision in [row for row in collisions if row["suspicious"]][:20]:
        print("SUSPICIOUS PHOTO REUSE:")
        for record in collision["records"]:
            print(
                f"  - {record['builder']} / {record['pedal']} -> "
                f"{record['image']} [{record['source_page'] or 'no source page'}]"
            )

    if args.fail and suspicious_count:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
