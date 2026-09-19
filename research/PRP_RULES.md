# The Dirt Archive - Pedal Research Phase Rules

This file is the permanent operating guide for PRP.

## 1. What PRP is

PRP means Pedal Research Phase.

The goal is to turn every cataloged pedal into a useful reference while keeping the site's simple structure:

Builder -> Pedal -> Pedal Info -> Photo

PRP works from the actual pedal list on the website, in the same order the visitor sees it.

## 2. Work order

Work strictly from the top of the site's pedal list to the bottom.

- Start with the first pedal that is not fully complete.
- Continue downward in exact A-to-Z catalog order.
- Do not jump ahead to another builder just because a later pedal is easier to research.
- The permanent next target must be written in CURRENT_STATE.md and research/BREADCRUMB.md.

The PRP tracker is the source of truth for where the work stands.

## 2A. Model / version / variation handling

PRP follows the **public catalog entries**, not every raw Builder + Pedal census row.

- A normal model or materially distinct public version is a PRP target.
- A record with catalog_role = variation is a subordinate variation and is **not** an independent main-catalog PRP target.
- Cosmetic variations such as colorways, retailer finishes, event artwork, and similar editions should be documented under their parent model/version.
- A materially different version such as V2 may remain a separate public page and its own PRP target.
- Existing variation records must not be promoted into separate public cards simply because they exist as separate raw catalog rows.

## 3. Batch size

PRP is performed in batches of 10 pedals, or as many as can be responsibly completed in one pass.

Each pedal still receives its own individual research record.

The normal cycle is:

Research 10 -> attach/verify pictures -> update tracker -> verify entire batch -> publish -> move to next 10

Do not stop at one pedal unless the batch genuinely cannot continue.

## 4. What makes a pedal complete

A pedal is PRP Complete only when both are present:

1. Pedal information
2. A confirmed picture of that exact pedal/version

Research by itself does not check the pedal off.

A pedal with research but no confirmed picture stays incomplete.

A pedal with a picture but no research stays incomplete.

## 5. Picture rules

Use a picture only when it can reasonably be tied to the exact cataloged pedal.

Prefer:
- builder/manufacturer photographs
- official product pages
- reliable historical product listings
- reliable archived retailer listings when the exact model is clear

Do not substitute:
- a different pedal
- a different version when the difference matters
- a clone
- a random seller photograph with unclear identity

When no reliable picture can be confirmed, leave the picture blank in the tracking system. The website must show No Photo Archived.

## 6. Research fields

Each PRP research record should cover, when evidence exists:

- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- Transistor
- Diode
- Sound

The sound description should normally be 2-3 sentences.

Do not invent a version, component type, or production change because a source is vague.

When exact transistor or diode information is not publicly documented, say so plainly.

Keep factory production facts separate from DIY builds, clones, mods, and forum experiments.

## 7. Information that does not belong on the public pedal page

Do not show these sections on the public individual pedal pages:

- Research confidence
- Photo
- Sources checked

The public page should present the useful pedal information and picture without research-administration clutter.

Reference links may still be kept internally when useful for future rechecking.

## 8. The standard individual pedal page

Every individual pedal page uses the same layout benchmark established by the current DRV page:

- permanent archive navigation on the left
- Archive Home link
- search field
- Dirt Type choices
- scrollable alphabetical builder list
- pedal name and builder
- pedal information as the main content
- dedicated photo area
- photo area sized for a 3:4 image
- No Photo Archived when an exact picture is unavailable
- clean desktop and mobile behavior

Do not create a different page layout for individual pedals.

## 9. Progress tracking

research/PRP_TRACKER.csv contains one row for every unique pedal in the live website catalog.

Required status fields are:
- Pedal Info: DONE / NEEDED
- Picture: DONE / NEEDED
- PRP Complete: DONE / NEEDED

The tracker must contain one row per unique Builder + Pedal combination.

Before publishing a PRP batch:
- verify every new research record exists
- verify every new picture connection
- verify the tracker agrees with the actual records
- verify there are no broken research links
- verify there are no duplicate Builder + Pedal tracker rows
- update the total researched, photographed, complete, and remaining counts

Progress should be reported periodically using the tracker numbers.

## 10. Site data rules

The live website catalog is the master list for PRP order.

research/PEDAL_INDEX.json is the site's single pedal lookup file.

research/pedals/PEDAL_IMAGES.json stores picture and research-record connections.

research/PRP_TRACKER.csv stores PRP completion status.

Keep these in sync.

Do not make the old CSV-loading arrangement the required source for individual pedal pages. The individual pedal page should use PEDAL_INDEX.json.

## 11. Publishing rules

After a coherent PRP batch:
1. update the research records
2. update picture connections
3. update PEDAL_INDEX.json
4. update PRP_TRACKER.csv
5. update CURRENT_STATE.md
6. update research/BREADCRUMB.md
7. update website version numbers together
8. verify the repository
9. publish through GitHub Pages
10. confirm the publishing run succeeds before calling the batch live

Never claim a batch is live solely because files exist in GitHub.

## 12. Resume rule

When a new session starts, do not trust conversation memory for PRP position.

Read:
1. START_HERE.md
2. ARCHIVE_GOVERNANCE.md
3. CURRENT_STATE.md
4. research/BREADCRUMB.md
5. research/PRP_RULES.md
6. research/PRP_TRACKER.csv

Then inspect the actual repository and take the first incomplete pedal in website order.

## 13. Current checkpoint

## Current PRP checkpoint

- Unique pedals in website catalog: 3,821
- Pedals with research information: 220
- Pedals with confirmed pictures: 162
- Fully complete PRP pedals: 162
- Remaining incomplete pedals: 3659
- Researched but waiting only for a confirmed picture: 58
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **A.Y.A - Bass Fuzz**

## PRP1 batch 030 checkpoint

Batch 030 rechecked the exact first unresolved target, **A.Y.A - Bass Fuzz**. A fresh image search visually confirmed the original blue-sparkle A.Y.A tokyo japan BASS FUZZ enclosure from the 2024 Mercari listing, including the Fuzz/Vol layout and BASS FUZZ labeling. The source page currently returns 404 and no stable directly retrievable image asset was exposed, so the image remains unarchived and the public card must continue to show **No Photo Archived**. Current BASS FUZZ II listings remain a different model/version and are not substituted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for **ADA Amps - MP-1 Channel** and eight **Add+ Pedals** products. An exact Effects Database photo was archived for **Add+ Pedals - Blues Player**. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.


## Latest checkpoint
PRP1 batch 007 completed ADA Amps - MP-1 Channel after confirming an exact Effects Database photograph. Next target: ADA Amps - MP-1 Channel.


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
Batch 012 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had research records. Exact-model photo recovery was checked across the batch, but no new direct image asset met the exact-photo standard. All ten remain Picture: NEEDED and PRP Complete: NEEDED. Next target: **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 013 checkpoint
Batch 013 audited the next 10 incomplete PRP1 records in exact website order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Ratortion 3**. One exact-model photo was recovered for **Add+ Pedals - Ratortion 3** from a Reverb listing and synchronized across the research record, photo manifest, public index, and tracker. The other nine remain photo-pending. Next target: **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 014 checkpoint
Batch 014 researched the next 10 incomplete PRP1 records in exact website order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. New research records were added for all ten and synchronized across the research manifest, public index, and tracker. No new exact-model photo asset was safely archived in this pass, so all ten remain Picture: NEEDED and PRP Complete: NEEDED. Next target: **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 015 checkpoint

Batch 015 audited the next 10 unresolved PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. Exact-model photos were recovered and synchronized for **Ratortion 3 v2, Shredder, Tube Drive Silver Edition, Boostmaster, and Geranium Fuzz**. **Super Drive, Super Drive 2, Tiger Shark, Tube Drive, and Tube Drive 2** remain photo-pending because no new safe direct exact-model image asset was confirmed during this pass.

The next exact-order unresolved target is **Add+ Pedals - Super Drive**.


## PRP1 batch 016 checkpoint

Batch 016 processed the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Super Drive** through **ADV Systems - #overdrive**. New research records were added for **Addrock Hism Scism, Addrock Not So Ol' Yeller, Addrock Ol' Yeller, ADV Systems #distortion, and ADV Systems #overdrive**. Exact photos were recovered for **Addrock Hism Scism** and **Addrock Ol' Yeller** and synchronized across the research records, photo manifest, public index, and tracker. The remaining eight records remain incomplete where no safe direct exact-model image asset was confirmed.

The next exact-order unresolved target remains **Add+ Pedals - Super Drive**.


## PRP1 batch 021 checkpoint

Batch 021 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had Pedal Info research records. The photo-recovery pass rechecked exact-model evidence across the full batch. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

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


## PRP1 batch 028 checkpoint

Batch 028 continued the photo-recovery pass on the first unresolved catalog target, **A.Y.A - Bass Fuzz**. A fresh 2024 Mercari listing was found showing the original **A.Y.A tokyo japan BASS FUZZ**, and independent older Japanese references identify the model as a limited 30-unit fuzz. The accessible eBay listings currently circulating are explicitly for **BASS FUZZ II**, so they were not substituted for the base model. The exact original-model visual evidence is now documented in the research record, but a stable direct image asset could not be safely archived from the available sources. **Picture remains NEEDED / PRP Complete remains NEEDED.** The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 029 checkpoint

The first incomplete catalog record remains **A.Y.A - Bass Fuzz**. The September 18, 2026 photo-recovery pass re-confirmed an exact original-model photograph via a 2024 Mercari listing, but the accessible listing does not provide a stable directly retrievable image asset. Current BASS FUZZ II listings remain explicitly a different model/version and are not used as a substitute. The tracker remains **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture.

## PRP1 batch 032 checkpoint

The photo-recovery pass broadened the search for **A.Y.A - Bass Fuzz** to exact-title image indexing and additional independent Japanese references. The original blue-sparkle Bass Fuzz photograph was re-confirmed visually, but the underlying Mercari item is unavailable to the crawler and no stable direct image asset was exposed. The current **BASS FUZZ II** listings are explicitly a different version and remain excluded. **Picture remains NEEDED / PRP Complete remains NEEDED.** Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 033 checkpoint

Batch 033 refined the existing **A.Y.A - Bass Fuzz** research record using the original owner's firsthand account. His unit is identified as number 20 of the 30-unit run, and his notes describe a gritty but controlled bass fuzz that retains the instrument's core, projects strongly in a band mix, and has relatively little sustain. No new stable archival image asset was found, so **Picture remains NEEDED / PRP Complete remains NEEDED**. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 034 checkpoint

Batch 034 widened the photo-recovery window to the first 10 incomplete tracker records, beginning with **A.Y.A - Bass Fuzz** and continuing through **Accel Audio - OD-SS Express Overdrive**. The original A.Y.A Bass Fuzz image was re-confirmed visually, but its source remains unavailable for stable direct retrieval. The remaining nine records were also rechecked across exact-model web/image searches; available hits remain catalog pages or dynamic marketplace/affiliate listings without a safe archival image asset. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 035 checkpoint

Batch 035 widened the direct-image hunt across the current unresolved window using builder-domain searches, Effects Database records, historical resale sources, and exact-name image indexing. **A.Y.A - Bass Fuzz** remains visually confirmed by the indexed original-model photograph, but no stable direct asset is exposed. The following unresolved records likewise produced catalog imagery or source pages without a safe direct image file. No picture status changed. **Counts remain 3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for a picture. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 036 checkpoint

Batch 036 widened the exact-model photo-recovery window across the first 10 incomplete tracker records in website order: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The exact-model sources were rechecked using Effects Database records, historical/source listings, builder references, and current image indexing. The A.Y.A base-model image remains visually confirmed but is not available as a stable direct archival asset; the current BASS FUZZ II listing remains excluded as a different version. Effects Database imagery was also confirmed for several records in the window, but the accessible image material does not expose a stable direct file suitable for archival promotion under the project's photo rules. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 037 checkpoint

Batch 037 repeated the exact-order photo-recovery window across the first 10 incomplete tracker records: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The search was broadened to current web indexing, historical catalog material, builder-domain references, resale listings, and Effects Database records. Effects Database continues to expose exact product identities for the A&M, AboveGroundFX, AC Efectos, and Accel records, while the current A.Y.A resale result remains explicitly **BASS FUZZ II**, a different model/version. No newly discovered source exposed a stable direct exact-model image asset that met the archive's photo requirement. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.