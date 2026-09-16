#!/usr/bin/env python3
"""Harvest likely builder logo references from Wikimedia Commons.

This is a reference harvester, not an ownership transfer mechanism. The public
site stores source page + attribution and may display only externally hosted
references. Missing/ambiguous logos remain unresolved rather than guessed.
"""
from __future__ import annotations

import csv
import json
import re
import time
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CENSUS = ROOT / "research" / "builder-master-census-01.tsv"
OUT = ROOT / "public" / "catalog-builder-logo-manifest.js"
STATUS = ROOT / "research" / "catalog-builder-logo-status-01.tsv"
API = "https://commons.wikimedia.org/w/api.php"


def http_json(url: str) -> dict:
    req = Request(url, headers={"User-Agent": "The-Dirt-Archive/1.0 (builder logo research)"})
    with urlopen(req, timeout=20) as r:
        return json.load(r)


def tokens(name: str) -> list[str]:
    raw = re.findall(r"[A-Za-z0-9]+", name.lower())
    stop = {"effects", "effect", "audio", "pedals", "pedal", "electronics", "electronic", "inc", "llc", "co", "company"}
    return [t for t in raw if len(t) >= 3 and t not in stop]


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
            hits.append({"title": title, "thumb": thumb, "page": pageurl, "label": re.sub("<[^>]+>", " ", label)})
        time.sleep(0.08)
    return hits


def score(name: str, hit: dict) -> int:
    hay = " ".join([hit.get("title", ""), hit.get("label", "")]).lower()
    ts = tokens(name)
    s = 0
    if "logo" in hay:
        s += 12
    if "brand" in hay:
        s += 4
    for t in ts:
        if t in hay:
            s += 4
    bad = ["album", "person", "guitar", "photo", "pedal", "stompbox", "event", "poster", "building"]
    for b in bad:
        if b in hay:
            s -= 3
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
        hits = search_commons(name)
        ranked = sorted(hits, key=lambda h: score(name, h), reverse=True)
        best = ranked[0] if ranked and score(name, ranked[0]) >= 8 else None
        if best:
            manifest[name] = {
                "src": best["thumb"],
                "page": best["page"],
                "source_type": "Wikimedia Commons",
                "query": name + " logo",
            }
            status_rows.append([name, "FOUND", best["thumb"], best["page"], "Wikimedia Commons", "Logo candidate selected by title/context scoring; review attribution before treating as definitive brand mark."])
        else:
            status_rows.append([name, "UNRESOLVED", "", "", "Wikimedia Commons", "No sufficiently strong logo candidate found in the automated pass."])

    OUT.write_text("window.DIRT_BUILDER_LOGOS=" + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    with STATUS.open("w", encoding="utf-8", newline="") as f:
        csv.writer(f, delimiter="\t", lineterminator="\n").writerows(status_rows)
    print(f"Harvested {len(manifest)} builder logo references from {len(rows)} census builders")


if __name__ == "__main__":
    main()
