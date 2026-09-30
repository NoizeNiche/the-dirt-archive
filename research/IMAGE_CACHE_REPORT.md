# Pedal Image Cache Report

- Cached in this run: **0**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **6**
- Cleared stale/quarantined local image references: **0**
- Download failures: **2**
- Remaining tracker photo backlog: **201**
- Researched, photo pending: **201**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Still external / failed

- BOSS - MT-2-3A 30th Anniversary Metal Zone: https://rvb-img.reverb.com/image/upload/s--roDGV5Kc--/f_auto%2Ct_large/v1629992328/byqovu79pjwkripuafit.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--roDGV5Kc--/f_auto%2Ct_large/v1629992328/byqovu79pjwkripuafit.jpg`)
- Big Ear NYC - The LOAF Fuzz: https://rvb-img.reverb.com/image/upload/s--lQNVAHuF--/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1428602771/vq1nlfbderqvnfwkyaqi.jpg: curl: (22) The requested URL returned error: 401 (`https://rvb-img.reverb.com/image/upload/s--lQNVAHuF--/a_exif%2Cc_limit%2Ce_unsharp_mask%3A80%2Cf_auto%2Cfl_progressive%2Cg_south%2Ch_620%2Cq_90%2Cw_620/v1428602771/vq1nlfbderqvnfwkyaqi.jpg`)

These records remain externally referenced until a later cache run succeeds.
