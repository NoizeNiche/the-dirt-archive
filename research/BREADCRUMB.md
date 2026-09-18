# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 17, 2026

## Active mission
**Company -> Pedal -> Pedal Info -> Photo**

That is the website's entire information structure. Keep collecting companies and the pedals they make, then add pedal information and pedal photos to those records.

## Current catalog
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated pedal catalog currently used by the website.

Current master-catalog checkpoint:
- **2,470 company/pedal/type rows** are currently consolidated in the primary census
- **105 companies** are currently represented by pedal entries
- Block 162 contributed **111 rows** to the Scrape B census
- Block 163 contributed **16 rows** to the Scrape B census
- Blocks 164-210 are stored in the active Scrape C census
- Blocks 162-163 are consolidated into `research/SCRAPE_B_CENSUS.csv`
- Block 164 is stored in `research/SCRAPE_C_CENSUS.csv`

Current Builder -> Pedals research checkpoint:
- **491 canonical builder identities are in the master index through Block 211**
- **Block 161 added 9 new canonical identities, Block 162 added 9, Block 163 added 5, and Block 164 added 10**
- Existing builders are expanded under their existing canonical identities rather than duplicated
- **164 live research blocks** are now present: Blocks 001-069, 071-141, and 143-211
- Block 070 is absent; Block 142 was removed as a duplicate

The website uses the primary catalog plus the active scrape census files directly and does not depend on the research blocks for page rendering.

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
Continue Scrape C through the remaining C-section candidates and alphabetic backfills. Reuse canonical builder identities when a builder already exists; new builders receive the next unused ID. Keep the C-section working census in `research/SCRAPE_C_CENSUS.csv` until a later consolidation step.
