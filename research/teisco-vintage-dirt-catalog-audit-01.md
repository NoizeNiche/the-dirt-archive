# Teisco vintage dirt catalog audit 01

## Scope
Builder-level and product-family audit for historically relevant Teisco fuzz / distortion / wah-fuzz products. This pass deliberately separates Teisco marketed products from Japanese OEM/manufacturing relationships and does not publish circuit reconstruction details.

## Evidence anchors
- Effects Database indexes a Teisco catalog of 12 pedal/effects records, including Teisco Fuzz Machine, TF-1 Fuzz, Wau Wau Fuzz, plus later Teisco-branded pedals.
- Teisco TF-1 Fuzz is documented as a late-1960s/early-1970s Teisco-branded version in the Japanese FY-6 / Super Fuzz family.
- Teisco Fuzz Machine is documented as an early-1970s Japanese product with multiple marketed-brand counterparts, including Ibanez Standard Fuzz, Bruno Fuzz Machine, Mica Fuzz, Marlboro Wailer, Antoria Fuzz Machine and Aria Diamond Fuzz.
- Teisco Wau Wau Fuzz is documented as an early-to-mid-1970s Japanese OEM product; surviving references connect it to the same broad Shin-Ei-associated OEM family also seen under Ibanez, Guyatone, Elk and other export brands.
- Current Teisco is again an active pedal brand. The modern catalog includes Fuzz, Overdrive and Distortion and multiple mini gain pedals. These must remain in a separate modern-era layer from the vintage Teisco/OEM products.

## Canonical archive treatment
Teisco should remain a canonical brand/manufacturer node, but the vintage layer should not assume that every Teisco-branded effect was manufactured in the same factory. Where period evidence identifies an OEM or shared supplier only probabilistically, retain the relationship as an unresolved or likely manufacturing relationship.

## Dirt catalog now bounded for the historical layer
1. Teisco TF-1 Fuzz — late 1960s/early 1970s, Teisco-branded Super Fuzz-family record.
2. Teisco Fuzz Machine — early 1970s, distinct enclosure/control identity and broad marketed-brand family.
3. Teisco Wau Wau Fuzz — early-to-mid-1970s, OEM fuzz-wah family.
4. Teisco Fuzz — modern revival/modern branded product; keep separate from vintage Fuzz Machine.
5. Teisco Overdrive — modern product.
6. Teisco Distortion — modern product.
7. Teisco Mini Fuzz — modern product.
8. Teisco Mini Vintage Distortion — modern product.
9. Teisco Mini Metal Distortion — modern product.
10. Teisco Mini Blues Overdrive — modern product.
11. Teisco Mini Dee Overdrive — modern product.
12. Teisco Boost — boundary, not dirt core.

## Open questions
- Exact manufacturing responsibility for each vintage Teisco-branded dirt model needs to be resolved product-by-product rather than inherited from related pedals.
- Period Kawai/Teisco catalogs from 1974 onward should be checked directly for effect-model numbers, naming and export-market status.
- The transition from historical Teisco effects activity to the modern revival brand should be represented as a separate commercial era.

## Sources
- https://www.effectsdatabase.com/model/teisco
- https://www.effectsdatabase.com/model/teisco/tf1
- https://www.effectsdatabase.com/model/teisco/fuzzmachine
- https://www.effectsdatabase.com/model/teisco/wauwaufuzz
- https://www.effectsdatabase.com/model/teisco/overdrive
- https://www.effectsdatabase.com/model/teisco/distortion
- https://kurosawagakki.com/brands/teisco/
- https://vintagejapanguitars.com/teisco-guitar-catalogues/

## Archive safety note
No schematics, PCB layouts, BOMs, gutshot libraries, cloning instructions, or circuit reconstruction material are included here.
