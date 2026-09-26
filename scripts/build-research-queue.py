#!/usr/bin/env python3
"""Build the derived Catalog Research Phase queue.

Canonical sources:
- research/PEDAL_INDEX.json for catalog order and identity
- research/PRP_TRACKER.csv for current research status

The generated queue is an operational view only. It is never a second source
of truth and should never be hand-edited.
"""

import csv
import json
from datetime import datetime, timezone
from pathlib import Path

INDEX_PATH = Path("research/PEDAL_INDEX.json")
TRACKER_PATH = Path("research/PRP_TRACKER.csv")
QUEUE_PATH = Path("research/RESEARCH_QUEUE.json")
STATE_PATH = Path("CURRENT_STATE.md")

START = "<!-- AUTO:RESEARCH_PHASE_START -->"
END = "<!-- AUTO:RESEARCH_PHASE_END -->"

WORKING_SET = 25


def is_variation(item):
    return str(item.get("catalog_role") or "").strip().lower() == "variation"


def main():
    catalog = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    pedals = catalog.get("pedals", [])

    with TRACKER_PATH.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    tracker = {(r.get("Builder"), r.get("Pedal")): r for r in rows}

    researched = 0
    pictured = 0
    complete = 0
    research_pending = []
    deep_research_pending = []
    surface_ready = 0
    deep_researched = 0

    for item in pedals:
        key = (item.get("company"), item.get("pedal"))
        row = tracker.get(key)
        info_done = bool(row and row.get("Pedal Info") == "DONE")
        picture_done = bool(row and row.get("Picture") == "DONE")
        complete_done = bool(row and row.get("PRP Complete") == "DONE")
        level = str(item.get("research_level") or "").strip().lower()
        has_record = bool(item.get("research_record"))

        researched += int(info_done)
        pictured += int(picture_done)
        complete += int(complete_done)

        if has_record:
            surface_ready += 1
            if level == "deep":
                deep_researched += 1
            elif not is_variation(item):
                deep_research_pending.append(
                    {
                        "builder": item.get("company"),
                        "pedal": item.get("pedal"),
                        "catalog_type": item.get("type") or item.get("dirt_type") or "",
                        "research_record": item.get("research_record") or "",
                        "research_level": "surface",
                    }
                )
        elif not is_variation(item):
            research_pending.append(
                {
                    "builder": item.get("company"),
                    "pedal": item.get("pedal"),
                    "catalog_type": item.get("type") or item.get("dirt_type") or "",
                    "research_record": "",
                    "research_level": "missing",
                }
            )

    deep_research_pending = research_pending + deep_research_pending
    next_target = deep_research_pending[0] if deep_research_pending else None

    queue = {
        "version": "catalog-research-phase-v2",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "active_phase": "Catalog Research Phase",
        "canonical_source": "research/PEDAL_INDEX.json",
        "status_source": "research/PRP_TRACKER.csv",
        "counts": {
            "total": len(pedals),
            "researched": researched,
            "pictured": pictured,
            "complete": complete,
            "research_pending": len(research_pending),
            "deep_research_pending": len(deep_research_pending),
            "deep_researched": deep_researched,
            "surface_ready": surface_ready,
        },
        "next_target": next_target,
        "working_set": deep_research_pending[:WORKING_SET],
    }

    QUEUE_PATH.write_text(
        json.dumps(queue, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    photo_pending = max(researched - pictured, 0)
    if next_target:
        target_text = f"{next_target['builder']} - {next_target['pedal']}"
    else:
        target_text = "None. Catalog research queue is fully researched."

    closeout = (
        f"PRP1 closeout remains separate: {photo_pending} researched record(s) "
        "still lack an exact local photo."
        if photo_pending
        else "PRP1 closeout has no researched-photo blockers."
    )

    block = (
        f"{START}\n"
        "## Active phase checkpoint\n\n"
        "The active production phase is **Catalog Research Phase**. "
        "PRP1 is retained only as a legacy publication/closeout mechanism.\n\n"
        f"Live catalog: **{len(pedals)} total / {surface_ready} surface-ready / {deep_researched} deep-researched / "
        f"{researched} research-linked / {pictured} pictured / {complete} complete / "
        f"{len(research_pending)} surface-missing / {len(deep_research_pending)} deep-research-pending / "
        f"{photo_pending} researched-photo-pending**.\n\n"
        f"**Next deep-research target:** {target_text}.\n\n"
        f"{closeout}\n"
        "The research queue is generated from the canonical catalog and tracker; "
        "do not hand-edit the derived queue.\n"
        f"Last refreshed: {queue['generated_at']}\n"
        f"{END}"
    )

    state = STATE_PATH.read_text(encoding="utf-8")
    if START in state and END in state:
        before, remainder = state.split(START, 1)
        _, after = remainder.split(END, 1)
        STATE_PATH.write_text(before + block + after, encoding="utf-8")
    else:
        STATE_PATH.write_text(block + "\n\n" + state, encoding="utf-8")

    print(
        f"Research queue built: {len(pedals)} total / {surface_ready} surface-ready / "
        f"{deep_researched} deep-researched / {len(research_pending)} surface-missing / "
        f"{len(deep_research_pending)} deep-research-pending / {photo_pending} researched-photo-pending."
    )


if __name__ == "__main__":
    main()
