#!/usr/bin/env python3
"""Harvest likely builder logo references from official pages and Wikimedia Commons.

This is a reference harvester, not an ownership transfer mechanism. The public
site stores source page + attribution and may display externally hosted
references. Missing/ambiguous logos remain unresolved rather than guessed.
"""
from __future__ import annotations

import csv
import json
import re
import time
from html import unescape
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CENSUS = ROOT / "research" / "builder-master-census-01.tsv"
OUT = ROOT / "public" / "catalog-builder-logo-manifest.js"
STATUS = ROOT / "research" / "catalog-builder-logo-status-01.tsv"
API = "https://commons.wikimedia.org/w/api.php"


def http_text(url: str) -> str:
    req = Request(url, headers={"User-Agent": "The-Dirt-Archive/1.0 (builder logo research)"})
    with urlopen(req, timeout=20) as r:
        raw = r.read()
        return raw.decode("utf-8", errors="replace")


def http_json(url: str) -> dict:
    return json.loads(http_text(url))


def tokens(name: str) -> list[str]:
    raw = re.findall(r"[A-Za-z0-9]+", name.lower())
    stop = {"effects", "effect", "audio", "pedals", "pedal", "electronics", "electronic", "inc", "llc", "co", "company", "guitars", "guitar"}
    return [t for t in raw if len(t) >= 3 and t not in stop]


def source_urls(row: dict) -> list[str]:
    raw = str(row.get("source_refs") or "")
    return [x.strip() for x in re.split(r"[; ]+", raw) if x.strip().startswith(("http://", "https://"))]


def official_page_hits(name: str, row: dict) -> list[dict]:
    hits: list[dict] = []
    for url in source_urls(row)[:4]:
        try:
            html = http_text(url)
        except Exception:
            continue
        base = url
        og = re.findall(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)', html, flags=re.I)
        for image_url in og:
            hits.append({"src": urljoin(base, unescape(image_url)), "page": url, "context": "og:image", "domain": urlparse(url).netloc})
        for m in re.finditer(r'<img\b[^>]*>', html, flags=re.I):
            tag = m.group(0)
            attrs = dict((k.lower(), unescape(v1 or v2 or "")) for k, v1, v2 in re.findall(r'([A-Za-z_:][-A-Za-z0-9_:]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', tag))
            src = attrs.get("src") or attrs.get("data-src") or attrs.get("data-lazy-src")
            if not src:
                continue
            hay = " ".join([tag, attrs.get("alt", ""), attrs.get("title", ""), src]).lower()
            hits.append({"src": urljoin(base, src), "page": url, "context": hay, "domain": urlparse(url).netloc})
        time.sleep(0.08)
    return hits


def search_commons(name: str) -> list[dict]:
    queries = [f"{name} logo", f"{name} brand", name]
    hits: list[dict] = []
    seen = set()
    for q in queries:
        url = API + "?" + "&".join([
            "action=query",
            "generator=search",
            f"gsrsearch={quote(q)}",
            "gsrnamespace=6",
            "gsrlimit=8",
            "prop=imageinfo",
            "iiprop=url|extmetadata",
            "iiurlwidth=700",
            "format=json",
        ])
        try:
            data = http_json(url)
        except Exception:
            continue
        for page in (data.get("query", {}).get("pages", {}) or {}).values():
            info = (page.get("imageinfo") or [{}])[0]
            title = page.get("title", "")
            thumb = info.get("thumburl") or info.get("url")
            pageurl = "https://commons.wikimedia.org/wiki/" + quote(title.replace(" ", "_"), safe=":/_()")
            if not thumb or pageurl in seen:
                continue
            seen.add(pageurl)
            meta = info.get("extmetadata") or {}
            label = str(meta.get("ImageDescription", {}).get("value", ""))
            hits.append({"src": thumb, "page": pageurl, "context": f"{title} {label}", "domain": "commons.wikimedia.org"})
        time.sleep(0.08)
    return hits


def score(name: str, hit: dict, official_domains: set[str]) -> int:
    hay = " ".join([hit.get("context", ""), hit.get("src", "")]).lower()
    ts = tokens(name)
    s = 0
    if "logo" in hay:
        s += 18
    if "wordmark" in hay:
        s += 14
    if "brand" in hay:
        s += 5
    for t in ts:
        if t in hay:
            s += 4
    if hit.get("domain") in official_domains:
        s += 15
    bad = ["album", "person", "guitar", "photo", "pedal", "stompbox", "event", "poster", "building", "banner", "favicon", "icon", "avatar"]
    for b in bad:
        if b in hay:
            s -= 5
    return s


def main() -> None:
    rows = []
    with CENSUS.open("r", encoding="utf-8") as f:
        for row in csv.DictReader(f, delimiter="\t"):
            name = (row.get("canonical_builder") or "").strip()
            if name:
                rows.append(row)

    manifest: dict[str, dict] = {}
    status_rows = [["builder", "status", "image_url", "source_page", "source_type", "note"]]

    for row in rows:
        name = row["canonical_builder"]
        official = official_page_hits(name, row)
        official_domains = {h["domain"] for h in official if h.get("domain") and h.get("domain") != "commons.wikimedia.org"}
        all_hits = official + search_commons(name)
        ranked = sorted(all_hits, key=lambda h: score(name, h, official_domains), reverse=True)
        best = ranked[0] if ranked and score(name, ranked[0], official_domains) >= 14 else None
        if best:
            source_type = "Official builder page" if best.get("domain") in official_domains else "Wikimedia Commons"
            manifest[name] = {
                "src": best["src"],
                "page": best["page"],
                "source_type": source_type,
                "query": name + " logo",
            }
            status_rows.append([name, "FOUND", best["src"], best["page"], source_type, "Logo candidate selected by source/domain/context scoring; review attribution before treating as definitive brand mark."])
        else:
            status_rows.append([name, "UNRESOLVED", "", "", "Official page + Wikimedia Commons", "No sufficiently strong logo candidate found in the automated pass."])

    OUT.write_text("window.DIRT_BUILDER_LOGOS=" + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    with STATUS.open("w", encoding="utf-8", newline="") as f:
        csv.writer(f, delimiter="\t", lineterminator="\n").writerows(status_rows)
    print(f"Harvested {len(manifest)} builder logo references from {len(rows)} census builders")


if __name__ == "__main__":
    main()
