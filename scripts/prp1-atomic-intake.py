#!/usr/bin/env python3
"""Prepare exactly one PRP1 research + photo intake in tracker order."""

from __future__ import annotations

import csv
import json
import os
import re
from pathlib import Path

QUEUE = Path(os.environ.get("PRP1_INTAKE_ROOT", "research/PRP1_INTAKE"))
TRACKER = Path("research/PRP_TRACKER.csv")
INDEX = Path("research/PEDAL_INDEX.json")


def norm(value):
    value = (value or "").lower().strip().replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "", value)


def main():
    intake_files = sorted(QUEUE.glob("*.json"))
    if not intake_files:
        raise SystemExit("No PRP1 intake package is waiting.")

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        tracker = list(csv.DictReader(handle))

    order = {(norm(row.get("Builder")), norm(row.get("Pedal"))): i for i, row in enumerate(tracker)}

    queued = []
    for path in intake_files:
        item = json.loads(path.read_text(encoding="utf-8"))
        k = (norm(item.get("builder")), norm(item.get("pedal")))
        if k not in order:
            raise SystemExit(f"PRP1 intake target is not in PRP_TRACKER.csv: {k}")
        queued.append((order[k], path, item))

    _, queue_path, item = min(queued, key=lambda x: x[0])
    builder = str(item.get("builder") or "").strip()
    pedal = str(item.get("pedal") or "").strip()
    markdown = str(item.get("research_markdown") or "").strip()

    if not builder or not pedal:
        raise SystemExit("PRP1 intake requires builder and pedal.")
    if not markdown.startswith("# "):
        raise SystemExit("research_markdown must start with a Markdown title.")

    required = [
        "## PRP identity",
        "## What this pedal is",
        "## Colorways",
        "## Versions and factory options",
        "## Version changes",
        "## Transistor",
        "## Diode",
        "## Sound",
        "## Sources checked",
    ]
    missing = [section for section in required if section not in markdown]
    if missing:
        raise SystemExit("Research record missing required sections: " + ", ".join(missing))

    row = next((r for r in tracker if norm(r.get("Builder")) == norm(builder) and norm(r.get("Pedal")) == norm(pedal)), None)
    if row is None:
        raise SystemExit("Target tracker row vanished: " + builder + " / " + pedal)
    if row.get("PRP Complete") == "DONE":
        raise SystemExit(f"{builder} - {pedal} is already complete.")

    record_path = item.get("research_record_path") or f"research/pedals/{builder}/{pedal}.md"
    record = Path(record_path)
    try:
        record.relative_to(Path("research/pedals"))
    except ValueError:
        raise SystemExit("research_record_path must remain under research/pedals/")

    record.parent.mkdir(parents=True, exist_ok=True)
    record.write_text(markdown.rstrip() + "\n", encoding="utf-8")

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    target = next(
        (x for x in catalog.get("pedals", [])
         if norm(x.get("company")) == norm(builder)
         and norm(x.get("pedal")) == norm(pedal)),
        None,
    )
    if target is None:
        raise SystemExit("Target catalog entry is missing: " + builder + " / " + pedal)

    needs_photo = True
    existing = target.get("image")
    if isinstance(existing, str) and existing.startswith("./assets/pedals/"):
        needs_photo = not Path(existing[2:]).exists()

    Path(".prp1-target.json").write_text(
        json.dumps({
            "builder": builder,
            "pedal": pedal,
            "queue_path": str(queue_path),
            "record_path": str(record),
            "needs_photo": needs_photo,
        }, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Prepared atomic PRP1 target: {builder} - {pedal}")
    print(f"Research record: {record}")
    print(f"Needs exact photo recovery: {needs_photo}")


if __name__ == "__main__":
    main()
