#!/usr/bin/env python3
"""Review photo provenance for generic/non-product source pages."""

from __future__ import annotations
import csv,json,re
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
INDEX=ROOT/"research/PEDAL_INDEX.json"
OUT=ROOT/"research/PHOTO_PROVENANCE_REVIEW.csv"

GENERIC_PATTERNS=[
    ("effectsdb_category",re.compile(r"effects?database\.com/(?:type|tag|category|taxonomy)(?:/|$)",re.I)),
    ("search_results",re.compile(r"/(?:search|results)(?:[/?]|$)",re.I)),
    ("builder_directory",re.compile(r"/(?:brands?|builders?)(?:[/?]|$)",re.I)),
    ("homepage",re.compile(r"^https?://[^/]+/?$",re.I)),
    ("blog_or_review",re.compile(r"/(?:blog|news|article|articles|review|reviews|guide|guides)(?:/|$)",re.I)),
]

def reason(url):
    raw=str(url or "").strip()
    for label,pattern in GENERIC_PATTERNS:
        if pattern.search(raw): return label
    return ""

def main():
    data=json.loads(INDEX.read_text(encoding="utf-8"))
    rows=[]
    for e in data.get("pedals",[]):
        if not e.get("image"): continue
        page=str(e.get("image_source_page") or e.get("source_page") or "").strip()
        image=str(e.get("image_source_url") or "").strip()
        why=reason(page)
        if not why and page:
            try:
                path=urlparse(page).path.lower()
                if path.count("/")<=1 and "effectsdatabase.com" in urlparse(page).hostname.lower():
                    why="effectsdb_non_product_page"
            except Exception: pass
        if why:
            rows.append({
                "Builder":e.get("company",""),
                "Pedal":e.get("pedal",""),
                "Image":image,
                "Image Source Page":page,
                "Reason":why,
            })
    rows.sort(key=lambda r:(r["Builder"],r["Pedal"]))
    with OUT.open("w",newline="",encoding="utf-8") as handle:
        fields=["Builder","Pedal","Image","Image Source Page","Reason"]
        w=csv.DictWriter(handle,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)
    print(f"Photo provenance review: {len(rows)} records with generic/non-product source-page patterns.")

if __name__=="__main__":
    main()
