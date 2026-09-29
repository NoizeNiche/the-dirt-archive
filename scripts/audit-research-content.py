#!/usr/bin/env python3
"""Audit research markdown for scraped publisher/commerce boilerplate and misleading technical labels."""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"
DEFAULT_OUTPUT = ROOT / "research/RESEARCH_CONTENT_AUDIT.csv"

# These are intentionally high-confidence signals. The audit should surface
# probable contamination for review rather than trying to rewrite research prose
# automatically.
PATTERNS = [
    ("affiliate_disclosure", re.compile(r"when you purchase through affiliate links|affiliate links.*commissions", re.I)),
    ("publisher_nav", re.compile(r"(news|reviews|guides|features|magazine).*?(tuner|deals).*?(related brands|related tags)", re.I)),
    ("generic_nav", re.compile(r"^(?:home|menu|search|login|sign in|subscribe|newsletter|cart|account|skip to content|contact)\s*$", re.I)),
    ("inline_nav_shell", re.compile(r"\b(skip to content|home\s+(?:faq|about|contact)|log in\b|country/region|search\s+(?:cart|account)|related (?:brands|tags))\b", re.I)),
    ("country_currency_scrape", re.compile(r"\b(?:country/region|(?:usd|cad|eur|gbp|aud|jpy|cny|afn|all|dzd|amd|xcd)\s*[$€£¥]|\b(?:afn|all|dzd|amd|xcd|cad|usd|eur|gbp|aud|jpy|cny)\s+[^,;]{0,16}[\$€£¥])", re.I)),
    ("html_markup_residue", re.compile(r"<\/?(?:html|body|head|div|span|p|a|ul|li|script|style|nav|header|footer)\b|&(?:ndash|mdash|nbsp|quot|amp|#39|#x27);", re.I)),
    ("cookie_privacy", re.compile(r"cookie policy|privacy policy|terms of use|all rights reserved", re.I)),
    ("commerce_prompt", re.compile(r"add to cart|buy now|shopping cart|free shipping|in stock(?!\s+mode\b)|out of stock", re.I)),
    ("technical_label_mismatch", re.compile(
        r"^\s*[-*]\s*\*\*(?:verified )?transistor/device terms\s*:\s*\*\*\s*(?!.*\b(?:germanium|silicon|jfet|mosfet|tube|valve|transistor|bjt|fet|op[- ]?amp|integrated circuit|\bic\b|chip)\b).+",
        re.I,
    )),
]

def audit():
    rows = []
    for path in sorted(RESEARCH.rglob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        for lineno, line in enumerate(text.splitlines(), 1):
            for label, pattern in PATTERNS:
                if pattern.search(line):
                    rows.append({
                        "Research Record": "./" + path.relative_to(ROOT).as_posix(),
                        "Line": lineno,
                        "Pattern": label,
                        "Text": line.strip()[:1200],
                    })
    return rows

def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    rows = audit()
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)

    fields = ["Research Record", "Line", "Pattern", "Text"]
    with out.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    by = {}
    for row in rows:
        by[row["Pattern"]] = by.get(row["Pattern"], 0) + 1

    print(
        f"Research content audit: {len(rows)} flagged lines across "
        f"{len(set(r['Research Record'] for r in rows))} records."
    )
    for key, value in sorted(by.items()):
        print(f" - {key}: {value}")

    # Put a bounded sample in the Actions log so the next cleanup pass can
    # inspect concrete offenders without downloading the artifact.
    print("Flagged sample:")
    for row in rows[:80]:
        print(
            f" - {row['Pattern']} | {row['Research Record']}:{row['Line']} | "
            f"{row['Text']}"
        )

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
