# Animal Factory Amplification — Godeater

## PRP identity
- **Archive parent:** Godeater
- **Builder:** Animal Factory Amplification
- **Catalog type:** Distortion / Fuzz
- **Introduction:** 2010s
- **Identity:** Bass-oriented high-gain distortion/fuzz platform built around preserving substantial low-frequency content while producing heavy saturation.
- **Separate products:** The later Godeater v3 and Godeater+ are subsequent Godeater-family products; the Eurorack Godeater module is a separate modular implementation and is not used to infer the pedal's components. [1][2][4]

## What this pedal is
Godeater was designed around extremely heavy bass distortion and low-frequency compression. The original pedal combines a pre-gain/input stage, input filtering, a multi-stage clipping section, dedicated low-end shaping, tone control, and a wet/dry output blend. The builder has repeatedly described the core circuit as especially suited to bass and extended-range instruments. [1][2][3]

## Versions
### Original Godeater
The original production design established the six-/seven-control architecture and the characteristic low-end-heavy distortion behavior:
- **Demeter:** input level / pre-gain.
- **Hera:** high-pass input filtering.
- **Poseidon:** distortion/gain amount.
- Two clipping switches.
- **Hades:** low-frequency emphasis.
- **Hestia:** tone.
- **Zeus:** output level and, with Disgorge engaged, wet/dry blend. [1][3]

The two clipping switches are three-way controls that select between symmetrical diode clipping, asymmetrical LED clipping, or disabling the clipping stage. [3]

### Godeater 2020 Edition
Animal Factory's 2020 revision retained the core bass distortion/low-end compression circuit while changing the surrounding architecture:
- clipping switches became continuous **clipping knobs** for sweeping between distortion textures;
- a dedicated clean output was added;
- that output could be upgraded to a floating balanced 1/4-inch TRS output;
- switching changed to relay-based soft switching;
- an additional output stage improved level consistency in dry/wet operation. [2]

### Godeater v3
Animal Factory announced **Godeater v3** at Superbooth 2023. The new form factor retained the Godeater feature set while adding a **balanced output** and replacing the earlier blend control with a **new output mixer stage**. The announcement presented this as an updated pedal-generation product rather than a minor cosmetic revision. [4]

### Godeater+
Godeater+ is a materially expanded later-generation pedal and should be treated as a separate catalog entry where present. Current Animal Factory documentation describes firmware-controlled functions and identifies the pedal as **P6-GE3**, using an **ATtiny3217** microcontroller for its digital control layer. The current pedal is not used as evidence for the discrete analog component technology of the original Godeater. [5]

## Factory options
- The 2020 Edition's floating balanced-output upgrade was a builder-authorized hardware option.
- Godeater+ later introduced a different electronic control architecture and firmware update system; it should not be treated as an option or revision of the original analog Godeater record. [2][5]

## Version changes
The core analog identity remained consistent through the 2020 revision, while the output, switching, and clipping interfaces evolved. The 2023 v3 announcement represents another generational packaging/output change, including balanced output and an output mixer in place of the earlier blend arrangement. [2][4]

## Circuit / signal path
- Input stage with adjustable **Demeter** pre-gain.
- **Hera** input high-pass filtering can reduce sub-bass entering the distortion circuit.
- **Poseidon** controls the gain/saturation stages and therefore the amount of compression and distortion.
- Two clipping stages provide selectable diode/LED behavior on the original architecture.
- **Hades** adds substantial low-frequency emphasis.
- **Hestia** is the main tone control.
- **Zeus** controls the final output and can participate in wet/dry blending with Disgorge enabled. [3]

## Transistor
- **Technology:** Unknown.
- No exact production transistor family or part number for the original Godeater was established in the reviewed first-party and independent sources.
- The Eurorack Godeater and later Godeater+ control electronics are explicitly excluded from this classification.

## Diode / clipping
- **Technology:** Silicon diode / LED selectable clipping.
- The original control architecture uses two three-position clipping controls, selecting **symmetrical diode**, **asymmetrical LED**, or bypassed clipping stages. [3]
- The exact diode part number is not established.
- The 2020 Edition replaced the switches with continuous clipping knobs, preserving the ability to move between different clipping textures. [2]

## Power / output
- A reliable original-pedal power specification was not established in the reviewed sources.
- The 2020 Edition introduced a dedicated low-impedance clean output and an optional floating balanced 1/4-inch TRS upgrade. [2]
- The v3 announcement documents balanced output and a new output mixer stage. [4]

## Low-frequency behavior
The Godeater's defining behavior is substantial low-end saturation without requiring a conventional clean blend solely to preserve the fundamental. The input high-pass control can reduce sub-bass, while the low-end stage and wet/dry architecture allow the pedal to remain powerful on bass-heavy material. [1][3]

## Sound
The original Godeater is documented as a heavy bass distortion/fuzz with strong low-end compression and a wide range from dense distortion into fuzzy, aggressive textures. Independent technical references emphasize the interplay among the input filter, gain, clipping stages, low-end control, tone, and blend. [3]

## Deep research verification
Verified against Animal Factory's original pedal documentation, the 2020 Edition announcement, the Superbooth 2023 v3 announcement, and independent exact-model control documentation. The evidence supports the original named control architecture, selectable diode/LED clipping, low-frequency signal shaping, wet/dry blend behavior, 2020 output/switching/clipping revisions, and v3 balanced-output/mixer changes. The current Godeater+ firmware documentation was used only to separate the later digital generation from the original analog record. [1][2][4][5]

## Research confidence
- **Identity:** High
- **Bass-distortion architecture:** High
- **Controls:** High
- **Clipping technology:** High
- **2020 revision:** High
- **v3 lineage:** High
- **Original transistor technology:** Unknown
- **Exact diode:** Unknown
- **Original power specification:** Unknown

## Photo
- **Exact pedal photograph:** Existing Reverb/local photo provenance remains owned by the independent photo-recovery lane.
- **Status:** Photo recovery pending local archival verification.

## Sources checked
1. SchneidersLaden — Animal Factory Amplification Godeater Pedal: https://schneidersladen.de/en/animal-factory-amplification-godeater-pedal
2. Animal Factory Amplification — Godeater 2020 edition open for orders: https://animalfactoryamps.com/blogs/news/godeater-2020-edition-open-for-orders
3. Animal Factory Amplification Godeater control documentation referenced by the independent product listing.
4. Animal Factory Amplification — Superbooth 2023 News: https://animalfactoryamps.com/blogs/news/superbooth-2023-news-animal-factory-reveals-new-pedal-and-synth-prototypes
5. Animal Factory Amplification — Updating the firmware on Godeater+: https://animalfactoryamps.com/blogs/news/updating-the-firmware-on-animal-factory-godeater-ozymandias-and-dirty-mirror-pedals
