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
AMP_REFERENCE_TERMS = re.compile(
    r"\b(?:AC(?:10|15|30|50|100)|JCM\d{2,3}|Twin Reverb|Deluxe Reverb|Big Muff|"
    r"Tube Screamer|Fender|Vox|Marshall|Matchless|Supro|Dumble|Hiwatt|Orange|"
    r"Blackface|Tweed|Silverface|Boss Hyper Fuzz)\b",
    re.I,
)

COMMERCE_UI = (
    "add to cart", "add to basket", "buy now", "shopping cart",
    "product variants", "view cart", "checkout", "sold out",
    "regular price", "quantity", "notify me when this product is available",
    "related items", "quick view", "sku:", "free shipping",
)

SOURCE_LINE = re.compile(r"^\s*\d+\.\s+.+https?://", re.I)

STORE_SHELL = re.compile(
    r"\bHome\s+Store\b.*\b(?:FAQs?|About)\b.*\b(?:Contact|Dealers)\b.*\b(?:Basket|Cart)\b.*\bHome\s*/\s*(?:Pedals?|Products?)\s*/",
    re.I,
)
ARTICLE_SHELL = re.compile(
    r"\bNews\s+Tracing Journal\s+Tracing Journal:.*?\b(?:\d{1,2},\s+\d{4}|20\d{2})\s+Tracing Journal\s+(?=(?:Next up|Next we have|Up next)\b)",
    re.I,
)
RELEASE_COPY = re.compile(
    r"\breleasing today is\s+(?:the\s+)?(.+?),.*?\bour take on the\s+(.+?)\s*\.?$",
    re.I,
)

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

def clean_release_mismatch(line: str, section: str, current_pedal: str) -> str | None:
    if section != "what this pedal is":
        return line
    match = RELEASE_COPY.search(line)
    if not match:
        return line
    named_product = match.group(1).strip(" .:,")
    referenced_parent = match.group(2).strip(" .:,")
    current = current_pedal.strip(" .:,")
    # A press-release sentence is useful only when it is actually describing
    # this exact cataloged pedal. A different product presented as "our take
    # on" the current pedal is a classic wrong-record/source crossover.
    if current and named_product.lower() != current.lower() and referenced_parent.lower() == current.lower():
        return None
    return line

def clean_known_shell(line: str) -> str | None:
    if ARTICLE_SHELL.search(line):
        cleaned = ARTICLE_SHELL.sub("", line).strip(" -:|")
        return cleaned if len(cleaned) >= 35 else None
    if STORE_SHELL.search(line):
        m_price = re.search(r"[£$€]\s*\d[\d.,]*(?:\s|$)", line)
        if m_price:
            tail = line[m_price.end():].strip(" -:|")
            return tail if len(tail) >= 35 else None
        return None
    return line


def clean_source_label(line: str) -> str:
    if not SOURCE_LINE.match(line):
        return line
    labeled = re.match(r"^\s*(\d+)\.\s+(.+?)\s*[:;-]\s+(https?://\S+)\s*$", line)
    if not labeled:
        return line
    number, label, url = labeled.groups()
    label = re.sub(r"\s+", " ", html.unescape(label)).strip()
    noisy = (
        len(label) > 160
        or bool(re.search(
            r"(?:facebook|youtube|instagram|tiktok|threads)\b.*(?:facebook|youtube|instagram|tiktok|threads)\b|"
            r"(?:mobile gift card|gear card|menu|search|login|account).*(?:facebook|youtube|instagram|tiktok|threads)",
            label,
            re.I,
        ))
    )
    if not noisy:
        return line
    try:
        host = re.sub(r"^www\.", "", re.match(r"https?://([^/]+)", url, re.I).group(1))
    except (AttributeError, TypeError):
        host = ""
    if not host:
        return line
    known = {
        "guitarcenter.com": "Guitar Center",
        "sweetwater.com": "Sweetwater",
        "musicradar.com": "MusicRadar",
        "reverb.com": "Reverb",
        "robertkeeley.com": "Keeley Electronics",
        "perfectcircuit.com": "Perfect Circuit",
        "premierguitar.com": "Premier Guitar",
        "effectsdatabase.com": "Effects Database",
    }
    short = known.get(host, host)
    return f"{number}. {short}: {url}"

def clean_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="replace")
    out: list[str] = []
    section = ""
    changed = False
    current_pedal = ""
    for raw in original.splitlines():
        line = html.unescape(raw)
        if line != raw:
            changed = True
        heading = re.match(r"^(#{2,6})\s+(.+?)\s*$", line)
        if heading:
            section = heading.group(2).strip().lower()
            if heading.group(1) == "#" and " — " in heading.group(2):
                current_pedal = heading.group(2).split(" — ", 1)[1].strip()
        stripped = line.strip()
        source_cleaned = clean_source_label(line)
        if source_cleaned != line:
            line = source_cleaned
            changed = True
            stripped = line.strip()
        if strong_code(line) or strong_shell(line):
            changed = True
            continue
        known_shell = clean_known_shell(line)
        if known_shell is None:
            changed = True
            continue
        if known_shell != line:
            line = known_shell
            changed = True
        cleaned = clean_commerce_line(line)
        if cleaned is None:
            changed = True
            continue
        if cleaned != line:
            line = cleaned
            changed = True
        release_clean = clean_release_mismatch(line, section, current_pedal)
        if release_clean is None:
            changed = True
            continue
        if release_clean != line:
            line = release_clean
            changed = True
        if section == "transistor":
            # Amp/model references belong in sound or amp-reference context,
            # never in the transistor taxonomy. Preserve real device terms.
            stripped_amp_clean = AMP_REFERENCE_TERMS.sub("", line)
            stripped_amp_clean = re.sub(r"\s{2,}", " ", stripped_amp_clean)
            stripped_amp_clean = re.sub(r"\s*[,;:]\s*([,;])", r"\1", stripped_amp_clean)
            stripped_amp_clean = re.sub(r"\s*,\s*([.)])", r"\1", stripped_amp_clean).strip()
            if stripped_amp_clean != line:
                line = stripped_amp_clean
                stripped = line.strip()
                changed = True
            if not stripped or re.fullmatch(r"[-*]\s*(?:[-–—,;:/]|and|or)*\s*", stripped, re.I):
                changed = True
                continue
            if re.fullmatch(
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
