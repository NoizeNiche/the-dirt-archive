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
- `research/builder-census-01.tsv` adds the first systematic census tranche, mixing confirmed historical builders with high-value catalog candidates and several already-known major builders for cross-checking.
- `research/builder-census-02.tsv` adds a second independent source tranche focused heavily on boutique/current manufacturers and large historical-modern builders.
- `research/builder-census-03.tsv` adds an OEM-aware tranche that explicitly distinguishes **builder/OEM**, **brand/distributor**, **private label**, and **designer/lineage** entities. This distinction is now mandatory for census work so distributor names are not automatically counted as physical manufacturers.
- `research/builder-census-04.tsv` adds a further historical tranche from Fuzzboxes focusing on obscure UK makers, regional builders and branded/OEM branches including Kelly Amplification, TVM Manchester, Baldwin-Burns, G. P. Electronics, Barnes & Mullins/Exel, Rangemaster/Dallas, Park, Carlsbro, Sperrin, Rotosound and Vox branches.
- `research/builder-census-05.tsv` adds Japanese, Korean and New Zealand OEM/brand candidates including J.H. Experience, Zenta, Jansen, Walco, Applied Electronics, Polaris, Axtron, Columbus, Cutec, Profile+, Vision, Luster Proseries, Vesta Fire, Reagun, Nadine's, APEX, Tronix, PSK, RAK, Music-Son, Allsound, MSL, Samson, Excetro, Teisco, JBX and Coron-related labels.
- `research/builder-census-07.tsv` adds German, Italian, regional and modern candidates including Schaller Electronic, Blackfield Orchester-Elektronik, Kent, Höfner, EF-EL / Calderoni Musica, JEN Elettronica, EME, Eko, Cosmosound, Goldsound, G.I.S., Meazzi, Mac, EUR, Framus, Roger Mayer, Austone, Vintage Technology, Kaden Effects, Toetags Electronics, Veri-Tone and related label/OEM cases.
- `research/builder-census-08.tsv` adds Canadian and French makers, including 6 Degrees FX, Industrialectric, Sonic Crayon, Southampton Pedals, Stunt Monkey, Tone Hungry Effects, MJM Guitar FX, Radial/Tonebone, Retro-Sonic and a broad group of French boutique/custom builders.
- `research/builder-census-09.tsv` adds Spanish and Polish makers, including Aclam, Decibelics, Thermion, El Músico Loco, ThunderTomate, DAGPedals, Manlay Sound, Faustone, Exar Electronix, AnalogWise, Chaos FX, Fuzzey, Jean-Paul Electronics, LongAmp, MLC and Occvlt.
- `research/builder-census-10.tsv` adds Nordic and Greek makers, including Carl Martin, Emma Electronic, Lunastone, Nordvang, Reuss, T-Rex, TC Electronic, SoundBrut, Braking Train, Deaf Audio, Iskrem Electro, Locomofon, Bad Pixel, Rat Pedals, Side Effects, VS Audio and Warlord Custom.
- `research/builder-census-11.tsv` adds Australia/New Zealand and first South American/Asian regional candidates, including Anarchy Audio, Bondi Effects, MC Systems, Red Sun Music, Crowther Audio, Silverpistol, Red Witch, G2D, Pepers' Pedals, Richón, MUSA, Darta Effects, Iannucci Audio, Vntage Tone, Apollo Approved Audio Devices, AMTECH-HANDWIRED and Watonefx.
- `research/builder-census-12.tsv` adds India, South Africa and China, including Animal Factory Amplification, Craig Amps, Joyo, Mooer, Mosky, NuX, Caline, Hotone, Flamma and candidate small Chinese clone-focused operations such as 68 Pedals, Ly Rock and DemonFX.
- `research/builder-census-13.tsv` adds a global tranche with Frantone Electronics, Diamond Pedals, EXAR Electronix, Drunk Beaver Pedals, Onerr Brasil Musical, Dedalo FX, Umbrella Company, 320design, Fjord Fuzz, VS Audio, Tsakalis AudioWorks, Blue Pedals, Jamés Pedals, JAM Pedals and Empress Effects.
- `research/builder-census-14.tsv` adds additional manufacturing-level and current regional entities including Sound Land Co., Ltd., Ceriatone Amplification, GFI System, SEHAT Effectors, Sinvertek, FengzaiPedals, Amuzik, A3 Stompbox, Spicetone Music Technology, LeeHooker, SMR Toys, Tone Electronix / T.X Pedals and True North Pedals.
- `research/builder-census-15.tsv` adds long-tail candidates from Israel, Thailand, Croatia, Portugal, Romania, Slovakia, Slovenia, Indonesia, South Korea and China. It deliberately contains both confirmed builders and `CENSUS_ONLY` country-index candidates so breadth is preserved without treating every directory name as a verified dirt manufacturer.
- Current independent source pools include Fuzzboxes, Effects Database, ToneHome, Pro Audio KB, BoutiqueGear, Guitar Pedal X, major manufacturer sites, retailer catalogs, regional builder roundups, period/collector references, interviews, manufacturer histories and selected community discovery threads. Discovery sources are not automatic proof of canonical attribution.
- Census work is intentionally producing candidates before canonicalizing them. Entity type and attribution confidence must be resolved before a candidate becomes a formal builder record.

## OEM attribution rule
A marketed pedal brand, distributor, physical manufacturer, designer, corporate owner and later successor may all be different entities. The census preserves those roles independently. Shared OEM families are grouped at the manufacturing/lineage layer instead of inflating the builder count by treating every badge as a separate factory.

## Current census findings
- Early British research continues to uncover tiny makers documented only by advertisements or testimony. Those entities remain valid census candidates without being upgraded to verified catalogs prematurely.
- Japanese 1960s-1980s research is revealing multiple OEM networks where one factory may sit behind several labels. Shin-Ei/Teisco and Coron-associated families require explicit factory-vs-brand separation.
- 1980s Korean and Taiwanese OEM families are similarly label-dense, with PSK and shared DST/ODV families requiring manufacturing attribution before brands are counted as builders.
- Italian effects history contains several overlapping manufacturing networks, especially JEN/EME/Eko and EF-EL/Calderoni Musica, with Vox, Goldsound, G.I.S., EUR, Meazzi and other marketed identities. Conflicting historical claims remain marked as candidates where evidence is insufficient.
- German vintage effects deserve dedicated census coverage. Schaller, Höfner, Blackfield and Kent demonstrate that significant dirt products existed outside the better-known British/US ecosystem.
- Regional production matters: Jansen in New Zealand and small Australian builders show why country filters based only on US/UK manufacturers would miss historically important objects.
- Spanish, Polish, Nordic and Greek sweeps reveal substantial boutique ecosystems that are largely absent from mainstream US-focused brand lists.
- Australasia has a deep independent builder scene spanning Australia and New Zealand, including long-running names and many small-batch makers. These should be cataloged independently rather than treated as one regional pool.
- Latin American and Southeast Asian searches are beginning to expose local manufacturers such as Richón, MUSA, Darta Effects, Iannucci Audio, Vntage Tone, Apollo Approved Audio Devices, AMTECH-HANDWIRED and Watonefx. These regions require further country-by-country sweeps.
- India has at least one clearly documented modern independent manufacturer in Animal Factory Amplification. Its own site states that the company has operated in Bombay/Mumbai since 2013 and currently sells original dirt pedals.
- South Africa has at least one clearly documented independent manufacturer in Craig Amps. Its own site states it began in 2001 in Pietermaritzburg and now produces overdrive, fuzz and distortion pedals alongside amplifiers.
- China requires special census treatment because the ecosystem mixes major manufacturers, proprietary brands, OEM manufacturing and small clone-focused operations. Clone-oriented names should remain candidate entities until physical manufacturing and product ownership are independently established.
- Recent global searches continue to uncover a mix of established boutique makers and very small country-specific workshops. A useful threshold for leaving Queue A will be when repeated country/source sweeps mostly return existing entities, known duplicates, or low-evidence candidates rather than clearly new creators.
- Current source work also confirms that some seemingly obscure names are actually manufacturing nodes. Sound Land, for example, documents long-running Taiwan OEM production for Roland/BOSS branded effects, while Ceriatone documents hand-built pedal production in Malaysia. These are more important to the census than another list of retailer-facing badge names.

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
The Archive treats **appearance**, **production identity**, and **electronics identity** as separate axes. Different graphics or finishes are not automatically different circuits. Visually similar examples must not be collapsed when evidence indicates different production or electronics identities.

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
**Current priority is builder discovery and saturation testing.** Continue country-by-country and source-family sweeps, especially in underrepresented regions and historical periods. At the same time, begin logging duplicates and likely manufacturing nodes so that eventually we can perform a dedicated census reconciliation pass. Do not shift to exhaustive builder catalogs until new creator discovery has clearly flattened into mostly duplicates, low-evidence candidates, or already-known OEM networks. Existing deep research remains preserved and becomes the head start for the later builder-by-builder catalog phase.

## Editorial rule
Document the object, not the recipe. Do not publish gutshots, schematics, PCB diagrams or complete circuit recipes. Research depth is encouraged; unsupported certainty is not.
