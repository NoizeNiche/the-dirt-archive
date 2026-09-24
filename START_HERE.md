# The Dirt Archive - START HERE

This repository is the durable project memory for The Dirt Archive.

## 1. Boot sequence

Before doing project work, read these files in this order:

1. `START_HERE.md`
2. `ARCHIVE_GOVERNANCE.md`
3. `CURRENT_STATE.md`
4. `research/RESEARCH_PHASE_RULES.md`
5. `research/BREADCRUMB.md`
6. `research/BUILDER_MASTER_INDEX.md`

Use `research/RESEARCH_QUEUE.json` as the current derived working view. It is generated from the canonical catalog and tracker and must not be hand-edited.

Then inspect the actual repository and determine the current live state. Do not rely on conversation history, stale checkpoint text, or memory.

## 2. Current mission

The active production phase is the **Catalog Research Phase**.

Research the remaining canonical catalog records in catalog order, synchronize their research records into the public catalog, and let photo recovery proceed as a separate lane.

**PRP1 is no longer the active research phase.** Its remaining Fuzz Phazer work is treated as a legacy photo/publication closeout only.

The live counts, next research target, latest completed pass, and current blockers belong in `CURRENT_STATE.md`.

## 3. Public site model

The public archive is deliberately simple:

`Search -> Dirt Type -> Builder -> Pedal`

The index also includes a **Discover** control that opens a random matching catalog entry while respecting the current search, dirt-type, and builder filters.

A normal model or materially distinct public version gets one catalog entry and one detail page.

Cosmetic variations such as colorways, retailer finishes, event artwork, and similar editions belong to the parent pedal and do not become duplicate main-grid cards.

The public detail page contains:

- pedal name
- builder
- dirt type
- primary photo
- Pedal Info
- Versions, when applicable
- Colorways & Editions, when applicable
- representative demo, when available

Internal research administration does not belong on the public page.

## 4. Canonical data ownership

The archive follows a **one rule, one owner, one source of truth** model.

- `research/PEDAL_INDEX.json` owns public catalog identities and relationships.
- `research/pedals/**/*.md` owns research prose.
- `assets/pedals/**` owns archived photo assets.
- `image_source_url` and `image_source_page` preserve photo provenance.
- `research/pedals/PEDAL_IMAGES.json` is an internal mirror/verification manifest, not a second public catalog.
- `research/PRP_TRACKER.csv` owns derived research/photo/completion status.
- `research/RESEARCH_QUEUE.json` is the generated working queue for the active Catalog Research Phase.
- `scripts/sync_prp_catalog.py` owns research-record wiring.
- `scripts/sync-prp-tracker.py` owns derived tracker status.
- `scripts/browser-photo-cache.mjs` owns browser-assisted image discovery.
- `scripts/cache-pedal-images.py` owns image conversion and local storage.
- `scripts/validate-archive.py` owns structural validation.
- `assets/js/archive-core.js` owns shared browser data loading, identity keying, URL construction, and cache versioning.
- `assets/js/archive-index.js` owns landing-page interaction.
- `assets/js/archive-detail.js` owns detail-page interaction.
- `.github/workflows/deploy-pages.yml` owns deployment orchestration.

Do not create a competing implementation of one of these responsibilities.

## 5. Photo rules

A picture counts only when it belongs to the exact cataloged pedal/version.

A local image path counts as a real archived photo only when the file exists.

A stale or missing local path is not a valid photo. The provenance URL must be preserved so the cache system can retry recovery.

Do not replace a missing exact photo with a visually similar pedal, different version, clone, or guessed image.

The public fallback for an unresolved exact photo is **No Photo Archived**.

## 6. Research and PRP rules

The active Catalog Research Phase is governed by `research/RESEARCH_PHASE_RULES.md`.

PRP status remains useful as a derived completion state and PRP1 remains useful as a legacy exact-photo publication/closeout mechanism.

Read `research/PRP_RULES.md` only when working on PRP-specific completion or photo-publication behavior.

## 7. Change discipline

Before a change:

- inspect the real repository state
- check builder identity in `research/BUILDER_MASTER_INDEX.md`
- check the target Builder + Pedal identity
- identify the single file/script that owns the change
- make the smallest coherent change

After a change:

1. run the appropriate validator/checks
2. inspect the resulting repository state
3. confirm the requested behavior
4. update `CURRENT_STATE.md` and `research/BREADCRUMB.md` when the project state changes