#!/usr/bin/env python3
"""Finish one PRP1 atomic intake only after research and exact local photo exist."""

from __future__ import annotations

import csv
import json
import os
import re
import subprocess
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")
TRACKER = Path("research/PRP_TRACKER.csv")
PHOTO_REVIEW_QUEUE = Path("research/PHOTO_REVIEW_QUEUE.csv")


def norm(value):
    value = (value or "").lower().strip().replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "", value)


def main():
    target = json.loads(Path(".prp1-target.json").read_text(encoding="utf-8"))
    builder = target["builder"]
    pedal = target["pedal"]

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    tracker_rows = list(csv.DictReader(TRACKER.open(newline="", encoding="utf-8")))

    entry = next((x for x in catalog.get("pedals", [])
                  if norm(x.get("company")) == norm(builder)
                  and norm(x.get("pedal")) == norm(pedal)), None)
    if entry is None:
        raise SystemExit("Target catalog entry missing during finalize.")

    record = entry.get("research_record")
    if not record:
        raise SystemExit("Target research record is not present.")
    record_path = Path(record[2:] if record.startswith("./") else record)
    if not record_path.exists():
        raise SystemExit("Target research record file does not exist.")

    image = entry.get("image")
    image_path = None
    photo_complete = False
    if image and image.startswith("./assets/pedals/"):
        image_path = Path(image[2:])
        photo_complete = image_path.exists()

    manifest_entry = next((x for x in manifest
                           if norm(x.get("builder")) == norm(builder)
                           and norm(x.get("pedal")) == norm(pedal)), None)
    if manifest_entry is None:
        raise SystemExit("Target manifest entry missing.")

    review_status = None
    if PHOTO_REVIEW_QUEUE.exists():
        with PHOTO_REVIEW_QUEUE.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                if norm(row.get("Builder")) == norm(builder) and norm(row.get("Pedal")) == norm(pedal):
                    review_status = row.get("Status")
                    break

    if photo_complete:
        if manifest_entry.get("image") != image:
            raise SystemExit("Target catalog/manifest image paths disagree.")
        if not entry.get("image_source_url") or not manifest_entry.get("image_source_url"):
            raise SystemExit("Target local image is missing provenance URL.")
    elif review_status not in {"DEEP_REVIEW", "PARKED"}:
        raise SystemExit("Target has no local photo and has not been triaged for deeper review.")

    matched = 0
    for row in tracker_rows:
        if norm(row.get("Builder")) == norm(builder) and norm(row.get("Pedal")) == norm(pedal):
            row["Pedal Info"] = "DONE"
            row["Picture"] = "DONE" if photo_complete else "NEEDED"
            row["PRP Complete"] = "DONE" if photo_complete else "NEEDED"
            row["Research Record"] = record
            matched += 1
    if matched != 1:
        raise SystemExit(f"Expected exactly one target tracker row, found {matched}.")

    with TRACKER.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=tracker_rows[0].keys(), lineterminator="\n")
        writer.writeheader()
        writer.writerows(tracker_rows)

    safe_builder = re.sub(r"[^a-z0-9]+", "-", builder.lower()).strip("-")[:30]
    safe_pedal = re.sub(r"[^a-z0-9]+", "-", pedal.lower()).strip("-")[:50]
    version = f"prp1-{safe_builder}-{safe_pedal}"

    catalog["photo_architecture"] = "local-first"
    catalog["version"] = version
    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    env = dict(os.environ)
    env["DATA_VERSION"] = version
    subprocess.run(["python", "scripts/sync-public-data-version.py"], check=True, env=env)

    Path(target["queue_path"]).unlink()
    Path(".prp1-target.json").unlink()

    photo_label = "with exact local photo" if photo_complete else "with photo queued for deeper review"
    print(f"Finalized atomic PRP1 publication: {builder} - {pedal} {photo_label}")


if __name__ == "__main__":
    main()
