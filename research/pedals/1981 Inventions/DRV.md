# 1981 Inventions — DRV

## PRP identity

- **Archive parent:** DRV
- **Builder:** 1981 Inventions
- **Catalog type:** Distortion
- **Identity:** 1981 Inventions's DRV.

## What this pedal is

The **DRV** is 1981 Inventions' original distortion/preamp design. Its documented starting point was a **1985 Whiteface ProCo RAT**, but the DRV is not simply a one-for-one RAT copy. Matthew Hoopes described a fixed, always-on preamp ahead of the distortion section, roughly one twentieth the gain of a traditional RAT, and deliberate changes to the low end, midrange, filter sweep, level behavior, switching, LED implementation, and internal filtering.

The low-gain region was a central design goal. Hoopes described it as a zone where a preamp/boost character meets low-gain distortion, giving the pedal a different response from a conventional RAT.

## History

- Development involved **Matthew Hoopes** and **Jon Ashley of Bondi Effects** over a multi-year period.
- Hoopes released the first DRV run publicly in **June 2018**. In interview coverage, he said the first run sold out overnight.
- In June 2020, 1981 Inventions announced a first DRV run that was not limited by a fixed number of units, instead accepting orders during a defined sales window.
- The DRV became the catalyst for the launch of 1981 Inventions as a pedal company.

1981 Inventions is currently described by the manufacturer as founded by Matthew Hoopes and co-run with Laura Hoopes, with pedals built in Nashville by Hoopes and Jack O'Shea.

## Controls

- **DRV:** gain/drive.
- **CUT:** high-frequency roll-off/filter.
- **VOL:** output level.

The three controls are highly interactive. The original interface also uses an on/off footswitch and LED.

## Circuit architecture

Manufacturer-derived documentation describes the DRV as containing **two functional circuits**:

1. a distortion circuit
2. a preamp/boost circuit

The same description says the circuits operate at **18V internally** from a standard **9V external supply**, using internal voltage conversion.

A 2019 third-party circuit reconstruction describes a tweaked RAT core surrounded by **two op-amp gain stages** and **buffered bypass**. The reconstruction documents an LT1054-based voltage-doubler arrangement. It also identifies 1N4148 silicon diodes in the clipping section. These are useful technical reconstruction records, but they should not be treated as an unquestioned factory bill of materials.

Hoopes also described adding filtering intended to simulate characteristics he liked in favorite LM308-era RATs, while noting that other ICs could work well in the DRV. For that reason, the archive does **not** currently assert that the original DRV universally used an LM308.

## Switching, enclosure, and power

The original manufacturer-derived description specifies:

- uniquely designed **steel enclosure**
- **Switchcraft 11** open-frame jacks
- a quiet **soft-touch switching system using an internal relay**
- standard **9V Boss-style external power**
- internal operation at **18V**

The original DRV is documented by technical secondary sources as using **buffered bypass**. Later DRV-family products introduce different bypass options, so those should remain attached to their specific records.

## Lineage and versions

### Upstream design relationship

**1985 Whiteface ProCo RAT → 1981 Inventions DRV**

This is an explicitly documented design starting point from Matthew Hoopes.

The DRV should therefore be described as **RAT-derived / RAT-inspired**, not as a generic unrelated distortion circuit and not simply as a stock RAT clone.

### 1981 Inventions DRV family

- **DRV:** original/core record.
- **DRV MOD 1:** later modified configuration with additional circuit changes and, in its current manufacturer documentation, an OPA2134 option and zero-gain behavior.
- **DRV MOD 2:** later modified generation.
- **DRV2:** redesigned DRV-family generation. 1981 Inventions says the original was engineered by Jon Ashley and the DRV2 was redesigned/engineered by John Snyder of Electronic Audio Experiments.

Those later records remain separate identities in the archive.

## Sound

The DRV is designed to cover clean-ish boost, low-gain overdrive, and more aggressive distortion. Its distinctive behavior is concentrated around the low-to-medium-gain region, where the fixed preamp and reduced gain structure create a more controlled transition into distortion than a traditional RAT.

Hoopes emphasized the low-gain and boost region as the part he considered most unique, while also describing the gain section as useful for heavy and complex chords, with strong midrange presence, warmth, and thickness.

## Technical qualifications

### Exact production op-amp

**Unknown at the factory-production level.**

Technical DIY reconstructions commonly use TL072 devices, while the later DRV MOD 1 manufacturer page specifically names a Burr-Brown OPA2134 as a feature of that modified configuration. Neither fact is sufficient to establish a universal op-amp part number for the original production DRV.

### Exact clipping-device part

A published third-party circuit reconstruction identifies **1N4148 silicon diodes** in the clipping section. This is useful reconstruction evidence, but the archive does not currently elevate it to an unquestioned universal factory BOM.

### Exact revision chronology

A complete board-level revision chronology for the original DRV has not yet been established.

## Source-history notes

There is an interesting naming-history wrinkle. The current 1981 Inventions FAQ explains "1981" as the founder's birth year and a nod to a golden era of analog gear. In a 2022 SPIN interview, Hoopes additionally described a **1981 Tube Screamer** as a personally important reason for the name, while also noting that he was born in 1981. The archive preserves both public explanations rather than choosing between them.

The early production record also differs from the current one. An older manufacturer-derived description says Hoopes built the original pedals with PCB assistance from Jeff Hime, while the current About page describes Nashville production with Jack O'Shea. This is best treated as a change in production assistance over time.

## Sources checked

1. 1981 Inventions - About: https://1981inventions.com/pages/about
2. 1981 Inventions - FAQ: https://1981inventions.com/pages/faq
3. 1981 Inventions - DRV collection: https://1981inventions.com/collections/drv
4. 1981 Inventions - DRV2 No3: https://1981inventions.com/products/drv2-no3-clear-knob
5. Guitar.com - Interview: https://guitar.com/features/interviews/interview-matthew-hoopes-of-1981-inventions/
6. Guitar.com - DRV review: https://guitar.com/reviews/effects-pedal/review-1981-inventions-drv/
7. Effects Database - DRV: https://www.effectsdatabase.com/model/1981inventions/drv
8. Effects Layouts - DRV technical reconstruction: https://effectslayouts.blogspot.com/2019/06/1981-inventions-drv.html
9. Guitar FX Layouts / Tagboard Effects - DRV technical discussion: https://tagboardeffects.blogspot.com/2019/07/1981-inventions-drv.html
10. SPIN - Matt Hoopes / 1981 Inventions: https://www.spinmagazine.com/2022/06/relient-k-matt-hoopes-1981-inventions/

## Photo

- **Archive status:** Photo recovery is handled separately.
