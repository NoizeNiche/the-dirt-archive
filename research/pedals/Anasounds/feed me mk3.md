# Anasounds — feed me mk3

## PRP identity
- **Archive parent:** feed me mk3
- **Builder:** Anasounds
- **Catalog type:** Fuzz
- **Identity:** Third-generation Anasounds fuzz based on the classic 1960s two-transistor Fuzz Face family and the Roger Mayer-modified circuit that inspired the earlier Feed Me versions.

## What this pedal is
The Feed Me began as one of Anasounds' first pedals and first fuzzes. Anasounds describes the lineage as a revised version of the classic circular fuzz circuit associated with Roger Mayer's work, implemented in the Feed Me with **BC108 silicon transistors**. The MK3 moves the design into the FX Teacher range and adds extensive external and internal customization while retaining the guitar-volume-sensitive behavior of the earlier Feed Me. [1][2][3]

## Colorways
- No complete production colorway chronology was established in the verified material.
- The MK3 is associated with the Anasounds FX Teacher design language; exact finish history should be treated separately from the circuit identity.

## Versions and factory options
### Feed Me MK1
- External **Feed, Fuzz, Out** controls.
- The Feed control adjusts input level and therefore the interaction between guitar output impedance and the fuzz circuit. [1][3]

### Feed Me MK2
- External controls were removed for a plug-and-play approach.
- Internal **Feed, Fuzz, Out, Bias, and Treble** trimpots remained for adjustment by the builder. [1]

### Feed Me MK3
- External **Feed** and **Out** controls.
- **Bass** switch selects between the original low-frequency response and a custom bass-cut path using interchangeable capacitors.
- **Crack** switch activates the underpowered/gated-fuzz circuit.
- **Smash** control varies the degree of supply-voltage reduction when Crack is active. [2][3]
- The Feed control can push the circuit into **self-oscillation** at extreme settings. [3]
- The pedal is available as a DIY kit or assembled unit under the FX Teacher system. [1]

## Version changes
The documented lineage is a progression rather than a cosmetic revision:
- **MK1:** three external controls for input, fuzz, and output.
- **MK2:** controls removed externally, with internal trimpots retained.
- **MK3:** returns external control while adding bass shaping and supply-voltage control for gated/Velcro textures. [1][3]
- The MK3 article dates to 2022 and the current builder page continues to present it as the customizable FX Teacher version. [1][3]

## Transistor
- **Technology:** Silicon.
- **Exact transistor/device:** **BC108**.
- Anasounds explicitly identifies the Feed Me lineage as using BC108 silicon transistors. [3]

## Diode
- **Technology:** Silicon.
- **Documented device:** **1N4001**, used as **D1 reverse-polarity protection** in the power-supply section of the MK3 kit documentation. [2]
- This diode is not the fuzz clipping element. The source material does not specify a single fixed clipping-diode type for the fuzz path, so the archive should not conflate D1 with clipping.

## Power and voltage behavior
- The MK3 accepts a standard **9V supply**.
- The Crack circuit deliberately reduces the fuzz-circuit supply voltage for gated/Velcro behavior; Anasounds documents a range down to roughly **3.8V** with the Smash control at maximum in the assembly documentation. [2][3]
- The supply section includes a reverse-polarity protection diode and filtering before the fuzz circuit. [2]
- Because the Feed Me is highly responsive to the guitar's output impedance, Anasounds recommends placing it directly after the guitar and avoiding a buffer or wireless system before it for the most pronounced cleanup behavior. [3]

## Controls and documented behaviors
- **Feed:** adjusts input level and the amount of saturation/cleanup interaction with the guitar volume.
- **Out:** output volume / amplifier push.
- **Bass:** switches between the original fat low-frequency response and a custom bass-cut path.
- **Crack:** activates the underpowered gated-fuzz mode.
- **Smash:** controls how far the supply voltage is reduced with Crack engaged. [3]
- At maximum Feed, the circuit can enter **self-oscillation**, producing feedback-like behavior controllable from the guitar volume. [3]

## Capacitor options
The MK3 bass network uses interchangeable capacitors in a terminal block. The builder documents **4.7nF, 6.8nF, 10nF, and 22nF** choices in the bass-cut path, while the original **220nF** path preserves the fuller low-frequency response. [2][3]

## Circuit behavior
- The input stage uses Feed to vary the level presented to the gain stages.
- The first two gain stages use **Q1 and Q2 BC108** transistors; the builder's technical article describes asymmetric clipping from the circuit bias arrangement as a key part of the fuzz character. [2]
- The Crack circuit lowers supply voltage and changes transistor operating conditions, producing highly asymmetric clipping and a gated/Velcro response when the signal is too small to pass normally. [2]
- With Feed lower, the pedal remains more dynamic and responds strongly to playing attack; increased Feed produces earlier saturation and greater compression. [2]

## Sound
The MK3 covers the original-style open fuzz sound, a thicker/fatter modern fuzz, and gated/Velcro textures. The builder describes it as responsive to guitar volume and tone, with Feed enabling more refined cleanup. The Bass control changes the low-frequency bandwidth, while Crack/Smash produces the underpowered gated character. [1][3]

## Deep research verification
Verified against Anasounds' current Feed Me MK3 product page, the detailed build/technical article, the user manual, and an independent Effects Database record. The evidence supports the Feed Me generation history, BC108 silicon transistor type, MK3 control set, 1N4001 reverse-polarity protection diode, bass capacitor values, supply-voltage reduction behavior, self-oscillation, guitar-volume interaction, and direct-after-guitar placement guidance. [1][2][3][4]

## Research confidence
- **Identity:** High
- **Version history:** High
- **Transistor technology / exact device:** High
- **Power behavior:** High
- **Controls / features:** High
- **Protection diode:** High
- **Fuzz clipping diode:** Unknown

## Photo
- **Exact pedal photograph:** Local photo recovery remains separate from research depth.
- **Status:** Photo recovery pending local archival verification.

## Sources checked
1. Anasounds — Feed Me MK3: https://anasounds.com/feed-me-fx-teacher/
2. Anasounds — Assemble your Feed Me fuzz: https://anasounds.com/assemble-your-feed-me-fuzz/
3. Anasounds — Feed Me MK3 FX Teacher user manual: https://anasounds.com/feed-me-fx-teacher-user-manual/
4. Effects Database — AnaSounds Feed Me Mk3: https://www.effectsdatabase.com/model/anasounds/feedme/mk3
