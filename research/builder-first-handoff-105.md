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
- Canonical builder master ledger exists at `research/builder-master-census-01.tsv`.
- Tym Guitars now has a dedicated 76-product indexed-catalog inventory at `research/builder-catalog-tym-guitars-01.tsv`.
- No individual pedal has been promoted to deep archaeology merely because it is interesting.

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

### Tym Guitars catalog-completion pass
The Effects Database baseline currently lists **76 Tym Guitars products**. The new catalog inventory enumerates all 76 names in that indexed baseline. Of those, 69 are retained as dirt or dirt-adjacent products for the working catalog and 7 boost-only products are retained as scope-boundary records so the builder's broader catalog is not silently lost.

The builder chronology is now kept separate from the product list: Effects Database's Tim Brennan interview says the business was founded in 1997, first pedals appeared in 1998, and the line was substantially redone around 2008. Tym's own 2013 history describes an earlier seriously marketed pedal generation beginning around 2002. These are chronology anchors, not a synthetic single launch date.

Several useful family signals are now captured without prematurely doing version archaeology: the Cerberus series sits in the late-1990s history; the Big Mud/Mudd cluster contains multiple explicit named states; Tymexar has multiple distortion states; Overdrive Preamp/666 is documented as a DOD 250-derived product; This Machine Kills Fascists exists as separate distortion and fuzz versions; Fuzzerator is a later Big Mud-family state; and signature/limited products such as Fuzz Munchkin, Tatanka, Dead Meadow, Beauty & Ruin, Engine of Ruin, Seaweed Fuzz, Club 76 and Stranded are retained as separate catalog identities pending deeper history.

This pass therefore changes Tym Guitars from `NOT_ENUMERATED` to `INDEXED_BASELINE_MAPPED` in the master ledger. It does **not** declare the builder's lifetime catalog exhaustive, and it does not begin specimen/generation archaeology yet.

### Next target
Move to the next high-value incomplete builder, preferably EFX Custom Effects or another P0 catalog with a large, regionally important dirt footprint. Continue the same pattern: canonical identity → full indexed/catalog enumeration → relationship reconciliation → only then individual pedal archaeology. Periodically audit older census strata for duplicate names and omitted catalogs before declaring a builder corridor complete.
