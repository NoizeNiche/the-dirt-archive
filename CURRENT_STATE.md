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
- Pedals with research information: 277
- Pedals with confirmed pictures: 167
- Fully complete PRP pedals: 167
- Remaining incomplete pedals: 3654
- Researched but waiting only for a confirmed picture: 110
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **AMT Electronics - S-1**

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
Continue PRP1 from the active cursor in exact website order. The current active target is Alexander Pedals - Princess Clang. A.Y.A - Bass Fuzz remains parked/non-blocking until its picture requirement is solved. Keep the site foundation regression checks in force and do not call a PRP batch live until its GitHub Pages deployment succeeds.


## Site architecture checkpoint — September 18, 2026

PRP is active. The current site foundation is the regression benchmark and must be checked after each batch.

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
The next active unresolved target after Batch 042 is **AED - Blue Bee**.


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

## PRP1 batch 023 checkpoint

Batch 023 audited the next 10 incomplete PRP1 records in exact website order, from **Add+ Pedals - Super Drive 2** through **Advance Tube Technology - Virus Drive**. The first nine records already had Pedal Info research and were rechecked against their historical/catalog sources. **Advance Tube Technology - Virus Drive** was the only record in the batch missing its research record; a new PRP1 record was added using the surviving Advance Tube Technology manufacturer documentation and Effects Database catalog evidence. Exact-model photo evidence was rechecked across the batch, including Add+ catalog references, Addrock, ADV Systems, and Advance Tube Technology sources. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Adventure Audio - Demogorgon Fuzz**.

## PRP1 batch 024 checkpoint

Batch 024 processed the next 10 incomplete PRP1 records in exact website order, from **Adventure Audio - Demogorgon Fuzz** through **Aguilar - Storm King - Micro Bass Distortion/Fuzz**. **Adventure Audio - Demogorgon Fuzz** received a confirmed exact-model photograph from Rich Tone Music and its research record, photo manifest, public index, and tracker were synchronized, moving it to fully complete. **Aguilar - Storm King - Micro Bass Distortion/Fuzz** was the only record in the batch missing Pedal Info research; a new PRP1 record was added from Aguilar's official product documentation and supporting historical coverage. The remaining records were rechecked against their available research and exact-model visual references. No substitute, inferred image, or guessed image URL was promoted. The Storm King record remains **Picture: NEEDED / PRP Complete: NEEDED**.

The next exact-order unresolved target is **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 consistency repair after batch 024

The existing **Barber Electronics - Small Fry** research record introduced by a concurrent repository update was reconciled into the canonical PRP data layer. Its research record is now linked from **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Because the exact Small Fry image was not separately archived under this catalog identity, the picture remains **NEEDED** and no photo was inferred from the Burn Unit alias.


## PRP1 consistency repair after batch 024

The Barber Electronics research records added by the concurrent **PRP1 batch 021** work were reconciled into the canonical data layer so the deployment verifier can see every research file. Ten additional Barber records were linked across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Their Pedal Info status is now **DONE**; their pictures remain **NEEDED** until an exact-model image is independently verified. This repair does not change the PRP work-order checkpoint, which remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.

## PRP1 consistency repair follow-up

The deployment verifier exposed one invalid Barber tracker link: **Small Fry Burn Unit** did not have a corresponding research file. That catalog row has been returned to **Pedal Info: NEEDED**, with no research or photo connection claimed. The nine actual Barber research files remain linked; the PRP work-order checkpoint remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 025 checkpoint

Batch 025 processed the next 10 incomplete PRP1 records in exact website order, from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Existing research for FZR912, OD85, AGRO, and Storm King was rechecked and canonical source links were synchronized. New research records were added for **Airis Effects - Solar Flare Overdrive**, **Airis Effects - The Savage Drive**, **AJ Peat - Dirty Buzzard - Overdrive**, **AJ Peat - Fat Peacock - Distortion w/ Boost**, **AJ Peat - Screaming Flamingo - Overdrive/Distortion**, and **AJcustom - Distortion**. Exact-model photos were recovered and synchronized for Solar Flare, The Savage Drive, Dirty Buzzard, Fat Peacock, and Screaming Flamingo. **AJcustom Distortion** remains photo-pending because no direct exact-model image asset was safely archived. The first four AGR/Aguilar records also remain photo-pending, so the next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 026 checkpoint

Batch 026 continued the exact-order photo-recovery pass from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Two exact-model photos were independently confirmed and promoted: the original black **Aguilar - Agro - Bass Overdrive** from Thomann UK and **Aguilar - Storm King - Micro Bass Distortion/Fuzz** from Chicago Music Exchange. **FZR912 - Muff Fuzz Deluxe** and **OD85 - Full Range Overdrive** remain photo-pending because the accessible Effects Database records show exact-model imagery, but a safe direct image asset could not be independently archived from those records. No substitute or guessed image URL was promoted. The next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 027 checkpoint

Batch 027 audited the first 10 incomplete records reported by the canonical **PRP_TRACKER.csv**, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already have Pedal Info research and their research links remain intact. Exact-model visual evidence was rechecked across the window. The A.Y.A search surfaced a current **Bass Fuzz II** listing, but that model designation is explicitly different from the base **Bass Fuzz**, so it was not promoted. Effects Database also exposes exact-model catalog imagery for records such as **AboveGroundFX - El Griton Overdrive** and **AC Efectos - Triplex Distortion**, but the accessible pages do not provide a safe direct image asset for archival promotion. No substitute or guessed image URL was promoted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**. The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.


## PRP1 batch 028 checkpoint

Batch 028 continued the photo-recovery pass on the first unresolved catalog target, **A.Y.A - Bass Fuzz**. A fresh 2024 Mercari listing was found showing the original **A.Y.A tokyo japan BASS FUZZ**, and independent older Japanese references identify the model as a limited 30-unit fuzz. The accessible eBay listings currently circulating are explicitly for **BASS FUZZ II**, so they were not substituted for the base model. The exact original-model visual evidence is now documented in the research record, but a stable direct image asset could not be safely archived from the available sources. **Picture remains NEEDED / PRP Complete remains NEEDED.** The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 029 checkpoint

Batch 029 continued the exact-order photo-recovery work on **A.Y.A - Bass Fuzz**. A fresh image-index search re-confirmed an exact photograph of the original A.Y.A tokyo japan BASS FUZZ in the 2024 Mercari listing, while current eBay listings remain explicitly labeled BASS FUZZ II and the current official A.Y.A products page does not expose a Bass Fuzz product image. The exact-model visual evidence is documented in the research record, but no stable directly retrievable image asset was confirmed for archival promotion. **Picture remains NEEDED / PRP Complete remains NEEDED.** Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 030 checkpoint

Batch 030 rechecked the exact first unresolved target, **A.Y.A - Bass Fuzz**. A fresh image search visually confirmed the original blue-sparkle A.Y.A tokyo japan BASS FUZZ enclosure from the 2024 Mercari listing, including the Fuzz/Vol layout and BASS FUZZ labeling. The source page currently returns 404 and no stable directly retrievable image asset was exposed, so the image remains unarchived and the public card must continue to show **No Photo Archived**. Current BASS FUZZ II listings remain a different model/version and are not substituted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 032 checkpoint

The photo-recovery pass broadened the search for **A.Y.A - Bass Fuzz** to exact-title image indexing and additional independent Japanese references. The original blue-sparkle Bass Fuzz photograph was re-confirmed visually, but the underlying Mercari item is unavailable to the crawler and no stable direct image asset was exposed. The current **BASS FUZZ II** listings are explicitly a different version and remain excluded. **Picture remains NEEDED / PRP Complete remains NEEDED.** Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 033 checkpoint

Batch 033 refined the existing **A.Y.A - Bass Fuzz** research record using the original owner's firsthand account. His unit is identified as number 20 of the 30-unit run, and his notes describe a gritty but controlled bass fuzz that retains the instrument's core, projects strongly in a band mix, and has relatively little sustain. No new stable archival image asset was found, so **Picture remains NEEDED / PRP Complete remains NEEDED**. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 034 checkpoint

Batch 034 widened the photo-recovery window to the first 10 incomplete tracker records, beginning with **A.Y.A - Bass Fuzz** and continuing through **Accel Audio - OD-SS Express Overdrive**. The original A.Y.A Bass Fuzz image was re-confirmed visually, but its source remains unavailable for stable direct retrieval. The remaining nine records were also rechecked across exact-model web/image searches; available hits remain catalog pages or dynamic marketplace/affiliate listings without a safe archival image asset. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 035 checkpoint

Batch 035 widened the direct-image hunt across the current unresolved window using builder-domain searches, Effects Database records, historical resale sources, and exact-name image indexing. **A.Y.A - Bass Fuzz** remains visually confirmed by the indexed original-model photograph, but no stable direct asset is exposed. The following unresolved records likewise produced catalog imagery or source pages without a safe direct image file. No picture status changed. **Counts remain 3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for a picture. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 036 checkpoint

Batch 036 widened the exact-model photo-recovery window across the first 10 incomplete tracker records in website order: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The exact-model sources were rechecked using Effects Database records, historical/source listings, builder references, and current image indexing. The A.Y.A base-model image remains visually confirmed but is not available as a stable direct archival asset; the current BASS FUZZ II listing remains excluded as a different version. Effects Database imagery was also confirmed for several records in the window, but the accessible image material does not expose a stable direct file suitable for archival promotion under the project's photo rules. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 037 checkpoint

Batch 037 repeated the exact-order photo-recovery window across the first 10 incomplete tracker records: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The search was broadened to current web indexing, historical catalog material, builder-domain references, resale listings, and Effects Database records. Effects Database continues to expose exact product identities for the A&M, AboveGroundFX, AC Efectos, and Accel records, while the current A.Y.A resale result remains explicitly **BASS FUZZ II**, a different model/version. No newly discovered source exposed a stable direct exact-model image asset that met the archive's photo requirement. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 038 checkpoint

Batch 038 continued the exact-order photo-recovery pass on the first 10 incomplete catalog records: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The sweep used fresh exact-title searches, Effects Database catalog records, builder-linked material, historical references, and the available image index. The A.Y.A indexed original-model photograph remains exact visual evidence, but the underlying Mercari page is unavailable and no stable direct image asset is exposed. Effects Database continues to identify the remaining models and exposes catalog imagery or source-page references, but the accessible image material still does not provide a safe, stable exact-model file for archival promotion. The archive therefore keeps all ten pictures **NEEDED** and continues to show **No Photo Archived** rather than substitute a guessed or mismatched image. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 039 checkpoint

Batch 039 continued the exact-order photo-recovery pass on the first incomplete catalog window, centered on **A.Y.A - Bass Fuzz** and the following nine unresolved records. A fresh web/image audit confirmed that the original A.Y.A Bass Fuzz remains a distinct 2007 A.Y.A product with Fuzz and Volume controls, and the indexed original-model photograph still matches the base pedal's blue-sparkle enclosure and two-control layout. The underlying Mercari page is unavailable for stable retrieval, while the current live resale result is explicitly **BASS FUZZ II** and is therefore excluded from the base-model image. The remaining records continued to resolve to exact product/source pages and historical references without a stable direct image asset that meets the archive rule. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 queue-progression rule — September 18, 2026

The PRP tracker remains the source of truth for **completion status**, but a single unresolved photo must not permanently block the working queue. Once a first-in-order incomplete pedal has received a fresh exact-model photo search and no qualifying archival asset is available, that pedal may be **parked for later photo recovery** while PRP1 advances to the next incomplete catalog records in exact website order. Parked pedals remain NEEDED in the tracker and are revisited during later broad recovery sweeps.

**Current active PRP1 cursor: A&M Custom Effects - Crash Central - Crunch Distortion. A.Y.A - Bass Fuzz is parked for later recovery.**

## PRP1 batch 040 checkpoint

Batch 040 advanced the PRP1 working queue past the parked **A.Y.A - Bass Fuzz** and audited the next 10 incomplete catalog records in exact order: **A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive; Accel Audio - Stompzilla Fuzz**. Fresh image/catalog searches produced clear exact-model visual references for **El Griton** and **Triplex**, plus additional historical/catalog image evidence for **Rocks Hard**, but no stable directly retrievable image asset met the archive requirement. The remaining models were rechecked against their exact product/source records without finding a qualifying stable image asset. **No picture status changed. A.Y.A remains Picture: NEEDED but is no longer a queue blocker.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The next active cursor is **Add+ Pedals - Der Fuzzer**.

## PRP1 batch 041 checkpoint

Batch 041 advanced the active PRP1 queue from the parked **A.Y.A - Bass Fuzz** to the next 10 incomplete records in exact catalog order: **Add+ Pedals - Der Fuzzer; Add+ Pedals - Distortion; Add+ Pedals - Fuzz Face; Add+ Pedals - Fuzz Machine; Add+ Pedals - Great White; Add+ Pedals - Great White 2; Add+ Pedals - Ratortion; Add+ Pedals - Ratortion 2; Add+ Pedals - Super Drive; Add+ Pedals - Super Drive 2**. Fresh source and image searches reconfirmed the Add+ catalog as an early-2011 Effects Database addition. The current Add+ Distortion retailer page provides an exact-model photograph and documents Volume/Tone/Drive controls plus MOSFET/Vintage clipping selection and a Low Pass/High Pass switch; the image is useful exact-model evidence, but its underlying CDN asset was not independently retrievable as a stable archival URL. The Add+ Fuzz Face image-index result also shows an exact branded Fuzz Face example, while Effects Database continues to list Der Fuzzer, Fuzz Machine, Great White, Great White 2, Ratortion, Ratortion 2, Super Drive, and Super Drive 2 as distinct Add+ products. No new stable direct image asset was confirmed for archival promotion in this batch, so no picture status changed. **A.Y.A remains Picture: NEEDED but parked and non-blocking.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The next active cursor is **Add+ Pedals - Super Drive**.

## PRP1 batch 042 checkpoint

Batch 042 advanced the active PRP1 queue after the parked **A.Y.A - Bass Fuzz** and the completed Batch 041 Add+ window. The next 10 incomplete catalog records were audited in exact order: **Add+ Pedals - Tiger Shark; Add+ Pedals - Tube Drive; Add+ Pedals - Tube Drive 2; Addrock Musical Products - Not So Ol' Yeller; ADV Systems - #distortion; ADV Systems - #overdrive; Advance Tube Technology - Boost Cat Drive; Advance Tube Technology - Over Cat Drive; Advance Tube Technology - Virus Drive; Adventure Audio - Glacial Zenith - Overdrive**. Fresh exact-name photo/source searches produced one qualifying archival asset: an exact **Advance Tube Technology Over Cat Drive** photograph from Banana Music, now synchronized into the research/photo manifest, public pedal index, and tracker. The search also re-confirmed current exact-model visual material for Add+ Tube Drive and historical/source imagery for the Advance Tube Technology and ADV Systems records, but no other stable direct image asset met the archive requirement in this batch. **Over Cat Drive moved to Picture: DONE / PRP Complete: DONE.** **A.Y.A remains Picture: NEEDED but parked and non-blocking.** Counts are now **3,821 total / 220 researched / 163 pictured / 163 complete / 3,658 incomplete**, with **57** researched pedals waiting only for confirmed pictures. The next active unresolved target is **AED - Blue Bee**.

## PRP1 batch 043 checkpoint

Batch 043 advanced the active PRP1 queue through the next 10 incomplete catalog records: **AED - Blue Bee; Aether Electronic - Lenore; AGR Pedals - Cuervo Muerto - Silicon Fuzz Bender; AGR Pedals - DS2610 - Vintage Distortion; AGR Pedals - FZR912 - Muff Fuzz Deluxe; AGR Pedals - OD85 - Full Range Overdrive; AJcustom - Distortion; Akai - Blues Overdrive; Akai - Tri-Mode Fuzz; Akai - Tri-Mode Overdrive**. Fresh source/image checks re-confirmed exact-model references for the AED, Aether, AGR, and Akai records. The Akai trio was previously missing Pedal Info, so new research records were added and synchronized into the public index, photo/research manifest, and tracker. The exact Akai Blues Overdrive has a clear surviving product photograph, but its accessible source does not expose a stable direct archival image asset. The other photo searches did not produce a new stable exact-model asset that met the archive standard. **No picture status changed.** A.Y.A Bass Fuzz remains parked and non-blocking. Counts are now **3,821 total / 223 researched / 163 pictured / 163 complete / 3,658 incomplete**, with **60** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alairex - H.A.L.O. - Harmonic Amp-Like Overdrive**.

## PRP1 batch 044 checkpoint

Batch 044 advanced the active PRP1 queue through the next 10 incomplete catalog records: **Alairex - H.A.L.O. - Harmonic Amp-Like Overdrive; Alairex - H.A.L.O. Jr.; Alameda Guitars - Fuzzoo; Alber - FU-10; Alber - FU-1000; Alber - FU-1000P; Alber - GA-104 Gain; Alber - GA-1040 Gain; Alber - GA-1040P Gain; Alber - OD-6 Over Drive**. New Pedal Info research records were created for all ten entries and synchronized across the research records, public pedal index, photo/research manifest, and tracker. Exact-model photos were archived for **Alairex H.A.L.O. - Harmonic Amp-Like Overdrive**, **Alairex H.A.L.O. Jr.**, and **Alameda Guitars Fuzzoo** using directly retrievable builder/catalog image assets. The seven Alber records remain picture-pending because the accessible catalog imagery is wrapped through marketplace/image layers without a stable directly retrievable archival asset. **Alairex H.A.L.O., H.A.L.O. Jr., and Alameda Fuzzoo moved to Picture: DONE / PRP Complete: DONE.** A.Y.A Bass Fuzz remains parked and non-blocking. Counts are now **3,821 total / 233 researched / 166 pictured / 166 complete / 3,655 incomplete**, with **67** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alber - OD-600 Over Drive**.

## PRP1 batch 045 checkpoint

Batch 045 advanced the active PRP1 queue through the next 10 incomplete catalog records: **Alber - OD-600 Over Drive; Alber - OD-600P Over Drive; Alber - OD-610 Over Drive; Alcove - ALP-200 Overdrive; Alden - Tube Overdrive; Aleatorik - Operation 1; Aleatorik - Operation 2; Aleatorik - Operation 3; Aleks K Production - Honey Moon - Sweet Overdrive; Aleks K Production - Sun Beam - Magic Drive**. New Pedal Info research records were created for all ten entries and synchronized across the research records, public pedal index, photo/research manifest, and tracker. An exact builder photo was archived for **Aleks K Production - Sun Beam - Magic Drive**. The Honey Moon catalog entry remains photo-pending because the stable direct builder image currently exposed is specifically a V3, while the archive entry is the generic model and its version differences matter. The remaining eight records are photo-pending because exact catalog imagery is available through source/marketplace layers but no stable directly retrievable archival asset met the photo rule. A later-fix checklist was added at **research/PRP_LATER_FIXES.md** for the seven remaining Batch 044 Alber photos plus the parked A.Y.A Bass Fuzz. Counts are now **3,821 total / 243 researched / 167 pictured / 167 complete / 3,654 incomplete**, with **76** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alen Geere - Crown Centaur**.
## PRP1 batch 046 checkpoint
Batch 046 processed the active PRP1 window from **Alen Geere - Crown Centaur** through **Alexander Pedals - Magnolia Vintage Overdrive**. Eleven Pedal Info research records were added and synchronized into the canonical pedal index, photo manifest, and tracker. The research covers the required PRP fields where evidence exists, and explicitly leaves undocumented transistor/diode details blank rather than guessing. No exact-model direct image asset met the archive's promotion standard in this batch, so all eleven remain **Picture: NEEDED / PRP Complete: NEEDED** and the public cards must continue to use **No Photo Archived**. Counts are now **3,821 total / 254 researched / 167 pictured / 167 complete / 3,654 incomplete**, with **87** researched pedals waiting only for confirmed pictures. The next active cursor is **Alexander Pedals - Princess Clang**; the parked **A.Y.A - Bass Fuzz** remains non-blocking.


## PRP1 batch 048 checkpoint

Batch 048 processed the next three incomplete records in exact website order: **AmpMojo - Skate Fuzz (SKUZZ)**, **AmpMojo - Sol Drive**, and **Amptweaker - Bass BluesFuzz**. All three now have individual research records, index connections, photo-manifest entries, and tracker status. No exact photo was safely confirmed for these models, so all three remain photo-pending. The next exact-order incomplete target is **Amsterdam Cream - Big Eye Fuzz**.

## PRP1 batch 047 checkpoint
Batch 047 processed the next ten active catalog records in exact website order, from **Alexander Pedals - Princess Clang** through **Amplified Nation - Bigger Bloom Overdrive**, while keeping the parked **A.Y.A - Bass Fuzz** non-blocking. New Pedal Info research records were added for all ten and synchronized into the public pedal index, photo/research manifest, and tracker. No exact-model direct image asset met the archive's stable archival-photo standard in this batch, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. Technical fields that could not be established from reliable documentation were left explicitly undocumented rather than guessed. Counts are now **3,821 total / 264 researched / 167 pictured / 167 complete / 3,654 incomplete**, with **97** researched pedals waiting only for confirmed pictures. The next active cursor is **AmpMojo - Skate Fuzz (SKUZZ)**.

## PRP1 batch 049 checkpoint

Batch 049 processed the next ten incomplete records in exact website order: **Amsterdam Cream - Big Eye Fuzz**, **Original Distortion**, **Plain Drive**, then **AMT Electronics - B-1 BG-Sharp**, **BS British Sound**, **CS California Sound**, **DM-3 DistMachine**, **M-1 JM-800**, **R-1 Rectifier**, and **Rammstein RD Distortion Combo Emulator**. All ten received individual research records and were connected to PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. No exact photo was safely confirmed for these models, so all ten remain photo-pending. The next exact-order incomplete target is **AMT Electronics - S-1**.


## PRP1 batch 050 checkpoint

Batch 050 processed the next ten incomplete records in exact website order: **AMT Electronics - S-1**, **SS-11B**, **SS-20**, **AMtech Handwired - Destroyer**, **Tube Drive**, **amukaT - Tweaker**, **Amzel Electronics - Cheshire Cat Tone Evaporator**, **Analog Alien - Joe Walsh Double Classic**, **Rumble Seat**, and **Analog Fox - Tone Machine**. All ten received individual Pedal Info research records and were synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. **Rumble Seat** received an exact-model archival image from a stable Sweetwater product asset and moved to **Picture: DONE / PRP Complete: DONE**. The other nine remain **Picture: NEEDED / PRP Complete: NEEDED** because the exact-model imagery found was not safely available as a stable direct archival asset.

**Counts:** 3,821 total / 287 researched / 168 pictured / 168 complete / 3,653 incomplete, with **119** researched pedals waiting only for confirmed photos.

**Next active cursor:** **Analog King - Fuzz Machine - Germanium Fuzz + Overdrive**.

**Parked/non-blocking:** **A.Y.A - Bass Fuzz** remains picture-pending and parked for later recovery.


## PRP1 batch 051 checkpoint

Batch 051 processed the next ten incomplete records in exact website order: **Analog King - Fuzz Machine - Germanium Fuzz + Overdrive; ZenTone - Harmonic Drive; Analog Man - Astro Tone; Prince Of Tone; Sun Face; Analog Music Company - Evil Pumpkin; Mary Gorgias Ultra High Gain Distorter; Analog Noir - Fuzz Face / Rangemaster Treble Booster; Harmonic Percolator; Si / Ge Fuzz Face**. All ten received individual Pedal Info research records and were synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. No exact-model direct image asset was safely confirmed for archival promotion in this batch, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**.

**Counts:** 3,821 total / 297 researched / 168 pictured / 168 complete / 3,653 incomplete, with **129** researched pedals waiting only for confirmed photos.

**Next exact-order incomplete target:** **Analog Noir - Tone Bender MK1.5 / Tone Bender MKII**.

**Parked/non-blocking:** **A.Y.A - Bass Fuzz** remains picture-pending.
