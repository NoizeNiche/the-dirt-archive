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
- **Block 162 adds 111 additional company/pedal/type rows** in `research/SCRAPE_B_BLOCK_162_ADDENDUM.csv`, pending consolidation into the primary census

Current Builder -> Pedals research checkpoint:
- **285 canonical builder identities are in the master index through Block 162**
- **Block 161 added 9 new canonical identities and Block 162 added 9 new canonical identities**
- **Browne Amplification was expanded under its existing canonical identity (ID 113)**
- **160 live research blocks** are now present: Blocks 001-069, 071-141, and 143-162
- Block 070 is absent; Block 142 was removed as a duplicate

The website uses the primary catalog directly and does not depend on the research blocks for page rendering. The Block 162 addendum is research bookkeeping until its rows are consolidated into the primary scrape census.

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
Consolidate the Block 162 census addendum into `research/SCRAPE_B_CENSUS.csv`, then continue the Scrape B company -> pedal collection alphabetically after Byron Amplification. Reuse canonical builder identities when a builder already exists; new builders receive the next unused ID.
