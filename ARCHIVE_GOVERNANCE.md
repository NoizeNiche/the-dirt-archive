# The Dirt Archive: Governing Reference

**Status:** Canonical operating guidance  
**Applies to:** Every research, data, content, image, code, validation, and deployment operation performed for this repository.  
**Repository:** `NoizeNiche/the-dirt-archive`

## 1. Mission

The Dirt Archive is an independent historical reference for guitar dirt pedals, beginning with **overdrive, distortion, and fuzz**. Its purpose is to document builders, their pedals, product variations, exterior/reference photography, historical context, identification information, and source provenance.

The archive should feel like a **museum catalog**: useful, visually clear, historically careful, and transparent about evidence and uncertainty.

## 2. Governing Priority

Every operation follows this hierarchy:

**Builder → Pedals → Photos → Information on the pedal**

This order is not optional.

1. Establish the builder.
2. Associate the builder's pedals.
3. Attach appropriate exterior/reference photographs and credits.
4. Research and present information about each pedal.

Do not invert this hierarchy merely because a pedal or image is easier to find first.

## 3. The Single Source of Truth

The repository must have **one canonical production catalog**.

Rules:

- Public records come from canonical data only.
- Runtime code must never invent catalog records.
- Discovery files must never be silently merged into production.
- Provisional data must never masquerade as verified data.
- Derived files, indexes, manifests, search indexes, and generated assets are subordinate to canonical data.
- Every derived artifact must be reproducible from canonical data.
- If a record is not in the canonical catalog, it is not a published archive record.

## 4. Separation of Research, Catalog, and Presentation

Keep three conceptual layers separate:

### Raw research
Things found during investigation, including leads, candidate builders, possible matches, conflicting claims, and incomplete information.

### Verified catalog
Records that have enough evidence to be published, with explicit research state and source provenance.

### Public presentation
The website's rendering of the verified catalog.

The website must render the data; it must not manufacture certainty or create hidden records.

## 5. Builder-First Research

Research should proceed builder-first whenever practical.

For each builder:

1. Establish a canonical builder identity.
2. Record known aliases and naming variations.
3. Research the builder sufficiently to establish the relevant historical context.
4. Match all known pedals in the supplied corpus to that builder.
5. Create every corresponding pedal card.
6. Research and document each pedal.
7. Attach appropriate photographs and credits.
8. Validate the complete builder block before moving on.

Do not repeatedly re-research settled builder history merely for the sake of activity. Concentrate effort on unresolved identities, pedal matching, evidence, images, and missing fields.

## 6. Stable Identifiers

Every builder and pedal must have a stable unique ID.

Example format:

- `BLD-000001`
- `PED-000001`

IDs must not change because of sorting, renaming, restructuring, or presentation changes.

Names and aliases may change. IDs do not.

## 7. Canonical Record Expectations

A builder record should support, as applicable:

- stable ID
- canonical name
- aliases / historical names
- country or location
- operating era / status when supportable
- concise profile
- source list
- research state
- notes on uncertainty or attribution conflicts

A pedal record should support, as applicable:

- stable ID
- builder ID
- canonical product/model name
- aliases
- category
- approximate production dates or era when supportable
- variants / generations
- concise description
- identification notes
- historical notes
- source list
- photo records
- research state
- uncertainty / conflict notes

Do not force unsupported fields to look complete. Use `unknown`, `unconfirmed`, or an explicit null/empty value as appropriate to the schema.

## 8. Evidence and Provenance

The archive must preserve the trail from claim to source.

For meaningful historical or identification claims, capture source information such as:

- source URL
- source title or description when useful
- source type when useful
- relevant evidence / note
- access date when useful

Prefer primary and contemporary sources where available, while recognizing that collector archives, specialist references, catalogs, advertisements, retailer archives, and other secondary sources can be valuable evidence.

Never silently turn an inference into a fact.

If sources disagree, preserve the disagreement and identify the competing claims rather than inventing certainty.

## 9. Uncertainty Is Data

A historical archive must be comfortable saying:

- Unknown
- Unconfirmed
- Likely
- Possibly
- Attribution disputed
- Source conflict

Do not guess simply to make a record look complete.

When an attribution is uncertain, state what is known, what is uncertain, and what evidence supports each side.

## 10. Duplicate Prevention

Do not silently merge records.

Potential duplicates should be flagged and investigated.

The system should be able to identify suspicious similarities such as:

- normalized name matches
- same builder plus similar model names
- aliases that appear to represent the same product
- variant/generation records that may have been duplicated

A duplicate decision must be explicit and traceable.

## 11. Builder Identity and Aliases

A builder may appear under many names over time.

Keep one canonical builder identity while preserving relevant aliases and historical names.

Do not create multiple builder entities merely because a source uses a different spelling, suffix, distributor name, or historical presentation unless evidence indicates they are actually distinct entities.

OEM, distributor, badge-engineered, and private-label relationships must be documented rather than flattened into a guess.

## 12. Photographs

Photography is part of the catalog record, not an afterthought.

Use appropriate exterior/reference imagery, such as:

- front
- rear
- side
- box / packaging
- catalog or advertisement imagery
- clearly identified variant views

Every image record should retain provenance, including source URL and credit information where applicable.

**Do not publish:**

- gutshots
- PCB layouts
- schematics
- circuit diagrams
- internal forensic imagery

unless a future project scope explicitly changes this rule.

Do not blindly mirror third-party images into the repository. Prefer linking or embedding from the original source when redistribution rights are not established. Locally hosted images should have a clear basis for use.

## 13. The Website

The frontend should be simple, deterministic, and subordinate to the data.

Preferred flow:

`canonical data → validation → build → website`

Avoid:

- runtime catalog invention
- hidden bootstrap records
- provisional builders injected by JavaScript
- multiple competing production datasets
- special-case patches that obscure the underlying data problem
- frontend logic that silently fills historical gaps with guesses

The public interface should feel like a vintage catalog / museum reference, not a database administration panel.

## 14. Validation Is Mandatory

Every material catalog change should be checked for integrity before publication.

At minimum, validation should cover:

- unique builder IDs
- unique pedal IDs
- valid builder references
- no orphaned pedal records
- required fields present according to schema
- valid record structures
- no unintended duplicate records
- source records linked correctly
- photo records linked to real pedals
- no broken internal references

If validation fails, the build should fail rather than publishing a broken catalog.

## 15. Research States

Records should have an explicit, machine-readable research state.

Suggested states include:

- `identified`
- `builder-confirmed`
- `researched`
- `photo-found`
- `fully-populated`
- `needs-review`
- `conflict`

The exact enum may evolve, but the principle does not: **never confuse discovery with completion.**

## 16. Research Queue vs Published Archive

Keep unresolved work separate from public production data.

Research queues may contain:

- unresolved builders
- unresolved builder/pedal matches
- missing photographs
- conflicting sources
- missing fields
- duplicate candidates

The public catalog must not treat queue entries as verified records.

## 17. Canonical Import / Backup

Maintain a simple, inspectable master representation that can be backed up and transformed independently of the website.

The website is replaceable.

**The catalog is the treasure.**

Any future frontend, static-site generator, search engine, or deployment should be able to rebuild from the canonical data without requiring manual reconstruction.

## 18. Checkpoints and Safe Progress

Do not make a giant irreversible leap with thousands of records.

Use durable checkpoints:

- schema established
- first builder validated
- small builder batch validated
- larger batch validated
- production milestones validated

Each meaningful checkpoint should leave the repository in a buildable, inspectable state.

Never sacrifice data integrity merely to increase the visible record count quickly.

## 19. Change Discipline

Before modifying an existing structure:

1. Identify the current source of truth.
2. Determine what depends on it.
3. Make the smallest coherent change.
4. Validate the result.
5. Commit a state that can be understood later.

Do not patch around an architectural mistake indefinitely. When a structural problem is discovered, fix the underlying model and migrate cleanly.

## 20. What We Learned From the First Build

The first build accumulated too many interacting mechanisms: discovery datasets, runtime bootstrap logic, research extensions, photo manifests, builder manifests, and other layers that could drift apart.

The central lessons are:

- One canonical catalog beats many clever layers.
- Research, production data, and presentation must remain separate.
- Builder identity must come before pedal association.
- Provenance must travel with the record.
- Uncertainty must be explicit.
- Stable IDs are essential.
- Images need first-class provenance.
- Runtime code should render truth, not manufacture completeness.
- Validation must happen before publication.
- Duplicate detection should flag, not silently merge.
- The website should be replaceable without losing the archive.
- Progress should be checkpointed so a later mistake cannot erase the entire working structure.

## 21. Mandatory Operating Rule for Every Operation

Before performing **any** operation on The Dirt Archive, consult this document and ask:

> **Does this operation preserve the governing priority, canonical source of truth, evidence trail, stable identity, explicit uncertainty, image provenance, and validation requirements?**

If not, change the operation before executing it.

When in doubt, choose the path that preserves data, provenance, reversibility, and inspectability.

## 22. Non-Negotiable Summary

**Builder → Pedals → Photos → Information**

**One canonical catalog.**

**Stable IDs.**

**Evidence attached to claims.**

**Uncertainty made visible.**

**No silent merging.**

**No runtime invention.**

**No gutshots, schematics, or PCB diagrams.**

**Validate before publishing.**

**Research separately from production.**

**Protect the catalog above the website.**

This file is the governing reference for future work on the repository.
