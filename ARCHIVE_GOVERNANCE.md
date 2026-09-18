# The Dirt Archive — Governance

## Mission
The Dirt Archive is a practical reference for guitar dirt pedals spanning the 1960s through the current day.

The current active phase is deliberately narrower:

**Builder → Pedals. THAT’S IT.**

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

## Landing page navigation

The landing page uses a compact library layout:
**Search → Dirt Type → Builder → Pedal**.

The search field lives at the top of the left-hand navigation panel, above the builder menu, so someone looking for a specific pedal can search immediately.

The dirt menu has **All Pedals / Overdrive / Distortion / Fuzz**. Choosing a dirt type changes the builder list to builders carrying that type. Builders remain alphabetical in a scrollable panel. Clicking a builder changes the main pedal area on the right.

Pedal cards are real links to pedal.html with the builder and pedal passed in the URL, giving every cataloged pedal an individual page.

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

## Do not expand scope during this phase
Do not spend time on photos, biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, or unrelated website/UI architecture unless the repository state explicitly changes the mission.

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
As of the current live repository state:
- **106 canonical builder identities** are represented.
- **141 builder mentions** occur across **140 live block files** because Block 033 contains two builders.
- Those mentions collapse into the 106 canonical identities.
- Block 070 is absent.
- Block 142 was Fairfield Circuitry and was removed as a duplicate because Fairfield already exists as Block 102.

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
