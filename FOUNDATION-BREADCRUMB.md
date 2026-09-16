# The Dirt Archive Foundation Breadcrumb

## Objective
Keep The Dirt Archive historically useful, visually coherent, and structurally boring underneath. Research should accumulate as durable archive data, while the public site remains a single deterministic application rather than a collection of DOM-patching rescue scripts.

## Canonical flow
`archive data → normalization / relationship resolution → application state → route → renderer → stable DOM`

## Protected decisions
- Keep the public scope centered on overdrive, distortion, and fuzz.
- Preserve historical research even when implementation layers are retired.
- Use one canonical builder record for a real-world organization or historically meaningful entity. Keep aliases and production relationships attached to that record instead of creating duplicate destinations.
- Keep generation/version identification as a visual guide: moderately large clickable generation photos beside generation names.
- Do not stack generation/specimen metadata boxes beneath the main pedal photograph.
- Do not publish gutshots, schematics, PCB layouts, complete BOMs, or cloning instructions.
- Treat reference-only imagery as leads, not cleared publication assets.
- Keep `main` isolated until the foundation branch has completed verification.

## Current verified foundation
- Protected production baseline: `f0472eacdd69f07cfdae4e53f08f3db0c96e8cff`
- Working branch: `foundation-audit`
- Verification PR: #5
- Latest foundation cleanup commit: `c23aff9ad9ebd6d3c4dbdbda05bc09fd229a86bb`
- Latest CI run for that cleanup: run 152, successful architecture audit and browser smoke suite.
- Smoke suite currently exercises routing, data shape, generation fixtures, research generation map, visual generation guide, lineage, identification desk, photo desk, card research badge, builder detail, search, and search close behavior.
- Photo Desk currently enrolls 2,380 dirt records during smoke verification.

## Retired implementation layers
- `catalog-thumbnails-33-runtime.js`: retired. `app.js` owns the canonical media resolver.
- `catalog-visual-references.js`: retired. External visual searching remains a research workflow through the Photo Desk rather than a card/page wrapper.
- No-op `pedalCard` wrapper in `catalog-research-runtime.js`: retired.

## Active transitional layers
- `catalog-research-runtime.js`: renders the structured research dossier on pedal detail pages from `archive_research`.
- `catalog-research-ui.js`: settles research badges/status deterministically without MutationObserver.
- `catalog-lineage-static.js`: deterministic lineage section from the lineage data file.
- `catalog-specimen-ui.js`: generation visual guide with clickable image references.
- `catalog-identification-desk.js`: identification workflow.
- `catalog-photo-desk.js`: photography/source workflow and rights triage.
- `catalog-polish.js`: currently owns search behavior plus remaining presentation polish.
- `catalog-recent-home.js`: current homepage presentation override.

## Next refactor targets
1. Move research badge/status generation into the canonical renderer, then retire `catalog-research-ui.js`.
2. Move the research dossier into the canonical pedal detail renderer, then retire `catalog-research-runtime.js`.
3. Move lineage rendering into the canonical pedal detail renderer, then retire `catalog-lineage-static.js`.
4. Evaluate whether search and remaining polish can be folded into the core renderer without reintroducing timing-dependent DOM behavior.
5. Once the renderer is stable, reduce the large sequence of discovery/extension scripts into durable data assets or a prebuild normalization step. Do not delete discovery content merely to reduce file count.
6. Return to Protocol A historical research expansion only after the foundation remains green through repeated changes.

## Verification gate
For every site-affecting change:
1. Static architecture audit passes.
2. Browser smoke suite passes.
3. Branch/PR head is confirmed to contain the tested commit.
4. `main` remains at the protected baseline until explicit merge approval.

Do not describe an unrun or incomplete CI result as verified.
