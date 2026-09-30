# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **1**
- Local images retained/reorganized: **1**
- Cleared stale/quarantined local image references: **1**
- Download failures: **1**
- Remaining tracker photo backlog: **149**
- Researched, photo pending: **149**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- VFE Pedals - Merman: https://rvb-img.reverb.com/image/upload/s--xleOYrWE--/f_auto%2Ct_large/v1657779203/lceyaysrqocv0nergoo9.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--xleOYrWE--/f_auto%2Ct_large/v1657779203/lceyaysrqocv0nergoo9.jpg`)

These records remain externally referenced until a later cache run succeeds.
