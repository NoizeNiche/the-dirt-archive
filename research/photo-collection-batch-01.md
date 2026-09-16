# The Dirt Archive — Photo Collection Batch 01

## Objective
Build a visual reference layer in which every dirt-pedal card can display a lead photograph and accumulate additional reference photographs without confusing image discovery with republication rights.

## Current implementation
`public/catalog-photo-harvester.js` scans visible `.pedal-card` records and searches Wikimedia Commons using the builder + model name as the query. Up to six image results are retained in the browser's local cache and rendered as a compact photo archive beneath the card.

When a public-media result exists and the card does not already have a cleared lead image, the first result is promoted into the card's main JPG/PNG slot with a `PUBLIC PHOTO REFERENCE` badge. Existing cleared/owned/permission-cleared images remain authoritative because the normal `DIRT_MEDIA` resolver still runs first.

## Rights separation
Wikimedia Commons results are treated as discovery/public-media references, not automatically as Archive-owned assets. Each displayed result links to its Commons file page, where license and creator metadata can be reviewed. The existing cleared-media registry remains the only path for an image to become an approved Archive thumbnail.

## Why this matters
The updated product protocol requires visual identification evidence, not merely model names. Multiple exterior views are useful for distinguishing enclosure geometry, graphics, control layout, hardware, labels and production-era identity.

## Next passes
1. Harvest Commons images for the complete visible catalog.
2. Expand source coverage to builder/manufacturer pages and historical catalog pages through research records.
3. Record image provenance separately from product identity and separate specimen photographs from generic product photography.
4. Promote especially useful photographs into `DIRT_MEDIA` only after rights are explicitly established.
5. Build historical multi-view galleries for difficult Tier A products and generation maps.

## Editorial boundary
Do not copy or republish third-party photographs merely because they are useful for identification. Discovery, source linkage, license status and public-use approval remain separate fields.
