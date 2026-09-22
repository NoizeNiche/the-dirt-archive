#!/usr/bin/env python3
"""Keep PRP tracker status aligned without allowing data loss.

The catalog is authoritative for photo state. Research links are preserve-first:
a valid tracker research record wins over a temporarily stale/blank catalog link;
a catalog research record fills a blank tracker link; an invalid/missing link is
only removed when there is no valid source left.
"""

import csv
import json
import re
from pathlib import Path

INDEX_PATH = Path("research/PEDAL_INDEX.json")
TRACKER_PATH = Path("research/PRP_TRACKER.csv")


def record_exists(record):
    if not record:
        return False
    path = Path(record[2:] if record.startswith("./") else record)
    return path.exists() and path.is_file()


def image_is_usable(image):
    if not image:
        return False
    # The archive's Picture=DONE gate means the actual pedal image is archived
    # locally. External source URLs are provenance, not completed photo assets.
    if re.match(r"^https?://", image, re.I):
        return False
    if re.match(r"^\.?/assets/pedals/", image, re.I):
        return Path(re.sub(r"^\./", "", image)).is_file()
    return False


def main():
    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    pedals = catalog.get("pedals", [])
    by_key = {(x.get("company"), x.get("pedal")): x for x in pedals}

    with TRACKER_PATH.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    if None in fieldnames:
        raise SystemExit("PRP tracker header contains an unexpected extra CSV field")

    changed = 0
    research_preserved = 0
    for row in rows:
        key = (row.get("Builder"), row.get("Pedal"))
        pedal = by_key.get(key)
        if pedal is None:
            raise SystemExit(f"Tracker identity missing from catalog: {key}")

        tracker_record = row.get("Research Record") or ""
        catalog_record = pedal.get("research_record") or ""

        if tracker_record and record_exists(tracker_record):
            research_record = tracker_record
            if catalog_record != tracker_record:
                research_preserved += 1
        elif catalog_record and record_exists(catalog_record):
            research_record = catalog_record
        elif tracker_record:
            raise SystemExit(
                f"Tracker research record file is missing and catalog has no valid replacement: {key} -> {tracker_record}"
            )
        else:
            research_record = ""

        info_done = bool(research_record)
        picture_done = image_is_usable(pedal.get("image"))
        complete_done = info_done and picture_done

        expected = {
            "Pedal Info": "DONE" if info_done else "NEEDED",
            "Picture": "DONE" if picture_done else "NEEDED",
            "PRP Complete": "DONE" if complete_done else "NEEDED",
            "Research Record": research_record,
        }
        for field, value in expected.items():
            if row.get(field, "") != value:
                row[field] = value
                changed += 1

    with TRACKER_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(
        f"PRP tracker synchronized safely: {changed} fields updated across {len(rows)} rows; "
        f"{research_preserved} existing research links preserved against stale catalog links."
    )


if __name__ == "__main__":
    main()
