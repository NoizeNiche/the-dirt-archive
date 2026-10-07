# Deep Research Protocol

## Purpose

The original catalog research pass established a broad researched baseline. The next phase is different: create a **forensic dossier** for every individual pedal, beginning at catalog record 1 and moving forward in canonical order.

This phase is deliberately separated from the normal catalog/research worker so that open-ended research never becomes a large monolithic CI job.

## Operating model

```
CANONICAL CATALOG
      |
      v
SCOUT  -> small source packet
      |
      v
DOSSIER -> one pedal, one research pass
      |
      v
VERIFY  -> evidence + structure checks
      |
      v
CHECKPOINT COMMIT
```

Only the Scout phase may run in parallel. Dossier synthesis is intentionally one pedal at a time.

## Batch limits

- Scout dispatch: **1–4 pedals**
- Scout worker: **1 pedal**
- Scout HTTP timeout: approximately **7 seconds per request**
- Scout concurrency: at most **2 active pedals** at once
- Dossier synthesis: **1 pedal per assistant research run**
- Dossier checkpoint: commit after every completed or explicitly blocked pedal

The goal is not maximum throughput. The goal is that a failed source, bad page, or interrupted session affects one pedal rather than an entire batch.

## Durable state

`research/DEEP_RESEARCH_TRACKER.csv` is the operational tracker for this phase.

Allowed states:
- `PENDING` — not yet scouted
- `SCOUTED` — source packet exists and is ready for dossier work
- `RESEARCHING` — dossier work is actively being performed
- `COMPLETE` — dossier has passed the verification gate
- `BLOCKED` — the record needs a human/source decision before further work
- `SCOUT_FAILED` — scout could not produce a usable packet; the record can be retried independently

The tracker is derived from the canonical catalog, but its status is durable workflow state. It must never replace the catalog as the identity source.

## Identity gate: model, version, or cosmetic variant

Before opening a full dossier, perform an **identity-resolution pass** on nearby catalog records and known editions of the same product family.

Classify the target as exactly one of:
- **MODEL / VERSION** — a distinct public identity such as a documented V2/V3/Mk revision, redesigned circuit, or separately named model
- **COSMETIC VARIANT** — same model/version with a different color, finish, artwork, retailer/event presentation, knob color, or similar non-circuit treatment
- **FUNCTIONAL VARIANT / EDITION** — same parent model/version identity, but with a documented component, clipping, control, power, switching, PCB, or other functional difference that belongs on the parent page as a documented variant
- **UNCERTAIN** — evidence is insufficient; preserve the ambiguity rather than guessing

Use these tests before treating a record as a standalone research unit:
1. Compare exact builder/model naming, version labels, revision numbers, and first-party descriptions.
2. Search the color/finish name together with the base model and look for explicit statements that it is the same circuit.
3. Compare controls, power, clipping, op-amps/ICs, PCB/construction, switching, and stated sound where documented.
4. Treat **V2, V3, Mk II, revised, redesigned, or similarly explicit revision language as a separate identity until evidence proves otherwise**, even when the artwork/color matches an older version.
5. Treat a color or graphic name as cosmetic **only after checking that it does not hide a documented functional revision**.

When a record is confirmed as a **COSMETIC VARIANT** or **FUNCTIONAL VARIANT / EDITION**:
- do **not** create a separate full model dossier
- research enough to establish the parent relationship and identify any meaningful difference
- attach it to the parent model as a colorway/edition/functional variant in the canonical catalog
- put unique provenance, release context, or variant-specific technical details in the parent record's **Colorways & Editions / Variants** section
- keep a compact variant note/source trail when useful for archival provenance

A functional variant may still remain a child of the parent page. Do not create a new top-level public model merely because a component changed. The question is whether the builder presents it as a distinct model/version or as a variant/edition of the same parent identity.

This rule applies recursively throughout the catalog. A red, purple, white, black, Hyperfade, retailer edition, or event graphic is **not automatically a new pedal**. Conversely, a V2/V3 or other documented engineering revision is **not automatically the same pedal** merely because it shares the enclosure or colors.

The archive's goal is to represent **real product identities cleanly while preserving the visual and historical richness of the variants**.

## Scout rules

The Scout should:
1. Start with first-party builder pages, manuals, archived builder pages, and exact-model documentation.
2. Reuse already-known exact-model source leads.
3. Search independently when exact leads are insufficient.
4. Reject obvious unrelated pages, sibling-model pages, generic category pages, and navigation/UI pages.
5. Preserve URLs, page titles, identity signals, source type, and compact evidence excerpts.
6. Stop when it has a useful evidence packet. More sources are not automatically better.

The Scout does **not** decide historical truth and does not write the final dossier.

## Dossier rules

The Dossier pass should investigate one exact Builder + Pedal identity at a time.

Minimum investigation areas:
- Exact identity and aliases
- Production period and revision chronology
- Controls and documented specifications
- Circuit/topology information when documented
- Components and technical architecture when documented
- Builder/designer history
- Relationship to other models and documented lineage
- Reissues, revisions, regional editions, and materially different versions
- Historical context and primary-source evidence
- Sound/use context when supported by reliable sources
- Conflicting claims and unresolved questions

Do not turn absence of evidence into a negative claim. Use wording such as “no surviving source was located in this pass” when appropriate.

## Evidence standard

For consequential claims, prefer:
1. manufacturer/builder documentation
2. manuals, catalogs, archived first-party material
3. exact-model specialist references
4. reputable historical/technical sources
5. owner discussions and used-market listings as supporting evidence

A second independent source is strongly preferred for important historical or technical claims.

Never claim circuit equivalence, copying, cloning, or lineage merely because two pedals look similar, share controls, or have matching broad technical facets.

## Output contract

Each completed dossier lives under:
`research/dossiers/{builder}/{pedal}.md`

Use the template in `research/DEEP_RESEARCH_TEMPLATE.md`.

The existing `research/pedals/**/*.md` files remain the baseline research layer. The dossier is the deeper archival layer and should not overwrite or silently downgrade the existing record.

## Failure handling

A timeout is a local failure, not a project failure.

- Retry one source independently.
- Try another source host.
- Save the usable evidence already found.
- Mark the pedal `BLOCKED` or `SCOUT_FAILED` when appropriate.
- Commit the checkpoint.
- Continue at the next canonical record.

Never rerun an entire 20–80 pedal batch because one record failed.

## Research-session discipline

For assistant-led dossier work:
- keep web searches narrow
- inspect one source at a time
- extract only the relevant sections
- avoid dumping whole long pages into the context
- preserve source URLs in the dossier
- write and verify one dossier before moving to the next record

This is the central anti-timeout rule:

**small evidence packet -> one pedal -> one dossier -> one checkpoint.**

## What this phase is trying to discover

The ultimate goal is not merely longer descriptions. It is to let the archive surface documented relationships that ordinary pedal databases flatten away:

- revision lineage
- circuit-family relationships
- designer/build lineage
- component changes across versions
- historical reissues
- unusual technical combinations
- contradictions between surviving sources
- gaps where the historical record itself is incomplete
