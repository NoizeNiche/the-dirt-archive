#!/usr/bin/env python3
"""Conservatively remove obvious scraped webpage residue from research markdown."""

from __future__ import annotations
import difflib
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research/pedals"

SHELL_MARKERS = (
    "skip to content", "skip to main content", "log in now", "log in to suggest improvements", "sign in",
    "hello, sign in", "account & lists", "add to my bookmarks", "add manual", "upload download",
    "share url of this page", "back to products", "privacy terms", "all departments",
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

BAD_SOURCE_TEXT = (
    "verify your identity",
    "access denied",
    "captcha",
    "robot check",
    "/blocked?",
    "blocked?url=",
    "/login",
)

def bad_source_line(line: str) -> bool:
    if not SOURCE_LINE.match(line):
        return False
    lower = html.unescape(line).lower()
    return any(marker in lower for marker in BAD_SOURCE_TEXT)

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

def title_residue(line: str, current_pedal: str) -> bool:
    """Reject standalone near-duplicate pedal-title fragments left by scrapers."""
    if not current_pedal or not line.strip():
        return False
    visible = markdown_visible(line).strip(" .:;|-")
    if not (8 <= len(visible) <= len(current_pedal) + 14):
        return False
    # A genuine sentence about the pedal can contain its full name. Residue is
    # normally a short, punctuation-light title fragment with little verb
    # structure, so exclude ordinary sentence openings before fuzzy matching.
    if re.search(r"\b(?:is|are|was|were|uses|using|features|offers|delivers|provides|described|voiced|designed|lets|allows)\b", visible, re.I):
        return False
    candidates = [current_pedal]
    if " - " in current_pedal:
        candidates.append(current_pedal.split(" - ", 1)[1].strip())
    if " — " in current_pedal:
        candidates.append(current_pedal.split(" — ", 1)[1].strip())
    norm_line = re.sub(r"[^a-z0-9]+", " ", visible.casefold()).strip()
    for candidate in candidates:
        norm_candidate = re.sub(r"[^a-z0-9]+", " ", candidate.casefold()).strip()
        if not norm_candidate:
            continue
        ratio = difflib.SequenceMatcher(None, norm_line, norm_candidate).ratio()
        if ratio >= 0.84:
            return True
    return False

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


def markdown_visible(text: str) -> str:
    text = re.sub(r"https?://\S+", "", html.unescape(text or ""))
    text = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", text)
    text = re.sub(r"[*_\`#>-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def section_text(markdown: str, heading: str) -> str:
    match = re.search(
        rf"(?ms)^##\s+{re.escape(heading)}\s*$\n(.*?)(?=^##\s+|\Z)",
        markdown,
    )
    return match.group(1).strip() if match else ""


def deep_verified_subsection(markdown: str, subheading: str) -> str:
    deep = section_text(markdown, "Deep research verification")
    if not deep:
        return ""
    match = re.search(
        rf"(?ms)^###\s+{re.escape(subheading)}\s*$\n(.*?)(?=^###\s+|\Z)",
        deep,
    )
    return match.group(1).strip() if match else ""


def candidate_lines(text: str) -> str:
    lines = []
    for raw in str(text or "").splitlines():
        value = raw.strip()
        if not value or value.startswith(("Source:", "Sources:")):
            continue
        visible = markdown_visible(value)
        if visible:
            lines.append(visible)
    return "\n".join(lines).strip()


def weak_visible_description(markdown: str) -> bool:
    text = markdown_visible(section_text(markdown, "What this pedal is"))
    return bool(
        len(text) < 90
        or re.fullmatch(
            r".{0,30}(?:is|are)\s+(?:cataloged|listed|classified)\s+as\s+\w+.*",
            text,
            re.I,
        )
    )


def weak_visible_sound(markdown: str) -> bool:
    text = markdown_visible(section_text(markdown, "Sound"))
    return bool(
        len(text) < 90
        or re.search(
            r"did not contain enough .*?(?:pedal-specific|product-specific).*?(?:description|evidence)|"
            r"not enough .*? to make a more detailed sound summary",
            text,
            re.I,
        )
    )


def strong_verified_description(candidate: str, pedal: str) -> bool:
    visible = markdown_visible(candidate)
    return (
        len(visible) >= 90
        and pedal.casefold() in visible.casefold()
        and not re.search(
            r"\b(?:is|are)\s+(?:cataloged|listed|classified)\s+as\b",
            visible,
            re.I,
        )
        and bool(
            re.search(
                r"\b(?:is|are|designed|developed|delivers|offers|features|combines|uses|includes)\b",
                visible,
                re.I,
            )
        )
    )


def strong_verified_sound(candidate: str) -> bool:
    visible = markdown_visible(candidate)
    return len(visible) >= 90 and bool(
        re.search(
            r"\b(?:tone|gain|fuzz|drive|distortion|overdrive|response|texture|saturation|breakup|grit|boost|crunch|dynamic|headroom)\b",
            visible,
            re.I,
        )
    )


def fallback_verified_sound(markdown: str) -> str:
    deep = section_text(markdown, "Deep research verification")
    if not deep:
        return ""
    kept = []
    for raw in deep.splitlines():
        value = raw.strip()
        if not value or value.startswith(("-", "*", "Source:")):
            continue
        visible = markdown_visible(value)
        lower = visible.lower()
        if len(visible) < 90 or obvious_scrape_payload(visible):
            continue
        if re.search(
            r"\b(?:sound|tone|voic|fuzz|distortion|overdrive|response|texture|saturation|breakup|grit|boost|crunch|dynamic|sustain|harmonic|aggressive|warm|sweet|buzzy|spitting|thick|tight|high-gain|low-gain)\b",
            lower,
        ):
            kept.append(visible)
    return "\n".join(kept[:4]).strip()


def replace_section_body(markdown: str, heading: str, body: str) -> str:
    pattern = re.compile(
        rf"(?ms)^##\s+{re.escape(heading)}\s*$\n.*?(?=^##\s+|\Z)"
    )
    replacement = f"## {heading}\n\n{body.strip()}\n\n"
    updated, count = pattern.subn(replacement, markdown, count=1)
    if count:
        return updated

    # Older records can have verified prose without a corresponding public
    # section. Insert the promoted section before the nearest stable footer or
    # before the next record heading instead of silently dropping the repair.
    anchors = [
        r"^##\s+Sources checked\s*$",
        r"^##\s+Photo\s*$",
        r"^##\s+Deep research verification\s*$",
    ]
    anchor = None
    for candidate in anchors:
        match = re.search(candidate, markdown, re.M)
        if match:
            anchor = match.start()
            break
    if anchor is None:
        return markdown.rstrip() + "\n\n" + replacement.rstrip() + "\n"
    return markdown[:anchor].rstrip() + "\n\n" + replacement + markdown[anchor:]



VISIBLE_SCRAPE_MARKERS = (
    "javascript is disabled",
    "enable javascript",
    "add to cart",
    "add to wishlist",
    "view wishlist",
    "gear card",
    "gear catalog",
    "report incorrect information",
    "my pedalboards",
    "add to my pedalboard",
    "soundcloud",
    "you may also like",
    "related products",
    "related items",
    "shopping bag",
    "checkout",
    "quantity",
    "cookie policy",
    "privacy policy",
    "american express",
    "mastercard",
    "paypal",
    "shop pay",
    "visa",
    "©",
    "published on",
)


def obvious_scrape_payload(text: str) -> bool:
    visible = markdown_visible(text)
    lower = visible.lower()
    if any(marker in lower for marker in VISIBLE_SCRAPE_MARKERS):
        return True
    if re.search(r"\b\d{1,3}(?:,\d{3})+\s+views\b", lower):
        return True
    if sum(1 for marker in ("home", "blog", "categories", "authors", "about", "contact") if marker in lower) >= 3:
        return True
    if sum(1 for marker in ("facebook", "instagram", "tiktok", "twitter", "threads", "youtube", "pinterest") if marker in lower) >= 2:
        return True
    if sum(1 for marker in ("american express", "mastercard", "paypal", "shop pay", "visa", "discover", "diners club") if marker in lower) >= 2:
        return True
    return False


def archive_catalog_identity(markdown: str) -> tuple[str, str, str]:
    title_match = re.search(r"^#\s+.+?\s+—\s+(.+?)\s*$", markdown, re.M)
    builder_match = re.search(r"^\s*-\s+\*\*Builder:\*\*\s+(.+?)\s*$", markdown, re.M)
    type_match = re.search(r"^\s*-\s+\*\*Catalog type:\*\*\s+(.+?)\s*$", markdown, re.M)
    pedal = title_match.group(1).strip() if title_match else ""
    builder = builder_match.group(1).strip() if builder_match else ""
    catalog_type = type_match.group(1).strip() if type_match else "effect"
    return builder, pedal, catalog_type


def sanitize_visible_sections(markdown: str) -> str:
    builder, pedal, catalog_type = archive_catalog_identity(markdown)
    updated = markdown
    for heading in ("What this pedal is", "Sound"):
        body = section_text(updated, heading)
        if not body or not obvious_scrape_payload(body):
            continue
        if heading == "What this pedal is" and builder and pedal:
            replacement = f"{builder}'s {pedal} is cataloged in the archive as a {catalog_type} pedal."
        else:
            replacement = "No verified pedal-specific sonic summary is currently established in the archive."
        updated = replace_section_body(updated, heading, replacement)
    return updated

def promote_verified_prose(markdown: str) -> str:
    title_match = re.search(r"^#\s+.+?\s+—\s+(.+?)\s*$", markdown, re.M)
    pedal = title_match.group(1).strip() if title_match else ""
    updated = markdown

    verified_description = candidate_lines(
        deep_verified_subsection(markdown, "Verified description")
    )
    if (
        weak_visible_description(markdown)
        and pedal
        and strong_verified_description(verified_description, pedal)
        and not obvious_scrape_payload(verified_description)
    ):
        updated = replace_section_body(
            updated,
            "What this pedal is",
            verified_description,
        )

    verified_sound = candidate_lines(
        deep_verified_subsection(markdown, "Verified sound evidence")
    )
    if not strong_verified_sound(verified_sound):
        verified_sound = fallback_verified_sound(markdown)
    if (
        weak_visible_sound(updated)
        and strong_verified_sound(verified_sound)
        and not obvious_scrape_payload(verified_sound)
    ):
        updated = replace_section_body(updated, "Sound", verified_sound)

    return sanitize_visible_sections(updated)

DUPLICATE_SECTION_NAMES = {
    "what this pedal is",
    "sound",
    "photo",
    "sources checked",
    "deep research verification",
}


def section_quality(body: str, heading: str) -> tuple[int, int]:
    visible = markdown_visible(body)
    lower = visible.lower()
    score = len(visible)
    score += 180 * len(re.findall(
        r"\b(?:verified|confirmed|cross-checked|manufacturer|manual|transistor|"
        r"germanium|silicon|jfet|mosfet|op[- ]?amp|diode|clipping|tone|gain|"
        r"fuzz|overdrive|distortion|response|saturation|headroom)\b",
        lower,
    ))
    if heading == "sources checked":
        score += 400 * len(re.findall(r"^\s*\d+\.\s+.+https?://", body, re.M))
    return score, len(visible)


def dedupe_repeated_sections(markdown: str) -> str:
    pattern = re.compile(r"(?ms)^##\s+(.+?)\s*$\n(.*?)(?=^##\s+|\Z)")
    matches = list(pattern.finditer(markdown))
    if not matches:
        return markdown

    selected = {}
    ordered = []
    for match in matches:
        heading = match.group(1).strip()
        key = heading.casefold()
        body = match.group(2).strip()
        if key not in DUPLICATE_SECTION_NAMES:
            ordered.append((heading, body))
            continue
        if key == "sources checked":
            prior = selected.get(key)
            if prior is None:
                selected[key] = [heading, body]
                ordered.append((heading, body))
                continue
            lines = prior[1].splitlines()
            seen = {markdown_visible(x).casefold() for x in lines if x.strip()}
            additions = []
            for line in body.splitlines():
                if not line.strip():
                    continue
                norm_line = markdown_visible(line).casefold()
                if norm_line and norm_line not in seen:
                    seen.add(norm_line)
                    additions.append(line.rstrip())
            if additions:
                prior[1] = prior[1].rstrip() + "\n" + "\n".join(additions)
            continue

        candidate = [heading, body, match.start()]
        prior = selected.get(key)
        if prior is None:
            selected[key] = candidate
            ordered.append((heading, body))
            continue
        prior_score = section_quality(prior[1], key)
        candidate_score = section_quality(body, key)
        if candidate_score > prior_score or (
            candidate_score == prior_score and match.start() > prior[2]
        ):
            for idx, pair in enumerate(ordered):
                if pair[0].casefold() == key:
                    ordered[idx] = (heading, body)
                    break
            selected[key] = candidate

    prefix = markdown[:matches[0].start()]
    rebuilt = prefix.rstrip()
    if rebuilt:
        rebuilt += "\n\n"
    rebuilt += "\n\n".join(
        f"## {heading}\n\n{body}" if body else f"## {heading}"
        for heading, body in ordered
    )
    return rebuilt.rstrip() + "\n"


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
        title_heading = re.match(r"^#\s+.+?\s+—\s+(.+?)\s*$", line)
        if title_heading:
            current_pedal = title_heading.group(1).strip()
        heading = re.match(r"^(#{2,6})\s+(.+?)\s*$", line)
        if heading:
            section = heading.group(2).strip().lower()
        stripped = line.strip()
        if bad_source_line(line):
            changed = True
            continue
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
        if section in {"sound", "what this pedal is", "deep research verification"} and title_residue(line, current_pedal):
            changed = True
            continue
        if section == "deep research verification" and re.fullmatch(r"-\s*The evidence references:\s*revision\.?", line.strip(), re.I):
            changed = True
            continue
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
    deduped = dedupe_repeated_sections(new)
    if deduped != new:
        new = deduped
        changed = True
    promoted = promote_verified_prose(new)
    if promoted != new:
        new = promoted
        changed = True
    deduped_after_promotion = dedupe_repeated_sections(new)
    if deduped_after_promotion != new:
        new = deduped_after_promotion
        changed = True
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
