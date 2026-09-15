# The Dirt Archive Breadcrumb Addendum — 2026-09-15-22

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 28/29/30 handoff

Expanded the OEM/lineage audit into the Japanese vintage fuzz ecosystem, reconciled the strongest family relationships, and then completed a model-exception pass for the FY-6/FY-2 families.

Committed:
- `research/japanese-oem-lineage-candidates-01.tsv`
- `research/japanese-oem-family-reconciliation-03.tsv`
- `research/fy6-fy2-model-exception-audit-01.tsv`

## Historical findings

- Teisco Fuzz Machine remains a distinct marketed identity within the documented early-1970s Standard Fuzz family associated with Shin-Ei/Teisco and multiple distributor brands.
- Teisco TF-1 is retained as a Teisco-branded FY-6 Super Fuzz family state.
- Teisco Wau Wau Fuzz is retained as a likely Shin-Ei-built OEM family member alongside the Ibanez Wau Wau Fuzz and Guyatone FS-5, with builder wording kept qualified.
- Excetro, Bruno, Antoria, Mica and Ibanez Standard Fuzz No.59 are reconciled as related marketed states of the broader Standard Fuzz OEM family where the source supports that relationship.
- Suzuki Fuzz-Tone remains HOLD_FOR_REVIEW because evidence does not justify a firm Shin-Ei attribution.
- Guyatone FS-3 remains HOLD_FOR_REVIEW for direct factory attribution despite its historical relationship to the Honey/Shin-Ei ecosystem.
- FY-6 and FY-2 are separate model families despite their shared Shin-Ei/OEM ecosystem. Brand variants such as Teisco TF-1, Avora FY-6, Zenta FY-2, J.H. Experience FY-2/FY-6 and Rands FY-6 are retained as distinct marketed states rather than collapsed duplicates.
- Wattson Classic FY-6 is classified as a modern revival/reissue state, not as vintage Shin-Ei production.

## Validation posture

The exception audit confirms that family-level similarity, shared OEM production, and successor/revival relationships must remain separate from duplicate identity. No blanket FY-6/FY-2 merge was made.

No Japanese OEM relationship was promoted into `public/lineage.json` during this batch.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Cross-check Japanese OEM family relationships against the repo-wide duplicate/alias scan.
2. Continue model-specific exception work for later Shin-Ei-branded and OEM variants.
3. Add only builder-aware public edges once the runtime schema can distinguish builder/model entities.
4. Continue Japanese and regional builder/product census work.

## Sources used this batch

- https://www.effectsdatabase.com/model/shinei/companion/fy6
- https://www.effectsdatabase.com/model/jhexperience/fy2
- https://www.effectsdatabase.com/model/jhexperience/fy6
- https://www.effectsdatabase.com/model/teisco/tf1
- https://www.effectsdatabase.com/model/avora/fy6
- https://www.effectsdatabase.com/model/zenta/fy2
- https://www.effectsdatabase.com/model/rands/fuzz
- https://www.effectsdatabase.com/interviews/brands/wattson

## Continuity rule

Append another dated addendum after the next repository write batch.
