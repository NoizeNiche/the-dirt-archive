# Broad-Spectrum Research Handoff 01

## Why this exists
This handoff prevents the research queue from drifting back toward only the famous founding-era pedals. The active priority is now modern and broad-spectrum coverage across the entire 1960-2026 universe, with emphasis on 1990s-2026, regional builders, micro-builders, discontinued products, current releases and experimental dirt.

## Current modern discovery batches
- `research/modern-breadth-builder-seed-01.tsv`: initial modern seed universe including EAE, Fairfield Circuitry, OBNE, Chase Bliss Audio, Hologram, Pladask, Beetronics, Spaceman, Benson, Greer, Wren & Cuff, Land Devices, MAE, Mid-Fi, Industrialectric, Dwarfcraft, Black Mass, KMA, Aclam, Coda, Demedash, Mattoverse, Dawner Prince, Empress, Alexander, Caroline, Bondi, Mythos, Jackson Audio, ThorpyFX, Rainger FX, Drolo, Montreal Assembly, Red Panda, Prescription Electronics, T. Jauernig, Catalinbread, Lovepedal, SIB, FTelettronica, BFFX, SEHAT, Free The Tone, Providence, Gamechanger, GFI and more.
- `research/modern-breadth-builder-seed-02.tsv`: Fieldfare Audio, Non-Human Audio, Twilight Pulse Audioworks, Spiral Electric FX, Klowra, Sonicake, Mile End Effects.
- `research/modern-breadth-builder-seed-03.tsv`: Breña FX, Argenziano Effetti, Cachalote Audio, Artifact Pedals.
- `research/modern-breadth-builder-seed-04.tsv`: Mystic Effects Co, StonegateFx, Hungry Robot Pedals.

## Public runtime modern extensions
- `public/catalog-extensions-141.js`: modern batch 02, REC-675 through REC-705.
- `public/catalog-extensions-142.js`: modern batch 03, REC-706 through REC-721.
- `public/catalog-extensions-143.js`: modern batch 04, REC-722 through REC-737.

## Homepage recent-record system
`public/catalog-recent-home.js` is now dynamic rather than hard-coded. It waits for extension merges, refreshes `data.json` without cache, ranks current dirt records from the live catalog, shows up to 25 records in five-card pages, and rotates every seven seconds. Current extension load target runs through 143. Homepage cache key is `20260916-recent4`.

## Builder logo system
- `public/catalog-builder-logo-manifest.js`: generated logo registry.
- `public/catalog-builder-logo-ui.js`: applies logo/initials thumbnails to builder census cards and observes dynamically rendered cards.
- `scripts/builder_logo_harvest.py`: harvests likely logo assets from official builder source pages and Wikimedia Commons, scores source/domain/context quality, and records source attribution.
- `.github/workflows/photo-harvest.yml`: runs builder-logo harvesting alongside pedal/variant/hard-case photo harvesting.

The logo harvester reads the canonical builder census plus all `modern-breadth-builder-seed-*.tsv` files, so modern builders can receive logo candidates before they are promoted to the canonical master ledger.

## Current workflow status
A GitHub Actions run was kicked off from commit `dc3e6284227c93fcfa24f725f460b543ce33b191` with title `research: kickoff builder logo harvest`. The photo/logo harvest workflow is expected to generate the logo manifest and photo manifests, then auto-commit them.

## Research rule going forward
When continuing the project, prioritize:
1. modern/current product discovery
2. overlooked modern and regional builders
3. complete builder dirt catalogs
4. OEM/rebrand reconciliation
5. product and variant photography
6. deep historical specimen work only after breadth coverage is substantially mapped

Do not let an interesting vintage pedal displace a broad modern discovery batch unless the evidence is unusually ephemeral or resolves a major identity/lineage problem.
