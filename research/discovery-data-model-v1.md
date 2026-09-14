# The Dirt Archive — Discovery Data Model v1

## Purpose

The discovery layer is the high-volume staging area for pedal names and builder leads gathered from broad indexes, catalogs, manuals, ads, builder archives and specialist databases.

It exists so The Dirt Archive can preserve large numbers of obscure products quickly without pretending that every discovered name is already historically verified.

## Pipeline

`Discovery record → normalized entity → researched record → canonical archive record`

A discovery record may remain in staging indefinitely if evidence is thin. That is acceptable. Losing the lead is worse than leaving it unresolved.

## Discovery fields

- `discovery_id` — stable staging identifier.
- `builder_name` — builder/manufacturer text as currently known. Can remain uncertain.
- `brand_name` — retail or badge brand. Do not assume this equals the builder.
- `model_name` — product name as documented by the source.
- `dirt_category` — Fuzz / Overdrive / Distortion / mixed dirt / unknown.
- `subcategory` — optional research classification.
- `country` — country or region when known.
- `era_start` / `era_end` — approximate years only when there is a useful basis.
- `source_kind` — where the discovery came from.
- `source_url` — provenance link.
- `source_status` — discovery/seeded/researched/etc.
- `normalization_status` — raw / needs normalization / canonical.
- `archive_status` — research / documented / featured / hold.
- `notes` — aliases, OEM clues, unresolved questions and practical context.

## High-volume import rules

1. Preserve obscure names. A one-person builder with three pedals is still legitimate historical material.
2. Preserve short-run and discontinued models when there is evidence they were actually produced or sold.
3. Do not merge models merely because their names or circuits appear related.
4. Keep branded OEM products distinct while connecting them through relationships when supported.
5. Keep modern recreations separate from the historical product they reference.
6. Treat collector taxonomy such as “MK1.5” as research terminology unless the builder used that name.
7. Approximate dates are acceptable when explicitly marked as approximate.
8. Source links are required for imported discovery rows.
9. The discovery layer is not a resale-price database and should not become one.
10. No schematics, PCB diagrams, complete BOMs, cloning instructions or gutshot archives belong in this layer.

## Scaling strategy

Effects Database can act as a discovery backbone because its broad taxonomy exposes obscure builders, aliases and products that are easy to miss in ordinary historical writing. The Dirt Archive should not reproduce its prose wholesale. Instead, capture the existence of a product, preserve the source URL, normalize the identity, then research the historical context independently.

The same process can later ingest other large indexes, catalog scans and builder archives without changing the core schema.

## Promotion rule

A record becomes a canonical public archive entry when its identity is sufficiently clear for the site to present it without misleading visitors. Full historical certainty is not required for every field, but uncertainty should remain visible in the record rather than being silently converted into fact.

## Current workbook implementation

The working master now includes a `Discovery Catalog` staging sheet and `Discovery Control` governance sheet. The first seed contains 161 records assembled from the existing canonical Pedals and Research Catalog sheets.

## Next operational step

Continue harvesting discovery records at scale, then run builder/model normalization passes over the accumulated staging data. Do not slow high-volume discovery by attempting deep historical research on every row immediately.
