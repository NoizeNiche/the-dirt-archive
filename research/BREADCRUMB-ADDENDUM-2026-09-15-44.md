# The Dirt Archive Breadcrumb Addendum — 2026-09-15-44

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 44 handoff

Corrected the Hohner manufacturing map by separating two distinct OEM eras: Japanese Shin-Ei production for the MF-50 Master Fuzz Control, and later U.S. Applied Audio production for Hohner's FW-10, ME-30, and Tri Dirty Booster states.

Committed:
- `research/hohner-shinei-applied-oem-transition-09.tsv`

## Historical findings

- Hohner MF-50 Master Fuzz Control is now recorded as a Shin-Ei-built Japanese OEM state with high confidence.
- Hohner FW-10 Dirty Wah'er is recorded as an Applied Audio U.S. OEM state, distinct from the earlier Shin-Ei MF-50 relationship.
- Hohner ME-30 Multi-Exciter is recorded as an Applied Audio U.S. production state descended from the Shin-Ei-derived Surf/Siren effect family.
- Hohner Tri Dirty Booster is upgraded from unknown U.S. contractor to Applied Audio as a high-confidence research-validated attribution, based on newer specialist historical work. The older unknown-contractor evidence remains relevant as part of the provenance trail rather than being erased.
- Hohner therefore has multiple, sequential/parallel OEM relationships and should not be represented as one factory identity.

## Validation posture

The key correction is chronological: Hohner's effects business used different outside manufacturers. Japanese Shin-Ei production and later U.S. Applied Audio production must remain separate builder relationships even when the Hohner brand is unchanged.

No public lineage edges were promoted because current public lineage records do not yet encode builder, period, and evidence status together.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Continue German/Austrian OEM reconciliation beyond Hohner and Schaller.
2. Cross-check Hohner OEM states against the repo-wide alias/duplicate ledger.
3. Prototype builder-aware public relationship records with explicit `builder`, `period`, and `evidence_status` fields.
4. Continue the 1960-2026 builder/product census.

## Sources used this batch

- https://www.effectsdatabase.com/model/hohner/shinei/masterfuzzcontrol
- https://www.tonemachinesblog.com/2023/05/super-identity-crisis.html
- https://www.effectsdatabase.com/model/applied/fuzzwah
- https://www.tonemachinesblog.com/2025/09/surf-siren-wah-tornado.html
- https://www.effectsdatabase.com/model/guild/sp5
- https://www.tonemachinesblog.com/2025/09/applied-fuzz-and-treble-booster-ft-100.html
- https://www.kitrae.net/music/History_of_Big_Muff_Clones.html

## Continuity rule

Append another dated addendum after the next repository write batch.
