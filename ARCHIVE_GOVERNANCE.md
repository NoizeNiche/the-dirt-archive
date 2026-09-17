# The Dirt Archive: Governing Reference

**Status:** Canonical operating guidance  
**Applies to:** Every research, data, content, image, code, validation, and deployment operation performed for this repository.  
**Repository:** `NoizeNiche/the-dirt-archive`

## 1. Mission

The Dirt Archive is a practical visual reference for guitar dirt pedals, beginning with **overdrive, distortion, and fuzz**.

The archive is intentionally narrow. The goal is to let a visitor identify **who made the pedal, what dirt pedals they made, and what the pedal looks like**. Deeper historical research belongs to later individual pedal deep dives, not the initial builder catalog.

## 2. Governing Priority

Every operation follows this hierarchy:

**Builder → Pedals → Photos → Information on the pedal**

This order is not optional.

1. Establish the builder name.
2. Associate the builder's dirt pedals.
3. Attach a clear **exterior-only** photograph that lets the visitor identify the pedal.
4. Add only the concise information needed to identify or understand that pedal at the catalog level.

## 3. Scope: What We DO NOT Do in the Builder Pass

The builder catalog is deliberately limited.

**Do not go deeply into:**

- family history
- detailed company history
- manufacturing history
- factory history
- ownership chains
- employee histories
- corporate relationships
- elaborate OEM histories
- circuit history
- component analysis
- schematics
- PCB analysis
- gutshots
- internal pedal photography
- long biographies
- exhaustive chronology
- detailed explanations of why related companies or products are connected
- any other research that goes materially beyond identifying the builder, their dirt pedals, and the pedal's exterior appearance

Those subjects may be appropriate for later **individual pedal deep dives**. They are not requirements for the first-pass builder archive.

Do not spend time turning a builder profile into a historical essay. Keep the builder record functional and catalog-focused.

## 4. Builder Discovery Standard

Continue searching the web for builders that produced dirt pedals, with particular attention to builders that produced **more than one dirt pedal**.

The purpose of this research pass is discovery and useful catalog coverage, not exhaustive historical scholarship.

Keep researching builder candidates until the discovered builder/pedal coverage is substantial enough to make the archive a useful broad reference. Do not stop merely because a small initial group of builders has been found.

Prioritize builders with multiple identifiable dirt pedals so that the archive develops meaningful builder catalogs rather than a long list of one-off records.

## 5. Builder-First Research

For each builder candidate:

1. Establish the most recognizable builder name for the archive.
2. Determine which dirt pedals are associated with that builder.
3. Add the pedals to that builder's catalog.
4. Find a clear **exterior-only** reference photograph for each pedal.
5. Add only concise pedal-level identification information for the initial catalog.
6. Preserve alternative names and attribution details for possible future deep dives without allowing them to clutter the main builder catalog.
7. Move on to the next builder candidate.

Do not repeatedly re-research settled builder history. Research effort should go toward discovering builders, matching their dirt pedals, locating useful exterior photos, and filling the minimum information needed for the catalog.

## 6. Canonical Naming and Product Grouping

The archive uses the **most recognized name** as the primary public-facing identity when multiple names refer to what is effectively the same product.

Examples of situations that should generally be grouped under one recognized product identity include:

- the same pedal sold under different brand names
- the same product released with different badges or labels
- the same product manufactured by multiple companies
- private-label or distributor versions of the same pedal
- alternate historical names for the same underlying product

For the initial builder catalog:

- **Lump the names together under the most recognized name.**
- Do not create separate public pedal entries merely because the same pedal appeared under another brand or manufacturer name.
- Preserve the alternate names, manufacturers, and branding information as hidden/background metadata, research notes, or future deep-dive material.
- Do not spend builder-pass research time resolving every manufacturing or corporate relationship.

This grouping rule is specifically intended to keep the first-pass archive clean and useful. Detailed variant, OEM, badge-engineering, and manufacturing relationships belong in later individual pedal deep dives.

## 7. Variant and Appearance Scope for the First Pass

The first-pass builder catalog is **not** the place to fully document every colorway, enclosure revision, graphic change, badge variation, knob set, hardware variation, or generation distinction.

For now:

- Find an exterior photo that clearly identifies the pedal.
- Use the primary recognized product identity.
- Do not expand one product into many public records solely because of colorways, enclosure styles, or cosmetic revisions.
- Record only enough appearance information to prevent a basic identification mistake.
- Save detailed colorway, enclosure, graphic, hardware, and generation documentation for the later individual-pedal deep-dive phase.

A pedal can therefore have many visual variants without becoming many first-pass catalog entries.

## 8. The Single Source of Truth

The repository must have **one canonical production catalog**.

Rules:

- Public records come from canonical data only.
- Runtime code must never invent catalog records.
- Discovery material must never be silently merged into production.
- Provisional data must never masquerade as verified data.
- Derived files, indexes, manifests, search indexes, and generated assets are subordinate to canonical data.
- Every derived artifact must be reproducible from canonical data.
- If a record is not in the canonical catalog, it is not a published archive record.

## 9. Separation of Research, Catalog, and Presentation

Keep three conceptual layers separate:

### Raw research
Web findings, candidate builders, alternate names, possible matches, conflicting attributions, and leads.

### Verified catalog
The simple builder and pedal records that are sufficiently established for public display.

### Public presentation
The website's rendering of the verified catalog.

The website must render the data; it must not manufacture certainty or create hidden records.

## 10. Stable Identifiers

Every builder and pedal must have a stable unique ID.

Example format:

- `BLD-000001`
- `PED-000001`

IDs must not change because of sorting, renaming, restructuring, grouping, or presentation changes.

Names may change. Aliases may expand. IDs do not.

## 11. Builder Record: Keep It Simple

A builder record should normally contain only what is useful for the first-pass catalog:

- stable ID
- recognizable/canonical builder name
- relevant aliases or alternate names for search/reference
- concise identity/profile information
- dirt pedals associated with the builder
- source links supporting the builder/pedal associations
- research state

Do not require an extensive builder biography.

## 12. Pedal Record: Keep It Simple

A first-pass pedal record should normally contain:

- stable ID
- builder ID
- recognizable/canonical product/model name
- alternate names stored for background/reference use
- dirt category: overdrive, distortion, fuzz, or appropriate combination
- a clear **exterior-only** reference photo
- source link(s)
- concise identification information
- research state

Do not require deep historical analysis in the first-pass catalog.

## 13. Evidence and Provenance

Even though the public information is intentionally brief, source provenance still matters.

For each builder/pedal association and each useful photograph, preserve the source URL and relevant credit information.

Use the supplied source links whenever they provide useful information or imagery.

Do not silently convert a guess into a catalog fact.

Where an attribution is uncertain, mark it as uncertain rather than inventing certainty.

## 14. Photographs: EXTERIOR ONLY

For the initial archive, **all pedal photography is exterior-only**.

The photograph has one primary job:

> **Show the visitor what pedal it is.**

Prefer clear exterior/reference views that make the pedal visually identifiable.

Useful image types include:

- front
- rear
- side
- top/angle views
- box / packaging when helpful for identification
- catalog or advertisement imagery when it clearly identifies the pedal
- clearly identified variant views when needed for recognition

**Do not publish or seek out internal imagery for the first-pass archive:**

- gutshots
- PCB layouts
- schematics
- circuit diagrams
- internal component photographs
- internal forensic imagery

We are not documenting the inside of the pedal at this stage. Internal construction, components, PCB details, and circuit evidence are outside the current scope and may be considered only during future individual-pedal deep dives.

Do not blindly mirror third-party images into the repository. Preserve source URLs and credits, and only locally host images when there is a clear basis for doing so.

## 15. No Deep-Dive Research During the Builder Pass

When research uncovers interesting relationships, unusual manufacturing details, alternate branding, historical rabbit holes, or disputed family/company connections, do not chase them indefinitely.

Capture the useful name/source relationship in background notes and move on.

The correct question for the first-pass catalog is:

> **Who is the recognized builder, what dirt pedals belong in their catalog, and what exterior image lets the visitor identify each pedal?**

Everything beyond that should be considered future deep-dive material unless it is necessary to avoid a basic identification error.

## 16. Duplicate and Variant Handling

Do not allow alternate branding to create unnecessary duplicate public entries.

When multiple names clearly refer to the same product, group them under the most recognized product identity for the initial catalog.

Likewise, do not create separate first-pass public records merely for colorways, enclosure revisions, graphic changes, or other cosmetic variants when they are the same underlying product.

Potentially distinct products should still be flagged for review rather than silently merged.

Detailed variant/generation distinctions can be preserved for later pedal-specific research.

## 17. The Website

The frontend should be simple, deterministic, and subordinate to the data.

Preferred flow:

`canonical data → validation → build → website`

Avoid:

- runtime catalog invention
- hidden bootstrap records
- provisional builders injected by JavaScript
- multiple competing production datasets
- special-case patches that obscure underlying data problems
- frontend logic that silently fills gaps with guesses

The public interface should feel like a clean vintage catalog / museum reference, not a database administration panel.

## 18. Validation Is Mandatory

Every material catalog change should be checked for integrity before publication.

At minimum, validation should cover:

- unique builder IDs
- unique pedal IDs
- valid builder references
- no orphaned pedal records
- valid record structures
- source records linked correctly
- photo records linked to real pedals
- no broken internal references
- no unintended duplicate public records
- exterior-only image compliance for first-pass pedal photos

If validation fails, the build should fail rather than publishing a broken catalog.

## 19. Research States

Records should have an explicit machine-readable research state.

Suggested states include:

- `identified`
- `builder-confirmed`
- `researched`
- `photo-found`
- `fully-populated`
- `needs-review`
- `conflict`

The exact enum may evolve, but the principle does not: **never confuse discovery with completion.**

## 20. Research Queue vs Published Archive

Keep unresolved work separate from public production data.

Research queues may contain:

- candidate builders
- unresolved builder/pedal matches
- alternate branding that needs later review
- missing exterior photographs
- conflicting sources
- duplicate candidates
- colorway/enclosure/generation details reserved for future deep dives
- future deep-dive topics

The public catalog must contain only the concise records selected for publication.

## 21. Canonical Import / Backup

Maintain a simple, inspectable master representation that can be backed up and transformed independently of the website.

The website is replaceable.

**The catalog is the treasure.**

Any future frontend, static-site generator, search engine, or deployment should be able to rebuild from canonical data without manual reconstruction.

## 22. Checkpoints and Safe Progress

Do not make a giant irreversible leap with thousands of records.

Use durable checkpoints so builder and pedal work remains inspectable and recoverable.

Each meaningful checkpoint should leave the repository in a buildable, inspectable state.

Never sacrifice data integrity merely to increase the visible record count quickly.

## 23. Change Discipline

Before modifying an existing structure:

1. Consult this governing document.
2. Identify the current source of truth.
3. Determine what depends on it.
4. Make the smallest coherent change.
5. Validate the result.
6. Commit a state that can be understood later.

Do not patch around an architectural mistake indefinitely. Fix the underlying structure cleanly.

## 24. Lessons From the First Build

The first build accumulated too many interacting mechanisms: discovery datasets, runtime bootstrap logic, research extensions, photo manifests, builder manifests, and other layers that could drift apart.

The practical lessons are:

- One canonical catalog beats many clever layers.
- Builder identity comes first.
- Research the builder's dirt-pedal catalog, not their entire life story.
- Prioritize builders with multiple dirt pedals.
- The public record should answer **who made it, what it is, and what it looks like**.
- Group alternate brand/manufacturer names under the most recognized product identity during the initial catalog pass.
- Do not create separate first-pass records solely for colorways, enclosures, graphics, or other cosmetic variants.
- Save alternate names, deeper relationships, and detailed variant information for later pedal deep dives.
- Exterior photographs only during the first pass.
- Do not seek or publish internal pedal photography, gutshots, PCB imagery, schematics, or component evidence during the first pass.
- Provenance still matters even when the displayed text is brief.
- Stable IDs are essential.
- Images are first-class records.
- Runtime code should render truth, not manufacture completeness.
- Validation must happen before publication.
- The website should be replaceable without losing the catalog.
- Checkpoint the work so a later mistake cannot erase the entire working structure.

## 25. Mandatory Operating Rule for Every Operation

Before performing **any** operation on The Dirt Archive, consult this document and ask:

> **Does this operation stay focused on Builder → Pedals → Photos → Information, avoid unnecessary deep-dive history, preserve the recognized-name grouping rule, use exterior-only photos, defer detailed colorway/enclosure/variant documentation, preserve source provenance, and protect the canonical catalog?**

If not, change the operation before executing it.

When in doubt, choose the path that preserves data, provenance, simplicity, reversibility, and inspectability while keeping the first-pass archive focused.

## 26. Non-Negotiable Summary

**Builder → Pedals → Photos → Information**

**Focus on builders with multiple dirt pedals.**

**Do not turn the builder pass into a history project.**

**Use the most recognized product name for the initial catalog.**

**Store alternate names/manufacturers for later deep dives.**

**Do not split one product into separate first-pass records for colorways, enclosures, or cosmetic variants.**

**Use exterior-only photos.**

**The photo's job is to identify the pedal.**

**No gutshots, PCB imagery, schematics, or internal photography.**

**Defer detailed variants and enclosure/colorway documentation until individual pedal deep dives.**

**Keep source provenance.**

**One canonical catalog.**

**Stable IDs.**

**Validate before publishing.**

**Protect the catalog above the website.**

This file is the governing reference for future work on the repository.
