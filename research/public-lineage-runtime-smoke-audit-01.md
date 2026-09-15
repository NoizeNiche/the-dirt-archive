# Public Lineage Runtime Smoke Audit 01

Date: 2026-09-15

## Scope

Static integration audit of the first public lineage wiring pass.

## Findings

### Fixed: pedal route identity mismatch

`public/catalog-identity-routing.js` routes pedal cards by `pedal_id`, while `public/lineage.json` identifies lineage endpoints by model name. The original lineage runtime compared the route token directly to lineage names, so valid relationships could fail to render on ID-routed pedal pages.

The runtime now loads `data.json`, resolves the current pedal by `pedal_id`, and compares lineage edges against the resolved `model_name`.

### Preserved: research/public boundary

The public runtime reads only `public/lineage.json`. Research candidate files and HOLD_FOR_REVIEW relationships are not imported into the browser layer.

### Preserved: identity separation

The runtime displays relationship counterparts without rewriting builder or pedal identities. This is consistent with the archive duplicate/alias audit, which explicitly keeps OEM, retail, distributor and successor relationships separate.

## Current status

- `public/lineage.json`: PASS
- `public/catalog-lineage-runtime.js`: FIXED / READY FOR BROWSER SMOKE TEST
- `public/catalog-identity-routing.js`: unchanged
- `public/index.html`: loads lineage runtime
- Research-only lineage leakage: NOT OBSERVED in static wiring

## Remaining validation

A real browser run should still confirm asset loading, route transitions and DOM insertion in the deployed environment. The repository-side architecture is now internally consistent for ID-based pedal routing.
