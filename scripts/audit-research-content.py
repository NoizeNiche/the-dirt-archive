#!/usr/bin/env python3
"""Audit research markdown for high-confidence publisher/page boilerplate."""

from __future__ import annotations
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"
DEFAULT_OUTPUT = ROOT / "research/RESEARCH_CONTENT_AUDIT.csv"

PATTERNS = [
    ("affiliate_disclosure", re.compile(r"when you purchase through affiliate links|affiliate links.*commissions", re.I)),
    ("publisher_nav", re.compile(r"(news|reviews|guides|features|magazine).*?(tuner|deals).*?(related brands|related tags)", re.I)),
    ("generic_nav", re.compile(r"^(?:home|menu|search|login|sign in|subscribe|newsletter|cart|account)\s*$", re.I)),
    ("cookie_privacy", re.compile(r"cookie policy|privacy policy|terms of use|all rights reserved", re.I)),
    ("commerce_prompt", re.compile(r"add to cart|buy now|shopping cart|free shipping|in stock(?!\\s+mode\\b)|out of stock", re.I)),
]

def audit():
    rows=[]
    for path in sorted(RESEARCH.rglob("*.md")):
        text=path.read_text(encoding="utf-8",errors="replace")
        for lineno,line in enumerate(text.splitlines(),1):
            for label,pattern in PATTERNS:
                if pattern.search(line):
                    rows.append({
                        "Research Record":"./"+path.relative_to(ROOT).as_posix(),
                        "Line":lineno,
                        "Pattern":label,
                        "Text":line.strip()[:1200],
                    })
    return rows

def main():
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",default=str(DEFAULT_OUTPUT))
    args=parser.parse_args()
    rows=audit()
    out=Path(args.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    fields=["Research Record","Line","Pattern","Text"]
    with out.open("w",newline="",encoding="utf-8") as handle:
        w=csv.DictWriter(handle,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)
    by={}
    for row in rows: by[row["Pattern"]]=by.get(row["Pattern"],0)+1
    print(f"Research content audit: {len(rows)} flagged lines across {len(set(r['Research Record'] for r in rows))} records.")
    for k,v in sorted(by.items()): print(f" - {k}: {v}")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
