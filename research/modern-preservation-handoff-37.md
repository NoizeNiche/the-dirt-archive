# Modern Preservation Track Handoff 37

## YARP meaning

**YARP = resume the full Dirt Archive mission without waiting for confirmation.** Continue builder-first research, product discovery, production history, variants, generations, editions, lineage, identification clues, source reconciliation, preservation, and GitHub updates. The archive documents the object, not the recipe: do not publish gutshots, schematics, PCB layouts, complete BOMs, cloning instructions, or circuit-reconstruction material.

## Current position

The modern-preservation track has moved from **2022 into 2021**.

Batch 37 adds **53 2021 records** covering fuzz, distortion, overdrive, boost and gain hybrids. The batch intentionally mixes straightforward stompboxes with historically useful edge cases such as multi-circuit devices, artist collaborations, limited editions, and explicit V2/V3/MKII generations.

## 2021 census evidence

The primary discovery layer for this batch is Guitar Pedal X's 2021 annual category research. Its fuzz roundup began from roughly 60 candidates and selected 32 featured fuzzes. Its combined boost/overdrive/distortion roundup began from more than 70 candidates and selected 39 featured pedals. GPX also published a 40-pedal best-of-best field for 2021. These are **census/discovery sources**, not automatic proof that every listed pedal first launched in 2021. Keep introduction year, roundup year, revision year, edition year and current availability separate. citeturn2search0turn1view1turn3search12

## Important 2021 preservation notes

- **Boss FZ-1W**: November 2021 launch evidence gives a stronger introduction anchor than the annual roundup alone. Preserve Waza Craft and Vintage/Modern mode identity. citeturn3search7turn3search10
- **Boss TB-2W**: preserve as its own Waza Craft Tone Bender MkII object, not merely as another Tone Bender-style fuzz. GPX documented its voltage-selection behavior and recreation lineage. citeturn2search0
- **EarthQuaker Devices Hizumitas**: MusicRadar reported the November 4, 2021 release and identified it as a Wata/Boris collaboration based on Wata's Elk BM Sustainar. This is unusually strong artist/product lineage evidence. citeturn3search2
- **JHS PackRat**: preserve the nine-mode Rat selector as a product-level identification feature, with the individual Rat references retained as historical lineage rather than treated as nine separate PackRat products. citeturn2search0
- **Thermion Stone Age**: GPX awarded it Bronze in the 2021 best-of-best field. It is a five-circuit fuzz platform, making it especially valuable to preserve as a multi-family object. citeturn3search12
- **EAE Dagger V2 / Halberd V2**: GPX explicitly documented both as second-generation products, including the Dagger V2 Shift control and the Halberd V2 voice control. Do not collapse these into their earlier generations. citeturn3search4
- **Fjord Fuzz Odin V2**: preserve V2 independently from later Odin V3 records. The later GPX Fjord history explicitly identifies the current V3 as a further refinement of the second edition. citeturn0search8
- **2021 production conditions**: GPX's year-end fuzz research specifically noted continued parts-supply problems and delays into 2022. This matters when interpreting small-batch and edition histories from this period. citeturn2search0

## Batch 37 records

MOD-0190 through MOD-0242 are stored in:

- `research/modern-variant-discovery-37.tsv`
- `public/modern-variant-discovery-37.tsv`
- `public/catalog-extensions-84.js`

The extension is also wired into the existing runtime through `public/catalog-recent-home.js`, because the static `public/index.html` endpoint has repeatedly returned a stale content SHA when direct sequential updates are attempted. This preserves the current late-merge architecture without overwriting unrelated page changes.

## Research philosophy reinforced

1. **Discovery year is not introduction year.**
2. **Variant labels are data, not decoration.** V2, V3, MKII, Edition, Waza Craft and signature labels must remain searchable and independently preservable.
3. **Artist relationships can be historical lineage.** Hizumitas/Wata is a good example.
4. **Hybrid and multi-engine pedals deserve their own identities.** PackRat, Stone Age, Drowner and Atreides should not be flattened into generic fuzz/drive labels.
5. **Annual roundups are census sources.** They are excellent for discovering obscure builders and products, but primary launch material should upgrade claims whenever found.
6. **Preserve the object, not the recipe.** Functional controls, enclosure distinctions, production markings, editions, documented lineage and historical context are in scope; circuit reconstruction is not.

## Next target

**2020.** Continue the same breadth-first approach, using GPX's 2020 fuzz, boost/overdrive/distortion and best-of-best roundups as discovery maps, then reconcile the strongest records against primary builder material and contemporary reporting. After 2020, continue backward through the late 2010s before switching into deeper boutique-era historical reconstruction.

## Breadcrumb instruction

When the user says **YARP**, do not ask what to do next. Read this handoff if needed, continue from the next target, research, write the next batch, wire it into the catalog, update the breadcrumb, and report the useful discoveries.
