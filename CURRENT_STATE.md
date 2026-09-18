# The Dirt Archive - Current State

## Repository
`NoizeNiche/the-dirt-archive`

Default branch: `main`

## What the project is
The site is a simple guitar-pedal catalog with one purpose:

**Company -> Pedal -> Pedal Info -> Photo**

That is the product structure. Nothing else is part of the website's job right now.

## Landing page navigation

The landing page uses a compact library layout:
**Search → Dirt Type → Builder → Pedal**.

The search field lives at the top of the left-hand navigation panel, above the builder menu, so someone looking for a specific pedal can search immediately.

The dirt menu has **All Pedals / Overdrive / Distortion / Fuzz**. Choosing a dirt type changes the builder list to builders carrying that type. Builders remain alphabetical in a scrollable panel. Clicking a builder changes the main pedal area on the right.

Pedal cards open pedal-detail.html with the builder and pedal passed in the URL; pedal.html remains only as a redirect for older links, giving every cataloged pedal an individual page.

## Faceted filter design

The left-hand archive navigation is intended to work as a **progressive, faceted filter system** rather than a single-choice menu.

A visitor may combine clues such as:
- search text
- dirt type
- builder
- transistor type
- diode type
- other deliberately supported metadata filters

All selected filters narrow the same result set in the main pedal area. Search and filters must work together rather than behaving as separate modes.

Filter options should be presented with useful result counts where practical, so visitors can see how much each choice narrows the archive before clicking.

The core use case is a visitor remembering incomplete information about a pedal and using several clues to rediscover it.

After the Builder -> Pedals census is complete through Z, the project enters the Pedal Research Phase (PRP).

PRP is now worked in verified batches of 10 pedals, or as many as can be responsibly completed in one pass. Each pedal still receives its own individual research record.

PRP always follows the actual pedal order shown on the live website. Start at the first incomplete pedal and move straight down the list in A-to-Z order. Do not jump ahead because a later builder is easier to research.

Each PRP research record covers, when evidence exists:
- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- Transistor
- Diode
- Sound

The sound section should normally be 2-3 sentences.

Do not guess technical details. When exact transistor or diode information is not publicly documented, say so plainly. Keep factory-production facts separate from DIY builds, clones, mods, and forum experiments.

A pedal is PRP Complete only when both of these are present:
1. Pedal information
2. A confirmed picture of that exact pedal/version

If the exact picture cannot be confirmed, the tracker remains incomplete and the website shows No Photo Archived.

Do not show Research confidence, Photo, or Sources checked sections on public individual pedal pages.

The permanent individual-pedal layout benchmark is the current DRV page:
- archive navigation on the left
- Archive Home
- search
- Dirt Type choices
- scrollable alphabetical builder list
- pedal name and builder
- main pedal information
- dedicated 3:4 photo area
- No Photo Archived when needed
- clean desktop and mobile behavior

The PRP tracker is the source of truth for completion counts. research/PRP_TRACKER.csv contains one row per unique Builder + Pedal combination.

The website's single pedal lookup file is research/PEDAL_INDEX.json. Picture and research connections are stored in research/pedals/PEDAL_IMAGES.json.

Before publishing a batch:
- verify every new research file exists
- verify every picture connection
- verify tracker status against the actual files
- verify there are no broken research links
- verify there are no duplicate Builder + Pedal tracker rows
- recalculate researched, pictured, complete, and remaining totals
- update the durable project notes
- publish through GitHub Pages
- confirm the publishing run succeeds

Current PRP checkpoint:
- Unique pedals in website catalog: 3,821
- Pedals with research information: 114
- Pedals with confirmed pictures: 88
- Fully complete PRP pedals: 88
- Remaining incomplete pedals: 3,733
- Researched but waiting only for a picture: 26
- Next PRP target: Abominable Electronics - Hellmouth

The next session must read research/PRP_RULES.md, CURRENT_STATE.md, research/BREADCRUMB.md, and research/PRP_TRACKER.csv before continuing.

## Final builder discovery checkpoint

Blocks 219-224 comprise the final A-Z sweep plus five deeper discovery passes. They added **84 builders in total after the original 502 checkpoint**, taking the canonical index to **586**, and added **259 company/pedal/type rows** to the active Scrape C layer. The Pedal Research Phase can now continue in verified 10-pedal batches.

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

## PRP progress checklist

The website currently contains **3,821 unique pedals**.

Current PRP progress:
- **114** have pedal information researched.
- **88** have a confirmed pedal picture.
- **88** are fully checked off because they have **both**.
- **3,733** still need a complete PRP entry.
- **26** are researched but currently waiting only for a confirmed picture.

The complete checklist is stored in:
- research/PRP_TRACKER.csv

A pedal is marked **PRP Complete** only when both the pedal information and the picture are present.

## Data rule from here forward
When a new company is researched, store the company.

When a new pedal is found, store that pedal under the company.

When pedal information is added, store it with that pedal.

When a pedal photo is added, store it with that pedal.

The PRP tracker is the one explicit exception: it exists only to show which cataloged pedals have both required PRP inputs.

## Hosting
`.github/workflows/deploy-pages.yml` is the only website automation. It is responsible for publishing the static site through GitHub Pages.

## Historical research
The repository's builder research and master builder index are retained as working material, but they are not part of the public site's information architecture.

## Research benchmark

The performance of the latest bulk scrape is the **minimum operating benchmark for every future scrape through Z**.

That benchmark means:
- do not stop at the first useful result or first few companies
- use broad, repeated searches and multiple relevant source/catalog channels when needed
- target **10+ distinct companies/builders per haul** and gather as many qualifying dirt-pedal records as practical
- mine both current and historical product catalogs when they support the Builder -> Pedals scope
- cross-check the canonical builder index and active scrape census before every write
- when a source or tool limits the amount of research that can be returned at once, split the work into additional passes rather than lowering the research standard
- treat duplicate checks, alias reconciliation, and product-family cleanup as part of the scrape itself
- do not declare the haul complete merely because the minimum company count has been reached; continue while meaningful unprocessed material is readily available
- leave the repository in a state where the next alphabetic haul can begin immediately

**The standard is throughput + breadth + deduplication + durable checkpointing.**

## Scrape protocol now in force
Every **Scrape** or **Continue** command means a full bulk haul of **at least 10 distinct companies/builders**, with as many qualifying dirt-pedal rows as practical. Continue from the saved alphabetic checkpoint, deduplicate against the canonical builder index and active scrape census, update the live scrape data and durable checkpoints, and keep moving until Z. Ten companies is a hard minimum, not a stopping target.

## Next action
The next PRP target is **Abominable Electronics — Hellmouth**, followed by the next nine unresearched pedals in the site’s A-to-Z order.
