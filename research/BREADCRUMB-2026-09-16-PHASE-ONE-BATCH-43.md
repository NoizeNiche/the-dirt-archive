# Phase One Batch 43 Breadcrumb

Date: 2026-09-16

## Batch
Batch 43 continues the builder-first census with a duplicate-prevention pass against the canonical master ledger before adding new entities. This batch expands coverage into Costa Rica, the Dominican Republic and Colombia.

## Builders added
- eQ.Circuitos — Costa Rica (Playa Herradura/Jaco); historical boutique operation associated with Alejandro Sauter. Strahl Fuzz is the clearest core dirt model recovered; Phuzzer is retained as a boundary record until its production scope is better reconstructed.
- Baldera Pedals — Dominican Republic; historical boutique operation associated with Miguel Baldera. Tube Tone and MOSFET Drive are independently documented surviving models.
- Rockerbox Music & Audio Devices — Colombia; boutique builder with surviving evidence for Johnny Drive and Freaky Blues OD, plus a custom Rockerbox Gustav specimen.

## Duplicate / relationship audit
- Candidate names were checked against the existing master builder census before this batch. eQ.Circuitos, Baldera Pedals and Rockerbox Music & Audio Devices did not have canonical entries in `research/builder-master-census-01.tsv` and were therefore treated as new builder entities rather than aliases of existing records.
- Existing broader Latin American builders remain distinct. Paradox Effects, Richón, Emma Dangers, Heartbreaker Audio, EFX Custom Effects, Plan-9, Sabbadius, Monstro Effects and other previously documented entities were not duplicated under these names.
- Rockerbox's Johnny Drive is preserved as a marketed model with a documented OCD-derived relationship. The custom Gustav fuzz is not promoted to a core family without stronger catalog evidence.

## Evidence / boundary notes
- eQ.Circuitos founder Alejandro Sauter places the operation in Playa Herradura/Jaco, Costa Rica and dates the line's first two launched pedals to roughly 2015-2016. Strahl Fuzz is explicitly described as his Big Muff-style interpretation with added mids and later density control.
- Baldera evidence is archival and fragmented. Tube Tone is documented in a 2016 used-pedal listing from the Dominican Republic, while a later Reverb listing identifies MOSFET Drive as a rare Baldera pedal made in the Dominican Republic. Do not infer lifetime completeness from these two surviving products.
- Rockerbox country-series coverage identifies the Colombian operation, while period user evidence preserves Johnny Drive and Freaky Blues OD. A separate player profile documents a custom Rockerbox Gustav fuzz specimen. Treat those sources as catalog/specimen evidence rather than proof of a complete current storefront.

## Research discipline
No schematics, PCB layouts, complete BOMs, gutshot libraries, cloning instructions, or circuit-reconstruction material added. Custom builds and modifications remain relationship/specimen records unless independent evidence establishes a standard production family.

## Next action
Run the same duplicate/OEM/alias cross-check before every subsequent builder addition. Continue geographic census expansion, then revisit INDEXED_PARTIAL builders where additional dated evidence can recover missing dirt models.
