#!/usr/bin/env python3
"""Recover previously verified research packets that were stranded in the inbox.

The active worker pass normally synthesizes only evidence admitted by that
pass's foreman run. Older VERIFIED_EVIDENCE_STAGED packets can otherwise sit
forever if their publication run was interrupted or if an identity alias was
added later. This script safely re-queues only packets whose canonical catalog
record is still surface/researched and, for surface placeholders, still has
the untouched placeholder shape.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
INBOX = ROOT / "research/RESEARCH_INBOX"
EVIDENCE = ROOT / "research-evidence"
SUMMARY_PATH = EVIDENCE / "foreman-summary.json"


def load_synthesizer():
    path = ROOT / "scripts/synthesize-research-inbox.py"
    spec = importlib.util.spec_from_file_location("synth_research", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load research synthesizer")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def record_path(item):
    raw = str(item.get("research_record") or "").strip()
    if not raw:
        return None
    return ROOT / (raw[2:] if raw.startswith("./") else raw)


def safe_surface_placeholder(item):
    path = record_path(item)
    if path is None or not path.is_file():
        return False
    text = path.read_text(encoding="utf-8", errors="replace")
    return (
        "## Surface catalog record" in text
        and "**Deep research status:** Pending" in text
    )


def packet_key(packet):
    return (
        str(packet.get("builder") or "").strip(),
        str(packet.get("pedal") or "").strip(),
    )


def main():
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    summary = {}
    if SUMMARY_PATH.is_file():
        summary = json.loads(SUMMARY_PATH.read_text(encoding="utf-8"))
    staged_files = [str(Path(p)) for p in summary.get("staged_files", [])]

    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    by_key = {
        (x.get("company"), x.get("pedal")): x
        for x in catalog.get("pedals", [])
    }
    synth = load_synthesizer()
    catalog_keys = set(by_key)
    catalog_index = {}
    # Use the synthesizer's own identity rules, including confirmed aliases.
    for key in catalog_keys:
        builder, pedal = key
        for variant in synth.identity_variants(pedal):
            catalog_index.setdefault((synth.norm(builder).lower(), synth.norm(variant).lower()), set()).add(key)

    def resolve(builder, pedal):
        return synth.resolve_catalog_key(builder, pedal, by_key)

    existing_canonical = set()
    for path_text in staged_files:
        path = ROOT / path_text
        if not path.is_file():
            continue
        try:
            packet = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        key = resolve(packet.get("builder", ""), packet.get("pedal", ""))
        if key:
            existing_canonical.add(key)

    recovered = []
    seen = set(existing_canonical)
    for packet_path in sorted(INBOX.rglob("*.json")):
        try:
            packet = json.loads(packet_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if packet.get("status") != "VERIFIED_EVIDENCE_STAGED":
            continue

        key = resolve(packet.get("builder", ""), packet.get("pedal", ""))
        if not key or key in seen:
            continue

        item = by_key.get(key)
        if not item:
            continue
        level = str(item.get("research_level") or "").strip().lower()
        if level not in {"surface", "researched"}:
            continue

        # Never overwrite a richer hand-maintained surface record merely because
        # a historical packet exists. Surface records that remain untouched
        # placeholders are safe to promote; already-researched records can be
        # deepened by the ordinary synthesizer without erasing their content.
        if level == "surface" and not safe_surface_placeholder(item):
            continue

        digest = hashlib.sha1(
            (str(key[0]) + "\0" + str(key[1])).encode("utf-8")
        ).hexdigest()[:16]
        dest = EVIDENCE / "stranded-existing" / f"{digest}.json"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(packet_path, dest)
        staged_files.append(dest.relative_to(ROOT).as_posix())
        seen.add(key)
        recovered.append({
            "builder": key[0],
            "pedal": key[1],
            "source_packet": packet_path.relative_to(ROOT).as_posix(),
            "staged_file": dest.relative_to(ROOT).as_posix(),
        })

    summary["staged_files"] = staged_files
    summary["staged"] = len(staged_files)
    summary["stranded_existing_recovered"] = len(recovered)
    SUMMARY_PATH.write_text(
        json.dumps(summary, ensure_ascii=True, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "recovered": len(recovered),
        "recovered_records": recovered,
        "total_staged": len(staged_files),
    }, ensure_ascii=True))


if __name__ == "__main__":
    main()
