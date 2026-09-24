#!/usr/bin/env python3
"""Remove resolved identities from the photo review queue."""

import csv
from pathlib import Path

TRACKER = Path("research/PRP_TRACKER.csv")
QUEUE = Path("research/PHOTO_REVIEW_QUEUE.csv")


def main():
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        done = {
            (row.get("Builder", ""), row.get("Pedal", ""))
            for row in csv.DictReader(handle)
            if row.get("Picture") == "DONE"
        }

    with QUEUE.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    kept = [row for row in rows if (row.get("Builder", ""), row.get("Pedal", "")) not in done]
    removed = len(rows) - len(kept)

    with QUEUE.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(kept)

    print(f"Pruned {removed} resolved photo-review records; {len(kept)} unresolved remain.")


if __name__ == "__main__":
    main()
