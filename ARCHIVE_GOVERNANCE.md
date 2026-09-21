# The Dirt Archive — Governance

## Mission
The Dirt Archive is a practical reference for guitar dirt pedals spanning the 1960s through the current day.

The current active phase is deliberately narrower:

**Builder → Pedals. THAT’S IT.**

## Filter metadata boundary

The website may eventually expose **component-type metadata as filters**, without expanding the archive into component-level documentation.

Allowed filter metadata includes:
- **Transistor Type** (for example, Germanium, Silicon, MOSFET, JFET)
- **Diode Type** (for example, Germanium, Silicon, LED, Schottky)

Do **not** turn these filters into component inventories. Do not catalog transistor or diode part numbers, schematics, component values, BOMs, or other circuit-level documentation as part of this filter feature.

These fields are metadata used to narrow pedal results. The filter system should remain separate from the Builder → Pedal core identity.

## Current-phase scope
Research and record only:
- builder names
- overdrive pedals
- distortion pedals
- fuzz pedals
- the builder-to-pedal relationship

The purpose of this phase is to build the largest usable census possible.

## Scrape definition and throughput rule

A **Scrape** is one completed bulk pass through the builder alphabet.

A scrape must:
1. cover **at least 10 distinct companies/builders**, unless fewer than 10 qualifying unprocessed companies remain in the entire alphabetic run
2. collect as many qualifying dirt-pedal records as the available evidence supports, rather than stopping once the minimum company count is reached
3. continue from the exact previous checkpoint and move alphabetically toward Z
4. use the canonical builder index and active scrape census as duplicate gates before adding anything
5. update the active scrape census, breadcrumb, current state, and any necessary builder-index assignments
6. leave a durable committed checkpoint that makes the next scrape immediately resumable

### Meaning of “Continue”

When the user says **“Continue”** after a completed scrape, treat it as an instruction to execute the **next full bulk scrape automatically**. Do not interpret it as a request for a small follow-up lookup. The next scrape begins at the saved alphabetic checkpoint and maintains the same throughput standard until Z is reached.

The objective is high-throughput completion of the full **A → Z builder census**. Ten companies is the minimum floor for a haul, not the desired stopping point.

## Research benchmark

The performance of the latest bulk scrape is the **minimum operating benchmark for every future scrape through Z**.

That benchmark means:
- do not stop at the first useful result or first few companies
- use broad, repeated searches and multiple relevant source/catalog channels when needed
- target **10+ distinct companies/builders per haul** and gather as many qualifying dirt-pedal records as practical
- mine both current and historical product catalogs when they support the Builder -> Pedals scope
- cross-check the canonical builder index and active scrape census before every write
- when a source or tool limits the amount of research that can be returned at once, split the work into additional passes rather than lowering the research standard
- treat duplicate checks, alias reconciliation, and product-family cleanup as part of the scrape itself
- do not declare the haul complete merely because the minimum company count has been reached; continue while meaningful unprocessed material is readily available
- leave the repository in a state where the next alphabetic haul can begin immediately

**The standard is throughput + breadth + deduplication + durable checkpointing.**

## Highest-priority design clarification rule

For any website/UI/design/build task, **clarifying questions that could materially affect the result must be resolved before implementation**.

Before writing or changing site code, actively check for questions about:
- layout and visual hierarchy
- navigation and filtering behavior
- what a click should do
- what belongs in the main content area versus menus
- mobile/responsive behavior
- URL, page, or linking behavior
- data fields the interface depends on
- future extensibility when the choice would make later rework likely

Do not silently invent a design decision just to keep moving. If a foreseeable ambiguity could cause a substantial redo, **stop and ask the user first**. This rule takes priority over speed or convenience.

When the user has explicitly answered a design decision, treat that answer as the source of truth and record the resulting decision in the project documentation when it affects the site's architecture.

## Pedal Research Phase rules

PRP follows the actual pedal list shown on the website in exact A-to-Z order.

Work in verified batches of 10 pedals, or as many as can be responsibly completed in one pass. Each pedal gets its own research record.

A pedal is PRP Complete only when it has both pedal information and a confirmed picture of that exact pedal/version.

The historical checkpoint above is retained as project history. The current PRP counts and target are maintained in **CURRENT_STATE.md** so this governance file does not become a second status ledger.



PRP1 batch 006 covered the next ten catalog records in exact order, from **Acid Fuzz - Mk1.5** through **Add+ Pedals - Pi**. New research records were added for **ADA Amps - MP-1 Channel** and eight **Add+ Pedals** products. An exact Effects Database photo was archived for **Add+ Pedals - Blues Player**. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.

The complete operating guide is research/PRP_RULES.md.



## Current site-priority override

The active Builder -> Pedals and PRP rules remain preserved. The current priority is **PRP1 photo recovery and pedal research**, with the site foundation regression checks kept in force.

PRP is active again. Continue from the saved PRP checkpoint and do not call a batch live until the repository validation and GitHub Pages publishing run succeed.

The site foundation requirements remain:
- catalog model/version/variation relationships are reliable
- photo routing is reliable
- public pedal pages are clear and simple
- navigation/search behavior is stable
- deployment validation catches data wiring errors

The working site architecture is documented in SITE_ARCHITECTURE.md.


## Faceted filter design

The left-hand archive navigation is intended to work as a **progressive, faceted filter system** rather than a single-choice menu.

A visitor may combine clues such as:
- search text
- dirt type
- builder
- transistor type
- diode type
- other deliberately supported metadata filters

All selected filters narrow the same result set in the main pedal area. Search and filters must work together rather than behaving as separate modes.

Filter options should be presented with useful result counts where practical, so visitors can see how much each choice narrows the archive before clicking.

The core use case is a visitor remembering incomplete information about a pedal and using several clues to rediscover it.

## Landing page navigation

The landing page uses a compact library layout:
**Search → Dirt Type → Builder → Pedal**.

The search field lives at the top of the left-hand navigation panel, above the builder menu, so someone looking for a specific pedal can search immediately.

The dirt menu has **All Pedals / Overdrive / Distortion / Fuzz**. Choosing a dirt type changes the builder list to builders carrying that type. Builders remain alphabetical in a scrollable panel. Clicking a builder changes the main pedal area on the right.

Pedal cards open pedal-detail.html with the builder and pedal passed in the URL; pedal.html remains only as a redirect for older links, giving every cataloged pedal an individual page.

## Canonical builder identity rule
`research/BUILDER_MASTER_INDEX.md` is the authoritative builder list for the active census.

A research block is a **checkpoint**, not a builder identity. The same builder may have multiple historical research blocks, but it must have one canonical identity in the master index.

Before creating a new builder block, check the master index by:
- current builder name
- historical builder name
- alias or shortened brand name
- alternate spelling/capitalization
- successor/predecessor name
- known brand or naming relationship

If the builder is already present, do not create another builder census block. Add missing pedal records to the existing canonical builder record.

Do not use the block number as a proxy for the builder number. Block numbering is chronological research bookkeeping only.

## Builder and pedal identity handling
Keep one canonical builder identity for the same builder even when the name appears differently across products or time.

Keep genuinely different builders separate when they are different companies or brands.

Do not create duplicate entries merely because of:
- capitalization differences
- punctuation differences
- shortened names
- retailer naming differences
- ordinary cosmetic presentation differences

For pedals, preserve the product names used by the builder or established catalog. If the builder treats two versions as distinct named products, they may be recorded separately. If two names clearly refer to the same product, consolidate them rather than creating duplicate records.

## No evidence bureaucracy
Do not create or maintain systems for:
- evidence grades
- verification grades
- secondary-evidence tiers
- unverified leads
- confidence scores
- proof-of-existence records
- legal-style chains of custody

This is a product census. We are cataloging what was made, not litigating whether it was made.

Source URLs may be retained simply because they help locate or recheck a product. They are reference links, not a separate classification system.


## Data principles
The builder/product relationship is the primary unit of work.

The useful questions are:
- What builders have made dirt pedals?
- What overdrive, distortion, and fuzz pedals did each builder make?
- Which builders are already cataloged?
- Which pedal names are already cataloged?
- What builders and products are still missing?

The research system should make those comparisons easy and immediate.

## Current canonical checkpoint
As of Batch 217:
- **502 canonical builder identities** are represented.
- **216 live research blocks** are present through Block 217, with Block 070 absent and Block 142 removed as a duplicate.
- The canonical builder index is reconciled through **ID 502 / Block 218**.
- The active Scrape C checkpoint is **after ZVEX Effects**, with **2352 live company/pedal/type rows**.

## Workflow discipline
Before an operation:
1. Read the governing files and current state.
2. Inspect the actual repository.
3. Check `research/BUILDER_MASTER_INDEX.md` for duplicate builder identity.
4. Check whether the builder and pedal names are already present.
5. Make the smallest coherent catalog change.

After every operation:
1. Validate the changed files.
2. Re-read the resulting repository state.
3. Confirm the result matches the request.
4. Update `CURRENT_STATE.md` and `research/BREADCRUMB.md`.
5. Update `research/BUILDER_MASTER_INDEX.md` whenever builder identity or block assignments change.
6. Commit a recoverable state.

## Durable checkpoints
The repository is the durable project memory. Every meaningful stopping point must leave enough state for a new ChatGPT/Codex session to resume without relying on conversation history.


## PRP1 batch 026 checkpoint

Batch 026 performed another exact-order photo-recovery audit across the first 10 incomplete tracker records, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already have Pedal Info research and their canonical research links remain intact. The A.Y.A Bass Fuzz search was strengthened with current and historical references, but the available current **BASS FUZZ II** listing was not promoted to the base-model image because its model designation is explicitly different. No new direct exact-model image asset met the archive's photo standard in this 10-pedal window, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. The work-order correction is explicit: the next exact-order unresolved target remains **A.Y.A - Bass Fuzz**, because the PRP tracker is the source of truth for the first incomplete record.


## Local photo archival rule — September 19, 2026

Verified pedal photographs are now intended to be stored locally in the repository rather than used as external runtime dependencies.

Use this backend relationship:

Builder -> Public pedal model/version -> Primary local photo -> Optional local colorway/edition variants

Primary image path:
`assets/pedals/{builder-slug}/{pedal-slug}/primary.webp`

Variant image path:
`assets/pedals/{builder-slug}/{pedal-slug}/variants/{variant-slug}.webp`

Keep the original image URL and source/product page as provenance metadata. Do not substitute a different model, revision, or colorway merely to fill a blank image slot.

The public site should consume the local image path. External URLs are temporary migration inputs, not the desired long-term runtime dependency.

See `research/PEDAL_IMAGE_ARCHITECTURE.md` for the complete storage contract.
