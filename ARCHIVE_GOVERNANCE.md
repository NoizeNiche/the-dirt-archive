# The Dirt Archive - Governance

## Mission

The Dirt Archive is a practical reference for guitar dirt pedals spanning the 1960s through the current day.

The public archive is intentionally simple:

**Search -> Dirt Type -> Builder -> Pedal**

The active operational priority may change between census, photo recovery, maintenance, and PRP1, but the governing data model and quality rules below remain stable.

## 1. Current phase scope

The core archive covers:

- builder names
- overdrive pedals
- distortion pedals
- fuzz pedals
- the builder-to-pedal relationship

The current recovery/research phase may add practical pedal information and exact photographs, but it must not turn the public archive into a component-forensics database.

## 2. Filter metadata boundary

The website may expose **component-type metadata as filters** without expanding the archive into component-level documentation.

Allowed filter metadata includes:

- **Transistor Type**, such as Germanium, Silicon, MOSFET, or JFET
- **Diode Type**, such as Germanium, Silicon, LED, or Schottky

These are filter metadata only.

Do not catalog transistor or diode part numbers, schematics, component values, BOMs, or other circuit-level documentation as part of the normal public filter system.

## 3. Builder census and scrape rules

A **Scrape** is a bulk pass through the builder alphabet.

A scrape should:

1. continue from the exact saved alphabetic checkpoint
2. use the canonical builder index and active census as duplicate gates
3. gather as many qualifying dirt-pedal records as the available evidence supports
4. target at least 10 distinct companies/builders per haul when that many qualifying unprocessed companies remain
5. continue beyond the minimum company count while meaningful unprocessed material is readily available
6. reconcile aliases, historical names, duplicate product families, and naming changes as part of the work
7. leave a durable, committed checkpoint that makes the next haul immediately resumable

The 10-company threshold is a minimum throughput floor, not a stopping point.

When the user says **Continue** after a completed scrape, the next full bulk scrape should begin automatically from the saved alphabetic checkpoint and proceed toward Z.

## 4. Builder identity rules

`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity list.

A research block is a checkpoint, not a builder identity.

Before creating a new builder block, check:

- current name
- historical name
- alias or shortened name
- alternate spelling/capitalization
- successor/predecessor relationship
- known brand or naming relationship

If the builder is already represented, do not create another canonical builder identity. Add missing products to the existing identity.

Keep genuinely different builders separate.

Do not create a new builder solely because of:

- capitalization differences
- punctuation differences
- shortened branding
- retailer naming
- ordinary cosmetic presentation
- ordinary product revisions

A product brand, OEM relationship, distributor relationship, collaboration, or naming transition also does not automatically create a new builder identity.

## 5. Pedal identity rules

The useful identity is **Builder + Pedal**.

For pedals:

- keep one canonical entry when multiple sources clearly refer to the same product
- preserve builder or established catalog naming where practical
- treat materially different public versions as distinct when the product itself is different
- treat cosmetic colorways, retailer finishes, event artwork, and similar subordinate editions as variations rather than duplicate main-grid cards
- use explicit model/version/variation relationships instead of creating duplicate catalog identities

## 6. PRP rules

PRP means Pedal Research Phase.

A pedal is PRP Complete only when both are present:

1. useful pedal information
2. a confirmed picture of that exact pedal/model/version

PRP follows the public catalog in exact A-to-Z order.

A practical working set may contain fewer than 10 records or more than 10 when it remains small enough to verify safely.

A difficult photo does not permanently block the research queue. Once a responsible exact-model search has been attempted, the record may remain NEEDED and be parked for later recovery while later records continue in catalog order.

Detailed PRP operating rules belong in `research/PRP_RULES.md`.

## 7. Photo rules

A photo counts only when it belongs to the exact cataloged pedal/model/version.

Preferred sources include:

- manufacturer/builder product pages
- reliable historical product records
- exact-model retailer listings
- Reverb Sold Only listings and reliable used-market listings
- Effects Database and other established pedal databases

Do not substitute:

- another pedal
- another material version
- a different colorway when it represents a distinct cataloged edition
- a clone
- a visually similar pedal
- an image whose identity is unclear

The public fallback for an unresolved exact photo is **No Photo Archived**.

## 8. Local photo architecture

Verified images are stored locally so the public site does not depend on an external image host.

Primary model/version:

`assets/pedals/{builder-slug}/{pedal-slug}/primary.webp`

Subordinate variation:

`assets/pedals/{builder-slug}/{pedal-slug}/variants/{variation-slug}.webp`

The catalog stores the local runtime path in `image`.

The original image URL and source page remain provenance metadata.

A missing or stale local file never counts as a valid picture.

The complete storage contract is documented in `research/PEDAL_IMAGE_ARCHITECTURE.md`.

## 9. Public site design rules

The public site should remain approachable and visually simple.

The landing page uses:

**Search -> Dirt Type -> Builder -> Pedal**

The left navigation should support progressive/faceted narrowing across:

- search text
- dirt type
- builder
- transistor type
- diode type
- other deliberately supported metadata

Selected filters narrow the same result set together.

Builders are alphabetical in a scrollable panel.

The main grid displays public model/version entries, not subordinate cosmetic variation records.

Individual pedal pages use a consistent layout with:

- archive navigation
- Archive Home
- search
- Dirt Type choices
- alphabetical builder list
- pedal name and builder
- Pedal Info
- dedicated photo area
- Versions when applicable
- Colorways & Editions when applicable
- representative demo when that feature is active

Pedal pages must remain usable on desktop and mobile.

Public pages must not expose internal research administration such as Research confidence, Sources checked, internal photo state, PRP terminology, or evidence grades.

## 10. No evidence bureaucracy

Do not create systems for:

- evidence grades
- verification grades
- secondary-evidence tiers
- confidence scores
- proof-of-existence records
- legal-style chains of custody

The archive is a product census and reference.

Source URLs may be retained because they help locate or recheck information. They are not a separate classification system.

## 11. Canonical data ownership

Use one owner for each moving part:

| Concern | Canonical owner |
| --- | --- |
| Public catalog identities and relationships | `research/PEDAL_INDEX.json` |
| Pedal research prose | `research/pedals/**/*.md` |
| Archived photo files | `assets/pedals/**` |
| Photo provenance | `image_source_url` / `image_source_page` |
| Photo/research mirror | `research/pedals/PEDAL_IMAGES.json` |
| PRP status | `research/PRP_TRACKER.csv` |
| Research-to-catalog wiring | `scripts/sync_prp_catalog.py` |
| Tracker synchronization | `scripts/sync-prp-tracker.py` |
| Browser photo discovery | `scripts/browser-photo-cache.mjs` |
| Image conversion/storage | `scripts/cache-pedal-images.py` |
| Structural validation | `scripts/validate-archive.py` |
| Shared browser behavior | `assets/js/archive-core.js` |
| Landing-page behavior | `assets/js/archive-index.js` |
| Detail-page behavior | `assets/js/archive-detail.js` |
| Deployment orchestration | `.github/workflows/deploy-pages.yml` |
| Local browser-audit HTTP server | `scripts/serve-static.js` |

Do not create a competing implementation merely because another file is easier to edit.

## 12. Design-change discipline

For any website/UI/design change that could materially affect the result, resolve the design decision before implementation.

Before changing site code, explicitly account for:

- layout and hierarchy
- navigation/filter behavior
- click behavior
- desktop/mobile behavior
- URL and linking behavior
- required data fields
- future extensibility where the choice could create expensive rework

Once the user has made a design decision, treat that decision as the source of truth and record it in the appropriate architecture documentation.

## 13. Operational change discipline

Before an operation:

1. read the governing documents and current state
2. inspect the actual repository
3. check the canonical builder index
4. check Builder + Pedal identity
5. identify the single file/script that owns the change
6. make the smallest coherent change

After an operation:

1. validate the changed files
2. inspect the resulting repository state
3. confirm the requested behavior
4. update `CURRENT_STATE.md` and `research/BREADCRUMB.md` when project state changes
5. update the builder index when identity/block assignments change
6. commit a recoverable checkpoint

Never weaken a validator to make deployment pass.

## 14. Automation rules

Automation must be:

- narrow in responsibility
- safe to rerun
- restartable
- protected from duplicate writes
- backed by durable state

A failed run should leave enough information to resume without guesswork.

A deployment is not considered live merely because a GitHub commit exists. The relevant validation and live browser audits must succeed.

## 15. Durable project memory

The repository is the durable project memory.

Use:

- `CURRENT_STATE.md` for the current verified operating state
- `research/BREADCRUMB.md` for durable historical checkpoints
- `research/BUILDER_MASTER_INDEX.md` for canonical builder identities
- `research/PRP_RULES.md` for the permanent PRP operating contract
- `research/PEDAL_IMAGE_ARCHITECTURE.md` for the permanent photo storage contract
- `SITE_ARCHITECTURE.md` for the public site structure

Historical checkpoint records belong in the history files, not in permanent rulebooks.

## 16. Core principle

**One rule. One owner. One source of truth. One recoverable checkpoint.**
