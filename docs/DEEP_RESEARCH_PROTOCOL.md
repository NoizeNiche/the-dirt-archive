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
