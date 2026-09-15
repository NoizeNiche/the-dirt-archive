# Builder-First Handoff 105

## Research phase: canonical builder census and full dirt-catalog enumeration

This handoff supersedes the previous default of mixing builder discovery with individual pedal archaeology.

### Governing order
1. Identify builders, manufacturers, OEM factories, marketed brands, private-label entities, distributors, collaboration entities, revival/reissue makers, and micro-builders connected to overdrive, distortion, or fuzz.
2. Reconcile duplicate builder names and aliases before creating additional canonical builder records.
3. For each canonical builder, enumerate the complete documented dirt catalog: fuzz, overdrive, distortion, and clearly relevant hybrid/bass dirt products.
4. Record catalog relationships, aliases, family names, known production corridors, and source trails without prematurely assigning exact manufacture dates.
5. Only after the builder/product universe is substantially mapped, return to individual pedal archaeology and populate detailed generation, production-period, specimen, and identification evidence.

### Why the change was necessary
The repository's existing census contains repeated builder names and genuine naming transitions. Examples include repeated Spicetone Music Technology, CopperSound Pedals, EBS, Gamechanger Audio, Frantone Electronics, A3 Stompbox, FengzaiPedals, Amuzik, Systech and FBT entries, plus relationship cases such as Nina Electronics → Audio Monk, ColorTone Fx → Pedal Tank, and Chase Bliss Audio / Chase Bliss. JAM Pedals and Jamés Pedals are intentionally kept separate because they are different builders.

### New working queue
`research/builder-completion-queue-01.tsv` is now the active breadth-first queue. Priority builders include large and/or regionally important catalogs such as Tym Guitars, EFX Custom Effects, Boot-Leg Hand Made Effects, Ovaltone, GoosoniqueWorx, Shin's Music, JAM Pedals, Sobbat, Leqtique, Plan-9, Cluster Effects, Hudson Electronics UK, Pigdog, DOD, BOSS, Electro-Harmonix, Ibanez/Maxon, Fulltone, Wampler, and ZVEX.

### Evidence discipline
Effects Database is useful as a discovery and cross-check source because it explicitly aims to include small builders and records both current and defunct products. Its own site notes that many early boutique brands existed mainly through eBay/forums and later disappeared, making builder-level census work essential. Primary manufacturer sources and period documentation should be preferred during completion and promotion.

### Duplicate handling rule
Do not delete historical names simply because they are duplicates in a marketplace or database. First decide whether the repeated name is:
- the same canonical builder;
- an alias or successor name;
- a separate legal/corporate entity;
- an OEM manufacturer versus marketed brand;
- a distributor/private-label relationship;
- a collaboration partner; or
- genuinely a different builder with a similar name.

Historical naming should normally be displayed inside builder/pedal lineage rather than multiplied into separate builder cards.

### Pedal-page rule
When a builder changed names, ownership, manufacturing location, or commercial identity, the relevant historical explanation belongs on the affected pedal pages and lineage records. The builder index should remain canonical and navigable.

### Current state
- Builder identity reconciliation exists at `research/builder-identity-reconciliation-01.tsv` and `research/builder-identity-reconciliation-02.tsv`.
- Builder-first research order exists at `research/BREADCRUMB.md`.
- Builder completion queue exists at `research/builder-completion-queue-01.tsv`.
- Canonical builder master ledger now exists at `research/builder-master-census-01.tsv`.
- No additional individual-pedal record is being treated as the next automatic unit of work merely because it is interesting.

### Pass 59 progress
The latest builder-census strata were audited and promoted into the canonical master ledger as a first consolidated identity layer. Important newly consolidated/flagged cases include:
- Schaller and Blackfield Orchester-Elektronik as separate historical German manufacturer nodes, with the documented OEM relationship preserved rather than merged.
- Kay / Uecks as an unresolved marketed/factory lineage, without assigning a physical factory prematurely.
- Martian Sound kept separate from Spaceman Effects while preserving Zak Martin's designer/creator lineage.
- O.C.E. Pedals retained as one builder with Hardware Fuzz → Wrench Fuzz → Wrench Fuzz V2 treated as product generations, not builder duplication.
- Colortone Pedals retained as the canonical builder with Colortone as an alias.
- Höfner kept as a marketed/instrument-maker entity while Schaller manufacturing involvement remains a relationship node.
- Firstman / Hillwood reconciled as one Japanese manufacturer/brand lineage, with Multivox retained as a separate customer/marketing entity.
- JEN Elettronica, Selmer (UK), Morley/Tel-Ray and related historical manufacturer nodes retained with OEM/brand distinctions intact.

This pass does **not** declare any of those builders catalog-complete. Identity normalization and catalog enumeration remain separate statuses by design.

### Next target
Continue the queue builder-by-builder. For each builder, produce a canonical identity record and full OD/distortion/fuzz product inventory first. Start with the highest-value incomplete catalogs, while continuing periodic duplicate/alias/OEM audits across the older census strata. Only after a builder's dirt catalog is substantially mapped should its individual pedals return to the deep archaeology queue.
