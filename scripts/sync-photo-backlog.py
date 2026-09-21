#!/usr/bin/env python3
"""Build the master list of tracker records that still need photos."""

import csv
from pathlib import Path

TRACKER = Path("research/PRP_TRACKER.csv")
REVIEW_QUEUE = Path("research/PHOTO_REVIEW_QUEUE.csv")
BACKLOG = Path("research/PHOTO_BACKLOG.csv")

FIELDS = [
    "Builder", "Pedal", "Catalog Type", "Pedal Info", "Picture",
    "PRP Complete", "Action", "Attempts", "Notes"
]


def load_review_queue():
    if not REVIEW_QUEUE.exists():
        return {}
    with REVIEW_QUEUE.open(newline="", encoding="utf-8") as handle:
        return {
            (row["Builder"], row["Pedal"]): row
            for row in csv.DictReader(handle)
        }


def main():
    review = load_review_queue()
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    backlog = []
    for row in rows:
        if row.get("Picture") == "DONE":
            continue

        key = (row.get("Builder", ""), row.get("Pedal", ""))
        parked = review.get(key)
        if parked and parked.get("Status") in {"DEEP_REVIEW", "PARKED"}:
            action = "DEEP_REVIEW"
            attempts = parked.get("Attempts", "0")
            notes = parked.get("Last Failure", "")
            if parked.get("Status") == "PARKED":
                notes = f"Parked after {attempts} automatic attempts; hold for deeper/manual photo research."
        elif row.get("Pedal Info") == "DONE":
            action = "PHOTO_NEEDED"
            attempts = "0"
            notes = "No confirmed photo archived yet."
        else:
            action = "RESEARCH_AND_PHOTO_NEEDED"
            attempts = "0"
            notes = "Research record and photo are still needed."

        backlog.append({
            "Builder": row.get("Builder", ""),
            "Pedal": row.get("Pedal", ""),
            "Catalog Type": row.get("Catalog Type", ""),
            "Pedal Info": row.get("Pedal Info", ""),
            "Picture": row.get("Picture", ""),
            "PRP Complete": row.get("PRP Complete", ""),
            "Action": action,
            "Attempts": attempts,
            "Notes": notes,
        })

    with BACKLOG.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(backlog)

    print(
        "Photo backlog synchronized: "
        f"{len(backlog)} total; "
        f"{sum(r['Action'] == 'PHOTO_NEEDED' for r in backlog)} photo-needed; "
        f"{sum(r['Action'] == 'DEEP_REVIEW' for r in backlog)} deep-review; "
        f"{sum(r['Action'] == 'RESEARCH_AND_PHOTO_NEEDED' for r in backlog)} research+photo-needed."
    )


if __name__ == "__main__":
    main()
