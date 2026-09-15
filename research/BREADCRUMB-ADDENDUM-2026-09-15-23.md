# The Dirt Archive Breadcrumb Addendum — 2026-09-15-23

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 29 handoff

Extended the Japanese OEM reconciliation pass using current historical evidence.

Committed:
- `research/japanese-oem-reconciliation-02.tsv`

## Findings

- Teisco Wau Wau Fuzz → Shin-Ei OEM: research-validated, high confidence.
- Teisco Fuzz Machine → Shin-Ei / Teisco OEM lineage: retained as medium-confidence because the evidence describes a broader Shin-Ei-developed / Teisco-manufactured OEM family rather than a single unequivocal factory assignment.
- Ibanez Standard Fuzz No. 59 → Teisco Japanese OEM family: high-confidence family relationship.
- Antoria Fuzz Machine → Ibanez / Shin-Ei OEM lineage: high-confidence.
- Guyatone FS-5 Wah-Fuzz: shared Japanese OEM family is clear, but exact builder attribution remains qualified.
- Guyatone FS-3: builder remains unresolved; the Honey-labeled PCB is treated as evidence of legacy parts/family connection, not proof of Honey or Shin-Ei manufacture.
- Suzuki Fuzz-Tone / Distorsion remains HOLD_FOR_REVIEW because available evidence conflicts with a simple FY-series Shin-Ei attribution.
- Bruno Fuzz Machine remains a high-confidence member of the broader Standard Fuzz OEM family, while exact factory allocation stays broader than a single-builder claim.

## Public-layer decision

No Japanese OEM edges were promoted into `public/lineage.json` during this batch. The current public lineage runtime remains model-name based, while these research records require builder-aware and family-aware relationship semantics.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Continue Japanese OEM handover reconciliation with model-specific evidence.
2. Separate family-level design lineage from physical-factory attribution.
3. Prepare a builder-aware public relationship schema before promotion.
4. Continue the 1960-2026 census and duplicate/alias review.

## Sources used this batch

- https://www.effectsdatabase.com/model/teisco/wauwaufuzz
- https://www.effectsdatabase.com/model/teisco/fuzzmachine
- https://effectsfreak.com/archive/effect/ibanez/standard_fuzz_no._59/index.html
- https://www.effectsdatabase.com/model/antoria/fuzzmachine
- https://www.effectsdatabase.com/model/guyatone/fs/5
- https://www.tonemachinesblog.com/2025/08/guyatone-fs-3-other-super-fuzz.html
- https://www.effectsdatabase.com/model/suzuki/fuzztone
- https://www.effectsdatabase.com/model/excetro/fuzzmachine

## Continuity rule

Append another dated addendum after the next repository write batch.
