# The Dirt Archive — Governance

## Mission
The Dirt Archive is a practical visual reference for guitar dirt pedals spanning the 1960s through the current day. The long-term sequence is:

**Builder → Pedals → Photos → Information on the pedal**

The current active phase is deliberately narrower:

**Builder → Pedals. THAT’S IT.**

## Current-phase scope
Research and record:
- builder names
- overdrive pedals
- distortion pedals
- fuzz pedals
- the builder-to-pedal relationship

Prioritize builders with multiple relevant dirt pedals so the census grows efficiently.

## Canonical builder identity rule
`research/BUILDER_MASTER_INDEX.md` is the authoritative identity ledger for the active builder census.

A research block is a **checkpoint**, not a builder identity. The same builder may have multiple historical research blocks, but it must have one canonical identity in the master index.

Before creating a new builder block, check the master index by:
- current builder name
- historical builder name
- alias or shortened brand name
- alternate spelling/capitalization
- successor/predecessor name
- known OEM or marketed-brand relationship

If the identity is already present, do not create another builder census block. Update or extend the existing canonical builder record instead.

Do not use the block number as a proxy for the builder number. Block numbering is chronological research bookkeeping only.

## Duplicate and lineage handling
Repeated names, aliases, successor names, OEM manufacturers, marketed brands, distributors, and collaboration partners must be reconciled before promotion to a canonical builder identity.

Keep genuinely separate builders separate when the evidence supports distinct identities. Do not merge two builders merely because their names are similar. Do not multiply one builder into separate cards because of ordinary naming, ownership, location, cosmetic, or routine product-version changes.

Historical research blocks may be preserved for auditability, but the canonical index must never count them as separate builders.

## Do not expand scope during this phase
Do not spend time on photos, pedal biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, variant rabbit holes, or unrelated website/UI architecture unless the repository state explicitly changes the mission.

## Data principles
The builder/product pairing is the primary research relationship. Keep research material separate from published presentation data. Avoid inventing certainty where builder/product attribution is unclear. A same-name product from a different recognized builder is a separate identity; cosmetic or technical variations of the same underlying product should not create unnecessary duplicate identities during the initial catalog pass.

## Current canonical checkpoint
As of the current live repository state:
- **106 canonical builder identities** are represented.
- **141 builder mentions** occur across **140 live block files** because Block 033 contains two builders.
- Those mentions include **35 duplicate/alias occurrences** that collapse into the 106 canonical identities.
- Block 070 is absent.
- Block 142 was Fairfield Circuitry and was removed as a duplicate because Fairfield already exists as Block 102.

## Workflow discipline
Before an operation:
1. Read the governing files and current state.
2. Inspect the actual repository.
3. Check `research/BUILDER_MASTER_INDEX.md` for duplicate identity.
4. Identify the source of truth and dependencies.
5. Make the smallest coherent change.

After every operation:
1. Validate the changed files.
2. Re-read the resulting repository state.
3. Verify the live/rendered result where tooling permits.
4. Confirm the result matches the request.
5. Update `CURRENT_STATE.md` and `research/BREADCRUMB.md`.
6. Update `research/BUILDER_MASTER_INDEX.md` whenever builder identity or block assignments change.
7. Commit a recoverable state.

A successful file write or GitHub commit is not proof that a live website is correct.

## Durable checkpoints
The repository is the durable project memory. Every meaningful stopping point must leave enough state for a new ChatGPT/Codex session to resume without relying on conversation history.
