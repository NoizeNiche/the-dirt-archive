#!/usr/bin/env python3
"""Conservatively remove obvious scraped webpage residue from research markdown."""

from __future__ import annotations
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"

SHELL_MARKERS = (
    "skip to content", "skip to main content", "log in now", "log in to suggest improvements", "sign in",
    "open menu", "close menu", "shopping bag", "site navigation",
    "log in to suggest improvements", "related brands", "related tags",
    "your cart is empty", "continue shopping", "navigation menu", "personal tools", "namespaces", "view source", "view history",
)
CODE_MARKERS = (
    "var productimageandprice", "mmlivicons", "mmmenustrings",
    "data-serialized-app-state", "data-rte-preserve-empty",
    "@keyframes ", "raven.config(", "wixui-", "<script", "</script",
    "<div ", "</div", "<section ", "</section", "<nav ", "</nav",
    "<header ", "</header", "<footer ", "</footer",
)
COMMERCE_UI = (
    "add to cart", "add to basket", "buy now", "shopping cart",
    "product variants", "view cart", "checkout", "sold out",
    "regular price", "quantity", "notify me when this product is available",
    "related items", "quick view", "sku:", "free shipping",
)

SOURCE_LINE = re.compile(r"^\s*\d+\.\s+.+https?://", re.I)

def strong_shell(line: str) -> bool:
    lower = line.lower()
    hits = sum(marker in lower for marker in SHELL_MARKERS)
    return hits >= 1 and (
        hits >= 2 or "log in now" in lower or "log in to suggest improvements" in lower
        or "navigation menu" in lower or "personal tools" in lower or "namespaces" in lower
        or "pedalpedia" in lower or "chicago music exchange" in lower
        or "rockboard" in lower or "skip to" in lower
    )

def strong_code(line: str) -> bool:
    lower = line.lower()
    if any(marker in lower for marker in CODE_MARKERS):
        return True
    return bool(
        re.search(r"<[a-z][^>]+>.*[{};]", line, re.I)
        or re.search(r"\b(?:data-[a-z-]+|class=|style=)=", line, re.I)
    )

def strong_commerce(line: str) -> bool:
    lower = line.lower()
    if not any(marker in lower for marker in COMMERCE_UI):
        return False
    if "related items" in lower or "quick view" in lower:
        return True
    if re.search(r"\b(?:add to cart|add to basket|buy now)\b", lower):
        return True
    if "quantity" in lower and re.search(r"\b(?:price|cart|sku|product|decrease|increase)\b", lower):
        return True
    if "product variants" in lower or "view cart" in lower or "checkout" in lower:
        return True
    if "regular price" in lower or "notify me when this product is available" in lower:
        return True
    if "sold out" in lower and re.search(r"\b(?:add to cart|quantity|price|default title)\b", lower):
        return True
    if "free shipping" in lower and ("we ship" in lower or "in stock" in lower or re.search(r"\$\s*\d", lower)):
        return True
    if "sku:" in lower and re.search(r"\b(?:buy now|add to cart|description)\b", lower):
        return True
    return False

def clean_commerce_line(line: str) -> str | None:
    if not strong_commerce(line):
        return line
    lower = line.lower()

    # Never rewrite a numbered source citation. Titles are allowed to contain
    # ordinary shopping vocabulary and must remain part of the evidence trail.
    if SOURCE_LINE.match(line):
        return line

    # Unrelated product carousels belong to the source page, not pedal research.
    related = re.search(r"\brelated items\b", line, re.I)
    if related:
        prefix = line[:related.start()].strip(" -:|")
        return prefix if len(prefix) >= 30 and "add to cart" not in prefix.lower() else None

    # Store shells commonly expose a substantive description after one of
    # these labels. Keep the research prose and discard everything before it.
    for marker in (r"product\s+description", r"\bdescription\s*:?\s*", r"\binfo\s*&\s*specs\b"):
        m = re.search(marker, line, re.I)
        if m:
            tail = line[m.end():].strip(" -:|")
            if len(tail) >= 35:
                return tail

    m = re.search(r"\badd to (?:cart|basket)\b", line, re.I)
    if m:
        tail = line[m.end():].strip(" -:|")
        lower_tail = tail.lower()
        if (
            "successfully added to cart" in lower_tail
            or "click here to be notified" in lower_tail
            or lower_tail.startswith("all products ")
            or "deering nylon banjo strap" in lower_tail
            or "amazon's choice" in lower_tail
        ):
            return None
        # Strip common review/store navigation after a usable product blurb.
        m_manual = re.search(r"\bManual\s+", tail, re.I)
        if m_manual:
            tail = tail[m_manual.end():].strip()
        return tail if len(tail) >= 35 and re.search(r"[A-Za-z]{4,}", tail) else None

    m = re.search(r"\bbuy now\b", line, re.I)
    if m:
        tail = line[m.end():].strip(" -:|")
        return tail if len(tail) >= 35 and re.search(r"[A-Za-z]{4,}", tail) else None

    # Product-specific store headers that put the real prose after a status tag.
    for marker in (r"\blimited edition\b", r"\bfrom the [A-Z][A-Za-z0-9'’ -]+\b"):
        m = re.search(marker, line, re.I)
        if m:
            tail = line[m.end():].strip(" -:|")
            if len(tail) >= 35:
                return tail

    if "free shipping" in lower and "we ship" in lower:
        tail = re.sub(r"^.*?\bwe ship[^.]*\.\s*", "", line, flags=re.I).strip()
        return tail if len(tail) >= 35 else None

    if re.search(r"\b(?:regular price|quantity|product variants|view cart|checkout|sold out|sku:)\b", lower):
        return None
    return None

def clean_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="replace")
    out: list[str] = []
    section = ""
    changed = False
    for raw in original.splitlines():
        line = html.unescape(raw)
        if line != raw:
            changed = True
        heading = re.match(r"^(#{2,6})\s+(.+?)\s*$", line)
        if heading:
            section = heading.group(2).strip().lower()
        stripped = line.strip()
        if strong_code(line) or strong_shell(line):
            changed = True
            continue
        cleaned = clean_commerce_line(line)
        if cleaned is None:
            changed = True
            continue
        if cleaned != line:
            line = cleaned
            changed = True
        if section == "transistor" and re.fullmatch(
            r"-\s*[-–—]?\s*(?:ac10|ac15|ac30|ac50|ac100|jcm\d{2,3})\.?\s*",
            stripped, re.I):
            changed = True
            continue
        lower = line.lower()
        if ("view more at a glance" in lower or "current price is usd" in lower
            or "has nrtl listing certification" in lower
            or "cookie preferences" in lower
            or ("about • collections • blog • compare • privacy policy" in lower)
            or ("pedalfilter the guitar pedal database" in lower)
            or lower in {"cookie preferences", "cookie policy", "privacy policy"}):
            changed = True
            continue
        out.append(line.rstrip())
    while out and not out[-1].strip():
        out.pop()
    new = "\n".join(out) + "\n"
    if new != original:
        path.write_text(new, encoding="utf-8")
        changed = True
    return changed

def main() -> int:
    changed = []
    for path in sorted(RESEARCH.rglob("*.md")):
        if clean_file(path):
            changed.append(path.relative_to(ROOT).as_posix())
    print(f"Research cleanup: changed {len(changed)} records.")
    for path in changed[:200]:
        print(f" - {path}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
