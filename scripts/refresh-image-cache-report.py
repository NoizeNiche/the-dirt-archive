#!/usr/bin/env python3
"""Refresh photo-cache report counters from the final synchronized tracker."""

from pathlib import Path
import csv
import json
import re

REPORT = Path("research/IMAGE_CACHE_REPORT.md")
TRACKER = Path("research/PRP_TRACKER.csv")
INDEX = Path("research/PEDAL_INDEX.json")


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

    external_image_pending = 0
    if INDEX.exists():
        catalog = json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])
        rows_by_key = {(r.get("Builder"), r.get("Pedal")): r for r in rows}
        for entry in catalog:
            key = (entry.get("company"), entry.get("pedal"))
            row = rows_by_key.get(key)
            image = str(entry.get("image") or "")
            if row and row.get("Pedal Info") == "DONE" and row.get("Picture") != "DONE" and re.match(r"^https?://", image, re.I):
                external_image_pending += 1

    text = REPORT.read_text(encoding="utf-8")

    replacements = {
        "Remaining tracker photo backlog": f"Remaining tracker photo backlog: **{photo_pending}**",
        "Researched, photo pending": f"Researched, photo pending: **{researched_photo_pending}**",
        "External source images awaiting localization": f"External source images awaiting localization: **{external_image_pending}**",
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

    marker = f"- Researched, photo pending: **{researched_photo_pending}**\n"
    external_label = "- External source images awaiting localization: **"
    if external_label not in text and marker in text:
        text = text.replace(
            marker,
            marker + f"- External source images awaiting localization: **{external_image_pending}**\n",
            1,
        )

    REPORT.write_text(text, encoding="utf-8")
    print(
        "Refreshed photo-cache report from synchronized tracker: "
        f"photo-pending={photo_pending}; researched-photo-pending={researched_photo_pending}."
    )


if __name__ == "__main__":
    main()
