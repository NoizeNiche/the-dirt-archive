# Early Foundational Handoff 105

## Pass 58: canonical builder identity, duplicate reconciliation, and builder-census-first reset

### Strategic correction
The research program is now explicitly organized as:

**Builder census → builder identity reconciliation → complete builder dirt catalog → individual pedal archaeology → public promotion.**

The purpose of this reset is to prevent the public site from accumulating duplicate builder cards when the same historical entity appears under a renamed company, shortened brand name, successor name, OEM identity, distributor badge, collaboration label, or repeated census entry.

### Identity work established
A dedicated reconciliation file now lives at `research/builder-identity-reconciliation-01.tsv`.

Known repeated or naming-variant cases include:
- Spicetone Music Technology
- CopperSound Pedals
- EBS
- Gamechanger Audio
- Frantone Electronics
- A3 Stompbox
- FengzaiPedals
- Amuzik
- Systech
- FBT
- Cause & Effect Pedals / CE Pedals
- Chase Bliss Audio / Chase Bliss
- Vemuram / Vemuram Custom Pedals
- JEN / JEN Elettronica
- Selmer naming variants

The reconciliation file also records cases that must **not** be merged, such as JAM Pedals vs Jamés Pedals, and collaboration relationships such as ThorpyFx/Redbeard Effects and Third Man Hardware/Beetronics.

### Builder-page rule
The canonical builder entity becomes the navigation identity. Former names, alternate labels, successor relationships, OEM relationships, distributor labels, ownership changes, collaborations, and manufacturing transitions remain part of the builder lineage and can be surfaced on the relevant pedal pages where they explain that pedal's historical identity.

This means a user should not encounter three builder cards for one historical company merely because the company changed names. The archive should instead show one builder lineage and explain the naming transition inside the historical context of the affected products.

### Catalog rule
No new individual pedal should be promoted merely because it is interesting. Once a builder is identified, the first task is to enumerate **all documented overdrive, distortion, and fuzz products** associated with that canonical builder. Famous products receive no special privilege over obscure catalog entries during this stage.

For large companies and brands, track explicit enumeration status so the archive can tell the difference between:
- builder discovered
- dirt catalog partially enumerated
- dirt catalog substantially enumerated
- dirt catalog audited

### Existing deep records
The existing REC-1 through current reconciliation records remain useful and should not be discarded. They are historical work already performed. During later audit passes, attach them to the correct canonical builder rather than recreating them as duplicate builder identities.

### Public-site implication
The public site should eventually display one canonical builder card per reconciled entity. Historical names and relationships should be visible as lineage information, not as accidental duplicates in the top-level builder index.

### Evidence rule
Do not collapse two builders solely because they share a model lineage, use the same enclosure, appear in a related-model database, or are described as a copy. Merge only when builder identity, successor relationship, ownership relationship, OEM relationship, or branded lineage is supported by evidence.

Likewise, do not split a builder solely because the company changed name, moved country, introduced a new brand, or operated under a successor label when evidence establishes continuity.

### Next pass target
Pass 59 should continue the builder census itself rather than pedal archaeology. Priorities:

1. Audit every existing builder record for exact-name duplicates and obvious aliases.
2. Add unresolved builder candidates from historical/OEM and regional research.
3. For high-priority builders, enumerate the complete dirt catalog before performing more version archaeology.
4. Maintain separate queues for manufacturer, marketed brand, OEM, distributor, collaboration, and successor relationships.
5. Only after a builder's dirt universe is substantially mapped should detailed pedal-level records resume for that builder.

Priority gaps remain South Asia, Southeast Asia, Latin America, Eastern Europe, Africa, obscure 1960s-1990s manufacturers, Japanese domestic-market brands, OEM/private-label relationships, and micro-builders from the 2000s-2010s.

### Site state
- `research/BREADCRUMB.md` now governs the builder-first → canonicalize → catalog-complete → pedal-depth workflow.
- `research/builder-identity-reconciliation-01.tsv` is the first dedicated canonical identity map.
- No new public pedal extension is required for this reset pass.
- Future public additions should use reconciled builder identities rather than introducing another duplicate builder card.
