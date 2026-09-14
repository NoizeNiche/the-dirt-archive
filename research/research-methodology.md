# The Dirt Archive — Research Methodology

## Purpose

The Dirt Archive should feel complete because its research process is systematic, not because every obscure pedal is immediately documented to maximum depth. The project therefore progresses from breadth to depth.

## Research hierarchy

### Level 1 — Builder Census

Identify as many relevant dirt-pedal builders, manufacturers, OEM producers, private-label manufacturers, historical companies and significant regional makers as can be reasonably documented.

At this level record only enough to establish the builder:

- Builder name
- Country / region
- Approximate operating period
- Active / inactive status
- Aliases and successor relationships
- OEM / private-label relationships when known
- Evidence that the builder made relevant dirt products
- Primary source references
- Confidence / research status

The goal is to answer: **Who made dirt pedals?**

### Level 2 — Builder Catalog

For each identified builder, enumerate the products they made in the project's scope.

Each discovered product gets a lightweight catalog record:

- Exact model name
- Category
- Approximate production period when known
- Country / production region when known
- Known aliases
- OEM / private-label context
- Discovery sources
- Discovery confidence

The goal is to answer: **What did this builder make?**

Do not prematurely expand every product into a variant tree at this stage.

### Level 3 — Catalog Completeness Audit

Before declaring a builder's catalog exhausted, audit the major source classes:

- Manufacturer catalogs and manuals
- Manufacturer archive pages
- Archived websites
- Distributor catalogs
- Period advertisements
- Specialist historical references
- Collector databases and reference sites
- Museum / collection material
- OEM documentation
- Reissue and successor documentation

Assign a completeness state rather than claiming absolute certainty:

- `CENSUS_ONLY` — builder identified, catalog work not started
- `DISCOVERY_IN_PROGRESS` — products still being enumerated
- `CATALOG_STABLE` — broad product inventory established
- `COMPLETENESS_AUDIT` — systematic source review underway
- `CATALOG_COMPLETE` — no obvious gaps after the defined audit
- `CATALOG_COMPLETE_WITH_GAPS` — best-known catalog established, but documented uncertainty remains

The goal is to answer: **Have we probably found everything this builder made?**

### Level 4 — Product Research

Only after the builder catalog is sufficiently stable should deep product research begin.

For each product document, as evidence supports:

- Historical identity
- Origin and chronology
- Naming terminology
- Related products
- OEM / private-label relationships
- Reissues and recreations
- Common identification errors
- Primary and secondary sources
- Uncertainty and disputed claims

The goal is to answer: **What exactly is this product and where does it belong historically?**

### Level 5 — Generation Research

Map meaningful production eras and revisions.

Generation records should capture:

- Approximate date range
- External identification clues
- Enclosure / artwork changes
- Controls and switching changes
- Production location
- Documented manufacturing transitions
- Relationship to preceding and following generations
- Confidence

A generation is not created merely because a paint color changed.

### Level 6 — Variant Research

Separate three independent axes:

1. **Appearance identity** — enclosure, graphics, finish, labeling, knobs, hardware.
2. **Production identity** — factory, country, board/build generation, manufacturing revision, regional issue.
3. **Electronics identity** — documented changes to the electrical implementation or component family.

A cosmetic edition remains cosmetic unless evidence establishes a production or electronics distinction. Conversely, visually similar examples must not be collapsed when evidence indicates materially different production or electronics identities.

Useful relationship fields may include:

- `variant_group`
- `parent_product_id`
- `same_circuit_as`
- `appearance_only`
- `electronics_change`
- `oem_relationship`
- `reissue_of`

### Level 7 — Specimen Research

Once the product and variant structure is understood, document surviving physical examples.

Each specimen may contain:

- Stable specimen identifier
- Builder
- Product / family
- Variant identity
- Era
- Appearance
- Production identity
- Electronics identity when independently documented
- Photograph source
- Credit
- Rights / republication status
- Identification confidence
- Notes on what can and cannot be inferred from the exterior

Image discovery and image rights are always separate. Reference-only photographs must not be silently embedded as Archive assets.

### Level 8 — Lineage / OEM Graph

Build cross-builder relationships after the underlying product records are stable enough to support them.

Examples include:

- OEM products
- Private-label versions
- Licensed products
- Successor / predecessor relationships
- Shared manufacturing
- Reissues
- Regional branches
- Related design families

Lineage is additive. It must not overwrite the identity of the individual product records.

### Level 9 — Visual Identification

Use the accumulated evidence to create practical identification tools.

Identification should compare:

- Enclosure geometry
- Graphics and logos
- Control names and placement
- Switch / treadle arrangement
- Labeling
- Production location clues
- Date / serial clues when documented
- Known generation markers
- Confirmed electronics distinctions when independently established

The objective is not simply to display pedal photographs. The objective is to let the Archive help a reader answer: **Which exact historical object do I have?**

## Research status vocabulary

Use explicit states instead of implying completion:

- `DISCOVERED` — existence identified.
- `CATALOGED` — product or builder has a structured record.
- `VERIFIED` — credible evidence supports identity and existence.
- `CATALOG_STABLE` — broad builder/product inventory established.
- `CATALOG_COMPLETE` — systematic completeness audit found no obvious omissions.
- `DEEP_RESEARCHED` — historical/product analysis substantially documented.
- `VARIANT_MAPPED` — meaningful generations and variants mapped.
- `SPECIMEN_MAPPED` — representative physical examples documented.

Multiple states may apply at different levels. A rare pedal can be `CATALOGED` while still remaining `VARIANT_RESEARCH_PENDING`.

## Active work queues

### Queue A — Builder Discovery
Find builders not yet represented in the census.

### Queue B — Builder Catalog Completion
For identified builders, enumerate and verify as many dirt products as evidence supports.

### Queue C — Completeness Audit
Systematically challenge apparently complete builder catalogs with additional source classes and historical material.

### Queue D — Product Depth
Deep-research products after their builder catalog is stable enough.

### Queue E — Variant / Specimen Archaeology
Map generations, variants, OEM branches and physical specimens after product identity is established.

## Operating rule
Breadth precedes depth. Interesting historical rabbit holes are valuable, but they do not replace census and catalog completeness work.

Existing deep research is not discarded. It becomes a head start for the later product-depth passes.

## Editorial rule
**Document the object, not the recipe.**

Research depth is encouraged. Unsupported certainty is not. Do not publish gutshots, schematics, PCB diagrams or complete circuit recipes.
