# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 17, 2026

## Active mission
**Builder -> Pedals. THAT'S IT.**

Fresh builder/product census only. Record builder names and their overdrive, distortion, and fuzz pedals. The key workflow is to collect the data, compare it against the accumulated census, consolidate duplicates, and keep expanding.

## Canonical data state
`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity ledger.

`research/MASTER_PEDAL_CENSUS.csv` is the canonical accumulated pedal table for the current phase. It uses only **Builder | Pedal | Type**, with Type limited to Overdrive, Distortion, and Fuzz.

Current live checkpoint:
- **140 live block files**
- **231 builder sections** parsed from those blocks
- **2,466 master census rows**
- **103 builder names** currently represented in the pedal census
- Live blocks: **001-069 and 071-141**
- **Block 070 is absent**
- **Block 142 (Fairfield Circuitry) was removed as a duplicate** because Fairfield Circuitry is already represented by Block 102

## Duplicate prevention
A research block is a chronological checkpoint, not a builder ID. Before creating any new builder block, check `research/BUILDER_MASTER_INDEX.md` by current name, historical name, alias, alternate spelling, and known successor/predecessor name.

Before adding pedals, compare the new pedal names against `research/MASTER_PEDAL_CENSUS.csv` and add only the missing products.

## Master census generation
`tools/build_master_pedal_census.py` reads the accumulated builder blocks and produces the master pedal table. `.github/workflows/rebuild-master-census.yml` rebuilds it automatically when the live research collection changes.

The generator removes grouped research notes, explanatory prose, embedded citation tokens, and placeholder statements that do not name a pedal. The research blocks themselves remain intact as working notes.

## Corrective work completed
- Added the canonical master builder index.
- Made the master index the no-duplicate gate in `START_HERE.md`.
- Added the canonical identity and census workflow rules to `ARCHIVE_GOVERNANCE.md`.
- Corrected `CURRENT_STATE.md` to the live census checkpoint.
- Removed the duplicate Fairfield Circuitry Block 142.
- Removed unnecessary evidence and verification bureaucracy from the project rules.
- Created the accumulated master pedal census from all current research blocks.
- Added automatic rebuilding of the master pedal census.

## Next action
Do not infer the next builder from the next block number. Use the master builder and pedal tables to choose the next unrepresented builder and to compare every newly found pedal against the accumulated census before adding more research.

## Hard scope boundary
No photos. No biographies. No deep history. No components. No schematics. No PCB work. No BOMs. No internal imagery. No cloning information. No unrelated website/UI architecture.
