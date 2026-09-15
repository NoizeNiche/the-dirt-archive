# The Dirt Archive Breadcrumb Addendum — 2026-09-15-17

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 22 handoff

Committed:
- `research/public-lineage-source-validation-01.tsv`

This pass validates the source trails behind the highest-priority PROMOTE lineage edges before runtime integration. Twelve edges now have an explicit `VALIDATED_FOR_PUBLIC` state with preserved source provenance and notes on why identities remain separate.

Validated public candidates:
- Honey FY-6 -> Shin-Ei FY-6
- Shin-Ei FY-6 -> Univox Super-Fuzz
- JEN Fuzz -> Vox V828/V8281
- JEN Fuzz -> Elka Fuzz
- JEN Fuzz -> Unicord Fuzz
- Coron Distortion 10 -> Grant Distortion 10
- Coron Over Drive -> Storm Over Drive
- Colorsound Power Boost -> Colorsound Overdriver
- Park Fuzz Sound -> Sola Sound Tone Bender Fuzz family
- Carlsbro Fuzz -> Sola Sound Tone Bender Fuzz family
- CSL Super Fuzz -> Sola Sound Tone Bender Fuzz family
- Ibanez SF5 -> Ibanez FZ5

The source-validation layer does not upgrade any HOLD_FOR_REVIEW edge. Teisco Fuzz Machine / Ibanez Standard Fuzz No.59, blanket SoundTank / Maxon attribution, and Supa / Jumbo Tone Bender relationship remain outside the public-safe set.

## Current queue

1. Inspect `/public` runtime architecture and determine the smallest safe data injection point for `VALIDATED_FOR_PUBLIC` lineage edges.
2. Add only validated edges to a public-facing data layer without exposing research-only fields.
3. Continue model-level SoundTank and Teisco reconciliation separately from public integration.
4. Resume broader 1960-2026 builder census expansion after the first public lineage wiring pass.

## Continuity rule

This addendum is append-only and becomes the durable handoff for the next YARP run.
