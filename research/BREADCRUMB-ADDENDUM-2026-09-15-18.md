# The Dirt Archive Breadcrumb Addendum — 2026-09-15-18

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 23 handoff

Completed the first public lineage runtime smoke audit and found one real integration defect.

Committed:
- `public/lineage.json`
- `public/catalog-lineage-runtime.js`
- `public/index.html`
- `research/public-lineage-runtime-smoke-audit-01.md`

## Important runtime fix

Pedal detail routes are ID-based through `catalog-identity-routing.js`, while `public/lineage.json` uses model names. The original lineage runtime compared the route token directly with model names, which could silently suppress valid lineage sections.

The runtime now loads the public catalog, resolves the current pedal by `pedal_id`, and then matches lineage edges against the resolved `model_name`.

## Public boundary remains intact

The browser layer still reads only `public/lineage.json`. Research candidate files and HOLD_FOR_REVIEW edges remain outside the public runtime.

The existing identity-routing layer was not rewritten. The fix is intentionally isolated to lineage runtime resolution.

## Current queue

1. Perform a deployed/browser smoke test of at least one pedal with a validated lineage edge and one pedal without one.
2. Continue the duplicate/alias audit across additional completed builder ledgers.
3. Resolve model-specific SoundTank and Teisco evidence before considering any new public lineage promotion.
4. Expand the 1960-2026 builder census in parallel with public-layer stabilization.

## Continuity rule

Append-only handoff. Add the next dated breadcrumb after repository writes are complete.
