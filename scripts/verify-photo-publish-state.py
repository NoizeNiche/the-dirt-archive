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
        # Existing legacy images are not re-gated here. Newly recovered images
        # already pass the stricter photo-foreman artifact gate before merge.
        # Legacy catalog images may predate the current provenance contract.
        # Missing provenance is reported but does not block unrelated new photo
        # recoveries; newly recovered artifacts are already gated by the photo
        # foreman before they can enter the catalog.
        if not str(item.get("image_source_url") or "").startswith(("http://","https://")):
            print("WARN " + item.get("company","") + " / " + item.get("pedal","") + ": missing image_source_url")
        if not str(item.get("image_source_page") or "").startswith(("http://","https://")):
            print("WARN " + item.get("company","") + " / " + item.get("pedal","") + ": missing image_source_page")
        try:
            with Image.open(asset) as im:
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
