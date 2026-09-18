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
`index.html` is the working public catalog page.

It currently provides:
- Company list
- Company filtering
- Pedal list
- Company/pedal search
- Pedal detail view
- Pedal Info area
- Photo of Pedal area
- Desktop and mobile layouts

`.github/workflows/deploy-pages.yml` is the only website automation. The previous automatic census-rewrite and research-export workflows were removed so website changes do not cause the catalog to be rewritten behind the scenes.

## Data rule
Every new company gets stored in the catalog.

Every pedal that company makes gets stored under that company.

Every pedal record can then receive its information and photo.

Do not build extra website relationships, evidence systems, confidence systems, lead systems, or other tracking layers unless the project explicitly changes direction.

## Next action
Continue Scrape C alphabetically after **ZVEX Effects**. Reuse canonical builder identities when a builder already exists; new builders receive the next unused ID. Keep the active Scrape C census in `research/SCRAPE_C_CENSUS.csv` until later consolidation.
