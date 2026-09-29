# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **1**
- Local images retained/reorganized: **1**
- Download failures: **2**
- Remaining tracker photo backlog: **213**
- Researched, photo pending: **213**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- Caveman Audio / Skrydstrup - ODR2: https://rvb-img.reverb.com/image/upload/s--AuDad_2_--/f_auto%2Ct_large/v1651422798/ofmra8fmjpzc4jsqx6sy.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--AuDad_2_--/f_auto%2Ct_large/v1651422798/ofmra8fmjpzc4jsqx6sy.jpg`)
- Wampler Pedals - Plextortion: https://rvb-img.reverb.com/i/s--jArsOZgM--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/r91m36n1i7jbspqtildh.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--jArsOZgM--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/r91m36n1i7jbspqtildh.jpg`)

These records remain externally referenced until a later cache run succeeds.
