# Pedal Image Cache Report

- Cached in this run: **8**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Download failures: **2**
- Remaining tracker photo backlog: **506**
- Researched, photo pending: **506**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Newly cached

- 6 Degrees FX - Rodeo Drive -> `./assets/pedals/6-degrees-fx/rodeo-drive/primary.webp`
- Alexander Pedals - Riff Instant Tone Sanitizer -> `./assets/pedals/alexander-pedals/riff-instant-tone-sanitizer/primary.webp`
- Ampeg - SCR-DI -> `./assets/pedals/ampeg/scr-di/primary.webp`
- Ashdown Engineering - Pro-DI -> `./assets/pedals/ashdown-engineering/pro-di/primary.webp`
- BBE - Blacksmith Distortion -> `./assets/pedals/bbe/blacksmith-distortion/primary.webp`
- BBE - Crusher -> `./assets/pedals/bbe/crusher/primary.webp`
- BBE - Heavy-D -> `./assets/pedals/bbe/heavy-d/primary.webp`
- Baltimore Sonic Research Institute - Maybe The Real Treasure... Fuzz -> `./assets/pedals/baltimore-sonic-research-institute/maybe-the-real-treasure-fuzz/primary.webp`

## Still external / failed

- Ashdown Engineering - AGM PRO-FX Retro Drive: https://www.effectsdatabase.com/misc/ebaytabs/loading.gif: curl: (28) Failed to connect to www.effectsdatabase.com port 443 after 4002 ms: Timeout was reached (`https://www.effectsdatabase.com/misc/ebaytabs/loading.gif`)
- CBS-Arbiter - CBS-Arbiter Fuzz Phazer: https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_001.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/thumbs/arbiter-cbs_fuzzphazer_001.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_01.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/thumbs/arbiter-cbs_fuzzphazer_01.jpg: curl: (22) The requested URL returned error: 404 (`https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_001.jpg`)

These records remain externally referenced until a later cache run succeeds.
