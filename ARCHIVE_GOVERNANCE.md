# The Dirt Archive: Governing Reference

**Status:** Canonical operating guidance
**Applies to:** Every research, data, content, image, code, validation, and deployment operation performed for this repository.
**Repository:** `NoizeNiche/the-dirt-archive`

## Core Rule

**Builder → Pedals → Photos → Information on the pedal**

This is the governing priority for the initial archive build.

## 1. Mission and Scope

The Dirt Archive is a practical visual reference for guitar dirt pedals spanning the **1960s through the current day**, beginning with **overdrive, distortion, and fuzz**.

The initial builder/catalog pass is intentionally narrow. Its purpose is to establish:

1. who the recognizable builder is,
2. which dirt pedals belong in that builder's catalog,
3. an exterior photograph that lets the visitor identify each pedal,
4. only the concise information needed at the catalog level.

Deeper history, engineering analysis, component research, and detailed variant documentation belong to later individual-pedal deep dives.

## 2. Builder Discovery

Continue searching the web for dirt-pedal builders across the full **1960s–current** time span.

Prioritize builders who produced **more than one dirt pedal**. Builders with multiple identifiable dirt pedals are especially valuable because they create meaningful catalog groups.

Current builders may often be researched more quickly because official catalogs, product pages, and photographs are readily available. Use that efficiency, but do not abandon historical builders or the older decades.

Do not stop after finding a small initial group of builders. Continue discovery until builder/pedal coverage is broad enough to make the archive a useful reference.

## 3. Builder-First Workflow

For each builder:

1. Establish the recognizable builder name.
2. Find the dirt pedals associated with that builder.
3. Create the builder record.
4. Create the pedal records.
5. Find exterior-only photos that clearly identify the pedals.
6. Add concise catalog information.
7. Preserve useful alternate names/relationships for later research without expanding the first-pass scope.
8. Validate the builder block.
9. Continue to the next builder.

Do not spend disproportionate time proving every historical detail about the builder.

## 4. What the First Pass Does NOT Cover

Do not turn builder discovery into a deep historical research project.

Do not deeply research or document:

- family history
- long biographies
- detailed company history
- factory history
- ownership chains
- employee histories
- corporate relationships
- elaborate OEM history
- manufacturing history beyond what is needed for basic identification
- circuit history
- component analysis
- transistor/resistor/capacitor differences
- schematics
- PCB analysis
- gutshots
- internal pedal photography
- engineering differences between variants
- exhaustive chronology
- every colorway, enclosure, graphic, knob, badge, hardware, or generation difference

Those subjects may be collected as background material for later **individual-pedal deep dives**, but they are not first-pass requirements.

## 5. Product Identity and Builder Separation

The archive must distinguish two situations.

### Same builder, same underlying product

When a single builder's product appears under minor naming, badge, label, color, enclosure, graphic, or cosmetic variations, use one recognizable product identity in the initial catalog.

Do not create a new first-pass pedal record merely because the same builder's pedal has:

- a different colorway,
- a different enclosure,
- different graphics,
- different knobs or hardware,
- a different component set,
- another generation or production revision.

Save those details for the later pedal deep dive.

### Different recognized builders, same or similar product name

**Keep them separate.**

For example:

- **Dallas-Arbiter Fuzz Face** is its own catalog entry under Dallas-Arbiter.
- **Jim Dunlop Fuzz Face** is its own catalog entry under Jim Dunlop.

Do not collapse them into one Fuzz Face entry merely because they share a product name or broad lineage.

The archive is organized around the recognized builder/product pairing in the initial pass.

This distinction is mandatory.

## 6. Recognized Names and Alternate Names

Use the most recognizable product name **within the builder's catalog** for the public first-pass record.

When the same underlying product has alternate branding, manufacturer names, distributor labels, private-label names, or historical wording:

- keep one primary recognizable product identity in the builder catalog,
- preserve alternate names in background metadata/research notes where useful,
- do not create unnecessary duplicate public records under the same builder,
- do not merge a separate recognized builder's version into another builder's record.

Detailed cross-builder lineage, licensing, OEM relationships, badge engineering, and manufacturing connections are future deep-dive material.

## 7. Exterior Photography Only

For the initial archive, **all pedal photography is exterior-only**.

The photo's primary job is simple:

> **Show the visitor what pedal it is.**

Use clear exterior/reference views such as:

- front
- rear
- side
- top/angle
- packaging when useful for identification
- catalog/advertisement imagery when it clearly identifies the product

**Do not seek or publish internal pedal imagery during the first pass.**

That means no:

- gutshots
- PCB layouts
- schematics
- circuit diagrams
- internal component photographs
- internal forensic imagery

Do not pursue internal shots as part of the builder research workflow.

## 8. Colorways, Enclosures, and Technical Variants

There will be many products with different colorways, enclosure types, graphics, hardware, components, and production variations.

**Do not fall down that rabbit hole during builder discovery.**

For the first pass:

- identify the product,
- show a representative exterior image,
- record enough appearance information to prevent an obvious identification error,
- move on.

Detailed variant documentation is explicitly deferred until the individual-pedal deep-dive phase.

## 9. Concise Pedal Information

The initial pedal record should normally include:

- stable pedal ID
- builder ID
- recognizable product/model name
- alternate names as background metadata where useful
- dirt category
- concise identification information
- exterior photo
- source link(s)
- research state

The first-pass catalog is not intended to contain long historical essays.

## 10. Simple Builder Records

A builder record should normally include:

- stable builder ID
- recognizable builder name
- useful aliases/alternate names
- concise identity/profile information
- dirt pedals in the builder's catalog
- source links
- research state

Do not require extensive biographies or company histories.

## 11. Evidence and Provenance

The visible catalog should remain concise, but the archive still needs a source trail.

For builder/pedal associations and photographs, preserve useful provenance such as:

- source URL
- source title/description when useful
- image credit when applicable
- brief evidence note when needed

Use the supplied source links whenever they provide useful pedal information or exterior imagery.

Do not silently convert uncertain information into fact.

## 12. Uncertainty

It is acceptable for a record to say:

- Unknown
- Unconfirmed
- Likely
- Possibly
- Attribution disputed
- Source conflict

During the builder pass, do not spend excessive time eliminating every uncertainty. Record it when necessary and continue the catalog-building work.

## 13. Single Source of Truth

The repository must maintain **one canonical production catalog**.

Rules:

- Public records come from canonical data only.
- Runtime code must never invent catalog records.
- Discovery material must not silently become production data.
- Provisional records must not masquerade as complete records.
- Derived files, indexes, manifests, and generated assets are subordinate to canonical data.
- Every derived artifact must be reproducible from the canonical catalog.

The website is a presentation layer, not the source of truth.

## 14. Research vs Published Data

Keep research material separate from the verified public catalog.

Research may include:

- candidate builders
- unresolved matches
- alternate names
- cross-builder relationships
- conflicting sources
- missing exterior photos
- future variant/deep-dive notes

The public catalog should contain only the simple builder and pedal records intended for first-pass publication.

## 15. Stable IDs

Every builder and pedal must have a stable unique ID.

Examples:

- `BLD-000001`
- `PED-000001`

IDs do not change because a name changes, records are sorted, variants are reorganized, or the website is redesigned.

Names can change. IDs do not.

## 16. Duplicate and Variant Handling

Do not silently create duplicate records within a builder catalog.

Do not silently merge potentially distinct products.

Use these rules:

- same builder + same underlying product + cosmetic/technical variation = one initial catalog entry,
- same product name + different recognized builder = separate catalog entries,
- uncertain whether two records are actually the same product = flag for review,
- detailed variants and component differences = future deep-dive material.

## 17. Validation

Every material catalog change must be validated before publication.

At minimum validate:

- unique builder IDs
- unique pedal IDs
- valid builder references
- no orphaned pedal records
- valid record structures
- source links attached correctly
- photo records attached to real pedals
- no broken internal references
- no accidental duplicate public records within a builder
- no accidental merging of separate recognized builder/product identities
- first-pass pedal images are exterior-only

If validation fails, do not publish the broken state.

## 18. Website Architecture

The preferred direction is:

`canonical data → validation → build → website`

Avoid:

- runtime catalog invention
- hidden bootstrap records
- provisional builders injected by frontend code
- competing production datasets
- special-case patches that hide data problems
- frontend guesses that make incomplete records appear complete

The public interface should feel like a clean vintage catalog/reference, not a database administration panel.

## 19. Checkpoints

Work in durable checkpoints so a large catalog cannot be destroyed by one bad operation.

Meaningful checkpoints should leave the repository buildable and inspectable.

Never trade catalog integrity for a larger visible record count.

## 20. Change Discipline

Before any operation:

1. Read this governing reference.
2. Identify the current source of truth.
3. Check what depends on the target data.
4. Make the smallest coherent change.
5. Validate.
6. Commit a recoverable state.

When an architectural problem is found, fix the underlying model rather than accumulating patches.

## 21. Lessons From the First Build

The first build accumulated too many interacting mechanisms and drift-prone layers.

The corrective principles are:

- one canonical catalog,
- builder first,
- prioritize builders with multiple dirt pedals,
- cover 1960s–current,
- use current-builder availability to accelerate research when practical,
- keep the public record simple,
- exterior photographs only,
- do not chase internal pedal imagery,
- do not dive into component rabbit holes,
- do not exhaustively document colorways/enclosures/technical revisions yet,
- keep separate recognized builder/product identities separate,
- group only same-builder naming/cosmetic variants under one initial product identity,
- save deeper relationships for later pedal deep dives,
- preserve source provenance,
- use stable IDs,
- validate before publishing,
- keep the website replaceable,
- protect the catalog above the website.

## 22. Mandatory Operating Question

Before performing **any** operation on The Dirt Archive, ask:

> **Does this operation stay focused on Builder → Pedals → Photos → Information, cover the 1960s–current span, prioritize builders with multiple dirt pedals, use exterior-only photos, avoid internal/component research, avoid premature variant rabbit holes, keep separate recognized builder/product identities separate, group only same-builder naming/cosmetic variants, preserve provenance, and protect the canonical catalog?**

If not, change the operation before executing it.

## 23. Non-Negotiable Summary

**Builder → Pedals → Photos → Information**

**1960s–current.**

**Prioritize builders with multiple dirt pedals.**

**Current builders can be researched efficiently, but historical coverage remains required.**

**Do not turn the builder pass into a history project.**

**Exterior photos only.**

**Do not seek internal shots.**

**Do not chase components or technical rabbit holes yet.**

**Do not fully document colorways, enclosure revisions, or other variants yet.**

**Same builder + same underlying product = one first-pass catalog entry.**

**Different recognized builder + same product name = separate catalog entry.**

**Example: Dallas-Arbiter Fuzz Face and Jim Dunlop Fuzz Face remain separate entries.**

**Use the most recognizable name within each builder's catalog.**

**Keep alternate names and deeper relationships for later pedal deep dives.**

**One canonical catalog.**

**Stable IDs.**

**Validate before publishing.**

**Protect the catalog above the website.**
