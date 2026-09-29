# Pedal Image Cache Report

- Cached in this run: **3**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **2**
- Cleared stale/quarantined local image references: **0**
- Download failures: **3**
- Remaining tracker photo backlog: **179**
- Researched, photo pending: **179**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Newly cached

- Ibanez - TS7 -> `./assets/pedals/ibanez/ts7/primary.webp`
- Mask Audio Electronics - Part Garden -> `./assets/pedals/mask-audio-electronics/part-garden/primary.webp`
- Maxon / Nisshin Onpa - ROD881 Real Overdrive / Distortion -> `./assets/pedals/maxon-nisshin-onpa/rod881-real-overdrive-distortion/primary.webp`

## Still external / failed

- Maxon / Nisshin Onpa - ST-9 Super Tube Screamer: https://rvb-img.reverb.com/i/s--I9CFjpJR--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/cwvi2xahedwicjlwxnlu.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--I9CFjpJR--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/cwvi2xahedwicjlwxnlu.jpg`)
- NUX Audio / NUX - DS-3 Classic Distortion: https://rvb-img.reverb.com/i/s--E8ERTpA7--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/smzntlkypakodjdpwyb5.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--E8ERTpA7--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/smzntlkypakodjdpwyb5.jpg`)
- VOX - Bulldog Distortion: https://rvb-img.reverb.com/i/s--qGOehAJ1--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/u4d7685dbq1ojdc5wvo3.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--qGOehAJ1--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/u4d7685dbq1ojdc5wvo3.jpg`)

These records remain externally referenced until a later cache run succeeds.
