#!/usr/bin/env python3
"""Audit research markdown for scraped publisher/commerce boilerplate and misleading technical labels."""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"
DEFAULT_OUTPUT = ROOT / "research/RESEARCH_CONTENT_AUDIT.csv"

PATTERNS = [
    ("store_page_shell", re.compile(r"\bHome\s+Store\b.*\b(?:FAQs?|About)\b.*\b(?:Contact|Dealers)\b.*\b(?:Basket|Cart)\b.*\bHome\s*/\s*(?:Pedals?|Products?)\s*/.*[£$€]\s*\d", re.I)),
    ("article_shell", re.compile(r"\bNews\s+Tracing Journal\s+Tracing Journal:.*?\b(?:\d{1,2},\s+\d{4}|20\d{2})\s+Tracing Journal\s+(?:Next up|Next we have|Up next)\b", re.I)),
    ("press_release_fragment", re.compile(r"\breleasing today is\b|\bannouncing today is\b", re.I)),
    ("affiliate_disclosure", re.compile(r"when you purchase through affiliate links|affiliate links.*commissions", re.I)),
    ("publisher_nav", re.compile(r"(news|reviews|guides|features|magazine).*?(tuner|deals).*?(related brands|related tags)", re.I)),
    ("generic_nav", re.compile(r"^(?:home|menu|search|login|sign in|subscribe|newsletter|cart|account|skip to content|contact)\s*$", re.I)),
    ("inline_nav_shell", re.compile(r"\b(skip to content|home\s+(?:faq|about|contact)|log in now\.?\b|country/region|search\s+(?:cart|account)|(?:^|\s)related (?:brands|tags)(?:\s|$))\b", re.I)),
    ("country_currency_scrape", re.compile(r"(?:country/region|(?:usd|cad|eur|gbp|aud|jpy|cny|afn|all|dzd|amd|xcd)\s*[$€£¥])", re.I)),
    ("html_markup_residue", re.compile(
        r"</?(?:html|body|head|div|span|p|a|ul|li|script|style|nav|header|footer)\b"
        r"|data-rte-preserve-empty|var\s+productimageandprice|mmmenus?trings"
        r'''|["']variants["']\s*:\s*\[|\\</?p\b''',
        re.I,
    )),
    ("html_entity_in_prose", re.compile(r"&(?:nbsp|quot|amp|#39|#x27);", re.I)),
    ("cookie_privacy", re.compile(r"cookie policy|privacy policy|terms of use|all rights reserved", re.I)),
    ("commerce_prompt", re.compile(r"add to cart|buy now|shopping cart|free shipping|\bin stock\b(?!\s+mode\b)|out of stock", re.I)),
]

DEVICE_TERMS = re.compile(
    r"\b(?:germanium|silicon|jfet|mosfet|tube|valve|transistor|bjt|fet|op[- ]?amp(?:lifier)?|"
    r"integrated circuit|\bic\b|chip|diode|led|2n\d{3,5}|2sc\d{3,5}|2sa\d{3,5}|bc\d{2,3}|oc\d{2,3}|"
    r"nkt\d{3}|gt\d{2,3}|mp\d{2,3}|mps\d{2,3})\b",
    re.I,
)
PRESS_RELEASE_REFERENCE = re.compile(r"\bour take on\s+(?:the\s+)?(.+?)\s*\.?$", re.I)
UNKNOWN_TERMS = re.compile(
    r"\b(?:unknown|not documented|not publicly documented|not established|not specified|"
    r"not reliably documented)\b",
    re.I,
)
MISMATCH_REFERENCES = re.compile(
    r"\b(?:AC(?:10|15|30|50|100)|JCM\d{2,3}|Twin Reverb|Deluxe Reverb|Big Muff|Tube Screamer|"
    r"Fender|Vox|Marshall|Boss Hyper Fuzz)\b",
    re.I,
)

def is_source_line(line: str) -> bool:
    return bool(re.match(r"^\s*\d+\.\s+.+https?://", line, re.I))

def audit():
    rows = []
    for path in sorted(RESEARCH.rglob("*.md")):
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        rows.extend(audit_research_structure(lines, path))
        section = ""
        for lineno, line in enumerate(lines, 1):
            heading = re.match(r"^#{2,6}\s+(.+?)\s*$", line)
            if heading:
                section = heading.group(1).strip().lower()
                continue

            source_line = is_source_line(line)
            for label, pattern in PATTERNS:
                if source_line and label in {"html_markup_residue", "html_entity_in_prose", "commerce_prompt", "cookie_privacy"}:
                    continue
                if pattern.search(line):
                    rows.append({
                        "Research Record": "./" + path.relative_to(ROOT).as_posix(),
                        "Line": lineno,
                        "Pattern": label,
                        "Text": line.strip()[:1200],
                    })

            if re.fullmatch(r"-\s*(?:AC10|AC15|AC30|AC50|AC100|JCM\d{2,3})\.?\s*", line.strip(), re.I):
                continue

            stripped = line.strip()
            # Only treat a line as a technical taxonomy problem when the
            # heading itself says "Transistor" or "Verified transistor/device
            # terms" and the line clearly contains a different kind of
            # technology reference. Generic evidence-limitations and normal
            # transistor part numbers are intentionally ignored.
            if (
                re.fullmatch(r"transistor", section, re.I)
                and re.match(r"[-*]\s*\*\*technology\*\*:", stripped, re.I)
                and not DEVICE_TERMS.search(stripped)
                and not UNKNOWN_TERMS.search(stripped)
            ) or (
                "transistor/device terms" in section
                and MISMATCH_REFERENCES.search(stripped)
                and not DEVICE_TERMS.search(stripped)
            ):
                rows.append({
                    "Research Record": "./" + path.relative_to(ROOT).as_posix(),
                    "Line": lineno,
                    "Pattern": "technical_label_mismatch",
                    "Text": stripped[:1200],
                })

    deduped = {}
    for row in rows:
        key = (row["Research Record"], row["Line"], row["Pattern"], row["Text"])
        deduped[key] = row
    return list(deduped.values())


def clean_visible_text(value: str) -> str:
    value = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", value)
    value = re.sub(r"https?://\S+", " ", value)
    value = re.sub(r"[*_\`#>-]", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def audit_research_structure(lines: list[str], path: Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    sections: dict[str, list[tuple[int, str]]] = {}
    current = ""
    for lineno, raw in enumerate(lines, 1):
        heading = re.match(r"^#{2,6}\s+(.+?)\s*$", raw)
        if heading:
            current = heading.group(1).strip().lower()
            sections.setdefault(current, [])
            continue
        if current:
            sections.setdefault(current, []).append((lineno, raw))

    def add(lineno: int, pattern: str, text: str) -> None:
        rows.append({
            "Research Record": "./" + path.relative_to(ROOT).as_posix(),
            "Line": lineno,
            "Pattern": pattern,
            "Text": text[:1200],
        })

    what = sections.get("what this pedal is", [])
    what_text = clean_visible_text(" ".join(text for _, text in what))
    generic = (
        len(what_text) < 90
        or re.fullmatch(
            r".{0,30}(is|are)\s+(?:cataloged|listed|classified)\s+as\s+\w+.*",
            what_text,
            re.I,
        )
    )
    if generic:
        lineno = what[0][0] if what else 1
        add(lineno, "shallow_description", "What this pedal is is too short or only restates catalog classification.")

    sound = sections.get("sound", [])
    sound_text = clean_visible_text(" ".join(text for _, text in sound))
    if len(sound_text) < 90 or re.search(
        r"did not contain enough .*?(?:pedal-specific|product-specific).*?(?:description|evidence)|"
        r"not enough .*? to make a more detailed sound summary",
        sound_text,
        re.I,
    ):
        lineno = sound[0][0] if sound else (what[0][0] if what else 1)
        add(lineno, "weak_sound_section", "Sound section is empty, generic, or explicitly admits insufficient pedal-specific evidence.")

    verify = sections.get("deep research verification", [])
    if verify:
        visible = [
            clean_visible_text(text)
            for _, text in verify
            if clean_visible_text(text)
        ]
        prose = " ".join(visible)
        sourceish = sum(
            1 for text in visible
            if len(text) < 110
            and not re.search(
                r"\b(?:is|uses|has|features|includes|described|documented|states|announced)\b",
                text,
                re.I,
            )
        )
        if visible and (len(prose) < 100 or sourceish >= max(2, len(visible) - 1)):
            add(
                verify[0][0],
                "weak_deep_verification",
                "Deep research verification contains little claim-level prose and appears title/source-label driven.",
            )

    for lineno, raw in enumerate(lines, 1):
        if is_source_line(raw):
            label_match = re.match(
                r"^\s*\d+\.\s+(https?://\S+)(?:\s+[—-]\s+(.+))?\s*$",
                raw,
            )
            labeled_match = re.match(
                r"^\s*\d+\.\s+(.+?)\s*[:;-]\s+(https?://\S+)\s*$",
                raw,
            )
            label = (
                label_match.group(2) if label_match and label_match.group(2)
                else labeled_match.group(1) if labeled_match else ""
            )
            label_clean = clean_visible_text(label)
            if len(label_clean) > 160 or re.search(
                r"(?:facebook|youtube|instagram|tiktok|threads)\b.*(?:facebook|youtube|instagram|tiktok|threads)\b|"
                r"(?:mobile gift card|gear card|menu|shop|search|login|account).*(?:facebook|youtube|instagram|tiktok|threads)",
                label_clean,
                re.I,
            ):
                add(lineno, "bloated_source_label", raw.strip())


    return rows

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
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

    print("Flagged sample:")
    for row in rows[:80]:
        print(
            f" - {row['Pattern']} | {row['Research Record']}:{row['Line']} | "
            f"{row['Text']}"
        )

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
