# Public Lineage Runtime Smoke Audit 02

Date: 2026-09-15

## Scope

Second repository-side audit following the pedal-id resolution fix.

## Findings

### Fixed: asynchronous DOM timing dependency

The lineage renderer previously relied on a fixed delay before inspecting the pedal detail DOM. The site loads a long catalog extension/discovery chain, so a single fixed delay could race the router and silently miss the detail article.

The runtime now reacts to `hashchange`, `load`, and app DOM mutations through `MutationObserver`, with bounded follow-up checks. It also removes stale lineage markup when the route changes.

### Preserved: ID-to-name resolution

The renderer continues to resolve the current pedal from `pedal_id` and then matches public lineage endpoints by `model_name`.

### Preserved: public boundary

Only `public/lineage.json` is consumed by the browser layer. Research candidate files remain out of the public runtime.

### Historical audit finding: Rotosound requires multi-builder lineage

The Rotosound Fuzz Box is not safely representable as a single unqualified manufacturer statement across its whole run. Fuzzboxes documents Sola Sound-built Rotosound Fuzz Boxes from 1966 through the early 1970s, while also documenting a short Jennings-manufactured Rotosound Fuzz period beginning in November 1968. This should remain a multi-edge lineage record rather than collapsing the Rotosound pedal to one builder.

Source: https://fuzzboxes.org/rotosoundfuzzbox

## Status

- Route resolution: PASS
- DOM timing resilience: FIXED
- Stale route cleanup: ADDED
- Public/research separation: PASS
- Rotosound multi-builder candidate: RESEARCH-READY, not yet promoted

## Next

1. Add Rotosound lineage edges to the research candidate layer with period qualifiers.
2. Validate those edges against the existing builder catalog records before public promotion.
3. Continue the duplicate/alias scan for additional historically multi-builder products.
