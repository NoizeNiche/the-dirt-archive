# Cross-Builder Exact-Image Audit

> Generated from the current Git tree. This is a **report-only identity audit**. No images were deleted or rewritten.

## Snapshot

- Primary pedal image files: **4185**
- Unique exact Git blob hashes: **3810**
- Duplicate exact-image groups: **186**
- Files participating in duplicate groups: **561**
- Cross-builder duplicate groups: **41**
- Files in cross-builder duplicate groups: **149**

An exact duplicate means multiple `primary.webp` files have identical file bytes and therefore the same Git blob SHA. A cross-builder duplicate is more important for review because the same bytes are currently attached to records under different builder directories.

## Triage rules

1. **Do not delete automatically.** Shared imagery can be legitimate for aliases, reissues, renamed builders, or catalog records that intentionally represent the same physical pedal.
2. **Prioritize cross-builder groups first.** These have the highest probability of a misassigned product photograph.
3. **Verify against Builder + Pedal identity.** A shared photo is acceptable only when the source evidence supports each attached record.
4. **Use provenance, not visual similarity alone.** Check the recorded source URL/page before replacing an image.
5. **After any repair, rerun the exact-image audit and the normal photo content/identity gates.

## Cross-builder groups

### 1. 28 records share one exact image
**SHA:** \`65429b512912e45f08111c062e78066ac11e1d93\`
**Builder directories:** \`6-degrees-fx\`, \`bad-penny-fx\`, \`bjfe-bjf-electronics\`, \`compulsive-audio\`, \`cornerstone-music-gear\`, \`coron\`, \`cranetortoise-by-albit\`, \`crust-pedals\`, \`devi-ever-fx\`, \`greer-amps\`, \`madebymike\`, \`maxon\`, \`pigdog-pedals\`, \`pigtronix\`, \`roger-mayer\`, \`sinvertek\`, \`stomp-under-foot\`, \`tube-works\`, \`universal-amplifier-corp\`, \`vemuram\`, \`vfe-pedals\`

- \`assets/pedals/6-degrees-fx/hyper-catalyst/primary.webp\`
- \`assets/pedals/bad-penny-fx/littlebox-fuzz/primary.webp\`
- \`assets/pedals/bjfe-bjf-electronics/baby-blue-overdrive-bbod/primary.webp\`
- \`assets/pedals/bjfe-bjf-electronics/cliff-hanger/primary.webp\`
- \`assets/pedals/compulsive-audio/face-off-fuzz/primary.webp\`
- \`assets/pedals/compulsive-audio/hair-band-distortion/primary.webp\`
- \`assets/pedals/cornerstone-music-gear/sparkle-dynamic-overdrive/primary.webp\`
- \`assets/pedals/coron/coron-distortion-10/primary.webp\`
- \`assets/pedals/cranetortoise-by-albit/dd-1b-dual-distortion-for-bass/primary.webp\`
- \`assets/pedals/crust-pedals/hudson-broadcast-clone/primary.webp\`
- \`assets/pedals/devi-ever-fx/mirro-safety-bag-fuzz/primary.webp\`
- \`assets/pedals/devi-ever-fx/us/primary.webp\`
- \`assets/pedals/greer-amps/peacemaker/primary.webp\`
- \`assets/pedals/madebymike/rat-muff/primary.webp\`
- \`assets/pedals/maxon/rto700/primary.webp\`
- \`assets/pedals/pigdog-pedals/go/primary.webp\`
- \`assets/pedals/pigtronix/bass-fat-drive/primary.webp\`
- \`assets/pedals/pigtronix/fat-drive/primary.webp\`
- \`assets/pedals/pigtronix/star-eater/primary.webp\`
- \`assets/pedals/roger-mayer/mongoose/primary.webp\`
- \`assets/pedals/sinvertek/n5-distortion/primary.webp\`
- \`assets/pedals/stomp-under-foot/astoria/primary.webp\`
- \`assets/pedals/stomp-under-foot/dirt-preacher/primary.webp\`
- \`assets/pedals/stomp-under-foot/red-menace/primary.webp\`
- \`assets/pedals/tube-works/911-tube-driver/primary.webp\`
- \`assets/pedals/universal-amplifier-corp/astrotone/primary.webp\`
- \`assets/pedals/vemuram/jan-ray-for-tf/primary.webp\`
- \`assets/pedals/vfe-pedals/dragon-hound/primary.webp\`

### 2. 20 records share one exact image
**SHA:** \`2d127bb068beafb6eb4fbe4d00c3403f2f6bd208\`
**Builder directories:** \`baja-tech-custom\`, \`bjfe-bjf-electronics\`, \`build-your-own-clone\`, \`chaser\`, \`collins\`, \`colortone-fx-pedal-tank\`, \`columbus\`, \`commune\`, \`coopersonic\`, \`copper-gear\`, \`cosmosound\`, \`crotronics\`, \`crown\`, \`cruzer-by-crafter\`, \`dwarfcraft-devices\`, \`maxon-nisshin-onpa\`

- \`assets/pedals/baja-tech-custom/da-moaf-deluxe/primary.webp\`
- \`assets/pedals/bjfe-bjf-electronics/arctic-light-fuzz/primary.webp\`
- \`assets/pedals/build-your-own-clone/li-l-fuzz/primary.webp\`
- \`assets/pedals/chaser/hm-3-heavy-metal/primary.webp\`
- \`assets/pedals/collins/cdt-1-distortion/primary.webp\`
- \`assets/pedals/collins/cod-1-pro-over-drive/primary.webp\`
- \`assets/pedals/collins/csd-1-pro-super-dust/primary.webp\`
- \`assets/pedals/colortone-fx-pedal-tank/gainer/primary.webp\`
- \`assets/pedals/columbus/ovd-5-overdrive/primary.webp\`
- \`assets/pedals/commune/senturion-preamp-500/primary.webp\`
- \`assets/pedals/coopersonic/mini-tube-overdrive/primary.webp\`
- \`assets/pedals/copper-gear/brontide-device/primary.webp\`
- \`assets/pedals/copper-gear/distorta-azura/primary.webp\`
- \`assets/pedals/cosmosound/cse-14-distortion-volume/primary.webp\`
- \`assets/pedals/crotronics/firestarter/primary.webp\`
- \`assets/pedals/crown/fw-3-distortion-wah-volume/primary.webp\`
- \`assets/pedals/cruzer-by-crafter/ef-dt-distortion/primary.webp\`
- \`assets/pedals/dwarfcraft-devices/abaddon/primary.webp\`
- \`assets/pedals/maxon-nisshin-onpa/sm-9pro-super-metal-pro/primary.webp\`
- \`assets/pedals/maxon-nisshin-onpa/ssd-9-super-sonic-distortion/primary.webp\`

### 3. 12 records share one exact image
**SHA:** \`83d292cd48a6e6d31f52959ad0322f828148ca51\`
**Builder directories:** \`akai\`, \`bad-cat\`, \`big-ear-nyc\`, \`carlsbro\`, \`collateral-fx\`, \`companion\`, \`coolpedals\`, \`keeley-electronics\`, \`maxon-nisshin-onpa\`, \`nux-audio-nux\`, \`pigtronix\`, \`vox\`

- \`assets/pedals/akai/blues-overdrive/primary.webp\`
- \`assets/pedals/bad-cat/double-drive-stackable-overdrive/primary.webp\`
- \`assets/pedals/big-ear-nyc/more-more-more/primary.webp\`
- \`assets/pedals/carlsbro/suzz-wah-wah/primary.webp\`
- \`assets/pedals/collateral-fx/p031-zeugma-fuzz/primary.webp\`
- \`assets/pedals/companion/fy-6-super-fuzz/primary.webp\`
- \`assets/pedals/coolpedals/steam-machine/primary.webp\`
- \`assets/pedals/keeley-electronics/red-dirt-overdrive/primary.webp\`
- \`assets/pedals/maxon-nisshin-onpa/st-9-super-tube-screamer/primary.webp\`
- \`assets/pedals/nux-audio-nux/ds-3-classic-distortion/primary.webp\`
- \`assets/pedals/pigtronix/polysaturator/primary.webp\`
- \`assets/pedals/vox/bulldog-distortion/primary.webp\`

### 4. 11 records share one exact image
**SHA:** \`f953e00b6eab9a8c2948e5256067388b4e3ea50c\`
**Builder directories:** \`mid-fi-electronics-doug-tuttle\`, \`mid-fi-electronics\`

- \`assets/pedals/mid-fi-electronics-doug-tuttle/fuzz-wall/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/glitch-computer/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/hieracium/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/house-amp/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/peace-gun/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/psych-byke/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/random-number-generator/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/rise-overrun/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/what/primary.webp\`
- \`assets/pedals/mid-fi-electronics-doug-tuttle/yard-sale/primary.webp\`
- \`assets/pedals/mid-fi-electronics/what/primary.webp\`

### 5. 4 records share one exact image
**SHA:** \`4882a7436f6090a2891ed479c21456116f014e79\`
**Builder directories:** \`carlsbro\`, \`colorsound-sola-sound\`

- \`assets/pedals/carlsbro/carlsbro-fuzz/primary.webp\`
- \`assets/pedals/carlsbro/carlsbro-suzz/primary.webp\`
- \`assets/pedals/colorsound-sola-sound/colorsound-supa-wah-fuzz-swell/primary.webp\`
- \`assets/pedals/colorsound-sola-sound/overdriver/primary.webp\`

### 6. 3 records share one exact image
**SHA:** \`97ca02e339804253b487006d8cfe3bd654c7923c\`
**Builder directories:** \`ashdown-engineering\`, \`bixonic\`

- \`assets/pedals/ashdown-engineering/james-lomenzo-hyper-drive/primary.webp\`
- \`assets/pedals/ashdown-engineering/jm-john-myung-double-drive/primary.webp\`
- \`assets/pedals/bixonic/exp2001-expandora-ii/primary.webp\`

### 7. 3 records share one exact image
**SHA:** \`9b5d2fc33b775cb143d98a2d8b031a832e512b7d\`
**Builder directories:** \`bad-penny-fx\`, \`zander-circuitry\`

- \`assets/pedals/bad-penny-fx/fuzz-controller-germanium/primary.webp\`
- \`assets/pedals/bad-penny-fx/morse-fuzz-mini/primary.webp\`
- \`assets/pedals/zander-circuitry/surplus/primary.webp\`

### 8. 2 records share one exact image
**SHA:** \`6b68cac367072c5e60111ff70ba7080fc293bce5\`
**Builder directories:** \`a-da\`, \`ada-amps\`

- \`assets/pedals/a-da/mp-1-channel/primary.webp\`
- \`assets/pedals/ada-amps/mp-1-channel/primary.webp\`

### 9. 2 records share one exact image
**SHA:** \`390a1d59c4fb52443844ba64affe5003dfc7cb72\`
**Builder directories:** \`accel-audio\`, \`clayton\`

- \`assets/pedals/accel-audio/od-ss-express-overdrive/primary.webp\`
- \`assets/pedals/clayton/x-treme-od-160-overdrive/primary.webp\`

### 10. 2 records share one exact image
**SHA:** \`dcc1774d4cb8a51c29f0e5cb0dadab5ed6842aa3\`
**Builder directories:** \`alcove\`, \`clarenzio\`

- \`assets/pedals/alcove/alp-200-overdrive/primary.webp\`
- \`assets/pedals/clarenzio/sp-tnador-overdrive/primary.webp\`

### 11. 2 records share one exact image
**SHA:** \`0f5cc07bc2d308bb0ff6038970bd16dcfdea0a7d\`
**Builder directories:** \`barber-electronics\`, \`bearfoot-fx\`

- \`assets/pedals/barber-electronics/ltd-sr/primary.webp\`
- \`assets/pedals/bearfoot-fx/emerald-green-overdrive/primary.webp\`

### 12. 2 records share one exact image
**SHA:** \`6f6cea06f83511e8acab6f66e47e40bf0007011a\`
**Builder directories:** \`bbe\`, \`boss\`

- \`assets/pedals/bbe/427-distortion/primary.webp\`
- \`assets/pedals/boss/bp-1w-booster-preamp/primary.webp\`

### 13. 2 records share one exact image
**SHA:** \`7b35b0e65bbeb722bf9104c47a0edafa4fcd1164\`
**Builder directories:** \`beetronics-fx\`, \`beetronics\`

- \`assets/pedals/beetronics-fx/octahive-v2/primary.webp\`
- \`assets/pedals/beetronics/octahive-v2-high-octave-buzz/primary.webp\`

### 14. 2 records share one exact image
**SHA:** \`ad96003e8a451f45fc106895e4f36fb9575b3c8f\`
**Builder directories:** \`beetronics-fx\`, \`beetronics\`

- \`assets/pedals/beetronics-fx/royal-jelly/primary.webp\`
- \`assets/pedals/beetronics/royal-jelly-fuzz-od-blender/primary.webp\`

### 15. 2 records share one exact image
**SHA:** \`e7d8a86149e90fc897b09b13ecd9a83f99c4bf80\`
**Builder directories:** \`beetronics-fx\`, \`beetronics\`

- \`assets/pedals/beetronics-fx/tuna-fuzz/primary.webp\`
- \`assets/pedals/beetronics/tuna-fuzz/primary.webp\`

### 16. 2 records share one exact image
**SHA:** \`562bf7ef2601f0fa33e172585b9fa5ae7bc14fb7\`
**Builder directories:** \`beetronics-fx\`, \`beetronics\`

- \`assets/pedals/beetronics-fx/vezzpa-octave-stinger/primary.webp\`
- \`assets/pedals/beetronics/vezzpa-octave-stinger/primary.webp\`

### 17. 2 records share one exact image
**SHA:** \`680d5e74788f4e42753ec926f3739eeb4506b906\`
**Builder directories:** \`big-ear-nyc\`, \`big-ear\`

- \`assets/pedals/big-ear-nyc/black-betty/primary.webp\`
- \`assets/pedals/big-ear/black-betty/primary.webp\`

### 18. 2 records share one exact image
**SHA:** \`7772af51ad59f96095c6ee94a361cb23ad7b485e\`
**Builder directories:** \`chord-by-daphon\`, \`chord-by-tom-s-line\`

- \`assets/pedals/chord-by-daphon/od-50-overdrive/primary.webp\`
- \`assets/pedals/chord-by-tom-s-line/od50-overdrive-distortion/primary.webp\`

### 19. 2 records share one exact image
**SHA:** \`614a5e6e27785d6e79a2a8570ca9452c3825114e\`
**Builder directories:** \`danelectro\`, \`kma-machines\`

- \`assets/pedals/danelectro/eisenhower-fuzz/primary.webp\`
- \`assets/pedals/kma-machines/chief-disruptor/primary.webp\`

### 20. 2 records share one exact image
**SHA:** \`42f6f8017e1c8514fa68d9fa38b7cfd1be96fed8\`
**Builder directories:** \`deadastronautfx\`, \`greer-amps\`

- \`assets/pedals/deadastronautfx/easydriver/primary.webp\`
- \`assets/pedals/greer-amps/ghetto-driver/primary.webp\`

### 21. 2 records share one exact image
**SHA:** \`1c6663c7b3c71afbf67a42bb75745347819ef50c\`
**Builder directories:** \`fjord-fuzz\`, \`stomp-under-foot\`

- \`assets/pedals/fjord-fuzz/odin/primary.webp\`
- \`assets/pedals/stomp-under-foot/silver-foxx/primary.webp\`

### 22. 2 records share one exact image
**SHA:** \`1919e58f147c6553301bc072f40af0395ea33287\`
**Builder directories:** \`ibanez\`, \`vox\`

- \`assets/pedals/ibanez/fz7/primary.webp\`
- \`assets/pedals/vox/v829-tone-bender/primary.webp\`

### 23. 2 records share one exact image
**SHA:** \`cdcdc39228e3d2deefaaa049ba75f0be8a10ad10\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/fuzz-elements-void/primary.webp\`
- \`assets/pedals/maxon/fuzz-elements-void-fv10/primary.webp\`

### 24. 2 records share one exact image
**SHA:** \`ff8bf11fe327694b7ca9f3f46f0fde6356e597ac\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/od-9-pro/primary.webp\`
- \`assets/pedals/maxon/overdrive-pro-plus-od-9pro/primary.webp\`

### 25. 2 records share one exact image
**SHA:** \`488325d5c1d3d54c1bdad316dc9a232fc005bd7f\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/ood-9-organic-overdrive/primary.webp\`
- \`assets/pedals/maxon/organic-overdrive-ood-9/primary.webp\`

### 26. 2 records share one exact image
**SHA:** \`45336fc57bd9ae7274347627eda4e931ac38c28d\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/osd-9-overdrive-soft-distortion/primary.webp\`
- \`assets/pedals/maxon/osd-9/primary.webp\`

### 27. 2 records share one exact image
**SHA:** \`f593dbc0217ba743f7504f6b99ab59d11c4f134c\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/rto700-real-tube-overdrive/primary.webp\`
- \`assets/pedals/maxon/real-tube-overdrive-rto700/primary.webp\`

### 28. 2 records share one exact image
**SHA:** \`28c171401c1d2dd8883c0dc9aba591a02546b804\`
**Builder directories:** \`maxon-nisshin-onpa\`, \`maxon\`

- \`assets/pedals/maxon-nisshin-onpa/tbo-9-true-tube-booster-overdrive/primary.webp\`
- \`assets/pedals/maxon/tbo-9-true-tube-booster-overdrive/primary.webp\`

### 29. 2 records share one exact image
**SHA:** \`2cfbb25088c4a3a3b1090754d4d9fbbd50a11918\`
**Builder directories:** \`nux-audio-nux\`, \`wampler-pedals\`

- \`assets/pedals/nux-audio-nux/tube-man-mkii/primary.webp\`
- \`assets/pedals/wampler-pedals/hot-wired/primary.webp\`

### 30. 2 records share one exact image
**SHA:** \`3c96f7406610e6cc32899bdffa97c9765ae3ee84\`
**Builder directories:** \`orange-amplification\`, \`wampler-pedals\`

- \`assets/pedals/orange-amplification/bax-bangeetar/primary.webp\`
- \`assets/pedals/wampler-pedals/low-blow-bass-overdrive/primary.webp\`

### 31. 2 records share one exact image
**SHA:** \`aeeefc3bfa3f7e74bc671ef43e186b87c3fb6225\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/bd-1-bass-driver/primary.webp\`
- \`assets/pedals/pete-cornish/bd-1/primary.webp\`

### 32. 2 records share one exact image
**SHA:** \`1ec169f281062313881734afb63aad9ce7e7fa5b\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/cc-1-cornish-crunch/primary.webp\`
- \`assets/pedals/pete-cornish/cc-1/primary.webp\`

### 33. 2 records share one exact image
**SHA:** \`4851a220e401c39de30955ce0fad6a078e384824\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/g-2/primary.webp\`
- \`assets/pedals/pete-cornish/g-2/primary.webp\`

### 34. 2 records share one exact image
**SHA:** \`3f8afe08e6783de56d90485e8abf56bc36384d95\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/gc-1-high-gain-crunch/primary.webp\`
- \`assets/pedals/pete-cornish/gc-1/primary.webp\`

### 35. 2 records share one exact image
**SHA:** \`288e001ab8da7642da8a17b65d7da7ae301caa19\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/ng-2/primary.webp\`
- \`assets/pedals/pete-cornish/ng-2/primary.webp\`

### 36. 2 records share one exact image
**SHA:** \`95d874682a08b0e0ba561a2cdee983e05b0305f4\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/ng-3/primary.webp\`
- \`assets/pedals/pete-cornish/ng-3/primary.webp\`

### 37. 2 records share one exact image
**SHA:** \`c8504afffd2fe19b4d2fed5b716ce0a8fe369c03\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/p-2/primary.webp\`
- \`assets/pedals/pete-cornish/p-2/primary.webp\`

### 38. 2 records share one exact image
**SHA:** \`42decdecdcee99456fb55f02640baa110843b344\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/ss-2-soft-sustain/primary.webp\`
- \`assets/pedals/pete-cornish/ss-2/primary.webp\`

### 39. 2 records share one exact image
**SHA:** \`a98dbdb01d112e8707c5d43a9fd8419e53a578cf\`
**Builder directories:** \`pete-cornish-pete-cornish-effects\`, \`pete-cornish\`

- \`assets/pedals/pete-cornish-pete-cornish-effects/ss-3-soft-sustain/primary.webp\`
- \`assets/pedals/pete-cornish/ss-3/primary.webp\`

### 40. 2 records share one exact image
**SHA:** \`a4789eecf8fbe3f66f73c1777f14c969c1399f23\`
**Builder directories:** \`radial-engineering-tonebone\`, \`radial-tonebone\`

- \`assets/pedals/radial-engineering-tonebone/tonebone-classic/primary.webp\`
- \`assets/pedals/radial-tonebone/classic/primary.webp\`

### 41. 2 records share one exact image
**SHA:** \`764e823247e64d67cf3c69ecf14420830531d5c3\`
**Builder directories:** \`suhr\`, \`way-huge\`

- \`assets/pedals/suhr/riot/primary.webp\`
- \`assets/pedals/way-huge/geisha-drive/primary.webp\`

## Notes

The largest cross-builder groups are intentionally surfaced first. Some are likely aliases or rebrands, while others contain visibly unrelated catalog identities and should be investigated before launch.

This report does not replace `scripts/audit-photo-duplicates.py`. That script performs the deeper catalog-aware audit when run against a complete working tree and can add source/provenance flags.

