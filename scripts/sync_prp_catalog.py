#!/usr/bin/env python3
"""Safely synchronize PRP research records into canonical archive data.

Rules:
- Never erase a valid existing research_record link.
- Prefer the record path already stored in the tracker/catalog when it exists.
- Add a new research link only when the builder + pedal identity matches exactly
  or resolves to one unambiguous candidate.
- Treat ambiguous matches as review items, not as reasons to rewrite good data.
- Photo status is never invented or changed here.
"""

import csv
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(".")
TRACKER = ROOT / "research/PRP_TRACKER.csv"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"


def norm(value):
    value = (value or "").lower().strip().replace("&", "and")
    value = re.sub(r"\beffects?\b", "", value)
    return re.sub(r"[^a-z0-9]+", "", value)


def precise(value):
    return re.sub(r"\s+", " ", (value or "").strip())


def record_exists(record):
    if not record:
        return False
    path = Path(record[2:] if record.startswith("./") else record)
    return path.exists() and path.is_file()


def md_record(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    builder = re.search(r"^- \*\*Builder:\*\*\s*(.+)$", text, re.M)
    identity = re.search(r"^- \*\*Catalog identity:\*\*\s*(.+)$", text, re.M)
    title = re.search(r"^#\s+(.+)$", text, re.M)
    b = builder.group(1).strip() if builder else ""
    p = identity.group(1).strip() if identity else (title.group(1).strip() if title else "")
    return b, p


def build_record_candidates():
    by_precise = defaultdict(list)
    by_loose = defaultdict(list)
    for path in sorted((ROOT / "research/pedals").rglob("*.md")):
        builder, pedal = md_record(path)
        if not (builder and pedal):
            continue
        record = "./" + path.as_posix()
        by_precise[(precise(builder), precise(pedal))].append(record)
        by_loose[(norm(builder), norm(pedal))].append(record)
    return dict(by_precise), dict(by_loose)


def resolve_record(builder, pedal, current_record, by_precise, by_loose):
    if current_record:
        if not record_exists(current_record):
            raise SystemExit(
                "Stale research record link must be repaired before sync: " + current_record
            )
        return current_record

    exact = by_precise.get((precise(builder), precise(pedal)), [])
    if len(exact) == 1:
        return exact[0]

    loose = by_loose.get((norm(builder), norm(pedal)), [])
    if len(loose) == 1:
        return loose[0]

    return None


def main():
    by_precise, by_loose = build_record_candidates()

    with TRACKER.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []
        required = {
            "Builder", "Pedal", "Pedal Info", "Picture",
            "PRP Complete", "Research Record"
        }
        missing = required - set(fieldnames)
        if missing:
            raise SystemExit(f"Tracker is missing required columns: {sorted(missing)}")
        tracker_rows = list(reader)

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    catalog_items = catalog.get("pedals", [])

    tracker_by_key = {
        (precise(row.get("Builder")), precise(row.get("Pedal"))): row
        for row in tracker_rows
    }
    catalog_by_key = {
        (precise(item.get("company")), precise(item.get("pedal"))): item
        for item in catalog_items
    }
    manifest_by_key = {
        (precise(item.get("builder")), precise(item.get("pedal"))): item
        for item in manifest
    }

    unmatched = []
    ambiguous = []
    tracker_info_changed = 0
    tracker_complete_changed = 0
    tracker_record_changed = 0
    catalog_changed = 0
    manifest_changed = 0
    manifest_added = 0

    for item_key, catalog_item in catalog_by_key.items():
        builder, pedal = item_key
        tracker = tracker_by_key.get(item_key)
        if tracker is None:
            unmatched.append(("catalog_without_tracker", item_key, catalog_item.get("research_record") or ""))
            continue

        catalog_current = catalog_item.get("research_record") or ""
        tracker_current = tracker.get("Research Record") or ""
        current = catalog_current if record_exists(catalog_current) else tracker_current
        record = resolve_record(builder, pedal, current, by_precise, by_loose)

        if record is None:
            loose = by_loose.get((norm(builder), norm(pedal)), [])
            if len(loose) > 1:
                ambiguous.append((item_key, loose))
            continue

        if tracker.get("Research Record") != record:
            tracker["Research Record"] = record
            tracker_record_changed += 1
        if tracker.get("Pedal Info") != "DONE":
            tracker["Pedal Info"] = "DONE"
            tracker_info_changed += 1
        expected_complete = "DONE" if tracker.get("Picture") == "DONE" else "NEEDED"
        if tracker.get("PRP Complete") != expected_complete:
            tracker["PRP Complete"] = expected_complete
            tracker_complete_changed += 1
        if catalog_item.get("research_record") != record:
            catalog_item["research_record"] = record
            catalog_changed += 1

    for row in tracker_rows:
        key = (precise(row.get("Builder")), precise(row.get("Pedal")))
        catalog_item = catalog_by_key.get(key)
        current = row.get("Research Record") or ""
        if current and not record_exists(current):
            raise SystemExit(
                "Stale tracker research record link must be repaired before sync: " + current
            )

        record = current
        if not record and catalog_item is not None:
            record = catalog_item.get("research_record") or ""
        if not record:
            record = resolve_record(
                row.get("Builder"), row.get("Pedal"), "",
                by_precise, by_loose
            )

        expected_info = bool(record)
        expected_complete = "DONE" if expected_info and row.get("Picture") == "DONE" else "NEEDED"
        if (row.get("Pedal Info") == "DONE") != expected_info:
            row["Pedal Info"] = "DONE" if expected_info else "NEEDED"
            tracker_info_changed += 1
        if (row.get("Research Record") or "") != record:
            row["Research Record"] = record
            tracker_record_changed += 1
        if row.get("PRP Complete") != expected_complete:
            row["PRP Complete"] = expected_complete
            tracker_complete_changed += 1

        if catalog_item is not None and (catalog_item.get("research_record") or "") == "" and record:
            catalog_item["research_record"] = record
            catalog_changed += 1

    for item_key, catalog_item in catalog_by_key.items():
        record = catalog_item.get("research_record") or ""
        if record and not record_exists(record):
            raise SystemExit("Catalog research record file does not exist: " + record)

        manifest_item = manifest_by_key.get(item_key)
        if manifest_item is None:
            manifest_item = {
                "builder": catalog_item.get("company"),
                "pedal": catalog_item.get("pedal"),
                "image": catalog_item.get("image"),
                "source_page": catalog_item.get("source_page"),
                "research_record": record,
            }
            manifest.append(manifest_item)
            manifest_by_key[item_key] = manifest_item
            manifest_added += 1
        elif (manifest_item.get("research_record") or "") != record:
            manifest_item["research_record"] = record
            manifest_changed += 1

    TRACKER.write_text("", encoding="utf-8")
    with TRACKER.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(tracker_rows)

    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if unmatched:
        print("Unmatched catalog/tracker identities:")
        for kind, key, record in unmatched[:50]:
            print(f" - {kind}: {key}; record={record}")
    if ambiguous:
        print("Ambiguous new research matches held for review:")
        for key, records in ambiguous[:50]:
            print(f" - {key}: " + " / ".join(records))

    researched = sum(bool(x.get("research_record")) for x in catalog_items)
    pictured = sum(bool(x.get("image")) for x in catalog_items)
    complete = sum(bool(x.get("research_record")) and bool(x.get("image")) for x in catalog_items)

    print(
        f"PRP catalog sync complete: {researched} researched / {pictured} pictured / "
        f"{complete} complete. Tracker research changes={tracker_info_changed}, "
        f"record changes={tracker_record_changed}, complete changes={tracker_complete_changed}, "
        f"catalog changes={catalog_changed}, manifest changes={manifest_changed + manifest_added}, "
        f"research files={sum(len(v) for v in by_precise.values())}."
    )


if __name__ == "__main__":
    main()
