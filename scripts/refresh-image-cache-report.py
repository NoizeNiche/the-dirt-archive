#!/usr/bin/env python3
"""Refresh photo-cache report counters from the final synchronized tracker."""

from pathlib import Path
import csv
import re

REPORT = Path("research/IMAGE_CACHE_REPORT.md")
TRACKER = Path("research/PRP_TRACKER.csv")


def main() -> None:
    if not REPORT.exists() or not TRACKER.exists():
        return

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    photo_pending = sum(1 for row in rows if row.get("Picture") != "DONE")
    researched_photo_pending = sum(
        1
        for row in rows
        if row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE"
    )

    text = REPORT.read_text(encoding="utf-8")

    replacements = {
        "Remaining tracker photo backlog": f"Remaining tracker photo backlog: **{photo_pending}**",
        "Researched, photo pending": f"Researched, photo pending: **{researched_photo_pending}**",
    }

    for label, replacement in replacements.items():
        pattern = rf"^- {re.escape(label)}: \*\*\d+\*\*$"
        text, count = re.subn(pattern, f"- {replacement}", text, count=1, flags=re.MULTILINE)
        if count == 0 and label == "Researched, photo pending":
            marker = f"- Remaining tracker photo backlog: **{photo_pending}**\n"
            if marker in text:
                text = text.replace(
                    marker,
                    marker + f"- Researched, photo pending: **{researched_photo_pending}**\n",
                    1,
                )

    REPORT.write_text(text, encoding="utf-8")
    print(
        "Refreshed photo-cache report from synchronized tracker: "
        f"photo-pending={photo_pending}; researched-photo-pending={researched_photo_pending}."
    )


if __name__ == "__main__":
    main()
