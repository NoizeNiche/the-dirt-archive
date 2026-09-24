#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image

ROOT = Path(".")
ARTIFACTS = ROOT / "recovery-artifacts"

def http(v):
    return str(v or "").startswith(("http://", "https://"))

def main():
    verdicts = []
    if not ARTIFACTS.exists():
        print("Photo foreman: no artifacts.")
        return
    for d in [p for p in ARTIFACTS.iterdir() if p.is_dir()]:
        files = list(d.rglob("photo-recovery-result.json"))
        result = {}
        ok = True
        reason = "accepted by photo foreman"
        img = None
        if not files:
            ok = False
            reason = "missing recovery result"
        else:
            try:
                result = json.loads(files[0].read_text(encoding="utf-8"))
                v = result.get("verification") or {}
                method = str(v.get("method") or "")
                ok = bool(result.get("builder")) and bool(result.get("pedal")) and http(result.get("image_source_url")) and http(result.get("image_source_page"))
                ok = ok and v.get("identityVerified") is True
                ok = ok and method in {"direct_exact","exact_source_page","verified_image_search","verified_source_page"}
                if method == "verified_image_search":
                    ok = ok and v.get("strongSearchIdentity") is True and float(v.get("sourceScore") or 0) >= 120
                image_file = str(result.get("imageFile") or "").lstrip("./")
                candidate = d / image_file if image_file else None
                if not candidate or not candidate.is_file():
                    ok = False
                    reason = "specific recovered image file missing"
                else:
                    img = candidate
                    if candidate.stat().st_size < 3000:
                        ok = False
                        reason = "specific recovered image too small"
                    else:
                        with Image.open(candidate) as im:
                            if im.width < 80 or im.height < 80:
                                ok = False
                                reason = "specific recovered image dimensions too small"
                            im.verify()
            except Exception as exc:
                ok = False
                reason = "verification error: " + str(exc)
        keep = img.resolve() if ok and img else None
        for source in d.rglob("*.source"):
            if keep is None or source.resolve() != keep:
                source.unlink(missing_ok=True)
        verdicts.append({"builder":result.get("builder",""),"pedal":result.get("pedal",""),"accepted":ok,"reason":reason})
    out = ARTIFACTS / "photo-foreman-verdict.json"
    out.write_text(json.dumps({"verdicts":verdicts}, indent=2) + "
", encoding="utf-8")
    accepted = sum(1 for x in verdicts if x["accepted"])
    print("Photo foreman: accepted " + str(accepted) + "; rejected " + str(len(verdicts)-accepted) + ".")
    for x in verdicts:
        if not x["accepted"]:
            print(" - " + x["builder"] + " / " + x["pedal"] + ": " + x["reason"])

if __name__ == "__main__":
    main()
