# Modern Preservation Track Handoff 44

## YARP
YARP means resume the full Dirt Archive mission without waiting for confirmation. Continue builder-first research, product discovery, production history, variants, generations, editions, lineage, identification clues, source reconciliation, preservation, and GitHub updates. Document the object, not the recipe.

## Current position
The modern-preservation track has completed the 2024 gap-audit layer, the 2025 first census and fuzz/OD/distortion enrichment, and a live 2026 queue. The historical descent now resumes at **2019**.

## Batch 44: 2019 historical descent
Batch 44 adds 21 research-layer records drawn from GPX's 2019 annual coverage, NAMM coverage and related specialist year-end material.

Included records:
- Cusack Music Screamer Fuzz Germanium Limited Edition
- Demon Pedals Kondo-Shifuku D-Style Drive
- Jackson Audio Broken Arrow
- Redbeard Effects Red Mist MKIV
- Sinvertek N5 Drive Plus
- BOSS OD-200 Hybrid Drive
- ThorpyFX Heavy Water Dual Boost
- Fender Trapper Dual Fuzz
- Function F(x) Mini Clusterfuzz
- JHS Pedals Cheese Ball
- Keeley Electronics Fuzz Bender
- Matthews Effects The Architect V3
- Mythos Pedals Argo Octave Fuzz
- Spaceman Effects Apollo VII
- Dwarfcraft Devices She-Fuzz 2019 Edition
- Gamechanger Audio Plasma Coil
- Rainger FX Dr Freakenstein Chop Fuzz
- Wren and Cuff De La Riva BM20-Ultra
- Sitek Electronics Wuffy Fuzzy-Distortion
- KMA Machines Logan Transcend Drive

The batch also contains a deliberate **research hold** for a possible ThorpyFX/Redbeard Red Mist naming collision. It remains in the research layer rather than being promoted until the exact brand/product relationship is proven.

## Evidence findings
GPX's 2019 annual pedal coverage and year-end pedal-chain material provide the principal discovery/census spine. The annual article and related 2019 articles document the appearance of Kondo-Shifuku, Broken Arrow, Red Mist MKIV, N5+ and other gain products in the year's active pedal ecosystem. The Cusack Screamer Fuzz Germanium research is particularly useful because contemporary coverage distinguishes Germanium from V2/V3 and documents dark-grey early and silver later Germanium runs.

Gamechanger's Plasma Coil is especially valuable as a collaboration record: GPX documents the 2019 Third Man version with a six-position boost/octave selector replacing the standard Plasma voltage control. Preserve the Third Man relationship and variant controls as separate historical fields.

## Data rule reinforced
Annual coverage is a discovery source, not automatic launch proof. For Batch 44, unambiguous introduction dates are not being forced into the main product record unless the evidence is strong enough. The new runtime bridge therefore keeps `introduced_year` and generation start year null for research-only rows while preserving the census period as evidence text.

Explicit labels such as Limited Edition, V3, MKIV, Mini and 2019 Edition remain searchable variant states. Artist collaborations and named lineage remain relationships rather than product identity replacements.

## Public catalog status
Batch 44 is stored in:
- `research/modern-variant-discovery-44.tsv`
- `public/modern-variant-discovery-44.tsv`
- `public/catalog-extensions-91.js`

`public/catalog-recent-home.js` is the dynamic extension loader because the static index has previously exhibited stale-SHA behavior. Extension 91 is added to that dynamic sequence.

## Source checkpoints
- GPX 2019 New Guitar Pedals of the Year: https://www.guitarpedalx.com/news/gpx-blog/2019-new-guitar-pedals-of-the-year
- GPX 2019 Pedal Chain Year-End: https://www.guitarpedalx.com/news/gpx-blog/2019-pedal-chain-year-end-final-arrangement
- Cusack Screamer Fuzz Germanium: https://www.guitarpedalx.com/news/gpx-blog/3-flavours-of-cusack-musics-superb-screamer-fuzz---fuzz-overdrive-fuzzdrive-and-germanium/
- Demon Pedals Kondo-Shifuku: https://www.guitarpedalx.com/news/gpx-blog/demon-pedals---monstrously-divine-drive-and-fuzz-pedals-from-northwest-bavaria
- Third Man / Gamechanger Plasma Coil: https://www.guitarpedalx.com/news/gpx-blog/jack-whites-third-man-records-pedal-collaborations

## Next YARP target
**2018.** Continue the same historical descent using annual coverage, Winter/Summer NAMM reports, builder catalogs, retailer archives and contemporary interviews. Prioritize products with explicit generations, editions, collaborations and distinctive external identification clues. Continue backward year by year toward the 2000 boundary while allowing older foundational lineage discoveries to be attached where they clarify a later product's identity.
