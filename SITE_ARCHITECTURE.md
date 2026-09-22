# The Dirt Archive — Site Architecture

## Purpose

The Dirt Archive is a welcoming reference and discovery site for guitar dirt pedals. The goal is to help a visitor recognize what a pedal is, understand meaningful differences between versions, discover unusual models, and hear representative examples without turning the site into a component-forensics database.

## Core public object

The main archive shows one entry for each pedal model/version page.

A cosmetic variation is not a separate main catalog entry when the underlying pedal is the same.

### Example

1981 Inventions -> DRV MOD 1

is the catalog entry.

DRV MOD 1 (WHITE)

is a colorway variation belonging to DRV MOD 1 and is shown inside the DRV MOD 1 page.

A genuinely different product generation such as V2 can be its own model/version page and may be linked from the parent model's Versions section.

Artist/signature models that are treated as distinct products receive their own pages.

## Data relationship model

research/PEDAL_INDEX.json is the primary public lookup source.

Optional relationship fields:

- catalog_role: omitted or model for normal public catalog entries; variation for non-catalog cosmetic/edition records
- parent_pedal: exact parent pedal name for a variation
- variation_type: for example colorway, retailer_exclusive, event_edition, artwork, or another deliberately supported variation type
- variation_name: human-readable variation name
- version_of: exact company + NUL + pedal key when a public version page belongs to a parent model
- version_label: human-readable label such as V2
- youtube_demo: optional object containing title and url for the best representative demo

Future colorway and version information should use these relationships instead of creating duplicate main-catalog cards.

## Main archive

The main navigation remains intentionally simple:

Search -> Dirt Type -> Builder -> Pedal

The catalog may later become more capable without becoming visually complicated.

Filter, builder, pagination, and search changes are represented in the browser URL. User-driven filter/page changes use browser history; back/forward restores the corresponding catalog state. Invalid or stale query state is normalized back to a valid URL.

The archive index also has a **Discover** control. It selects a random public catalog entry from the current filtered result set, so browsing remains useful even when a visitor does not have a specific pedal in mind. Discover does not create data or alter the active filters.

When a visitor opens a pedal from the index, the detail page restores the exact same-origin archive URL as its return link when the browser supplies a referrer. This preserves the visitor's active search, dirt-type filter, builder filter, and page number without adding a second browser-state system. Directly opened detail pages fall back to the archive home.

Main-page cards represent public model/version entries only. Variation records stay hidden from the main card grid.

Search should eventually be able to match useful variation names back to their parent model without displaying the variation as a second card.

## Individual pedal page

The normal pedal page stays approachable:

- pedal name
- builder
- dirt type
- primary photograph
- pedal information
- versions, when applicable
- colorways / editions, when applicable
- one best representative YouTube demo, when available

The public page should not expose research administration such as Research confidence, Sources checked, internal photo status, or PRP terminology.

### Colorways

Colorways and cosmetic variations are shown as a visual gallery beneath the primary photograph.

A colorway can have:

- name
- thumbnail/photo
- identifying note
- source page

A missing exact photograph is represented as No Photo Archived rather than a guessed substitute.

### Versions

A materially different version such as V2 is a separate public page.

The parent model page can display a Versions area with:

- version name
- thumbnail
- link to the version page

This keeps the parent page uncluttered while still making the product family easy to navigate.

## Content depth

PRP1 supplies practical public information:

- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- broad transistor/diode information when documented
- What it sounds like
- best representative demo

PRP2 may later expose deeper technical research for selected pedals without changing the basic public experience.

## Photos

Photography is a high-priority presentation element.

The site must never silently substitute a different pedal or version for a missing exact photograph.

PEDAL_INDEX.json is the file the public site reads for its primary image.

PEDAL_IMAGES.json remains an internal research/photo manifest and verification aid. It must agree with the public index rather than acting as a second public runtime source.

## Future editorial layer

A future showcase/blog layer may contain curated stories such as fuzz showcases, builder features, unusual editions, and historical rabbit holes. It is separate from the core pedal record and is intentionally deferred.

## Visual direction

The eventual signature design is a literal empty metal pedalboard inspired by a Pedal Train Pro-style board. The catalog should feel like it inhabits that physical space.

The visual treatment should enhance browsing without sacrificing readability, fast navigation, or mobile usability.

## Current implementation principle

Fix the data relationships and user flows before adding more PRP data.

The repository should be able to grow from thousands of records to a much richer archive without requiring a complete redesign of the data model.


## Local photo data model

The photo layer is local-first.

`research/PEDAL_INDEX.json` is the public runtime source for the pedal's primary photograph. For a pictured entry, its `image` field should ultimately contain a local path beneath `assets/pedals/`.

Each model/version owns:

`assets/pedals/{builder-slug}/{pedal-slug}/primary.webp`

Subordinate cosmetic variations belong to that parent directory:

`assets/pedals/{builder-slug}/{pedal-slug}/variants/{variant-slug}.webp`

A variation record keeps its `parent_pedal`, `variation_name`, and related identity metadata in the catalog. A materially different public version remains a separate pedal identity and therefore gets its own image directory.

The original remote image URL is retained separately as `image_source_url`, with `image_source_page` identifying the page used to verify the exact product. These fields are provenance, not public runtime dependencies.

Bulk photo caching also processes pictured records that still use an external image URL, allowing the local archive to converge to local-first storage without first changing the tracker’s confirmed-picture state.

The internal `research/pedals/PEDAL_IMAGES.json` manifest mirrors the same local image path and provenance.

## Operational ownership map - September 21, 2026

The repository uses a single-owner rule for every moving part:

| Concern | Single owner | Other files may |
| --- | --- | --- |
| Public catalog identities and relationships | `research/PEDAL_INDEX.json` | read it; do not maintain a second public catalog |
| Pedal research content | `research/pedals/**/*.md` | link to it; do not duplicate the prose in the catalog |
| Primary/variant photo assets | `assets/pedals/**` | reference them; do not create alternate asset stores |
| Photo provenance | Catalog `image_source_url` / `image_source_page` | preserve it; do not overwrite it casually |
| Photo/research mirror | `research/pedals/PEDAL_IMAGES.json` | synchronize from the canonical catalog |
| PRP status fields | `research/PRP_TRACKER.csv` | synchronize derived status; do not invent independent status rules |
| Research-to-catalog wiring | `scripts/sync_prp_catalog.py` | call it; do not duplicate its reconciliation logic |
| Tracker status synchronization | `scripts/sync-prp-tracker.py` | call it; do not duplicate its completion rules |
| Photo source recovery | `scripts/browser-photo-cache.mjs` | feed it; do not write alternate cache logic |
| Photo conversion/cache | `scripts/cache-pedal-images.py` | provide verified sources; do not write directly to public image fields |
| Structural validation | `scripts/validate-archive.py` | treat failures as blockers; do not bypass them |
| Public browser behavior | `assets/js/archive-core.js` + page controllers | keep page-specific behavior out of HTML shells |
| Deployment orchestration | `.github/workflows/deploy-pages.yml` | publish a validated tree; do not embed application logic |
| Local browser-audit HTTP server | `scripts/serve-static.js` | serve the checked-out archive for deterministic audits; do not copy server logic into workflows |
