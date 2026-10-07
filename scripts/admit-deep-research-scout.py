#!/usr/bin/env python3
"""Admit bounded scout artifacts into the durable deep-research inbox."""

from __future__ import annotations

import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "research-evidence"
INBOX = ROOT / "research/DEEP_RESEARCH_INBOX"
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


def main() -> None:
    packets = []
    for path in sorted(ARTIFACTS.glob("*/research-evidence.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for record in data.get("records", []):
            if not record.get("builder") or not record.get("pedal"):
                continue
            packets.append(record)

    now = datetime.now(timezone.utc).isoformat()

    packet_by_key = {}
    for record in packets:
        key = (str(record["builder"]).strip(), str(record["pedal"]).strip())
        packet_by_key[key] = record
        destination = INBOX / slug(record["builder"]) / f"{slug(record['pedal'])}.json"
        destination.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "status": "SCOUTED",
            "scoutedAt": now,
            **record,
        }
        destination.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    if not TRACKER.is_file():
        raise SystemExit("Deep research tracker does not exist. Run build-deep-research-tracker.py first.")

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    for row in rows:
        key = (row.get("Builder", "").strip(), row.get("Pedal", "").strip())
        record = packet_by_key.get(key)
        if not record or row.get("Status") == "COMPLETE":
            continue
        source_count = int(record.get("sourceCount") or 0)
        strong_count = int(record.get("strongSourceCount") or 0)
        row["Status"] = "SCOUTED" if source_count > 0 else "SCOUT_FAILED"
        row["Last Updated"] = now
        row["Notes"] = (
            f"Scout packet admitted; sources={source_count}; "
            f"hosts={int(record.get('distinctHostCount') or 0)}; "
            f"strong={strong_count}"
        )

    with TRACKER.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Admitted {len(packets)} scout packets.")


if __name__ == "__main__":
    main()
