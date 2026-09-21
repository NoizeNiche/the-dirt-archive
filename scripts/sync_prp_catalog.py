#!/usr/bin/env python3
"""Synchronize research links into the canonical catalog and photo manifest.

The PRP tracker has a separate owner. This script never writes
research/PRP_TRACKER.csv.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

INDEX = Path("research/PEDAL_INDEX.json")
MANIFEST = Path("research/pedals/PEDAL_IMAGES.json")


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
    return path.is_file()


def md_identity(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    builder = re.search(r"^- \*\*Builder:\*\*\s*(.+)$", text, re.M)
    identity = re.search(r"^- \*\*Catalog identity:\*\*\s*(.+)$", text, re.M)
    archive_parent = re.search(r"^- \*\*Archive parent:\*\*\s*(.+)$", text, re.M)
    title = re.search(r"^#\s+(.+)$", text, re.M)
    b = builder.group(1).strip() if builder else ""
    p = (
        identity.group(1).strip() if identity else
        archive_parent.group(1).strip() if archive_parent else
        (title.group(1).strip() if title else "")
    )
    return b, p


def build_candidates():
    exact = defaultdict(list)
    loose = defaultdict(list)
    for path in sorted(Path("research/pedals").rglob("*.md")):
        builder, pedal = md_identity(path)
        if not (builder and pedal):
            continue
        record = "./" + path.as_posix()
        exact[(precise(builder), precise(pedal))].append(record)
        loose[(norm(builder), norm(pedal))].append(record)
    return exact, loose


def main():
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    exact, loose = build_candidates()

    before = {
        (precise(x.get("company")), precise(x.get("pedal"))): (
            x.get("research_record") or "",
            x.get("image"),
            x.get("image_source_url"),
            x.get("image_source_page"),
            x.get("source_page"),
        )
        for x in catalog.get("pedals", [])
    }

    changed = 0
    ambiguous = []

    for item in catalog.get("pedals", []):
        key = (precise(item.get("company")), precise(item.get("pedal")))
        existing = item.get("research_record") or ""

        if existing:
            if not record_exists(existing):
                raise SystemExit(
                    "Existing catalog research record is stale: "
                    + str(key) + " -> " + existing
                )
            continue

        exact_matches = exact.get(key, [])
        if len(exact_matches) == 1:
            item["research_record"] = exact_matches[0]
            changed += 1
            continue

        loose_matches = loose.get((norm(item.get("company")), norm(item.get("pedal"))), [])
        if len(loose_matches) == 1:
            item["research_record"] = loose_matches[0]
            changed += 1
        elif len(loose_matches) > 1:
            ambiguous.append((key, loose_matches))

    for item in catalog.get("pedals", []):
        key = (precise(item.get("company")), precise(item.get("pedal")))
        old = before[key]
        now = (
            item.get("research_record") or "",
            item.get("image"),
            item.get("image_source_url"),
            item.get("image_source_page"),
            item.get("source_page"),
        )
        if old[0] and old[0] != now[0]:
            raise SystemExit("Research sync attempted to overwrite an existing research link: " + str(key))
        if old[1:] != now[1:]:
            raise SystemExit("Research sync changed photo data: " + str(key))

    manifest_by_key = {
        (precise(x.get("builder")), precise(x.get("pedal"))): x
        for x in manifest
    }
    for item in catalog.get("pedals", []):
        key = (precise(item.get("company")), precise(item.get("pedal")))
        record = item.get("research_record") or ""
        entry = manifest_by_key.get(key)
        if entry is None:
            manifest.append({
                "builder": item.get("company"),
                "pedal": item.get("pedal"),
                "image": item.get("image"),
                "source_page": item.get("source_page"),
                "research_record": record,
            })
        elif (entry.get("research_record") or "") != record:
            entry["research_record"] = record

    INDEX.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if ambiguous:
        print("Ambiguous research identities held for review:")
        for key, matches in ambiguous[:50]:
            print(f" - {key}: " + " / ".join(matches))

    researched = sum(bool(x.get("research_record")) for x in catalog.get("pedals", []))
    pictured = sum(bool(x.get("image")) for x in catalog.get("pedals", []))
    complete = sum(bool(x.get("research_record")) and bool(x.get("image")) for x in catalog.get("pedals", []))
    print(
        f"PRP catalog sync complete: {researched} researched / {pictured} pictured / "
        f"{complete} complete; {changed} new research links wired."
    )


if __name__ == "__main__":
    main()
