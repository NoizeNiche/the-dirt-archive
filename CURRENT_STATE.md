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
- `research/SCRAPE_C_CENSUS.csv`

Active scrape censuses are live website inputs. Newly verified builders and pedals should appear on the site as soon as their scrape census is updated, rather than waiting for a later master-census consolidation.

Multiple rows can represent one pedal when the cataloged pedal belongs to more than one dirt type.

The canonical builder sequence now reaches **399 identities through Block 181**. Scrape C Block 167 established **12 additional verified canonical builder identities, 306-317**, covering Ceriatone through Cusack Music. Block 168 added **canonical builder 318, CUVAVE / M-VAVE**, resolving the previously deferred Cuvave identity with current manufacturer evidence. Block 169 added **canonical builder 319, COG Effects**, as an alphabetic backfill for a missed C-section builder. Block 170 added **9 canonical builder identities, 320-328**, as a further C-section backfill. Block 171 added **10 canonical builder identities, 329-338**, covering Cave Pedals through Crews Maniac Sound. Block 172 adds **6 canonical builder identities, 339-344**, covering Cameltone Electronics through Cathouse Pedals. Block 173 added **7 canonical builder identities, 345-351**, covering Caveman Audio / Skrydstrup through Critter Electronics; Cat's Eye ESP was already canonical as ID 342 and was expanded rather than duplicated. Block 174 added **14 canonical builder identities, 352-365**, covering Carlin through Chuck Pedals. Block 175 added **7 canonical builder identities, 366-372**, covering Citadel Electronics through Couch Electronics. Block 176 added **5 canonical builder identities, 373-377**, covering CAST Engineering through Cryptid Effects. Block 177 added **5 canonical builder identities, 378-382**, covering Coolsound through Crust Pedals. Block 178 added **5 canonical builder identities, 383-387**, covering Classic Audio Effects through Custom Analog Pedals. Block 179 added **3 canonical builder identities, 388-390**, covering Circuitous FX, Circus Freak Music, and Cosmic Terror, while expanding existing Citadel Electronics (ID 366) with Vector. Block 180 added **5 canonical builder identities, 391-395**, covering Celmo, Coopersonic, Copper Gear, CostaLab, and Charlie Paolo Custom Effects. Block 181 adds **4 canonical builder identities, 396-399**, covering Ciclar, Claybridge Sound Systems / Claybridge Audio, Clark Amplification, and Compulsive Audio. Existing builders continue to be expanded under their existing identities rather than duplicated.

Block 164 contributed **90 company/pedal/type rows**. Block 165 contributed **17 verified company/pedal/type rows**. Block 166 contributed **21 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 167 contributed **45 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 168 contributed **8 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 169 contributed **12 verified company/pedal/type rows**, which are consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 170 contributed **23 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 171 contributed **51 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 172 contributes **15 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 173 contributed **36 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 174 contributed **51 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 175 contributed **25 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 176 contributed **13 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 177 contributed **14 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 178 contributed **9 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 179 contributed **14 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 180 contributed **44 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 181 contributes **12 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`.

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
Continue Scrape C by checking the remaining C-section candidates and alphabetic backfills. The canonical builder index is reconciled through Block 181, and the C-section working census remains in `research/SCRAPE_C_CENSUS.csv` until later consolidation.
