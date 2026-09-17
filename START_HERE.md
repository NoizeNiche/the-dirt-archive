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

Collect builder names and the overdrive, distortion, and fuzz pedals those builders make or made. Keep the research focused on builder/product relationships.

## No-duplicate gate
`research/BUILDER_MASTER_INDEX.md` is the canonical identity gate for this phase.

A **research block is not a builder ID**. Multiple blocks may contain the same builder when older work is being preserved, but the builder may appear only once in the canonical identity list. Before creating any new block, check the master index by the builder's current name, historical name, alias, brand spelling, and known successor/predecessor name.

If the builder is already present, do not start a new builder census block. Add missing pedal evidence to the existing canonical builder record instead.

## Active census checkpoint
The current live block set contains **140 block files** representing **141 builder mentions** because Block 033 contains two builders. Those mentions collapse to **106 canonical builder identities** in the master index. Block 070 is absent. Block 142, Fairfield Circuitry, was removed because Fairfield is already represented by Block 102.

## Scope boundary
Do not expand the active scope into photos, biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, variant rabbit holes, or unrelated website architecture unless the repository state explicitly changes the scope.

## Change discipline
Before every change:
- Understand the current repository state.
- Check `research/BUILDER_MASTER_INDEX.md` for duplicate identity.
- Identify the source of truth.
- Make the smallest coherent change.

After every change:
1. Validate the repository contents.
2. Re-read the resulting repository state.
3. Verify the actual live/rendered result where the tooling allows.
4. Re-check that the result matches the requested change.
5. Update `CURRENT_STATE.md`.
6. Update `research/BREADCRUMB.md`.
7. Update `research/BUILDER_MASTER_INDEX.md` whenever builder identity or block assignments change.
8. Commit a recoverable state.

Never treat a successful GitHub file edit or commit as proof that the live site is correct.

## Source-of-truth rule
The repository is the project memory. When conversation history conflicts with the repository, inspect the repository and follow the current repository instructions/state.
