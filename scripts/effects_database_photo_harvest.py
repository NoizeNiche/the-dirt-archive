#!/usr/bin/env python3
"""Harvest product-photo references from Effects Database.

Breadth-first photo pass for The Dirt Archive. The script crawls Effects Database
category indexes, resolves exact product pages against the catalog, and extracts
OpenGraph/page images. It stores source URLs and reference metadata only.
"""
from __future__ import annotations

import csv
import html
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "catalog-effects-database-photo-manifest.js"
STATUS = ROOT / "research" / "catalog-effects-database-photo-status-01.tsv"
BASE = "https://www.effectsdatabase.com"
UA = "The-Dirt-Archive/1.4 (Effects Database photo research)"
CATEGORIES = ("fuzz", "overdrive", "distortion")
MAX_PAGES = 60


def get_text(url: str) -> str:
    req = Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"})
    with urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "ignore")


def clean_text(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def norm(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", " ", (s or "").lower())
    return re.sub(r"\s+", " ", s).strip()


def extract_model_links(page_html: str) -> list[tuple[str, str]]:
    out = []
    seen = set()
    pat = re.compile(r'<a[^>]+href=["\']([^"\']*/model/[^"\']+)["\'][^>]*>(.*?)</a>', re.I | re.S)
    for href, inner in pat.findall(page_html):
        url = urljoin(BASE, href)
        if "/model/" not in url or urlparse(url).netloc not in {"www.effectsdatabase.com", "effectsdatabase.com"}:
            continue
        text = clean_text(inner)
        key = (url, text)
        if key in seen:
            continue
        seen.add(key)
        out.append((text, url))
    return out


def crawl_category(category: str) -> list[tuple[str, str]]:
    products: list[tuple[str, str]] = []
    seen_urls = set()
    for page in range(1, MAX_PAGES + 1):
        url = f"{BASE}/type/{category}/pedal" + (f"?page={page}" if page > 1 else "")
        try:
            text = get_text(url)
        except Exception:
            break
        links = extract_model_links(text)
        fresh = [(t, u) for t, u in links if u not in seen_urls]
        if not fresh:
            break
        products.extend(fresh)
        seen_urls.update(u for _, u in fresh)
        # Category pages expose 100 products/page in the current site.
        if len(fresh) < 50:
            break
        time.sleep(0.12)
    return products


def parse_meta_images(page_html: str) -> list[str]:
    urls: list[str] = []
    for pat in [
        r'<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)',
        r'<img[^>]+(?:src|data-src|data-lazy-src)=["\']([^"\']+)',
        r'<source[^>]+srcset=["\']([^"\']+)',
    ]:
        for value in re.findall(pat, page_html, re.I | re.S):
            for part in value.split(','):
                u = part.strip().split(' ')[0]
                if u:
                    urls.append(urljoin(BASE, html.unescape(u)))
    out=[]
    seen=set()
    bad = ("logo", "icon", "avatar", "facebook", "twitter", "instagram", "youtube", "pixel", "tracking", "banner")
    for u in urls:
        if u in seen or not u.startswith(('http://','https://')):
            continue
        low=u.lower()
        if any(b in low for b in bad):
            continue
        seen.add(u); out.append(u)
    return out


def candidate_score(product_title: str, builder: str, target_model: str) -> int:
    hay = norm(product_title)
    s = 0
    nt = norm(target_model)
    nb = norm(builder)
    if hay == norm(f"{builder} {target_model}"):
        s += 20
    if nt and nt in hay:
        s += 12
    for word in nb.split():
        if len(word) >= 4 and word in hay:
            s += 3
    return s


def load_catalog() -> tuple[list[dict], dict[str, str]]:
    data = json.loads((PUBLIC / "data.json").read_text(encoding="utf-8"))
    pedals = list(data.get("pedals", []))
    builders = {str(b.get("builder_id")): b.get("name", "") for b in data.get("builders", [])}
    seen = {(str(p.get("primary_builder_id")), norm(p.get("model_name", ""))) for p in pedals}
    for path in sorted(PUBLIC.glob("discovery-*.tsv")):
        for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
            parts = line.split('\t')
            if len(parts) < 4:
                continue
            pedal_id, builder_id, category, model = parts[:4]
            key=(builder_id,norm(model))
            if key in seen: continue
            seen.add(key)
            pedals.append({"pedal_id":pedal_id,"primary_builder_id":builder_id,"primary_category":category,"model_name":model})
    return pedals, builders


def main() -> None:
    pedals, builders = load_catalog()
    all_products=[]
    for category in CATEGORIES:
        all_products.extend(crawl_category(category))
    # Collapse duplicate URLs while keeping the strongest title variant.
    by_url={}
    for title,url in all_products:
        by_url[url]=max([by_url.get(url, ''), title], key=len)

    manifest={}
    status=[['pedal_id','builder','model','photo_count','source_page','status']]
    for p in pedals:
        model=str(p.get('model_name') or '').strip()
        builder=builders.get(str(p.get('primary_builder_id')), '')
        if not model: continue
        ranked=sorted(((candidate_score(title,builder,model),title,url) for url,title in by_url.items()), reverse=True)
        best=[x for x in ranked if x[0] >= 12][:4]
        if not best:
            status.append([p.get('pedal_id',''),builder,model,0,'','UNRESOLVED'])
            continue
        images=[]
        primary_page=best[0][2]
        for score,title,url in best[:2]:
            try:
                page_html=get_text(url)
                for image in parse_meta_images(page_html):
                    if image not in images:
                        images.append(image)
                        if len(images)>=6: break
            except Exception:
                pass
            time.sleep(0.06)
            if len(images)>=6: break
        if images:
            manifest[model]={
                'src':images[0],
                'page':primary_page,
                'credit':'Effects Database reference page',
                'license':'Reference-only; see source page for rights/attribution',
                'source':'Effects Database',
                'gallery':images[:6],
            }
            status.append([p.get('pedal_id',''),builder,model,len(images),primary_page,'FOUND'])
        else:
            status.append([p.get('pedal_id',''),builder,model,0,primary_page,'PAGE_FOUND_NO_IMAGE'])
    OUT.write_text('window.DIRT_EDB_PHOTO_MANIFEST = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    with STATUS.open('w',encoding='utf-8',newline='') as f:
        csv.writer(f,delimiter='\t',lineterminator='\n').writerows(status)
    print(f'EDB photo references: {len(manifest)} matched of {len(pedals)} catalog candidates; crawled {len(by_url)} product pages')


if __name__=='__main__':
    main()
