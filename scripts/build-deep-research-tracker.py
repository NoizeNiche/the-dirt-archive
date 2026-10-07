#!/usr/bin/env python3
"""Build the durable Deep Research tracker from the canonical catalog."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "research/PEDAL_INDEX.json"
TRACKER = ROOT / "research/DEEP_RESEARCH_TRACKER.csv"

FIELDS = [
    "Order",
    "Builder",
    "Pedal",
    "Catalog Type",
    "Status",
    "Dossier Path",
    "Scout Packet",
    "Last Updated",
    "Notes",
]


def slug(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "_", str(value or "").strip()).strip("_")[:120] or "unknown"


def load_existing() -> dict[tuple[str, str], dict[str, str]]:
    if not TRACKER.is_file():
        return {}
    with TRACKER.open(newline="", encoding="utf-8") as handle:
        return {
            (str(row.get("Builder") or "").strip(), str(row.get("Pedal") or "").strip()): dict(row)
            for row in csv.DictReader(handle)
            if row.get("Builder") and row.get("Pedal")
        }


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    pedals = [
        item
        for item in catalog.get("pedals", [])
        if item.get("catalog_role") != "variation"
        and str(item.get("company") or "").strip()
        and str(item.get("pedal") or "").strip()
    ]

    existing = load_existing()
    rows = []

    for order, item in enumerate(pedals, start=1):
        builder = str(item["company"]).strip()
        pedal = str(item["pedal"]).strip()
        previous = existing.get((builder, pedal), {})
        builder_slug = slug(builder)
        pedal_slug = slug(pedal)

        rows.append({
            "Order": str(order),
            "Builder": builder,
            "Pedal": pedal,
            "Catalog Type": str(
                item.get("types", [""])[0]
                if isinstance(item.get("types"), list)
                else item.get("types") or ""
            ),
            "Status": previous.get("Status") or "PENDING",
            "Dossier Path": previous.get("Dossier Path") or f"./research/dossiers/{builder}/{pedal}.md",
            "Scout Packet": previous.get("Scout Packet") or f"./research/DEEP_RESEARCH_INBOX/{builder_slug}/{pedal_slug}.json",
            "Last Updated": previous.get("Last Updated", ""),
            "Notes": previous.get("Notes", ""),
        })

    TRACKER.parent.mkdir(parents=True, exist_ok=True)
    with TRACKER.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    pending = sum(row["Status"] in {"PENDING", "SCOUT_FAILED"} for row in rows)
    print(f"Deep research tracker: {len(rows)} records; {pending} pending/retryable.")


if __name__ == "__main__":
    main()
