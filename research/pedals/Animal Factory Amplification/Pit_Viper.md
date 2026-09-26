# Animal Factory Amplification — Pit Viper

## PRP identity
- **Archive parent:** Pit Viper
- **Builder:** Animal Factory Amplification
- **Catalog type:** Overdrive / Distortion
- **Introduction:** 2015
- **Identity:** Animal Factory's guitar overdrive/distortion pedal with a 2015 original format and a builder-designated 2019 revision marketed in the current archive as Pit Viper v2.
- **Separate family:** The Eurorack Pit Viper modules are related implementations, not pedal revisions.

## What this pedal is
Pit Viper is an aggressive, dynamic overdrive/distortion whose original design grew out of the FLAIL side of the earlier Ozymandias concept. The pedal combines a conventional gain/tone/volume interface with switchable hard and soft clipping networks and a mode control that changes the gain range and feel. It can move from gritty boost-like sounds toward more saturated, amp-like distortion. [1][2][3]

## Colorways
- **2015:** earlier black enclosure/graphic treatment with the original reptilian artwork.
- **2019 revision / v2:** laser-etched black finish with a redesigned graphic by Aniruddh Mehta.
- Finish changes were accompanied by functional control changes, so the 2019 release is documented as a version rather than merely a colorway. [1]

## Versions
### Pit Viper — 2015
- Original external control labeling and switching.
- Three-way clipping controls were used to access different clipping/compression textures.
- Original pedal artwork and enclosure treatment. [1][3]

### Pit Viper — 2019 revision / v2
The manufacturer describes this revision as a redesign with more functional control labels and a black laser-etched finish. The underlying design retains the core Pit Viper distortion concept while improving usability and clipping flexibility. [1]
- Main controls: **Gain, Tone, Volume**.
- **HARD** and **SOFT** three-position clipping switches.
- **MODE** switch alters the minimum gain and sweep character of the gain control.
- The clipping switches can be combined with the main controls to shape distortion and compression textures. [1][2]

### Pit Viper v3
Animal Factory announced **Pit Viper v3** at Superbooth 2023 as part of the new pedal generation.
- The v3 concept replaces the earlier clipping switches with **clipping knobs** for more continuous adjustment.
- It also adds a **bass and treble boost/cut tone control** and a new form factor.
- The 2023 announcement presented these as prototype/new-generation features rather than a finalized 2019-style revision. [4]

## Version changes
- **2015 → 2019:** functional label redesign, new laser-etched black enclosure/graphics, and revised interface while preserving the Pit Viper core. [1]
- **2019 → announced v3:** new-generation enclosure and expanded control philosophy, with continuous clipping controls replacing switches and expanded bass/treble tone control. [4]
- The Eurorack Pit Viper v2 module is a separate product that uses the classic Pit Viper distortion circuit but adds a state-variable filter and CV functionality. It should not be used as evidence for the pedal's exact electrical design. [5]

## Circuit / architecture
The pedal uses a solid-state high-voltage architecture. The technical manual describes a **rail-to-rail op-amp** designed for high voltage swing from a 9V supply. It also documents:
- input **PREGAIN**
- input **CUTOFF** high-pass filtering
- main **GAIN**
- **TONE**
- **VOLUME**
- separate **SOFT CLIPPING** and **HARD CLIPPING** three-way controls
- **MODE** switch for gain-range behavior. [2]

## Clipping
- **Soft clipping:** one position produces an audibly asymmetric loud clipping response; another disables the soft clipping stage; the third uses a more complex **zener clipping** texture with greater high-frequency distortion and less-saturated low end. [2]
- **Hard clipping:** one position produces more chug/grind; another disables the hard stage; the third produces more high-frequency compression with a softer attack. [2]
- Exact diode material and part numbers were not established. The manual's zener reference supports recording **zener clipping** as a documented clipping technology without assigning a semiconductor material the source does not state.

## Transistor / integrated technology
- **Integrated circuit:** rail-to-rail op-amp architecture.
- **Discrete transistor technology:** not established.
- The archive should not classify Pit Viper as germanium or silicon transistor technology based on its clipping stages.

## Power / electrical specifications
The reviewed technical manual specifies:
- **Supply:** 9–12V DC, negative-center 2.1mm jack.
- **Current:** approximately **30mA**.
- **Input impedance:** approximately **1MΩ**.
- **Output impedance:** approximately **1kΩ**.
- The manual warns that **15V is the safe maximum** and that an 18V supply can permanently damage the pedal. [2]
- No battery provision is documented. [2]

## Controls and behavior
- **GAIN:** increases distortion.
- **TONE:** reduces treble as turned counter-clockwise, with corresponding level interaction documented by the manual.
- **VOLUME:** output level.
- **SOFT CLIPPING:** selectable asymmetrical, off, or zener-oriented clipping texture.
- **HARD CLIPPING:** selectable high-gain/chug or compressed clipping behaviors, plus off.
- **MODE:** changes the minimum gain and the sweep character of the Gain control; the center position provides a greater clean range. [2]

## Sound
Animal Factory characterizes Pit Viper as articulate, clear, brash, and midrange-rich, with an amp-like drive character. The pedal's filtering and clipping switches allow the same core circuit to move between gritty boost territory, tighter distortion, and more compressed or harsh clipping textures. [3] The manufacturer later described v3 as retaining the expressive, dynamic distortion and tonal punch of the design while expanding the control range. [4]

## Deep research verification
Verified against the manufacturer's archived pedal page, the technical user manual, the manufacturer's Superbooth 2023 v3 announcement, and independent Pit Viper v2 coverage. The evidence supports the 2015/2019 version history, 2019 laser-etched redesign, hard/soft clipping architecture, mode control, rail-to-rail op-amp/high-voltage design, 9–12V electrical specifications, 15V maximum warning, and announced v3 control expansion. The Eurorack Pit Viper is explicitly separated from the guitar pedal record. [1][2][4][5]

## Research confidence
- **Identity:** High
- **Version history:** High
- **Controls:** High
- **Clipping architecture:** High
- **Power / electrical specifications:** High
- **Integrated op-amp architecture:** High
- **Discrete transistor technology:** Unknown
- **Exact diode:** Unknown

## Photo
- **Exact pedal photograph:** Existing local photo/provenance remains owned by the independent photo-recovery lane.
- **Status:** Photo recovery pending local archival verification.

## Sources checked
1. Animal Factory Amplification — Pit Viper v2 Pedal: https://animalfactoryamps.com/en-au/products/animal-five-pit-viper
2. Animal Factory Amplification Pit Viper User Manual: https://manuals.plus/m/311fab3a8020022ff5bb9cd1cc2b73679430335ff392149e5d74553e7c3ad5a7
3. Waveform Magazine — Pit Viper 2: https://waveformmagazine.com/waveform-reviews/pit-viper-2-animal-factory-amplification/
4. Animal Factory Amplification — Superbooth 2023 News: https://animalfactoryamps.com/blogs/news/superbooth-2023-news-animal-factory-reveals-new-pedal-and-synth-prototypes
5. Animal Factory Amplification — Eurorack Pit Viper v2: https://animalfactoryamps.com/products/racketier-2-pit-viper-module
