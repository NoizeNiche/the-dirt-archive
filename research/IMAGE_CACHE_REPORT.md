# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **1**
- Local images retained/reorganized: **1**
- Download failures: **1**
- Remaining tracker photo backlog: **1987**
- Researched, photo pending: **69**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- CBS-Arbiter - CBS-Arbiter Fuzz Phazer: https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_001.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/thumbs/arbiter-cbs_fuzzphazer_001.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_01.jpg: curl: (22) The requested URL returned error: 404 | https://files.effectsdatabase.com/gear/thumbs/arbiter-cbs_fuzzphazer_01.jpg: curl: (22) The requested URL returned error: 404 (`https://files.effectsdatabase.com/gear/pics/arbiter-cbs_fuzzphazer_001.jpg`)

These records remain externally referenced until a later cache run succeeds.
