# The Dirt Archive Breadcrumb Addendum — 2026-09-15-37

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 39 handoff

Extended the Italian manufacturing audit around EME, EKO, and JEN, with explicit separation of documented model-level manufacturing from broader production-network context.

Committed:
- `research/italian-eme-jen-eko-production-candidates-04.tsv`

## Historical findings

- EME is retained as a period-specific Italian manufacturer for the early V828 path based on Fuzzboxes evidence, while later V828 production is separately attributed to JEN.
- Vox wah/Crybaby production provides a clearer documented EME → JEN production switch: EME in Recanati, followed by JEN from mid-1969.
- JEN's own-branded fuzz products and the Elka, Luxor, Nova, and Unicord marketed states remain grouped as a well-supported Italian OEM family, but each marketed identity stays independently cataloged.
- EKO is retained as a broader Italian Vox production-network participant/candidate, not automatically assigned as the physical builder of every Vox pedal associated with the network.
- The often-repeated EKO → EME → JEN story remains useful historical context, but only model-specific evidence is promoted to builder attribution.
- No new public lineage edges were promoted because the current public lineage runtime is model-name based and does not yet safely express period-specific builder transitions.

## Validation posture

The strongest new distinction is between a documented factory switch and a generalized corporate/production relationship. EME and JEN can be promoted for specific models and periods; EKO remains contextual unless the individual model is independently evidenced.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Audit EKO-linked pedal models individually rather than inheriting factory attribution from the broader Vox production network.
2. Continue German/Austrian OEM reconciliation with model-specific evidence.
3. Cross-check the Italian candidate rows against the repo-wide alias/duplicate ledger.
4. Prototype builder-aware public relationship records with explicit `builder`, `period`, and `evidence_status` fields before promoting any new public edges.

## Sources used this batch

- https://fuzzboxes.org/transitionaltonebender
- https://www.voxshowroom.com/us/misc/jenwah.html
- https://www.voxshowroom.com/us/misc/clyde.html
- https://www.voxshowroom.com/us/misc/v828.html
- https://www.effectsdatabase.com/model/jen/fuzz
- https://www.effectsdatabase.com/model/elka/fuzz
- https://www.effectsdatabase.com/model/luxor/fuzz
- https://www.effectsdatabase.com/model/nova/tonebender
- https://www.effectsdatabase.com/model/unicord/fuzz
- https://www.voxsupreme.org.uk/vox_wah_wah_queens_award.html
- https://lefty.it/index.php/lefty/191-the-tonebender-file-pt-iv-la-storia-del-tonebender-e-del-fuzz-1966-67-tonebender-e-i-suoi-fratelli

## Continuity rule

Append another dated addendum after the next repository write batch.
