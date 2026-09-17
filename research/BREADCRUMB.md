# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 17, 2026

## Active mission
**Company -> Pedal -> Pedal Info -> Photo**

That is the website's entire information structure. Keep collecting companies and the pedals they make, then add pedal information and pedal photos to those records.

## Current catalog
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated pedal catalog currently used by the website.

Current master-catalog checkpoint:
- **2,466 company/pedal/type rows**
- **103 companies** currently represented by pedal entries

Current Builder -> Pedals research checkpoint:
- **267 canonical builder identities are in the master index through Block 160**
- **Block 161 adds 9 new builder identities, pending master-index insertion**
- **158 prior live research blocks are indexed, with Block 161 now added as the newest working block**
- Blocks 001-069, 071-141, and 143-161 are present
- Block 070 is absent; Block 142 was removed as a duplicate

The website uses the catalog directly and does not depend on the research blocks for page rendering.

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
Continue the Scrape B company -> pedal collection alphabetically after Broughton Audio. Before adding another builder, insert the nine Block 161 builders into the canonical builder index so future passes do not create duplicate identities.
