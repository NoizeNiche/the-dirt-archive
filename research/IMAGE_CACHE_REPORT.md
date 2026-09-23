# Pedal Image Cache Report

- Current synchronized tracker photo backlog: **2745**
- Current synchronized researched, photo pending: **200**
- Current runtime external image references: **0**
- Current local catalog image references: **1071**
- Current photo-review queue: **199**
- Deep-review queue: **197**
- Parked queue: **2**
- Verified source images awaiting local caching: **4**
- Last published browser-cache batch: **6**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Verified source leads still awaiting local caching

- Acid Fuzz - Acid Fuzzer MkI
- Barber Electronics - B-Custom Dual Discrete
- BearFoot FX - Bone Bender MKI Fuzz
- BearFoot FX - Honey Bee Overdrive Plus

These four records retain curated source provenance but are **not** runtime-external image references. The next optimized recovery pass should attempt them through the exact-source/direct-image lane.

## Latest published cache batch

- Alber - OD-610 Over Drive -> `./assets/pedals/alber/od-610-over-drive/primary.webp`
- Audile - Bass TOAD - Tone Overdrive And Distortion for Bass -> `./assets/pedals/audile/bass-toad-tone-overdrive-and-distortion-for-bass/primary.webp`
- Axis Guitar Effects - Axis Face MkII -> `./assets/pedals/axis-guitar-effects/axis-face-mkii/primary.webp`
- Bigfoot F.X. - Dynamic Distortion Device -> `./assets/pedals/bigfoot-f-x/dynamic-distortion-device/primary.webp`
- Billionaire (by Danelectro) - Trillion Dollar Fuzz -> `./assets/pedals/billionaire-by-danelectro/trillion-dollar-fuzz/primary.webp`
- Bondi Effects - Del Mar Overdrive mk1 -> `./assets/pedals/bondi-effects/del-mar-overdrive-mk1/primary.webp`

---

## Newly cached

- Alber - OD-610 Over Drive -> `./assets/pedals/alber/od-610-over-drive/primary.webp`
- Audile - Bass TOAD - Tone Overdrive And Distortion for Bass -> `./assets/pedals/audile/bass-toad-tone-overdrive-and-distortion-for-bass/primary.webp`
- Axis Guitar Effects - Axis Face MkII -> `./assets/pedals/axis-guitar-effects/axis-face-mkii/primary.webp`
- Bigfoot F.X. - Dynamic Distortion Device -> `./assets/pedals/bigfoot-f-x/dynamic-distortion-device/primary.webp`
- Billionaire (by Danelectro) - Trillion Dollar Fuzz -> `./assets/pedals/billionaire-by-danelectro/trillion-dollar-fuzz/primary.webp`
- Bondi Effects - Del Mar Overdrive mk1 -> `./assets/pedals/bondi-effects/del-mar-overdrive-mk1/primary.webp`

## Still external / failed

- Acid Fuzz - Acid Fuzzer MkI: https://rvb-img.reverb.com/i/s--OzNunaP3--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/mib1l7tmz6zznki7ukjj.jpg: HTTP Error 500: Internal Server Error (`https://rvb-img.reverb.com/i/s--OzNunaP3--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/mib1l7tmz6zznki7ukjj.jpg`)
- Barber Electronics - B-Custom Dual Discrete: https://rvb-img.reverb.com/i/s--4N0bxT25--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/dgdoay9xz6akmnqmyxvq.jpg: HTTP Error 500: Internal Server Error (`https://rvb-img.reverb.com/i/s--4N0bxT25--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/dgdoay9xz6akmnqmyxvq.jpg`)
- BearFoot FX - Bone Bender MKI Fuzz: https://rvb-img.reverb.com/i/s--6H63sI1H--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/zactb0lkodoygtxa9sjk.png: HTTP Error 500: Internal Server Error (`https://rvb-img.reverb.com/i/s--6H63sI1H--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/zactb0lkodoygtxa9sjk.png`)
- BearFoot FX - Honey Bee Overdrive Plus: https://rvb-img.reverb.com/i/s--LLexNzWV--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/cbp3ifzmgocobxxzp7ph.jpg: HTTP Error 500: Internal Server Error (`https://rvb-img.reverb.com/i/s--LLexNzWV--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/cbp3ifzmgocobxxzp7ph.jpg`)

These records remain externally referenced until a later cache run succeeds.
