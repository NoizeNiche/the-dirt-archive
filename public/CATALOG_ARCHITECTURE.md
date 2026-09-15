# The Dirt Archive: catalog architecture

## Public presentation

The public site has five stable ways to enter the archive:

- **Builder**: who made, marketed, distributed, or historically produced the object.
- **Category**: fuzz, overdrive, distortion.
- **Era**: introduction decade and later production periods.
- **Identification**: enclosure, graphics, controls, branding, and production clues.
- **Pedal record**: the complete editorial entry for one named object/family.

## Entity rule

A builder record represents a real-world organization or historically meaningful entity. A marketed badge is not automatically treated as the physical manufacturer.

When several brands share a production network, they remain distinct historical objects but are grouped for browsing. Current organization families include Sola Sound, Schaller, Jen Elettronica, Shin-Ei, and Maxon/Hoshino relationships.

This prevents the builder index from becoming a wall of near-duplicate names while preserving historically useful relationships.

## Pedal-page rule

Pedal pages are editorial entries, not database dumps. The preferred reading order is:

1. object/reference image
2. short version
3. history
4. how to identify it
5. production history
6. notable differences
7. documentation and evidence

Structured research remains in the data layer so future research can be deeper without making the public page harder to read.

The archive does not publish schematics, PCB layouts, gutshot libraries, complete BOMs, or cloning instructions.

## Runtime rule

`catalog-manifest.js` is the single public script entry point. It preserves the established research/enrichment execution order while removing the giant script list from `index.html`.

New presentation work should be added to a canonical runtime or data layer, not as another numbered `catalog-extensions-*` file.

The numbered files are treated as historical research layers until their data is safely consolidated. They should not be deleted merely for cosmetic cleanliness.
