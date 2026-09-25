# The Dirt Archive - Improvement Ideas

This file is the long-term design backlog collected before the final redesign.

## Operating rule

Ideas are gathered during the catalog, research, and photo-completion phases, but the public site is not redesigned around them until the catalog, research, and photo recovery work is substantially complete.

## Seeds

- Collector-first search and filtering that treats Builder, exact pedal identity, dirt type, era, versions, colorways, and evidence completeness as first-class dimensions.
- Pedal detail pages that make provenance visible without turning the page into an administrative dashboard.
- Strong visual handling for historical pedals with missing photographs, including a clear distinction between “No Photo Archived” and “photo unavailable from source.”
- Version-aware browsing that keeps V1/V2/reissues and cosmetic variants distinct without fragmenting the catalog unnecessarily.
- Cross-pedal discovery based on documented traits rather than unsupported circuit assumptions.
- Archive-health views for future maintenance that remain separate from public-facing pedal pages.
- Fast page performance even as the local photo archive grows substantially.
- Accessibility and keyboard-first exploration treated as part of the archive's core design rather than a final polish pass.
- Search-engine-friendly canonical URLs and metadata for individual pedals and builders.
- A final visual redesign pass after catalog completion, using the strongest accumulated ideas rather than continuously redesigning during data collection.

## Hourly scout log

The scheduled Archive Improvement Scout appends new ideas here after reviewing influential sites and eliminating duplicates.

## Scout Pass 2026-09-24

### [2026-09-24] Faceted archive explorer with result counts
- **Source/inspiration:** PedalFilter exposes dense type/manufacturer facets with live counts; Mint Museum combines keyword search with collection, date, object-type, and location filters. citeturn0search0turn0search15
- **Problem/opportunity:** A 3,765-record archive needs users to narrow huge result sets without guessing the site's taxonomy.
- **Proposed experience:** Build a fast faceted explorer with Builder, effect type, era/version, availability/status, image availability, documentation level, and other verified metadata. Show result counts beside facets and preserve the current query in the URL.
- **Why it fits The Dirt Archive:** It turns the large census into a navigable research instrument rather than a long catalog.
- **Implementation notes:** Make filters additive, keyboard accessible, shareable, and server/static-index friendly. Do not expose unverified metadata as a filter.
- **Status:** candidate

### [2026-09-24] Saved searches, groups, and collector lists
- **Source/inspiration:** Winterthur supports saved searches, groups, and favorite object lists; GC Used Inventory Tracker and GearFinder use watch/want lists. citeturn0search16turn0search17turn0search18
- **Problem/opportunity:** Serious collectors need to return to sets of pedals, not just individual pages.
- **Proposed experience:** Let visitors create lightweight local collections such as “Want to identify,” “Owned,” “Research later,” and custom lists, with export/share support later.
- **Why it fits The Dirt Archive:** It adds collector utility without turning the archive into a marketplace.
- **Implementation notes:** Start client-side/local-storage so accounts are unnecessary; design the data model so account sync can be added later.
- **Status:** candidate

### [2026-09-24] Evidence and provenance timeline
- **Source/inspiration:** The Walters collection explicitly surfaces provenance, conservation/exhibition history, ongoing research, and uncertainty in object records. citeturn0search13
- **Problem/opportunity:** The Dirt Archive's research effort is valuable only if visitors can tell what is documented, where it came from, and what remains uncertain.
- **Proposed experience:** Add a compact “Evidence & provenance” panel to pedal pages showing source links, source type, verification state, research date, image provenance, and unresolved questions. Distinguish verified facts from inferred/secondary claims.
- **Why it fits The Dirt Archive:** This directly strengthens the archive's defining promise of exact identity and historical usefulness.
- **Implementation notes:** Never collapse conflicting evidence into a false single fact. Preserve source-level provenance in the data model.
- **Status:** candidate

### [2026-09-24] Completeness meter, not a generic rating
- **Source/inspiration:** GearsVault emphasizes that even a complete spec sheet is useful before photos exist, while its community model separates adding photos from filling specifications. citeturn0search1
- **Problem/opportunity:** A record can be photographically complete but historically thin, or vice versa.
- **Proposed experience:** Show a non-opinionated record completeness matrix: identity, photos, specs, controls, circuit evidence, historical notes, sources, and version history.
- **Why it fits The Dirt Archive:** It tells collectors exactly what is known without inventing a quality score.
- **Implementation notes:** Each dimension needs explicit rules and should link to the missing evidence rather than merely displaying a percentage.
- **Status:** candidate

### [2026-09-24] Pedal-to-tone and artist context graph
- **Source/inspiration:** ToneDB and ToneMirror connect gear to songs, artists, signal chains, and tone recipes; Ground Guitar connects gear to famous guitarists. citeturn0search2turn0search3turn0search8
- **Problem/opportunity:** A pedal archive becomes much more useful when a collector can understand where a pedal sits in musical history.
- **Proposed experience:** Where evidence exists, add “Used in,” “Related artists,” and “Signal-chain context” modules that link back to documented pedal records. Keep claims source-backed.
- **Why it fits The Dirt Archive:** It creates discovery paths from an object to its musical significance without turning the archive into a review site.
- **Implementation notes:** Use a separate relationship layer so uncertain artist/record claims can be marked as reported, verified, or disputed.
- **Status:** candidate

### [2026-09-24] Exact-identity search behavior
- **Source/inspiration:** ToneDB supports searching song, artist, or gear; MyEverFind and GearFinder emphasize one-search discovery across fragmented gear sources. citeturn0search2turn0search7turn0search18
- **Problem/opportunity:** Pedal names have versions, punctuation variants, aliases, and builder-name variations.
- **Proposed experience:** Search should rank exact Builder + Model matches first, then version matches, aliases, related models, and broader text matches. Show why a result matched.
- **Why it fits The Dirt Archive:** Exact identity is more important here than generic full-text relevance.
- **Implementation notes:** Normalize punctuation and version tokens in the search index while retaining canonical display names. Never merge distinct versions solely because their names are similar.
- **Status:** candidate

### [2026-09-24] Visual-first browse cards with meaningful metadata
- **Source/inspiration:** PedalFilter explicitly positions itself as visual; Stomp Base presents large product imagery, builder, category, and reference price at browse level. citeturn0search0turn0search4
- **Problem/opportunity:** Once the photo backlog is complete, the archive will have enough visual material to make recognition dramatically faster.
- **Proposed experience:** Make browse results image-led but include compact identity metadata: Builder, exact model, version, type, photo status, and evidence/completeness indicators.
- **Why it fits The Dirt Archive:** Collectors often recognize a pedal visually before they remember its exact model name.
- **Implementation notes:** Preserve a fast text-only mode and responsive lazy-loading so visual browsing does not become a performance tax.
- **Status:** candidate

### [2026-09-24] Neutral market context without becoming a marketplace
- **Source/inspiration:** Gear Avail separates live inventory from rolling market-price context and explicitly refuses to manufacture a market price from thin samples. citeturn0search5
- **Problem/opportunity:** Collectors frequently need historical/value context, but the archive should not distort its neutral archival purpose.
- **Proposed experience:** If market data is eventually added, show it as a clearly separate “Market context” layer with sample size, observation date, and a “not enough data” state.
- **Why it fits The Dirt Archive:** It can make the archive more useful to collectors while protecting its research identity.
- **Implementation notes:** Never rank or promote a pedal because it is expensive or commercially active. Keep marketplace links secondary.
- **Status:** candidate

### [2026-09-24] Duplicate/overlap check against existing direction
- **Existing direction overlap:** Faceted browsing, visual discovery, exact identity, provenance, and collector utility are consistent with the existing archive-first direction already recorded above.
- **New additions worth preserving:** saved collector lists; explicit evidence/provenance timelines; record completeness dimensions; source-backed artist/signal-chain relationships; exact-match explanation in search; neutral market-context rules.
- **Do not duplicate:** A generic “make search better” item. The useful new specification is exact-identity ranking plus explainable matching.
- **Do not copy:** No page layout, copy, branding, or proprietary interaction should be reproduced from the referenced sites. These are capability-level inspirations only.



### [2026-09-25] Scout Pass 10 - research workflows and collector utility refinements

- **Refinable/shareable research queries:** Preserve active filters in canonical URLs and let researchers refine/bookmark exact query states. Inspired by MusicBrainz and SeaDisco. citeturn0search4turn0search2
- **Known-unknowns discovery:** Add explicit research-gap facets for uncertain identity, missing primary photo, missing builder evidence, provenance gaps, and source-review needs. citeturn0search6turn0search9
- **Dated pedal-to-performance relationships:** Where evidence exists, connect pedals to dated pedalboard/use contexts with source and confidence metadata. citeturn0search8
- **First-class builder pages:** Give canonical builders their own browseable records with aliases, status, related pedals, versions, eras, and research coverage. citeturn0search9
- **Family/exact-version collector workflow:** Family pages should link to exact V1/V2/reissue/regional records; saved collector items should target exact records. citeturn0search11turn0search13
- **Private research annotations:** Permit local/private notes on saved pedals or lists for identification clues, restoration questions, acquisition provenance, and research tasks, separate from canonical facts. citeturn0search13turn0search10
- **Relationship records with attributes/dates:** Model pedal-to-builder, artist, board, source, variant, and event relationships with type, evidence, confidence, and dates/ranges where known. citeturn0search3
- **Evidence-first record presentation:** Distinguish canonical facts, sourced observations, reported claims, and unresolved questions, with source attribution at field/group level where practical. citeturn0search12turn0search6

**Duplicate/overlap check:** Existing backlog already covers faceting, saved lists, provenance, completeness, artist context, exact identity, visual discovery, version awareness, market separation, accessibility, performance, and canonical URLs. The items above sharpen those concepts rather than replacing them. Generic marketplace features, ratings/popularity systems, seller rankings, and purchase recommendations were rejected as outside the archive's research mission.

**Research boundary:** Capability-level inspiration only. No protected copy, branding, page composition, or proprietary visual treatment should be reproduced.
