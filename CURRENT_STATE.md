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

Pedal cards are real links to pedal.html with the builder and pedal passed in the URL, giving every cataloged pedal an individual page.

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

## Pedal Research Phase foundation

After the Builder → Pedals census is complete through Z, the project enters a separate **Pedal Research Phase**.

Research is still documented **one pedal at a time**, with every pedal receiving its own research record, but the work is collected and verified in **batches of 10 pedals (or as many as can be responsibly completed in a pass)** before publishing.

The foundational research fields are:
- **Colorways**: documented color/finish variants where meaningful
- **Versions**: distinct named or documented versions/revisions
- **Version changes**: what changed between versions, when the evidence supports it
- **Transistor type**: the transistor technology/type used, without turning the archive into a component inventory
- **Diode type**: the diode technology/type used, without turning the archive into a component inventory
- **Sound description**: a concise **2–3 sentence** description of the pedal's audible character, based on documented product information and/or reliable listening references

The purpose is to turn each basic catalog entry into a useful pedal reference page while preserving the core archive structure:
**Builder → Pedal → Pedal Info → Photo**.

The Pedal Research Phase may add research metadata to existing pedal records, but it does not replace the canonical builder/pedal census or retroactively change the active A → Z census mission.

## Catalog data
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated primary pedal catalog.

The website currently loads the catalog plus the active scrape census files:
- `research/MASTER_PEDAL_CENSUS.csv`
- `research/SCRAPE_A_CENSUS.csv`
- `research/SCRAPE_B_CENSUS.csv`
- `research/SCRAPE_C_CENSUS.csv`

Active scrape censuses are live website inputs. Newly verified builders and pedals should appear on the site as soon as their scrape census is updated, rather than waiting for a later master-census consolidation.

Multiple rows can represent one pedal when the cataloged pedal belongs to more than one dirt type.

The canonical builder sequence now reaches **586 identities through Deep Dives 220-224**. Scrape C Block 167 established **12 additional verified canonical builder identities, 306-317**, covering Ceriatone through Cusack Music. Block 168 added **canonical builder 318, CUVAVE / M-VAVE**, resolving the previously deferred Cuvave identity with current manufacturer evidence. Block 169 added **canonical builder 319, COG Effects**, as an alphabetic backfill for a missed C-section builder. Block 170 added **9 canonical builder identities, 320-328**, as a further C-section backfill. Block 171 added **10 canonical builder identities, 329-338**, covering Cave Pedals through Crews Maniac Sound. Block 172 adds **6 canonical builder identities, 339-344**, covering Cameltone Electronics through Cathouse Pedals. Block 173 added **7 canonical builder identities, 345-351**, covering Caveman Audio / Skrydstrup through Critter Electronics; Cat's Eye ESP was already canonical as ID 342 and was expanded rather than duplicated. Block 174 added **14 canonical builder identities, 352-365**, covering Carlin through Chuck Pedals. Block 175 added **7 canonical builder identities, 366-372**, covering Citadel Electronics through Couch Electronics. Block 176 added **5 canonical builder identities, 373-377**, covering CAST Engineering through Cryptid Effects. Block 177 added **5 canonical builder identities, 378-382**, covering Coolsound through Crust Pedals. Block 178 added **5 canonical builder identities, 383-387**, covering Classic Audio Effects through Custom Analog Pedals. Block 179 added **3 canonical builder identities, 388-390**, covering Circuitous FX, Circus Freak Music, and Cosmic Terror, while expanding existing Citadel Electronics (ID 366) with Vector. Block 180 added **5 canonical builder identities, 391-395**, covering Celmo, Coopersonic, Copper Gear, CostaLab, and Charlie Paolo Custom Effects. Block 181 added **4 canonical builder identities, 396-399**, covering Ciclar, Claybridge Sound Systems / Claybridge Audio, Clark Amplification, and Compulsive Audio. Block 182 added **8 canonical builder identities, 400-407**, covering Conrad, Coolmusic, Coolpedals, Cordovox, Coron, Cosmic Sound FX, Cosmodio Instruments, and Cosmosound. Block 183 added **9 canonical builder identities, 408-416**, covering Canned Monsters, Caswell Modern Electronics (CME), CastleRock, CBS-Arbiter, Celestial Effects, Celebrity Pedals, Coffin Gear / Coffin Case, Coggins Audio / Dinosaural, and Colombo Audio Electronics. Block 184 added **9 canonical builder identities, 417-425**, covering ColorTone Fx / Pedal Tank, Colortone Pedals, Columbus, Commune, Commune/ECA (Empire Custom Amplification), Companion, Collins, Colfax Recorders, and Cole Music Co. Block 185 adds **4 canonical builder identities, 426-429**, covering Coleman, Crate, Cruzer (by Crafter), and Crown, while expanding existing Collins (ID 423) with CDT-1 Distortion. Block 186 adds **4 canonical builder identities, 430-433**, covering C.Giant, Captain FX, CAT Sound, and Cave Passive Pedals. Block 187 adds **7 canonical builder identities, 434-440**, covering Case Study Effects Co., Chellee Guitars, Chemistry Design Werks, Clone Bro, Custom Audio Electronics, Custom Guitar Innovations, and Custom Tones, while expanding existing Colorsound / Sola Sound (ID 348) with the Champion-branded fuzz records. Block 188 adds **4 canonical builder identities, 441-444**, covering Chapter 53 Boutique Effects, Chord (by Tom's Line), Clear Sound, and Cloud 9. Block 189 adds **1 canonical builder identity, 445**, Carella Guitars, while expanding existing Chase Tone (ID 307) with six additional fuzz models. Block 190 adds **3 canonical builder identities, 446-448**, covering Cyclone, Craftros Pedals, and Crazybox Pedals, while expanding existing Cornerstone Music Gear (ID 315) and Caswell Modern Electronics (CME) (ID 409). Block 191 adds **5 canonical builder identities, 449-453**, covering Chaser, CMI, Cobrahawk, Code, and Codtone. Block 192 adds **6 canonical builder identities, 454-459**, covering Carlson, Carruthers, Chucktone Effects, Clay Jones, Chord (by Daphon), and Chiu Luen, while expanding existing Carlsbro (ID 353) with Carlsbro Fuzz. Block 193 adds **7 canonical builder identities, 460-466**, covering Clarenzio, Crossfire, Crysta Professional, Crestwood, CSL, CS.Cathey, and CSR, while expanding existing Collision Devices (ID 314) with FZ - Gated Fuzz / Distortion. Block 194 adds **3 canonical builder identities, 467-469**, covering Circular Time Hardware, Clayton, and Crest Audio, while expanding existing Champion Leccy (ID 305), CopperSound Pedals (ID 110), and CKK Electronic (ID 310). Existing builders continue to be expanded under their existing identities rather than duplicated.

Block 164 contributed **90 company/pedal/type rows**. Block 165 contributed **17 verified company/pedal/type rows**. Block 166 contributed **21 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 167 contributed **45 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 168 contributed **8 verified company/pedal/type rows**, which were consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 169 contributed **12 verified company/pedal/type rows**, which are consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 170 contributed **23 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 171 contributed **51 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 172 contributes **15 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 173 contributed **36 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 174 contributed **51 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 175 contributed **25 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 176 contributed **13 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 177 contributed **14 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 178 contributed **9 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 179 contributed **14 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 180 contributed **44 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 181 contributed **12 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 182 contributed **44 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 183 contributed **72 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 184 contributed **19 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 185 contributes **10 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 186 contributes **16 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 187 contributes **21 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 188 contributes **6 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 189 contributes **12 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 190 contributes **9 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 191 contributes **13 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 192 contributes **16 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 193 contributes **22 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 194 contributes **16 verified company/pedal/type rows**, now consolidated into `research/SCRAPE_C_CENSUS.csv`. Block 195 contributes **2 verified company/pedal/type rows**, both added under existing CMAT Mods (ID 311). Block 196 contributes **3 verified company/pedal/type rows**, adding the new canonical Crushsound identity. Block 197 contributes **29 verified company/pedal/type rows**, adding Crowella Effects as canonical builder 471 and expanding existing Crazy Tube Circuits (ID 025). Block 198 contributes **1 verified company/pedal/type row**, adding Caustic FX as canonical builder 472. Block 199 contributes **10 verified company/pedal/type rows**, adding Chamber Of Sounds as canonical builder 473 and Chris Custom as canonical builder 474. Block 200 contributes **1 verified company/pedal/type row**, adding Circuit Rider Effects as canonical builder 475. Block 201 contributes **4 verified company/pedal/type rows**, adding Cool Bear Effects as canonical builder 476 and CircuitFX as canonical builder 477. Block 202 contributes **7 verified company/pedal/type rows**, adding CDB Pedals as canonical builder 478, CMC Audio as canonical builder 479, and Circuitbenders as canonical builder 480. Block 203 contributes **31 verified company/pedal/type rows**, adding Collateral FX as canonical builder 481 and Charlie Pedals as canonical builder 482. Block 204 contributes **12 verified company/pedal/type rows**, adding Chancho Electronics as canonical builder 483, Correct Sound as canonical builder 484, and expanding existing Cornerstone Music Gear (ID 315) with Sparkle. Block 205 contributes **4 verified company/pedal/type rows**, adding Color Audio as canonical builder 485 and Coura as canonical builder 486. Block 206 contributes **12 verified company/pedal/type rows**, adding Cherry Music as canonical builder 487 and expanding existing Chase Bliss Audio (ID 024) and Cave Passive Pedals (ID 433). Block 207 contributes **7 verified company/pedal/type rows**, expanding existing Colorsound / Sola Sound (ID 348) with historical distributor-branded fuzz variants and the Supa Wah-Fuzz-Swell. Block 208 contributes **9 verified company/pedal/type rows**, expanding existing Cactus (ID 294), ColdCraft Effects (ID 336), Crews Maniac Sound (ID 338), and Cranetortoise by Albit (ID 371). Block 209 contributes **1 verified company/pedal/type row**, expanding existing Crews Maniac Sound (ID 338) with Texas Tornado. Block 210 added **2 verified company/pedal/type rows**, adding Canvas Analog Devices and Carmedon Electronics. Block 211 added **2 verified company/pedal/type rows**, adding Cortez and CrazyTone. Block 212 added **1 verified company/pedal/type row**, adding C.Q.O. Block 213 added **6 verified company/pedal/type rows**, adding Circle Of Tone. Block 215 added **189 verified company/pedal/type rows across 17 companies**, expanding the active Scrape C census through Electro-Harmonix and Empress Effects. Block 219 added **56 new canonical builder identities** and **173 net-new company/pedal/type rows** in a final A-Z builder discovery sweep after the ZVEX checkpoint. Deep Dives 220-224 added **28 additional canonical builder identities** and **86 net-new company/pedal/type rows** through five separate discovery passes.

The primary `research/MASTER_PEDAL_CENSUS.csv` remains at its prior consolidated checkpoint of **2,466 company/pedal/type rows across 103 companies**. The active `research/SCRAPE_C_CENSUS.csv` now contains **3026 company/pedal/type rows** and is the live working layer for the current alphabetic scrape. The master catalog is intentionally separate from the active Scrape B and C working censuses until a later consolidation step.

## Pedal Research Phase checkpoint

The Builder -> Pedals census has reached the end of the alphabet at **ZVEX Effects** in Block 218. The project is now entering the planned **Pedal Research Phase**.

Research is being done **one pedal at a time**. Each researched pedal receives a dedicated record covering:
- colorways
- versions
- documented version changes
- transistor type
- diode type
- a concise 2–3 sentence sound description
- research confidence and source notes

The research phase currently contains **0 pedals with research information**.

Research is documented one pedal at a time, but the actual work is collected and verified in batches of 10 pedals, or as many as can be responsibly completed in a pass, before publishing.

The latest completed PRP record is:
- `research/pedals/Basic Audio/Fuzz Mutant.md`

The current PRP run has covered Basic Audio from Alter-Destiny through Fuzz Mutant. This batch added 10 dedicated research records and exact pedal photographs, with colorway/version notes where evidence supported them, factory-vs-DIY component separation, and sound notes.

Important: the archive's catalog name **Bass BluesFuzz** is retained. Current sources identify the surviving bass model as **Bass BluesFuzz Jr.**, so the research record documents that identity relationship rather than silently changing the catalog.

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

The website currently contains **3,821 unique pedals** after combining and deduplicating all live catalog lists.

Current PRP progress:
- **74** have pedal information researched.
- **64** have a confirmed pedal picture.
- **64** are fully checked off because they have **both**.
- **3,757** still need a complete PRP entry.
- **10** are researched but currently waiting only for a confirmed picture.

The complete checklist is stored in:
- research/PRP_TRACKER.csv

A pedal is marked **PRP Complete** only when both the pedal information and the picture are present. This count will be updated as each PRP batch is completed, and progress will be reported periodically.

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
The next PRP target begins with **Basic Audio — Fuzz Right**, followed by the next nine unresearched pedals in catalog order, unless the batch reaches a builder boundary sooner.
