# The Dirt Archive - Current State

## Repository
`NoizeNiche/the-dirt-archive`

Default branch: `main`

## What the project is
The site is a simple guitar-pedal catalog with one purpose:

**Company -> Pedal -> Pedal Info -> Photo**

That is the product structure. Nothing else is part of the website's job right now.

## Catalog data
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated primary pedal catalog.

The website currently loads the catalog plus the active scrape census files:
- `research/MASTER_PEDAL_CENSUS.csv`
- `research/SCRAPE_A_CENSUS.csv`
- `research/SCRAPE_B_CENSUS.csv`

Multiple rows can represent one pedal when the cataloged pedal belongs to more than one dirt type.

The canonical builder sequence now reaches **338 identities through Block 171**, with the master index requiring its next consolidation pass. Scrape C Block 167 established **12 additional verified canonical builder identities, 306-317**, covering Ceriatone through Cusack Music. Block 168 added **canonical builder 318, CUVAVE / M-VAVE**, resolving the previously deferred Cuvave identity with current manufacturer evidence. Block 169 added **canonical builder 319, COG Effects**, as an alphabetic backfill for a missed C-section builder. Block 170 added **9 canonical builder identities, 320-328**, as a further C-section backfill. Block 171 adds **10 canonical builder identities, 329-338**, covering Cave Pedals through Crews Maniac Sound. Existing builders continue to be expanded under their existing identities rather than duplicated.

Block 164 contributed **90 company/pedal/type rows**. Block 165 contributed **17 verified company/pedal/type rows**. Block 166 contributed **21 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 167 contributed **45 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 168 contributed **8 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 169 contributed **12 verified company/pedal/type rows**, which are consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 170 contributed **23 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 171 contributed **51 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`.

The primary `research/MASTER_PEDAL_CENSUS.csv` remains at its prior consolidated checkpoint of **2,466 company/pedal/type rows across 103 companies**. The master catalog is intentionally separate from the active Scrape B and C working censuses until a later consolidation step.

## Website
`index.html` is now the actual catalog page, not an under-construction placeholder.

The page:
- loads the catalog CSV sources
- lists companies alphabetically
- shows each company's pedals
- searches companies and pedals
- groups repeated company/pedal rows into one pedal card
- shows the pedal's dirt type in the record
- opens a pedal detail view with dedicated **Pedal Info** and **Photo of Pedal** areas
- works on desktop and mobile layouts

## Data rule from here forward
When a new company is researched, store the company.

When a new pedal is found, store that pedal under the company.

When pedal information is added, store it with that pedal.

When a pedal photo is added, store it with that pedal.

Do not create additional website relationships or tracking systems unless the project explicitly asks for them.

## Hosting
`.github/workflows/deploy-pages.yml` is the only website automation. It is responsible for publishing the static site through GitHub Pages.

## Historical research
The repository's builder research and master builder index are retained as working material, but they are not part of the public site's information architecture.

## Next action
Reconcile the Block 171 canonical identities 329-338 into `research/BUILDER_MASTER_INDEX.md`, then continue Scrape C by checking the remaining C-section candidates and alphabetic backfills. Keep the C-section working census in `research/SCRAPE_C_CENSUS.csv` until later consolidation.
