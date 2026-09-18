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

- Unique pedals in website catalog: 3,821
- Pedals with research information: 159
- Pedals with confirmed pictures: 135
- Fully complete PRP pedals: 135
- Remaining incomplete pedals: 3686
- Researched but waiting only for a confirmed picture: 25
- Current PRP1 target: **Acid Fuzz - Mk1.5**

PRP1 batch 003 covered ten unresolved parent records in exact website order, from AC Noises - Urla through Aclam Guitars - Go Rocky Go. One exact model photo was added for Acid Fuzz - Italian Fuzz from the builder's documented Vintage Series example. Unverified photo candidates remain unfilled rather than using substitutions.

The current photo-recovery queue remains open for earlier researched pedals without exact confirmed pictures. The next unresolved target remains **Acid Fuzz - Mk1.5**.