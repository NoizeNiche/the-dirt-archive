# The Dirt Archive — Variant Evidence Model

## Purpose

Every pedal promoted into the public archive should eventually have enough structured information to answer two questions:

1. **What is this pedal?**
2. **What specifically distinguishes this specimen or production variant from related versions?**

Research notes are the workbench. The catalog record is the result. Variant evidence must flow from the research layer into the catalog layer rather than remaining stranded in a research file.

## Required variant axes

For each documented generation, revision, edition, or production identity, capture the axes that are supported by evidence:

- `appearance`: enclosure shape, finish, artwork, typography, knob style/count, graphics, labels, badge treatment.
- `controls`: control names, count, arrangement, switch functions, footswitch count, external/internal controls where relevant.
- `connectivity`: jack placement, number/type of jacks, power connector, MIDI/USB or other externally visible connection points when applicable.
- `function`: documented changes to the effect's behavior, modes, routing, clipping options, gain structure, EQ functions, octave/fuzz/drive combinations, etc.
- `production`: manufacturing geography, builder/OEM, assembly context, production period, date-code clues and factory transitions when documented.
- `electronics_identity`: only documented evidence of circuit/hardware identity or revision. Never infer a circuit change from a V2/V3 label alone.
- `edition`: limited, artist, retailer, anniversary, colorway or other bounded edition status.
- `identification_value`: what a collector can actually use to distinguish the variant from another variant.

## Evidence discipline

A difference should be recorded at the smallest defensible claim level. For example:

- Good: "V2 adds an A/B selector and a second Gain/Volume pair while retaining shared Tone controls."
- Too strong without evidence: "V2 uses a completely redesigned circuit."

Each claim should retain its source and confidence independently where possible.

## Public catalog behavior

The public pedal page should eventually expose:

**Variant / generation**

A compact timeline of documented variants.

**How to identify it**

A table of observable and documented differences, emphasizing exterior clues first.

**Production identity**

Dates, factory/OEM, geography and edition information where established.

**Evidence / uncertainty**

Sources and unresolved questions, rather than silently converting gaps into certainty.

## Backfill rule

This model applies retroactively. Older catalog records that were previously added as simple pedal records should be revisited and upgraded with structured generation and distinguisher data. Modern research is not considered complete merely because the pedal name has been cataloged.

## Editorial boundary

The Archive documents the object and its historical identity, not a recipe for reproducing it. Do not publish gutshots, full schematics, PCB layouts, complete bills of materials or cloning instructions merely to explain a variant distinction.
