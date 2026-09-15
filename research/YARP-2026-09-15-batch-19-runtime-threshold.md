# YARP 2026-09-15 Batch 19 — Runtime Threshold

## Completed

This batch establishes the first machine-readable, public-safe lineage candidate layer from evidence-reviewed relationships while keeping contested relationships explicitly held for review.

### Promotable lineage edges
- Honey FY-6 → Shin-Ei FY-6 as sequential historical identity.
- Shin-Ei FY-6 → Univox Super-Fuzz as OEM/market lineage.
- JEN Fuzz → Vox V828/V8281 as Italian OEM/contract lineage.
- JEN Fuzz → Elka Fuzz and Unicord Fuzz as separate marketed identities within the documented Italian family.
- Coron Distortion 10 → Grant Distortion 10 as documented OEM/rebrand relationship.
- Coron Over Drive → Storm Over Drive as documented OEM/rebrand relationship.
- Colorsound Power Boost → Colorsound Overdriver as retail successor/state relationship.
- CSL Super Fuzz / Park Fuzz Sound / Carlsbro Fuzz → Sola Sound Tone Bender Fuzz / MkIV family as documented OEM-marketed states.
- SF5 → FZ5 as a linked Ibanez retail/model family transition, with generation chronology kept distinct.

### Held for review
- Teisco Fuzz Machine → Ibanez Standard Fuzz No.59 and associated export labels.
- SoundTank → Maxon as a blanket manufacturing relationship.
- SoundTank TS5 → Taiwan/Daphon as a final manufacturer assignment.
- Supa Tone Bender → Jumbo Tone Bender as direct successor/revision.

## Runtime rule
Only rows with `public_status=PROMOTE` are eligible for first public lineage UI integration. HOLD_FOR_REVIEW records remain research-only and should never be presented as settled history.

## Why this matters
The archive can now begin consuming lineage data without mixing manufacturer identity, retail identity, OEM relationship, and successor status into one field. This is the structural bridge between the research vault and the public interface.

## Next
1. Run duplicate/alias scan across all completed builder ledgers.
2. Verify every PROMOTE edge has a stable source trail.
3. Integrate the PROMOTE-only dataset into the public runtime without exposing research-only ambiguity states unless the UI explicitly labels them.
4. Continue historical builder census in parallel; runtime work does not end breadth-first research.
