# The Dirt Archive - Research Breadcrumb

## Checkpoint
September 17, 2026

## Active mission
**Company -> Pedal -> Pedal Info -> Photo**

That is the website's entire information structure. Keep collecting companies and the pedals they make, then add pedal information and pedal photos to those records.

## Current catalog
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated pedal catalog currently used by the website.

Current checkpoint:
- **2,466 company/pedal/type rows**
- **103 companies** currently represented by pedal entries
- **140 live research block files** remain in the repository as working material
- The website uses the catalog directly and does not depend on the research blocks for page rendering

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
Continue the company -> pedal collection. Compare new work against the existing catalog so we add missing companies and pedals instead of creating duplicate records.
