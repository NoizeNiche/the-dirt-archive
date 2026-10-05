# Operations

## Current operating model

The archive uses a two-speed model.

### Production / finish-line

Photo recovery is a bounded write lane. It is explicit, resumable and serialized against other canonical write jobs.

A successful recovery batch commits verified assets and derived state to `main`. Deployment is handled by the normal filtered `main` deployment path. Recovery should not dispatch a second deployment or recursively queue another recovery run.

### Archive growth

Research growth is a separate weekly lane. It is bounded so research can continue without making production photo work depend on a large multi-worker sweep.

### Quality

Fast structural validation stays close to relevant changes. Heavy exhaustive audits are weekly/manual. Hourly site health is read-only.

## Change ownership

Only one automation should be the normal writer for a given concern.

| Concern | Normal writer |
| --- | --- |
| Public catalog synchronization | research/catalog sync workflows |
| Tracker/queue derivation | sync/build scripts |
| Exact photo recovery | Fast photo catch-up |
| Photo content quarantine | photo-content quarantine workflow |
| Structural validation | Validate The Dirt Archive |
| Deployment | Deploy The Dirt Archive |
| Live health | Hourly Site Health (read-only) |

Specialist workflows exist for recovery or historical operations but should not be scheduled without a specific reason.

## Maintenance checklist

After a meaningful repository change:

1. inspect the changed owner file(s)
2. run the narrow validator first
3. inspect derived catalog/tracker state
4. confirm the public page or workflow touched behaves as intended
5. update the project checkpoint/documentation when architecture changes

## Avoiding CI churn

Do not react to a failed workflow by immediately adding another trigger.

First determine whether the failure came from:

- a stale checkout
- competing writers
- an over-broad path trigger
- a missing dependency
- a true data or browser defect

Prefer fixing the owner or removing the redundant trigger.

## Current photo closeout

The current canonical production state has four exact-photo gaps:

- Compulsive Audio — Jimi - Octave Fuzz
- Bad Penny FX — Lollygagger Overdrive
- BJFE / BJF Electronics — Sun Burst Fuzz
- Captain FX — War Pig

These stay photo-needed until an exact local asset passes the existing identity and content gates.

## Developer recovery

When resuming work, trust the repository:

```
CURRENT_STATE.md
    ↓
research/RESEARCH_QUEUE.json
    ↓
latest main commits
    ↓
target owner / source table
    ↓
narrow validation
```

Never infer state from an interrupted chat session.
