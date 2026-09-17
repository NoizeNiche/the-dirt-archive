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
