#!/usr/bin/env python3
"""Keep PRP tracker status fields aligned with the canonical pedal catalog."""

import csv
import json
from pathlib import Path

INDEX_PATH = Path("research/PEDAL_INDEX.json")
TRACKER_PATH = Path("research/PRP_TRACKER.csv")


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
    for row in rows:
        key = (row.get("Builder"), row.get("Pedal"))
        pedal = by_key.get(key)
        if pedal is None:
            raise SystemExit(f"Tracker identity missing from catalog: {key}")

        info_done = bool(pedal.get("research_record"))
        picture_done = bool(pedal.get("image"))
        complete_done = info_done and picture_done
        expected = {
            "Pedal Info": "DONE" if info_done else "NEEDED",
            "Picture": "DONE" if picture_done else "NEEDED",
            "PRP Complete": "DONE" if complete_done else "NEEDED",
            "Research Record": pedal.get("research_record") or "",
        }
        for field, value in expected.items():
            if row.get(field, "") != value:
                row[field] = value
                changed += 1

    with TRACKER_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"PRP tracker synchronized: {changed} fields updated across {len(rows)} rows.")


if __name__ == "__main__":
    main()
