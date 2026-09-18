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

The single search field lives at the top of the left-hand navigation panel, above the builder menu, so someone looking for a specific pedal can search immediately. The dirt menu has **All Pedals / Overdrive / Distortion / Fuzz**. Choosing a dirt type changes the builder list to builders carrying that type. Builders remain alphabetical in a scrollable panel. Clicking a builder changes the main pedal area on the right.

Pedal cards are real links to `pedal.html` with the builder and pedal passed in the URL, giving every cataloged pedal an individual page.

## No-duplicate gate
`research/BUILDER_MASTER_INDEX.md` is the canonical builder identity gate for this phase.

A **research block is not a builder ID**. Multiple blocks may contain the same builder when older work is being preserved, but the builder may appear only once in the canonical identity list. Before creating any new block, check the master index by the builder's current name, historical name, alias, brand spelling, and known successor/predecessor name.

If the builder is already present, do not start a new builder census block. Add missing pedal records to the existing canonical builder record instead.

## Active census checkpoint
The current live block set contains **212 block files** representing the active Builder -> Pedals research sequence through Block 214. The canonical builder index currently contains **493 builder identities**. Block 070 is absent. Block 142, Fairfield Circuitry, was removed as a duplicate because Fairfield is already represented elsewhere. Scrape C is the active alphabetic working census, and its current live layer contains **1,105 company/pedal/type rows**.

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
