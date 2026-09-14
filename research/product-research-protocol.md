# The Dirt Archive — Product Research Protocol

## Purpose

The Archive is a serious identification and historical reference, not merely a list of pedal names. Research should give a reader enough reliable visual, chronological and lineage information to determine what an example likely is, distinguish nearby variants, understand where it fits in the family, and see what remains uncertain.

## Identification-first principle

The primary question is not simply “what is this pedal?” It is also: **“What evidence would let a person identify this exact version rather than merely the family?”**

For important or confusing products, prioritize evidence visible on an intact pedal: enclosure geometry, dimensions when documented, finish, graphics, logo style, control count and wording, knob style, switch style, LED placement, jack placement, battery-door details, serial/date markings, country-of-origin text, construction traits, and documented production-era changes.

When supported, distinguish four levels:

- family identification
- model identification
- generation/version identification
- production/date-era identification

Never collapse variants merely because names overlap, and never separate them solely because collector lore says they are different.

## Comprehensiveness principle

The batch system is an execution method, not a ceiling on research depth. When a builder, family, or historically connected product is under active research, capture as much useful information as the available evidence supports.

Do not stop at the famous models. Include obscure, short-lived, regional, OEM, private-label, rebranded, transitional, retailer-branded and easily confused variants when they can be established. Capture alternate names, model-number variations, collector terminology, introduction and discontinuation evidence, factory and supplier changes, enclosure and artwork changes, control and labeling revisions, production technology changes, successor/predecessor relationships, cross-brand equivalents, and important disputes.

The goal is **high knowledge density**, not maximum word count. A concise set of highly specific identification clues is more valuable than a long generic biography. Deep effort is justified whenever it helps a reader identify, date, distinguish, authenticate, or contextualize an actual pedal.

## Research unit

Each product should eventually receive, where evidence exists:

- normalized model and family names
- aliases and common collector terminology
- earliest credible evidence / introduction window
- latest credible evidence / discontinuation window
- production status
- concise historical summary
- historical significance when useful
- generation/version breakdown
- exterior identification clues
- manufacturing country, factory or supplier changes when documented
- high-level component/circuit changes only when historically useful for identification
- serial/date-code and other external dating clues
- OEM, rebrand, licensing, collaboration and derived-design relationships
- predecessors, successors and closely related variants
- “how to tell them apart” notes for commonly confused models
- disputes, uncertainty and conflicting dates
- source records with URL, source type and confidence
- image lead when feasible
- image rights status kept separate from discovery status

## Depth tiers

Research effort scales with historical importance, catalog complexity and identification difficulty.

### Tier A — Landmark / difficult identification
Historically important, heavily revised, OEM-connected, commonly confused or otherwise difficult products. Full generation map, detailed external identification clues, lineage mapping, alternate terminology, disputed points and multiple strong sources where available. For exceptionally rich families, multiple overlapping production sub-eras may be more accurate than a single generation label.

### Tier B — Significant / moderately complex
Important products with meaningful production history but fewer difficult variants. Chronology, generation/version notes, identification clues, relationships and solid sources.

### Tier C — Straightforward catalog record
Limited variation or simpler history. Still provide introduction/discontinuation context, useful identity clues, relationships and at least one strong source. Do not inflate a simple record into an artificial essay.

Tier describes research effort, not historical importance.

## Evidence tiers

Use evidence tiers rather than filling gaps with guesses:

- **Verified:** primary manufacturer documentation, period advertising/catalog material, or strong surviving-object research with clear provenance.
- **Probable:** multiple independent specialist sources but not yet anchored by primary evidence.
- **Discovery:** useful lead requiring additional verification.
- **Unresolved:** conflicting or insufficient evidence. Preserve the uncertainty.

For claims that materially affect identification, prefer two independent sources where practical. Specialist research is valuable, but specialist consensus is not automatically manufacturer-confirmed fact.

## Handling disagreements

Historical effects research contains disputed dates, informal generation names and retrospective collector terminology. Preserve disagreements when they affect identification.

Do not turn a collector nickname into an official model name. Where sources disagree, present the strongest supported range and explain the uncertainty instead of silently choosing a convenient date.

## Lineage and OEM discipline

OEM and rebrand relationships are central to pedal history. Keep separate records when a branded example has its own identifiable enclosure, graphics, distribution or production history even when an OEM supplier or underlying design is shared.

Use precise relationship language such as: manufactured by, supplied by, branded by, distributed by, licensed from, derived from, successor to, predecessor to, related family.

Do not merge records simply because two pedals are similar internally, and do not imply independent designs where documented OEM lineage exists.

## Object-versus-circuit rule

**Document the object, not the recipe.** Do not add schematics, PCB layouts, complete bills of materials, gutshot libraries or cloning instructions merely because a source contains them. High-level circuit/component information is appropriate only when it materially helps distinguish documented production versions.

## Cross-linking strategy

As the database matures, related products should become navigational clues rather than isolated essays. Useful links include family members, major branded/OEM equivalents, direct successors/predecessors, original versus reissue branches, visually confusing near-neighbors, regional/manufacturing branches, alternate names and model-number variants.

A visitor looking at one pedal should be able to discover the relevant historical branch without already knowing the terminology.

## Image strategy

Every product should eventually have a compact front thumbnail where possible. Image records must distinguish `image_url`, `source_page`, `credit`, `license_or_permission`, `rights_status`, and `republish_status`.

Collector, marketplace and editorial images can be excellent identification references but remain non-public until permission/license is established. Discovery status and republication rights are always separate.

## Identity-key discipline

A product must be attached to the correct catalog object. Model names are not guaranteed to be unique across builders or branded OEM branches. Research ingestion should therefore prefer the catalog `pedal_id` plus builder context over model-name-only matching. This prevents two distinct objects such as identically named Sola Sound and Vox records from receiving the same dossier.

## Batch strategy

Work in manageable batches, prioritizing historically important and highly connected products first. Each batch should:

1. research the individual products as deeply as their importance and complexity warrant;
2. cross-check names and identity against the live catalog before attaching records;
3. use an unambiguous identity key, preferably `pedal_id`, where model names collide;
4. add structured metadata;
5. attach source records;
6. add generation maps when evidence supports them;
7. capture image leads separately from rights status;
8. render thumbnails only when explicitly cleared for public use;
9. update the breadcrumb with completed range, notable unresolved questions and the next queue.

Do not spend disproportionate time making five famous pedals perfect while leaving the rest blank. Build strong Tier A coverage, establish useful Tier B coverage across major builders/eras, move efficiently through Tier C, then return for deeper cross-linking, image clearance and disputed-history cleanup.

## Current product-depth direction

Builder enumeration is paused while product depth advances across the existing catalog. Priority remains:

- Maestro Fuzz-Tone family
- Shin-Ei / Univox Super-Fuzz family
- Tone Bender family and major branded/OEM variants
- MXR, BOSS, Fulltone, ProCo, Electro-Harmonix and Ibanez/Maxon families
- then systematic coverage of remaining discovery records in catalog order

The end goal is a database where someone can start with a pedal in hand, narrow down the family and version from visible evidence, understand the historical lineage, distinguish commonly confused variants, and see exactly how confident the Archive is in that identification.
