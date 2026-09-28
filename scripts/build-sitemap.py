#!/usr/bin/env python3
"""Build the public XML sitemap from the canonical Dirt Archive catalog."""

from __future__ import annotations
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "research/PEDAL_INDEX.json"
SITEMAP = ROOT / "sitemap.xml"
BASE = "https://noizeniche.github.io/the-dirt-archive/"


def xml_escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def builder_url(builder: str) -> str:
    return BASE + "builder.html?builder=" + quote(builder, safe="")


def public_url(builder: str, pedal: str) -> str:
    return (
        BASE
        + "pedal-detail.html?builder="
        + quote(builder, safe="")
        + "&pedal="
        + quote(pedal, safe="")
    )


def main() -> None:
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    pedals = [
        item for item in catalog.get("pedals", [])
        if item.get("catalog_role") != "variation"
        and str(item.get("company") or "").strip()
        and str(item.get("pedal") or "").strip()
    ]

    builders = sorted({
        str(item["company"]).strip()
        for item in pedals
        if str(item.get("company") or "").strip()
    }, key=str.casefold)

    urls = [
        BASE,
        BASE + "builders.html",
        BASE + "methodology.html",
        BASE + "audit.html",
        BASE + "compare.html",
        *[builder_url(builder) for builder in builders],
        *[public_url(str(item["company"]).strip(), str(item["pedal"]).strip()) for item in pedals],
    ]

    deduped = list(dict.fromkeys(urls))
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url in deduped:
        lines.extend(["  <url>", f"    <loc>{xml_escape(url)}</loc>", "  </url>"])
    lines.append("</urlset>")
    SITEMAP.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Sitemap built: {len(deduped)} public URLs ({len(pedals)} pedal records).")


if __name__ == "__main__":
    main()
