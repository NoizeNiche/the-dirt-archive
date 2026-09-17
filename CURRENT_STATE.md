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

The website currently loads the master catalog plus the active scrape census files:
- `research/MASTER_PEDAL_CENSUS.csv`
- `research/SCRAPE_A_CENSUS.csv`
- `research/SCRAPE_B_CENSUS.csv`

Multiple rows can represent one pedal when the cataloged pedal belongs to more than one dirt type.

The canonical builder index now contains **285 canonical builder identities** through Block 162. **Block 161 added nine new builder identities and Block 162 added nine new builder identities; all are now merged into the canonical builder index.** Browne Amplification, an existing builder, was expanded under its existing identity. The research block set now runs through **Block 162**.

Block 162 adds **111 company/pedal/type rows** in `research/SCRAPE_B_BLOCK_162_ADDENDUM.csv`. The primary `research/SCRAPE_B_CENSUS.csv` and `research/MASTER_PEDAL_CENSUS.csv` have not yet been rewritten to merge those 111 rows; the addendum is the authoritative Block 162 delta until that consolidation is performed.

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
Consolidate the Block 162 census addendum into `research/SCRAPE_B_CENSUS.csv` and then continue the Scrape B company -> pedal collection alphabetically after Byron Amplification. Reuse canonical builder identities when a builder already exists; new builders receive the next unused ID.
