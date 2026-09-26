# Animal Factory Amplification — Ozymandias

## PRP identity
- **Archive parent:** Ozymandias
- **Builder:** Animal Factory Amplification
- **Catalog types:** Distortion / Overdrive
- **Current production:** 2026 production generation.
- **Identity:** Dual overdrive/distortion pedal with two independent channels, **CROOK** and **FLAIL**, offering separate gain/EQ voices plus series, parallel, and split-output routing.

## What this pedal is
Ozymandias is a stacked dual-overdrive/distortion platform. The **CROOK** channel is the fuller, thicker and more low-end-heavy voice, while **FLAIL** is more mid-focused, driven and compressed. Each channel has its own gain, tone, volume and clipping/range controls. The channels can operate independently, in series, or in parallel, allowing separate amplifiers or instruments to be used. [1][2]

## Colorways
- Current production uses Animal Factory's black geometric enclosure.
- No separate cosmetic colorway is established as a distinct version.

## Versions and factory development
### Current production Ozymandias
The current pedal provides:
- two independent channels: CROOK and FLAIL;
- **GAIN, TONE, VOLUME** per channel;
- three-way **GRIND** and **GRIT** clipping controls;
- **FULL / MID** range/voicing switches;
- independent input/output jacks for both channels;
- series or parallel routing;
- buffered input/output stages;
- internal **22V** operation for high headroom;
- MIDI control and USB-C connectivity for the digital control layer. [1][2]

### Historical development
Animal Factory's manual documents a long development history: the original Ozymandias concept was shelved, and the FLAIL circuit was later simplified into the Pit Viper. The current Ozymandias returned as a full two-channel production pedal in the 2024-era design cycle. The manual's version 1.0 identifier is treated as a document revision, not an “Ozymandias V1” hardware designation. [2]

## Factory modifications / firmware
- No separate numbered hardware revision after the current production launch was established.
- January 2026 firmware documentation identifies **Ozymandias** as one of the pedals with a field-updatable digital control layer. [3]
- Firmware features include a **High Gain Mode** that changes the footswitch behavior and a **Parallel Sum Mode** that forces the channels into parallel operation and sums them to one output. [3]
- These firmware behaviors are recorded as control/software features, not as new hardware versions.

## Version changes
The major documented transition is from an earlier shelved development concept to the current two-channel production pedal. Within current production, firmware has expanded the operating modes without establishing a new numbered hardware revision. [2][3]

## Circuit / channel architecture
- **CROOK:** fuller, fat, articulate, amp-like voice with substantial low end.
- **FLAIL:** more midrange-focused, higher-drive and more compressed voice.
- Each channel has independent GAIN, TONE and VOLUME controls.
- **GRIND / GRIT** clipping/range controls provide multiple hard/soft clipping options.
- **FULL / MID** controls shape how much of the circuit's range is emphasized.
- Independent jacks allow the two sides to be routed separately.
- The center control selects **series** or **parallel** signal routing. [1][2]

## Transistor
- **Technology:** Unknown.
- No exact discrete transistor family or part number has been established in the reviewed manufacturer documentation.

## Diode / clipping
- **Technology:** selectable clipping modes including hard/soft or asymmetrical LED-style limiting depending on control position.
- The manufacturer does not publish a specific clipping diode part number in the reviewed product documentation. [1][2]
- The archive therefore records clipping behavior without inventing an exact component inventory.

## Power / electrical specifications
Current manufacturer documentation lists:
- **Supply:** **9–12V DC**
- **Recommended/current capacity:** **500mA**
- **Internal operating voltage:** approximately **22V**
- High internal voltage is used to provide increased headroom from a low-voltage pedal supply. [1]
- January 2026 firmware documentation identifies the current digital control hardware and update path but does not redefine the analog power architecture. [3]

## Digital control layer
The current Ozymandias includes a microcontroller-controlled feature layer:
- firmware is field-updatable via USB-C/UPDI-related service hardware;
- the January 2026 firmware notes list an **ATtiny1616** as the Ozymandias control MCU;
- High Gain Mode changes switch behavior;
- Parallel Sum Mode forces parallel routing and sums both channels to a single output, with channel-status LED colors reflecting the active channels. [3]

The MCU is part of the digital control system and should not be interpreted as the analog distortion engine.

## Sound
CROOK is intended to provide a large, full and articulate low-end-heavy overdrive/distortion voice, while FLAIL is more forward in the mids and more compressed. Series operation creates a stacked two-stage gain chain; parallel operation separates the voices for independent amplification or summing. The pedal is designed to remain responsive to pick dynamics even with substantial gain because of its high internal operating voltage. [1][2]

## Deep research verification
Verified against the current manufacturer Ozymandias product page, manufacturer manual documentation, the manufacturer firmware/update documentation, and independent product specification references. The evidence supports the two-channel architecture, CROOK/FLAIL voicing, control set, series/parallel routing, 22V internal operation, 9–12V/500mA supply specification, firmware-controlled operating modes, and the separation of the digital MCU from the analog distortion circuitry. Exact analog transistor and clipping-diode part numbers remain unpublished. [1][2][3][4]

## Research confidence
- **Identity/current generation:** High
- **Channel architecture:** High
- **Controls:** High
- **Routing:** High
- **Power/headroom:** High
- **Digital control layer:** High
- **Clipping technology:** Moderate/High
- **Exact analog transistor:** Unknown
- **Exact clipping diode:** Unknown

## Photo
- **Exact pedal photograph:** Existing local photo provenance remains owned by the independent photo-recovery lane.
- **Status:** Photo recovery pending local archival verification.

## Sources checked
1. Animal Factory Amplification — Ozymandias: https://animalfactoryamps.com/products/ozymandias-dual-overdrive-distortion-pedal
2. Animal Factory Amplification — Ozymandias manual v1.0: https://www.manualslib.com/manual/3641320/Animal-Factory-Amplification-Ozymandias.html
3. Animal Factory Amplification — Updating firmware on Godeater+, Ozymandias and Dirty Mirror: https://animalfactoryamps.com/blogs/news/updating-the-firmware-on-animal-factory-godeater-ozymandias-and-dirty-mirror-pedals
4. Hookup Japan — Ozymandias specifications: https://hookup.co.jp/products/animal-factory-amplification/ozymandias/spec
