# 1981 Inventions - LVL

## Research status

- Research phase: Deep archival dossier
- Builder: 1981 Inventions
- Pedal: LVL
- Canonical catalog identity: 1981 Inventions + LVL
- Existing baseline research: ./research/pedals/1981 Inventions/LVL.md
- Research date: 2026-10-06
- Identity classification: **MODEL / VERSION**

## 1. Exact identity

**LVL is a distinct 1981 Inventions model and circuit, separate from the DRV family.** At launch, 1981 described it as a “new circuit entirely” and its second official release after DRV. The design was developed over four years in collaboration with John Snyder of Electronic Audio Experiments. [1][2]

LVL is explicitly a low-gain, full-range overdrive / preamp concept rather than a revision of DRV. [1]

## 1A. Identity classification gate

- **Classification:** MODEL / VERSION
- **Parent:** none
- **Why separate:** explicit new-circuit language, separate product launch, different control set and different stated circuit concept.
- **Nearby edition checked:** Forget and Not Slow Down LVL is explicitly presented by 1981 as an **LVL edition**, with album artwork and edition packaging rather than a new circuit. [3]

This is a good example of the archive's identity rule: the commemorative name changes the presentation, while the underlying LVL circuit remains the model.

## 2. Chronology and versions

LVL was announced in June 2023 as 1981 Inventions' second official release after the DRV. [2]

Hoopes described the circuit as the culmination of a **four-year** development process, with the sound shaped around his desired tone for Relient K's 2009 album *Forget and Not Slow Down*. He explained that the pedal was not intentionally designed as a record-specific product at first, but the development increasingly followed the gain sound he wanted for that song and album. [4]

No numbered production revision chronology was established from the sources reviewed here.

## 3. Controls and specifications

The original launch documentation identifies a simple **two-control** interface:

- **LVL / Level:** gain control. Turning it up increases gain while reducing low end and adding brightness.
- **VOL / Volume:** master output. It can be used to drive the amplifier harder or reduce overall volume to manage the gain-to-volume relationship. [2]

### Physical format

Premier Guitar records the launch enclosure as a custom bent-steel format measuring approximately **62 x 112 x 36 mm** and weighing about **374 g**. [2]

### Power

The launch specification is **9VDC**, center-negative, using a 2.1 mm barrel connector, with a stated current draw of approximately **45 mA**. [2]

Later editions may use updated enclosure treatments, so the launch physical description should not be assumed to describe every future cosmetic edition.

## 4. Circuit and electronics

### Documented circuit concept

1981 describes LVL as a low-gain device combining **light clipping and op-amp push** to create its gain structure. It is deliberately designed as a responsive front-end stage rather than a high-gain distortion circuit. [1]

The manufacturer also calls it “full-range” because it is intended to work well on bass as well as guitar and to retain useful low-frequency response. [1]

### Third-party technical reconstruction

A 2023 Effects Layouts reconstruction describes:

- a buffered front end
- a stage using half of a **1458** op-amp
- further inverting / tone-shaping stages using **LM833**
- paired diodes discussed as a limiter rather than conventional clipping devices

The author identifies this as a hobbyist layout/reconstruction, not an electrical-engineering-certified factory schematic. The archive should therefore preserve it as **technical reconstruction evidence**, not as a definitive factory BOM. [5]

### Semiconductor uncertainty

The public manufacturer sources reviewed here do not provide a complete component list. The third-party reconstruction gives specific IC references, but it does not establish that every production LVL board uses identical parts or values.

Accordingly:

- exact production op-amp BOM: **not fully established**
- exact transistor devices: **not established**
- exact diode arrangement as a factory BOM: **not fully established**
- complete factory schematic: **not located in this pass**

## 5. Builder and designer history

LVL is a collaborative 1981 Inventions / **John Snyder of Electronic Audio Experiments** design. Hoopes describes the collaboration as the culmination of four years of work, and contemporary launch coverage identifies Snyder as the circuit designer working with Hoopes. [1][2]

This is distinct from the original DRV engineering relationship with Jon Ashley of Bondi Effects.

## 6. Lineage and relationships

The strongest documented lineage is:

**1981 Inventions DRV -> LVL as the second official release**

This is a product-line relationship, not a claim that LVL copies the DRV circuit. 1981 explicitly calls LVL a new circuit entirely. [1]

The most important relationship is to the Relient K sound that motivated its development. Hoopes identifies LVL with *Forget and Not Slow Down* and says DRV corresponds to *Mmhmm*. [1][4]

## 7. Historical context

LVL matters historically because it was the point where 1981 Inventions moved from the highly specific DRV concept into a second, lower-gain overdrive architecture.

Contemporary coverage describes it as an eagerly awaited second release after the company's earlier period in which the DRV had generated many colorways and limited editions. [6]

The later **Forget and Not Slow Down LVL** commemorative edition is especially useful for the archive because it demonstrates how the builder uses an existing model's circuit as a canvas for music-history artwork. 1981 explicitly identifies that product as the LVL - Forget and Not Slow Down edition and says the artwork comes from the album art. [3]

## 8. Sound and use context

Hoopes positions LVL as a low-gain stage that can be used as an always-on foundation, a boost into an amplifier, or a stacking partner with other dirt boxes. [1]

The builder specifically says LVL:

- works well on **bass**
- stacks effectively with other drives
- can make fuzzes work better when placed after them
- can improve other overdrives when placed before them
- can be driven by a boost into its front end
- is capable of covering an entire Relient K set in Hoopes' use case [1]

The launch description says increasing LVL gain reduces low end and increases brightness, giving the control more tonal leverage than its simple labeling suggests. [2]

## 9. Source reconciliation

### Sources consulted

| Source | Type | What it establishes |
| --- | --- | --- |
| 1981 Inventions - Forget and Not Slow Down LVL | First-party | LVL circuit description, full-range use, four-year development, Snyder collaboration, album-edition relationship |
| Premier Guitar - Announces the LVL | Contemporary specialist press | Launch date, two-control interface, physical dimensions, 9V/45mA specification |
| Effects Layouts - 1981 Inventions LVL | Technical hobbyist reconstruction | Buffered front end, 1458/LM833 references and limiter discussion |
| Delicious Audio - 1981 Inventions LVL | Specialist review/reference | Two-knob identity, low-gain purpose and builder notes |
| Spin - Matt Hoopes / 1981 Inventions | Interview | Record-specific design motivation and relationship to *Forget and Not Slow Down* |
| Reverb News - LVL launch | Contemporary specialist press | LVL as second official product after DRV and four-year development context |

### Conflicts

There is no major identity conflict in the sources. The important distinction is between **LVL model identity** and its commemorative editions. The first-party Forget and Not Slow Down listing explicitly calls the product an “LVL” edition, which supports treating the artwork edition as child archival data rather than a separate circuit. [3]

The technical reconstruction contains more component detail than the public manufacturer material, but because it is a hobbyist reconstruction it is not used to assert a factory BOM.

### Unresolved questions

1. What exact production op-amps and diode values were used across LVL production batches?
2. Is the Effects Layouts 1458/LM833 reconstruction electrically identical to factory production?
3. Were there PCB revisions during the first LVL production period?
4. Do Hyperfade, Indigo and Pink LVL editions retain the same electrical circuit, or did any include undocumented component changes?
5. Were the early “Pre-LVL prototype” units materially different from production LVL?
6. What exact production date/serial boundaries exist between launch-era and later enclosure revisions?

## 10. Research conclusion

**LVL is a separate, original 1981 Inventions circuit and the company's second official pedal.** It was developed over four years with John Snyder of EAE, uses a two-knob LVL/VOL interface, runs on 9VDC, and was designed as a low-gain full-range overdrive / preamp whose core architecture combines light clipping with op-amp push. [1][2]

The archive should treat **Forget and Not Slow Down LVL** as an edition of LVL rather than a separate model because the manufacturer explicitly presents it that way. The deeper lesson is the same one now guiding the whole archive: investigate the engineering identity first, then decide whether the visual/historical treatment deserves a child variant or a new top-level model.

The exact factory component BOM remains partly undocumented.

## Photo

- Archive status: Exact Photo Archived
