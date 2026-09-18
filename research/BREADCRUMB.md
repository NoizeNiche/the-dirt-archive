# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 18, 2026

## Active mission
**Company -> Pedal -> Pedal Info -> Photo**

That is the website's entire information structure. Keep collecting companies and the pedals they make, then add pedal information and pedal photos to those records.

## Current catalog
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated pedal catalog currently used by the website.

Current master-catalog checkpoint:
- **2,466 company/pedal/type rows** are currently consolidated in the primary census
- **103 companies** are currently represented by pedal entries
- Block 162 contributed **111 rows** to the Scrape B census
- Block 163 contributed **16 rows** to the Scrape B census
- Blocks 164-217 are stored in the active Scrape C census
- Blocks 162-163 are consolidated into `research/SCRAPE_B_CENSUS.csv`

Current Builder -> Pedals research checkpoint:
- **502 canonical builder identities are in the master index through Block 218**
- **Block 161 added 9 new canonical identities, Block 162 added 9, Block 163 added 5, and Block 164 added 10**
- Existing builders are expanded under their existing canonical identities rather than duplicated
- **216 live research blocks** are now present: Blocks 001-069, 071-141, and 143-215
- Block 070 is absent; Block 142 was removed as a duplicate

The website uses `research/PEDAL_INDEX.json` as its public runtime catalog source. Research blocks remain working material and are not part of page rendering.

## Block 215
Batch 215 staged 350 raw records across 17 builders; 348 net new live rows remain after cleanup, moving the live alphabetic checkpoint from Empress Effects through JHS Pedals. Canonical builder IDs 494-495 were added for J. Rockett Audio Designs and Jackson Audio.

The active Scrape C census now contains **2681 company/pedal/type rows** across 290 builder identities represented in the live working layer.

## Block 216
Batch 216 added 26 builders and 591 net-new company/pedal/type rows, moving the active checkpoint from JHS Pedals through Phaez Amplification. Canonical builder IDs 496-502 were added for Katanasound, KMA Machines, Leqtique, Limetone Audio, Organic Sounds, Ovaltone, and Phaez Amplification.

## Block 218
Batch 218 continued the alphabetic scrape from Vemuram through ZVEX Effects, covering 12 builders and adding 319 net-new company/pedal/type rows. The 502-builder canonical index was expanded rather than duplicated. The active checkpoint is now after ZVEX Effects.

## Block 217
Batch 217 added 17 builders and 308 net-new company/pedal/type rows, moving the active alphabetic checkpoint from Phaez Amplification through ThorpyFX. No new canonical builder identity was required.

## Website state

index.html is the working public catalog page.

The individual pedal page benchmark is the current DRV page:
- permanent left-side archive navigation
- Archive Home
- search
- Dirt Type choices
- scrollable alphabetical builder list
- pedal name and builder
- pedal information as the main content
- dedicated 3:4 photo area
- No Photo Archived when an exact photo is not confirmed
- clean desktop and mobile behavior

Public pedal pages do not show:
- Research confidence
- Photo
- Sources checked

The main catalog now renders the first 72 matching cards at a time and uses Load More for larger result sets, so filtering/search does not rebuild thousands of card elements at once.


## Site architecture checkpoint — September 18, 2026

PRP is paused while the site foundation is audited. Do not continue pedal research until the core catalog/data relationships and page behavior are reliable.

Current architecture decisions:
- Main archive shows one card per pedal model or materially distinct public version.
- Colorways/cosmetic variations live inside their parent model/version and do not become separate main cards.
- V2-style materially different versions can have their own page and can be linked from the parent page.
- Primary photos live in PEDAL_INDEX.json for public runtime use.
- Colorway galleries and future best-demo links are optional structured metadata.
- The individual pedal page remains simple and approachable.
- Future PRP2 depth is deferred.
- Site cache/version marker is `2026-09-18-site-architecture-004` for the current visual/functionality pass.


## Current PRP checkpoint

- Unique pedals in website catalog: 3,821
- Pedals with research information: 202
- Pedals with confirmed pictures: 162
- Fully complete PRP pedals: 162
- Remaining incomplete pedals: 3667
- Researched but waiting only for a confirmed picture: 48
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **Adventure Audio - Demogorgon Fuzz**

PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for **ADA Amps - MP-1 Channel** and eight **Add+ Pedals** products. An exact Effects Database photo was archived for **Add+ Pedals - Blues Player**. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.

## Current PRP data files

research/PEDAL_INDEX.json
- single pedal lookup file used by the website

research/pedals/PEDAL_IMAGES.json
- picture and research-record connections

research/PRP_TRACKER.csv
- one row per unique Builder + Pedal
- Pedal Info status
- Picture status
- PRP Complete status

research/PRP_RULES.md
- permanent PRP operating rules

## Resume instructions

At the start of the next PRP session:
1. Read START_HERE.md.
2. Read ARCHIVE_GOVERNANCE.md.
3. Read CURRENT_STATE.md.
4. Read research/BREADCRUMB.md.
5. Read research/PRP_RULES.md.
6. Read research/PRP_TRACKER.csv.
7. Inspect the actual repository.
8. Find the first incomplete pedal in website order.
9. Work the next 10.
10. Recheck every new record, picture connection, tracker row, and website connection before publishing.

Do not resume from conversation memory when the repository says otherwise.

## Publishing

`.github/workflows/deploy-pages.yml` is the website's automatic publishing system.

A PRP batch is not considered live until the GitHub Pages publishing run succeeds. The current site-functionality commit is `a9573f127c35d5c9f1eb97ca7f39065874300c16`; its Pages run is currently in progress and must finish successfully before this functionality pass is considered live.

## PRP1 batch 004 checkpoint

PRP1 batch 004 covered the next ten unresolved parent records in exact catalog order, from **ADA Amps - MP-1 Channel** through **Aclam Guitars - The Woman Tone**. Exact photos were archived for NKT275 Acid Fuzz Face, Cinnamon Drive, Cinnamon Drive - Dreamer Edition, Dr. Robert, Go Rocky Go, Go Rocky Go - White Album Edition, The Mocker, The Windmiller Preamp, and The Woman Tone. Research records were added for The Mocker, The Windmiller Preamp, and The Woman Tone, and Dr. Robert was updated for the documented V3 changes. **ADA Amps - MP-1 Channel** remains the next unresolved target because no exact safe direct image file was confirmed.

## PRP1 batch 005 checkpoint

PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for ADA Amps MP-1 Channel and eight Add+ Pedals products. An exact Effects Database photo was archived for Add+ Blues Player. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.



## PRP1 batch 007 checkpoint
ADA Amps - MP-1 Channel is now fully complete after exact photo confirmation from Effects Database. The tracker, public index, and photo manifest were updated together. The next exact-order unresolved target is ADA Amps - MP-1 Channel.


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



## PRP1 batch 012 checkpoint

Batch 012 audited the next 10 incomplete PRP1 records in exact catalog order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had research records. Exact-model photo recovery was checked across the batch, but no new direct image asset met the archive standard, so the ten remain photo-pending. The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 013 checkpoint

Batch 013 audited the next 10 incomplete PRP1 records in exact catalog order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Ratortion 3**. **Add+ Pedals - Ratortion 3** received a confirmed exact-model photo from a Reverb listing, and its research record, photo manifest, public index, and tracker were synchronized. The other nine records remain photo-pending. Next exact-order unresolved target: **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 014 checkpoint

Batch 014 researched the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. New research records were added for all ten and synchronized into the photo manifest, public pedal index, and tracker. No new exact-model photo asset was safely archived during this research pass, so all ten remain picture-pending.

The next exact-order unresolved target remains **Add+ Pedals - Ratortion 3 v2** until the photo requirement is satisfied.


## PRP1 batch 015 checkpoint

Batch 015 audited the next 10 unresolved PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. Exact-model photos were recovered and synchronized for **Ratortion 3 v2, Shredder, Tube Drive Silver Edition, Boostmaster, and Geranium Fuzz**. **Super Drive, Super Drive 2, Tiger Shark, Tube Drive, and Tube Drive 2** remain photo-pending because no new safe direct exact-model image asset was confirmed during this pass.

The next exact-order unresolved target is **Add+ Pedals - Super Drive**.


## PRP1 batch 016 checkpoint

Batch 016 processed the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Super Drive** through **ADV Systems - #overdrive**. New research records were added for **Addrock Hism Scism, Addrock Not So Ol' Yeller, Addrock Ol' Yeller, ADV Systems #distortion, and ADV Systems #overdrive**. Exact photos were recovered for **Addrock Hism Scism** and **Addrock Ol' Yeller** and synchronized across the research records, photo manifest, public index, and tracker. The remaining eight records remain incomplete where no safe direct exact-model image asset was confirmed.

The next exact-order unresolved target remains **Add+ Pedals - Super Drive**.


## PRP1 batch 021 checkpoint

Batch 021 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had Pedal Info research records. The photo-recovery pass rechecked exact-model evidence across the full batch, including current/historical visual references for A.Y.A Bass Fuzz, A&M Custom Effects, AboveGroundFX, Absolutely Analog, AC Efectos, and Accel Audio. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 022 checkpoint

Batch 022 audited the next 10 incomplete PRP1 records in exact website order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Super Drive**. All ten have Pedal Info research records. Exact-model photo evidence was rechecked across the batch, including the surviving Effects Database catalog evidence for the Add+ Pedals models. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Add+ Pedals - Super Drive 2**.

## PRP1 batch 023 checkpoint

Batch 023 audited the next 10 incomplete PRP1 records in exact website order, from **Add+ Pedals - Super Drive 2** through **Advance Tube Technology - Virus Drive**. The first nine records already had Pedal Info research and were rechecked against their historical/catalog sources. **Advance Tube Technology - Virus Drive** was the only record in the batch missing its research record; a new PRP1 record was added using the surviving Advance Tube Technology manufacturer documentation and Effects Database catalog evidence. Exact-model photo evidence was rechecked across the batch, including Add+ catalog references, Addrock, ADV Systems, and Advance Tube Technology sources. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Adventure Audio - Demogorgon Fuzz**.

## PRP1 batch 024 checkpoint

Batch 024 processed the next 10 incomplete PRP1 records in exact website order, from **Adventure Audio - Demogorgon Fuzz** through **Aguilar - Storm King - Micro Bass Distortion/Fuzz**. **Adventure Audio - Demogorgon Fuzz** received a confirmed exact-model photograph from Rich Tone Music and its research record, photo manifest, public index, and tracker were synchronized, moving it to fully complete. **Aguilar - Storm King - Micro Bass Distortion/Fuzz** was the only record in the batch missing Pedal Info research; a new PRP1 record was added from Aguilar's official product documentation and supporting historical coverage. The remaining records were rechecked against their available research and exact-model visual references. No substitute, inferred image, or guessed image URL was promoted. The Storm King record remains **Picture: NEEDED / PRP Complete: NEEDED**.

The next exact-order unresolved target is **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.

## PRP1 consistency repair after batch 024

The existing **Barber Electronics - Small Fry** research record introduced by a concurrent repository update was reconciled into the canonical PRP data layer. Its research record is now linked from **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Because the exact Small Fry image was not separately archived under this catalog identity, the picture remains **NEEDED** and no photo was inferred from the Burn Unit alias.

## PRP1 consistency repair after batch 024

The Barber Electronics research records added by the concurrent **PRP1 batch 021** work were reconciled into the canonical data layer so the deployment verifier can see every research file. Ten additional Barber records were linked across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Their Pedal Info status is now **DONE**; their pictures remain **NEEDED** until an exact-model image is independently verified. This repair does not change the PRP work-order checkpoint, which remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.

## PRP1 consistency repair follow-up

The deployment verifier exposed one invalid Barber tracker link: **Small Fry Burn Unit** did not have a corresponding research file. That catalog row has been returned to **Pedal Info: NEEDED**, with no research or photo connection claimed. The nine actual Barber research files remain linked; the PRP work-order checkpoint remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 025 checkpoint

Batch 025 processed the next 10 incomplete PRP1 records in exact website order, from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Existing research for FZR912, OD85, AGRO, and Storm King was rechecked and canonical source links were synchronized. New research records were added for **Airis Effects - Solar Flare Overdrive**, **Airis Effects - The Savage Drive**, **AJ Peat - Dirty Buzzard - Overdrive**, **AJ Peat - Fat Peacock - Distortion w/ Boost**, **AJ Peat - Screaming Flamingo - Overdrive/Distortion**, and **AJcustom - Distortion**. Exact-model photos were recovered and synchronized for Solar Flare, The Savage Drive, Dirty Buzzard, Fat Peacock, and Screaming Flamingo. **AJcustom Distortion** remains photo-pending because no direct exact-model image asset was safely archived. The first four AGR/Aguilar records also remain photo-pending, so the next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 026 checkpoint

Batch 026 continued the exact-order photo-recovery pass from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Two exact-model photos were independently confirmed and promoted: the original black **Aguilar - Agro - Bass Overdrive** from Thomann UK and **Aguilar - Storm King - Micro Bass Distortion/Fuzz** from Chicago Music Exchange. **FZR912 - Muff Fuzz Deluxe** and **OD85 - Full Range Overdrive** remain photo-pending because the accessible Effects Database records show exact-model imagery, but a safe direct image asset could not be independently archived from those records. No substitute or guessed image URL was promoted. The next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 027 checkpoint

Batch 027 audited the first 10 incomplete records reported by the canonical **PRP_TRACKER.csv**, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already have Pedal Info research and their research links remain intact. Exact-model visual evidence was rechecked across the window. The A.Y.A search surfaced a current **Bass Fuzz II** listing, but that model designation is explicitly different from the base **Bass Fuzz**, so it was not promoted. Effects Database also exposes exact-model catalog imagery for records such as **AboveGroundFX - El Griton Overdrive** and **AC Efectos - Triplex Distortion**, but the accessible pages do not provide a safe direct image asset for archival promotion. No substitute or guessed image URL was promoted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**. The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.
