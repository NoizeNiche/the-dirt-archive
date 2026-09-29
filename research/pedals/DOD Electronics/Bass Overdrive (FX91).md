# DOD Electronics — Bass Overdrive (FX91)

## PRP identity

- **Builder:** DOD Electronics
- **Catalog type:** Overdrive
- **Identity:** DOD **FX91 Bass Overdrive**.
- **Archive naming:** The canonical catalog uses **Bass Overdrive (FX91)** to keep the model number explicit.

## What this pedal is

The **DOD FX91 Bass Overdrive** is an analog bass-focused overdrive/distortion pedal introduced at **Winter NAMM 1998**. DOD's manual describes it as a distortion box designed specifically for bass that lets the player blend the processed signal with the original clean bass signal. Effects Database lists the same four-control layout and identifies the model as an overdrive.

The design is closely related to the contemporary **FX102 Mystic Blues Overdrive**. Collector research and circuit documentation identify the FX91 as sharing the same basic circuit family, modified for bass voicing and the low-end requirements of the instrument.

## Controls

The documented control set is:
- **Level:** overall output level.
- **Blend:** mixes the clean bass signal with the driven signal.
- **Tone:** post-distortion high-frequency EQ.
- **Drive:** controls gain in the distortion stage.

The Blend control is the important functional feature of the design. It allows the distorted signal to be mixed back with the unaffected bass signal so the player can add grind while retaining the instrument's fundamental low-end presence.

## Circuit / hardware evidence

AmericasPedals identifies **two 4560-type op-amps** in the FX91 and notes an example component-side circuit-board photograph from **April 2000, revision B**. The same source identifies the FX91 as sharing its basic circuit with the FX102 Mystic Blues Overdrive.

A 2014 circuit-analysis write-up describes the signal path as an input buffer feeding a conventional clipping amplifier, followed by the Blend mixer, then a tone stage, recovery amplifier, and volume control. It also notes that the published schematic omits the switching section.

That same 2014 analysis reports a documented production error found in some units: the schematic calls for **R3 = 1K**, while some examples were observed with a **200R** resistor in that position. The author reports that this change increases gain from the clipping stage and shifts the frequency response. The archive records this as a reported production-variation observation, not as a universal FX91 specification.

## Power / switching

The original DOD manual identifies the FX91 product as a **9V** pedal and documents both battery and adapter operation.

The historical switching implementation is not treated as modern true bypass without stronger model-specific evidence. One specialist source describes the FX91 as true bypass, while the internal circuit histories and surviving DOD switching conventions do not provide enough evidence for the archive to elevate that claim above the model-specific documentation. The safe record is therefore:
- **Power:** 9V battery / external adapter.
- **Bypass:** historical implementation not firmly resolved from the strongest exact-model documentation reviewed.

## Sound

DOD designed the FX91 to retain bass punch while adding overdrive or more aggressive distortion. Its manual specifically emphasizes preserving low-end power while blending in the driven signal.

User-review evidence on Audiofanzine consistently highlights the usefulness of the Blend control and describes the pedal as capable of musical overdrive ranging from relatively light crunch to more fuzz-like drive. A 2014 circuit review characterizes the pedal as fat and usable on bass while also noting that the blend stage can make it interesting on guitar.

These tonal descriptions are retained as review observations rather than objective frequency-response claims.

## Historical / production context

AmericasPedals dates the FX91's introduction to **Winter NAMM 1998** and identifies it as a successor within DOD's bass-drive lineup after the FX92 Bass Grunge. The same source says the FX91 was retained as production later moved to China with the VFX-era DOD products.

DOD's current official manuals archive still lists the **FX91 Bass Overdrive** among its DOD FX-series documentation, confirming that the model remains in the manufacturer's historical documentation library.

A Reverb archive listing documents a **2000 gold FX91** example, while other surviving examples show later production variants. The archive does not split those finish/production observations into separate pedal identities unless a model-specific functional difference is established.

## Colorways / versions

- **Gold:** documented on a 2000 Reverb example.
- **Later China/VFX-era production:** documented by collector research as a continuation of the FX91 in later DOD production.
- **Revision B board evidence:** an April 2000 component-side board photograph is documented by AmericasPedals.
- No complete official colorway or revision chronology was established in the reviewed sources.

## Transistor

- **Exact production transistor:** Not established.
- The strongest technical evidence reviewed points instead to an op-amp based design with two 4560-type devices.

## Op-amps

- **Documented:** two **4560-type** op-amps, based on AmericasPedals' model-specific technical notes.
- Exact manufacturer/part-number provenance for those devices was not independently established from the original DOD manual.

## Diode

- **Exact clipping/rectifier diode:** Not established in the reviewed model-specific sources.

## Research confidence

- **Identity:** High.
- **1998 Winter NAMM introduction:** High, based on DOD collector/history research.
- **Control layout:** High, independently listed by Effects Database and the DOD manual.
- **Bass-focused clean Blend architecture:** High, based on the DOD manual and multiple independent sources.
- **Two 4560-type op-amps:** Moderate to high, based on model-specific collector technical documentation.
- **FX102 circuit relationship:** Moderate to high, based on collector/circuit documentation.
- **R3 1K vs 200R production variation:** Moderate, based on a specialist circuit-analysis report of surviving units.
- **Exact transistor/diode part numbers:** Unknown.
- **Exact historical bypass circuit:** Unresolved.

## Sources checked

1. DigiTech/DOD — Product Manuals archive: https://digitech.com/product-manuals
2. DOD FX91 Bass Overdrive — Effects Database: https://www.effectsdatabase.com/model/dod/fx/fx91
3. AmericasPedals — DOD FX91 Bass Overdrive history and technical notes: https://www.americaspedals.net/fx91.html
4. DOD FX91 Bass Overdrive manual mirror: https://manuals.plus/dod/fx91-bass-overdrive-manual
5. DOD FX91 Bass Overdrive manual mirror: https://manualzz.com/doc/13134946/dod-fx91-bass-overdrive-user-manual
6. Effects Layouts — DOD FX91 Bass Overdrive schematic/layout discussion, September 3, 2019: https://effectslayouts.blogspot.com/2019/09/dod-fx91-bass-overdrive.html
7. mirosol / killall -9 humans — DOD FX91 Bass Overdrive circuit and production notes, July 9, 2014: https://mirosol.kapsi.fi/2014/07/
8. Audiofanzine — DOD FX91 Bass Overdrive: https://en.audiofanzine.com/bass-distortion-overdrive/dod/FX91-Bass-Overdrive/
9. Reverb — DOD FX91 Bass Overdrive 2000 Gold: https://reverb.com/item/2174930-dod-fx91-bass-overdrive-2000-gold

## Deep research verification

This pass upgrades the record from a surface stub to a model-specific researched entry. The DOD manual and Effects Database establish the exact FX91 identity and four-control layout. AmericasPedals adds historical context and model-specific technical notes, including the two 4560-type op-amps and an April 2000 revision-B board example. Independent circuit analysis documents the signal path and a reported resistor-value variation found in some surviving units.

The archive deliberately does not turn secondary circuit observations into universal production specifications, and it leaves the exact transistor, diode, and historical bypass implementation unresolved where the evidence is insufficient.

## Photo

- **Archive status:** An exact local photo is already associated with the canonical FX91 Bass Overdrive record.
- This research pass does not replace the existing image asset or alter the separate photo provenance gate.
