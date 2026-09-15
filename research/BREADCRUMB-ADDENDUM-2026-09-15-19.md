# The Dirt Archive Breadcrumb Addendum — 2026-09-15-19

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 24/25 handoff

The public lineage runtime received a second hardening pass. The previous fixed-delay approach has been replaced with route-aware and DOM-aware refresh behavior using `hashchange`, `load`, and `MutationObserver`, with stale lineage markup removed when the route changes.

Committed:
- `public/catalog-lineage-runtime.js`
- `research/public-lineage-runtime-smoke-audit-02.md`
- `research/lineage-candidate-roto-01.tsv`

## Historical research advancement

A new multi-builder lineage case was documented for the Rotosound Fuzz Box. Fuzzboxes documents Sola Sound supplying Rotosound-branded fuzz boxes from 1966 through the early 1970s, while a separate short Jennings-manufactured Rotosound fuzz period began in November 1968. These are recorded as period-qualified relationships rather than forcing a single-builder attribution.

These Rotosound edges are research candidates only and are not yet in `public/lineage.json`.

## Boundary / safety state

The browser still consumes only the public lineage file. Candidate lineage and research evidence remain outside `/public` until source validation is complete.

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions were added.

## Current queue

1. Validate the two Rotosound candidate edges against the builder and catalog ledgers.
2. Search other Sola Sound OEM products for comparable period-specific manufacturer switches.
3. Continue duplicate/alias reconciliation across completed builder ledgers.
4. Resume broader 1960-2026 builder census expansion.

## Source used this batch

- https://fuzzboxes.org/rotosoundfuzzbox

## Continuity rule

Append another dated addendum after the next repository write batch.
