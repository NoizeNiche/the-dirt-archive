## Public-site UX checkpoint - September 22, 2026

The public detail page now carries the current pedal's dirt-type context into its sidebar navigation. Relevant dirt-type buttons are highlighted and marked as the current page, and the breadcrumb now identifies the pedal's dirt type(s) and builder instead of using a generic "Pedal record" label.

The landing page now has a one-click **Clear filters** control that appears whenever search, builder, or dirt-type filtering is active. It resets those controls and the pagination through the existing URL/history state machinery.

Latest site commits:
- `156b6c4e` - connect detail navigation to pedal context
- `edea1b95` / `28c27057` / `a41362fc` - add and style Clear filters control

The deployment run for the detail-navigation change passed archive validation and reached the browser-audit stage. The Clear filters commits superseded the intermediate deployment attempts through the existing concurrency guard; the latest deployment is the active one.

Photo recovery remains the operational gate at the latest verified **371 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Full-site recovery checkpoint - September 22, 2026 (latest verified)

Canonical tracker state: **3,819 total / 3,818 public / 1,274 researched public / 903 pictured public / 903 fully complete public / 371 researched-photo-pending / 2,916 public photo-missing**.

The latest bounded photo-cache run completed successfully after the Reverb matcher and validator fixes. It produced no additional researched-photo completions in this pass, so the PRP1 gate remains **371**.

Deep-review source-page work added exact page leads for several stubborn records, including Bispell Audio Proxy, Saxon, and TOR, plus Biyang BL-12 Blues and DS-12 Distortion. Those records remain unresolved until an exact image is successfully archived locally.

Recovery runtime was tightened to a **30-record maximum batch**, a **20-second per-record recovery deadline**, and newest-run preference so stale long-running passes are superseded safely.

PRP1 remains gated until researched-photo-pending reaches **0**.

---

## Full-site maintenance checkpoint - September 21, 2026

Canonical state: **3,819 total / 3,818 public / 1,273 researched public / 896 pictured public / 896 complete public / 377 researched-photo-pending / 2,922 public photo-missing / 879 public local images / 17 public external image URLs**.

This maintenance slice hardened the deployment/runtime plumbing, browser history and URL normalization, accessibility states, photo identity matching, and external-photo localization. The photo cache now includes externally pictured records in its bulk conversion path, and Reverb listing pages have a stronger rendered-image fallback.

The latest local-photo recovery pass successfully localized **17** previously external public images. The remaining **17 external image URLs** are still separate from the researched-photo gate and remain eligible for future localization.

PRP1 remains gated until **377 researched-photo-pending** reaches **0**.

---

## Current verified archive state - September 21, 2026

Canonical catalog/tracker verification: **3,819 total / 3,818 public / 1,273 researched public / 896 pictured public / 896 complete public / 377 researched-photo-pending / 2,922 public photo-missing / 862 public local images / 34 public external image URLs**.

The photo cache handoff was corrected so externally pictured records are included in bulk localization even though their tracker Picture field is already DONE. The exact page identity fallback was also tightened to require builder context.

PRP1 remains gated until **377 researched-photo-pending** reaches **0**.

---

## Landing-page count checkpoint - September 21, 2026

The landing-page “All builders” count now respects the active search term as well as the selected dirt type. The browser audit now checks that the filtered All-builders count remains consistent with the rendered search results.

Latest checkpoint: **4f12fca0f247d9a70f6cee9c3fe07cd2f8e81f3**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Deployment trigger checkpoint - September 21, 2026

Deployment now watches `scripts/deploy-browser-audit.js`, `scripts/serve-static.js`, `scripts/live-photo-audit.js`, and `scripts/validate-archive.py`. The structural validator also requires those operational scripts to appear in the deployment trigger list, preventing CI behavior changes from being silently ignored.

Latest checkpoint: **fd88a46f98040e0f8803562896a427df7881d1d5**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Pedal detail pages now show the actual builder name in the builder line. The deployment browser audit verifies that the rendered builder matches the catalog entry used to open the page.

Latest UI checkpoint: **a27aebf8c651a0446fc9502705577bd604c20b48**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Colorway selection now uses CSS classes rather than inline JavaScript styling. Selected colorways expose `aria-pressed="true"`, and the browser audit verifies that a variation deep-link selects the requested colorway correctly.

Latest UI checkpoint: **c66a4c3c5267760498251c0673a7701523471f3c**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Detail-page photo presentation is now owned by `assets/css/archive-detail.css` rather than inline styles inside the JavaScript renderer. Photo load failures remain handled by the detail controller, while the validator now rejects inline style attributes in `archive-detail.js`.

Latest maintenance checkpoint: **8d79e5ce7f5d21b6e096a17079beefce17c482d2**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI checkpoint - September 21, 2026

Fixed the detail-page builder navigation so only the actual builder is highlighted. Catalog card photos now use a contained presentation so the whole pedal remains visible instead of being cropped. Added a browser-audit regression check for the builder selection state.

Latest UI checkpoint: **879ab391e996e1d3e4e0792a9a082269e082b0d7**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site architecture checkpoint - September 21, 2026

The deployment audit server is now owned by `scripts/serve-static.js` instead of being embedded in the GitHub Actions workflow. The workflow calls the script, the structural validator requires it and checks its syntax, and deployment watches the script for changes. This removes another duplicated CI-side implementation and keeps the site's operational ownership explicit.

Latest architecture commits: **4a9e37f02edba5da7ef3b13851cdb4a59e473222**, **832dd56be9eb1d18c15671f089099628875c86e8**, and **792393ceaa68365ea6ef32e506c5efc4978b2df1**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site maintenance checkpoint - September 21, 2026

The latest mainline maintenance work is now committed at **20bb9c998c9714994bfdb4bbd7535eca5f69a523**. The individual pedal page research loader now uses a more reliable request path with retries, research-record paths are normalized safely, and the browser audit can serve local research markdown during its test run.

The photo-recovery gate remains active at the latest verified state of **378 researched-photo-pending** records. PRP1 remains gated until the photo backlog reaches zero.

---

## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,273 researched / 896 pictured / 896 fully complete / 377 researched-photo-pending / 2,923 photo-missing overall**.

The previous pass briefly archived an image under Godeater+, but identity review showed that image was the original Godeater. That incorrect asset has been removed. Godeater+ is back in the exact-photo recovery queue with its verified Reverb source page.

The photo-review queue is now **404 records**: **8 DEEP_REVIEW**, **395 PARKED**, and **1 PHOTO_NEEDED**. The automatic recovery lane remains active, with exact-model identity checks now preserving meaningful symbols such as .

PRP1 remains gated until **researched-photo-pending reaches 0**. Public pedal pages continue to hide Research confidence and Sources checked. The future YouTube demo widget remains deferred until the photo catch-up is complete.

---



## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 873 pictured / 873 fully complete / 401 researched-photo-pending**.

The latest completed browser recovery pass recovered **5 exact-model candidates** and published **3 new local canonical photo assets**. The internal photo-review queue is now **427 records**, including **141 parked** cases. PRP1 remains gated until the researched-photo-pending count reaches **0**.

The recovery pass also incorporated stronger exact source-page leads for stubborn records including **Bad Cat X-Treme Tone, Big Ear NYC The LOAF Fuzz, Black Arts Toneworks LSTR, and Caline CP-74 Action Replay**. A lead remains only a lead until the exact image is successfully archived locally.

---

## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 870 pictured / 870 fully complete / 404 researched-photo-pending**.

The latest completed cache pass is commit **dcc54327deab996fdf16a4d56fd7314b06326d87**. The live tracker and catalog now agree at 870 pictured and 404 researched-photo-pending. The internal photo-review queue contains 432 remaining review records.

PRP1 remains gated until the researched-photo-pending count reaches **0**. Local photo references are currently structurally complete, with no declared local path pointing at a missing file.

---
## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 869 pictured / 869 fully complete / 405 researched-photo-pending**.

The live tracker is authoritative. The photo-recovery lane remains active and PRP1 remains gated until the researched-photo-pending count reaches **0**. The repository currently has **0 missing local image references** among declared local photo assets.

The permanent PRP rulebook and archive governance documents were cleaned so historical batch logs remain history rather than acting as current instructions.

---
## Photo source seeding pass - September 21, 2026

Seeded verified exact-model photo source pages into both `research/PEDAL_INDEX.json` and `research/pedals/PEDAL_IMAGES.json` for **Big Ear - Slice of Pie; Big Ear NYC - Black Betty; Big Ear NYC - Frank; Big Game Pedals - Bedlam Drive III; BIXONIC - AXENTRIX II; and BIXONIC - EXP2000DR**. These records remain photo-pending until the local cache workflow successfully archives the image. The six references were checked against the exact catalog identities and kept separate by Builder + Pedal.

## Photo Recovery / Architecture Checkpoint — September 21, 2026

## Photo recovery scheduler maintenance - September 21, 2026

The browser recovery queue was tightened so each bulk photo pass reserves up to **15 of its available slots for the highest-attempt deep-review cases**. Previously, a full batch of ordinary unresolved records could consume the entire run before hard cases were revisited. The remaining slots continue to prioritize the normal unresolved backlog. This keeps difficult records moving without allowing them to starve the rest of the photo catch-up.

Current verified tracker state: **3,819 total / 1,274 researched / 866 pictured / 866 fully complete / 408 researched-photo-pending**.

The photo cache successfully completed its bounded recovery pass. **Cause & Effect Pedals (CE Pedals) - FET Dream** was recovered and its archived local asset is now present; the repository has **0 missing local image references**.

PRP1 is intentionally gated until the researched-photo-pending count reaches **0**.

Latest maintenance commits:
- `51cf11e4eae0a662f708d62c1db1f56a21158469` cleared the stale FET Dream local-photo declaration.
- `b5a9837eac2de3f195cdba57c8b69903f2e1b818` completed the prior bounded cache pass and synchronized tracker/photo-review state.
## Architecture Hardening Checkpoint - September 21, 2026

Maintenance work consolidated the site's under-the-hood ownership model and removed overlapping automation. The public catalog remains the single runtime data source; research records, photo assets, tracker state, and synchronization scripts each have distinct responsibilities.

A stale local photo declaration for **Cause & Effect Pedals (CE Pedals) - FET Dream** exposed the intended behavior: validators now stop deployment rather than silently serving a broken local path, while the photo-recovery system is responsible for repairing or triaging the record.