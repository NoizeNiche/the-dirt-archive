#!/usr/bin/env python3
import json
import re
from pathlib import Path
from PIL import Image
try:
    import pytesseract
except Exception:
    pytesseract = None

ROOT = Path(".")
ARTIFACTS = ROOT / "recovery-artifacts"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"

def http(v):
    return str(v or "").startswith(("http://", "https://"))

def load_blocked_url(value):
    raw = str(value or "").strip().lower()
    try:
        policy = json.loads(PHOTO_SOURCE_BLOCKLIST.read_text(encoding="utf-8"))
        for rule in policy.get("rules", []):
            kind = str(rule.get("type") or "")
            pattern = str(rule.get("pattern") or "")
            if kind == "exact_url" and raw == pattern.lower():
                return True
            if kind.endswith("_regex") and pattern and re.search(pattern, raw, re.I):
                return True
    except Exception:
        pass
    return False

def main():
    verdicts = []
    if not ARTIFACTS.exists():
        print("Photo foreman: no artifacts.")
        return
    result_files = sorted(ARTIFACTS.rglob("photo-recovery-result.json"))
    for result_file in result_files:
        d = result_file.parent
        files = [result_file]
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
                # Older recovery artifacts recorded the temporary .source path
                # even though the uploaded artifact contains the packaged .webp.
                if candidate and not candidate.is_file() and image_file.lower().endswith(".source"):
                    candidate = d / (image_file[:-7] + ".webp")
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
                            im.verify()
                        if pytesseract is not None:
                            with Image.open(candidate) as im:
                                probe = im.convert("RGB")
                                probe.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
                                text = " ".join(pytesseract.image_to_string(
                                    band, config="--psm 11"
                                ) for band in [probe]).lower()
                            suspicious = ("buy me a coffee", "buymeacoffee", "ko-fi", "patreon", "paypal.me", "cash.app", "venmo")
                            hit = next((term for term in suspicious if term in text), None)
                            if hit:
                                ok = False
                                reason = "recovered photo contains a high-confidence donation/platform overlay: " + hit
                source_url = str(result.get("image_source_url") or "").lower()
                if load_blocked_url(source_url):
                    ok = False
                    reason = "recovered image URL is blocked by the shared photo source policy"
                forbidden = re.search(r"(?:favicon|(?:^|[/_.-])(?:logo|loading|spinner|placeholder|sprite|avatar|badge|icon|social|banner|widget)(?:[/_.?-]|$))", source_url)
                if forbidden:
                    ok = False
                    reason = "recovered image URL looks like a site asset rather than a product photo"
            except Exception as exc:
                ok = False
                reason = "verification error: " + str(exc)
        keep = img.resolve() if ok and img else None
        for source in d.rglob("*.source"):
            if keep is None or source.resolve() != keep:
                source.unlink(missing_ok=True)
        verdicts.append({"builder":result.get("builder",""),"pedal":result.get("pedal",""),"accepted":ok,"reason":reason})
    out = ARTIFACTS / "photo-foreman-verdict.json"
    out.write_text(json.dumps({"verdicts": verdicts}, indent=2) + "\n", encoding="utf-8")
    accepted = sum(1 for x in verdicts if x["accepted"])
    print("Photo foreman: accepted " + str(accepted) + "; rejected " + str(len(verdicts)-accepted) + ".")
    for x in verdicts:
        if not x["accepted"]:
            print(" - " + x["builder"] + " / " + x["pedal"] + ": " + x["reason"])

if __name__ == "__main__":
    main()
