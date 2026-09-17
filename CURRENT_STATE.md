# The Dirt Archive - Current State

## Repository
`NoizeNiche/the-dirt-archive`

Default branch: `main`

## Current mission
**Builder -> Pedals. THAT'S IT.**

The active work is the builder census: identify builders and document the overdrive, distortion, and fuzz pedals they make or made. Do not move into the later photo or pedal-information phases yet.

## Canonical source of truth
`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity ledger for this phase.

A research block is a chronological checkpoint, not a builder ID. Multiple blocks can refer to the same builder, but the canonical builder count is taken only from the master index.

## Corrected live census checkpoint
- **106 canonical builder identities** are represented by the current live Builder -> Pedals block set.
- **140 block files** are currently present under `research/builders/`.
- **141 builder mentions** occur in those blocks because Block 033 contains two builders.
- The 141 mentions collapse to **106 canonical identities**, so there are **35 duplicate/alias mentions** to identities already represented elsewhere.
- Live blocks are **001-069 and 071-141**.
- **Block 070 is absent.** It is not a builder and must not be treated as a gap that creates a new builder.
- **Block 142 was Fairfield Circuitry and was removed as a duplicate** because Fairfield Circuitry is already represented by Block 102.

## Confirmed duplicate builder groups
The master index records the block mapping. The major repeated groups include:

- Amptweaker: 043, 127
- Analog Man: 006, 118
- Barber Electronics: 015, 125
- Beetronics FX: 020, 123
- Black Arts Toneworks: 101, 134
- BlackOutEffectors: 050, 113
- Catalinbread Effects: 004, 116, 132
- Crazy Tube Circuits: 017, 122
- Death By Audio: 010, 096, 135
- Dr. Scientist Sounds: 036, 037, 106
- EarthQuaker Devices: 002, 098, 129
- Electronic Audio Experiments: 018, 100
- Friedman Amplification: 009, 011, 126
- Fulltone: 001, 105
- Greer Amps: 014, 120
- IdiotBox Effects: 042, 107
- JHS Pedals: 003, 117, 130
- Keeley Electronics: 062, 133
- Mythos Pedals: 023, 114
- Old Blood Noise Endeavors: 019, 104
- ProCo Sound: 008, 012, 138
- Spaceman Effects: 103, 136
- Suhr: 025, 121
- ThorpyFX: 109, 137
- Walrus Audio: 064, 131
- Wampler Pedals: 063, 128
- Way Huge: 040, 140
- ZVEX Effects: 065, 141

## Current workflow direction
The important job is now **collect -> compare -> consolidate -> organize**.

The research corpus should make it easy to compare the entire accumulated builder/pedal list against every newly researched builder and pedal, so duplicate work is caught before another block is created.

Do not spend the active phase building evidence, verification, confidence, or lead-tracking systems. Those are outside the purpose of this census.

## Latest corrective work
1. Added `research/BUILDER_MASTER_INDEX.md` with the 106 canonical builder identities and live block mappings.
2. Made the master index the no-duplicate gate in `START_HERE.md` and `ARCHIVE_GOVERNANCE.md`.
3. Removed duplicate Fairfield Circuitry Block 142 from the live block set.
4. Corrected this state file so the checkpoint no longer stops at Block 128.
5. Simplified the governance so the active phase stays focused on the actual builder/pedal census.

## Next action
Do **not** automatically create another block by number. First select a builder that is absent from `research/BUILDER_MASTER_INDEX.md`. Before adding pedal names, compare them against the accumulated census and add only what is missing.

## Website
The website remains a simple `UNDER CONSTRUCTION` page. No visual correctness claim is made without an actual browser/render inspection.

## Must not touch during this phase
Do not expand into photos, biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, or unrelated website/UI architecture unless the repository state explicitly changes the mission.
