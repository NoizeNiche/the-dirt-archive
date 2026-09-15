# YARP 2026-09-15 Batch 20 — Threshold Promotion

## Purpose

This batch converts the strongest research edges into a machine-readable, public-safe candidate layer while retaining unresolved manufacturer and variant questions as HOLD_FOR_REVIEW.

## Research decisions

### Colorsound / Sola Sound
- Tone Bender MKIV and Tone Bender Fuzz are retained as related historical production/name states rather than forced into a single undifferentiated model.
- Power Boost and Overdriver are separate retail/production states with a documented transition; the original Power Boost is associated with the earlier 18V corridor and the Overdriver with the later 9V renamed state.
- Park Fuzz Sound, Carlsbro Fuzz, and CSL Super Fuzz remain marketed/OEM identities tied to the Sola Sound family.
- Wah Fuzz / Wow Fuzz naming is preserved as an alias question until period advertising resolves exact typography by corridor.

### Ibanez SoundTank
- The Ibanez catalog archive confirms dedicated 1989 and 1991 SoundTank catalog corridors.
- CR5, TM5 and SF5 are treated as early SoundTank catalog products.
- SF5 and FZ5 are linked as a model lineage rather than collapsed into one production state.
- TS5 is treated as a model-specific manufacturing exception candidate.
- Blanket SoundTank-to-Maxon attribution remains HOLD_FOR_REVIEW because corporate history and specialist/model-level evidence do not presently agree cleanly enough for a universal claim.

## Public-runtime rule

Only PROMOTE rows from `research/public-lineage-runtime-candidates-02.tsv` should be eligible for future public lineage rendering. HOLD_FOR_REVIEW rows remain searchable research records but must not appear as settled manufacturing facts.

## Evidence boundary

No schematics, PCB layouts, complete bills of materials, gutshot archives, or circuit reconstruction material are published. This batch is about historical identity, catalog relationships, and production-state distinctions.

## Next queue

1. Continue model-specific SoundTank audit beyond TS5.
2. Expand later Colorsound dirt products and period catalog states.
3. Audit remaining Japanese OEM brands for duplicate marketed names.
4. Run a repo-wide duplicate-key/alias scan before wiring runtime data into the public site.
