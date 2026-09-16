# Site Foundation Plan

## Purpose

Keep The Dirt Archive's public site stable while the interface evolves toward a world-class historical identification archive.

## Production rule

`main` is production. Experimental work stays on a branch until browser smoke tests, asset checks, data checks and route checks pass.

## Core architecture goal

Move toward one predictable application flow:

`archive data → core application → route renderer → page UI`

Research-specific presentation should be integrated into that renderer rather than relying on multiple independent MutationObservers that rewrite the DOM after rendering.

## Future information layers

- Catalog: canonical builder, relationships, family, model, generation, production period, edition, specimen.
- Identification: physical clues, candidate matching, confidence and explanations.
- Evidence: claims, sources, conflicts, corrections and evidence state.
- Exploration: related models, OEM families, builder lineage, chronology and cross-links.
- Media: rights-aware archive photography and external reference imagery clearly separated.

## Refactor order

1. Establish reliable automated smoke tests.
2. Document current runtime responsibilities.
3. Consolidate data loading and shared helpers.
4. Consolidate page rendering without changing visible behavior.
5. Retire redundant DOM decorator layers one at a time.
6. Add generation-specific visual identification directly to pedal rendering.
7. Build identification workflow on the stable core.

## Never merge without checking

- Home
- Builders index
- Builder detail
- Fuzz / Overdrive / Distortion categories
- Pedal detail
- About
- Search open / search / close
- JavaScript console errors
- Referenced asset availability
- Required data arrays

## Editorial boundary

Historical identity, production differences and source-backed technical distinctions are welcome. Schematics, PCB layouts, complete BOMs, gutshot libraries, cloning instructions and circuit-reconstruction material remain outside the public archive.
