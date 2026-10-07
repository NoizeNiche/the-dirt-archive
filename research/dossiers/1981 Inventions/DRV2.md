# 1981 Inventions — DRV2

## Research status

- Research phase: Deep archival dossier
- Builder: 1981 Inventions
- Pedal: DRV2
- Canonical catalog identity: 1981 Inventions + DRV2
- Existing baseline research: ./research/pedals/1981 Inventions/DRV2.md
- Research date: 2026-10-06
- Identity classification: **MODEL / VERSION**
- Parent relationship: Second-generation version of the DRV platform, distinct from original DRV / V1 and MOD 1 / MOD 2 configurations.

## 1. Exact identity

**DRV2 is a real second-generation circuit identity, not a colorway of the original DRV.** Matthew Hoopes explicitly described it in July 2024 as “V2 of the DRV,” called it the future direction of the DRV, and said he had worked on the V2 circuit for more than a year. He also explicitly said he was not trying to exactly copy the original circuit and had made changes. [1]

The current manufacturer page calls DRV2 “the new standard enclosure and circuit.” It describes the pedal as the standard V2 direction and distinguishes the redesigned circuit from the original DRV. [2]

This creates the core identity boundary for the archive:

- **DRV:** original production platform / V1-derived design
- **DRV MOD 1:** original V1 configuration with documented zero-gain behavior and socketed op-amp choices
- **DRV MOD 2:** separate modified configuration using a larger input capacitor and BAT41/LED hybrid clipping
- **DRV2:** second-generation redesigned circuit, with SMT construction and John Snyder/EAE engineering

## 1A. Identity classification gate

- **Classification:** MODEL / VERSION
- **Parent model:** DRV platform
- **Why it is separate:** explicit V2 naming, explicit redesign, SMT PCB, revised power architecture, documented sonic changes, and new standard enclosure/circuit.
- **Evidence checked against sibling records:** original DRV, MOD 1, MOD 2, DRV2 No3, Hyperfade presentations, and later LED/germanium variants.

The important archive lesson is that **the word “DRV” alone is not enough to determine identity**. A 2024 anniversary DRV-branded enclosure, for example, can contain the redesigned DRV2 circuit. Conversely, a DRV2 colorway can be visually different without becoming a new model. Variant names therefore require circuit-level checking.

## 2. Chronology and versions

### Development and early release

Matthew Hoopes' July 7, 2024 post documents the DRV2 as a development project that had been worked on for **more than a year**. At that point he described the release as a very small final test, with a few units sent to friends and a limited opportunity for early adopters. Two early physical presentations were offered: a label-maker-marked version and a traditional white No3-style enclosure with a small “2” beside the DRV knob. [1]

That post is the clearest dated evidence for the transition from the original DRV to the V2 generation. It also establishes that the V2 existed before the later standard No3 production presentation.

### MMHMM 20th Anniversary

The 2024 MMHMM 20th Anniversary DRV used the **all-new / redesigned V2 circuit**, internally called DRV2. The manufacturer's description reproduced by Jack's Guitarcheology says the anniversary edition used a slightly taller, deeper, more squared-off enclosure, and that the V2 circuit had not yet been widely released. It also confirms SMT construction and the John Snyder/EAE redesign. [3]

The anniversary edition is therefore historically important, but its album-art enclosure should not be mistaken for a separate circuit generation.

### Current standard

The current DRV2 No3 is presented by 1981 Inventions as the new standard enclosure and circuit. The builder states that this version remains the V2 design rather than a return to the original V1 circuit. [2]

## 3. Controls and specifications

The standard DRV2 retains the familiar three-control interface:

- **DRV:** gain/drive
- **CUT:** tonal filtering / high-frequency shaping
- **VOL:** output level

Independent dealer documentation describes the DRV2 as a three-knob distortion pedal and notes that the CUT control affects a wider tonal spectrum than before, with beefier lows and crisper highs depending on setting. [4]

### Bypass

1981 Inventions documents an internal switch allowing **true-bypass** operation. The builder itself notes that true bypass is not always preferable, so the choice is deliberately user-selectable. [2]

### Power

DRV2 supports **9V or 18V** external power. The manufacturer describes 18V operation as part of the new V2 architecture, and dealer documentation describes the voltage choice as producing different response/headroom while remaining broadly the same pedal. [2][4]

The standard supply format is Boss-style 9V DC, with isolated power recommended. [2]

### Construction

The V2 board is explicitly **surface-mount (SMT)** rather than the through-hole construction associated with the original V1/MOD 1 family. [1][3]

The renewed standard production is hand assembled in Nashville. [2]

## 4. Circuit and electronics

### Redesign boundary

The manufacturer is unusually clear that DRV2 is **not an exact reproduction of the original DRV circuit**. Hoopes says the team initially considered exact replication but then chose to make changes after working with the design. [1][3]

That means the archive should never describe DRV2 as merely “the same DRV in a new box.” It is a distinct engineering generation in the same product family.

### Engineering

The original DRV was engineered in collaboration with **Jon Ashley of Bondi Effects**. DRV2 was redesigned and engineered by **John Snyder of Electronic Audio Experiments (EAE)**, who also worked on 1981's LVL. [1][2][3]

### Documented electrical changes

The public sources establish these V2 changes:

- SMT PCB construction rather than through-hole. [1][3]
- operation at 9V or 18V. [1][2]
- reduced noise floor / quieter operation. [1][2]
- a modified CUT response. [1]
- increased low-end thump and thicker/deeper palm-mute response. [1]
- a new standard enclosure associated with the V2 circuit. [2]

The public manufacturer descriptions intentionally do **not** publish the complete schematic or component-by-component BOM.

### Semiconductors and clipping

The exact production op-amp, transistor part numbers, and standard V2 clipping-device BOM were not established from the reviewed first-party material.

This matters because later DRV2-family releases explicitly change clipping parts. Current builder/dealer material shows examples using white or pink LEDs and a germanium 1N34A implementation. Those are **functional variants of the DRV2/DRV platform**, not evidence that the standard DRV2 circuit has a single publicly documented diode BOM across every edition. [5][6]

### Variant-specific functional changes

The archive should distinguish at least these documented cases:

- **DRV2 HYPERFADE WHT:** first iteration of the DRV2 circuit in Hyperfade White; the builder explicitly says it was updated with a white LED. That makes it more than a purely cosmetic white finish. [5]
- **DRV2 / LED-clipping variants:** the builder describes a pink LED-clipping version built on the DRV2 circuit platform, and an independent 2026 technical/demo source documents a DRV2 Blackout using white LED clipping. These are functional child variants because clipping hardware changes the circuit behavior. [6][7]
- **DRV2 Gold (Germanium):** documented NOS 1N34A germanium diodes and a red LED, with the builder/dealer recommending 12V or less for the germanium implementation. This is a functional DRV2-family variant rather than just gold paint. [8]

The correct catalog treatment is therefore **parent DRV2 + documented variants**, with separate top-level status reserved for an explicitly distinct model/version.

## 5. Builder and designer history

1981 Inventions was founded by Matthew Hoopes after the DRV development period. The DRV2 story is a continuation of that platform, but with a new engineering collaborator.

The documented lineage is:

**Matthew Hoopes / Jon Ashley original DRV → John Snyder / EAE DRV2 redesign**

The manufacturer describes both engineers positively and explicitly credits Snyder for the redesign. [1][2]

## 6. Lineage and relationships

DRV2 has a strong documented relationship to the original DRV, but it is not a clone of the original and should not be flattened into the same circuit identity.

The evidence supports this sequence:

**Original DRV → V2 development → DRV2**

Within that family:

- MOD 1 preserves the original V1 configuration and adds the zero-gain/op-amp options.
- MOD 2 is a modified DRV configuration with larger input capacitance and BAT41/LED hybrid clipping.
- DRV2 is the later redesign with SMT construction, 9V/18V capability, reduced noise, and revised tone behavior. [1][2]

The archive should not infer exact circuit topology equivalence between these generations without schematic or board evidence.

## 7. Historical context

DRV2 is historically notable because it marks the point where 1981 Inventions moved the DRV from a heavily V1/through-hole identity into a redesigned SMT platform.

The July 2024 private/early release is particularly useful archival evidence because Hoopes described the circuit as a future direction rather than simply a limited paint job. [1]

The subsequent MMHMM 20th Anniversary edition provides a second historical marker by using the redesigned V2 circuit before the V2 was broadly presented as the standard DRV enclosure/circuit. [3]

## 8. Sound and use context

Hoopes describes DRV2 as especially strong in the lower-gain range, from clean/barely-clipping sounds through medium-gain rock and nearly fuzz-like saturation. [2]

The V2 has:

- **more low-end thump**
- **deeper/thicker palm mutes**
- a generally **fatter** character
- a **quieter noise floor**
- a CUT sweep that is **less bright** than the earlier circuit
- enough clarity to remain useful with complex chord voicings
- a broad gain range from barely dirty to near-fuzz territory [1][2]

These are builder descriptions rather than controlled laboratory measurements. The sonic differences are nonetheless useful historical evidence because the builder is explicitly describing the design changes between generations.

## 9. Source reconciliation

### Sources consulted

| Source | Type | What it establishes |
| --- | --- | --- |
| Matthew Hoopes — DRV2 Super-Secret LEAK | First-party / first-person | July 7, 2024 early DRV2 identity, >1 year development, V2 naming, SMT, John Snyder, 9V/18V, lower noise, sonic differences |
| 1981 Inventions — DRV2 No3 | First-party manufacturer | Current standard enclosure/circuit, V2 redesign, John Snyder, 9V/18V, true-bypass option, Nashville assembly |
| Jack's Guitarcheology — MMHMM 20th Anniversary DRV | Manufacturer-copy secondary source | V2 circuit in 2024 anniversary release, new enclosure, SMT, redesign history |
| Russo Music — DRV2 No3 | Specialist dealer | Three controls, CUT behavior, noise, 9V/18V, switchable true bypass, enclosure details |
| 1981 Inventions / Matthew Hoopes — DRV2 HYPERFADE WHT | First-party product page | White Hyperfade as a DRV2 iteration and explicit white LED change |
| Matthew Hoopes / 1981 Inventions product listings | First-party product catalog | DRV2 standard, pink LED variant, Hyperfade WHT, germanium Professional DRV and related variants |
| Edge of Breakup — DRV No. 2 LED Mod | Specialist technical/demo source | White-LED DRV2/Blackout functional behavior and identification as DRV2 standard circuit |
| Reverb — 1981 Pedals DRV2 Gold (Germanium) | Secondary dealer listing | NOS 1N34A germanium diode implementation and 12V-or-less recommendation |

### Conflicts

The main apparent conflict is naming: some releases continue to carry **DRV** in their product name even when the builder describes them as being built on the DRV2 circuit platform. This is best resolved by treating the **engineering generation and builder's circuit description as stronger identity evidence than the word “DRV” printed in the product title**.

Similarly, “Hyperfade” cannot be assumed to be a purely cosmetic label. The white Hyperfade DRV2 explicitly changed to a white LED, demonstrating why every visually named edition must be checked for functional changes before classification. [5]

### Unresolved questions

1. What exact op-amp is standard in the DRV2 production circuit?
2. What exact transistor devices are used in standard DRV2 production?
3. What exact clipping-device configuration is standard in each DRV2 PCB revision?
4. What schematic or PCB revision numbers correspond to the July 2024 test units, MMHMM edition, and later No3 production?
5. Did the first limited July 2024 test units use exactly the same component set as later No3 production?
6. Which later products are cosmetic variants of DRV2 versus functional LED/germanium variants, and which of those were released as separate named editions?
7. Are all “DRV2 No3” finishes electrically identical, or were there undocumented production changes over time?

## 10. Research conclusion

**DRV2 is a genuine second-generation DRV identity.** The strongest evidence is explicit: Hoopes calls it V2 of the DRV, documents more than a year of redesign work, states that he intentionally changed the circuit rather than copying the original, and identifies SMT construction and John Snyder/EAE engineering. The current manufacturer continues to call DRV2 the new standard enclosure and circuit. [1][2]

The archive should therefore give DRV2 its own model page while nesting its colorways and functional editions underneath it. The research also demonstrates why the archive's new identity-resolution gate matters: a finish name such as Hyperfade may be cosmetic in one case but can coexist with a documented clipping change in another.

The remaining technical gaps are mostly component-level and PCB-level. They should remain explicitly unresolved until primary or strong specialist evidence closes them.

## Photo

- Archive status: Exact Photo Archived
