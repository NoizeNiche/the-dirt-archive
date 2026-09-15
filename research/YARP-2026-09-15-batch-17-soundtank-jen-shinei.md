# YARP batch 17: SoundTank / JEN / Shin-Ei lineage audit

## Purpose
Cross-check previously recorded Japanese OEM relationships against current manufacturer statements and specialist historical indexes, with special attention to places where a broad brand-level statement conflicts with model-specific evidence.

## Findings

### 1. SoundTank manufacturer attribution must remain model-aware
Maxon's current historical FAQ states that Maxon/Nisshin Onpa was responsible for design and manufacture of many Ibanez products, explicitly including the SoundTank series. Aion FX's historical Tube Screamer page states instead that SoundTank pedals were not designed or manufactured by Maxon. Secondary material quoting Analogman identifies the TS-5 as a pre-2003 Tube Screamer exception that was not manufactured by Maxon, and retailer material associates TS-5 with Taiwan/Daphon.

Archive decision: do not assign a single factory to the entire SoundTank universe. Preserve a conflicted umbrella relationship and add model-specific manufacturer fields where stronger evidence exists. The already-established caution around TS-5 should remain in force.

### 2. Teisco Fuzz Machine remains an evidence-qualified OEM family
Effects Database groups the Teisco Fuzz Machine with Ibanez Standard Fuzz No.59, Bruno Fuzz Machine, Mica Fuzz, Marlboro Wailer Fuzz, Antoria Fuzz Machine and Aria Diamond Fuzz, and describes Shin-Ei development with Teisco/OEM manufacture. Because this is specialist secondary evidence rather than a recovered primary factory ledger, the archive keeps the shared-family relationship while withholding a universal factory attribution.

### 3. Shin-Ei WF families can be promoted at family level
Effects Database explicitly distinguishes the WF-24 wide-box 8-transistor family from the WF-8 narrow-box 8-transistor family and lists parallel marketed names for WF-24 such as Boomer, Companion, Electra, Marlboro, Oscar, Thomas and WEM. These names can be represented as a family/market relationship without implying that every specimen is the same production state.

### 4. JEN Italian Tone Bender successor network is strong at family level
Effects Database separately catalogs Jen Fuzz, Jen Tone Bender, Elka Fuzz, Nova Tone Bender and Unicord Fuzz as related Italian Jen-family states descending from the Vox V828/V8281 corridor. The archive promotes the lineage edge while keeping retail identities separate and avoiding unsupported exact specimen chronology.

## Editorial result
The Japanese OEM graph is now explicitly two-layered:
- broad lineage/family edges where secondary evidence is strong;
- model-specific manufacturer attribution where documentary evidence is stronger or conflicting.

This prevents a manufacturer-level statement about one product from being inherited automatically by every product carrying the same retail family name.

## Next work
1. Complete model-specific SoundTank exceptions and production corridors.
2. Continue JEN export/house-brand enumeration.
3. Reconcile the Teisco/Aria/Antoria/Mica/Bruno/Marlboro family against period advertisements or catalogs.
4. Then run the first machine-readable public lineage promotion pass using only PROMOTE/PROMOTE_FAMILY edges.
