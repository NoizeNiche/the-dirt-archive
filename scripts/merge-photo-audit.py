#!/usr/bin/env python3
"""Merge sharded photo-content audit CSVs into one deterministic report."""

from __future__ import annotations
import argparse
import csv
from pathlib import Path

FIELDS = ["Builder","Pedal","Image","Status","Flags","OCR"]

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("directory")
    parser.add_argument("--output", default="photo-content-audit.csv")
    args = parser.parse_args()
    root = Path(args.directory)
    rows=[]
    seen=set()
    for path in sorted(root.glob("photo-content-audit-*.csv")):
        with path.open(newline="",encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                key=(row.get("Builder",""),row.get("Pedal",""),row.get("Image",""))
                if key in seen:
                    continue
                seen.add(key)
                rows.append({field:row.get(field,"") for field in FIELDS})
    rows.sort(key=lambda r:(r["Builder"],r["Pedal"],r["Image"]))
    out=Path(args.output)
    with out.open("w",newline="",encoding="utf-8") as handle:
        writer=csv.DictWriter(handle,fieldnames=FIELDS,lineterminator="\n")
        writer.writeheader();writer.writerows(rows)
    suspects=sum(r["Status"]=="SUSPECT" for r in rows)
    high=sum(any(x.strip().startswith(("donation_or_platform_overlay:","known_blocked_image_hash","blocked_provenance:","tiny_file","tiny_dimensions","unreadable_image:")) for x in str(r["Flags"]).split(";")) for r in rows)
    print(f"Merged photo-content audit: {len(rows)} rows; suspects={suspects}; high_confidence={high}.")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
