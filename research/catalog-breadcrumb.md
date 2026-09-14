# The Dirt Archive — Persistent Research Breadcrumb

## Current strategy
The Archive has adopted a breadth-first research methodology. The primary objective is to establish the widest practical **builder census** first, then exhaust each builder's catalog, audit catalog completeness, and only then spend major effort on deep product, generation, variant and specimen archaeology. Existing deep research is retained as a head start, not treated as wasted work.

Research progression:
1. Builder Census — who made dirt pedals?
2. Builder Catalog — what did each builder make?
3. Catalog Completeness Audit — have we probably found everything?
4. Product Research — what is each product and where does it belong historically?
5. Generation Research — what meaningful production eras existed?
6. Variant Research — what changed in appearance, production identity or electronics?
7. Specimen Research — what surviving physical examples document those identities?
8. Lineage / OEM Graph — how do products and companies connect?
9. Visual Identification — can the Archive help identify a real-world pedal?

Canonical methodology: `research/research-methodology.md`.

## Research status vocabulary
Use explicit research states instead of implying absolute completion:
- `DISCOVERED` — existence identified.
- `CATALOGED` — structured record created.
- `VERIFIED` — credible evidence supports identity and existence.
- `CATALOG_STABLE` — broad inventory established.
- `CATALOG_COMPLETE` — systematic completeness audit found no obvious omissions.
- `DEEP_RESEARCHED` — substantial historical/product analysis completed.
- `VARIANT_MAPPED` — meaningful generations and variants mapped.
- `SPECIMEN_MAPPED` — representative physical examples documented.
Completion can exist at one level while deeper levels remain unfinished.

## Active work queues
### Queue A — Builder Discovery
Find relevant historical, current, boutique, regional, OEM, private-label and otherwise significant dirt-pedal builders not yet represented.

### Queue B — Builder Catalog Completion
For each identified builder, enumerate as many distinct dirt products as evidence supports. Keep this phase intentionally lighter than variant archaeology.

### Queue C — Completeness Audit
Challenge apparently complete builder catalogs against manufacturer catalogs/manuals, archived sites, distributor catalogs, advertisements, specialist references, collector databases, museum material, OEM records and reissue documentation.

### Queue D — Product Depth
Deep-research individual products after their builder catalog is stable enough.

### Queue E — Variant / Specimen Archaeology
Map generations, variants, OEM branches and surviving specimens after product identity is established.

## Current builder-census progress
- `research/builder-census-01.tsv` through `research/builder-census-16.tsv` now form the active breadth-first discovery corpus.
- Major coverage now spans historical and current makers across the U.K., U.S.A., Canada, Germany, Italy, France, Spain, Poland, Portugal, Czech Republic, Slovakia, Slovenia, Austria, Belgium, Ireland, Sweden, Norway, Denmark, Greece, Croatia, Bulgaria, Serbia, Romania, Switzerland, Japan, Taiwan, South Korea, China, India, Indonesia, Thailand, Malaysia, Australia, New Zealand, South Africa, Israel, Iran, Brazil, Argentina, Chile, Peru, Mexico and other regional pools.
- Early tranches emphasized major manufacturers and known boutique builders. Later tranches intentionally targeted obscure historical makers, regional builders and OEM/private-label ecosystems.
- `builder-census-03.tsv` and later files explicitly distinguish **builder/OEM manufacturer**, **brand/distributor**, **private label**, **designer/lineage**, and **candidate** entities. This distinction is mandatory and prevents badge count from masquerading as factory count.
- Current independent source pools include Fuzzboxes, Effects Database, ToneHome, Pro Audio KB, BoutiqueGear, Guitar Pedal X, major manufacturer sites, retailer catalogs, regional builder roundups, interviews, manufacturer histories, old advertisements and selected community discovery threads. Discovery sources are not automatic proof of canonical attribution.
- Census work deliberately preserves low-evidence candidates rather than silently dropping them. Candidate status must remain visible until entity type and dirt relevance are verified.

## New census tranches since the methodology reset
- `builder-census-13.tsv`: Frantone Electronics, Diamond Pedals, EXAR Electronix, Drunk Beaver Pedals, Onerr Brasil Musical, Dedalo FX, Umbrella Company, 320design, Fjord Fuzz, VS Audio, Tsakalis AudioWorks, Blue Pedals, Jamés Pedals, JAM Pedals and Empress Effects.
- `builder-census-14.tsv`: Sound Land Co., Ltd., Ceriatone Amplification, GFI System, SEHAT Effectors, Sinvertek, FengzaiPedals, Amuzik, A3 Stompbox, Spicetone Music Technology, LeeHooker, SMR Toys, Tone Electronix / T.X Pedals and True North Pedals.
- `builder-census-15.tsv`: long-tail candidate tranche from Israel, Thailand, Croatia, Portugal, Romania, Slovakia, Slovenia, Indonesia, South Korea and China, mixing confirmed builders with `CENSUS_ONLY` country-index candidates.
- `builder-census-16.tsv`: long-tail Europe/Middle East tranche including Balkan Pedals, Ratin Pedals, Gamechanger Audio, CircuitFX, Revolt! and additional country-index candidates in Austria, Belgium, Ireland, Latvia, Lithuania and Thailand.

## OEM attribution rule
A marketed pedal brand, distributor, physical manufacturer, designer, corporate owner and later successor may all be different entities. The census preserves those roles independently. Shared OEM families are grouped at the manufacturing/lineage layer instead of inflating the builder count by treating every badge as a separate factory.

## Current census findings
- The Effects Database country index alone spans a large number of countries and is useful as a discovery map, but its own documentation notes that country is the brand's origin and may not equal the manufacturing country. This reinforces the need for product-level attribution later.
- Canada remains one of the richest modern boutique pools, with many dozens of named makers in the country index. Several, such as Diamond, Empress, SolidGoldFX and Dr. Scientist, have strong dirt evidence, while many smaller names remain candidate-only until products are checked.
- Brazil, Argentina and other Latin American countries have substantial local builder scenes rather than being mere import markets. Onerr, Dedalo and numerous Effects Database country entries establish that regional cataloging is necessary.
- Indonesia has a surprisingly broad boutique ecosystem. GFI System, SEHAT Effectors, AMTECH-HANDWIRED and Revolt! are confirmed examples; the country index also contains many additional small candidates requiring dirt-specific verification.
- China combines proprietary boutique makers, OEM manufacturers, mass-market brands and clone-oriented operations. Sound Land is a particularly important manufacturing node because its company history documents Taiwan OEM production for Roland/BOSS effects, while Chinese brands such as Sinvertek and smaller makers need to be classified separately.
- Eastern and Southern Europe are producing many small candidates. Bulgaria, Croatia, Czech Republic, Estonia, Latvia, Lithuania, Poland, Portugal, Romania, Serbia, Slovakia and Slovenia now have explicit census coverage. Confirmed examples include Balkan Pedals, Dawner Prince, Spicetone, EXAR and Tone Electronix.
- Israel and Iran are not empty spaces. EC Pedals and Ratin Pedals are documented boutique builders, and both deserve later catalog-completion passes.
- Thailand has both historical DIY-to-builder lineage, such as CircuitFX, and a large country-index long tail requiring product-by-product confirmation.
- The census is now producing noticeably more candidates and duplicates than entirely new high-confidence historical manufacturers in several already-swept regions. This suggests we are beginning to approach a useful saturation point, but Queue A is not finished yet.

## Saturation protocol
Do not declare builder-census exhaustion because one directory looks comprehensive. Continue at least one additional independent sweep for each major region/era class, then reconcile:
1. Exact-name duplicates and spelling variants.
2. Brand versus physical manufacturer.
3. OEM factory versus distributor/private label.
4. Designer versus manufacturing company.
5. Modern revival/reissue company versus historical original.
6. Builders that made only non-dirt effects versus true dirt builders.
7. Low-evidence candidates versus verified creators.

Queue A should end only when repeated independent searches produce mostly existing entities, duplicate labels, low-evidence candidates, or known OEM branches and very few genuinely new creators.

## Completed builder phases
Phases 1–25 foundational; 26–44 broad builder expansion. Phase 44 completed the current Pearl/Vorg stopping point with five Vorg records. Phase 45–48 added historical Sola Sound/Colorsound/Tone Bender discovery snapshots. Phase 49 added the Catalinbread lineup snapshot.

## Product-depth batches already completed
- Batch 01: Fuzz Face, Tone Bender, Big Muff Pi, TS808 Tube Screamer, RAT.
- Batch 02: generation maps for Batch 01.
- Batch 03: Maestro FZ-1 Fuzz-Tone, Univox U-1095 Super-Fuzz, Shin-Ei Companion FY-2 Fuzz Box, MXR M-104 Distortion+, BOSS DS-1 Distortion, with generation maps.
- Batch 04: Maestro FZ-1A, Maestro FZ-1B, Tone Bender MK1.5, BOSS OD-1 OverDrive, ProCo Turbo RAT, with generation maps.
- Batch 05: EHX Deluxe Big Muff Pi, Double Muff, Graphic Fuzz, Little Big Muff Pi, Hot Tubes, with generation maps.
- Batch 06: BOSS SD-1 Super OverDrive, BOSS OD-2 TURBO OverDrive, BOSS OD-3 OverDrive, ProCo RAT 2, ProCo R2DU Rackmount, with generation maps.
- Batch 07: Marshall SupaFuzz, Sola Sound Tone Bender Professional MKII, Tone Bender MKIII, Vox Tone Bender Professional MKII, Rotosound Fuzz Box, with generation maps.
- Batch 08: Maestro FZ-1S Fuzz-Tone, Maestro FZ-2 Fuzz-Tone, Maestro MFZ-1 Fuzz, Vox V828 Tone Bender, Vox V8281 Tone Bender, with generation maps.
- Batch 09: Honey Baby Crying, Shin-Ei Companion FY-6 Super Fuzz, Companion FY-6 Fuzz Master, Shin-Ei Companion WF-24 8-Tr Fuzz Wah, Univox U-1095 Super-Fuzz, with generation maps.
- Batch 10: Colorsound Supa Tonebender, Colorsound Tone Bender Jumbo, Colorsound Power Boost, Colorsound Overdriver, with generation maps.
- Batch 11: Colorsound Fuzz Box, Colorsound Fuzz 4, Colorsound Tone Bender Distortion, Colorsound Wow Fuzz, Colorsound Wah Fuzz, Colorsound Wah plus Fuzz, Colorsound Supa Wah-Fuzz, Colorsound Supa Wah-Fuzz-Swell, with generation maps.
- Batch 12: Sola Sound Tone Bender MkI, Sola Sound Tone Bender MkII, Sola Sound Tone Bender MkIII, Sola Sound Tone Bender MkIV, Sola Sound Bum Fuzz Unit, with generation maps.
- Batch 13: Colorsound Bass Fuzz, Colorsound Fuzz Phazer, Colorsound Fuzzphaze, Colorsound Wah-Fuzz-Straight, Sola Sound Wow Fuzz, and Sola Sound Wow Pedal, with generation maps.
- Batch 14: D*A.M./Sola Sound Tone Bender Mk1.5 Copperhead, Mk1.5 Goldie, Mk1.75 El Diablo, MkII reissue, MkII Green Bastard, MkII Hybrid Squadron, MkII SCB Blue Meanie, MkIV reissue, MkIV Purple People Eater, and MkIV Red Baron, with generation maps.
- Catalinbread product-depth work: DLS, SFT, RAH, Sabbra Cadabra, Formula 55, Formula 5F6, Galileo, Galileo 4K, DLS Deluxe, Fuzzrite, Fuzzrite Germanium, Fuzzrite Mini, Katzenkönig, Giygas 2K, Naga Viper MKII and related variants, including DLS Red and Karma Suture GE/SI distinctions.
- ProCo RAT specimen work: 1979 Fringe Logo, 1984 White Face, 1986 Black Face, 1988 RAT2 Flat Top, later sloped RAT2, and 2003 25th Anniversary specimen identities.
- Big Muff specimen work: Triangle, Ram’s Head, Red/Black, Op-Amp, Tone Bypass, later transistor and Russian/Soviet branches.

## Visual presentation
- `catalog-polish.js` adds archive-object numbering, section labels, research presentation polish, focus states and route/top-of-page behavior.
- `catalog-visual-references.js` adds a photo-reference doorway to every pedal card/detail where an exact owned or cleared photograph is not available. These links intentionally open external image-search results and warn that third-party imagery may be copyrighted.
- `catalog-cleared-images.js` adds reusable Wikimedia examples for selected catalog objects, including Colorsound Supa Tonebender, MXR M-104 Distortion+, BOSS DS-1, BOSS OD-1, BOSS SD-1, Vox Tone Bender, Ibanez TS-9, TS808, Big Muff Pi, RAT and Fuzz Face.
- `catalog-specimen-registry-01.js` through `catalog-specimen-registry-13.js` provide structured visual-specimen layers. Each specimen can carry builder, role, era, appearance, variant type, electronics notes, source, credit and rights status. Later registries cover Tone Bender/OEM, Big Muff/Fuzz Face, BOSS/Tube Screamer/RAT, Honey/Shin-Ei/Univox, Colorsound/Sola Sound, Catalinbread, Karma Suture and ProCo RAT revisions.
- `catalog-specimen-ui.js` renders cleared specimen photos as Archive assets and turns reference-only specimens into non-embedded source cards. Image discovery and image rights remain separate.

## Specimen identity rule
The Archive treats **appearance**, **production identity**, and **electronics identity** as separate axes. Different graphics or finishes are not automatically different circuits. Visually similar specimens must not be collapsed when evidence indicates different production or electronics identities.

## Research findings that shaped the architecture
- Tone Bender identification demonstrates that MKI, MK1.5, Professional MKII, British Vox Professional MKII and Italian Vox V828 branches must be related but not flattened. Surviving examples can share exterior expectations while differing in construction history.
- RAT identification demonstrates that graphic/enclosure revisions can be historically important without constituting a circuit change, while later op-amp production changes belong to electronics identity.
- Catalinbread demonstrates the same principle in modern production: DLS Red and Fuzzrite Germanium represent documented product/electronics distinctions, while SFT Blackout/Fireworks and commemorative or retailer-exclusive finishes remain appearance specimens unless electrical changes are evidenced. Karma Suture GE/SI are explicit family-level electronics variants.
- Big Muff demonstrates why the Archive needs family, generation, production branch and specimen layers rather than one universal “Big Muff” identity.
- OEM census research shows that a historical pedal may have a **manufacturer**, **brand/distributor**, and **designer** that are three different entities. The census must preserve those roles independently before product lineage is inferred.
- Fuzzboxes research demonstrates that obscure regional makers may have only press evidence and no surviving pedals. These remain valid census candidates without being upgraded to verified product catalogs prematurely.

## Media status
Cleared Wikimedia examples are actively used for selected catalog objects. External marketplace, specialist-site and manufacturer imagery remains reference-only unless republication rights are explicitly established. The specimen UI does not embed reference-only photos.

## Next queue
**Current priority is still builder discovery.** Finish the major-country and historical-era saturation sweeps, then perform the first dedicated census reconciliation pass across `builder-census-01.tsv` through `builder-census-16.tsv`. The reconciliation should identify new canonical builders, merge duplicates, classify OEM/private-label relationships, and separate weak candidates from confirmed creators. Only after that reconciliation shows diminishing discovery returns should Queue B begin: builder-by-builder complete product catalogs. Existing deep research remains preserved and becomes the head start for the later catalog-depth phases.

## Editorial rule
Document the object, not the recipe. Do not publish gutshots, schematics, PCB diagrams or complete circuit recipes. Research depth is encouraged; unsupported certainty is not.
