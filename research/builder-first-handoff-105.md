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
- Builder identity reconciliation exists at `research/builder-identity-reconciliation-01.tsv`.
- Builder-first research order exists at `research/BREADCRUMB.md`.
- Builder completion queue exists at `research/builder-completion-queue-01.tsv`.
- No additional individual-pedal record is being treated as the next automatic unit of work merely because it is interesting.

### Next target
Continue the queue builder-by-builder. For each builder, produce a canonical identity record and full OD/distortion/fuzz product inventory first. Periodically audit earlier census files for duplicates, aliases, OEM relationships, and omitted catalog products before declaring a builder complete.
