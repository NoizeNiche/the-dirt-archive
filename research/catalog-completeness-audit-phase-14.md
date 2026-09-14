# The Dirt Archive — Catalog Completeness Audit Phase 14

## Purpose

The discovery layer must not stop at one famous or representative pedal per builder. When a builder/company is admitted into the archive, the research process should attempt to capture the builder's **entire documented lineup**, including fuzz, overdrive, distortion, boosts, compound effects, collaborations, special editions and other pedal products where the source treats them as separate products.

The public site may still foreground dirt effects, but the underlying archive should preserve the full product lineage so later pedal pages have the surrounding context.

## Current audit targets

### Fuzzrocious Pedals
Effects Database currently lists **43 products** for Fuzzrocious. The builder page describes the company as a small operation run by Ryan Ratajski and Shannon Ratajski, with Ryan handling building/design and Shannon hand-painting. The page also preserves Ryan's timeline beginning around 2008. Source: https://www.effectsdatabase.com/model/fuzzrocious

The full 43-product list has been captured in `public/discovery-14.tsv`, including:

- 420 Fuzz
- Afterlife - Reverb
- Anomalies
- Baxstabber
- Blast Furnace
- Broke Dick Peanut Gallery
- Cat King
- Cat Tail
- Cicada Fuzz
- Dark Driving
- Darkest Driving
- Demon King
- Empty Glass
- Feed Me
- Green Stache
- Grey Stache
- Grey Stache Plus
- Heliotropic
- K-A-E-D-E-N Drive
- LunaReclipse
- M.O.T.H.
- Mail Order Muff
- Momster
- Octave Jawn
- Oh See Demon
- Afterlife v2
- Grey Stache / Heliotropic
- Knob Jawn
- Playing Mantis
- Ram The Manparts
- Rat King
- Rat Tail
- Terrordactyl
- The Octavus
- The Overdose
- There Is No Dana... Only Zuul
- Tremorlo
- Tremorslo
- TS El Oso
- Walking Delay
- EF110G Maggotor Gated Fuzz
- Electro-Faustus / Fuzzrocious Greyfly
- Tone Mob Typhon

### BMF Effects
Effects Database currently lists **17 products**. The builder page identifies Scott Kiraly as the builder and records a first commercial pedal sale on September 17, 2005. Source: https://www.effectsdatabase.com/model/bmf

The full 17-product list has been captured in `public/discovery-14.tsv`:

- Aries Fuzz
- Decho Box
- El Jefe
- Fat Bastard
- GB Boost
- Ge Spot F2
- Ge Spot MkI
- Holy Balls
- Liquid Sky
- Liquid Sky Deluxe
- Little Red Compressor
- Purple Nurple
- Rocket 88
- Sisyphuzz
- Son of Bastard
- Squawk Box
- The Great Wide Open

### Devi Ever FX
Effects Database currently labels the builder page as **75 products**, but the page currently exposes **74 numbered product entries** in the rendered catalog. This discrepancy is preserved rather than silently inventing a 75th product. Source: https://www.effectsdatabase.com/model/deviever

The page documents Devi Ever's timeline: founded sometime in late 2003 under the Effector 13 name; in 2008 the original company name and selected designs were licensed to Ooh La La Manufacturing; rights were regained after two years, while Devi continued building under the Devi Ever name. This is historically important because Effector 13, Ooh La La, and Devi Ever should be modeled as connected but distinct entities rather than merged.

The 74 currently visible product entries have been captured in `public/discovery-14.tsv`. The archive should later investigate whether the page's 75-product total includes a dynamically hidden product, duplicate/relationship record, or stale counter.

## Critical normalization rule

A complete lineup capture does **not** mean every entry becomes a separate generation. Product, edition, finish, collaboration, rehouse, and family relationships must be distinguished during later normalization.

Likewise, collaboration names such as Fuzzrocious / Tone Mob Typhon and Electro-Faustus / Fuzzrocious products should preserve the participating entities and not automatically be attributed to one builder.

## Research workflow going forward

For each builder:

`Builder discovered -> builder page found -> current product count recorded -> every visible product captured -> collaborations/editions flagged -> historical/defunct product candidates searched -> official/archival sources compared -> product records normalized -> individual pedal pages deep-researched`

This audit exists specifically to prevent the recurring failure mode of capturing only the famous three or five products from a builder while overlooking the rest of its documented catalog.

## Source observations

Effects Database explicitly states that one of its long-running priorities is to include small builders, including companies that once existed mainly through eBay and forum presence. That makes builder-level product-count auditing particularly useful for The Dirt Archive's preservation mission. Source: https://www.effectsdatabase.com/

