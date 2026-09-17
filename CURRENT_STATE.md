# The Dirt Archive - Current State

## Repository
`NoizeNiche/the-dirt-archive`

Default branch: `main`

## Current mission
**Builder -> Pedals. THAT'S IT.**

The active work is the builder census: identify builders and document the overdrive, distortion, and fuzz pedals they make or made. Do not move into the later photo or pedal-information phases yet.

## Canonical source of truth
`research/BUILDER_MASTER_INDEX.md` remains the canonical builder identity ledger.

`research/MASTER_PEDAL_CENSUS.csv` is now the canonical accumulated pedal table for the current Builder -> Pedals phase. Its core fields are deliberately simple: **Builder, Pedal, Type**.

A research block is a chronological checkpoint, not a builder ID. Multiple blocks can refer to the same builder.

## Current census checkpoint
- **140 block files** are currently present under `research/builders/`.
- **231 builder sections** are parsed from those blocks because many blocks contain more than one builder section.
- The generated master pedal census currently contains **2,466 builder/pedal/type rows**.
- Those rows currently cover **103 builder names** with target overdrive, distortion, or fuzz entries.
- Live blocks are **001-069 and 071-141**.
- **Block 070 is absent.** It is not a builder and must not be treated as a missing builder.
- **Block 142 was Fairfield Circuitry and was removed as a duplicate** because Fairfield Circuitry is already represented by Block 102.

## Master pedal census
`research/MASTER_PEDAL_CENSUS.csv` is generated from the live research blocks by `tools/build_master_pedal_census.py` and rebuilt automatically by `.github/workflows/rebuild-master-census.yml`.

The table intentionally contains only:

`Builder | Pedal | Type`

Type is limited to **Overdrive**, **Distortion**, and **Fuzz**. A pedal can have more than one row when it belongs to more than one of those categories.

Grouped research notes, explanatory prose, embedded citation tokens, and “no product” placeholder statements are removed during generation so the master table stays focused on actual named pedal products.

## Current workflow direction
The important job is now **collect -> compare -> consolidate -> organize**.

The master pedal census is the comparison point for all future pedal research. New builders and pedals should be compared against the accumulated master tables before additional research blocks are created.

Do not spend the active phase building evidence, verification, confidence, or lead-tracking systems. Those are outside the purpose of this census.

## Latest corrective work
1. Added `research/BUILDER_MASTER_INDEX.md` with the working canonical builder identities.
2. Made the master index the no-duplicate gate in `START_HERE.md` and `ARCHIVE_GOVERNANCE.md`.
3. Removed duplicate Fairfield Circuitry Block 142 from the live block set.
4. Simplified the governance so the active phase stays focused on the actual builder/pedal census.
5. Created `research/MASTER_PEDAL_CENSUS.csv` from the accumulated research blocks.
6. Added `tools/build_master_pedal_census.py` so the census is regenerated from the live blocks instead of manually retyped.
7. Added `.github/workflows/rebuild-master-census.yml` so the master pedal table rebuilds automatically after research changes.

## Next action
Do not automatically create another block by number. Use the master builder and pedal tables first. Select the next builder that is not already represented, research its target dirt products, compare those products against `research/MASTER_PEDAL_CENSUS.csv`, and add only genuinely new product identities.

## Website
The website remains a simple `UNDER CONSTRUCTION` page. No visual correctness claim is made without an actual browser/render inspection.

## Must not touch during this phase
Do not expand into photos, biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, or unrelated website/UI architecture unless the repository state explicitly changes the mission.
