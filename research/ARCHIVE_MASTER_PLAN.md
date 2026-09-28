# The Dirt Archive - Master Quality & Product Plan

## Mission

Make The Dirt Archive the most trustworthy, useful, navigable public reference for guitar overdrive, distortion, and fuzz pedals.

The archive should optimize for:
1. exact identity
2. exact photography
3. useful historical context
4. fast discovery
5. understandable relationships between models, versions, and editions
6. resilient public UX
7. conservative claims when evidence is incomplete

Completeness is valuable only when it does not come at the expense of correctness.

## Current reality

The canonical catalog currently contains 4,202 records. After the September 28 photo reconciliation, the canonical catalog and PRP tracker agree on 3,986 pictured records and 216 photo-pending records.

A repository-level asset audit also surfaced a large number of exact duplicate image-byte groups and orphaned local assets. Duplicate groups are review candidates, not automatic proof that every repeated photograph is wrong. Cross-builder repetition, tiny assets, generic provenance, blocked-source provenance, and pixel-level donation/platform overlays are the highest-risk classes.

The current project also has separate Builder Directory, Builder Archive, Identify a Pedal, Corrections, Workbench, comparison, Grid/Table browse, URL-sharing, and photo-content audit layers.

## Phase 1A - Current photo findings

The September 28, 2026 full-library audit is now sharded into 24 parallel scans. Each scan checks the local photo payload, dimensions, known blocked hashes, source-policy violations, and edge-zone OCR for high-confidence donation/platform overlays.

Automatic quarantine handles objective failures. Ambiguous dark/low-detail imagery enters a review-only queue.

## Phase 1 - Photo Trust Gate (highest priority)

### A. Never publish a known non-product asset
Reject donation/support graphics, logos/favicon/UI assets, Cloudflare challenge pages, search-engine UI images, social/OG artwork, generic builder/shop placeholders, and broken or truncated image payloads.

The shared URL blocklist is the first gate. Pixel-level OCR/content inspection is the second gate.

### B. Keep the exact-photo contract
A photo is valid only when it belongs to the exact Builder + Pedal identity, the source page supports that identity, the local file is readable, the dimensions/file payload meet the archive minimum, the content is not a known non-product asset, and recovery did not simply reuse another catalog identity's image bytes.

### C. Make wrong photos disappear safely
When a photo fails the high-confidence trust gate, remove the photo from the public catalog, preserve the research record, preserve the review/quarantine history, rebuild tracker/backlog state, return the record to normal photo recovery, and never substitute a guessed photograph.

### D. Clean the legacy photo layer
Prioritize: blocklisted provenance; donation overlays detected in pixels; unreadable/tiny assets; cross-builder duplicate byte groups; generic/default source pages; orphaned local files; unresolved source-rich missing records.

## Phase 2 - Identity Integrity

Every public record must answer: Who built it? What exact model is it? Is this a version? Is this a cosmetic variation or edition? Is this an alias of another catalog identity? What evidence supports the relationship?

Keep Builder + Pedal as the primary identity gate; explicit version_of; explicit variation parentage; confirmed aliases; no silent merging of materially different products.

Future identity improvements should include stronger alias normalization, historical builder-name transitions, clearer product-family graphs, and conservative handling of uncertain lineage.

## Phase 3 - Discovery & Identification

The site should support several legitimate visitor jobs: Known pedal, Known builder, Unknown pedal, Curious browsing, and Research comparison.

The identification tool must remain a narrowing aid, not an automatic guessing engine.

## Phase 4 - Historical Depth

Builder and enthusiast needs overlap heavily here. Add carefully structured public context where evidence exists: discontinued status, documented production era, revision chronology, reissue relationships, official manuals, official support/repair destinations, documented collaborations, limited-run/small-batch context, and custom/one-off classification.

Do not invent years, production counts, technical specifications, or builder URLs.

## Phase 5 - Builder Contribution

Create a private, review-first contribution workflow for missing models, corrected identities, version distinctions, official/manual sources, exact product photos, historical notes, and corrected technical/control details.

Submissions enter review. They do not directly mutate the canonical catalog.

## Phase 6 - Public UX

Keep the interface simple even as the underlying archive becomes deep.

Already useful: search suggestions, direct zero-result recovery, Grid/Table views, mobile filter drawer, builder archive, identify workflow, Workbench, exact-record comparison, shareable URLs, exact-photo fallbacks with visible pedal identity, and keyboard focus/skip links.

Next usability priorities: make the site's tools more obvious without clutter; strengthen mobile result scanning; make version-family context easier to see; make missing-photo states unmistakable; improve comparison readability on narrow screens; continue accessibility QA.

## Phase 7 - Data Quality

The catalog should have automated checks for duplicate Builder + Pedal identities; invalid/missing research links; missing local photo files; tracker/catalog drift; manifest/catalog drift; alias drift; invalid version parents; invalid variation parents; blocked photo provenance; duplicate local image bytes; orphaned photo assets; stale image paths; malformed search/facet data.

The validator must fail for structural corruption, while review reports should expose ambiguous cases without pretending every anomaly is automatically wrong.

## Phase 8 - Search Quality

Search should evolve beyond exact name matching while staying evidence-safe. Useful searchable fields include exact pedal name, builder, confirmed aliases, version labels, variation/colorway names, documented historical names, research-derived descriptive text, and explicitly documented technical facets.

Never transform a family resemblance or inferred circuit topology into a canonical alias.

## Phase 9 - Site Architecture

One source of truth remains mandatory.

Canonical identity: research/PEDAL_INDEX.json
Research prose: research/pedals/**/*.md
Primary/variation photos: assets/pedals/**
Photo provenance: catalog provenance fields
Tracker status: research/PRP_TRACKER.csv
Photo backlog: research/PHOTO_BACKLOG.csv
Public search facets: research/PEDAL_FACETS.json
Shared browser runtime: assets/js/archive-core.js
Catalog browser: assets/js/archive-index.js
Detail browser: assets/js/archive-detail.js
Identify workflow: assets/js/archive-identify.js
Builder directory: assets/js/archive-builders.js
Builder archive: assets/js/archive-builder.js
Comparison: assets/js/archive-compare.js
Structural validator: scripts/validate-archive.py
Browser deployment audit: scripts/deploy-browser-audit.js
Photo recovery: scripts/browser-photo-cache.mjs
Photo content audit: scripts/audit-photo-content.py

## Release rule

A feature is not finished merely because it works in one browser path.

A release should pass structural validation, JavaScript syntax checks, catalog/manifest/tracker reconciliation, photo trust checks for affected assets, deployment browser smoke tests, mobile layout checks, and exact-record linking checks.

## Product philosophy

The archive should be willing to say: This is the exact record. This is a documented version. This is a cosmetic edition. This photo is not good enough yet. This fact is not documented.

The archive should never say: This probably is the same pedal; this photo looks close enough; this circuit is probably the same without evidence; or this builder/pedal is best.

Accuracy is the product, not a footnote.
