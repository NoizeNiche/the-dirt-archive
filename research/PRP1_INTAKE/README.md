# PRP1 Atomic Workflow

From this point forward, PRP1 can be advanced one completed pedal at a time.

The assistant researches the next exact-order tracker target and creates one JSON file in `research/PRP1_INTAKE/` containing the complete research record and any known source-page information.

The GitHub workflow then:

1. selects the earliest queued target by `PRP_TRACKER.csv` order
2. writes the individual Pedal Info research record
3. verifies the catalog/manifest wiring
4. uses the existing browser image-search and exact-source recovery method for that exact pedal
5. requires a real local WebP photo and preserved provenance
6. synchronizes `PEDAL_INDEX.json`, `PEDAL_IMAGES.json`, and `PRP_TRACKER.csv`
7. marks `PRP Complete = DONE` only when both research and the exact local picture exist
8. updates the public data version
9. commits the complete unit together
10. lets the existing Cache pedal images workflow finish before GitHub Pages deployment publishes it

A failed or unverified photo never gets substituted with a similar model, clone, different version, or guessed image. The research package remains unpublished until the exact photo requirement is satisfied.

This workflow is intentionally separate from the older bulk photo-recovery maintenance pass. Existing researched-photo-pending records can still be recovered by the cache maintenance workflow without changing the permanent completion rule.
