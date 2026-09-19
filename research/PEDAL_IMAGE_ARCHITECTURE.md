# The Dirt Archive - Pedal Image Architecture

## Purpose

Pedal photography is archived locally so the public site does not depend on an outside image host remaining available.

## Canonical storage layout

Each public pedal model/version owns one directory:

assets/pedals/{builder-slug}/{pedal-slug}/

The primary representative photograph is:

assets/pedals/{builder-slug}/{pedal-slug}/primary.webp

Colorways, limited finishes, retailer editions, and other subordinate visual variants that belong to that model/version are stored beneath the parent pedal:

assets/pedals/{builder-slug}/{pedal-slug}/variants/{variant-slug}.webp

A materially distinct version that has its own public catalog entry gets its own pedal directory rather than being treated as a colorway variant.

## Catalog fields

In research/PEDAL_INDEX.json:

- `image` is the local path served by the website.
- `image_source_url` preserves the original image URL used during archival retrieval.
- `image_source_page` identifies the source/product page where the image was verified.
- `catalog_role = variation`, `parent_pedal`, and `variation_name` define a colorway/edition relationship.

The internal research/photo manifest mirrors the same local image path and provenance.

## Rules

1. Never use a different pedal image merely because it is visually similar.
2. Once an exact image is successfully archived locally, the site should use the local path.
3. The original source URL remains metadata for provenance and future rechecking; it is not the runtime dependency.
4. Primary images use `primary.webp`.
5. Colorway/edition images use the parent pedal's `variants/` directory.
6. Materially distinct public versions use separate pedal directories.
7. Missing/unverified photos remain `No Photo Archived` and are not represented by guessed assets.
8. The cache workflow may retry failed external retrievals later, but a failed retrieval must not be represented as a local image.

## Migration

The `Cache pedal images` workflow performs the migration from legacy external image URLs to the canonical local structure, converts archived images to WebP, and records the original source URL. It is safe to rerun because existing local files are retained rather than downloaded again.

## Example

BOSS / DS-1:

assets/pedals/boss/ds-1-distortion/primary.webp

1981 Inventions / DRV MOD 1:

assets/pedals/1981-inventions/drv-mod-1/primary.webp

1981 Inventions / DRV MOD 1 White:

assets/pedals/1981-inventions/drv-mod-1/variants/white.webp
