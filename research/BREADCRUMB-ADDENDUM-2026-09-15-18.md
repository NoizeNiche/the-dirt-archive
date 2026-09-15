# The Dirt Archive Breadcrumb Addendum — 2026-09-15-18

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 23 handoff

Committed:
- `public/lineage.json`
- `public/catalog-lineage-runtime.js`
- `public/index.html`

The public lineage layer is now explicitly loaded by the site shell. `public/lineage.json` contains only the 12 source-validated public lineage edges. `public/catalog-lineage-runtime.js` reads that safe data file and renders a lineage/relationships section on matching pedal pages without exposing research-only review fields.

The runtime is intentionally additive: the existing catalog identity routing and research dossier layers remain intact, and the lineage renderer does not alter builder IDs, pedal IDs, or canonical catalog records.

## Current queue

1. Smoke-test the public lineage runtime against representative linked records and an unlinked record.
2. Audit remaining duplicate/alias candidates across additional completed builder ledgers.
3. Resolve the highest-value SoundTank and Teisco manufacturer exceptions separately from the public layer.
4. Promote additional lineage only after source-trail validation.
5. Continue the 1960-2026 builder/product census in parallel.

## Continuity rule

Append another dated addendum after the next repository write batch.
