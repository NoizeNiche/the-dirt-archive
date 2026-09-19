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

**Pedal Research Phase (PRP1) research and photo synchronization.** The public catalog, pedal pages, data relationships, photo handling, version/variation behavior, navigation, and GitHub Pages deployment foundation are sufficiently reliable for the current verified batch workflow.

The intended public experience is a welcoming historical/reference archive for guitar dirt pedals. The main archive shows one entry per pedal model or materially distinct version. Cosmetic variations such as colorways, retailer finishes, event artwork, and similar editions belong inside the relevant model/version rather than becoming separate main catalog cards.

The individual pedal page should remain simple and useful, with the primary photograph, Pedal Info, Versions when applicable, Colorways & Editions, What it sounds like, and eventually one best representative YouTube demo.

See SITE_ARCHITECTURE.md for the current working data and page model.

## Current PRP checkpoint
- **3,821** unique pedals
- **855** have pedal information researched
- **285** have confirmed pictures
- **285** are fully complete
- **3,536** remain incomplete
- **570** are researched but currently waiting only for a confirmed picture
- **PRP status:** Active, PRP1 research and photo synchronization pass with local photo caching
- **Current PRP1 target:** **BOSS - ML-2 Metal Core**
- **Latest synchronized batch:** PRP1 Batch 110
- **Photo architecture:** verified photos are being migrated into local per-pedal primary/variant folders; source URLs remain provenance only

Read research/PRP_RULES.md before doing PRP work. That file is the permanent operating guide.

## PRP1 batch 029 checkpoint
The first incomplete tracker record remains **A.Y.A - Bass Fuzz**. The exact original-model Mercari photograph was re-confirmed, but no stable direct image asset was safe to promote. Counts remain 3,821 unique, 220 researched, 162 pictured, 162 complete, and 3,659 incomplete; 58 are researched and waiting only for a picture. Do not substitute the later BASS FUZZ II. 


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


## Latest PRP1 checkpoint — Bulinski Effect Pedals RC Bass Fuzz

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - The Full Circle Bass Fuzz; The Large Beaver; The Mimosa; The Swede; Yellow Overdrive; Bulinski Effect Pedals - Deluxe Velociraptor Diode Bass Fuzz; Filth Foundry Guitar Fuzz; Gnarly Bee; Hard 80 Distortion; and RC Bass Fuzz**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Photo records remain conservative where no verified exact-model image has been archived.

**Verified tracker totals:** **3821 total / 1024 researched / 301 pictured / 300 complete / 3521 incomplete / 724 researched-photo-pending**.

**Next exact-order research target:** **Bulinski Effect Pedals - Velociraptor Diode Bass Fuzz**.

**Public data version:** 2026-09-19-prp1-batch-132.
## PRP1 batch 008 checkpoint
ADA Amps - MP-1 Channel is now fully complete after exact photo confirmation from Chicago Music Exchange. The tracker, public index, and photo manifest were updated together. Next exact-order unresolved target: Add+ Pedals - Der Fuzzer.


## PRP1 batch 009 checkpoint
Batch 009 completed the next ten exact-order PRP1 records from **Add+ Pedals - Der Fuzzer** through **Add+ Pedals - Ratortion 3**. The first seven records already had research and were checked for photo recovery; three new research records were added for Ratortion, Ratortion 2, and Ratortion 3. The exact Add+ Pi picture was confirmed and connected to the public index and photo manifest. Records without a safely archived direct exact-model image remain photo-pending.
The next exact-order unresolved target is **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 010 checkpoint
Batch 010 worked the next ten exact-order PRP1 records from **A Sound Of Failure - Death Driver** through **AC Efectos - Triplex Distortion**. An exact Effects Database photograph was confirmed and archived for **Death Driver**, moving that pedal to fully complete. The remaining nine records in this photo-recovery window remain incomplete where no safe direct exact-model image asset was confirmed.
The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.


## PRP1 batch 011 checkpoint
Batch 011 expanded the photo-recovery sweep through the next 20 unresolved catalog records, from **A.Y.A - Bass Fuzz** through **Add+ Pedals - Ratortion 2**. An exact direct image asset was confirmed for **AC Noises - Urla** from Stars Music and connected to the research record, photo manifest, public index, and tracker. **A.Y.A - Bass Fuzz** received stronger historical and exact-model visual evidence, but no direct image asset was safely archived, so it remains photo-pending.
The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 030 checkpoint

Batch 030 rechecked the exact first unresolved target, **A.Y.A - Bass Fuzz**. A fresh image search visually confirmed the original blue-sparkle A.Y.A tokyo japan BASS FUZZ enclosure from the 2024 Mercari listing, including the Fuzz/Vol layout and BASS FUZZ labeling. The source page currently returns 404 and no stable directly retrievable image asset was exposed, so the image remains unarchived and the public card must continue to show **No Photo Archived**. Current BASS FUZZ II listings remain a different model/version and are not substituted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 032 checkpoint

The photo-recovery pass broadened the search for **A.Y.A - Bass Fuzz** to exact-title image indexing and additional independent Japanese references. The original blue-sparkle Bass Fuzz photograph was re-confirmed visually, but the underlying Mercari item is unavailable to the crawler and no stable direct image asset was exposed. The current **BASS FUZZ II** listings are explicitly a different version and remain excluded. **Picture remains NEEDED / PRP Complete remains NEEDED.** Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 033 checkpoint

Batch 033 refined the existing **A.Y.A - Bass Fuzz** research record using the original owner's firsthand account. His unit is identified as number 20 of the 30-unit run, and his notes describe a gritty but controlled bass fuzz that retains the instrument's core, projects strongly in a band mix, and has relatively little sustain. No new stable archival image asset was found, so **Picture remains NEEDED / PRP Complete remains NEEDED**. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 034 checkpoint

Batch 034 widened the photo-recovery window to the first 10 incomplete tracker records, beginning with **A.Y.A - Bass Fuzz** and continuing through **Accel Audio - OD-SS Express Overdrive**. The original A.Y.A Bass Fuzz image was re-confirmed visually, but its source remains unavailable for stable direct retrieval. The remaining nine records were also rechecked across exact-model web/image searches; available hits remain catalog pages or dynamic marketplace/affiliate listings without a safe archival image asset. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 035 checkpoint

Batch 035 widened the direct-image hunt across the current unresolved window using builder-domain searches, Effects Database records, historical resale sources, and exact-name image indexing. **A.Y.A - Bass Fuzz** remains visually confirmed by the indexed original-model photograph, but no stable direct asset is exposed. The following unresolved records likewise produced catalog imagery or source pages without a safe direct image file. No picture status changed. **Counts remain 3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for a picture. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 070 checkpoint
Batch 070 completed the next ten exact-order PRP targets with synchronized research records, photo manifest entries, public index entries, and tracker status. The next target is **Baddy One Shoe Pedals - Heartbreaker**.


## PRP1 batch 071 checkpoint
Batch 071 completed ten exact-order PRP targets with synchronized research records, photo manifest entries, public index entries, and tracker status. The next target is **Baja Tech Custom - Das Fuzz Si**.

## PRP1 batch 073 checkpoint
Batch 073 completed ten exact-order PRP targets with synchronized research records, photo manifest entries, public index entries, and tracker status. The next target is **Baroni Lab - GD Drive**.

## PRP1 batch 074 checkpoint
Batch 074 completed ten exact-order PRP targets with synchronized research records, photo manifest entries, public index entries, and tracker status. The next target is **Basic Audio - Sharp Tooth**.


## PRP1 batch 090 checkpoint

Batch 090 completed the next ten unfinished records in exact tracker order: **Biyang - DS-8 Mouse; DS-9 Distortion; FZ-12 Fuzz; FZ-7 Fuzz; Junky Drive; Metal-End; NM-2 New Metal; OD-12 X-Drive; OD-7 Overdrive; and OD-8 X-Drive**.

All ten now have individual Pedal Info research records and were synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. No exact-model image met the stable archival-image standard in this pass, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**.

**Live tracker totals after Batch 090:** **3,821 total / 672 researched / 277 pictured / 277 fully complete / 3,544 incomplete**, with **395** researched pedals waiting only for confirmed pictures.

**Next exact-order missing-information target:** **Biyang - OTD-100 Distortion**.

**Parked/non-blocking:** **A.Y.A - Bass Fuzz** remains picture-pending for later exact-photo recovery.


## Photo architecture checkpoint — September 19, 2026

The archive now uses a local-first pedal photo architecture.

- `research/PEDAL_INDEX.json` remains the public catalog source.
- A populated `image` field should resolve to the site's local cached asset under `assets/pedals/`.
- `image_source_url` preserves the original image URL for provenance and future recovery.
- `image_source_page` preserves the source/product page used to identify the exact pedal.
- Each model/version owns a `primary.webp` file.
- Cosmetic colorways and subordinate editions use the parent pedal's `variants/` directory.
- Materially distinct public versions remain separate catalog identities and separate image directories.
- `No Photo Archived` remains the state for a researched pedal without a safely archived exact image.
- The `Cache pedal images` workflow performs migration/retry work. It must not replace an exact image with a guessed or mismatched image.
- Deployment and hourly health checks validate that local cached files exist and that local images retain provenance.

The complete backend contract is documented in `research/PEDAL_IMAGE_ARCHITECTURE.md`.

## Latest PRP1 checkpoint — BYOC Li'l Gray OD

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - Green Pony; Leeds Fuzz; Li'l Beaver (NYC); Li'l Beaver (Opamp); Li'l Beaver (Ram's Head); Li'l Beaver (Russian); Li'l Beaver (Triangle); Li'l Breaker; Li'l Fuzz; and Li'l Gray OD**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Sparse historical BYOC entries were kept conservative rather than assigning unsupported circuit details.

**Verified tracker totals:** **3821 total / 1005 researched / 300 pictured / 300 complete / 3521 incomplete / 705 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - Li'l Modified Overdrive**.

**Public data version:** 2026-09-19-prp1-byoc-li-l-gray-od.


## Latest PRP1 checkpoint — BYOC Silver Pony

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - Li'l Modified Overdrive; Li'l Mouse; Li'l Yellow OD; Mighty Mouse; Orange Distortion; Overdrive 2; Parametric Overdrive; Screamer Clone; Shredder; and Silver Pony**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Photos remain conservative and unpromoted where no verified image has been archived.

**Verified tracker totals:** **3821 total / 1014 researched / 301 pictured / 300 complete / 3521 incomplete / 714 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - The Full Circle Bass Fuzz**.

**Public data version:** 2026-09-19-prp1-byoc-silver-pony.


## PRP1 Batch 133 checkpoint — September 19, 2026

Batch 133 advanced **10 consecutive exact-order research records**: **Bulinski Effect Pedals - Velociraptor Diode Bass Fuzz; Buzzing Bugs Audio Devices - BB01 Fuzz Pre-Amp; BB02 Percolator Fuzz; BB04 Full Range Drive; Bolster; Mortal Joy - Los Campesinos! Collaboration; Byron Amplification - Blood Drive Overdrive; Cabeza Borradora Octave Fuzz; Cowboy Overdrive; and Dark Arts Drive Overdrive**.

All ten now have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source URLs were captured for **9 of the 10** records for future local archival recovery; no image was promoted to a local catalog asset without the archival cache step. Velociraptor remains source-only because the reviewed manufacturer/database material showed version-specific image/control differences that should not be collapsed into one guessed image.

**Verified tracker totals:** **3,821 total / 1,035 researched / 300 pictured / 300 complete / 3,521 incomplete / 735 researched-photo-pending**.

**Next exact-order research target:** **Byron Amplification - Green Concussion Fuzz**.

**Public data version:** **2026-09-19-prp1-batch-133**.


## PRP1 Batch 134 checkpoint — September 19, 2026

Batch 134 added **10 consecutive exact-order research records**: **Byron Amplification - Green Concussion Fuzz; Her Majesty Drive/Fuzz; Jabberwocky Distortion; Lil' Shaman Overdrive; Pai Mei Fuzz; Phattie Overdrive; Poder Del Alma Fuzz; POW! Boost/Drive and Fuzz; Shearling Overdrive; and Viper Ninja Overdrive**.

The pass stayed conservative where Byron's catalog did not expose technical documentation. Jabberwocky, Lil' Shaman, Phattie, and Viper Ninja received documented technical details; the remaining records retain only claims supported by the manufacturer catalog. No questionable photo was promoted.

**Verified tracker totals:** **3,821 total / 1042 researched / 303 pictured / 300 complete / 3521 incomplete / 739 researched-photo-pending**.

**Next exact-order research target:** **BYW Audio - Blacky' Blower**.

**Public data version:** **2026-09-19-prp1-batch-134**.
