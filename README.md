# The Dirt Archive

Independent historical reference project for overdrive, distortion and fuzz pedals.

## Current scope

The Dirt Archive is currently focused on dirt pedals: fuzz, overdrive and distortion.

The project emphasizes:

- builder-first browsing
- product and production history
- generation, edition and production-period distinctions
- practical identification clues
- source-backed historical claims
- preservation of information about obscure and discontinued builders
- quarterly research releases rather than a promise of total completeness

## Current research program

The archive now follows a strict **builder-first → canonicalize builders → complete each builder's dirt catalog → research individual pedals deeply** order.

First, map the widest practical universe of builders, manufacturers, OEM factories, marketed brands, private-label entities, distributors, revival makers, and micro-builders connected to overdrive, distortion, or fuzz from 1966 onward. Second, reconcile duplicate or related builder names so one historical entity does not appear as several unrelated builders. Third, enumerate that canonical builder's full documented dirt catalog. Fourth, return to each cataloged pedal for generation, production-period, edition and specimen research.

Research files live under `/research` and are deliberately kept separate from the public website assets.

The governing workflow is documented in `research/BREADCRUMB.md`.

## Builder identity rule

A builder name appearing more than once is not automatically a duplicate error and is not automatically a separate builder. Before creating or retaining a canonical builder record, determine whether the names represent:

- the same builder under a renamed company or successor brand
- a marketed brand versus the physical manufacturer/OEM
- a distributor/private-label name versus the factory
- a collaboration or signature partner
- an acquisition, ownership or licensing transition
- a revival/reissue manufacturer of an older design
- genuinely separate entities that merely share a name

When two names are historically related, keep the **canonical builder entity** as the primary navigation identity and store the former/alternate names and the relationship in the builder lineage. The individual pedal page may then explain the historical name change, OEM relationship, collaboration, acquisition, or production transition relevant to that specific pedal.

Do not create separate builder cards merely because a pedal was marketed under a different historical name.

## Research phases

The repository contains dedicated discovery, builder-census, catalog-completeness, historical-verification and early-foundational handoff files. These are working research artifacts, not claims that every pedal has been found.

The builder census is deliberately broader than the public catalog. It includes obscure micro-builders, regional manufacturers, OEM relationships and unresolved brands so they can be reconciled before being promoted into canonical public records.

## Promotion rule

A candidate or discovery record is not automatically a verified public archive record. Promotion requires evidence review, naming/relationship review and, where applicable, production-variation research.

The public archive should answer **which physical and historical state of this model is this?**, while the builder record answers **who actually built, marketed, owned, licensed, or distributed this product at this point in its history?**

## Editorial boundary

The archive documents historically meaningful distinctions, including component changes when they materially help identify a production period. It does not publish gutshot galleries, schematics, PCB layouts, complete bills of materials, cloning instructions, or circuit-reconstruction material.

## Site architecture

The public website lives in `/public`. Project documentation, research/database-development files and deployment configuration remain at the repository root.

## Long-term structure

Canonical builder entity
→ former / alternate / OEM / distributor / collaboration relationships
→ family
→ retail model
→ generation
→ production period
→ edition
→ specimen
→ claims + evidence

The archive is curated. It does not promise to catalog every pedal ever made.
