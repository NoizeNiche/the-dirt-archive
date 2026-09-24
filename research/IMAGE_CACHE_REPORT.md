# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Download failures: **0**
- Remaining tracker photo backlog: **2499**
- Researched, photo pending: **1**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

All pictured pedal images are locally cached.

## Recovery correction - September 24, 2026

The prior pass temporarily marked CBC Pedals — Harmonic Percolator pictured after archiving an Equipboard brand-page asset. Visual inspection confirmed that asset was the generic Equipboard logo, not the pedal. The false-positive asset was removed and the record returned to PHOTO_NEEDED. The archive identity gate was hardened so generic Equipboard brand pages cannot satisfy the exact-product image path.
