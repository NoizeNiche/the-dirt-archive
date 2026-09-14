# Catalog Organization Questions

The Archive should keep asking structural questions while discovery expands. These are not UI questions first; they are data-model questions that prevent historical relationships from being flattened.

## Core identity
- Is this thing a **builder**, a marketed **brand**, a **distributor/private label**, an **OEM manufacturer**, a **designer**, or some combination?
- Can one physical manufacturer produce several marketed brands?
- Can one marketed brand move between manufacturers over time?
- Can a product keep the same model name while its manufacturer, enclosure, circuit family or production period changes?
- Can two different model names represent the same underlying product made for different markets?

## Product identity
- What is the canonical product identity independent of branding?
- What should count as a separate model versus an edition, badge, rebrand or market variant?
- When does a reissue become a new product record rather than a generation of the old one?
- How should multi-effect products be represented when fuzz is only one function among several?
- Should a family/group sit between builder and model for products that share a platform but differ in controls or branding?

## Time and production
- Do we need separate fields for **designed**, **announced**, **first documented**, **introduced**, **manufactured**, **marketed**, **distributed**, and **discontinued** dates?
- What happens when surviving examples prove a product existed before the first catalog we can currently find?
- How should uncertain ranges be expressed without creating false precision?
- Can multiple production periods share one generation name but differ in manufacturer or geography?

## Evidence and confidence
- Which evidence supports existence only, and which supports attribution, chronology, manufacturing, or design credit?
- Can a single source establish a product but not its manufacturer?
- Should claims attach to the product, builder, relationship, or specimen independently?
- How do we preserve contradictory sources instead of silently choosing one?
- Should confidence be claim-specific rather than one confidence score for an entire record?

## Relationships
- What relationships deserve first-class records instead of notes? Examples: `manufactured_for`, `rebranded_as`, `distributed_by`, `designed_by`, `successor_to`, `predecessor_of`, `licensed_from`, `based_on`, `same_platform_as`, `sold_as`.
- Can a product have several simultaneous relationships of different types without implying they are interchangeable?
- How do we model a chain such as designer -> manufacturer -> OEM customer -> distributor -> marketed brand?
- How do we represent a product that crosses countries or ownership changes while keeping the historical identity intact?

## Catalog completeness
- What does “complete catalog” mean for a small builder with a documented brochure versus a huge OEM whose full catalog has not survived?
- Can completeness be scoped by date, geography, product class, or evidence threshold?
- Should every builder have a visible completeness state and an audit log of what sources were checked?
- How do we distinguish “not found” from “did not exist”?

## Public/archive boundary
- What is safe and useful to expose publicly when the underlying attribution is still unresolved?
- Can `DISCOVERED` records be public while `CENSUS_ONLY` candidates remain internal?
- Should OEM/rebrand relationships be visible even when the physical factory is uncertain?
- How much technical detail helps identification without turning the Archive into a recipe source?

## Specimens and visual identity
- Should a specimen be linked to a canonical product, a specific generation, a relationship node, or all three?
- What physical traits are identification evidence versus merely cosmetic description?
- Can one photograph document a brand identity while another specimen documents a later factory change?
- Should serial numbers, labels, enclosure construction, graphics, controls, connectors and documented internals each be separate evidence axes?

## Homepage/editorial organization
- What belongs in “Recently added / updated”: newly discovered records, newly verified records, new generations, new relationships, or meaningful corrections?
- Should a major correction outrank a newly added obscure pedal?
- Should the five-card rail be driven by a small explicit editorial registry rather than guessed from file timestamps?
- Can the homepage eventually explain *why* an item is recent without adding another architectural layer?

## Working principle
The Archive should become a **map of identities and relationships** before it tries to become a microscope. The database should be able to say “same marketed product, different factory,” “same factory, different brands,” and “same family, different generation” without forcing those realities into one version field.
