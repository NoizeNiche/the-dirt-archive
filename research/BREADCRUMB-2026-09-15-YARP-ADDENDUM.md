# The Dirt Archive Research Breadcrumb — YARP Addendum

Research run: 2026-09-15

This addendum extends `research/BREADCRUMB.md` without replacing the established master breadcrumb. It records work completed after the previous breadcrumb milestone and the active handoff for the next continuous YARP run.

## Completed since the previous breadcrumb milestone

### YARP batch 03 — major American / British catalog expansion
Structured breadth-first catalog ledgers were added for:
- Fulltone
- Wampler
- ZVEX Effects
- EarthQuaker Devices
- JHS Pedals
- Sola Sound / Colorsound

These remain catalog-completion targets unless independently promoted by evidence review.

### YARP batch 04 — OEM / rebrand reconciliation
The research layer was expanded to model manufacturer, marketed brand, OEM, private-label and production-transition relationships explicitly. The purpose is duplicate prevention and historically accurate lineage handling.

### YARP batch 05 — canonical relationship index
`research/canonical-relationship-index-01.tsv` was added. It records high-confidence and evidence-qualified relationships including:
- Sola Sound / Colorsound ↔ Vox, Marshall, Rotosound, Park and related marketed identities
- JEN Elettronica ↔ Vox V828 and related Italian OEM relationships
- Guild / Foxey Lady ↔ Mosrite and Electro-Harmonix production states
- Shin-Ei ↔ Companion, Honey and Univox relationships
- Nisshin Onpa / Maxon ↔ Ibanez and Greco relationships
- Coron Musical Instrument Co. ↔ Grant, Storm and Asama private-label relationships
- DOD ↔ DigiTech corporate / brand lineage
- BOSS ↔ Roland parent-company lineage
- MXR ↔ Jim Dunlop acquisition / revival lineage

## Current active YARP queue

The next breadth-first work should proceed in batches, not one builder at a time:

1. Expand the Japanese OEM/export network around Shin-Ei, JEN, Coron, Nisshin Onpa/Maxon, Honey, Teisco, Greco, Univox, Shaftesbury, Zenta, Rands, Royal, Mirano, Melos and Conrad.
2. Complete the strongest remaining P0/P1 catalog targets, especially builders whose current records are only discovery or indexed-baseline states.
3. Normalize duplicate product/model names across canonical builders before public promotion.
4. Keep marketed brands, physical manufacturers, distributors, successor names, revival makers and OEM factories distinct until model-specific evidence supports a relationship.
5. Do not begin isolated deep specimen archaeology merely because a famous pedal is interesting. Individual-pedal depth follows substantial builder catalog mapping.

## Public-site handoff

The public site currently has a static SPA architecture under `/public` with builder, category and pedal routes. Research UI already exposes research-status badges and source/generation counts. The normalized relationship layer should eventually feed a public lineage component, but only after the alias/product schema is stable and evidence-reviewed.

Do not expose internal research files, unresolved factory hypotheses, or low-confidence attribution as public fact.

## Research boundary

Continue to exclude schematics, PCB layouts, complete bills of materials, gutshot libraries, cloning instructions and circuit-reconstruction material. Component changes may be recorded only when they materially help identify a historical production state.

## YARP rule

When the user says `YARP`, continue without requesting confirmation. Work in meaningful batches across chronological and regional strata, update repository research artifacts, maintain the breadcrumb/addendum, and report after the batch has actually been completed.
