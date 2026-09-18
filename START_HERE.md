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

## Current project priority

The Builder -> Pedals census is complete. The current project priority is now the Pedal Research Phase (PRP).

PRP works from the actual live website pedal list in exact A-to-Z order. Start with the first incomplete pedal in the tracker and continue downward.

PRP is performed in verified batches of 10 pedals, or as many as can be responsibly completed in one pass. Every pedal gets its own research record.

A pedal is complete only when both pedal information and a confirmed picture of that exact pedal/version exist.

Research fields are:
- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- Transistor
- Diode
- Sound

Do not guess technical details. Unknown is a valid answer. Keep factory information separate from DIY, clone, mod, and forum-build information.

When an exact picture cannot be confirmed, do not substitute another pedal. The website shows No Photo Archived and the tracker remains incomplete.

Public individual pedal pages use the DRV benchmark layout: permanent left-side archive navigation, Archive Home, search, Dirt Type choices, a scrollable alphabetical builder list, pedal information, and a dedicated 3:4 photo area.

Public pedal pages do not show Research confidence, Photo, or Sources checked sections.

The current progress scoreboard is stored in research/PRP_TRACKER.csv. The site's single pedal lookup file is research/PEDAL_INDEX.json. Picture/research connections are stored in research/pedals/PEDAL_IMAGES.json.

Read research/PRP_RULES.md before doing PRP work. That file is the permanent operating guide.

## Current PRP checkpoint
- **3,821** unique pedals
- **134** have pedal information researched
- **103** have confirmed pictures
- **103** are fully complete
- **3,718** remain incomplete
- **31** are researched but currently waiting only for a confirmed picture
- **Next research target:** AboveGroundFX - El Griton Overdrive
- Earlier researched/photo-missing pedals remain in the photo-recovery queue.

The current pass checked the first ten open photo-recovery targets in site order and added exact verified pictures for Abasi Concepts - Pathos Distortion and AbbyTone - Screwed Driver. Do not substitute unverified or materially different pedal images.

Read research/PRP_RULES.md before doing PRP work. That file is the permanent operating guide.


## Current scrape checkpoint

The active Scrape C census is now at **1,453 live company/pedal/type rows** after Batch 215. The current alphabetic checkpoint is **after JHS Pedals**. Batch 215 added 17 builders, including canonical IDs 494-495 for J. Rockett Audio Designs and Jackson Audio. Two duplicate JHS Violet naming rows were consolidated during cleanup.

## Current scrape checkpoint
The active Scrape C census is now at **2,044 live company/pedal/type rows** after Batch 216. The current alphabetic checkpoint is **after Phaez Amplification**. Canonical IDs 496-502 were added for Katanasound, KMA Machines, Leqtique, Limetone Audio, Organic Sounds, Ovaltone, and Phaez Amplification.

## Current scrape checkpoint
The active Scrape C census is now at **2681 live company/pedal/type rows** after Batch 217. The current alphabetic checkpoint is **after ThorpyFX**. No new canonical builder identity was required in this haul.

## Current scrape checkpoint
Batch 218 is complete. Active Scrape C now contains **2681 live company/pedal/type rows** across **290 builder names**. The canonical builder index remains at **502 identities**. The alphabetic checkpoint is **after ZVEX Effects**.

## No-duplicate gate
`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity gate for this phase.

A **research block is not a builder ID**. Multiple blocks may contain the same builder when older work is being preserved, but the builder may appear only once in the canonical identity list. Before creating any new block, check the master index by the builder's current name, historical name, alias, brand spelling, and known successor/predecessor name.

If the builder is already present, do not start a new builder census block. Add missing pedal records to the existing canonical builder record instead.

## Active census checkpoint
The current live block set contains **215 block files** representing the active Builder -> Pedals research sequence through Block 216. The canonical builder index currently contains **502 builder identities**. Block 070 is absent. Block 142, Fairfield Circuitry, was removed as a duplicate because Fairfield is already represented elsewhere. Scrape C is the active alphabetic working census, and its current live layer contains **2,044 company/pedal/type rows**.

## Filter metadata boundary

The website may eventually expose **component-type metadata as filters**, without expanding the archive into component-level documentation.

Allowed filter metadata includes:
- **Transistor Type** (for example, Germanium, Silicon, MOSFET, JFET)
- **Diode Type** (for example, Germanium, Silicon, LED, Schottky)

Do **not** turn these filters into component inventories. Do not catalog transistor or diode part numbers, schematics, component values, BOMs, or other circuit-level documentation as part of this filter feature.

These fields are metadata used to narrow pedal results. The filter system should remain separate from the Builder → Pedal core identity.

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
