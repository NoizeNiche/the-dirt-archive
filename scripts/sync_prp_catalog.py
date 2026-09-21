#!/usr/bin/env python3
"""Synchronize PRP research records into the canonical tracker, catalog, and photo manifest.

Research markdown files are the source of truth for whether Pedal Info is DONE.
Photo status is deliberately preserved from the catalog/tracker and is never
invented by this script.
"""

import csv
import json
import re
from pathlib import Path

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"


def norm(value):
    value = (value or "").lower().strip()
    value = value.replace("&", "and")
    value = re.sub(r"\beffects?\b", "", value)
    return re.sub(r"[^a-z0-9]+", "", value)


def md_record(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    builder = re.search(r"^- \*\*Builder:\*\*\s*(.+)$", text, re.M)
    identity = re.search(r"^- \*\*Catalog identity:\*\*\s*(.+)$", text, re.M)
    title = re.search(r"^#\s+(.+)$", text, re.M)
    b = builder.group(1).strip() if builder else ""
    p = identity.group(1).strip() if identity else (title.group(1).strip() if title else "")
    return b, p


def build_record_map():
    records = {}
    collisions = []
    for path in sorted((ROOT / "research/pedals").rglob("*.md")):
        b, p = md_record(path)
        if not (b and p):
            continue
        key = (norm(b), norm(p))
        record = "./" + path.as_posix()
        previous = records.get(key)
        if previous and previous != record:
            collisions.append((key, previous, record))
        records[key] = record
    if collisions:
        details = "\n".join(f"{key}: {a} / {b}" for key, a, b in collisions[:20])
        raise SystemExit("Duplicate normalized research identities:\n" + details)
    return records


def main():
    records = build_record_map()

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []
        required = {"Builder", "Pedal", "Pedal Info", "Picture", "PRP Complete", "Research Record"}
        missing = required - set(fieldnames)
        if missing:
            raise SystemExit(f"Tracker is missing required columns: {sorted(missing)}")
        tracker_rows = list(reader)

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    catalog_items = catalog.get("pedals", [])

    catalog_by_key = {
        (norm(x.get("company")), norm(x.get("pedal"))): x
        for x in catalog_items
    }
    manifest_by_key = {
        (norm(x.get("builder")), norm(x.get("pedal"))): x
        for x in manifest
    }

    tracker_by_key = {
        (norm(x.get("Builder")), norm(x.get("Pedal"))): x
        for x in tracker_rows
    }

    unmatched_records = []
    tracker_info_changed = 0
    tracker_complete_changed = 0
    tracker_record_changed = 0
    catalog_changed = 0
    manifest_changed = 0
    manifest_added = 0

    # Wire every research markdown record that maps to a tracker/catalog identity.
    for key, record in records.items():
        tracker = tracker_by_key.get(key)
        catalog_item = catalog_by_key.get(key)
        if tracker is None or catalog_item is None:
            unmatched_records.append((key, record, tracker is not None, catalog_item is not None))
            continue

        if tracker.get("Pedal Info") != "DONE":
            tracker["Pedal Info"] = "DONE"
            tracker_info_changed += 1
        if tracker.get("Research Record") != record:
            tracker["Research Record"] = record
            tracker_record_changed += 1

        expected_complete = "DONE" if tracker.get("Picture") == "DONE" else "NEEDED"
        if tracker.get("PRP Complete") != expected_complete:
            tracker["PRP Complete"] = expected_complete
            tracker_complete_changed += 1

        if catalog_item.get("research_record") != record:
            catalog_item["research_record"] = record
            catalog_changed += 1

        manifest_item = manifest_by_key.get(key)
        if manifest_item is None:
            manifest_item = {
                "builder": catalog_item.get("company"),
                "pedal": catalog_item.get("pedal"),
                "image": catalog_item.get("image"),
                "source_page": catalog_item.get("source_page"),
                "research_record": record,
            }
            manifest.append(manifest_item)
            manifest_by_key[key] = manifest_item
            manifest_added += 1
        else:
            if manifest_item.get("research_record") != record:
                manifest_item["research_record"] = record
                manifest_changed += 1

    # Re-derive tracker research/completion flags from the actual research files.
    # Never change Picture here.
    for row in tracker_rows:
        key = (norm(row.get("Builder")), norm(row.get("Pedal")))
        record = records.get(key)
        expected_info = bool(record)
        expected_complete = "DONE" if expected_info and row.get("Picture") == "DONE" else "NEEDED"
        if (row.get("Pedal Info") == "DONE") != expected_info:
            row["Pedal Info"] = "DONE" if expected_info else "NEEDED"
            tracker_info_changed += 1
        if (row.get("Research Record") or "") != (record or ""):
            row["Research Record"] = record or ""
            tracker_record_changed += 1
        if row.get("PRP Complete") != expected_complete:
            row["PRP Complete"] = expected_complete
            tracker_complete_changed += 1

    # Clear stale research links from catalog entries that no longer have a
    # corresponding markdown record. This keeps the canonical catalog honest.
    for item in catalog_items:
        key = (norm(item.get("company")), norm(item.get("pedal")))
        expected = records.get(key)
        current = item.get("research_record") or ""
        if current != (expected or ""):
            item["research_record"] = expected or ""
            catalog_changed += 1

    # Ensure every research markdown record has exactly one manifest link.
    for key, record in records.items():
        item = catalog_by_key.get(key)
        if item is None:
            continue
        manifest_item = manifest_by_key.get(key)
        if manifest_item is None:
            manifest.append({
                "builder": item.get("company"),
                "pedal": item.get("pedal"),
                "image": item.get("image"),
                "source_page": item.get("source_page"),
                "research_record": record,
            })
            manifest_by_key[key] = manifest[-1]
            manifest_added += 1
        elif manifest_item.get("research_record") != record:
            manifest_item["research_record"] = record
            manifest_changed += 1

    TRACKER.write_text("", encoding="utf-8")
    with TRACKER.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(tracker_rows)

    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if unmatched_records:
        print("Unmatched research records:")
        for key, record, tracker_found, catalog_found in unmatched_records[:50]:
            print(f" - {record} -> {key}; tracker={tracker_found}; catalog={catalog_found}")
        if len(unmatched_records) > 50:
            print(f" - ... and {len(unmatched_records) - 50} more")

    researched = sum(bool(x.get("research_record")) for x in catalog_items)
    pictured = sum(bool(x.get("image")) for x in catalog_items)
    complete = sum(bool(x.get("research_record")) and bool(x.get("image")) for x in catalog_items)

    print(
        f"PRP catalog sync complete: {researched} researched / {pictured} pictured / "
        f"{complete} complete. "
        f"Tracker research changes={tracker_info_changed}, record changes={tracker_record_changed}, "
        f"complete changes={tracker_complete_changed}, catalog changes={catalog_changed}, "
        f"manifest changes={manifest_changed + manifest_added}, research files={len(records)}."
    )


if __name__ == "__main__":
    main()
