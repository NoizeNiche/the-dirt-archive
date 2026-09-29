#!/usr/bin/env python3
"""Remove unreferenced generated pedal-photo assets.

Only files beneath assets/pedals are considered. A file is retained when its
normalized path is referenced by any catalog or photo-manifest image field.
This prevents quarantined/wrong images from lingering as orphaned cache files.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANIFEST = ROOT / "research/pedals/PEDAL_IMAGES.json"
ASSET_ROOT = ROOT / "assets/pedals"


def collect_references(value, refs: set[str]) -> None:
    if isinstance(value, dict):
        for child in value.values():
            collect_references(child, refs)
    elif isinstance(value, list):
        for child in value:
            collect_references(child, refs)
    elif isinstance(value, str):
        raw = value.strip()
        if raw.startswith("./assets/pedals/"):
            refs.add(raw[2:])
        elif raw.startswith("assets/pedals/"):
            refs.add(raw)


def main() -> int:
    refs: set[str] = set()
    for path in (INDEX, MANIFEST):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            collect_references(data, refs)
        except Exception as exc:
            raise SystemExit(f"Could not parse {path}: {exc}")

    removed = []
    retained = 0
    if ASSET_ROOT.exists():
        for path in ASSET_ROOT.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".webp", ".source", ".jpg", ".jpeg", ".png", ".gif"}:
                continue
            rel = path.as_posix()
            if rel in refs:
                retained += 1
                continue
            path.unlink()
            removed.append(rel)

    print(
        "Orphaned pedal-photo cleanup: "
        f"retained={retained}, removed={len(removed)}."
    )
    for rel in removed[:120]:
        print("REMOVED:", rel)
    if len(removed) > 120:
        print(f"... {len(removed) - 120} additional orphaned assets removed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
