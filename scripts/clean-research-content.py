#!/usr/bin/env python3
"""Conservatively remove obvious scraped webpage residue from research markdown."""

from __future__ import annotations
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"

SHELL_MARKERS = (
    "skip to content", "skip to main content", "log in", "sign in",
    "open menu", "close menu", "shopping bag", "site navigation",
    "log in to suggest improvements", "related brands", "related tags",
    "your cart is empty", "continue shopping",
)
CODE_MARKERS = (
    "var productimageandprice", "mmlivicons", "mmmenustrings",
    "data-serialized-app-state", "data-rte-preserve-empty",
    "@keyframes ", "raven.config(", "wixui-", "<script", "</script",
    "<div ", "</div", "<section ", "</section", "<nav ", "</nav",
    "<header ", "</header", "<footer ", "</footer",
)
COMMERCE_UI = (
    "add to cart", "add to basket", "quantity", "product variants",
    "view cart", "checkout", "sold out", "regular price",
    "click here to be notified",
)

def strong_shell(line: str) -> bool:
    lower = line.lower()
    hits = sum(marker in lower for marker in SHELL_MARKERS)
    return hits >= 1 and (
        hits >= 2 or "pedalpedia" in lower or "chicago music exchange" in lower
        or "rockboard" in lower or "skip to" in lower
    )

def strong_code(line: str) -> bool:
    lower = line.lower()
    if any(marker in lower for marker in CODE_MARKERS):
        return True
    return bool(re.search(r"<[a-z][^>]+>.*[{};]", line, re.I)
                or re.search(r"\b(?:data-[a-z-]+|class=|style=)=", line, re.I))

def strong_commerce(line: str) -> bool:
    lower = line.lower()
    if not any(marker in lower for marker in COMMERCE_UI):
        return False
    if "add to cart" in lower or "add to basket" in lower:
        m = re.search(r"add to (?:cart|basket)", line, re.I)
        tail = line[m.end():].strip(" -:|") if m else ""
        return len(tail) < 45 or not re.search(r"[A-Za-z]{4,}", tail)
    return ("product variants" in lower or "view cart" in lower or "checkout" in lower
            or "click here to be notified" in lower
            or ("quantity" in lower and ("regular price" in lower or "sold out" in lower)))

def clean_commerce_line(line: str) -> str | None:
    if not strong_commerce(line):
        return line
    lower = line.lower()

    # Keep the substantive description after a shopping-page preamble.
    desc = re.search(r"\bdescription\s*:\s*", line, re.I)
    if desc:
        tail = line[desc.end():].strip(" -:|")
        if len(tail) >= 40:
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
        # Some stores append a useful product description after the button.
        if len(tail) >= 35 and re.search(r"[A-Za-z]{4,}", tail):
            return tail
        return None

    if re.search(r"\b(?:amazon's choice|free shipping)\b", lower) and not re.search(r"\b(?:description|the |this |our |a |an )\b", lower):
        return None
    # Price/availability fragments without a useful description are pure UI.
    if re.search(r"\b(?:regular price|quantity|product variants|view cart|checkout|sold out)\b", lower):
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
