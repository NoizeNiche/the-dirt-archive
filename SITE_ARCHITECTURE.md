`assets/pedals/{builder-slug}/{pedal-slug}/variants/{variant-slug}.webp`

A variation record keeps its `parent_pedal`, `variation_name`, and related identity metadata in the catalog. A materially different public version remains a separate pedal identity and therefore gets its own image directory.

The original remote image URL is retained separately as `image_source_url`, with `image_source_page` identifying the page used to verify the exact product. These fields are provenance, not public runtime dependencies.

Bulk photo caching also processes pictured records that still use an external image URL, allowing the local archive to converge to local-first storage without first changing the tracker’s confirmed-picture state.

The internal `research/pedals/PEDAL_IMAGES.json` manifest mirrors the same local image path and provenance.


## Collector workbench

The public archive now includes an optional, device-local collector workbench.

### Saved records

Visitors can save exact Builder + Pedal records to browser-local storage. Saved state is private to that device and is not part of canonical archive data.

Saved records should always point to exact catalog identities. If a record is later retired from the canonical catalog, the stale saved key is ignored rather than redirected by guesswork.

### Exact-record comparison

Visitors can select up to four exact public records and open a side-by-side comparison page. The comparison is deliberately descriptive rather than ranked.

The comparison surface may show:
- exact pedal name and builder
- dirt type
- explicit version label
- explicitly documented transistor/clipping/power facets
- research level
- exact local-photo availability
- version-family relationship
- representative demo when documented

Comparison state is device-local and temporary. It must not become a popularity, quality, market-value, or recommendation score.

### Product principle

The workbench is a utility layer over the archive rather than a second catalog. Canonical identity, research prose, technical facet data, and photo provenance continue to come from their existing owners.

## Public discoverability layer

The public archive includes two derived crawler-facing files:

- `sitemap.xml` is generated from `research/PEDAL_INDEX.json` by `scripts/build-sitemap.py`. It contains one URL for each non-variation public pedal record plus the archive, methodology, and audit pages.
- `robots.txt` permits normal crawling and points crawlers at the generated sitemap.

These files are derived publication state. They must not become an independent list of pedal identities; the canonical catalog remains `research/PEDAL_INDEX.json`.

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


## Production operating lanes

The archive now uses two intentionally separate tempos.

### Finish-line lane

Photo recovery is explicit and bounded. `fast-photo-catchup.yml` is the only normal photo-production worker. It runs from a kick or manual dispatch, uses small resumable batches, and shares a single archive write lane with catalog publication. Legacy parallel/emergency photo workers remain manual fallbacks only.

The finish-line target is simple: clear the researched-photo backlog, publish the verified local assets, validate the public tree, and ship the visual product. No recurring research sweep is allowed to interrupt that lane.

### Archive-growth lane

Research is not a launch gate once the public catalog is fully surfaced. `research-worker-team.yml` owns bounded weekly research growth plus manual/source-triggered passes. Its worker matrix is intentionally capped. Builder research can therefore proceed alphabetically or by an actively selected builder group without turning every research update into a site-wide CI event.

For ongoing editorial work, the preferred human workflow is builder-by-builder or letter-by-letter: gather multiple strong sources, enrich several records in one coherent batch, publish once, then let the normal synchronization/validation chain reconcile the derived files.

### Quality cadence

Fast structural validation stays close to changes. Heavy whole-site audits are manual/weekly checks rather than automatic reactions to every research or photo commit. Hourly health is read-only and checks the live product instead of rebuilding canonical data.

This separation is deliberate: **accuracy remains strict at the record level, while orchestration stays lightweight at the project level.**

## Exhaustive quality audits

The repository includes two heavyweight quality audits separate from the fast deployment smoke audit.

`scripts/audit-detail-pages.js` renders every non-variation public catalog identity and checks exact Builder + Pedal identity, research rendering, primary photo container count/geometry, local-photo loading, and self-identifying missing-photo fallbacks.

`scripts/audit-photo-content.py` audits local image integrity, blocked photo provenance, known-bad image hashes, near-blank assets, and high-confidence embedded donation/support-platform text in likely overlay zones.

The scheduled/manual workflow is `.github/workflows/exhaustive-quality-audit.yml`. It is designed to catch catalog-wide presentation failures that a bounded deployment canary cannot guarantee.