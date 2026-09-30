#!/usr/bin/env python3
import csv
import json
import re
import hashlib
from pathlib import Path
from PIL import Image
try:
    import pytesseract
except Exception:
    pytesseract = None

ROOT = Path(".")
ARTIFACTS = ROOT / "recovery-artifacts"
PHOTO_SOURCE_BLOCKLIST = ROOT / "research/PHOTO_SOURCE_BLOCKLIST.json"
INDEX = ROOT / "research/PEDAL_INDEX.json"
MANUAL_REVIEW = ROOT / "research/PHOTO_MANUAL_REVIEW.csv"
ASSET_ROOT = ROOT / "assets/pedals"

def http(v):
    return str(v or "").startswith(("http://", "https://"))

def load_manual_verified():
    approved = {}
    try:
        with MANUAL_REVIEW.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                if str(row.get("Status") or "").strip().upper() != "VERIFIED_PRIMARY":
                    continue
                identity = (
                    str(row.get("Builder") or "").strip(),
                    str(row.get("Pedal") or "").strip(),
                )
                image_url = str(row.get("Image URL") or "").strip()
                source_page = str(row.get("Source Page") or "").strip()
                if identity[0] and identity[1] and image_url:
                    approved[identity] = (image_url, source_page)
    except Exception:
        pass
    return approved


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


def local_image_hashes():
    hashes = {}
    try:
        catalog = json.loads(INDEX.read_text(encoding="utf-8")).get("pedals", [])
    except Exception:
        return hashes
    for entry in catalog:
        image = str(entry.get("image") or "").strip()
        if not image or image.startswith(("http://","https://")):
            continue
        path = ROOT / image.lstrip("./")
        if not path.is_file():
            continue
        try:
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
        except OSError:
            continue
        hashes.setdefault(digest, []).append((entry.get("company") or "", entry.get("pedal") or ""))
    return hashes

def main():
    manual_verified = load_manual_verified()
    verdicts = []
    existing_hashes = local_image_hashes()
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

                identity = (
                    str(result.get("builder") or "").strip(),
                    str(result.get("pedal") or "").strip(),
                )
                approved = manual_verified.get(identity)
                if approved:
                    approved_url, approved_page = approved
                    if str(result.get("image_source_url") or "").strip() != approved_url:
                        ok = False
                        reason = "recovered image URL is not the manually verified primary image"
                    elif approved_page and str(result.get("image_source_page") or "").strip() != approved_page:
                        ok = False
                        reason = "recovered source page does not match the manually verified primary source"
                elif method == "exact_source_page" and (v.get("curatedExactSourcePage") is True):
                    # Conservative automatic path: only curator-listed,
                    # model-specific source pages with raw image extraction may
                    # pass without a manual primary row. Image-search results
                    # remain manual-review-only.
                    pass
                else:
                    ok = False
                    reason = "pending recovery has no manually verified primary photo or approved exact-source-page evidence"
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
                            if im.width < 120 or im.height < 120:
                                ok = False
                                reason = "specific recovered image dimensions below 120px"
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
                candidate_hash = hashlib.sha256(candidate.read_bytes()).hexdigest() if candidate and candidate.is_file() else ""
                identity = (str(result.get("builder") or ""), str(result.get("pedal") or ""))
                reused = [pair for pair in existing_hashes.get(candidate_hash, []) if pair != identity]
                if reused:
                    ok = False
                    reason = "recovered image bytes already belong to another catalog identity: " + "; ".join(f"{b} / {p}" for b,p in reused[:4])
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
