# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **1**
- Cleared stale/quarantined local image references: **0**
- Download failures: **2**
- Remaining tracker photo backlog: **8**
- Researched, photo pending: **8**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- Greer Amps - Ghetto Driver: https://rvb-img.reverb.com/image/upload/s--DrTC8m0---/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg: curl: (22) The requested URL returned error: 401 | https://rvb-img.reverb.com/image/upload/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--DrTC8m0---/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1500811013/zj4cfto4lqswik9vhtjg.jpg`)
- Himmelstrutz Elektro Art - GRAMPS+: https://rvb-img.reverb.com/image/upload/s--yHQ-FIsQ--/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1478883758/yznbt2yrnvqrc2gf7veb.jpg: curl: (22) The requested URL returned error: 401 | https://rvb-img.reverb.com/image/upload/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1478883758/yznbt2yrnvqrc2gf7veb.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--yHQ-FIsQ--/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1478883758/yznbt2yrnvqrc2gf7veb.jpg`)

These records remain externally referenced until a later cache run succeeds.
