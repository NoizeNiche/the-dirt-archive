# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 17, 2026

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

The website uses the primary catalog plus the active scrape census files directly and does not depend on the research blocks for page rendering.

## Block 215
Batch 215 staged 350 raw records across 17 builders; 348 net new live rows remain after cleanup, moving the live alphabetic checkpoint from Empress Effects through JHS Pedals. Canonical builder IDs 494-495 were added for J. Rockett Audio Designs and Jackson Audio.

The active Scrape C census now contains **2681 company/pedal/type rows** across 290 builder identities represented in the live working layer.

## Block 216
Batch 216 added 26 builders and 591 net-new company/pedal/type rows, moving the active checkpoint from JHS Pedals through Phaez Amplification. Canonical builder IDs 496-502 were added for Katanasound, KMA Machines, Leqtique, Limetone Audio, Organic Sounds, Ovaltone, and Phaez Amplification.

## Block 218
Batch 218 continued the alphabetic scrape from Vemuram through ZVEX Effects, covering 12 builders and adding 329 net-new company/pedal/type rows. The 502-builder canonical index was expanded rather than duplicated. The active checkpoint is now after ZVEX Effects.

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

## Current PRP checkpoint

PRP is the active mission.

Work follows the actual website pedal list in exact A-to-Z order. Start with the first incomplete pedal and continue straight downward.

PRP is done in verified batches of 10 pedals, or as many as can be responsibly completed in one pass. Each pedal receives its own individual research record.

A pedal is only checked off when it has both pedal information and a confirmed picture of that exact pedal/version.

Current numbers:
- 3,821 unique pedals
- 114 researched
- 88 confirmed pictures
- 88 fully complete
- 3,733 remaining incomplete
- 26 researched but waiting only for a picture

Current position:
- Latest research record: research/pedals/Abominable Electronics/Hail Satan Deluxe.md
- Next pedal: Abominable Electronics - Hellmouth

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

.github/workflows/deploy-pages.yml is the website's automatic publishing system.

A PRP batch is not considered live until the GitHub Pages publishing run succeeds.

