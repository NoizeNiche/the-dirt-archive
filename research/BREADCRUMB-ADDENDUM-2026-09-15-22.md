# The Dirt Archive Breadcrumb Addendum — 2026-09-15-22

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 28 handoff

Expanded the OEM/lineage audit into the Japanese vintage fuzz ecosystem, concentrating on Teisco, Shin-Ei and related branded products.

Committed:
- `research/japanese-oem-lineage-candidates-01.tsv`

## Historical findings

- Teisco Fuzz Machine is documented as part of a broad early-1970s Japanese OEM family associated with Shin-Ei/Teisco, with linked marketed versions including Ibanez Standard Fuzz No. 59 and multiple distributor brands.
- Teisco TF-1 Fuzz is documented as a Teisco-branded FY-6 Super Fuzz within the larger Shin-Ei OEM family.
- Teisco Wau Wau Fuzz is documented as likely Shin-Ei-built and closely related to the Ibanez Wau Wau Fuzz and Guyatone FS-5 Wah-Fuzz; exact builder language remains qualified.
- Guyatone FS-3 contains a Honey-labeled PCB and a plausible post-Honey continuation/reuse relationship, but the surviving evidence does not justify assigning a specific factory with confidence.
- Suzuki Fuzz-Tone / Distorsion remains a deliberate mystery/HOLD candidate despite collector evidence associating some Suzuki-branded products with Shin-Ei.

## Validation posture

High-confidence relationships were logged only where the source explicitly supports an OEM family or branded sibling relationship. Model-specific factory attribution remains qualified where the source itself is uncertain.

No Japanese OEM relationship was promoted into `public/lineage.json` during this batch.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Reconcile Teisco/Shin-Ei family entries against the existing duplicate/alias scan.
2. Audit FY-6, FY-2 and later Shin-Ei-branded variants for model-specific exceptions.
3. Add only builder-aware public edges once the runtime schema can distinguish builder/model entities.
4. Continue Japanese and regional builder/product census work.

## Sources used this batch

- https://www.effectsdatabase.com/model/teisco/fuzzmachine
- https://www.effectsdatabase.com/model/teisco/tf1
- https://www.effectsdatabase.com/model/teisco/wauwaufuzz
- https://www.effectsdatabase.com/model/guyatone/fs/3
- https://www.effectsdatabase.com/model/suzuki/fuzztone

## Continuity rule

Append another dated addendum after the next repository write batch.
