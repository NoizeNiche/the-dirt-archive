# The Dirt Archive Breadcrumb Addendum — 2026-09-15-41

Append-only continuation of `research/BREADCRUMB.md` and prior addenda.

## YARP batch 41 handoff

Extended German OEM reconciliation around Schaller and Höfner, separating strong model-level OEM matches from early Höfner models where builder involvement remains uncertain.

Committed:
- `research/schaller-hofner-oem-audit-06.tsv`

## Historical findings

- Höfner No. 540 Fuzz Tone is retained as a high-confidence Schaller OEM relationship: Höfner's 1967 catalog introduced the model, and surviving Höfner documentation notes versions carrying Schaller markings.
- Höfner No. 539 Fuzz/Distortion is retained as a high-confidence Schaller-built OEM state and kept separate from the marketed Höfner identity.
- Höfner Wha-Wha-Fuzz is retained as a high-confidence Schaller-produced West German model with related Schaller and Kent 6406 states.
- Schaller Fuzz-Sustain is documented as a Schaller-built family with Höfner Fuzz-Sustain and Allsound SC-30/SC-31 marketed states.
- Kent 6400 Distorter and Blackfield Fuzz remain high-confidence Schaller OEM states.
- Van Hall Fuzz remains HOLD_FOR_REVIEW because current evidence is family-level rather than model-specific.
- Höfner Z / Effekt-Pedal Nr.1 remains HOLD_FOR_REVIEW for direct Schaller attribution. The Höfner archive documents substantial Schaller involvement in the range but also flags uncertainty around specific early models.
- No blanket conclusion was made that every German Höfner pedal was Schaller-built.

## Validation posture

The Schaller family now has a cleaner split between directly evidenced OEM models and early Höfner designs where the surviving documentation only establishes collaboration or broader Schaller involvement. Public promotion should follow the model-specific evidence, not the family resemblance.

## Boundary / safety state

No schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions added.

## Current queue

1. Continue German/Austrian OEM reconciliation, especially Allsound and other labels appearing beside Schaller designs.
2. Audit the new Schaller/Höfner rows against the repo-wide alias/duplicate ledger.
3. Continue EKO model-by-model research, with Multitone retained as mixed-origin HOLD_FOR_REVIEW.
4. Prototype builder-aware public relationship records with explicit `builder`, `period`, and `evidence_status` fields.

## Sources used this batch

- https://www.vintagehofner.co.uk/factfiles/pedal/pedals.html
- https://www.effectsdatabase.com/model/hofner/fuzz
- https://www.effectsdatabase.com/model/hofner/whawhafuzz
- https://www.effectsdatabase.com/model/schaller/whawhafuzz
- https://www.effectsdatabase.com/model/schaller/fuzzsustain
- https://www.effectsdatabase.com/model/schaller/doublepedal
- https://www.effectsdatabase.com/model/hofner/doublepedal
- https://www.effectsdatabase.com/model/kent/schaller/6400
- https://www.effectsdatabase.com/model/blackfield/fuzz
- https://www.effectsdatabase.com/model/schaller/fuzz
- https://www.effectsdatabase.com/model/hofner/z

## Continuity rule

Append another dated addendum after the next repository write batch.
