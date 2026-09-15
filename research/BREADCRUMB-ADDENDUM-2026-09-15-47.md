# The Dirt Archive Breadcrumb Addendum — 2026-09-15-47

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 47 handoff

Extended the Applied Audio U.S. OEM audit into the Banshee and Goya-related fuzz/bass families, with a deliberate split between strong model-specific evidence and broader family reconstruction.

Committed:
- `research/applied-audio-oem-family-expansion-12.tsv`

## Historical findings

- Applied Banshee Fuzz is now recorded as a high-confidence Applied Audio family state, with Nomad Banshee retained as the marketed OEM identity.
- Goya Panther Box is upgraded from medium-confidence research-only to high-confidence research-validated within the Applied research layer. This reflects the combination of the 1967 Goya catalog evidence and the specialist reconstruction tying post-1966 Goya effects to Applied Audio. It is still not promoted to public lineage.
- Goya Fury Box is retained as medium-confidence research-only because the available evidence supports Applied family membership more strongly than an exact factory statement.
- Goya Boom Box No. 1006 is retained as medium-confidence research-only. The 1968 Goya catalog establishes U.S. manufacture, while specialist research attributes the Goya effects lineup to Applied.
- Applied Big Bass and Conrad Bass Hawk are logged as a related bass-boost family, but the naming conflict between Applied Audio and Applied Electronics sources is preserved instead of silently normalized.
- Applied Rogue receives a cross-check separating it from the Banshee despite shared enclosure/family characteristics.
- Nomad Super-Fuzz is explicitly isolated as unresolved. Later Nomad Banshee/Rogue relationships must not be back-propagated onto the earlier Super-Fuzz without model-specific evidence.

## Validation posture

The Applied map now distinguishes at least four useful evidence layers: direct Applied model attribution, marketed OEM states, family-level reconstruction, and unresolved legacy branding. The earlier Nomad Super-Fuzz remains a critical exception and should not inherit the later Applied builder identity.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Reconcile Applied labels against the repo-wide alias/duplicate ledger.
2. Audit additional Applied wah and Guild/Hohner cross-family states, especially VW-1 and the SP-5 / ME-30 chain.
3. Build the builder-aware public relationship schema with explicit `builder`, `period`, `evidence_status`, and `relationship_type` fields.
4. Resume German/Austrian OEM reconciliation after the Applied family audit reaches a clean stopping point.

## Sources used this batch

- https://www.tonemachinesblog.com/2023/03/the-bansheeeeeeeeeeeeee.html
- https://www.effectsdatabase.com/model/applied/banshee/fuzz
- https://www.effectsdatabase.com/model/nomad/banshee
- https://www.tonemachinesblog.com/2025/09/applied-fuzz-and-treble-booster-ft-100.html
- https://www.kitrae.net/music/Fuzz_Big_Muff_Timeline.html
- https://www.tonemachinesblog.com/2025/09/
- https://www.effectsdatabase.com/model/goya/boombox
- https://www.effectsdatabase.com/model/applied/bigbass
- https://www.effectsdatabase.com/model/nomad/superfuzz
- https://www.tonemachinesblog.com/2024/06/nomad-super-fuzz-rite.html
- https://www.effectsdatabase.com/model/applied/rogue

## Continuity rule

Append another dated addendum after the next repository write batch.
