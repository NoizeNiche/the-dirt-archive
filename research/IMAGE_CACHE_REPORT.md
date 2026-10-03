# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **1**
- Local images retained/reorganized: **1**
- Cleared stale/quarantined local image references: **0**
- Download failures: **1**
- Remaining tracker photo backlog: **133**
- Researched, photo pending: **133**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- Bad Cat - Double Drive - Stackable Overdrive: https://rvb-img.reverb.com/i/s--_2x4wC4z--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/xssmspqlgqw4o4jvttzb.jpg: curl: (22) The requested URL returned error: 500 | https://media.guitarcenter.com/is/image/MMGS7/L81332000001000-00-86x86.jpg: source image dimensions below 120px (`https://rvb-img.reverb.com/i/s--_2x4wC4z--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/xssmspqlgqw4o4jvttzb.jpg`)

These records remain externally referenced until a later cache run succeeds.
