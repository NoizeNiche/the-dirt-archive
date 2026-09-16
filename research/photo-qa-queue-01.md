# Photo QA Queue

Purpose: manual/source verification queue for pedal photographs that automated harvesting cannot establish with sufficient confidence.

## Acceptance rules

- Exterior pedal imagery only for the public photo layer.
- Do not publish gutshots, PCB photographs, schematics, circuit diagrams, or complete internal layouts.
- Prefer exact builder + model identity over model-name-only matches.
- Preserve source page, photographer/credit, and license/usage information whenever supplied.
- A source page may be linked as a research reference even when republication rights are not established.
- Historically meaningful variants should receive separate photo targets when visual differences matter for identification.

## Queue states

`FOUND` = automated source produced a plausible exterior reference.

`PAGE_FOUND_NO_IMAGE` = exact source/product page found, but no acceptable exterior image was extracted.

`UNRESOLVED` = no source page passed the current identity threshold.

## Next pass

When the photo harvest workflow refreshes, sort this queue by builder/model and work through unresolved records using first-party pages, Effects Database, specialist archives, and historically specific searches. Do not bulk-promote weak matches into public galleries.
