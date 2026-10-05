# Pedal Image Cache Report

- Cached in this run: **1**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Cleared stale/quarantined local image references: **0**
- Download failures: **2**
- Remaining tracker photo backlog: **7**
- Researched, photo pending: **7**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Newly cached

- Himmelstrutz Elektro Art - GRAMPS+ -> `./assets/pedals/himmelstrutz-elektro-art/gramps-plus/primary.webp`

## Still external / failed

- DeadastronautFX - EasyDriver: https://rvb-img.reverb.com/image/upload/s--kkKiQn1b--/a_0/f_auto%2Ct_large/v1699706749/upuzaowe808hv7yxhbmt.jpg: curl: (22) The requested URL returned error: 401 | https://rvb-img.reverb.com/image/upload/a_0/f_auto%2Ct_large/v1699706749/upuzaowe808hv7yxhbmt.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--kkKiQn1b--/a_0/f_auto%2Ct_large/v1699706749/upuzaowe808hv7yxhbmt.jpg`)
- Greer Amps - Ghetto Driver: https://rvb-img.reverb.com/image/upload/s--DrTC8m0---/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg: curl: (22) The requested URL returned error: 401 | https://rvb-img.reverb.com/image/upload/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--DrTC8m0---/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg`)

These records remain externally referenced until a later cache run succeeds.
