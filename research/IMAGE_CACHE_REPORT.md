# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Cleared stale/quarantined local image references: **0**
- Download failures: **4**
- Remaining tracker photo backlog: **184**
- Researched, photo pending: **184**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- Fjord Fuzz - Odin: https://rvb-img.reverb.com/i/s--0l23tQbo--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/qugfifrwpx3fddpsarwn.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--0l23tQbo--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/qugfifrwpx3fddpsarwn.jpg`)
- Maxon / Nisshin Onpa - ROD881 Real Overdrive / Distortion: https://rvb-img.reverb.com/i/s--rwMbuOdc--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/n5mmwlyoxdasny7pazlu.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--rwMbuOdc--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/n5mmwlyoxdasny7pazlu.jpg`)
- NUX Audio / NUX - DS-3 Classic Distortion: https://rvb-img.reverb.com/i/s--E8ERTpA7--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/smzntlkypakodjdpwyb5.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--E8ERTpA7--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/smzntlkypakodjdpwyb5.jpg`)
- VOX - Bulldog Distortion: https://rvb-img.reverb.com/i/s--qGOehAJ1--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/u4d7685dbq1ojdc5wvo3.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--qGOehAJ1--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/u4d7685dbq1ojdc5wvo3.jpg`)

These records remain externally referenced until a later cache run succeeds.
