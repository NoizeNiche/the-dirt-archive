# The Dirt Archive — START HERE

This repository is the durable project memory for The Dirt Archive.

## Mandatory boot sequence
Do not rely on conversation history, model memory, assumptions, or previous-chat context.

Before doing project work, read these files in this order:
1. `START_HERE.md`
2. `ARCHIVE_GOVERNANCE.md`
3. `CURRENT_STATE.md`
4. `research/BREADCRUMB.md`
5. `research/BUILDER_MASTER_INDEX.md`

Then inspect the actual repository state and determine what is complete, what the current mission is, what the exact next action is, and what must not be touched.

## Current project priority
**Builder → Pedals. THAT’S IT.**

Collect builder names and the overdrive, distortion, and fuzz pedals those builders make or made. The goal is a comprehensive census, so the research system must make it easy to compare everything already collected against everything newly found.

## Scrape / Continue protocol

A **Scrape** is a bulk research haul, not a single-builder lookup.

Whenever the user says **“Scrape”** or **“Continue”** after a haul, the next operation must:
- continue from the exact saved alphabetic checkpoint
- research **at least 10 distinct companies/builders** in the haul, unless fewer than 10 qualifying unprocessed companies remain in the entire project
- gather as many verified overdrive, distortion, and fuzz pedal records as practical from those builders rather than stopping at the minimum
- use multiple source/catalog searches where useful, prioritizing primary or authoritative product catalogs and historical references
- check the canonical builder index and active scrape census before writing records so existing builders and pedals are expanded rather than duplicated
- write the new records into the active scrape census used by the website
- update the breadcrumb/current-state checkpoint and commit a recoverable state before the haul is considered complete
- immediately leave the project positioned for the next alphabetic haul

The goal is to move continuously from **A through Z** with high-throughput bulk scrapes. The **10-company minimum is a hard floor for every haul**, not a target.

## No-duplicate gate
`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity gate for this phase.

A **research block is not a builder ID**. Multiple blocks may contain the same builder when older work is being preserved, but the builder may appear only once in the canonical identity list. Before creating any new block, check the master index by the builder's current name, historical name, alias, brand spelling, and known successor/predecessor name.

If the builder is already present, do not start a new builder census block. Add missing pedal records to the existing canonical builder record instead.

## Active census checkpoint
The current live block set contains **140 block files** representing **141 builder mentions** because Block 033 contains two builders. Those mentions collapse to **106 canonical builder identities** in the master index. Block 070 is absent. Block 142, Fairfield Circuitry, was removed because Fairfield is already represented by Block 102.

## Scope boundary
Do not expand the active scope into photos, biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, or unrelated website architecture unless the repository state explicitly changes the scope.

## Change discipline
Before every change:
- Understand the current repository state.
- Check `research/BUILDER_MASTER_INDEX.md` for duplicate builder identity.
- Check whether the builder and pedal names are already present.
- Make the smallest coherent catalog change.

After every change:
1. Validate the repository contents.
2. Re-read the resulting repository state.
3. Re-check that the result matches the requested change.
4. Update `CURRENT_STATE.md`.
5. Update `research/BREADCRUMB.md`.
6. Update `research/BUILDER_MASTER_INDEX.md` whenever builder identity or block assignments change.
7. Commit a recoverable state.

## Source-of-truth rule
The repository is the project memory. When conversation history conflicts with the repository, inspect the repository and follow the current repository instructions/state.
