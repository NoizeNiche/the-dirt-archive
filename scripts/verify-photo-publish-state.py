#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image

INDEX = Path("research/PEDAL_INDEX.json")

def main():
    catalog = json.loads(INDEX.read_text(encoding="utf-8"))
    issues = []
    checked = 0
    for item in catalog.get("pedals", []):
        image = str(item.get("image") or "").strip()
        if not image:
            continue
        checked += 1
        asset = Path(image[2:] if image.startswith("./") else image)
        if not asset.is_file():
            issues.append(item.get("company","") + " / " + item.get("pedal","") + ": missing " + image)
            continue
        if asset.stat().st_size < 3000:
            issues.append(item.get("company","") + " / " + item.get("pedal","") + ": image too small")
            continue
        if not str(item.get("image_source_url") or "").startswith(("http://","https://")):
            issues.append(item.get("company","") + " / " + item.get("pedal","") + ": missing image_source_url")
        if not str(item.get("image_source_page") or "").startswith(("http://","https://")):
            issues.append(item.get("company","") + " / " + item.get("pedal","") + ": missing image_source_page")
        try:
            with Image.open(asset) as im:
                if im.width < 80 or im.height < 80:
                    issues.append(item.get("company","") + " / " + item.get("pedal","") + ": dimensions too small")
                im.verify()
        except Exception as exc:
            issues.append(item.get("company","") + " / " + item.get("pedal","") + ": invalid image: " + str(exc))
    print("Photo publication foreman checked " + str(checked) + " local catalog images.")
    if issues:
        for issue in issues[:100]:
            print(" - " + issue)
        raise SystemExit(1)
    print("Photo publication foreman: PASS")

if __name__ == "__main__":
    main()
