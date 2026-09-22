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

Canonical repository state verified after the latest maintenance and photo-cache work: **3,819 total catalog records / 3,818 public entries / 1,273 researched public entries / 896 pictured public entries / 896 complete public entries / 377 researched-photo-pending / 2,922 public photo-missing / 879 public local images / 17 public external image URLs**.

Maintenance completed in this slice:
- deployment auditing now uses an owned static server rather than an inline workflow server
- scheduled health checks refresh to the latest `main` before integrity testing
- deployment/photo workflows use pinned Node 20 runtimes
- photo recovery now includes externally pictured records in the local-cache handoff
- exact photo identity fallback requires builder context
- Reverb listing recovery has a dedicated verified-page fallback
- catalog filters/pagination preserve browser history and normalize stale URL state
- pedal detail builder and colorway state are rendered/accessibly exposed correctly
- keyboard skip links and focus states were added to the public pages
- architecture and validators now enforce these ownership rules and reject retired/stale mechanisms

The latest photo-cache pass localized **17** previously external public images. **17 external image URLs remain** and are still being retried separately from the researched-photo gate.

PRP1 remains gated until **researched-photo-pending reaches 0**.

## Current verified archive state - September 21, 2026

Canonical `PEDAL_INDEX.json` and `PRP_TRACKER.csv` now verify: **3,819 total catalog records / 3,818 public catalog entries / 1,273 researched public entries / 896 pictured public entries / 896 fully complete public entries / 377 researched-photo-pending / 2,922 public photo-missing / 862 public local images / 34 public records still using external image URLs**.

The 34 external-image records are still counted as pictured, but the recovery pipeline is now able to process them through the local cache handoff instead of filtering them out because their tracker Picture field is already DONE.

The latest recovery-quality change also tightened exact page identity so the final photo-matching fallback requires builder context as well as pedal-name context.

PRP1 remains gated until **researched-photo-pending reaches 0**.

## Landing-page count checkpoint - September 21, 2026

The landing-page “All builders” count now respects the active search term as well as the selected dirt type, so the sidebar count matches the filtered result context. The browser audit now checks that the filtered All-builders count is consistent with the rendered search results.

Latest checkpoint: **4f12fca0f247d9a70f6cee9c3fe07cd2f8e81f3**.

The photo-recovery gate remains unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Deployment trigger checkpoint - September 21, 2026

Deployment now watches the operational scripts that can change the validation/audit behavior: `scripts/deploy-browser-audit.js`, `scripts/serve-static.js`, `scripts/live-photo-audit.js`, and `scripts/validate-archive.py`. The archive validator also checks that these trigger paths remain present in the deployment workflow.

Latest deployment-trigger checkpoint: **fd88a46f98040e0f8803562896a427df7881d1d5**.

The photo-recovery gate remains unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Site UI maintenance checkpoint - September 21, 2026

Pedal detail pages now show the actual builder name in the builder line instead of the generic “The Dirt Archive pedal record” label. The header audit now verifies that the rendered builder matches the catalog record used to open the page.

Latest UI checkpoint: **a27aebf8c651a0446fc9502705577bd604c20b48**.

The photo-recovery gate remains unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Site UI maintenance checkpoint - September 21, 2026

Colorway selection on pedal detail pages now uses CSS classes instead of JavaScript-applied inline presentation. The selected colorway also exposes `aria-pressed="true"`, and the browser audit verifies that a variation deep-link both selects the requested colorway and exposes the correct accessible state.

Latest UI checkpoint: **c66a4c3c5267760498251c0673a7701523471f3c**.

The photo-recovery gate remains unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Site UI maintenance checkpoint - September 21, 2026

Detail-page photo presentation is now owned by `assets/css/archive-detail.css` rather than inline styles inside the JavaScript renderer. Photo load failure is handled by the detail controller without embedding presentation styles in the generated markup. The structural validator now rejects inline style attributes in `archive-detail.js`.

Latest maintenance checkpoint: **8d79e5ce7f5d21b6e096a17079beefce17c482d2**.

The photo-recovery gate remains unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Site UI checkpoint - September 21, 2026

The pedal-detail sidebar now correctly shows only the current builder as selected instead of simultaneously highlighting “All builders.” The catalog card image presentation was also adjusted so the complete pedal fits inside its frame rather than being cropped.

The browser audit now has a regression check for the detail-page builder selection, so the navigation state is automatically tested during deployment.

Latest UI/audit checkpoint commit: **879ab391e996e1d3e4e0792a9a082269e082b0d7**.

The active photo gate is unchanged at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

## Site architecture checkpoint - September 21, 2026

The deployment audit server has been separated from the GitHub Actions workflow and is now owned by `scripts/serve-static.js`. The deployment workflow calls that script, the validator requires it and checks its JavaScript syntax, and deployment now triggers when the server script changes. This keeps CI orchestration separate from site-serving logic.

Latest checkpoint commits: **4a9e37f02edba5da7ef3b13851cdb4a59e473222** and **97a9d28fba1cb969728e687630e789ad54d7f662**.

The active gate is unchanged: photo recovery remains the priority, with **378 researched-photo-pending** records in the latest verified tracker state. PRP1 remains closed until that count reaches **0**.

## Site maintenance checkpoint - September 21, 2026 (latest verified)

The repository is now at commit **20bb9c998c9714994bfdb4bbd7535eca5f69a523**. The recent site-maintenance pass stabilized individual pedal research-record loading, normalized research-record paths safely, and updated the browser audit so local research markdown is served correctly during the audit. These changes are now on `main`.

The active archive gate is unchanged: photo recovery remains the priority, with **378 researched-photo-pending** records in the latest verified tracker state. PRP1 remains closed until that count reaches **0**.

## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 896 pictured / 896 fully complete / 378 researched-photo-pending / 2,923 photo-missing overall**.

The previous pass briefly archived an image under Godeater+, but identity review showed that image was the original Godeater. That incorrect asset has been removed. Godeater+ is back in the exact-photo recovery queue with its verified Reverb source page.

The photo-review queue is now **404 records**: **9 DEEP_REVIEW** and **395 PARKED**. The automatic recovery lane remains active, with exact-model identity checks preserving meaningful model-name symbols.

PRP1 remains gated until **researched-photo-pending reaches 0**. Public pedal pages continue to hide Research confidence and Sources checked. The future YouTube demo widget remains deferred until the photo catch-up is complete.

## Maintenance checkpoint - September 21, 2026

The scheduled site-health check had been looking for a Pages deployment matching the scheduled workflow's stale checkout SHA. That produced a false failure even when the archive itself was healthy. The health check now refreshes origin/main for scheduled runs and looks for a successful Pages deployment of the current main commit.

The maintenance fix passed the repository validation workflow in commit **8f721ccaf437b4955e465c8a36b5441ce747a05e**. Photo recovery remains the active gate, and the current researched-photo pending count is **378**.


---



## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 873 pictured / 873 fully complete / 401 researched-photo-pending / 2,946 photo-missing overall**.

The latest completed browser recovery pass recovered **5 exact-model photo candidates** and successfully published **3 new local canonical photo assets**. The tracker now reflects **873 pictured / 873 complete / 401 researched-photo-pending**. The photo-review queue is down to **427 records**, with **141 parked** at the automatic-attempt cutoff.

The recovery system also received stronger exact source-page leads for several stubborn records, including Bad Cat X-Treme Tone, Big Ear NYC The LOAF Fuzz, Black Arts Toneworks LSTR, and Caline CP-74 Action Replay. These remain incomplete until an exact image is actually archived.

PRP1 remains gated until **researched-photo-pending reaches 0**. Public pedal pages continue to hide Research confidence and Sources checked. The future YouTube demo widget remains deferred until the photo catch-up is complete.

---

---
## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 869 pictured / 869 fully complete / 405 researched-photo-pending / 2,950 photo-missing overall**.

The tracker is the current source of truth. Since the previous written checkpoint, **3 additional exact-model photos** have been verified and counted. The local catalog currently has **0 missing local image references** among its declared local photo assets.

PRP1 remains gated until **researched-photo-pending reaches 0**. Public pedal pages continue to hide Research confidence and Sources checked. The future YouTube demo widget remains deferred until the photo catch-up is complete.

The permanent PRP rulebook and archive governance documents were cleaned on September 21, 2026 so they contain operating rules rather than stale rolling batch logs.

---
## Photo Recovery Checkpoint — September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 866 pictured / 866 fully complete / 408 researched-photo-pending / 2,953 photo-missing overall**.

The latest completed cache pass recovered **Cause & Effect Pedals (CE Pedals) - FET Dream**, replacing its stale nonexistent local declaration with the verified archived asset while preserving its research record and provenance. The verified picture count is now **866**. PRP1 remains gated until **researched-photo-pending reaches 0**.

Public pedal pages keep **Research confidence** and **Sources checked** hidden. The future YouTube demo widget remains deferred until after the photo catch-up.
## Photo Recovery Checkpoint — September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,269 researched / 856 pictured / 856 fully complete / 413 researched-photo-pending / 2,963 photo-missing overall**.

The latest published photo-cache batch recovered **10 additional exact-model photos**. The tracker, photo backlog, review queue, and canonical catalog agree on these current counts. PRP1 remains gated until **researched-photo-pending reaches 0**.

Public pedal pages keep **Research confidence** and **Sources checked** hidden. The future YouTube demo widget remains deferred until after the photo catch-up.

CURRENT_STATE.md was refreshed to make this current checkpoint the first state shown, while preserving the historical checkpoints below.

## Photo Recovery Checkpoint — September 21, 2026

Verified tracker state: **3,819 total / 1,268 researched / 834 pictured / 435 researched-photo-pending**.

The latest photo batch recovered **3 additional exact-match photos** and passed the full live deployment audit.

Photo recovery remains the active gate. High-attempt deep-review records continue to rotate into each batch.

Public pedal pages hide **Research confidence** and **Sources checked**. A future YouTube demo widget remains parked for later.
