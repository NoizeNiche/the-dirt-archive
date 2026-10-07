#!/usr/bin/env python3
"""Validate the durable deep-research workflow state."""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRACKER = ROOT / "research/DEEP_RESEARCH_TRACKER.csv"

ALLOWED = {"PENDING", "SCOUTED", "RESEARCHING", "COMPLETE", "BLOCKED", "SCOUT_FAILED"}
REQUIRED_DOSSIER_HEADINGS = [
    "## 1. Exact identity",
    "## 2. Chronology and versions",
    "## 3. Controls and specifications",
    "## 4. Circuit and electronics",
    "## 5. Builder and designer history",
    "## 6. Lineage and relationships",
    "## 7. Historical context",
    "## 8. Sound and use context",
    "## 9. Source reconciliation",
    "## 10. Research conclusion",
]


def main() -> None:
    if not TRACKER.is_file():
        raise SystemExit("Deep research tracker is missing.")

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    required = {
        "Order", "Builder", "Pedal", "Catalog Type", "Status",
        "Dossier Path", "Scout Packet", "Last Updated", "Notes",
    }
    if not rows:
        raise SystemExit("Deep research tracker contains no records.")
    if not required.issubset(rows[0].keys()):
        raise SystemExit("Deep research tracker is missing required columns.")

    identities = set()
    orders = []
    for row in rows:
        key = (row["Builder"].strip(), row["Pedal"].strip())
        if not all(key):
            raise SystemExit(f"Blank deep-research identity: {key}")
        if key in identities:
            raise SystemExit(f"Duplicate deep-research identity: {key}")
        identities.add(key)

        order = int(row["Order"])
        orders.append(order)
        status = row["Status"].strip().upper()
        if status not in ALLOWED:
            raise SystemExit(f"Invalid deep-research status: {status} for {key}")

        dossier = ROOT / row["Dossier Path"].lstrip("./")
        packet = ROOT / row["Scout Packet"].lstrip("./")

        if status == "SCOUTED" and not packet.is_file():
            raise SystemExit(f"SCOUTED record has no scout packet: {key}")
        if status == "COMPLETE":
            if not dossier.is_file():
                raise SystemExit(f"COMPLETE record has no dossier: {key}")
            text = dossier.read_text(encoding="utf-8", errors="replace")
            missing = [heading for heading in REQUIRED_DOSSIER_HEADINGS if heading not in text]
            if missing:
                raise SystemExit(f"COMPLETE dossier is missing required sections for {key}: {missing}")
            if not re.search(r"### Sources consulted", text):
                raise SystemExit(f"COMPLETE dossier has no source table heading: {key}")

    if orders != list(range(1, len(rows) + 1)):
        raise SystemExit("Deep research Order column must be contiguous and canonical.")
    print(f"Deep research state valid: {len(rows)} records.")


if __name__ == "__main__":
    main()
