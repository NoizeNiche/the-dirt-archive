# Modern Preservation Track Handoff 36

## YARP meaning
When Darren says **YARP**, resume the full Dirt Archive mission without waiting for confirmation: continue researching builders and dirt products, collect historical/product/production/variant/edition/lineage/identification evidence, update the GitHub catalog and research files, and refresh this breadcrumb.

## Current position
The modern-preservation track has moved from **2024 → 2023 → 2022**.

Batch 36 establishes a substantial **2022 census layer** using Guitar Pedal X's annual fuzz, distortion, and boost/overdrive surveys. GPX's 2022 fuzz survey covered a broad field of Muff, Fuzz Face, Tone Bender, Super-Fuzz, octave, germanium, silicon, gated, modulated and oscillating fuzzes. Its distortion survey identified 30 notable products, while the boost/overdrive survey covered 41 pedals. These annual pages are discovery/census evidence, not automatic proof that every product first launched in calendar 2022. Keep the archive's distinction between discovery year, introduction year, revision/generation year, and current availability.

## Batch 36 files
- `research/modern-variant-discovery-36.tsv`
- `public/modern-variant-discovery-36.tsv`
- `public/catalog-extensions-83.js`
- `public/catalog-recent-home.js` updated so the newest extension can load safely even though the current index file is resistant to the normal SHA update path
- `research/modern-preservation-handoff-36.md`

## Batch 36 scope
28 new product records were added:

### Fuzz
Bardic Audio Devices 2 Stroke Beaver; Big Ear Pedals Slice of Pie; Black Mass Electronics The First Herald V2; Coffee Shop Pedals Affogato; Colortone Fuzzball; Drunk Beaver Ivan Mazepa; Fjord Fuzz Berserk V2; Fjord Fuzz Freia; Frost Giant Electronics Soma V2; Heather Brown Electronicals Sensation Fuzzdrive; Reeves Electro Zo Silicon Zonk; Silktone Germanium Fuzz; Walrus Audio Eons; Zander Circuitry Cafetière.

### Distortion / preamp
Aura Amps White Sugar; Beautiful Noise Effects Exploder; Boss DS-1W Waza Craft; Drunk Beaver Trainer TS-100; Frost Giant Electronics Architect of Reality Snow Blind Edition; Gear Ant Yellow Jacket; KMA Machines Wurm 2; Sinvertek N5 MGAT-1 Hyper Preamp; Solar Guitars Chug; Soldano Super Lead Overdrive; Tone Ink Raven Brute & High Gain; Victory V1 The Jack; Zander Circuitry Terra Firma.

### Overdrive / gain
29 Pedals FLWR; All-Pedal Slamurai Bushido Drive; Colortone Parasite; Decibelics The Reverend; Drunk Beaver Bloom V2; DSM & Humboldt Silver Linings; EarthQuaker Devices Special Cranker; Hamstead Soundworks Subspace; Kernom Variable Mood; King Tone The Duellist V3; Spaceman Effects Redstone Mercury Series Germanium Preamp; ThorpyFX Scarlet Tunic.

## Particularly valuable 2022 preservation clues
- **Boss DS-1W:** Waza Craft edition should remain separate from the continuously produced DS-1 lineage. GPX explicitly notes the original DS-1's continuous production since 1978.
- **Frost Giant Architect of Reality Snow Blind Edition:** GPX records a 25-unit limited edition. This is unusually useful production-history evidence.
- **KMA Wurm 2:** compact revision with the previously internal voicing control brought to the exterior. Keep Wurm and Wurm 2 distinct.
- **Sinvertek N5 MGAT-1:** treat as a hyper-preamp rather than generic distortion. It is one of the most architecturally ambitious 2022 gain products in the census.
- **Walrus Eons:** five-state clipping/voice architecture plus variable voltage/starve is a strong external identifier.
- **Silktone Germanium Fuzz:** bias readout behavior is a distinctive identification clue.
- **Decibelics The Reverend:** preserve its explicit Expandora lineage and four-mode gain identity.
- **Drunk Beaver Bloom V2:** keep V2 separate from the original Bloom and preserve its expanded clipping/voice architecture.
- **EarthQuaker Devices Special Cranker:** preserve the 2022 product identity and its switchable germanium/silicon clipping concept.
- **Kernom Variable Mood:** record the augmented-analog / variable-clipping approach as an important early marker in Kernom's product lineage.
- **King Tone The Duellist V3:** explicit generation label, so V3 must not be collapsed into earlier Duellist records.

## Source discipline
Primary source work is still required for many Batch 36 records. GPX is being used as a strong contemporary discovery/census layer. Do not silently convert GPX's annual selection year into a confirmed launch year. Where primary builder pages, launch announcements, manuals, dated catalogs, retailer archives, or contemporaneous interviews can establish a more precise date or revision, enrich the record later.

## Important implementation note
The normal `public/index.html` SHA update path rejected the expected current blob SHA during this batch. Rather than stall the research, the batch was wired through the already-loaded `catalog-recent-home.js`, which dynamically loads extension 83. Extension 83 also performs a direct merge when `window.DATA` already exists, preventing a late-load race. This is a runtime workaround, not a reason to abandon the cleaner index-loading architecture. Revisit the index loader during a future maintenance pass and, if the GitHub connector accepts the current blob SHA normally, add `<script src="catalog-extensions-83.js"></script>` directly after extension 82 and remove the temporary dynamic loader from `catalog-recent-home.js`.

## Next target
**2021.** Start with the same three GPX annual census lanes: fuzz, distortion, and boost/overdrive. Then reconcile the strongest candidates against primary builder sources. Keep moving backward year by year, while also capturing older product generations whenever a modern candidate exposes a useful lineage.

## Editorial boundary
Continue documenting the object, not the recipe. Record visible/functional identification clues, builder history, production periods, revisions, editions, artist associations, lineage and source provenance. Do not publish gutshots, schematics, PCB layouts, complete BOMs, cloning instructions or circuit-reconstruction material.
