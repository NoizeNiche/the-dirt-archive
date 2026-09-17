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
- Blocks 162-163 are now consolidated into `research/SCRAPE_B_CENSUS.csv`

Current Builder -> Pedals research checkpoint:
- **290 canonical builder identities are in the master index through Block 163**
- **Block 161 added 9 new canonical identities, Block 162 added 9, and Block 163 added 5**
- **Broughton Audio and Browne Amplification were expanded under their existing canonical identities**
- **161 live research blocks** are now present: Blocks 001-069, 071-141, and 143-163
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
Scrape B now reaches the end of the currently identified B-section builder list through BZZT Electronics. New B-section discoveries can be appended later if stronger evidence surfaces. Otherwise move the alphabetical company -> pedal research to the C-section.