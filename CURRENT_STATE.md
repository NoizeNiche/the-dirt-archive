# The Dirt Archive - Current State

## Repository
`NoizeNiche/the-dirt-archive`

Default branch: `main`

## What the project is
The site is a simple guitar-pedal catalog with one purpose:

**Company -> Pedal -> Pedal Info -> Photo**

That is the product structure. Nothing else is part of the website's job right now.

## Catalog data
`research/MASTER_PEDAL_CENSUS.csv` is the current accumulated pedal catalog used by the website.

The working catalog currently contains **2,466 company/pedal/type rows covering 103 companies with dirt-pedal entries**. Multiple rows can represent one pedal when the cataloged pedal belongs to more than one dirt type.

The current research blocks remain historical working material. They are not a second website database.

## Website
`index.html` is now the actual catalog page, not an under-construction placeholder.

The page:
- loads the master catalog
- lists companies alphabetically
- shows each company's pedals
- searches companies and pedals
- groups repeated company/pedal rows into one pedal card
- shows the pedal's dirt type in the record
- opens a pedal detail view with dedicated **Pedal Info** and **Photo of Pedal** areas
- works on desktop and mobile layouts

The website reads the catalog directly from `research/MASTER_PEDAL_CENSUS.csv`.

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
Continue adding companies and pedals to the catalog. Keep the website focused on the four things that matter: **Company, Pedal, Pedal Info, Photo**.
