# Daphon OEM Dirt Catalog Audit 01

## Scope
Builder/manufacturer-layer audit of Daphon OEM overdrive/distortion products, with emphasis on identifying marketed-name variants without merging brands into the physical manufacturer entity.

## Findings

Daphon is documented as a long-running OEM manufacturer for musical-equipment brands. Contemporary secondary research explicitly notes that Daphon sells the same designs under multiple names, making it useful to model Daphon as the manufacturer/OEM node and preserve the customer labels separately.

### Strongly evidenced gain families

| Manufacturer family | Product | Category | Relationship status | Evidence disposition |
|---|---|---|---|---|
| Daphon | E20DS / related F15DS | Distortion | OEM family | Effects Database identifies Swamp E20DS as manufactured by Daphon and states that the same product family was sold as Chord DS-50, Tony Smith DS-60 and CastleRock CRGDS. F15DS is presented as a compact Daphon derivative of E20DS. |
| Daphon | E20OD / related OD-60 | Overdrive | OEM family | Effects Database identifies George Miles OD-60 as manufactured by Daphon and links it to Maestro OD-60, Tony Smith OD-60, CastleRock CRGOD and Daphon E20OD. |
| Daphon | E20MT / related F15MT | Distortion / Heavy Metal | OEM family | Effects Database identifies Daphon F15MT as a compact version of E20MT and documents Chord MT-50, Tony Smith MT-70 and Roberts E20MT as related OEM labels. |
| Daphon | E10DS / F10DS | Distortion | OEM family | Effects Database identifies F10DS as sharing its design with E10DS and OEM versions marketed under names including Freedom, Shelter and Wholenote. |

## Important archive rule

Do not collapse Maestro, Tony Smith, CastleRock, George Miles, Swamp, Chord, Roberts, Freedom, Shelter, Wholenote or other marketed labels into "Daphon" as brands. Record Daphon as the manufacturing/OEM entity when evidence supports it and record each customer/marketed label as a separate relationship node.

## Date caution

The sources used for this audit are strongest for product-family identity and OEM relationships. They do not provide reliable first-year/last-year production dates for every Daphon family. Keep exact chronology unresolved until period catalogs, advertisements or dated distributor material are found.

## Exclusions

No circuit reconstruction, schematics, PCB layouts, BOMs or cloning instructions are included. The archive records only historical identity, catalog relationships, categories and evidence status.

## Sources

- Effects Database, Swamp E20DS: https://www.effectsdatabase.com/model/swamp/e20ds
- Effects Database, George Miles OD-60: https://www.effectsdatabase.com/model/georgemiles/e20/od60
- Effects Database, Daphon F15DS: https://www.effectsdatabase.com/model/daphon/f15/ds
- Effects Database, Daphon F15MT: https://www.effectsdatabase.com/model/daphon/f15/mt
- Effects Database, Daphon F10DS: https://www.effectsdatabase.com/model/daphon/f10/ds
