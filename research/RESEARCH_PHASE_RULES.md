# The Dirt Archive - Catalog Research Phase Rules

## Purpose

The active production phase after PRP1 is the **Catalog Research Phase**.

Its job is to turn the remaining canonical catalog identities into useful public records. It is a research/content phase, not a second photo gate.

The public data flow is:

`Builder + Pedal -> Research Record -> Catalog Sync -> Photo Recovery -> Local Photo -> Complete`

## Source of truth

- `research/PEDAL_INDEX.json` owns the canonical public catalog identity.
- `research/pedals/**/*.md` owns research prose.
- `research/PRP_TRACKER.csv` derives the current research/photo/completion state.
- `research/RESEARCH_QUEUE.json` is a generated working view only. It is never a second source of truth.
- `assets/pedals/**` owns local public photo assets.
- `image_source_url` / `image_source_page` retain photo provenance.

## Research work order

Research proceeds in canonical catalog order.

For each incomplete model/version:

1. verify Builder + Pedal identity against the builder master index and catalog
2. determine whether the record is a model, material version, or subordinate variation
3. create or complete the pedal research record
4. synchronize the research record into the catalog
5. synchronize the tracker
6. let photo recovery work independently on researched records
7. validate before considering the batch published

A difficult research record may be parked after a responsible attempt. It must not create a permanent queue deadlock.

## Research record minimum

Each researched pedal should cover, when supported by evidence:

- What this pedal is
- Colorways
- Versions and factory options
- Version changes
- Transistor
- Diode
- Sound

Unknown or undocumented component information should be stated plainly rather than guessed.

## Public-site behavior

A researched record may appear on the public site before it has an archived photo.

When an exact local photo is unavailable, the public page shows **No Photo Archived**.

Research administration never appears on the public pedal page.

## Photo independence

Photo recovery remains a separate operational lane.

A researched record can therefore move through these states independently:

- research missing
- researched / photo missing
- researched / photo recovered
- fully complete

PRP1 is no longer the name of the active research phase. Its workflow is retained only as a narrow publication/closeout mechanism for legacy researched-photo units.

## Queue generation

`research/RESEARCH_QUEUE.json` is generated from the live catalog and tracker.

The queue must always expose:

- active phase
- total catalog records
- researched count
- remaining research count
- current next target
- a small practical working set in catalog order

Do not hand-edit the queue.

## Completion

A research record is considered **researched** when a valid research markdown file exists and is wired to the canonical catalog.

A record becomes fully complete only when that research record and an exact local photo both exist.

The research phase may therefore advance even while photo recovery is still processing previously researched records.
