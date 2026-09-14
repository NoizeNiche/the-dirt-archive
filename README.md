# The Dirt Archive

Independent historical reference project for overdrive, distortion and fuzz pedals.

## Current scope

The Dirt Archive is currently focused on dirt pedals: fuzz, overdrive and distortion.

The project emphasizes:

- builder-first browsing
- product and production history
- generation, edition and production-period distinctions
- practical identification clues
- source-backed historical claims
- preservation of information about obscure and discontinued builders
- quarterly research releases rather than a promise of total completeness

## Current research program

The fuzz section is the first major research program. The repository now contains a structured discovery census covering foundational vintage fuzz, British OEM relationships, Japanese OEM families, modern boutique builders, obscure/defunct vintage builders, and broad modern boutique catalog lineups.

**Research priority is now breadth-first:** builders and their product libraries come first. Detailed work on versions, enclosure changes, production periods, identification characteristics and product genealogy follows after the builder/product universe is substantially mapped.

Research files live under `/research` and are deliberately kept separate from the public website assets.

Current phases include:

- `fuzz-discovery-phase-1.md` — broad builder/model discovery and research priorities
- `fuzz-census-phase-2-vintage.md` — foundational vintage and OEM research
- `fuzz-candidates-phase-2.json` — structured candidate records for eventual archive promotion
- `fuzz-japanese-oem-phase-1.md` — Japanese fuzz families, OEM relationships and rebrand network
- `fuzz-boutique-preservation-phase-1.md` — boutique/defunct builder preservation research
- `fuzz-obscure-vintage-phase-2a.md` — Mosrite, Rosac/Sierra, Guild, Maestro, Schaller OEMs, Elka, Baldwin-Burns, JEN/Vox, Kay, Hohner and related historical branches
- `catalog-completeness-phase-22.md` — Empress, Guild, DenTone, Montgomery Appliances and Blue Skool Records catalog discovery
- `catalog-completeness-phase-23.md` — EarthQuaker Devices, Death By Audio, Electronic Audio Experiments, Black Arts Toneworks and Fulltone catalog discovery, plus current-product additions
- `product-depth-phase-24.md` — focused historical research for major boutique dirt families
- `product-verification-phase-25.md` — evidence review and promotion rules for the strongest P1 families
- `catalog-completeness-phase-26.md` — builder-first expansion covering 19 additional builders and 364 dirt-scope discovery records

The first public verification promotion contains six structured records: Fulltone OCD, Full-Drive 2, EQD Hoof, EQD Hoof Reaper, EAE Longsword and EAE Halberd. Their generation records, source records and selected claim-level evidence are loaded by `public/catalog-verified-25.js`.

Phase 26 resumes broad catalog construction. Its discovery records are intentionally not promoted as historically verified product histories yet. The purpose is to build the map first, then return to individual boxes systematically.

A candidate or discovery record is not automatically a verified public archive record. Promotion requires evidence review, naming/relationship review and, where applicable, production-variation research.

## Editorial boundary

The archive documents historically meaningful distinctions, including component changes when they materially help identify a production period. It does not publish gutshot galleries, schematics, PCB layouts, complete bills of materials, cloning instructions, or circuit-reconstruction material.

## Site architecture

The public website lives in `/public`. Project documentation, research/database-development files and deployment configuration remain at the repository root.

## Long-term structure

Builder / designer entity
→ family
→ retail model
→ generation
→ production period
→ edition
→ specimen
→ claims + evidence

The archive is curated. It does not promise to catalog every pedal ever made.
