# YARP 2026-09-15 — Batch 16 Cross-Lineage Audit

## Purpose
Stress-test major public lineage edges before runtime integration. This batch focuses on relationships that can be mistakenly collapsed into one model, one builder, or one factory.

## Key decisions

- Sola Sound and Colorsound remain distinct searchable identities within one manufacturer/brand lineage.
- Colorsound Power Boost and Overdriver are treated as a documented naming/production transition, not unrelated products.
- Supa Tone Bender and Jumbo Tone Bender remain distinct searchable records. Their relationship is held for review because secondary historical sources differ on whether this is best represented as a renamed state, a reworked successor, or a distinct retail product.
- Sola Sound Tone Bender MkIV and the early-1970s Tone-Bender Fuzz remain separate retail states within the same historical corridor.
- DOD and DigiTech are distinct historical/current brand entities linked by corporate succession, not interchangeable builder names.
- BOSS and Roland remain distinct brand/corporate entities.
- Maxon/Nisshin Onpa and Ibanez remain distinct manufacturer/OEM versus marketed-brand identities.
- The Maxon relationship is not inherited automatically by Ibanez Soundtank. Soundtank manufacturer attribution remains model-specific or unresolved.
- Teisco Fuzz Machine and Shin-Ei remain an evidence-qualified factory relationship. No universal factory attribution is promoted.
- JEN Fuzz and Vox V828/V8281 remain linked by Italian OEM/contract lineage while UK Sola Sound Vox variants remain distinct.

## Editorial boundary
No schematics, PCB layouts, complete BOMs, cloning instructions, gutshot libraries, or circuit reconstruction material are included.

## Next move
Use only PROMOTE edges from this audit plus prior evidence-reviewed ledgers in the first public lineage runtime dataset. Keep HOLD_FOR_REVIEW edges out of the public graph until stronger documentation resolves them.
