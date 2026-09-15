# The Dirt Archive Breadcrumb Addendum — 2026-09-15-22

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 28/29/30/31/32 handoff

Expanded the OEM/lineage audit into the Japanese vintage fuzz ecosystem, reconciled the strongest family relationships, completed model-exception passes for FY-6/FY-2 and Univox/Honey/Shin-Ei/Maxon, and added a focused Maxon/Ibanez manufacturing-exception ledger.

Committed:
- `research/japanese-oem-lineage-candidates-01.tsv`
- `research/japanese-oem-family-reconciliation-03.tsv`
- `research/fy6-fy2-model-exception-audit-01.tsv`
- `research/univox-honey-shinei-maxon-reconciliation-01.tsv`
- `research/maxon-ibanez-model-exception-audit-02.tsv`

## Historical findings

- Teisco Fuzz Machine remains a distinct marketed identity within the documented early-1970s Standard Fuzz family associated with Shin-Ei/Teisco and multiple distributor brands.
- Teisco TF-1 is retained as a Teisco-branded FY-6 Super Fuzz family state.
- Teisco Wau Wau Fuzz is retained as a likely Shin-Ei-built OEM family member alongside the Ibanez Wau Wau Fuzz and Guyatone FS-5, with builder wording kept qualified.
- Excetro, Bruno, Antoria, Mica and Ibanez Standard Fuzz No.59 are reconciled as related marketed states of the broader Standard Fuzz OEM family where the source supports that relationship.
- Suzuki Fuzz-Tone remains HOLD_FOR_REVIEW because evidence does not justify a firm Shin-Ei attribution.
- Guyatone FS-3 remains HOLD_FOR_REVIEW for direct factory attribution despite its historical relationship to the Honey/Shin-Ei ecosystem.
- FY-6 and FY-2 are separate model families despite their shared Shin-Ei/OEM ecosystem. Brand variants such as Teisco TF-1, Avora FY-6, Zenta FY-2, J.H. Experience FY-2/FY-6 and Rands FY-6 are retained as distinct marketed states rather than collapsed duplicates.
- Wattson Classic FY-6 is classified as a modern revival/reissue state, not as vintage Shin-Ei production.
- Honey Psychedelic Machine and Honey Baby Crying are retained as early states of the Super-Fuzz lineage, with Honey preserved as its own marketed identity.
- Univox U-1095 Super-Fuzz is treated as a marketed/OEM state within the Shin-Ei Companion FY-6 ecosystem; Unicord remains a distribution/marketing relationship rather than a physical-builder assignment.
- Companion WF-8 and Mayfair 6-Tr Fuzz Wah are documented as Shin-Ei OEM family members with multiple marketed labels; their marketed identities remain separate records.
- Maxon remains a separate Japanese manufacturing line. Shared Japanese provenance or the broader Ibanez/Maxon relationship is not being used to infer Maxon manufacture for Shin-Ei Super-Fuzz-family products.
- The Tube Screamer family now has an explicit manufacturing exception map: original TS-808/TS-9 production is tied to Nisshin Onpa/Maxon, while TS-5 was made in Taiwan by Daphon; later Taiwan-made TS-7 is not automatically assigned to Maxon; TS-9 reissue manufacture is split at the early-2002 end of Maxon's Ibanez production.

## Validation posture

The reconciliation confirms that early-family continuity, OEM production, distributor branding, and later revival relationships must remain distinct dimensions. Model-specific manufacturing exceptions are now explicitly documented where primary or high-quality historical sources support them.

No Japanese OEM relationship was promoted into `public/lineage.json` during this batch.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Cross-check Japanese OEM family relationships against the repo-wide duplicate/alias scan.
2. Continue model-specific exception work for later Shin-Ei-branded and OEM variants.
3. Add only builder-aware public edges once the runtime schema can distinguish builder/model entities.
4. Continue Japanese and regional builder/product census work.
5. Start a comparable model-exception audit for the next major OEM family, prioritizing European and American branded/OEM overlaps.

## Sources used this batch

- https://maxonfx.com/pages/about-maxon-guitar-effects-pedals-maxonfx-com
- https://www.premierguitar.com/gear/tube-screamer-history
- https://www.ibanez.com/usa/products/detail/ts808_99.html

## Continuity rule

Append another dated addendum after the next repository write batch.
