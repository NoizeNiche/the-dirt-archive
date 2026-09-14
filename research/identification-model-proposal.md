# The Dirt Archive — Identification Model Proposal

The Archive should eventually identify real-world pedals by separating **market identity** from **historical/manufacturing identity**. These are often not the same thing.

## Two parallel identity layers

### Market identity — what the object presents to the player
- Brand name printed on the enclosure.
- Model name / model number.
- Badge or private-label name.
- Graphics and typography.
- Country-of-origin marking.
- Distributor or retailer marking.
- Packaging/manual identity.
- Advertised product family.

### Historical identity — what the evidence can establish
- Canonical manufacturer / physical builder.
- OEM customer or commissioning company.
- Designer / design collaborator.
- Distributor / importer.
- Corporate owner or successor.
- Product family / platform lineage.
- Generation / production period.
- Geography of manufacture.
- Evidence confidence for each claim.

## Why this matters
A pedal can be marketed by one company, manufactured by another, designed by a third party, distributed by a fourth, and later reissued by a successor. One brand can also move between manufacturers over time, while one factory can make several brands.

The Archive therefore should not try to answer “Who made this?” with one field. A useful identification result may instead read as:

> Marketed as Multivox Big Jam Distortion. Historical evidence identifies Firstman Electronics / Hillwood as the Japanese OEM manufacturer for the late-1970s Big Jam line. Multivox remains the marketed brand/distribution identity.

This preserves the physical object, the commercial identity and the manufacturing history without collapsing them into a false single “builder” label.

## Identification evidence axes

A future visual-identification system should score evidence separately rather than producing one opaque confidence number:

1. **Brand evidence** — does the object match the expected marketed identity?
2. **Model evidence** — do controls, enclosure, graphics and markings fit the model?
3. **Generation evidence** — do visible details fit a known production period?
4. **Manufacturing evidence** — are there documented traits tying the specimen to a specific factory/OEM?
5. **Lineage evidence** — does the object belong to a known family or shared platform?
6. **Geographic evidence** — do country markings and period sources agree?
7. **Specimen evidence** — does the surviving physical object itself document the claimed identity?

## Result structure

A future identification page should be able to present:

**Likely identification**
Market identity: [brand + model]

**Historical attribution**
Manufacturer: [entity + confidence]
OEM/customer: [entity + confidence]
Designer: [entity + confidence]

**Production identity**
Generation: [period]
Likely date: [range]
Manufacturing geography: [place]

**Why**
A compact explanation of the visual and documentary evidence supporting the match.

**What remains unresolved**
Contradictory or incomplete attribution should remain visible rather than silently converted into certainty.

## Working rule
Identify the object the collector actually holds first. Then reconstruct the commercial and manufacturing history behind it. Never let the historical lineage erase the physical identity of the specimen.
