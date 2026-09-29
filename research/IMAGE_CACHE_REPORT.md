# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Download failures: **2**
- Remaining tracker photo backlog: **203**
- Researched, photo pending: **203**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- Caveman Audio / Skrydstrup - ODR2: https://rvb-img.reverb.com/image/upload/s--AuDad_2_--/f_auto%2Ct_large/v1651422798/ofmra8fmjpzc4jsqx6sy.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--AuDad_2_--/f_auto%2Ct_large/v1651422798/ofmra8fmjpzc4jsqx6sy.jpg`)
- Greer Amps - SOUL THRUST FUZZ UNIT: https://rvb-img.reverb.com/i/s--Wst4sC6H--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain%2Ctrim.top%3D483%2Ctrim.left%3D0%2Ctrim.width%3D3024%2Ctrim.height%3D3032/fqa9nudcxydxsjpbaxyt.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--Wst4sC6H--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain%2Ctrim.top%3D483%2Ctrim.left%3D0%2Ctrim.width%3D3024%2Ctrim.height%3D3032/fqa9nudcxydxsjpbaxyt.jpg`)

These records remain externally referenced until a later cache run succeeds.
