# The Dirt Archive - Pedal Research Phase Rules

**Current status and counts live in `CURRENT_STATE.md`. This file is the permanent operating contract for PRP and should contain rules, not a rolling batch log.**

## 1. Purpose

PRP means **Pedal Research Phase**.

The goal of these rules is to define the archive's completion and exact-photo contract. The active Catalog Research Phase now owns new research work; PRP1 is retained as a legacy publication/closeout mechanism while keeping the site simple:

`Builder -> Pedal -> Pedal Info -> Photo`

PRP works from the live catalog and its canonical tracker, not from conversation memory or old checkpoint text.

## 2. Legacy PRP1 work order

PRP1 is no longer the active research queue. New research follows `research/RESEARCH_PHASE_RULES.md`. PRP1 only finalizes already-researched records through the exact-photo publication gate.

The tracker is the source of truth for completion status.

Start with the first incomplete catalog record and continue downward in order. A difficult record must not permanently block later records. Once a record has received a fresh, responsible attempt and remains unresolved, it may be parked for later recovery while the queue continues.

The current next target, live counts, and active phase belong in `CURRENT_STATE.md`.

## 3. Catalog identity: models, versions, and variations

PRP follows the **public catalog**, not every raw Builder + Pedal census row.

- A normal pedal model is a PRP target.
- A materially different public version, such as V2, may be its own PRP target and page.
- A record with `catalog_role = variation` is subordinate to its parent and is not an independent main-grid PRP target.
- Cosmetic variations such as colorways, retailer finishes, event artwork, and similar editions belong under the parent model/version.
- Never create duplicate main-grid cards merely because a pedal exists in several colors or because a source uses a slightly different presentation of the same model.

## 4. Batch size

PRP uses **practical working sets**, not a hard pedal-count limit.

A working set may contain fewer than 10 records or substantially more than 10 when the set remains small enough to verify safely.

Normal cycle:

`Research -> Photo recovery/verification -> Synchronize -> Validate -> Publish -> Resume`

Every pedal still receives its own research record.

## 5. Completion standard

A pedal is **PRP Complete** only when both are present:

1. useful pedal information
2. a confirmed picture of that exact pedal/model/version

Research alone does not complete a pedal.

A picture alone does not complete a pedal.

The tracker must reflect this rule exactly.

## 6. Photo standard

Only archive a photograph when it can reasonably be tied to the exact cataloged product.

Preferred photo sources, in roughly this order:

- manufacturer/builder product pages
- reliable historical manufacturer/catalog records
- exact-model retailer listings
- Reverb **Sold Only** listings and other reliable used-market listings when the exact model is clear
- Effects Database and other established pedal databases

The source type may vary by pedal. Identity is the controlling requirement.

Do not substitute:

- another model
- another version when the distinction matters
- a different colorway when the catalog entry is for a specific different edition
- a clone
- a visually similar pedal
- an image whose product identity is unclear

A visually convincing image is not enough. The product identity must line up with the cataloged Builder + Pedal identity.

When no qualifying exact image can be confirmed, leave the picture unresolved. The public site must display **No Photo Archived**.

## 7. Local photo contract

Verified public photos are stored locally.

Primary model/version asset:

`assets/pedals/{builder-slug}/{pedal-slug}/primary.webp`

Variation asset:

`assets/pedals/{builder-slug}/{parent-pedal-slug}/variants/{variation-slug}.webp`

The local file must actually exist before the record counts as pictured.

Keep the original image URL and source page as provenance metadata so future recovery can retry the source.

Do not use an external image URL as the long-term public replacement for a missing local asset.

## 8. Research fields

When supported by reliable evidence, each PRP research record should cover:

- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- Transistor
- Diode
- Sound

Sound descriptions should normally be **2-3 sentences** and describe practical sonic behavior rather than marketing filler.

Do not invent:

- version history
- production changes
- component types
- component values
- factory options
- relationships between brands or products

When an exact transistor or diode type is not publicly documented, say so plainly.

Keep documented factory information separate from DIY modifications, clones, reverse-engineering experiments, and forum speculation.

## 9. What belongs on the public pedal page

The public page should stay focused on the pedal itself:

- archive navigation
- pedal name
- builder
- dirt type
- primary photograph
- Pedal Info
- Versions, when applicable
- Colorways & Editions, when applicable
- a representative demo, when that feature is active

Do **not** expose research-administration material such as:

- Research confidence
- Sources checked
- internal photo status
- PRP terminology
- evidence grades or verification bureaucracy

Reference URLs may remain in the internal data where they are useful for future rechecking.

## 10. Standard individual pedal page

Every individual pedal page uses one consistent layout.

The normal benchmark is:

- permanent archive navigation on the left
- Archive Home link
- search field
- Dirt Type choices
- scrollable alphabetical builder list
- pedal name and builder
- useful pedal information as the main content
- dedicated photo area
- photo area sized for a 3:4 image presentation
- No Photo Archived when an exact image is unavailable
- clean desktop and mobile behavior

Do not create special one-off layouts for individual pedals.

## 11. Canonical data ownership

Use one source of truth for each concern:

- `research/PEDAL_INDEX.json` owns the public catalog identities and relationships.
- `research/pedals/**/*.md` owns pedal research prose.
- `assets/pedals/**` owns archived photo files.
- `image_source_url` and `image_source_page` preserve photo provenance.
- `research/pedals/PEDAL_IMAGES.json` mirrors photo/research connections for internal verification.
- `research/PRP_TRACKER.csv` owns PRP status.
- `scripts/sync_prp_catalog.py` owns research-to-catalog wiring.
- `scripts/sync-prp-tracker.py` owns derived tracker status.
- `scripts/browser-photo-cache.mjs` owns browser-assisted photo discovery.
- `scripts/cache-pedal-images.py` owns local image conversion/storage.
- `scripts/validate-archive.py` owns structural validation.
- `assets/js/archive-core.js` owns shared browser catalog loading, identity keys, URL construction, and cache versioning.
- `assets/js/archive-index.js` owns landing-page behavior.
- `assets/js/archive-detail.js` owns detail-page behavior.
- `.github/workflows/deploy-pages.yml` owns deployment orchestration.

Do not create competing implementations of these responsibilities.

## 12. Tracker rules

`research/PRP_TRACKER.csv` contains one row for every unique live Builder + Pedal identity represented by the public catalog.

Required status fields:

- Pedal Info: DONE / NEEDED
- Picture: DONE / NEEDED
- PRP Complete: DONE / NEEDED

Before publishing meaningful PRP work, verify:

- every new research record exists
- every new picture connection points to a real archived asset
- the tracker agrees with the catalog
- research links are valid
- Builder + Pedal identities are unique
- researched, pictured, complete, and remaining counts reconcile

## 13. Source and identity checking

Before adding or promoting a record:

1. verify the Builder + Pedal identity against the canonical builder index and catalog
2. check aliases, historical builder names, alternate spellings, and naming relationships
3. determine whether the record is a model, material version, or subordinate cosmetic variation
4. use the narrowest source claim that the evidence supports
5. preserve useful source URLs without turning them into an evidence-grading system

## 14. Photo recovery queue

Photo recovery is a separate operational pass from PRP research.

The recovery system may use:

- exact builder/product pages
- Effects Database
- Reverb Sold Only listings
- reliable retailer/used listings
- image-search indexing as a discovery fallback

Search-engine discovery is not automatically proof of identity. Candidate pages and images must still pass the archive's exact-model checks before promotion.

Hard cases may be moved into the internal photo review queue and revisited later. A parked record remains NEEDED until a qualifying image is actually archived.

## 15. Publishing rules

A coherent PRP change is not considered live merely because files exist in GitHub.

After a PRP change:

1. update the research records
2. update picture connections
3. update `PEDAL_INDEX.json`
4. update `PRP_TRACKER.csv`
5. update `CURRENT_STATE.md`
6. update `research/BREADCRUMB.md` when the durable project checkpoint changes
7. update public data/version markers together where applicable
8. run structural validation
9. publish through GitHub Pages
10. confirm the deployment and relevant live audits succeed

Never weaken validation just to make a deployment green.

## 16. Resume rules

At the start of a new session:

1. read `START_HERE.md`
2. read `ARCHIVE_GOVERNANCE.md`
3. read `CURRENT_STATE.md`
4. read `research/BREADCRUMB.md`
5. read this file
6. inspect the actual repository
7. inspect `research/PRP_TRACKER.csv`
8. take the first incomplete target in live catalog order

Do not use an old batch number or conversation memory as the authoritative cursor.

## 17. Queue progression rule

A single unresolved photo must not freeze the research program.

After a responsible exact-model search has been attempted, a photo-pending record may remain NEEDED and be parked for later recovery while the PRP working queue continues downward in exact catalog order.

Parked records must remain visible in the internal recovery queue and must never be silently converted to complete.

## 18. Change discipline

Before changing the project:

- inspect the real repository state
- identify the single file/script that owns the change
- make the smallest coherent change
- protect existing organization and valid historical data
- avoid duplicated logic and tangled workflows

After changing the project:

- validate
- inspect the resulting state
- confirm the requested behavior
- update durable checkpoint documentation when project state changed
- commit a recoverable checkpoint

The guiding rule is simple:

**One rule. One owner. One source of truth. One recoverable checkpoint.**
