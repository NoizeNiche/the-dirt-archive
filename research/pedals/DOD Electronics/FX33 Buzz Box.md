# DOD Electronics — FX33 Buzz Box

## Surface catalog record
- **Builder:** DOD Electronics
- **Pedal:** FX33 Buzz Box
- **Catalog type:** Distortion / Fuzz
- **Research level:** Deep
- **Deep research status:** Verified
- **Identity basis:** Exact-model DOD documentation and surviving FX33 hardware references identify the FX33 as the DOD Buzz Box.

## What this pedal is
The **DOD FX33 Buzz Box** is a hybrid dirt/octave effect that combines a heavily distorted signal with a signal divided **two octaves down**. DOD's 1994 manual describes the pedal as a distortion unit with a built-in octavizer that takes the distortion signal and drops it two octaves. [1]

The front-panel controls are:
- **Heavy:** controls the blend between the main distorted signal and the lower-octave component.
- **Buzz:** controls distortion/fuzz gain.
- **Saw:** controls high-frequency emphasis.
- **Thrust:** controls output level. [1][2]

The original DOD manual identifies the pedal as inspired by the guitar sound associated with **King Buzzo of the Melvins**, specifically the combination of aggressive distortion and octave-divider effects. This is product-origin/marketing context from DOD; it should not be read as an endorsement or as proof that the artist designed the circuit. [1]

## Historical development and identity
The manual is copyright **1994 DOD Electronics Corporation**, providing a firm contemporary date for the model. [1]

Contemporary and historical sources place the FX33 in DOD's mid-1990s period. Reverb's exact-model catalog dates surviving examples to approximately **1994–1996**. Independent historical references likewise describe the FX33 as an early-1990s DOD model with a short production run. [2][3]

The FX33 is part of the DOD experimental/Lamb-era family that included unusual effects such as the FX69 Grunge. DOD's current history page specifically identifies the Lamb Series as a 1990s period of unusually experimental DOD designs and includes the Buzz Box among its vintage pedal imagery. [4]

## Signal architecture
Secondary circuit research and exact-model hardware discussions describe the FX33 as combining:
1. a DOD **FX69 Grunge-derived distortion stage**, and
2. an **MXR Blue Box-style two-octave-down divider**.

The resulting signals are combined at the output and controlled by the Heavy blend control. Reverb's exact-model reference summarizes the design as replacing the RAT stage of the original Melvins-associated rig with DOD's FX69 Grunge circuit while retaining the Blue Box-style octave function. [2]

Community schematic analysis provides additional circuit detail: the octave divider uses a **CMOS flip-flop** to generate the two-octaves-down component. A DIY discussion identifies a **CD4013** device in the divider path and notes that its output level can greatly exceed the distorted signal, which helps explain the abrupt character of the Heavy control. These are traced/hardware-community observations, not a complete first-party DOD schematic. [5][6]

This architecture is important to the archive because it distinguishes the FX33 from a simple series connection of a conventional distortion and octave pedal. The documented FX33 design combines the two functions inside one enclosure and provides a dedicated blend control.

## Controls and operating behavior
DOD's manual gives the following functional description:
- **Thrust** sets the overall level. The intended starting point is to compare the engaged and bypassed levels and adjust until they are reasonably close.
- **Buzz** sets the amount of distortion.
- **Saw** adjusts the high-frequency component of the sound.
- **Heavy** governs the octave/distortion balance. [1]

The manual positions the effect as deliberately extreme rather than as a transparent or conventional overdrive. Its core attraction is the combination of heavy distortion and an unstable lower-octave component. [1][5]

Community tracing also helps explain why the Heavy control can become abrupt at higher settings: the divided waveform can occupy a much larger voltage swing than the distorted guitar path, so it can dominate the mix rather than behave like a polite 50/50 blend. This is an observed circuit behavior from traced hardware, not a DOD specification. [5]

## Manufacturing and physical evidence
The surviving manual is a **1994 DOD Electronics Corporation** document and lists DOD's Sandy, Utah address. Reverb's exact-model catalog identifies the FX33 as a yellow-finish DOD pedal and dates examples to 1994–1996. [1][2]

The reviewed evidence is not sufficient to establish a complete factory manufacturing geography timeline or a definitive USA-versus-export production sequence for every unit. The archive therefore avoids turning seller/listing metadata into a universal manufacturing claim.

## Related models
### DOD FX69 Grunge
The FX69 is a documented DOD dirt circuit related to the FX33's distortion section according to secondary circuit references. It remains a separate catalog identity in the archive. [2][5]

### MXR Blue Box
The FX33's octave function is widely described as based on or derived from the classic two-octave-down Blue Box concept. The FX33 should not be labeled as an MXR clone without qualification because the complete DOD implementation includes the separate Grunge-derived distortion path and its own control arrangement. [2][5]

## Specifications
- **Model:** FX33 Buzz Box
- **Catalog type:** Distortion / Fuzz
- **Controls:** Heavy, Buzz, Saw, Thrust
- **Octave function:** Two octaves down
- **Signal concept:** Distortion plus lower-octave divider with blend
- **Bypass:** Active/electronic switching documented in DOD-era materials
- **Power:** 9V battery and AC-adapter operation documented by the manual
- **Chassis:** DOD FX-series enclosure
- **Manual date:** 1994
- **Reported production era:** approximately 1994–1996
- **Circuit relationship:** FX69 Grunge-derived distortion path plus Blue Box-style octave-divider section, per secondary hardware research [1][2][5]

## Versions and revisions
The reviewed evidence establishes the FX33 as a single model identity but does not establish a complete numbered factory-revision sequence. Surviving units may contain board or component differences, so the archive does not invent revision labels where the evidence is incomplete.

## Photo
- **Archive photo:** No verified local photo is currently archived for the FX33.
- Exact-model external photographs exist in collector/market listings, but those are not treated as archive-local images until separately admitted by the photo workflow.

## Research evidence
**Sources checked:**
1. https://manualzz.com/doc/61936112/dod-buzz-box-fx-33-instruction-manual — reproduction of the 1994 DOD FX33 manual, model identity, controls, octavizer description, and operating instructions.
2. https://reverb.com/p/dod-fx33-buzz-box — exact-model product reference, control naming, yellow finish, and 1994–1996 date range.
3. https://onethousandpedals.com/pedal/dod-fx33-buzz-box — exact-model circuit/category reference, including the distortion + sub-octave architecture.
4. https://digitech.com/history/ — first-party DOD history describing the 1990s Lamb Series and listing the Buzz Box among the vintage DOD designs shown.
5. https://www.freestompboxes.org/viewtopic.php?sid=28959f44a560be83df67f7ccda4a3425&t=459 — exact-model circuit discussion and traced/hardware observations.
6. https://www.diystompboxes.com/smfforum/index.php?topic=44733.0 — community technical discussion of the Buzz Box octave/divider behavior and its relationship to other octave effects.

**Research confidence:** High for model identity, controls, manual date, two-octaves-down concept, and DOD's Melvins-related product context; moderate for exact internal topology, component selection, and complete production chronology because those points rely on secondary hardware tracing and surviving-example evidence.
