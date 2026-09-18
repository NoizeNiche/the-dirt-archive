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
- Pedals with research information: 202
- Pedals with confirmed pictures: 154
- Fully complete PRP pedals: 154
- Remaining incomplete pedals: 3667
- Researched but waiting only for a confirmed picture: 48
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **Adventure Audio - Demogorgon Fuzz**

PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for **ADA Amps - MP-1 Channel** and eight **Add+ Pedals** products. An exact Effects Database photo was archived for **Add+ Pedals - Blues Player**. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.

The next session must read research/PRP_RULES.md, CURRENT_STATE.md, research/BREADCRUMB.md, and research/PRP_TRACKER.csv before continuing.

## PRP1 batch 011 checkpoint
Batch 011 expanded the photo-recovery sweep through the next 20 unresolved catalog records, from **A.Y.A - Bass Fuzz** through **Add+ Pedals - Ratortion 2**. An exact direct image asset was confirmed for **AC Noises - Urla** from Stars Music and connected to the research record, photo manifest, public index, and tracker. **A.Y.A - Bass Fuzz** received stronger historical and exact-model visual evidence, but no direct image asset was safely archived, so it remains photo-pending.
The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.

## Final builder discovery checkpoint

Blocks 219-224 comprise the final A-Z sweep plus five deeper discovery passes. They added **84 builders in total after the original 502 checkpoint**, taking the canonical index to **586**, and added **259 company/pedal/type rows** to the active Scrape C layer. The Pedal Research Phase can now continue in verified 10-pedal batches.

## Change-safety rule

Major visual changes are now treated as **UI-only unless explicitly approved otherwise**. Before publishing a major visual pass:
- preserve the existing data-loading and catalog logic
- verify the known researched pedal smoke-test record still renders its Pedal Info
- verify the research text has readable foreground/background contrast
- verify the catalog still loads and respects its pagination window
- verify deprecated visual elements are actually removed rather than left interacting with content
- do not count a visual pass as complete until the browser smoke test in `.github/workflows/deploy-pages.yml` passes

This is specifically intended to prevent a CSS redesign from silently making existing research appear missing or unreadable. A major visual change should be called out before implementation when it can affect layout, inherited styles, data visibility, or page behavior.

## Website
`index.html` is now the actual catalog page, not an under-construction placeholder.

The page:
- loads `research/PEDAL_INDEX.json` as the public catalog source
- lists builders alphabetically
- shows each company's pedals
- searches companies and pedals
- groups repeated company/pedal rows into one pedal card
- shows the pedal's dirt type in the record
- limits the initial catalog render to a 72-card window and lets the visitor load more results as needed
- opens a pedal detail view with dedicated **Pedal Info** and **Photo of Pedal** areas
- works on desktop and mobile layouts

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

## Site architecture direction - September 18, 2026

The current priority is **site functionality and information architecture**, not additional PRP. PRP is paused until the site foundation is reliable.

The intended experience is a welcoming historical/reference archive for guitar dirt pedals. The goal is useful discovery and identification, not an ultra-specialized component-forensics database.

### Public catalog structure
- The main archive shows **one entry per pedal model**.
- Colorways and cosmetic variations are not separate main-catalog pedal entries.
- A version with meaningful functional/design changes, such as **V2**, is treated as its own pedal/version page.
- Each version page may contain its own colorway gallery beneath the primary pedal photograph.
- The parent/original pedal page should remain simple. Its **Versions / Variants** area can show thumbnail examples and link to separate pages for genuinely distinct versions.
- A colorway such as **DRV MOD 1 (WHITE)** belongs to the **DRV MOD 1** model as a variation, not as a separate main catalog pedal.
- Special event artwork, retailer-exclusive finishes, and similar cosmetic editions belong under their parent version when the underlying pedal is the same.
- Artist/signature models that are treated as distinct products deserve their own pedal pages.
- The archive should retain alternate names where useful, but this remains a low-priority feature for now.

### Pedal page direction
Keep the existing page simple and approachable. Core content remains:
- pedal name and builder
- primary pedal photograph
- basic pedal information
- versions / variants
- **What it sounds like**
- one best representative YouTube demo

PRP2 may later add a deeper technical layer without making the normal page overwhelming.

### Discovery direction
For now, keep the main navigation intentionally simple:
**Search -> Dirt Type -> Builder -> Pedal**

More advanced faceted discovery can be revisited later. The underlying data should be structured so future search can use researched metadata without requiring a complete rebuild.

### Visual direction
The target visual identity is a literal **empty metal pedalboard inspired by a Pedal Train Pro-style board**. The current site now implements that visual direction with a dark board surface, metal rail treatment, hardware-like details, and catalog cards placed on the board rather than on a paper-library background.

### Photo direction
Photography is a high-priority part of the presentation. Exact, verified pedal photography should be attached to the correct model/version, and multiple colorway photos should be supported within the relevant version page.

### Content boundary
The Dirt Archive should document useful pedal identity, variations, appearance, sound, and practical distinguishing information without attempting to replace specialist deep-dive archives that focus on microscopic circuit revisions, serial-number archaeology, or exhaustive component-level analysis.

### Future editorial layer
A future showcase/blog-style layer may be added for curated historical topics, such as fuzz showcases or builder/pedal features. This is intentionally deferred until the core archive works well.

## Next action
Continue PRP1 from the first incomplete pedal in exact website order. The current target is ADA Amps - MP-1 Channel. Keep the site foundation regression checks in force and do not call a PRP batch live until its GitHub Pages deployment succeeds.


## Site architecture checkpoint — September 18, 2026

PRP is intentionally paused while the site foundation is audited and strengthened.

Completed foundation work in this checkpoint:
- Established the distinction between a public pedal model/version and a cosmetic variation.
- DRV MOD 1 (WHITE) is now represented as a colorway variation of DRV MOD 1 rather than a second main catalog card.
- The public archive hides variation records from the main card grid while keeping them available to the parent pedal page.
- Searches can match a known variation name back to its parent model without creating a second card.
- Individual pedal pages now have explicit areas for Pedal Info, Versions, Colorways & Editions, and future YouTube demos.
- Old direct links to a colorway variation can resolve into the parent pedal page.
- Public pedal pages no longer expose PRP identity/source administration wording.
- PEDAL_INDEX.json is the public runtime source for catalog and primary photo data.
- PEDAL_IMAGES.json remains the internal research/photo manifest and is now validated against PEDAL_INDEX.json.
- Deployment validation was strengthened to check catalog identities, research links, photo agreement, variation parents, version parents, and tracker consistency.
- The 10 previously unlinked PRP research records were added to the photo/research manifest.

The target visual direction is a literal empty metal pedalboard inspired by a Pedal Train Pro-style board. Visual redesign will follow the functionality audit rather than precede it.

### Latest functionality audit checkpoint
- The main catalog no longer renders all 3,820 public cards into the DOM at once.
- Search, dirt-type changes, and builder changes reset the result window to the first 72 cards.
- Load-more pagination keeps the full catalog searchable while reducing the amount of HTML rebuilt on each filter/search action.
- The site cache/version marker is now `2026-09-18-site-architecture-004` on the index and pedal-detail pages.
- The main archive and pedal-detail pages now use the physical pedalboard visual shell.
- The catalog still uses 72-card progressive loading.
- The latest GitHub Pages deployment must be verified before this visual/PRP pass is counted as live.
- A deployment-time browser audit now opens every researched parent pedal page (currently 146 parent pages), verifies the Pedal Info content loads, verifies the detail record is visible, checks the information container has usable dimensions, and checks text/background contrast.



## PRP1 batch 007 checkpoint
ADA Amps - MP-1 Channel is now fully complete after an exact Effects Database photograph was confirmed and connected. The tracker, public index, and photo manifest were updated together. The next exact-order unresolved target is ADA Amps - MP-1 Channel.


## PRP1 batch 008 checkpoint
ADA Amps - MP-1 Channel is now fully complete after exact photo confirmation from Chicago Music Exchange. The tracker, public index, and photo manifest were updated together. Next exact-order unresolved target: Add+ Pedals - Der Fuzzer.

## PRP1 batch 009 checkpoint
Batch 009 completed the next ten exact-order PRP1 records from **Add+ Pedals - Der Fuzzer** through **Add+ Pedals - Ratortion 3**. The first seven records already had research and were checked for photo recovery; three new research records were added for Ratortion, Ratortion 2, and Ratortion 3. The exact Add+ Pi picture was confirmed and connected to the public index and photo manifest. Records without a safely archived direct exact-model image remain photo-pending.
The next exact-order unresolved target is **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 010 checkpoint
Batch 010 worked the next ten exact-order PRP1 records from **A Sound Of Failure - Death Driver** through **AC Efectos - Triplex Distortion**. An exact Effects Database photograph was confirmed and archived for **Death Driver**, moving that pedal to fully complete. The remaining nine records in this photo-recovery window remain incomplete where no safe direct exact-model image asset was confirmed.
The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.


## PRP1 batch 012 checkpoint

Batch 012 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had Pedal Info research records. Exact-model photo recovery was checked across the full batch; no new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. The A.Y.A Bass Fuzz search did confirm additional current visual evidence, including a live used-market listing for the Bass Fuzz family, but that evidence is not being substituted for a safely archived exact image asset.

The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 013 checkpoint

Batch 013 audited the next 10 incomplete PRP1 records in exact catalog order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Ratortion 3**. One new exact-model photo was recovered for **Add+ Pedals - Ratortion 3** from an archived Reverb listing, and the research record, photo manifest, public index, and tracker were synchronized. The other nine records remain photo-pending because no new safe direct exact-model image asset was confirmed during this pass.

The next exact-order unresolved target is **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 014 checkpoint

Batch 014 researched the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. New research records were added for all ten and synchronized into the photo manifest, public pedal index, and tracker. No new exact-model photo asset was safely archived during this research pass, so all ten remain picture-pending.

The next exact-order unresolved target remains **Add+ Pedals - Ratortion 3 v2** until the photo requirement is satisfied.


## PRP1 batch 015 checkpoint

Batch 015 audited the next 10 unresolved PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. Exact-model photos were recovered and synchronized for **Ratortion 3 v2, Shredder, Tube Drive Silver Edition, Boostmaster, and Geranium Fuzz**. **Super Drive, Super Drive 2, Tiger Shark, Tube Drive, and Tube Drive 2** remain photo-pending because no new safe direct exact-model image asset was confirmed during this pass.

The next exact-order unresolved target is **Add+ Pedals - Super Drive**.


## PRP1 batch 016 checkpoint

Batch 016 processed the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Super Drive** through **ADV Systems - #overdrive**. New research records were added for **Addrock Hism Scism, Addrock Not So Ol' Yeller, Addrock Ol' Yeller, ADV Systems #distortion, and ADV Systems #overdrive**. Exact photos were recovered for **Addrock Hism Scism** and **Addrock Ol' Yeller** and synchronized across the research records, photo manifest, public index, and tracker. The remaining eight records remain incomplete where no safe direct exact-model image asset was confirmed.

The next exact-order unresolved target remains **Add+ Pedals - Super Drive**.


## PRP1 batch 017 checkpoint

Batch 017 processed the next 10 incomplete PRP1 records in exact catalog order, from Add+ Pedals - Super Drive through Advance Tube Technology - Over Cat Drive. New research records were added for Advance Tube Technology - Boost Cat Drive and Over Cat Drive. No new photo was promoted without a safe exact-model image match.


## PRP1 batch 018 checkpoint

Batch 018 processed the next 10 incomplete PRP1 records in exact catalog order, from Advance Tube Technology - Boost Cat Drive through AED - Blue Bee. The two Advance Tube Technology records were deepened with additional historical documentation, and seven new research records were added for Adventure Audio Demogorgon Fuzz, Dream Reaper, Fuzz Peaks, Fuzz Peaks II, Glacial Zenith - Overdrive, Thaw, and AED Blue Bee. No photo was promoted without a safe exact-model image asset.


## PRP1 batch 019 checkpoint

Batch 019 processed the next 10 incomplete PRP1 records in exact catalog order, from Adventure Audio - Demogorgon Fuzz through AGR Pedals - DS2610 - Vintage Distortion. Four exact photos were recovered and synchronized for Adventure Audio Dream Reaper, Fuzz Peaks, Fuzz Peaks II, and Thaw. New research records were added for Aether Electronic Lenore, AGR Pedals Cuervo Muerto - Silicon Fuzz Bender, and AGR Pedals DS2610 - Vintage Distortion. Version-specific images for Demogorgon and Glacial Zenith were not promoted because the catalog records do not establish those exact revisions.


## PRP1 batch 020 checkpoint

Batch 020 processed the next 10 incomplete PRP1 records in exact catalog order, from Adventure Audio - Demogorgon Fuzz through Aguilar - Fuzzistor - Bass Fuzz. Four new research records were added for AGR Pedals FZR912 - Muff Fuzz Deluxe, AGR Pedals OD85 - Full Range Overdrive, Aguilar Agro - Bass Overdrive, and Aguilar Fuzzistor - Bass Fuzz. An exact original-model photo was recovered and synchronized for Aguilar Fuzzistor. The AGRO V2 image was deliberately not attached to the base AGRO record.


## PRP1 batch 021 checkpoint

Batch 021 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had Pedal Info research records. The photo-recovery pass rechecked exact-model evidence across the full batch, including current/historical visual references for A.Y.A Bass Fuzz, A&M Custom Effects, AboveGroundFX, Absolutely Analog, AC Efectos, and Accel Audio. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 022 checkpoint

Batch 022 audited the next 10 incomplete PRP1 records in exact website order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Super Drive**. All ten have Pedal Info research records. Exact-model photo evidence was rechecked across the batch, including the surviving Effects Database catalog evidence for the Add+ Pedals models. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Add+ Pedals - Super Drive 2**.
