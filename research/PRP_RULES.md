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
- Pedals with research information: 195
- Pedals with confirmed pictures: 149
- Fully complete PRP pedals: 149
- Remaining incomplete pedals: 3672
- Researched but waiting only for a confirmed picture: 46
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **Adventure Audio - Demogorgon Fuzz**

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
