# The Dirt Archive — Discovery Harvest Phase 12

## Focus
This pass converts several already-discovered clusters into a cleaner archival map: the West German Schaller OEM family, the U.S. Sears/Walco/Clark/MGI objects, the early French Garen record, the Italian Jen branch, and the later FY-2 interpretation lineage.

The goal is preservation and identification. Technical details are limited to distinctions that materially help identify a production period, family, or specimen. Schematics, PCB layouts, complete component lists, and cloning instructions remain outside the archive's public scope.

## 1. Schaller West German OEM family

Effects Database groups the Schaller Fuzz with Blackfield, Höfner No. 539, Kent 6400, and Van Hall. The Schaller page describes a West German production history spanning the 1960s and 1970s, while the Kent record preserves a 1970 shop catalog entry. The family is therefore a high-priority normalization target.

### Canonical relationship model
`Schaller Fuzz` → manufacturer / source family

`Blackfield Fuzz` → OEM / rebrand
`Höfner No. 539 Fuzz/Distortion` → OEM / rebrand
`Kent 6400 Distorter` → OEM / rebrand
`Van Hall Fuzz` → OEM / rebrand

EDB records germanium and later silicon-era examples, but exact changeover dates should remain specimen-based rather than treated as a single hard cutoff. citeturn668021search2turn668021search6turn668021search8turn668021search10

### Archive decision
Create a dedicated `family` record for the Schaller fuzz lineage and attach each badge/model separately. Record transistor-family changes only as high-level distinguishers when the specimen or source documents them.

## 2. Sears / Japanese unknown family

The Sears Fuzz-Tone Control is documented in a 1971 Sears catalog and is related in Effects Database to unknown Japanese Crazy Face, Crazy Tone, and Fuzzie records. This is another strong example of why a retailer should not be treated as the manufacturer. citeturn970535search0turn970535search1

### Archive decision
`Sears Roebuck & Co.` = retail/brand entity

`Fuzz-Tone Control` = model

Possible Japanese manufacturing family = unresolved

The related unknown Japanese models remain separate discovery records until specimen or period-document evidence supports a stronger relationship.

## 3. Walco Fuzz Tone Generator

Effects Database identifies the Walco Fuzz Tone Generator as a Japanese-made compact belt-clip fuzz from roughly the late 1960s into the 1970s. EDB relates it to the Kent EA-3 Fuzz Tone Bender. Its unusual belt-clip form is itself an excellent identification distinguisher. citeturn677223search2turn677223search4

### Archive decision
Record `form factor = belt-clip` as a first-class physical distinguisher. Keep the relationship to Kent EA-3 as `related-to`, not as a manufacturer claim.

## 4. U.S. Clark / Wurlitzer / Halifax / MGI / Orpheum cluster

Effects Database currently relates Clark SS-600, E.U. Wurlitzer Fuzzer Buzzer, Halifax Fuzz, MGI Fuzz and Orpheum Fuzz as a visually and historically connected group. Clark has particularly useful period evidence: a Music Trades January 1970 advertisement and a stated 1968–1970 production window. MGI itself has a sparse record, making the relationship tree especially valuable as a discovery map. citeturn889110search2turn889110search3turn889110search4turn889110search6

### Archive decision
Create a provisional U.S. `two-knob fuzz` family relationship, but do not merge the models. Orpheum should remain independent, with its two-knob germanium/silicon and later three-knob configurations preserved as separate generations or editions only when specimen evidence warrants. citeturn889110search6

## 5. Garen Distortion / Chambre De Distorsion

Tone Machines Blog's 2025 reconstruction is particularly useful because it explicitly revises the date from a previously assumed 1969-only window. A 1966-labeled specimen, a specimen with 1967 component codes, several 1969-dated examples, and a possible 1970 serial-number clue now support a cautious `1966–1970?` working range. The author explicitly leaves the exact total production and precise duration unresolved. citeturn889110search11

### Archive decision
Public record:
- French manufacturer: Garen Electronic Music Instruments MFG.
- Model: Garen Distortion / Chambre De Distorsion
- Working period: 1966–1970?
- Country: France
- Physical distinguisher: polished chrome wedge enclosure
- Functional distinguisher: three-position tonal/filter control
- Date confidence: provisional, improved by specimen evidence

This should become one of the first promoted French vintage records because it demonstrates how the archive handles evolving chronology rather than freezing an old collector myth into a false fact.

## 6. Jen Italian Tone Bender branch

Effects Database groups Jen Tone Bender and Jen Fuzz with Elka Fuzz, Luxor Fuzz, Nova Tone Bender and Unicord Fuzz, and connects the branch to the Vox by Jen V828/V8281 family. The Unicord entry specifically places the North American badge within the Jen/Pescara manufacturing network. citeturn677223search1turn677223search3turn677223search5turn677223search8

### Archive decision
Build a `Vox by Jen / Italian Tone Bender` family node. Treat Jen as manufacturer and the other names as separately branded models. Preserve enclosure and period changes as production distinguishers.

The archive should not repeat EDB's full circuit recipe. High-level technology statements such as `germanium-era example` are sufficient where they aid identification.

## 7. FY-2 lineage and modern descendants

EDB's Shin-Ei Companion FY-2 page currently places Avora, Companion, J.H. Experience, Jax, Kimbara, Suzuki, Tele-Star, Tempo, Thomas and Zenta under the same related family, and then branches into later modern interpretations such as Fredric Effects, DenTone, Pigeon FX, Wattson, REDesign and others. citeturn862089search6turn862089search8turn862089search11turn862089search13

This is useful, but the archive must distinguish three levels:

1. historical OEM/branded FY-2 objects,
2. documented later reproductions or reinterpretations,
3. modern products merely inspired by the FY-2 idea.

For example, Wattson's FY-2 explicitly presents itself as a reproduction with modern changes, while Fredric's Unpleasant Companion is a later interpretation. Those should not sit in the same historical `generation` chain as the original Shin-Ei objects. citeturn970535search2turn862089search5

## 8. Guyatone FS-3

Effects Database dates the Guyatone FS-3 to approximately 1972–1973 and notes appearances in the 1972 and 1973 Guyatone catalogs. EDB also reports an early-Honey-labeled board connection and a possible shared manufacturing lineage, but that attribution should remain probable rather than canonical until stronger documentary evidence is found. citeturn970535search3

### Archive decision
This is exactly the kind of record where component-board provenance is useful but should be expressed as:

`Observed: Honey-labeled board`

`Inference: probable relationship to earlier Honey / Super Fuzz production`

rather than:

`Manufacturer proven = Honey`

## 9. Editorial pattern emerging

The best family pages will eventually answer five questions at once:

1. Who sold it?
2. Who made it?
3. What models carried the design?
4. When did identifiable production changes happen?
5. What evidence supports the relationship?

This is much more useful to a collector than a single static pedal description.

## Promotion priorities

### Strong candidates for the first relationship-driven canonical pages
- Schaller Fuzz family
- Jen / Italian Tone Bender family
- Garen Distortion
- Clark / Wurlitzer / Halifax / MGI cluster
- Shin-Ei Companion FY-2 family

### Keep as discovery until stronger evidence
- Sears unknown-Japan family
- Walco / Kent EA-3 exact manufacturing relationship
- Orpheum broader OEM attribution

## Source list
- Effects Database: Schaller Fuzz, Blackfield Fuzz, Höfner 539, Kent 6400, Van Hall
- Effects Database: Sears Fuzz-Tone Control
- Effects Database: Walco Fuzz Tone Generator and Kent EA-3
- Effects Database: Clark SS-600, Halifax, MGI, Orpheum
- Tone Machines Blog: Garen Distortion / Chambre De Distorsion (2025)
- Effects Database: Jen Tone Bender, Jen Fuzz, Elka, Luxor, Nova, Unicord
- Effects Database: Shin-Ei Companion FY-2 family
- Effects Database: Guyatone FS-3
