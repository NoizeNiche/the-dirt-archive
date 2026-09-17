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

The canonical builder index now contains **300 canonical builder identities** through Block 164. **Block 161 added nine new builder identities, Block 162 added nine, Block 163 added five, and Block 164 added ten; all are now merged into the canonical builder index.** Existing builders are expanded under their existing identities rather than duplicated.

Block 162 contributed **111 company/pedal/type rows**, Block 163 contributed **16 company/pedal/type rows**, and Block 164 contributed **90 company/pedal/type rows** to their respective active scrape censuses. Blocks 162-163 are consolidated into `research/SCRAPE_B_CENSUS.csv`. Block 164 is stored in the new `research/SCRAPE_C_CENSUS.csv` working census.

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
Continue Scrape C alphabetically after Camuro. Reuse canonical builder identities when a builder already exists; new builders receive the next unused ID. Keep the C-section working census in `research/SCRAPE_C_CENSUS.csv` until a later consolidation step.
