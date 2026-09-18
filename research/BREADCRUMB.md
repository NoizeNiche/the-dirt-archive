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
- Pedals with research information: 168
- Pedals with confirmed pictures: 138
- Fully complete PRP pedals: 138
- Remaining incomplete pedals: 3683
- Researched but waiting only for a confirmed picture: 31
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **ADA Amps - MP-1 Channel**

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
