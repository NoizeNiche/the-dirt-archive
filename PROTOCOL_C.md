# Protocol C

## Priority
Protocol C is the highest-priority workstream for The Dirt Archive until its goals are substantially complete.

The objective is to make the public archive genuinely useful, visually identifiable, and ready for a public social-media launch. Internal cleanup is supporting work only. It must not become the destination.

## Visitor goal
A visitor should be able to:

1. Find a pedal by builder, category, era, or name.
2. Open a pedal record and immediately understand what it is.
3. See a prominent reference photograph when a suitable public-use image exists.
4. Compare generations or production states with moderately large clickable images.
5. Read concise historical context and practical identification clues.
6. Follow evidence and image credits.
7. Use the site as an identification aid even when they do not know the exact model.

## Two parallel workstreams

### A. Public experience
Strengthen the browsing and pedal-page experience around:

- Browse by Builder
- Browse by Category
- Browse by Era
- Identify My Pedal
- Compare Generations
- Photo Archive
- clear, consistent pedal pages
- strong visual hierarchy
- generation photographs beside generation names
- no vertical metadata strip beneath the main pedal photograph

### B. Visual research
Build the photographic reference library alongside the information archive.

Prioritize:

1. historically important dirt pedals
2. models with multiple visually distinct generations
3. records already supported by strong research
4. images from sources that can legitimately be displayed
5. useful image leads for records that cannot yet be cleared for public display

Public-use images may come from appropriate manufacturer material, public-domain or compatible Creative Commons sources, historical scans where reuse is permitted, and explicit permission. Reference-only images remain research leads and are not silently republished.

## Information breadth
Collect broad, useful historical information for a large number of pedals rather than over-perfecting a small number of records. Record generation differences, dates, builders, production relationships, visual clues, documented changes, and evidence where available.

Do not publish gutshots, schematics, PCB diagrams, complete bills of materials, or cloning instructions.

## Definition of done
Protocol C is not considered substantially complete until:

- the site presents a coherent user-facing archive experience;
- the main navigation supports the core browse and identification paths;
- pedal pages visibly prioritize the object and its history;
- generation comparison is a prominent visual feature;
- the photo archive clearly distinguishes archive-ready images from research leads;
- a meaningful portion of the existing researched collection has usable photographs or documented image leads;
- research coverage is broad enough to support a public social-media introduction;
- the final experience has been checked repeatedly for broken routes, missing scripts, layout regressions, and accidental changes to `main`.

## Safety rule for changes
Every site change is followed by the project's quadruple-check:

1. architecture check
2. browser smoke check
3. verify the intended branch/PR state
4. verify `main` remains unchanged

Small internal cleanup may be done when it directly reduces risk to Protocol C. New cleanup work without a visitor-facing or research-library benefit is deferred.