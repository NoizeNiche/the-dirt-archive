# 1981 Inventions — DRV

## Research status

- Research phase: Deep archival dossier
- Builder: 1981 Inventions
- Pedal: DRV
- Canonical catalog identity: 1981 Inventions + DRV
- Existing baseline research: ./research/pedals/1981 Inventions/DRV.md
- Research date: 2026-10-06

## 1. Exact identity

The **DRV** is the original core distortion/preamp model from 1981 Inventions. The archive should keep the base DRV distinct from later **DRV2** and **DRV MOD** records. The manufacturer's current DRV-family pages explicitly treat those later products as modified/redesigned versions rather than silently folding their technical changes into the original identity.

The pedal is normally identified simply as **DRV**, with front-panel controls labeled **DRV**, **CUT**, and **VOL**. Guitar.com describes the original design as a white enclosure among the small-batch colorways offered by 1981 Inventions.

The relationship to the ProCo RAT is important but should not be reduced to "RAT clone." Matthew Hoopes described a 1985 Whiteface RAT as the starting point and described multiple deliberate circuit changes. A later technical layout also notes that the DRV does not retain the RAT's same slew-rate compensation, supporting the distinction between inspiration/topology and literal duplication.

## 2. Chronology and versions

### Development

Hoopes told Guitar.com that he and Jon Ashley worked through several abandoned ideas over a period of years before settling on the DRV direction. The manufacturer-derived product description likewise says Hoopes had been working on the project for the better part of three years with Ashley's collaboration and engineering.

### First public release

The first DRV run was released to the public in **June 2018**. In interview coverage, Hoopes said he released the first run late one night and discovered the run had sold out by the following morning.

### Expansion beyond limited runs

In June 2020, 1981 Inventions announced its first DRV run that was not limited by a fixed number of units. That run was offered for a defined ordering window rather than as an endlessly stocked product.

### Later DRV-family changes

The current manufacturer distinguishes later products including DRV2 and DRV MOD variants. In its DRV2 No3 description, 1981 Inventions states that Jon Ashley originally engineered the DRV and that John Snyder of Electronic Audio Experiments later redesigned and engineered the DRV2 circuit. That is strong evidence that DRV2 should remain a separate technical generation.

The current DRV MOD 1 page further describes a V1/older configuration with old-style through-hole construction, an OPA2134 option, socketed original op-amp access, and a "zero-gain" mode. Those features belong to that later/modified record and are not being back-propagated into this base DRV dossier.

### Colorways and editions

1981 Inventions has released the DRV in numerous finishes and limited colorways. The archive should treat those as cosmetic editions of the parent DRV unless the edition is documented as a materially different circuit/version.

## 3. Controls and specifications

### Controls

- **DRV:** gain/drive amount.
- **CUT:** high-frequency roll-off/filter control. The controls are interactive rather than behaving as isolated tone/gain controls.
- **VOL:** output level.

The original interface also uses an on/off footswitch and LED indicator.

### Power

The manufacturer-derived original DRV description says the external power requirement is **9V standard, Boss-style**. The same description says the internal circuits run at **18V via an internal voltage regulator**. Third-party circuit documentation describes the 18V rail as being produced with a charge-pump voltage doubler.

The current manufacturer FAQ independently confirms that 1981 Inventions' pedals use standard **9V DC center-negative** power. That is a current company-wide statement rather than an original DRV manual, so it is useful corroboration but not a substitute for the historical DRV-specific description.

A current dealer specification lists approximately **58 mA** draw for the DRV. This should remain classified as a secondary specification unless an original manufacturer spec sheet or manual is located.

### Construction and switching

The original manufacturer-derived description specifies a **steel enclosure**, **Switchcraft 11 open-frame jacks**, and a **soft-touch switching system using an internal relay**.

The technical layout community describes the original as buffered-bypass. Its published reconstruction can be wired for either true or buffered bypass, but the original configuration is identified as buffered.

## 4. Circuit and electronics

The DRV is best understood as a **RAT-derived architecture substantially reworked for lower-gain, more controlled operation**, with a dedicated preamp stage ahead of the distortion section.

### Documented design changes from the RAT starting point

Hoopes described the DRV as based on a **1985 Whiteface ProCo RAT** and specifically identified:

- a fixed-level, always-on preamp ahead of the distortion section
- roughly **1/20th the gain** of a traditional RAT
- changes to the low end
- changes to the midrange
- a revised filter sweep
- revised level behavior
- revised switching
- revised LED implementation
- additional filtering intended to emulate the behavior of preferred LM308-era RAT chips

Hoopes also said that several other ICs sounded good in the DRV and that the LM308 itself was not necessarily the ideal device for the circuit. This is useful because it argues against casually labeling the DRV an "LM308 RAT."

### Two functional circuits

The manufacturer-derived product description explicitly describes **two circuits** inside the pedal:

1. a distortion circuit
2. a preamp/boost circuit

The preamp is particularly important to the DRV's identity. Hoopes described the low-gain region as a place where preamp behavior and low-gain distortion meet, which is one of the major reasons the pedal behaves differently from a conventional RAT at restrained gain settings.

### Internal voltage

Manufacturer-derived documentation says the circuits run internally at **18V** while the pedal is powered from a normal 9V supply.

A 2019 third-party circuit reconstruction describes the design as using two op-amp gain stages and buffered bypass. It also documents an LT1054-based voltage-doubler arrangement in that reconstruction. Because this evidence comes from a published reconstruction rather than an original manufacturer BOM, the archive should record the architecture while keeping exact production component assignments appropriately qualified.

### Op-amp identity

The original baseline research correctly avoided assigning an exact production op-amp to the original DRV. The later **DRV MOD 1** manufacturer page explicitly names a **Burr-Brown OPA2134** as a selectable "HiFi" component for that modified configuration, but this should not be treated as proof that every original DRV used an OPA2134.

Technical DIY reconstructions commonly use **TL072** devices. That is evidence about the reconstructed circuit and not sufficient proof of the factory original.

### Clipping devices

A 2019 Effects Layouts reconstruction shows/identifies **1N4148** silicon diodes in the clipping portion. This is valuable technical evidence about the circuit represented by the published schematic/layout, but the archive should not upgrade it to an unquestioned factory bill of materials without an original production schematic or measured board evidence.

### RAT relationship

The DRV retains strong RAT-family characteristics, particularly hard-clipping behavior and filter-oriented tone shaping, but it is not simply a one-for-one RAT circuit. Technical discussion of the published reconstruction specifically notes differences such as the absence of the RAT's characteristic slew-rate compensation.

## 5. Builder and designer history

1981 Inventions was founded by **Matthew Hoopes**, guitarist of Relient K, and is currently described by the company as being co-run with **Laura Hoopes**. The company's current About page says its pedals are built in Nashville by Matthew Hoopes and Jack O'Shea.

For the original DRV, **Jon Ashley of Bondi Effects** is the critical design collaborator. Hoopes described the DRV as designed/engineered by Ashley and himself in interview coverage, while the manufacturer-derived original description identifies the project as a collaboration with engineering by Ashley.

There is a useful historical production distinction in the surviving record: an early manufacturer-derived description says the pedals were entirely built by Hoopes with some PCB help from **Jeff Hime**, while the current company describes Nashville production with Jack O'Shea. This should be interpreted as a change in production assistance over the company's history, not as a contradiction about who created the circuit.

## 6. Lineage and relationships

### Upstream

The clearest documented upstream lineage is:

**ProCo 1985 Whiteface RAT → DRV**

That relationship is explicitly stated by Hoopes. The DRV should therefore be classified as **RAT-derived/inspired**, not as an unrelated original circuit.

### Internal 1981 lineage

The documented family is:

**DRV → DRV2 / DRV MOD variants**

The current manufacturer says the original circuit was engineered by Jon Ashley and that later DRV2 redesign work was done by John Snyder of Electronic Audio Experiments. That is a strong documented version-family relationship and one reason those records remain separate in the archive.

### What is not established

Shared controls, shared hard-clipping behavior, or the existence of a third-party clone does not establish a deeper designer relationship with unrelated pedals. This dossier does not infer cloning or circuit equivalence beyond the documented RAT starting point.

## 7. Historical context

The DRV is significant not merely because it was another boutique distortion box, but because it was the product that effectively **created the 1981 Inventions company**. The surviving manufacturer-derived description says that when the project evolved into something genuinely new, it became the catalyst for starting 1981 Inventions.

Hoopes' 2018 interview also documents the remarkable launch trajectory: the first public run sold out immediately. By June 2020, the company was already experimenting with a more scalable non-number-limited DRV ordering model.

The DRV also became associated with a recognizable boutique-pedal visual language: minimal controls, a highly graphic enclosure, and recurring small-batch color treatments. That visual identity became part of how the model was recognized in the pedal community, although appearance is not evidence of a particular circuit revision.

### The 1981 name

There is a small but useful source-history wrinkle here. The current 1981 Inventions FAQ describes the name as the founder's birth year plus a nod to a golden era of analog gear. In a 2022 SPIN interview, Hoopes gave a more specific personal explanation involving a **1981 Tube Screamer** that had a major effect on him, while also noting that he was born in 1981.

The archive should preserve both explanations rather than choosing one and pretending the public record is perfectly uniform.

## 8. Sound and use context

Hoopes consistently emphasizes the **lower-gain and boost region** of the DRV as its distinctive feature.

The design intent was not simply to make a lower-gain RAT. The fixed preamp means the pedal can operate as a hybrid of preamp/boost and distortion, and Hoopes described the low-gain region as opening up a spectrum where preamp behavior meets low-gain distortion.

Guitar.com describes the result as rich, musical overdrive with a more controlled low-mid and bass character than a conventional RAT. Hoopes emphasized a strong midrange presence and a thick yet clear response, including useful behavior with heavier or complex chords.

The DRV therefore occupies several practical zones:

- clean-ish boost / preamp behavior
- low-gain overdrive
- medium-gain distortion
- thicker high-gain sounds with RAT-family character

Those zones should be treated as documented design/use characteristics, not as subjective performance ratings.

## 9. Source reconciliation

### Sources consulted

| Source | Type | What it establishes |
| --- | --- | --- |
| https://1981inventions.com/pages/about | Manufacturer | Current company history, Hoopes/Laura roles, Nashville production, DRV as mainstay |
| https://1981inventions.com/pages/faq | Manufacturer | Current 9V center-negative company power guidance and hand-assembly statement |
| https://guitar.com/features/interviews/interview-matthew-hoopes-of-1981-inventions/ | Interview | June 2018 first public release, instant sellout, Whiteface RAT origin, preamp, gain reduction, circuit changes |
| https://guitar.com/reviews/effects-pedal/review-1981-inventions-drv/ | Review | Three controls, original presentation, RAT starting point, playing behavior |
| https://www.effectsdatabase.com/model/1981inventions/drv | Specialist archive | Two-circuit description, 18V internal operation, steel enclosure, Switchcraft jacks, relay switching, original production narrative |
| https://effectslayouts.blogspot.com/2019/06/1981-inventions-drv.html | Technical secondary | Published reconstruction showing two op-amp gain stages, buffered bypass, 18V rail and charge-pump implementation |
| https://tagboardeffects.blogspot.com/2019/07/1981-inventions-drv.html | Technical secondary | RAT-family similarities and differences in technical behavior |
| https://1981inventions.com/products/drv2-no3-clear-knob | Manufacturer | Explicit DRV versus DRV2 redesign lineage and John Snyder involvement |
| https://1981inventions.com/collections/drv | Manufacturer collection | Current DRV family and later product context |
| https://www.spinmagazine.com/2022/06/relient-k-matt-hoopes-1981-inventions/ | Interview | Company naming context, Hoopes' Tube Screamer history and 1985 RAT significance |

### Conflicts and qualifications

**Original op-amp:** not conclusively established from the strongest surviving sources reviewed in this pass. DIY reconstructions often use TL072, while a later DRV MOD 1 explicitly offers OPA2134. These facts should not be collapsed into one factory BOM claim.

**Exact clipping diode part:** 1N4148 is identified in a third-party reconstruction, but the source is not a factory production BOM. Preserve it as reconstruction evidence unless a stronger original source is found.

**Bypass terminology:** technical sources describe the original DRV as buffered, while later variants may offer true bypass. Version-specific bypass behavior must therefore remain attached to the exact record.

**Company-name explanation:** current FAQ wording and the 2022 SPIN interview provide different emphases. Both should be retained as parts of the public history.

### Unresolved questions

1. What exact op-amp part numbers were fitted to each original DRV production generation?
2. Were the 1N4148 clipping devices used universally in factory production, or only represented in the published reconstruction?
3. What exact PCB/layout revisions existed between the earliest 2018 units and later pre-DRV2 production?
4. When did production assistance transition from the early Jeff Hime arrangement to the later Nashville team described by 1981 Inventions?
5. Is there an original factory schematic or service document surviving outside the currently indexed public sources?
6. What exact current-era DRV units, if any, still preserve the original V1 architecture versus later component/PCB revisions?

## 10. Research conclusion

The **1981 Inventions DRV** is a documented RAT-derived distortion/preamp design created by Matthew Hoopes in collaboration with Jon Ashley, with the 1985 Whiteface RAT serving as the explicit starting point. The important engineering story is the deliberate transformation of that starting point: a fixed always-on preamp, much lower overall gain, altered low-end/midrange/filter behavior, and additional filtering produced a pedal intended to move the RAT concept toward a more nuanced low-to-medium-gain instrument.

The strongest historical evidence places the first public DRV release in **June 2018**, with the first run selling out immediately. The pedal subsequently became the catalyst for the 1981 Inventions brand and evolved into a distinct family of later DRV2 and DRV MOD products.

The technical record is unusually useful but still incomplete at component level. The archive can confidently document the **two-functional-circuit architecture, internal 18V operation from 9V input, relay-based switching, buffered-bypass behavior in the original, and RAT-derived design lineage**. It should remain cautious about assigning exact factory op-amp and clipping-device part numbers until primary production documentation is located.

The most valuable next research target for this record is therefore not "what does it sound like?" but **the surviving revision history of the original DRV and the exact boundary between the earliest V1 circuit and the later DRV2/modified generations**.
