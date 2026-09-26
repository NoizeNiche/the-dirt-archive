<!-- AUTO:RESEARCH_PHASE_START -->
## Active phase checkpoint

The active production phase is **Catalog Research Phase**. PRP1 is retained only as a legacy publication/closeout mechanism.

Live catalog: **3761 total / 3761 surface-ready / 360 deep-researched / 3761 research-linked / 2543 pictured / 2543 complete / 0 surface-missing / 3401 deep-research-pending / 1218 researched-photo-pending**.

**Next deep-research target:** Akai - Tri-Mode Fuzz.

PRP1 closeout remains separate: 1218 researched record(s) still lack an exact local photo.
The research queue is generated from the canonical catalog and tracker; do not hand-edit the derived queue.
Last refreshed: 2026-09-26T03:01:28.531Z
<!-- AUTO:RESEARCH_PHASE_END -->

## Historical checkpoints


## Legacy PRP1 closeout checkpoint - September 24, 2026

The remaining PRP1 work is **CBS-Arbiter - CBS-Arbiter Fuzz Phazer**, which is already researched and is being handled only as an exact-photo/publication closeout. The active Catalog Research Phase proceeds independently from this closeout.

## PRP1 queue checkpoint - September 24, 2026

PRP1 has now published **CBC Pedals - The Drive**, **CBC Pedals - The Superfuzz**, **CBS-Arbiter - CBS-Arbiter Doubler**, **CBS-Arbiter - CBS-Arbiter Fuzz Face**, and **CBS-Arbiter - CBS-Arbiter Fuzz King** as complete atomic units. The strict local-photo gate remains clear.

The live tracker currently parses to **3,765 total / 1,277 researched / 1,277 pictured / 1,277 PRP-complete / 0 researched-photo-pending / 2,488 photo-missing**.

**CBS-Arbiter - CBS-Arbiter Fuzz King** is archived with its exact local image at `./assets/pedals/cbs-arbiter/cbs-arbiter-fuzz-king/primary.webp`, research record at `./research/pedals/CBS-Arbiter/CBS-Arbiter Fuzz King.md`, and exact-model Effects Database image provenance wired into the canonical catalog.

The next exact-order incomplete target is **CBS-Arbiter - CBS-Arbiter Fuzz Phazer**. The exact Builder + Pedal identity gate and local-photo requirement remain unchanged.

## PRP1 queue checkpoint - September 24, 2026

PRP1 has now published **CBC Pedals - The Drive**, **CBC Pedals - The Superfuzz**, and **CBS-Arbiter - CBS-Arbiter Doubler** as complete atomic units. The strict local-photo gate remains clear.

The live tracker currently parses to **3,765 total / 1,275 researched / 1,275 pictured / 1,275 PRP-complete / 0 researched-photo-pending / 2,490 photo-missing**.

The next exact-order incomplete target is **CBS-Arbiter - CBS-Arbiter Fuzz Face**. Its intake package is queued with Effects Database and exact CBS-Arbiter Reverb sources. The exact-local-photo requirement remains unchanged.

## PRP1 queue checkpoint - September 24, 2026

PRP1 has advanced through **CBC Pedals - The Drive** and **CBC Pedals - The Superfuzz**. Both have published research records and exact local photographs, and the global researched-photo gate remains clear.

The live tracker now parses to **3,765 total / 1,274 researched / 1,274 pictured / 1,274 PRP-complete / 0 researched-photo-pending / 2,491 photo-missing**.

The next exact-order incomplete target is **CBS-Arbiter - CBS-Arbiter Doubler**. Its PRP1 intake package contains the Effects Database record, a direct exact-model image lead, and a sold Reverb fallback. The exact-local-photo requirement remains unchanged.

## PRP1/photo publication checkpoint - September 24, 2026

The PRP1 unit for **CBC Pedals - The Drive** is now fully published on `main`. Its research record exists at `./research/pedals/CBC Pedals/The Drive.md`, and the exact photo is archived at `./assets/pedals/cbc-pedals/the-drive/primary.webp`. Catalog and photo-manifest image paths now agree.

The first PRP1 publication exposed a staging omission in the atomic workflow: the initial PRP1 commit did not include `assets/pedals/**` or the derived photo queues. The workflow has been corrected to stage those outputs. The Drive was then reset to a legitimate photo-needed state, recovered through a verified direct Reverb image lead, and republished through the canonical local-image cache. The validator remained strict throughout.

Current verified tracker state: **3,765 total / 1,272 researched / 1,273 pictured / 1,273 PRP-complete / 0 researched-photo-pending / 2,492 photo-missing**.

The next exact-order incomplete target is **CBC Pedals - The Superfuzz**. Its PRP1 intake package is already queued with exact Reverb sources and direct image leads.

## PRP1 checkpoint - September 24, 2026

PRP1 has now successfully published **CBC Pedals - The Drive** as the first atomic unit after the photo-quality repair. The exact local photo is archived at `./assets/pedals/cbc-pedals/the-drive/primary.webp`, with Reverb provenance retained in the canonical catalog and photo manifest.

The live tracker is now **3,765 total / 1,272 researched / 1,273 pictured / 1,273 PRP-complete / 0 researched-photo-pending / 2,492 photo-missing**. The global researched-photo gate remains clear.

The next canonical incomplete tracker target is **CBC Pedals - The Superfuzz**. A PRP1 intake package has been queued with exact Reverb source pages and a direct image lead; the same exact-local-photo gate remains in force.

The temporary PRP research probe was also repaired so its scheduled/manual runs no longer carry the earlier malformed-Python failure state.

## Identity cleanup checkpoint - September 24, 2026

The live catalog was reconciled before the next PRP1 intake. Five unsupported or duplicate CBC rows were removed: Hop Hed Fuzztone, Hybrid Fuzz, Mista' Fuzz, Mutha' Fuzz, and the duplicate-labeled The Drive / Zendrive circuit. The existing Cat's Eye ESP records remain the canonical entries for the first four; CBC The Drive remains as the single supported CBC Zendrive-clone entry.

Post-cleanup tracker shape: **3,765 total records / 1,271 researched / 1,272 pictured / 1,272 PRP-complete / 0 researched-photo-pending / 2,493 photo-missing**.

The next PRP1 target is **CBC Pedals - The Drive**, with an exact Reverb source already retained in the catalog. PRP1 will advance one atomic target at a time from this point.

## Current recovery checkpoint - September 24, 2026

The live research/PRP_TRACKER.csv currently parses to **3,770 total records / 1,272 researched records / 1,255 pictured records / 1,255 PRP-complete records / 17 researched-photo-pending / 2,515 photo-missing records overall**.

The photo-quality gate is currently **17 researched-photo-pending / 2,515 photo-missing**, after a targeted audit removed 17 obvious non-product images from the pictured state. The earlier final blocker, **CBC Pedals - Harmonic Percolator**, remains correctly archived at ./assets/pedals/cbc-pedals/harmonic-percolator/primary.webp and its asset-level inspection confirmed a real pedal photograph. PRP1 is therefore re-gated while the 17 repaired-photo targets are recovered.

PRP1 was opened and the CBC Harmonic Percolator intake package was consumed, but the newly discovered photo-quality failures have re-gated the phase. Photo recovery should clear the 17 known-bad records first, then resume the next canonical incomplete PRP target, **CBC Pedals - Hop Hed Fuzztone**, in exact catalog order.

The photo-quality audit has now moved 17 known-bad pictured records back to photo-pending, so the live gate is 17 researched-photo-pending / 2,515 photo-missing. Those 17 records are now explicitly back in the recovery lane. The photo validator rejects the obvious favicon/logo/template provenance classes so the gate cannot silently return to zero around bad assets. Keep the local-first image contract and exact Builder + Pedal identity gate unchanged.

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


Latest verified cache gain: run 937 archived Anarchy Audio Australia Deadwoods - Chainsaw Fuzz, bringing the researched-photo-pending count to 318. Exact-source redundancy was added for Aether Lenore and A.Y.A FrontGate BassDrive, and the lazy-image extractor hardening remains active.


Recovery extraction now also reads structured product JSON-LD (`application/ld+json`) image/contentUrl/thumbnailUrl fields, carrying product identity into the same candidate scoring and final image validation. This layer is intentionally additive and does not mark a record pictured without a verified local image.


Additional exact photo-source redundancy added during the current recovery sweep: Alen Geere Loverdrive now has a Reverb photo source, Aleatorik Operation 1 has an Aucfree auction-photo source, and A.Y.A FrontGate Bass Drive has a retailer source retained alongside its prior Reverb listing.


Cache run 938 completed successfully with 0 new photos and 29 attempted/failed recovery records. This confirms the basic source-page/network extraction path remains reliable but the current difficult cases need the unified rich-image candidate path now staged in `browser-photo-cache.mjs`.


Source coverage audit: the first 500 unresolved photo-backlog records contain 197 records without any curated exact-source override row. The remaining covered records have at least one curated source lead. This audit does not change Picture state; it is used to separate source-research gaps from extractor failures.


Health-lane maintenance: The hourly health workflow now also runs on pushes to its own workflow/script, allowing immediate post-fix canaries instead of waiting for the next hourly schedule. The prior failed canary was confirmed to be a stale run from before the deployment-coverage logic was present.


Cache run 939 result: 2 additional verified local photos were archived, Analog King Fuzz Machine - Germanium Fuzz + Overdrive and Beta Aivin BOD-2 Bass Overdrive, moving the researched-photo-pending gate from 318 to 316. The unified rich-image extractor is now proven in production recovery. New Blackhawk Triangle, Alen Geere Loverdrive, and Aleatorik Operation 1 exact-source leads are staged for the next cycle.


Latest maintenance additions: Blackhawk Triangle Fuzz now has an exact Reverb photo lead with multiple actual pedal photos, and the health workflow now serializes canaries with cancel-in-progress so stale health runs do not overlap newer repairs. The committed photo gate remains 316 pending after run 939.
