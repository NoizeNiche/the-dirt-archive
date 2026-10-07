# 1981 Inventions — DRV MOD 1

## Research status

- Research phase: Deep archival dossier
- Builder: 1981 Inventions
- Pedal: DRV MOD 1
- Canonical catalog identity: 1981 Inventions + DRV MOD 1
- Existing baseline research: ./research/pedals/1981 Inventions/DRV MOD 1.md
- Research date: 2026-10-06

## 1. Exact identity

**DRV MOD 1 (WHITE)** is a distinct DRV-family record representing an original **V1 configuration** of the DRV circuit. 1981 Inventions' current product page explicitly describes it as the original configuration for the circuit and "technically a prototype."

The white enclosure is part of the currently documented MOD 1 edition, but the circuit identity is more important than the cosmetic finish. MOD 1 should remain separate from the base DRV, DRV MOD 2, and DRV2 records.

## 2. Chronology and versions

The current manufacturer describes MOD 1 as the earliest/original DRV configuration, later returned in extremely limited quantities.

Matthew Hoopes' April 2024 first-person deep dive states that the renewed run was intended to finish at roughly **100 units**. This creates a useful distinction between the historical prototype/V1 concept and a later limited reissue of that concept.

The renewed batch uses the original PCB design and through-hole construction but a slightly updated, lighter aluminum enclosure. That enclosure change belongs to the renewed batch and should not be assumed to describe every early prototype unit.

The broader DRV family should remain separated:

- DRV: core/base record
- DRV MOD 1: V1/prototype-oriented configuration
- DRV MOD 2: later modified generation
- DRV2: later redesigned generation

## 3. Controls and specifications

MOD 1 retains the DRV three-control interface:

- **DRV:** gain/drive
- **CUT:** tone/high-frequency shaping
- **VOL:** output level

The defining extra behavior is not a fourth control but the **zero-gain state** at minimum DRV.

Power is documented as standard **9V Boss-style power**, with the manufacturer recommending an isolated supply.

## 4. Circuit and electronics

The MOD 1 is built around the original V1 DRV circuit concept, which combines the DRV's preamp and distortion sections.

### Zero-gain mode

1981 Inventions describes the zero-gain mode as taking the distortion circuit out of the signal path almost entirely while leaving the always-on preamp active. Hoopes describes the result as a dark, clean, thick boost-like sound and recommends manipulating CUT to bring more treble through.

This is a circuit-level functional distinction, not a cosmetic naming difference.

### Swappable op-amps

Hoopes' 2024 first-person description documents three socketed options:

**TL072**
- described as the standard choice
- Hoopes' favorite overall
- warm/soft low-end character
- clear response

**NE5532**
- associated by Hoopes with the character of the Bondi Effects Sick As, without claiming the MOD 1 becomes a Sick As
- adds a different midrange character
- tightens low end
- makes palm-muted playing more punchy

**Burr-Brown OPA2134**
- presented as the "Hi-Fi" option
- described as lower-noise
- smoother through the midrange
- warmer/fatter overall
- noticeably cleaner in zero-gain mode

The current 1981 Inventions product page confirms the OPA2134-equipped batch and says the original op-amp is supplied as well, with the parts socketed for finger-swapping.

### Factory modification and technical boundary

A 2024 PedalPCB community discussion points to a specific resistor change as the mechanism used to alter the DRV control behavior for the MOD 1 zero-gain implementation. This is a community analysis of the circuit rather than factory documentation, so the archive should not present that component value as a manufacturer-certified BOM unless the original schematic or board evidence is located.

The same discussion reproduces 1981's official op-amp language and is therefore useful corroboration for the existence of the three options.

## 5. Builder and designer history

The original DRV circuit was a collaboration between **Matthew Hoopes** and **Jon Ashley of Bondi Effects**.

The current manufacturer explicitly distinguishes this original engineering lineage from the later DRV2 redesign by **John Snyder of Electronic Audio Experiments**.

That makes MOD 1 historically important as a preserved form of the original Hoopes/Ashley design rather than simply another later DRV revision.

## 6. Lineage and relationships

The strongest documented relationship is:

**Original DRV V1 configuration → DRV MOD 1**

MOD 1 is not being treated as an unrelated design. It preserves the original DRV architecture while adding the zero-gain behavior and selectable op-amp configurations.

The later DRV2 is a separate generation with a documented redesign by John Snyder. The archive should not infer that MOD 1 and DRV2 are electrically identical merely because both derive from the DRV family.

## 7. Historical context

MOD 1 is valuable because it preserves a historically early configuration that might otherwise disappear behind the more common base DRV and later DRV2 products.

The renewed 2024 release also shows that 1981 Inventions itself considers the original V1 configuration significant enough to resurrect in a small collector-oriented run.

The roughly 100-unit target described by Hoopes provides a concrete indication of intended scarcity for the renewed edition.

## 8. Sound and use context

The MOD 1's most distinctive documented behavior is its **preamp-only zero-gain mode**.

At zero gain, the preamp can be used as a push into an amplifier without engaging the main distortion section. Hoopes describes it as warmer, thicker and unusually clean for this kind of device.

The selectable op-amps give the same circuit another layer of variation:

- TL072 emphasizes warmth/softness and clarity.
- NE5532 emphasizes tighter low end and punchier midrange response.
- OPA2134 emphasizes lower-noise behavior, smoother mids and a particularly clean zero-gain response.

These are designer descriptions rather than laboratory measurements and are therefore preserved as attributed design observations.

## 9. Source reconciliation

### Sources consulted

| Source | Type | What it establishes |
| --- | --- | --- |
| https://1981inventions.com/products/drv-mod-1 | Manufacturer | V1/original configuration, prototype status, original PCB, through-hole construction, zero-gain mode, OPA2134, current-batch enclosure and power |
| https://matthewhoopes.substack.com/p/drv-mod-1 | First-person designer source | 2024 MOD 1 deep dive, approximately 100-unit planned run, TL072/NE5532/OPA2134 options and described tonal differences |
| https://blog.thepedalcollaborative.com/which-1981-inventions-drv-are-you/ | Independent comparison | MOD 1 versus OG DRV and other DRV-family variants; zero-gain behavior and family distinctions |
| https://reverb.com/item/95093530-1981-inventions-drv-overdrive-mod-1 | Secondary product record | Three interchangeable op-amps and comparative descriptions |
| https://forum.pedalpcb.com/threads/informant-drv-mod-1.24029/ | Community technical discussion | Discussion of the reduced-gain modification and corroboration of official op-amp documentation |

### Conflicts and qualifications

The strongest sources agree that MOD 1 represents the original V1/prototype-oriented configuration and that it includes zero-gain behavior and selectable op-amps.

The exact resistor/component change responsible for the zero-gain behavior is based on community circuit analysis rather than a factory document and remains qualified.

The current renewed MOD 1 enclosure is aluminum and lighter than the original steel enclosure associated with the DRV family. That does not establish the enclosure material of every historical prototype unit.

## 10. Research conclusion

**DRV MOD 1** is best understood as a preserved V1 implementation of the original 1981 Inventions DRV concept, distinguished by a zero-gain mode that exposes the always-on preamp and by a socketed op-amp system allowing TL072, NE5532 and OPA2134 variants.

The manufacturer's current documentation and Hoopes' 2024 first-person account make the MOD 1 unusually well documented at the functional level. Its importance to the archive is historical as much as sonic: it preserves an early DRV configuration and provides a concrete link between the original Hoopes/Ashley design and later DRV-family revisions.

The major remaining research gap is **board-level provenance**: exact early-production component values, serial/date boundaries, and evidence showing how the prototype/V1 implementation evolved into the later DRV and DRV2 generations.
