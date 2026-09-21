## Landing-page count checkpoint - September 21, 2026

The landing-page “All builders” count now respects the active search term as well as the selected dirt type. The browser audit now checks that the filtered All-builders count remains consistent with the rendered search results.

Latest checkpoint: **4f12fca0f247d9a70f6cee9c3fe07cd2f8e81f3**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Deployment trigger checkpoint - September 21, 2026

Deployment now watches `scripts/deploy-browser-audit.js`, `scripts/serve-static.js`, `scripts/live-photo-audit.js`, and `scripts/validate-archive.py`. The structural validator also requires those operational scripts to appear in the deployment trigger list, preventing CI behavior changes from being silently ignored.

Latest checkpoint: **fd88a46f98040e0f8803562896a427df7881d1d5**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Pedal detail pages now show the actual builder name in the builder line. The deployment browser audit verifies that the rendered builder matches the catalog entry used to open the page.

Latest UI checkpoint: **a27aebf8c651a0446fc9502705577bd604c20b48**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Colorway selection now uses CSS classes rather than inline JavaScript styling. Selected colorways expose `aria-pressed="true"`, and the browser audit verifies that a variation deep-link selects the requested colorway correctly.

Latest UI checkpoint: **c66a4c3c5267760498251c0673a7701523471f3c**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI maintenance checkpoint - September 21, 2026

Detail-page photo presentation is now owned by `assets/css/archive-detail.css` rather than inline styles inside the JavaScript renderer. Photo load failures remain handled by the detail controller, while the validator now rejects inline style attributes in `archive-detail.js`.

Latest maintenance checkpoint: **8d79e5ce7f5d21b6e096a17079beefce17c482d2**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site UI checkpoint - September 21, 2026

Fixed the detail-page builder navigation so only the actual builder is highlighted. Catalog card photos now use a contained presentation so the whole pedal remains visible instead of being cropped. Added a browser-audit regression check for the builder selection state.

Latest UI checkpoint: **879ab391e996e1d3e4e0792a9a082269e082b0d7**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site architecture checkpoint - September 21, 2026

The deployment audit server is now owned by `scripts/serve-static.js` instead of being embedded in the GitHub Actions workflow. The workflow calls the script, the structural validator requires it and checks its syntax, and deployment watches the script for changes. This removes another duplicated CI-side implementation and keeps the site's operational ownership explicit.

Latest architecture commits: **4a9e37f02edba5da7ef3b13851cdb4a59e473222**, **832dd56be9eb1d18c15671f089099628875c86e8**, and **792393ceaa68365ea6ef32e506c5efc4978b2df1**.

Photo recovery remains the active gate at the latest verified **378 researched-photo-pending** records. PRP1 remains gated until that reaches **0**.

---

## Site maintenance checkpoint - September 21, 2026

The latest mainline maintenance work is now committed at **20bb9c998c9714994bfdb4bbd7535eca5f69a523**. The individual pedal page research loader now uses a more reliable request path with retries, research-record paths are normalized safely, and the browser audit can serve local research markdown during its test run.

The photo-recovery gate remains active at the latest verified state of **378 researched-photo-pending** records. PRP1 remains gated until the photo backlog reaches zero.

---

## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,273 researched / 896 pictured / 896 fully complete / 377 researched-photo-pending / 2,923 photo-missing overall**.

The previous pass briefly archived an image under Godeater+, but identity review showed that image was the original Godeater. That incorrect asset has been removed. Godeater+ is back in the exact-photo recovery queue with its verified Reverb source page.

The photo-review queue is now **404 records**: **8 DEEP_REVIEW**, **395 PARKED**, and **1 PHOTO_NEEDED**. The automatic recovery lane remains active, with exact-model identity checks now preserving meaningful symbols such as .

PRP1 remains gated until **researched-photo-pending reaches 0**. Public pedal pages continue to hide Research confidence and Sources checked. The future YouTube demo widget remains deferred until the photo catch-up is complete.

---



## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 873 pictured / 873 fully complete / 401 researched-photo-pending**.

The latest completed browser recovery pass recovered **5 exact-model candidates** and published **3 new local canonical photo assets**. The internal photo-review queue is now **427 records**, including **141 parked** cases. PRP1 remains gated until the researched-photo-pending count reaches **0**.

The recovery pass also incorporated stronger exact source-page leads for stubborn records including **Bad Cat X-Treme Tone, Big Ear NYC The LOAF Fuzz, Black Arts Toneworks LSTR, and Caline CP-74 Action Replay**. A lead remains only a lead until the exact image is successfully archived locally.

---

## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 870 pictured / 870 fully complete / 404 researched-photo-pending**.

The latest completed cache pass is commit **dcc54327deab996fdf16a4d56fd7314b06326d87**. The live tracker and catalog now agree at 870 pictured and 404 researched-photo-pending. The internal photo-review queue contains 432 remaining review records.

PRP1 remains gated until the researched-photo-pending count reaches **0**. Local photo references are currently structurally complete, with no declared local path pointing at a missing file.

---
## Photo Recovery Checkpoint - September 21, 2026 (latest verified)

Verified tracker state: **3,819 total / 1,274 researched / 869 pictured / 869 fully complete / 405 researched-photo-pending**.

The live tracker is authoritative. The photo-recovery lane remains active and PRP1 remains gated until the researched-photo-pending count reaches **0**. The repository currently has **0 missing local image references** among declared local photo assets.

The permanent PRP rulebook and archive governance documents were cleaned so historical batch logs remain history rather than acting as current instructions.

---
## Photo source seeding pass - September 21, 2026

Seeded verified exact-model photo source pages into both `research/PEDAL_INDEX.json` and `research/pedals/PEDAL_IMAGES.json` for **Big Ear - Slice of Pie; Big Ear NYC - Black Betty; Big Ear NYC - Frank; Big Game Pedals - Bedlam Drive III; BIXONIC - AXENTRIX II; and BIXONIC - EXP2000DR**. These records remain photo-pending until the local cache workflow successfully archives the image. The six references were checked against the exact catalog identities and kept separate by Builder + Pedal.

## Photo Recovery / Architecture Checkpoint — September 21, 2026

## Photo recovery scheduler maintenance - September 21, 2026

The browser recovery queue was tightened so each bulk photo pass reserves up to **15 of its available slots for the highest-attempt deep-review cases**. Previously, a full batch of ordinary unresolved records could consume the entire run before hard cases were revisited. The remaining slots continue to prioritize the normal unresolved backlog. This keeps difficult records moving without allowing them to starve the rest of the photo catch-up.

Current verified tracker state: **3,819 total / 1,274 researched / 866 pictured / 866 fully complete / 408 researched-photo-pending**.

The photo cache successfully completed its bounded recovery pass. **Cause & Effect Pedals (CE Pedals) - FET Dream** was recovered and its archived local asset is now present; the repository has **0 missing local image references**.

PRP1 is intentionally gated until the researched-photo-pending count reaches **0**.

Latest maintenance commits:
- `51cf11e4eae0a662f708d62c1db1f56a21158469` cleared the stale FET Dream local-photo declaration.
- `b5a9837eac2de3f195cdba57c8b69903f2e1b818` completed the prior bounded cache pass and synchronized tracker/photo-review state.
## Architecture Hardening Checkpoint - September 21, 2026

Maintenance work consolidated the site's under-the-hood ownership model and removed overlapping automation. The public catalog remains the single runtime data source; research records, photo assets, tracker state, and synchronization scripts each have distinct responsibilities.

A stale local photo declaration for **Cause & Effect Pedals (CE Pedals) - FET Dream** exposed the intended behavior: validators now stop deployment rather than silently serving a broken local path, while the photo-recovery system is responsible for repairing or triaging the record.

Latest architecture hardening commit: `95f83e4a8733908ebda3fe19d1d43a95eb15a45f`.

Continue from the current top checkpoint below after repository inspection.


## PRP1 Batch 158 checkpoint — September 20, 2026

Batch 158 advanced **10 consecutive exact-order research records**: **Catalinbread Effects - Maxon 40th Anniversary Catalinbread Modified Overdrive (OD808-40C); Merkin Fuzz; Misnomer; Misnomer (Cabinet Series); Naga Viper; Perseus DIO; Perseus DIO (dry distortion section only; octave-down function excluded from census categorying); RAH; Sabbra Cadabra; and SFT**.

All ten now have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. The OD808-40C now also carries a verified exact-model image source URL for the local photo-cache workflow. No photo is counted until the cache workflow archives the image under the canonical local pedal path.

**Verified tracker totals after this batch:** **3,821 total / 1,249 researched / 314 pictured / 314 fully complete / 3,507 incomplete / 935 researched-photo-pending**.

**Next exact-order research target:** **Catalinbread Effects - SideArm Overdrive**.

**Public data version:** **2026-09-20-prp1-batch-158**.

## PRP1 Batch 157 checkpoint — September 20, 2026

Batch 157 advanced **10 consecutive exact-order research records**: **Catalinbread Effects - Galileo 4K; Galileo Red Special; Giygas 2K Fuzz; Karma Suture GE; Katzenkönig; Knight School Fuzz; Knight School Overdrive; Knightdrive; Little Secret; and Manx Loaghtan Fuzz**.

All ten now have Pedal Info research records synchronized into the canonical index, photo/research manifest, and PRP tracker. During this checkpoint, the automated photo cache independently archived five exact images from the preceding Catalinbread pass. Those verified photo gains are preserved.

**Verified tracker totals:** **3,821 total / 1,239 researched / 314 pictured / 314 fully complete / 3,507 incomplete / 925 researched-photo-pending**.

**Next exact-order research target:** **Catalinbread Effects - Maxon 40th Anniversary Catalinbread Modified Overdrive (OD808-40C)**.

**Public data version:** **2026-09-20-prp1-batch-157**.

# The Dirt Archive - Research Breadcrumb

## PRP1 Batch 155 checkpoint — September 20, 2026

Batch 155 advanced **10 consecutive exact-order research records**: **Cat's Eye ESP - Hop Hed Fuzztone; Hybrid Fuzz; Mista' Fuzz; Mutha' Fuzz; Catalinbread Effects - Airstrip Console Pre; Antichthon; Carbide Distortion; Clean Little Secret; Crooner Preamp; and Dirty Little Secret**.

All ten have individual Pedal Info records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Cat's Eye ESP documentation is based on surviving Effects Database records plus exact-model used listings where available. Catalinbread records use current official product pages plus historical coverage where version history matters. No picture is counted until image-cache confirms and archives an exact asset.

**Verified tracker totals:** **3,821 total / 1,219 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 910 researched-photo-pending**.

**Next exact-order research target:** **Catalinbread Effects - Dirty Little Secret Deluxe**.

**Public data version:** **2026-09-20-prp1-batch-155**.


## PRP1 Batch 154 checkpoint — September 20, 2026

Batch 154 advanced **10 consecutive exact-order research records**: **Caswell Modern Electronics (CME) - Boost 90 Clean Drive; Boost 98 Bass Drive; Shark Mouth - Bass Synth Fuzz; Cat Box Customs - Bean Machine; Bean Machine V2; Fuzz Club; CAT Sound - Classic; Dancing - Distortion; DriveCenter; and DriveCenter Bass**.

All ten have individual Pedal Info records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. The Caswell records use surviving contemporary reviews and Effects Database documentation, Cat Box Customs uses detailed builder/reviewer coverage, and the older CAT Sound models are documented conservatively from Effects Database catalog pages because those pages expose little technical detail. No picture is counted until the image-cache workflow confirms and archives an exact asset.

**Verified tracker totals:** **3,821 total / 1,209 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 900 researched-photo-pending**.

**Next exact-order research target:** **Cat's Eye ESP - Hop Hed Fuzztone**.

**Public data version:** **2026-09-20-prp1-batch-154**.


## PRP1 Batch 153 checkpoint — September 19, 2026

Batch 153 advanced **10 consecutive exact-order research records**: **Casey Gooby - Bag Of Dicks; Casey Gooby - Organ Donor; Casimir Effects Pedals - Entropy Fuzz; CAST Engineering - Gypsy Haze; CAST Engineering - Mike Zito Peace Drive; CAST Engineering - Texas Flood; CastleRock - CastleRock Bass Overdrive; CastleRock - CastleRock Distortion; CastleRock - CastleRock Metal Driver; and CastleRock - CastleRock Overdrive**.

All ten have individual Pedal Info records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Historical catalog sources were used for the older Casey Gooby, Casimir, CAST Engineering, and CastleRock records. No picture is counted until the image-cache workflow confirms and archives an exact asset.

**Verified tracker totals:** **3,821 total / 1,199 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 890 researched-photo-pending**.

**Next exact-order research target:** **Caswell Modern Electronics (CME) - Boost 90 Clean Drive**.

**Public data version:** **2026-09-19-prp1-batch-153**.


## PRP1 Batch 152 checkpoint — September 19, 2026

Batch 152 advanced **10 consecutive exact-order research records**: **Carruthers - Dyna-Soar; Carruthers - Dyna-Soar Lite; Carvin - Carvin TO-1 Tube Overdrive; Carvin - Carvin UD-1 Ultra Distortion; Carvin - Carvin VLD1 Steve Vai Legacy Drive Preamp; Cascade Pedals - Hosstortion; Case Study Effects Co. - Aspen One - Boost + Overdrive; Case Study Effects Co. - Aspen Overdrive; Case Study Effects Co. - Germanium Aspen Overdrive; and Case Study Effects Co. - Lastlight Overdrive**.

All ten have individual Pedal Info records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Historical and scarce Carruthers documentation is treated cautiously, and the Carvin/Case Study entries distinguish manufacturer documentation from surviving used-market descriptions. Source pages were attached to the image manifest so the browser image-cache workflow can attempt exact visual recovery. No picture is counted until the cache workflow confirms and archives an exact asset.

**Verified tracker totals:** **3,821 total / 1,189 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 880 researched-photo-pending**.

**Next exact-order research target:** **Casey Gooby - Bag Of Dicks**.

**Public data version:** **2026-09-19-prp1-batch-152**.


## PRP1 Batch 151 checkpoint — September 20, 2026

Batch 151 advanced **10 consecutive exact-order research records**: **Caroline Guitar Company - Haymaker; Icarus V2; Icarus V2 / Icarus; Olympia; Shigeharu; The Blues; Wave Cannon / Cannonball; Wave Cannon MKII; Wave Cannon MKII / Superdistorter; and Wave Cannon Zero**.

All ten have individual Pedal Info records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. The research pass keeps ambiguous family naming and historical special editions separate rather than inventing hardware relationships. No exact photo asset was promoted to a local archive asset in this pass, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**.

**Verified tracker totals:** **3,821 total / 1,179 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 870 researched-photo-pending**.

**Next exact-order research target:** **Carruthers - Dyna-Soar**.

**Public data version:** **2026-09-19-prp1-batch-151**.


## PRP1 Batch 150 checkpoint — September 20, 2026

Batch 150 advanced **10 consecutive exact-order research records**: **Carl Martin - TOD; Carlin - Carlin Compressor/Fuzz; Carlsbro - Carlsbro Fuzz; Carlsbro - Carlsbro Fuzz-Tone; Carlsbro - Carlsbro Suzz; Carlson - E20MT Heavy Metal; Carmedon Electronics - Alpha Centauri; Caroline Guitar Company - Aaron Graves Overdrive; Caroline Guitar Company - CROM; and Caroline Guitar Company - Hawaiian Pizza**.

All ten Pedal Info records are synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Historical variants and later reissues are kept separate where appropriate. Sparse or uncertain historical records are explicitly documented as such rather than inferred from related brands or circuits.

**Verified tracker totals:** **3,821 total / 1,169 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 860 researched-photo-pending**.

**Next exact-order research target:** **Caroline Guitar Company - Haymaker**.

**Public data version:** **2026-09-19-prp1-batch-150**.


## PRP1 Batch 149 checkpoint — September 20, 2026

Batch 149 advanced **10 consecutive exact-order research records**, all within **Carl Martin**: **DC-Drive; Greg Howe's Lick Box; Heavy Drive; Panama; PlexiRanger; PlexiTone; PlexiTone Lo-Gain; PlexiTone Single; Purple Moon; and The Fuzz**.

All ten have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Current Carl Martin product documentation was used for the modern compact models and technical specifications; older/current product pages were used for the remaining Plexi and fuzz identities. No unsupported component claims were added where Carl Martin does not document them.

**Verified tracker totals:** **3,821 total / 1,159 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 850 researched-photo-pending**.

**Next exact-order research target:** **Carl Martin - TOD**.

**Public data version:** **2026-09-19-prp1-batch-149**.


## PRP1 Batch 148 checkpoint — September 19, 2026

Batch 148 advanced **10 consecutive exact-order research records**: **Canned Monsters - Moonbark Overdrive MK2; Canvas Analog Devices - The Metamorphosis; Captain FX - Yeti Fuzz; Carcharias Effects - Uncle 125 Bass Overdrive; Carella Guitars - Kung Fuzz; Leopard; Overdistover; Overtube; Real Tube; and Carl Martin - AC-Tone Single**.

All ten now have individual Pedal Info research records synchronized into the canonical PRP layer. Exact source/photo pages were captured where evidence was available, including Canned Monsters, Reverb, Effects Database, Carella historical/retail records, and current Carl Martin documentation. No questionable image was promoted directly; the local photo cache workflow remains responsible for verified archival recovery.

**Verified tracker totals:** **3,821 total / 1,149 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 840 researched-photo-pending**.

**Next exact-order research target:** **Carl Martin - DC-Drive**.

**Public data version:** **2026-09-19-prp1-batch-148**.


## PRP1 Batch 147 checkpoint — September 19, 2026

Batch 147 advanced **10 consecutive exact-order research records**: **Cameltone Electronics - Freak Scene; The Nard; Camuro - Baci Overdrive/Distortion; Caboolture Twin-Stage Overdrive; FAT BABY Preamp/Overdrive; Fuzz Rosso; hachi “8” Classic Modern Fuzz/Bosster; Naked Machine; Naturale; and Canned Monsters - Frenzy Moss**.

All ten now have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model source/photo pages were captured for the batch where evidence was available, including Cameltone/Reverb records, Camuro's official product pages, and the Canned Monsters Effects Database/Reverb records. No remote source image was promoted to a local catalog asset in this pass, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**.

During tracker reconciliation, **14 malformed 8-column rows were normalized** and **69 stale PRP Complete flags were corrected** so PRP Complete is now derived from the two required inputs: Pedal Info = DONE and Picture = DONE.

**Verified tracker totals:** **3,821 total / 1,139 researched / 309 pictured / 309 fully complete / 3,512 incomplete / 830 researched-photo-pending**.ncomplete / 839 researched-photo-pending**.

**Next exact-order research target:** **Canned Monsters - Moonbark Overdrive MK2**.

**Public data version:** **2026-09-19-prp1-batch-147**.


## PRP1 Batch 146 checkpoint — September 19, 2026

Batch 146 advanced **4 exact-order research records**: **Caline - G-001 Tiger Eye Distortion; G-002 Green Mamba Overdrive; G-014 Nasty Bear Fuzz; and Cameltone Electronics - Big Stuff**.

All four have individual Pedal Info research records synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source pages were captured for all four; current image search also returned exact-model imagery for G-001, G-002, G-014, and multiple Big Stuff examples. No source-only image was promoted to a local catalog asset in this pass, so all four remain **Picture: NEEDED**.

**Verified tracker totals:** **3,821 total / 1,126 researched / 303 pictured / 369 complete / 3,451 incomplete / 826 researched-photo-pending**.

**Next exact-order research target:** **Cameltone Electronics - Fuzz Face**.

**Public data version:** **2026-09-19-prp1-batch-146**.


## PRP1 Batch 145 checkpoint — September 19, 2026

Batch 145 advanced **8 consecutive exact-order research records**: **Caline - DCP-02 Brutus; DCP-04 Easy Driver; DCP-05 Key West; DCP-06 Sundance Special; DCP-07 Brigade; DCP-08 Nightwolf; DCP-09 Tiger Shark; and DCP-11 Andes**.

All eight have individual Pedal Info research records synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source pages were captured for all eight, including current exact-model imagery for Brutus, Easy Driver, Key West, Sundance Special, Brigade, Nightwolf, and Tiger Shark. No source-only image was promoted to a local asset during this pass, so all eight remain **Picture: NEEDED**.

**Verified tracker totals:** **3,821 total / 1,122 researched / 303 pictured / 365 complete / 3,455 incomplete / 822 researched-photo-pending**.

**Next exact-order research target:** **Caline - G-001 Tiger Eye Distortion**.

**Public data version:** **2026-09-19-prp1-batch-145**.


## PRP1 Batch 144 checkpoint — September 19, 2026

Batch 144 advanced **4 consecutive exact-order research records**: **Caline - CP-79 Wolf Pack / King Of Ga-Ga - Boost/Overdrive; CP-82 The Broadsword Bass Fuzz + Boost; CP-84 Honeycomb Tone - Overdrive; and CP-99 Medusa - Overdrive**.

All four have individual Pedal Info research records synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source pages were captured for all four. The CP-82 source exposed a direct image URL, but the remote asset could not be downloaded reliably during this pass, so it was not promoted to a local catalog asset. All four remain **Picture: NEEDED**.

**Verified tracker totals:** **3,821 total / 1,114 researched / 303 pictured / 357 complete / 3,463 incomplete / 814 researched-photo-pending**.

**Next exact-order research target:** the first remaining Caline row after CP-99, then continuing in tracker order.

**Public data version:** **2026-09-19-prp1-batch-144**.



## PRP1 Batch 143 checkpoint — September 19, 2026

Batch 143 advanced **8 consecutive exact-order research records**: **Caline - CP-68 Distortion + Delay; CP-69 High Peak Distortion; CP-70 High Chief - Crushing Overdrive; CP-74 Action Replay - Dyna Red Distortion; CP-75 Emerald Night - Overdrive; CP-76 Captain Silver Overdrive; CP-77 Bounty Hunter - Heavy Metal; and CP-78 Red Thorn Distortion**.

All eight have individual Pedal Info research records synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source pages were captured for all eight, but no source-only image was promoted to a local catalog asset, so all eight remain **Picture: NEEDED**.

**Verified tracker totals:** **3,821 total / 1,110 researched / 303 pictured / 353 complete / 3,467 incomplete / 810 researched-photo-pending**.

**Next exact-order research target:** **Caline - CP-79 Wolf Pack / King Of Ga-Ga - Boost/Overdrive**.

**Public data version:** **2026-09-19-prp1-batch-143**.


## PRP1 Batch 142 checkpoint

Batch 142 completed the next ten exact-order records: **Caline - CP-504 M:Fuzz; CP-509 Stack Attack - Preamp Overdrive & Compressor; CP-510 Jaguar - Classic High Gain Distortion; CP-511 Enchanted Tone - Highly Prized Overdrive; CP-515 Carmilla - Hi Gain Distortion Machine; CP-516 Orange Burst; CP-53 Fuzzy Faace - Voodoo Octave; CP-54 The Big Orange - Crushing Overdrive; CP-56 Midlander / The Mayday - AC Tone; and CP-65 Bass Over Drive**. Each received an individual Pedal Info research record, canonical index entry, tracker synchronization, and photo-manifest entry. Exact-model source imagery was located for the block, but no local image was promoted without the archive cache step.

Verified tracker state after Batch 142:
- Unique pedals: **3821**
- Researched: **1102**
- Confirmed pictures: **303**
- Fully complete: **345**
- Incomplete: **3475**
- Researched but waiting for a confirmed picture: **802**
- Current exact-order target: **Caline - CP-68 Distortion + Delay**

Continue straight down the canonical catalog from that target.


## PRP1 Batch 141 checkpoint

Batch 141 completed the next ten exact-order records: **Caline - CP-34 Headroom - Vintage Distortion; CP-42 Candy Floss Fuzz; CP-43 Pegasus; CP-46 Fuzzy Bear; CP-49 Midlander; CP-50 Central Station / Leon Drive; CP-501 Osmium - High-Gain Distortion; CP-501S Sathanas Distortion; CP-502 Mellow Drive; and CP-503 Queen Bee Overdrive**. Each received an individual Pedal Info research record, canonical index entry, tracker synchronization, and photo-manifest entry. Exact-model source imagery was located across the pass, but no direct image file was promoted to the local archive without the required cache step.

Verified tracker state after Batch 141:
- Unique pedals: **3821**
- Researched: **1092**
- Confirmed pictures: **303**
- Fully complete: **335**
- Incomplete: **3485**
- Researched but waiting for a confirmed picture: **792**
- Current exact-order target: **Caline - CP-504 M:Fuzz**

Continue straight down the canonical catalog from that target.


## PRP1 Batch 140 checkpoint

Batch 140 completed the next ten exact-order records: **Caline - CP-11 Puffer Fuzz; CP-12 Pure Sky; CP-15 Tantrum / Heavy Metal; CP-18 Orange Burst / Overdrive; CP-20 Crazy Cacti; CP-21 Rock Face; CP-25 Highway Man OD; CP-27 Sand Storm; CP-30 Red Devil - Heavy Metal; and CP-32 Clear Veil**. Each received an individual Pedal Info research record, canonical index entry, tracker synchronization, and photo-manifest entry. Exact-model source imagery was located across the pass, but no direct image file was promoted to the local archive without the required cache step.

Verified tracker state after Batch 140:
- Unique pedals: **3821**
- Researched: **1082**
- Confirmed pictures: **303**
- Fully complete: **325**
- Incomplete: **3495**
- Researched but waiting for a confirmed picture: **782**
- Current exact-order target: **Caline - CP-34 Headroom - Vintage Distortion**

Continue straight down the canonical catalog from that target.


## PRP1 Batch 139 checkpoint

Batch 139 completed the next five exact-order records: **Calangary Pedals - Zaladin Fuzz; California (by Eleca) - CDT-1 Distortion; CHM-1 Heavy Metal; COD-1 Over Drive; and California Valveworks - The Bone Tender**. Each received an individual Pedal Info research record, canonical index entry, tracker synchronization, and photo-manifest entry. No exact photo was promoted in this pass; manufacturer/source-page imagery was retained as provenance for future local archival recovery.

Verified tracker state after Batch 139:
- Unique pedals: **3821**
- Researched: **1072**
- Confirmed pictures: **303**
- Fully complete: **315**
- Incomplete: **3505**
- Researched but waiting for a confirmed picture: **772**
- Current exact-order target: **Caline - CP-11 Puffer Fuzz**

Continue straight down the canonical catalog from that target.


## PRP1 Batch 138 checkpoint

Batch 138 completed the next five exact-order records: **Cajita Stompboxes - Preamp 5150 tipo Peavey; Preamp Overdrive Matchbox; TS09 TS08 Overdrive Tube Screamer; VMT Distorsion de Bajo con Blend; and Calangary Pedals - Kalagondang Fuzz**. Each received an individual research record, canonical index entry, tracker synchronization, and photo-manifest entry. No exact photo was promoted in this pass.

Verified tracker state after Batch 138:
- Unique pedals: **3,821**
- Researched: **1,067**
- Confirmed pictures: **303**
- Fully complete: **310**
- Incomplete: **3,511**
- Researched but waiting for a confirmed picture: **767**
- Current exact-order target: **Calangary Pedals - Zaladin Fuzz**

Continue straight down the canonical catalog from that target.

## PRP1 Batch 137 checkpoint

Batch 137 completed the next five exact-order Cajita Stompboxes records: **FBASSDRIVE; Fuzz RBmuff - TBmuff; Fuzz Womut; Overdrive Bb.pre; and Overdrive Shoc más booster**. Each received an individual research record, the canonical public index was synchronized, the PRP tracker was marked Pedal Info complete, and the photo manifest was synchronized. No exact photo was promoted for these five, so they remain photo-pending.

Verified tracker state after the batch:
- Unique pedals: **3,821**
- Researched: **1,062**
- Confirmed pictures: **303**
- Fully complete: **305**
- Incomplete: **3,516**
- Researched but waiting for a confirmed picture: **762**
- Current exact-order target: **Cajita Stompboxes - Preamp 5150 tipo Peavey**

The next PRP pass must continue directly from that target.

## Checkpoint
September 18, 2026

## Active mission
**Company -> Pedal -> Pedal Info -> Photo**

That is the website's entire information structure. Keep collecting companies and the pedals they make, then add pedal information and pedal photos to those records.

## Current catalog
`research/MASTER_PEDAL_CENSUS.csv` is the accumulated pedal catalog currently used by the website.

Current master-catalog checkpoint:
- **2,466 company/pedal/type rows** are currently consolidated in the primary census
- **103 companies** are currently represented by pedal entries
- Block 162 contributed **111 rows** to the Scrape B census
- Block 163 contributed **16 rows** to the Scrape B census
- Blocks 164-217 are stored in the active Scrape C census
- Blocks 162-163 are consolidated into `research/SCRAPE_B_CENSUS.csv`

Current Builder -> Pedals research checkpoint:
- **502 canonical builder identities are in the master index through Block 218**
- **Block 161 added 9 new canonical identities, Block 162 added 9, Block 163 added 5, and Block 164 added 10**
- Existing builders are expanded under their existing canonical identities rather than duplicated
- **216 live research blocks** are now present: Blocks 001-069, 071-141, and 143-215
- Block 070 is absent; Block 142 was removed as a duplicate

The website uses `research/PEDAL_INDEX.json` as its public runtime catalog source. Research blocks remain working material and are not part of page rendering.

## Block 215
Batch 215 staged 350 raw records across 17 builders; 348 net new live rows remain after cleanup, moving the live alphabetic checkpoint from Empress Effects through JHS Pedals. Canonical builder IDs 494-495 were added for J. Rockett Audio Designs and Jackson Audio.

The active Scrape C census now contains **2681 company/pedal/type rows** across 290 builder identities represented in the live working layer.

## Block 216
Batch 216 added 26 builders and 591 net-new company/pedal/type rows, moving the active checkpoint from JHS Pedals through Phaez Amplification. Canonical builder IDs 496-502 were added for Katanasound, KMA Machines, Leqtique, Limetone Audio, Organic Sounds, Ovaltone, and Phaez Amplification.

## Block 218
Batch 218 continued the alphabetic scrape from Vemuram through ZVEX Effects, covering 12 builders and adding 319 net-new company/pedal/type rows. The 502-builder canonical index was expanded rather than duplicated. The active checkpoint is now after ZVEX Effects.

## Block 217
Batch 217 added 17 builders and 308 net-new company/pedal/type rows, moving the active alphabetic checkpoint from Phaez Amplification through ThorpyFX. No new canonical builder identity was required.

## Website state

index.html is the working public catalog page.

The individual pedal page benchmark is the current DRV page:
- permanent left-side archive navigation
- Archive Home
- search
- Dirt Type choices
- scrollable alphabetical builder list
- pedal name and builder
- pedal information as the main content
- dedicated 3:4 photo area
- No Photo Archived when an exact photo is not confirmed
- clean desktop and mobile behavior

Public pedal pages do not show:
- Research confidence
- Photo
- Sources checked

The main catalog now renders the first 72 matching cards at a time and uses Load More for larger result sets, so filtering/search does not rebuild thousands of card elements at once.


## Site architecture checkpoint — September 18, 2026

PRP is paused while the site foundation is audited. Do not continue pedal research until the core catalog/data relationships and page behavior are reliable.

Current architecture decisions:
- Main archive shows one card per pedal model or materially distinct public version.
- Colorways/cosmetic variations live inside their parent model/version and do not become separate main cards.
- V2-style materially different versions can have their own page and can be linked from the parent page.
- Primary photos live in PEDAL_INDEX.json for public runtime use.
- Colorway galleries and future best-demo links are optional structured metadata.
- The individual pedal page remains simple and approachable.
- Future PRP2 depth is deferred.
- Site cache/version marker is `2026-09-18-site-architecture-004` for the current visual/functionality pass.


## Current PRP checkpoint

- Unique pedals in website catalog: 3,821,821
- Pedals with research information: 243
- Pedals with confirmed pictures: 167
- Fully complete PRP pedals: 167
- Remaining incomplete pedals: 3654
- Researched but waiting only for a confirmed picture: 76
- PRP status: Active, PRP1 photo-recovery pass
- Current PRP1 target: **Alen Geere - Crown Centaur**

PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for **ADA Amps - MP-1 Channel** and eight **Add+ Pedals** products. An exact Effects Database photo was archived for **Add+ Pedals - Blues Player**. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.

## Current PRP data files

research/PEDAL_INDEX.json
- single pedal lookup file used by the website

research/pedals/PEDAL_IMAGES.json
- picture and research-record connections

research/PRP_TRACKER.csv
- one row per unique Builder + Pedal
- Pedal Info status
- Picture status
- PRP Complete status

research/PRP_RULES.md
- permanent PRP operating rules

## Resume instructions

At the start of the next PRP session:
1. Read START_HERE.md.
2. Read ARCHIVE_GOVERNANCE.md.
3. Read CURRENT_STATE.md.
4. Read research/BREADCRUMB.md.
5. Read research/PRP_RULES.md.
6. Read research/PRP_TRACKER.csv.
7. Inspect the actual repository.
8. Find the first incomplete pedal in website order.
9. Work the next 10.
10. Recheck every new record, picture connection, tracker row, and website connection before publishing.

Do not resume from conversation memory when the repository says otherwise.

## Publishing

`.github/workflows/deploy-pages.yml` is the website's automatic publishing system.

A PRP batch is not considered live until the GitHub Pages publishing run succeeds. The current site-functionality commit is `a9573f127c35d5c9f1eb97ca7f39065874300c16`; its Pages run is currently in progress and must finish successfully before this functionality pass is considered live.

## PRP1 batch 004 checkpoint

PRP1 batch 004 covered the next ten unresolved parent records in exact catalog order, from **ADA Amps - MP-1 Channel** through **Aclam Guitars - The Woman Tone**. Exact photos were archived for NKT275 Acid Fuzz Face, Cinnamon Drive, Cinnamon Drive - Dreamer Edition, Dr. Robert, Go Rocky Go, Go Rocky Go - White Album Edition, The Mocker, The Windmiller Preamp, and The Woman Tone. Research records were added for The Mocker, The Windmiller Preamp, and The Woman Tone, and Dr. Robert was updated for the documented V3 changes. **ADA Amps - MP-1 Channel** remains the next unresolved target because no exact safe direct image file was confirmed.

## PRP1 batch 005 checkpoint

PRP1 batch 006 covered the next ten catalog records in exact order, from **ADA Amps - MP-1 Channel** through **Add+ Pedals - Pi**. New research records were added for ADA Amps MP-1 Channel and eight Add+ Pedals products. An exact Effects Database photo was archived for Add+ Blues Player. Mk1.5 remains photo-pending because no exact safe direct image file was confirmed.



## PRP1 batch 007 checkpoint
ADA Amps - MP-1 Channel is now fully complete after exact photo confirmation from Effects Database. The tracker, public index, and photo manifest were updated together. The next exact-order unresolved target is ADA Amps - MP-1 Channel.


## PRP1 batch 008 checkpoint
ADA Amps - MP-1 Channel is now fully complete after exact photo confirmation from Chicago Music Exchange. The tracker, public index, and photo manifest were updated together. Next exact-order unresolved target: Add+ Pedals - Der Fuzzer.

## PRP1 batch 009 checkpoint
Batch 009 completed the next ten exact-order PRP1 records from **Add+ Pedals - Der Fuzzer** through **Add+ Pedals - Ratortion 3**. The first seven records already had research and were checked for photo recovery; three new research records were added for Ratortion, Ratortion 2, and Ratortion 3. The exact Add+ Pi picture was confirmed and connected to the public index and photo manifest. Records without a safely archived direct exact-model image remain photo-pending.
The next exact-order unresolved target is **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 010 checkpoint
Batch 010 worked the next ten exact-order PRP1 records from **A Sound Of Failure - Death Driver** through **AC Efectos - Triplex Distortion**. An exact Effects Database photograph was confirmed and archived for **Death Driver**, moving that pedal to fully complete. The remaining nine records in this photo-recovery window remain incomplete where no safe direct exact-model image asset was confirmed.
The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.


## PRP1 batch 011 checkpoint
Batch 011 expanded the photo-recovery sweep through the next 20 unresolved catalog records, from **A.Y.A - Bass Fuzz** through **Add+ Pedals - Ratortion 2**. An exact direct image asset was confirmed for **AC Noises - Urla** from Stars Music and connected to the research record, photo manifest, public index, and tracker. **A.Y.A - Bass Fuzz** received stronger historical and exact-model visual evidence, but no direct image asset was safely archived, so it remains photo-pending.
The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 012 checkpoint

Batch 012 audited the next 10 incomplete PRP1 records in exact catalog order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had research records. Exact-model photo recovery was checked across the batch, but no new direct image asset met the archive standard, so the ten remain photo-pending. The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 013 checkpoint

Batch 013 audited the next 10 incomplete PRP1 records in exact catalog order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Ratortion 3**. **Add+ Pedals - Ratortion 3** received a confirmed exact-model photo from a Reverb listing, and its research record, photo manifest, public index, and tracker were synchronized. The other nine records remain photo-pending. Next exact-order unresolved target: **Add+ Pedals - Ratortion 3 v2**.


## PRP1 batch 014 checkpoint

Batch 014 researched the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. New research records were added for all ten and synchronized into the photo manifest, public pedal index, and tracker. No new exact-model photo asset was safely archived during this research pass, so all ten remain picture-pending.

The next exact-order unresolved target remains **Add+ Pedals - Ratortion 3 v2** until the photo requirement is satisfied.


## PRP1 batch 015 checkpoint

Batch 015 audited the next 10 unresolved PRP1 records in exact catalog order, from **Add+ Pedals - Ratortion 3 v2** through **Addrock Musical Products - Geranium Fuzz**. Exact-model photos were recovered and synchronized for **Ratortion 3 v2, Shredder, Tube Drive Silver Edition, Boostmaster, and Geranium Fuzz**. **Super Drive, Super Drive 2, Tiger Shark, Tube Drive, and Tube Drive 2** remain photo-pending because no new safe direct exact-model image asset was confirmed during this pass.

The next exact-order unresolved target is **Add+ Pedals - Super Drive**.


## PRP1 batch 016 checkpoint

Batch 016 processed the next 10 incomplete PRP1 records in exact catalog order, from **Add+ Pedals - Super Drive** through **ADV Systems - #overdrive**. New research records were added for **Addrock Hism Scism, Addrock Not So Ol' Yeller, Addrock Ol' Yeller, ADV Systems #distortion, and ADV Systems #overdrive**. Exact photos were recovered for **Addrock Hism Scism** and **Addrock Ol' Yeller** and synchronized across the research records, photo manifest, public index, and tracker. The remaining eight records remain incomplete where no safe direct exact-model image asset was confirmed.

The next exact-order unresolved target remains **Add+ Pedals - Super Drive**.


## PRP1 batch 021 checkpoint

Batch 021 audited the next 10 incomplete PRP1 records in exact website order, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already had Pedal Info research records. The photo-recovery pass rechecked exact-model evidence across the full batch, including current/historical visual references for A.Y.A Bass Fuzz, A&M Custom Effects, AboveGroundFX, Absolutely Analog, AC Efectos, and Accel Audio. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Accel Audio - Stompzilla Fuzz**.


## PRP1 batch 022 checkpoint

Batch 022 audited the next 10 incomplete PRP1 records in exact website order, from **Accel Audio - Stompzilla Fuzz** through **Add+ Pedals - Super Drive**. All ten have Pedal Info research records. Exact-model photo evidence was rechecked across the batch, including the surviving Effects Database catalog evidence for the Add+ Pedals models. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Add+ Pedals - Super Drive 2**.

## PRP1 batch 023 checkpoint

Batch 023 audited the next 10 incomplete PRP1 records in exact website order, from **Add+ Pedals - Super Drive 2** through **Advance Tube Technology - Virus Drive**. The first nine records already had Pedal Info research and were rechecked against their historical/catalog sources. **Advance Tube Technology - Virus Drive** was the only record in the batch missing its research record; a new PRP1 record was added using the surviving Advance Tube Technology manufacturer documentation and Effects Database catalog evidence. Exact-model photo evidence was rechecked across the batch, including Add+ catalog references, Addrock, ADV Systems, and Advance Tube Technology sources. No new direct image asset met the archive's exact-photo standard, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**. No substitute, inferred image, or guessed image URL was promoted.

The next exact-order unresolved target is **Adventure Audio - Demogorgon Fuzz**.

## PRP1 batch 024 checkpoint

Batch 024 processed the next 10 incomplete PRP1 records in exact website order, from **Adventure Audio - Demogorgon Fuzz** through **Aguilar - Storm King - Micro Bass Distortion/Fuzz**. **Adventure Audio - Demogorgon Fuzz** received a confirmed exact-model photograph from Rich Tone Music and its research record, photo manifest, public index, and tracker were synchronized, moving it to fully complete. **Aguilar - Storm King - Micro Bass Distortion/Fuzz** was the only record in the batch missing Pedal Info research; a new PRP1 record was added from Aguilar's official product documentation and supporting historical coverage. The remaining records were rechecked against their available research and exact-model visual references. No substitute, inferred image, or guessed image URL was promoted. The Storm King record remains **Picture: NEEDED / PRP Complete: NEEDED**.

The next exact-order unresolved target is **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.

## PRP1 consistency repair after batch 024

The existing **Barber Electronics - Small Fry** research record introduced by a concurrent repository update was reconciled into the canonical PRP data layer. Its research record is now linked from **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Because the exact Small Fry image was not separately archived under this catalog identity, the picture remains **NEEDED** and no photo was inferred from the Burn Unit alias.

## PRP1 consistency repair after batch 024

The Barber Electronics research records added by the concurrent **PRP1 batch 021** work were reconciled into the canonical data layer so the deployment verifier can see every research file. Ten additional Barber records were linked across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Their Pedal Info status is now **DONE**; their pictures remain **NEEDED** until an exact-model image is independently verified. This repair does not change the PRP work-order checkpoint, which remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.

## PRP1 consistency repair follow-up

The deployment verifier exposed one invalid Barber tracker link: **Small Fry Burn Unit** did not have a corresponding research file. That catalog row has been returned to **Pedal Info: NEEDED**, with no research or photo connection claimed. The nine actual Barber research files remain linked; the PRP work-order checkpoint remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 025 checkpoint

Batch 025 processed the next 10 incomplete PRP1 records in exact website order, from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Existing research for FZR912, OD85, AGRO, and Storm King was rechecked and canonical source links were synchronized. New research records were added for **Airis Effects - Solar Flare Overdrive**, **Airis Effects - The Savage Drive**, **AJ Peat - Dirty Buzzard - Overdrive**, **AJ Peat - Fat Peacock - Distortion w/ Boost**, **AJ Peat - Screaming Flamingo - Overdrive/Distortion**, and **AJcustom - Distortion**. Exact-model photos were recovered and synchronized for Solar Flare, The Savage Drive, Dirty Buzzard, Fat Peacock, and Screaming Flamingo. **AJcustom Distortion** remains photo-pending because no direct exact-model image asset was safely archived. The first four AGR/Aguilar records also remain photo-pending, so the next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 026 checkpoint

Batch 026 continued the exact-order photo-recovery pass from **AGR Pedals - FZR912 - Muff Fuzz Deluxe** through **AJcustom - Distortion**. Two exact-model photos were independently confirmed and promoted: the original black **Aguilar - Agro - Bass Overdrive** from Thomann UK and **Aguilar - Storm King - Micro Bass Distortion/Fuzz** from Chicago Music Exchange. **FZR912 - Muff Fuzz Deluxe** and **OD85 - Full Range Overdrive** remain photo-pending because the accessible Effects Database records show exact-model imagery, but a safe direct image asset could not be independently archived from those records. No substitute or guessed image URL was promoted. The next exact-order unresolved target remains **AGR Pedals - FZR912 - Muff Fuzz Deluxe**.


## PRP1 batch 027 checkpoint

Batch 027 audited the first 10 incomplete records reported by the canonical **PRP_TRACKER.csv**, from **A.Y.A - Bass Fuzz** through **Accel Audio - OD-SS Express Overdrive**. All ten already have Pedal Info research and their research links remain intact. Exact-model visual evidence was rechecked across the window. The A.Y.A search surfaced a current **Bass Fuzz II** listing, but that model designation is explicitly different from the base **Bass Fuzz**, so it was not promoted. Effects Database also exposes exact-model catalog imagery for records such as **AboveGroundFX - El Griton Overdrive** and **AC Efectos - Triplex Distortion**, but the accessible pages do not provide a safe direct image asset for archival promotion. No substitute or guessed image URL was promoted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**. The next exact-order unresolved target is **A.Y.A - Bass Fuzz**.


## PRP1 batch 028 checkpoint

Batch 028 continued the photo-recovery pass on the first unresolved catalog target, **A.Y.A - Bass Fuzz**. A fresh 2024 Mercari listing was found showing the original **A.Y.A tokyo japan BASS FUZZ**, and independent older Japanese references identify the model as a limited 30-unit fuzz. The accessible eBay listings currently circulating are explicitly for **BASS FUZZ II**, so they were not substituted for the base model. The exact original-model visual evidence is now documented in the research record, but a stable direct image asset could not be safely archived from the available sources. **Picture remains NEEDED / PRP Complete remains NEEDED.** The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 029 checkpoint

The first incomplete catalog record remains **A.Y.A - Bass Fuzz**. The September 18, 2026 photo-recovery pass re-confirmed an exact original-model photograph via a 2024 Mercari listing, but the accessible listing does not provide a stable directly retrievable image asset. Current BASS FUZZ II listings remain explicitly a different model/version and are not used as a substitute. The tracker remains **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture.

## PRP1 batch 030 checkpoint

Batch 030 rechecked the exact first unresolved target, **A.Y.A - Bass Fuzz**. A fresh image search visually confirmed the original blue-sparkle A.Y.A tokyo japan BASS FUZZ enclosure from the 2024 Mercari listing, including the Fuzz/Vol layout and BASS FUZZ labeling. The source page currently returns 404 and no stable directly retrievable image asset was exposed, so the image remains unarchived and the public card must continue to show **No Photo Archived**. Current BASS FUZZ II listings remain a different model/version and are not substituted. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 032 checkpoint

The photo-recovery pass broadened the search for **A.Y.A - Bass Fuzz** to exact-title image indexing and additional independent Japanese references. The original blue-sparkle Bass Fuzz photograph was re-confirmed visually, but the underlying Mercari item is unavailable to the crawler and no stable direct image asset was exposed. The current **BASS FUZZ II** listings are explicitly a different version and remain excluded. **Picture remains NEEDED / PRP Complete remains NEEDED.** Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 033 checkpoint

Batch 033 refined the existing **A.Y.A - Bass Fuzz** research record using the original owner's firsthand account. His unit is identified as number 20 of the 30-unit run, and his notes describe a gritty but controlled bass fuzz that retains the instrument's core, projects strongly in a band mix, and has relatively little sustain. No new stable archival image asset was found, so **Picture remains NEEDED / PRP Complete remains NEEDED**. Counts remain **220 researched / 162 pictured / 162 fully complete / 3,659 incomplete**, with **58** researched pedals waiting only for a confirmed picture. The next exact-order unresolved target remains **A.Y.A - Bass Fuzz**.



## PRP1 batch 034 checkpoint

Batch 034 widened the photo-recovery window to the first 10 incomplete tracker records, beginning with **A.Y.A - Bass Fuzz** and continuing through **Accel Audio - OD-SS Express Overdrive**. The original A.Y.A Bass Fuzz image was re-confirmed visually, but its source remains unavailable for stable direct retrieval. The remaining nine records were also rechecked across exact-model web/image searches; available hits remain catalog pages or dynamic marketplace/affiliate listings without a safe archival image asset. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.


## PRP1 batch 035 checkpoint

Batch 035 widened the direct-image hunt across the current unresolved window using builder-domain searches, Effects Database records, historical resale sources, and exact-name image indexing. **A.Y.A - Bass Fuzz** remains visually confirmed by the indexed original-model photograph, but no stable direct asset is exposed. The following unresolved records likewise produced catalog imagery or source pages without a safe direct image file. No picture status changed. **Counts remain 3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for a picture. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 036 checkpoint

Batch 036 widened the exact-model photo-recovery window across the first 10 incomplete tracker records in website order: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The exact-model sources were rechecked using Effects Database records, historical/source listings, builder references, and current image indexing. The A.Y.A base-model image remains visually confirmed but is not available as a stable direct archival asset; the current BASS FUZZ II listing remains excluded as a different version. Effects Database imagery was also confirmed for several records in the window, but the accessible image material does not expose a stable direct file suitable for archival promotion under the project's photo rules. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 037 checkpoint

Batch 037 repeated the exact-order photo-recovery window across the first 10 incomplete tracker records: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The search was broadened to current web indexing, historical catalog material, builder-domain references, resale listings, and Effects Database records. Effects Database continues to expose exact product identities for the A&M, AboveGroundFX, AC Efectos, and Accel records, while the current A.Y.A resale result remains explicitly **BASS FUZZ II**, a different model/version. No newly discovered source exposed a stable direct exact-model image asset that met the archive's photo requirement. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 038 checkpoint

Batch 038 continued the exact-order photo-recovery pass on the first 10 incomplete catalog records: **A.Y.A - Bass Fuzz; A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive**. The sweep used fresh exact-title searches, Effects Database catalog records, builder-linked material, historical references, and the available image index. The A.Y.A indexed original-model photograph remains exact visual evidence, but the underlying Mercari page is unavailable and no stable direct image asset is exposed. Effects Database continues to identify the remaining models and exposes catalog imagery or source-page references, but the accessible image material still does not provide a safe, stable exact-model file for archival promotion. The archive therefore keeps all ten pictures **NEEDED** and continues to show **No Photo Archived** rather than substitute a guessed or mismatched image. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 batch 039 checkpoint

Batch 039 continued the exact-order photo-recovery pass on the first incomplete catalog window, centered on **A.Y.A - Bass Fuzz** and the following nine unresolved records. A fresh web/image audit confirmed that the original A.Y.A Bass Fuzz remains a distinct 2007 A.Y.A product with Fuzz and Volume controls, and the indexed original-model photograph still matches the base pedal's blue-sparkle enclosure and two-control layout. The underlying Mercari page is unavailable for stable retrieval, while the current live resale result is explicitly **BASS FUZZ II** and is therefore excluded from the base-model image. The remaining records continued to resolve to exact product/source pages and historical references without a stable direct image asset that meets the archive rule. **No picture status changed.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The first incomplete record remains **A.Y.A - Bass Fuzz**.

## PRP1 queue-progression rule — September 18, 2026

The PRP tracker remains the source of truth for **completion status**, but a single unresolved photo must not permanently block the working queue. Once a first-in-order incomplete pedal has received a fresh exact-model photo search and no qualifying archival asset is available, that pedal may be **parked for later photo recovery** while PRP1 advances to the next incomplete catalog records in exact website order. Parked pedals remain NEEDED in the tracker and are revisited during later broad recovery sweeps.

**Current active PRP1 cursor: A&M Custom Effects - Crash Central - Crunch Distortion. A.Y.A - Bass Fuzz is parked for later recovery.**

## PRP1 batch 040 checkpoint

Batch 040 advanced the PRP1 working queue past the parked **A.Y.A - Bass Fuzz** and audited the next 10 incomplete catalog records in exact order: **A&M Custom Effects - Crash Central - Crunch Distortion; A&M Custom Effects - Crazyboy - Double Fuzz; A&M Custom Effects - Metal Maniac - Mega Distortion; A&M Custom Effects - Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; AboveGroundFX - Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel Audio - OD-SS Express Overdrive; Accel Audio - Stompzilla Fuzz**. Fresh image/catalog searches produced clear exact-model visual references for **El Griton** and **Triplex**, plus additional historical/catalog image evidence for **Rocks Hard**, but no stable directly retrievable image asset met the archive requirement. The remaining models were rechecked against their exact product/source records without finding a qualifying stable image asset. **No picture status changed. A.Y.A remains Picture: NEEDED but is no longer a queue blocker.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The next active cursor is **Add+ Pedals - Der Fuzzer**.

## PRP1 batch 041 checkpoint

Batch 041 advanced the active PRP1 queue from the parked **A.Y.A - Bass Fuzz** to the next 10 incomplete records in exact catalog order: **Add+ Pedals - Der Fuzzer; Add+ Pedals - Distortion; Add+ Pedals - Fuzz Face; Add+ Pedals - Fuzz Machine; Add+ Pedals - Great White; Add+ Pedals - Great White 2; Add+ Pedals - Ratortion; Add+ Pedals - Ratortion 2; Add+ Pedals - Super Drive; Add+ Pedals - Super Drive 2**. Fresh source and image searches reconfirmed the Add+ catalog as an early-2011 Effects Database addition. The current Add+ Distortion retailer page provides an exact-model photograph and documents Volume/Tone/Drive controls plus MOSFET/Vintage clipping selection and a Low Pass/High Pass switch; the image is useful exact-model evidence, but its underlying CDN asset was not independently retrievable as a stable archival URL. The Add+ Fuzz Face image-index result also shows an exact branded Fuzz Face example, while Effects Database continues to list Der Fuzzer, Fuzz Machine, Great White, Great White 2, Ratortion, Ratortion 2, Super Drive, and Super Drive 2 as distinct Add+ products. No new stable direct image asset was confirmed for archival promotion in this batch, so no picture status changed. **A.Y.A remains Picture: NEEDED but parked and non-blocking.** Counts remain **3,821 total / 220 researched / 162 pictured / 162 complete / 3,659 incomplete**, with **58** researched pedals waiting only for confirmed pictures. The next active cursor is **Add+ Pedals - Super Drive**.

## PRP1 batch 042 checkpoint

Batch 042 audited the next 10 incomplete records after the parked A.Y.A and Batch 041 Add+ window, from **Add+ Pedals - Tiger Shark** through **Adventure Audio - Glacial Zenith - Overdrive**. One qualifying exact-model photo was recovered for **Advance Tube Technology - Over Cat Drive** from Banana Music and synchronized across the research record, photo manifest, public index, and tracker. No other stable direct exact-model image asset met the archive standard in this pass. **Over Cat Drive is now complete.** The next active unresolved target is **AED - Blue Bee**.

## PRP1 batch 043 checkpoint

Batch 043 advanced the active PRP1 queue through the next 10 incomplete catalog records: **AED - Blue Bee; Aether Electronic - Lenore; AGR Pedals - Cuervo Muerto - Silicon Fuzz Bender; AGR Pedals - DS2610 - Vintage Distortion; AGR Pedals - FZR912 - Muff Fuzz Deluxe; AGR Pedals - OD85 - Full Range Overdrive; AJcustom - Distortion; Akai - Blues Overdrive; Akai - Tri-Mode Fuzz; Akai - Tri-Mode Overdrive**. Fresh source/image checks re-confirmed exact-model references for the AED, Aether, AGR, and Akai records. The Akai trio was previously missing Pedal Info, so new research records were added and synchronized into the public index, photo/research manifest, and tracker. The exact Akai Blues Overdrive has a clear surviving product photograph, but its accessible source does not expose a stable direct archival image asset. The other photo searches did not produce a new stable exact-model asset that met the archive standard. **No picture status changed.** A.Y.A Bass Fuzz remains parked and non-blocking. Counts are now **3,821 total / 223 researched / 163 pictured / 163 complete / 3,658 incomplete**, with **60** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alairex - H.A.L.O. - Harmonic Amp-Like Overdrive**.


## PRP1 batch 044 checkpoint

Batch 044 advanced the active PRP1 queue through the next 10 incomplete catalog records: **Alairex - H.A.L.O. - Harmonic Amp-Like Overdrive; Alairex - H.A.L.O. Jr.; Alameda Guitars - Fuzzoo; Alber - FU-10; Alber - FU-1000; Alber - FU-1000P; Alber - GA-104 Gain; Alber - GA-1040 Gain; Alber - GA-1040P Gain; Alber - OD-6 Over Drive**. New Pedal Info research records were created for all ten entries and synchronized across the research records, public pedal index, photo/research manifest, and tracker. Exact-model photos were archived for **Alairex H.A.L.O. - Harmonic Amp-Like Overdrive**, **Alairex H.A.L.O. Jr.**, and **Alameda Guitars Fuzzoo** using directly retrievable builder/catalog image assets. The seven Alber records remain picture-pending because the accessible catalog imagery is wrapped through marketplace/image layers without a stable directly retrievable archival asset. **Alairex H.A.L.O., H.A.L.O. Jr., and Alameda Fuzzoo moved to Picture: DONE / PRP Complete: DONE.** A.Y.A Bass Fuzz remains parked and non-blocking. Counts are now **3,821 total / 233 researched / 166 pictured / 166 complete / 3,655 incomplete**, with **67** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alber - OD-600 Over Drive**.

## PRP1 batch 045 checkpoint

Batch 045 advanced the active PRP1 queue through the next 10 incomplete catalog records: **Alber - OD-600 Over Drive; Alber - OD-600P Over Drive; Alber - OD-610 Over Drive; Alcove - ALP-200 Overdrive; Alden - Tube Overdrive; Aleatorik - Operation 1; Aleatorik - Operation 2; Aleatorik - Operation 3; Aleks K Production - Honey Moon - Sweet Overdrive; Aleks K Production - Sun Beam - Magic Drive**. New Pedal Info research records were created for all ten entries and synchronized across the research records, public pedal index, photo/research manifest, and tracker. An exact builder photo was archived for **Aleks K Production - Sun Beam - Magic Drive**. The Honey Moon catalog entry remains photo-pending because the stable direct builder image currently exposed is specifically a V3, while the archive entry is the generic model and its version differences matter. The remaining eight records are photo-pending because exact catalog imagery is available through source/marketplace layers but no stable directly retrievable archival asset met the photo rule. A later-fix checklist was added at **research/PRP_LATER_FIXES.md** for the seven remaining Batch 044 Alber photos plus the parked A.Y.A Bass Fuzz. Counts are now **3,821 total / 243 researched / 167 pictured / 167 complete / 3,654 incomplete**, with **76** researched pedals waiting only for confirmed pictures. The next active unresolved target is **Alen Geere - Crown Centaur**.

## PRP1 batch 046
- **Window:** Alen Geere — Crown Centaur; LEADer Mk.2; Loverdrive; Methoxy Overdrive; Preface Drive; Serene; Tube Fuzz; Alexander Pedals — Clang Championship Edition; Hot Pink Drive; Jubilee Silver Overdrive; Magnolia Vintage Overdrive.
- **Action:** Added 11 PRP research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** No exact direct image asset promoted in this batch. All 11 remain Picture: NEEDED / PRP Complete: NEEDED.
- **Counts:** 3,821 total / 254 researched / 167 pictured / 167 complete / 3,654 incomplete.
- **Next active cursor:** Alexander Pedals — Princess Clang.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains research-complete but picture-pending.


## PRP1 batch 047
- **Window:** Alexander Pedals — Princess Clang; Royal Cream; Alien Amplification — Origami Overdrive; Alien Rabbit — Magic Drive; All-Pedal — Alcmene Overdrive; Devil's Triad Essentials; Slamurai Bushido Drive; Ampeg — Scrambler Bass Overdrive; Amplified Nation — Big Bloom Overdrive; Bigger Bloom Overdrive.
- **Action:** Added 10 Pedal Info research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** No exact-model direct image asset met the stable archival-photo standard. All 10 remain Picture: NEEDED / PRP Complete: NEEDED.
- **Counts:** 3,821 total / 264 researched / 167 pictured / 167 complete / 3,654 incomplete.
- **Waiting on photos:** 97 researched pedals.
- **Next active cursor:** AmpMojo — Skate Fuzz (SKUZZ).
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 048 checkpoint

Batch 048 processed the next three incomplete records in exact website order: **AmpMojo - Skate Fuzz (SKUZZ)**, **AmpMojo - Sol Drive**, and **Amptweaker - Bass BluesFuzz**. All three received individual research records and were connected to PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. No exact photo was safely confirmed for these models, so all three remain photo-pending.

- Research information: 267
- Confirmed pictures: 167
- Fully complete: 167
- Incomplete: 3654
- Researched but photo-pending: 100
- Next exact-order incomplete target: **Amsterdam Cream - Big Eye Fuzz**

## PRP1 batch 049 checkpoint

Batch 049 processed the next ten incomplete records in exact website order: **Amsterdam Cream - Big Eye Fuzz**, **Original Distortion**, **Plain Drive**, then **AMT Electronics - B-1 BG-Sharp**, **BS British Sound**, **CS California Sound**, **DM-3 DistMachine**, **M-1 JM-800**, **R-1 Rectifier**, and **Rammstein RD Distortion Combo Emulator**. All ten received individual research records and were connected to PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. No exact photo was safely confirmed for these models, so all ten remain photo-pending. The next exact-order incomplete target is **AMT Electronics - S-1**.


## PRP1 batch 050

- **Window:** AMT Electronics — S-1; SS-11B; SS-20; AMtech Handwired — Destroyer; Tube Drive; amukaT — Tweaker; Amzel Electronics — Cheshire Cat Tone Evaporator; Analog Alien — Joe Walsh Double Classic; Rumble Seat; Analog Fox — Tone Machine.
- **Action:** Added 10 PRP research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** Exact archival image promoted for **Analog Alien — Rumble Seat** from a stable Sweetwater product asset. The other nine remain photo-pending.
- **Counts:** 3,821 total / 287 researched / 168 pictured / 168 complete / 3,653 incomplete.
- **Waiting on photos:** 119 researched pedals.
- **Next exact-order incomplete target:** **Analog King — Fuzz Machine - Germanium Fuzz + Overdrive**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 052

- **Window:** Analog Noir — Tone Bender MK1.5 / Tone Bender MKII; Tone Bender MKI; Tone Bender MKI / Rangemaster Treble Booster; Zonk Machine; Analog Sound — Atomic Overdrive; Double Trouble Overdrive; Scream For Cream OD; Smooth O' Drive; The Boogie Man.
- **Action:** Added 9 Pedal Info research records and synchronized the canonical PRP data files. No exact-model direct image asset met the stable archival-photo standard.
- **Counts:** 3,821 total / 306 researched / 168 pictured / 168 complete / 3,653 incomplete.
- **Next exact-order incomplete target:** **Anarchy Audio Australia — Baa Bzz**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.

## PRP1 batch 053

- **Window:** Anarchy Audio Australia — Baa Bzz.
- **Action:** Added the individual Pedal Info research record and synchronized the canonical PRP data files.
- **Photo status:** Exact retail imagery was confirmed visually, but no stable direct image asset was independently isolated, so Picture remains NEEDED.
- **Counts:** 3,821 total / 307 researched / 168 pictured / 168 complete / 3,653 incomplete.
- **Next exact-order incomplete target:** **Anarchy Audio Australia — Deadwoods - Chainsaw Fuzz**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 054

- **Window:** Anarchy Audio Australia — Deadwoods - Chainsaw Fuzz; Sentinel; Anasounds — bitoun fuzz; cerberus; ego driver; feed me mk3; full story; high voltage; sandman; savage.
- **Action:** Added 10 Pedal Info research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** No exact-model direct image asset met the stable archival-photo standard in this pass. All 10 remain Picture: NEEDED / PRP Complete: NEEDED.
- **Counts:** 3,821 total / 317 researched / 168 pictured / 168 complete / 3,653 incomplete.
- **Next exact-order incomplete target:** **Animal Factory Amplification — Evil Filter**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 055

- **Window:** Animal Factory Amplification — Chemical Burn; Dirty Mirror; Godeater+; Animals Pedal — ANGEL BEAR FACE FUZZ; Diamond Peak Hybrid Over Drive; FISHING IS AS FUN AS FUZZ; FISHING IS AS FUN AS FUZZ LIMITED EDITION; I Was A Wolf In The Forest Distortion; In Oct,3 Foxes talking of dreamy FUZZ; Major Overdrive.
- **Action:** Added 10 Pedal Info research records and synchronized canonical PRP data files.
- **Photo status:** No exact-model direct image asset was promoted to the archive in this pass. All 10 remain Picture: NEEDED / PRP Complete: NEEDED.
- **Counts:** 3,821 total / 327 researched / 168 pictured / 168 complete / 3,653 incomplete.
- **Next exact-order incomplete target:** **Animals Pedal — PUSH & PULL DISTORTION**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 056 — queue reconciliation

- **Window:** Analog King — Fuzz Machine - Germanium Fuzz + Overdrive; ZenTone - Harmonic Drive; Analog Music Company — Evil Pumpkin; Mary Gorgias Ultra High Gain Distorter; Analog Noir — Fuzz Face / Rangemaster Treble Booster; Harmonic Percolator; Si / Ge Fuzz Face; Animals Pedal — PUSH & PULL DISTORTION; PUSH & PULL DISTORTION LIMITED EDITION; PUSH & PULL DISTORTION LIMITED EDITION C.
- **Action:** Reconciled the earlier skipped unresolved tracker window and added 10 individual PRP research records with synchronized index, photo manifest, and tracker entries.
- **Photo status:** Exact archival images promoted for ZenTone, Harmonic Percolator, Si / Ge Fuzz Face, and all three PUSH & PULL DISTORTION entries. Four remain photo-pending.
- **Live tracker counts:** 3821 total / 324 researched / 174 pictured / 174 complete / 3497 incomplete.
- **Next exact-order incomplete target:** **Animals Pedal - Rover Fuzz**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 057

- **Window:** Animals Pedal — Rover Fuzz; Rust Rod Fuzz; Sunday Afternoon Is Infinity Bender; Surfing Bear Overdrive; SURFING POLAR BEAR BASS OVERDRIVE MOD BY BJF; Tioga Road Cycling Distortion; Vintage Van Driving is Very Fun; Anode Effects — Dragon Drive V2; MOS Fuzz; ARC Effects — Soothsayer.
- **Action:** Added 10 individual PRP research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** Exact archival images promoted for Sunday Afternoon Is Infinity Bender, Surfing Bear Overdrive, Dragon Drive V2, and Soothsayer. Six remain photo-pending.
- **Live tracker counts:** 3821 total / 334 researched / 178 pictured / 178 complete / 3487 incomplete.
- **Waiting on photos:** 156 researched pedals.
- **Next exact-order incomplete target:** **Arcane Analog - ARCANE ANALOG FF66 FUZZ FACE**.
- **Parked/non-blocking:** A.Y.A — Bass Fuzz remains picture-pending.


## PRP1 batch 058

- **Window:** Arcane Analog - ARCANE ANALOG FF66 FUZZ FACE; BC108 Fuzz Face; BUZZAROUND OC45 / OC45 / OC43; BUZZSAW; Facebender / Rangbender; NKT775 WHITE FUZZ FACE; OC42 MK1.5 Tonebender; Overdrive Overload; TONE BENDERS (MK1 // MK1.5 // MK2 // MK3 // MK4); Artisanal Effects - Artisanal Cheese (Big Cheese).
- **Action:** Added 10 individual PRP research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** Exact archival images promoted for FF66, Buzzaround OC45/OC45/OC43, Buzzsaw, Facebender, NKT775 White, OC42 MK1.5, and Artisanal Cheese. BC108, Overdrive Overload, and the combined Tone Benders family remain photo-pending.
- **Live tracker counts:** 3821 total / 344 researched / 185 pictured / 185 complete / 3636 incomplete.
- **Waiting on photos:** 159 researched pedals.
- **Next exact-order unresolved target:** **Arcane Analog - BC108 Fuzz Face**.
- **Parked/non-blocking:** A.Y.A - Bass Fuzz remains picture-pending.


## PRP1 batch 058

- **Window:** Arcane Analog - ARCANE ANALOG FF66 FUZZ FACE; BC108 Fuzz Face; BUZZAROUND OC45 / OC45 / OC43; BUZZSAW; Facebender / Rangbender; NKT775 WHITE FUZZ FACE; OC42 MK1.5 Tonebender; Overdrive Overload; TONE BENDERS (MK1 // MK1.5 // MK2 // MK3 // MK4); Artisanal Effects - Artisanal Cheese (Big Cheese).
- **Action:** Added 10 individual PRP research records and synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** Exact archival images promoted for FF66, Buzzaround OC45/OC45/OC43, Buzzsaw, Facebender, NKT775 White, OC42 MK1.5, and Artisanal Cheese. BC108, Overdrive Overload, and the combined Tone Benders family remain photo-pending.
- **Live tracker counts:** 3821 total / 344 researched / 185 pictured / 185 complete / 3636 incomplete.
- **Waiting on photos:** 159 researched pedals.
- **Next exact-order unresolved target:** **Arcane Analog - BC108 Fuzz Face**.
- **Parked/non-blocking:** A.Y.A - Bass Fuzz remains picture-pending.


## PRP1 batch 059

- **Window:** Arcane Analog - BC108 Fuzz Face; Overdrive Overload; TONE BENDERS (MK1 // MK1.5 // MK2 // MK3 // MK4); Artisanal Effects - Cheddar Source; Ashdown Engineering - John Myung Double Drive; Asheville Guitar Pedals - Fuzz Driver Distortion; Purr Machine Mini Fuzz Overdriver; Rat King; Astral ToneWorx - 666 The Beast; Krampus - Doom Fuzz.
- **Action:** Rechecked the three existing Arcane research records for exact-photo recovery and added 7 new PRP research records; synchronized PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv.
- **Photo status:** Exact archival images promoted for Cheddar Source, John Myung Double Drive, Fuzz Driver Distortion, Purr Machine Mini, Rat King, 666 The Beast, and Krampus. BC108, Overdrive Overload, and the combined Tone Benders family remain photo-pending.
- **Live tracker counts:** 3821 total / 351 researched / 192 pictured / 192 complete / 3629 incomplete.
- **Waiting on photos:** 159 researched pedals.
- **Next exact-order active target:** **Atlas Pedal - Bracton OverDrive**.


## Current live checkpoint override - PRP1 batch 066

Batch 066 is the latest PRP1 synchronization checkpoint. The batch covered the next 10 missing Pedal Info records in exact tracker order from **Axcess by Giannini - DS-101 Distortion** through **AXiom Effects - Fuzz Preamp FP-1**. All ten research records, public index entries, photo manifest entries, and tracker rows are synchronized.

Exact photos are attached for **DS-101, DS-102, FZ-110, OD-102, OBViouS Boost/OD, and Glass Drive**. **MD-102, Gain Chain, DP-1, and FP-1** remain photo-pending and continue to use **No Photo Archived**.

The actual tracker totals are **3,821 total / 421 researched / 197 pictured / 197 complete / 3,624 incomplete**, with **224** researched pedals waiting only for a confirmed picture. The next active missing-information target is **Axis Guitar Effects - Axis Face MkII**. **A.Y.A - Bass Fuzz** remains parked/non-blocking for later photo recovery.


## Current live checkpoint override - PRP1 batch 067

Batch 067 is the latest PRP1 synchronization checkpoint. The batch covered the next 10 missing Pedal Info records from **AXiom Effects - Overdrive Preamp OP-1** through **Azor - AP-507 Dog Distortion Guitar Effect Pedal**. All ten research records, public index entries, photo manifest entries, and tracker rows are synchronized.

Exact photos are attached for **Axis Guitar Effects - Skrambler, AXL - DP-1 Distortion, and Azor - AP-507 Dog Distortion Guitar Effect Pedal**. The other seven remain photo-pending and continue to use **No Photo Archived**.

Actual tracker totals are **3,821 total / 431 researched / 200 pictured / 200 complete / 3,621 incomplete**, with **231** researched pedals waiting only for confirmed pictures. The next active missing-information target is **Azor - Distortion Effect Pedal**. **A.Y.A - Bass Fuzz** remains parked/non-blocking for later photo recovery.

## PRP1 batch 068 checkpoint

Batch 068 processed the next 10 missing Pedal Info records in exact website/tracker order: **Azor - Distortion Effect Pedal; Azor - Fuzz Effect Pedal; Azor - Overdrive Effect Pedal; Azur - FUZZ Effect Pedal; Azur - LEON DRIVE Effect Pedal; Azur - OVERDRIVE Effect Pedal; B.C. Rich - DMD-1 Digital Metal Distortion; B.K. Butler - Tube Driver; B85 Audio - Bass Overdrive; B85 Audio - Fuzz Machine**.

All ten now have individual Pedal Info research records and are synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Exact photos were attached for **Azor - Fuzz Effect Pedal (AP-303)** and **Azor - Overdrive Effect Pedal (AP-308)**. The other eight remain photo-pending and continue to use **No Photo Archived**.

The Azur records are intentionally kept under the cataloged **Azur** builder spelling. Retail evidence exists for the exact FUZZ, LEON DRIVE, and OVERDRIVE names, but the checked sources do not establish a separate factory lineage or justify silently merging them with Azor products.

**Current tracker totals after Batch 068:** **3,821 total / 441 researched / 202 pictured / 202 fully complete / 3,619 incomplete**, with **239** researched pedals waiting only for a confirmed picture. The next exact-order missing-information target is **B85 Audio - Germanium Overdrive**. **A.Y.A - Bass Fuzz** remains parked/non-blocking for later exact-photo recovery.

## PRP1 batch 070 checkpoint

Batch 070 completed the next ten unfinished records in exact tracker order, from **Bad Penny FX - Wireless Germanium Fuzz** through **Bad Pixel Pedals - MKII Professional Gold Bender Fuzz**. All ten received individual research records and exact-model photo assets, with the official Bad Pixel builder pages used wherever available and the exact Wireless Germanium product photograph taken from Gear Hero. The tracker, public index, photo manifest, and individual research records are synchronized.

- **Live tracker totals:** 3821 total / 461 researched / 214 pictured / 214 complete / 3607 incomplete.
- **Waiting on photos:** 247 researched pedals.
- **Next exact-order incomplete target:** **Baddy One Shoe Pedals - Heartbreaker**.## PRP1 batch 071 checkpoint

Batch 071 completed the next ten unfinished records in exact tracker order, from **Baddy One Shoe Pedals - Heartbreaker** through **Baja Tech Custom - Das Fuzz Ge**. All ten now have individual research records synchronized into the public index, photo manifest, and tracker. Exact-model imagery was reviewed, but no new stable direct archival asset met the picture rule, so all ten remain photo-pending.

- **Live tracker totals:** 3821 total / 471 researched / 214 pictured / 214 complete / 3607 incomplete.
- **Waiting on photos:** 257 researched pedals.
- **Next exact-order missing-information target:** **Baja Tech Custom - Das Fuzz Si**.

## PRP1 batch 072 checkpoint

Batch 072 completed the next ten unfinished records in exact tracker order, from **Baja Tech Custom - Das Fuzz Si** through **Baltimore Sonic Research Institute - Oriole Fuzz**. All ten now have individual research records synchronized into the public index, photo manifest, and tracker. Exact photos were archived for Das Fuzz Si, Top Boost TB-1, Fission Drive v2, Ashmaker, Get the Name of the Dog!, Impossible Colors, and Oriole Fuzz. BG-Drive, FZZ, and Impossible Colors II remain **Picture: NEEDED / PRP Complete: NEEDED**.

- **Live tracker totals:** 3821 total / 481 researched / 221 pictured / 221 complete / 3600 incomplete.
- **Waiting on photos:** 260 researched pedals.
- **Next exact-order missing-information target:** **Baltimore Sonic Research Institute - Radical Conversion - Discrete Opamp Distortion**.

## PRP1 batch 073 checkpoint

Batch 073 completed the next ten unfinished records in exact tracker order, from **Baltimore Sonic Research Institute - Radical Conversion - Discrete Opamp Distortion** through **Baroni Lab - Billygoats Muff**. All ten now have individual research records synchronized into the public index, photo manifest, and tracker. Exact photos were archived for Radical Conversion, Small Fry Burn Unit, Trifecta, UnLimiTeD, Angry Pig, and Billygoats Muff. TFZ Fuzz, HM Demon, The Beast, and BP-1 remain **Picture: NEEDED / PRP Complete: NEEDED**.

- **Current totals:** 3821 total / 491 researched / 227 pictured / 227 complete / 3594 incomplete.
- **Waiting on photos:** 264 researched pedals.
- **Next exact-order missing-information target:** **Baroni Lab - GD Drive**.

## PRP1 batch 074 checkpoint

Batch 074 completed the next ten unfinished records in exact tracker order, from **Baroni Lab - GD Drive** through **Basic Audio - Scarab Deluxe**. All ten now have individual research records synchronized into the public index, photo manifest, and tracker. Exact photos were archived for GD Drive, Moon Sound, Morpheus, The Boutique Muff, Tubes Tone & Drive, Pirk, and Scarab Deluxe. Rat'N Box, Warp Drive, and Overtdrive remain **Picture: NEEDED / PRP Complete: NEEDED**.

- **Live tracker totals:** 3821 total / 501 researched / 234 pictured / 234 complete / 3587 incomplete.
- **Waiting on photos:** 267 researched pedals.
- **Next exact-order missing-information target:** **Basic Audio - Sharp Tooth**.


## PRP1 batch 075 checkpoint

Batch 075 completed the next ten unfinished records in exact tracker order: **Basic Audio - Sharp Tooth; Solar Myth; Spooky Tooth; Supa; Supa MKI; Supa Tweak; Super Fuzz; Tri-Ram Muff; Zippy; and Zonk**.

All ten now have individual Pedal Info research records, exact official Basic Audio product photographs, and synchronized entries in **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. All ten are now **Pedal Info: DONE / Picture: DONE / PRP Complete: DONE**.

**Live tracker totals after Batch 075:** **3,821 total / 511 researched / 244 pictured / 244 fully complete / 3,577 incomplete**, with **267** researched pedals waiting only for a confirmed picture.

**Next exact-order missing-information target:** **BBE - G Screamer**.

**Parked/non-blocking:** **A.Y.A - Bass Fuzz** remains picture-pending for later exact-photo recovery.


## PRP1 batch 076 checkpoint

Batch 076 completed the next ten unfinished records in exact tracker order: **BBE - G Screamer; BearFoot FX - Arctic White Fuzz; BlueBerry Bass Overdrive; Bone Bender MKI Fuzz; Burgundy BossHorn Fuzz; Candy Apple Fuzz; Dyna Red Distortion; Emerald Green Distortion Machine; Emerald Green Overdrive; and Honey Bee Overdrive**.

All ten received individual Pedal Info research records and were synchronized with **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact photos were promoted for eight records. G Screamer and Emerald Green Overdrive remain Picture: NEEDED.

**Tracker totals after Batch 076:** **3,821 total / 521 researched / 252 pictured / 252 complete / 3,569 incomplete**, with **269** researched pedals waiting only for confirmed pictures.

**Next regression/research target:** **BearFoot FX - Honey Bee Overdrive Plus**.


## PRP1 batch 077 checkpoint

Batch 077 completed the next ten unfinished records in exact tracker order: **BearFoot FX - Honey Bee Overdrive Plus; Honey Beest; Pink Purple Fuzz; Silver Bee Overdrive; Sparkling Yellow Overdrive; Über Bee Overdrive; BECOS FX - Ziffer Overdrive; Beetronics FX - Abelha Tropical Fuzz; Fatbee; and Nectar Tone Sweetener**.

All ten received individual Pedal Info research records and were synchronized with **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact photos were promoted for eight records; Honey Beest and Ziffer Overdrive remain Picture: NEEDED.

**Tracker totals after Batch 077:** **3,821 total / 531 researched / 260 pictured / 260 complete / 3,561 incomplete**, with **271** researched pedals waiting only for confirmed pictures.

**Next regression/research target:** **Beetronics FX - Octahive V2**.


## Batch 077 verification repair

The new live-archive verification caught a false tooling failure: **scripts/hourly-site-health.js** parsed PRP_TRACKER.csv with a raw comma split and therefore misread a legitimate quoted pedal name containing a comma. The health checker was repaired with quote-aware CSV parsing. No catalog identity was changed or removed.


## PRP1 batch 078 checkpoint

Batch 078 completed the next ten unfinished records in exact tracker order: **Beetronics FX - Octahive V2; Overhive; Royal Jelly; Swarm Fuzz Harmonizer; Tuna Fuzz; Vezzpa Octave Stinger; Behringer - Bass Brassmaster; Fuzz Bender; OD300; and SF300 Super Fuzz**.

All ten received individual Pedal Info research records and were synchronized with **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact photos were promoted for nine records; OD300 remains Picture: NEEDED.

**Tracker totals after Batch 078:** **3,821 total / 541 researched / 269 pictured / 269 complete / 3,552 incomplete**, with **272** researched pedals waiting only for confirmed pictures.

**Next regression/research target:** **Behringer - UZ400 Ultra Fuzz**.


## PRP1 batch 079 checkpoint

Batch 079 completed the next ten unfinished records in exact tracker order: **Behringer - UZ400 Ultra Fuzz; Benson Amps - Deep Sea Diver Fuzz-Echo; Germanium Fuzz; Germanium Preamp Pedal; Portable Distortion 424 MKII; Preamp Pedal; Stonk Box; Störkn B0kš; Beta Aivin - BOD-1 Bass Overdrive; and BOD-2 Bass Overdrive**.

All ten received individual Pedal Info research records and were synchronized with **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact photos were promoted for eight records; Stonk Box and BOD-2 remain Picture: NEEDED.

**Tracker totals after Batch 079:** **3,821 total / 551 researched / 277 pictured / 277 complete / 3,544 incomplete**, with **274** researched pedals waiting only for confirmed pictures.

**Next regression/research target:** **BFFX Boutique Pedals - Demon D**.


## PRP1 batch 090 checkpoint

Batch 090 completed the next ten unfinished records in exact tracker order: **Biyang - DS-8 Mouse; DS-9 Distortion; FZ-12 Fuzz; FZ-7 Fuzz; Junky Drive; Metal-End; NM-2 New Metal; OD-12 X-Drive; OD-7 Overdrive; and OD-8 X-Drive**.

All ten now have individual Pedal Info research records and were synchronized across **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. No exact-model image met the stable archival-image standard in this pass, so all ten remain **Picture: NEEDED / PRP Complete: NEEDED**.

**Live tracker totals after Batch 090:** **3,821 total / 672 researched / 277 pictured / 277 fully complete / 3,544 incomplete**, with **395** researched pedals waiting only for confirmed pictures.

**Next exact-order missing-information target:** **Biyang - OTD-100 Distortion**.

**Parked/non-blocking:** **A.Y.A - Bass Fuzz** remains picture-pending for later exact-photo recovery.


## PRP1 batch 090 verification correction
The repository-level tracker calculation after Batch 090 is **3,821 total / 672 researched / 278 pictured / 277 complete / 3,544 incomplete**, with **395** researched pedals waiting only for pictures. The 278 pictured count includes one legacy record, **Animals Pedal - In Oct,3 Foxes talking of dreamy FUZZ**, whose picture flag is still NEEDED in the tracker, so it is intentionally not counted as PRP Complete.

## PRP1 Batch 096

Batch 096 added 10 researched pedal records in exact order, from **Black Arts Toneworks - Tres Diablos Ruidosos** through **Black Cat Pedals - N-Fuzz**. All 10 remain photo-pending. Public data version: **2026-09-19-prp1-batch-096**.

Current tracker flags: **725 researched / 276 pictured / 276 complete / 3544 incomplete / 449 researched-photo-pending**.

Next exact-order target: **Black Cat Pedals - OD-1 Freddy Fuzz**.

## PRP1 Batch 097

Batch 097 added 10 researched pedal records in exact order, from **BBE - Green Screamer** through **Black Cat Pedals - Super Fuzz**. All 10 remain photo-pending. Public data version: **2026-09-19-prp1-batch-097**.

Current tracker flags: **735 researched / 276 pictured / 276 complete / 3545 incomplete / 459 researched-photo-pending**.

Next exact-order target: **Black Cat Pedals - OD-Boost**.

## PRP1 Batch 098

Batch 098 recovered confirmed photos for **A.Y.A - Bass Fuzz** and **AC Noises - Urla** while preserving the other eight photo-pending records. Public data version: **2026-09-19-prp1-batch-098**.

Current tracker flags: **735 researched / 278 pictured / 278 complete / 3543 incomplete / 457 researched-photo-pending**.

Next exact-order target: **A&M Custom Effects - Crash Central - Crunch Distortion**.

## Catalog pagination update

The landing page now uses numbered pagination at **72 pedals per page**, with page state preserved in the URL.

## PRP1 Batch 099

Batch 099 synchronized 10 researched pedal records in exact tracker order, from **Black Country Customs - BLACKHEATH** through **Black Cat Pedals - Wee Buzz**. All 10 remain photo-pending. Public data version: **2026-09-19-prp1-batch-099**.

Current tracker flags: **745 researched / 278 pictured / 278 complete / 3543 incomplete / 467 researched-photo-pending**.

Next exact-order target: **Blackhawk Amplifiers - Balrog Distortion MKII**.


## PRP1 Batch 110 checkpoint

Batch 110 completed the next ten exact-order missing Pedal Info records from **BOSS - BD-2W Blues Driver** through **BOSS - MD-2 Mega Distortion**. All ten received individual research records and were synchronized across the canonical catalog, photo/research manifest, and PRP tracker. Exact photos were archived for **BD-2W, DS-1, DS-1W, DS-1X, FZ-1W, HM-2W, and MD-2**; **DS-2, FZ-5, and JB-2** remain photo-pending.

**Current tracker totals:** **3,821 total / 855 researched / 285 pictured / 285 complete / 3,536 incomplete**, with **570** researched pedals waiting only for a confirmed picture.

**Next exact-order missing-information target:** **BOSS - ML-2 Metal Core**.

## PRP1 Batch 112 checkpoint

Batch 112 completed an exact-order photo-recovery pass across **A&M Custom Effects - Crash Central - Crunch Distortion; Crazyboy - Double Fuzz; Metal Maniac - Mega Distortion; Twin Pro - Overdrive; AboveGroundFX - El Griton Overdrive; Rocks Hard; Absolutely Analog - Ratzo; AC Efectos - Triplex Distortion; Accel OD-SS Express Overdrive; and Accel Stompzilla Fuzz**. Existing research records were verified against the current catalog and exact-model visual evidence was rechecked. No new direct image asset met the local archival standard, so all ten remain photo-pending.

**Current tracker totals:** **3,821 total / 865 researched / 295 pictured / 295 complete / 3,526 incomplete / 570 researched-photo-pending**.

**Next exact-order target:** **A&M Custom Effects - Crash Central - Crunch Distortion**.

**Public data version:** **2026-09-19-prp1-batch-112**.


## Latest PRP1 checkpoint — Bulinski Effect Pedals RC Bass Fuzz

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - The Full Circle Bass Fuzz; The Large Beaver; The Mimosa; The Swede; Yellow Overdrive; Bulinski Effect Pedals - Deluxe Velociraptor Diode Bass Fuzz; Filth Foundry Guitar Fuzz; Gnarly Bee; Hard 80 Distortion; and RC Bass Fuzz**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Photo records remain conservative where no verified exact-model image has been archived.

**Verified tracker totals:** **3821 total / 1024 researched / 301 pictured / 300 complete / 3521 incomplete / 724 researched-photo-pending**.

**Next exact-order research target:** **Bulinski Effect Pedals - Velociraptor Diode Bass Fuzz**.

**Public data version:** 2026-09-19-prp1-batch-132.
## Latest PRP1 checkpoint — Batch 114

Batch 114 advanced **13 exact-order research-needed records**: the two census-placeholder rows for BlackOutEffectors and Blackstar Amplification, BMF Effects The Godfather Overdrive, Boulevard BDT-10 Distortion, Boulevard BOD-10 Overdrive, Boulevard Effects Darkship, Bouteek Distorter - Preamp, Bouteek Overdriver - Preamp, Bouteek Twin Drive and Boost - Ultimate Drive with Fuzz Inject, Bowman Audio Endeavors Bellyacher, Odious Fuzz Octave, Satan's Fingers Fuzz, and The Bowman Overdrive.

All 13 now have Pedal Info research records. No questionable photo was promoted. Source pages were attached where available so the browser-assisted cache can attempt exact image recovery. The queue is now allowed to continue past photo-pending records instead of treating a difficult image as a blocker.

**Tracker totals:** 3,821 total / 878 researched / 295 pictured / 295 complete / 3,526 incomplete / 583 researched-photo-pending.

**Next exact-order research target:** the first remaining tracker row with Pedal Info = NEEDED after the Batch 114 records.

**Public data version:** 2026-09-19-prp1-batch-114.


## Latest PRP1 checkpoint — Batch 115

Batch 115 advanced **14 consecutive exact-order research-needed records** from the live tracker: Bogner Amplification — production status not established from reviewed current manufacturer material; BoX — Distortion; BR Tech — BR-1 Distortion; BR Tech — Up Scream; Braking Train Pedals — Frequency Control Fuzz; Brantone Electronics — Blue Meanie - Germanium Fuzz; Green Manalishi Overdrive; Tonemaster Mk1.5 Germanium Fuzz; ToneMaster Mk2 Germanium Fuzz; Vintage Tweed Overdrive; WEM Pepbox - Official Reissue; Woodstock - Silicon Fuzz Face; Breakfast Audio — SLAB DISTORTION; and WELTSCHMERZ FUZZ.

All 14 now have individual Pedal Info research records and are synchronized into the canonical catalog and PRP tracker. No questionable image was promoted. Photo-pending records remain pending and do not block continued research.

**Verified tracker totals:** 3821 total / 892 researched / 295 pictured / 295 complete / 3526 incomplete / 597 researched-photo-pending.

**Next exact-order research target:** **BreakFuzz - Surly Fuzz Germanium**.

**Public data version:** 2026-09-19-prp1-batch-115.


## Latest PRP1 checkpoint — Flexible continuation through Broughton Audio

The PRP process is now explicitly using **practical working sets rather than a fixed pedal count**. Recent work advanced consecutive exact-order research records through BreakFuzz, Brière Pedals, Brimstone Audio, British Pedal Company, and Broughton Audio without allowing photo-pending records to block the research queue.

The latest completed research additions bring the tracker to **3821 total / 925 researched / 295 pictured / 295 complete / 3526 incomplete / 630 researched-photo-pending**.

**Next exact-order research target:** **Browne Amplification - Alkene - Nashville Drive**.

Photo recovery remains a separate pass. No unverified or substitute image is being promoted.


## Latest PRP1 checkpoint — BSM FuzzBender

The live tracker is authoritative. The current first research-needed record was **BSM - FuzzBender Fuzz Machine**, and it is now researched.

BSM's manufacturer documentation identifies FuzzBender as a handmade germanium fuzz with a switchable Fuzz Face / Vox-Sola Sound Tone Bender character. A later Japanese distributor notice records a **FuzzBender → FaßBender** name change and explicitly states that the contents were unchanged, so the archive treats that as a documented naming successor rather than a circuit revision.

The index, photo/research manifest, and tracker are synchronized. The exact manufacturer source page is attached for future browser-assisted photo recovery, but the pedal remains **Picture: NEEDED / PRP Complete: NEEDED** until a local exact-model image is archived.

**Current tracker totals:** **3,821 total / 958 researched / 300 pictured / 300 complete / 3,521 incomplete / 658 researched-photo-pending**.

**Next exact-order research target:** **BSM - J-Fuzz**.

**Public data version:** **2026-09-19-prp1-bsm-fuzzbender**.


## Latest PRP1 checkpoint — BSQ Effects

PRP has been moved to flexible working sets. The latest completed research pass added **four consecutive BSQ Effects records**: BO-2 Bulls On - Overdrive/Compressor, DM-2 Dynamite - Overdrive/Compressor, MS-2 Mean Street - Distortion + Booster, and SB-1 Scuttle Buttin' - Overdrive.

Each now has an individual research record and synchronized catalog/manifest/tracker links. No photo was marked complete without a verified local exact-model image.

**Verified tracker totals:** **3821 total / 965 researched / 300 pictured / 300 complete / 3521 incomplete / 665 researched-photo-pending**.

**Next exact-order research target:** **Budda - Om Overdrive**.


## Latest PRP1 checkpoint — BYOC Silver Pony

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - Li'l Modified Overdrive; Li'l Mouse; Li'l Yellow OD; Mighty Mouse; Orange Distortion; Overdrive 2; Parametric Overdrive; Screamer Clone; Shredder; and Silver Pony**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Photos remain conservative and unpromoted where no verified image has been archived.

**Verified tracker totals:** **3821 total / 1014 researched / 301 pictured / 300 complete / 3521 incomplete / 714 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - The Full Circle Bass Fuzz**.

**Public data version:** 2026-09-19-prp1-byoc-silver-pony.
## Latest PRP1 checkpoint — BYOC 855 Drive

PRP is continuing in practical working sets rather than a fixed pedal count. The latest completed pass added **10 consecutive exact-order research records**, from **Buffalo FX - Fuzz Face Ge** through **Build Your Own Clone - 855 Drive**.

The records are synchronized across individual research files, PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. No photo was marked complete without a confirmed local exact-model image.

**Verified tracker totals:** **3,821 total / 985 researched / 300 pictured / 300 complete / 3,521 incomplete / 685 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - B.G. Fuzz**.

**Public data version:** 2026-09-19-prp1-byoc-855.


## Latest PRP1 checkpoint — BYOC Fuzz Clone

PRP is continuing in practical working sets rather than a fixed pedal count. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - B.G. Fuzz; Bass Overdrive; Bender Clone; Blue Overdrive; British Blues Overdrive; Classic Overdrive; Crown Jewel; E.S.V. Fuzz; El Distorto Segundo; and Fuzz Clone**.

All ten now have individual Pedal Info research records synchronized into the canonical catalog, photo/research manifest, and PRP tracker. No questionable photo was promoted. BYOC kit-specific component details were recorded as kit options where documented, rather than being presented as universal factory parts.

**Verified tracker totals:** **3821 total / 995 researched / 300 pictured / 300 complete / 3521 incomplete / 695 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - Green Pony**.

**Public data version:** 2026-09-19-prp1-byoc-fuzz-clone.


## Latest PRP1 checkpoint — BYOC Li'l Gray OD

PRP is continuing in practical working sets, with no fixed pedal-count ceiling. The latest completed pass added **10 consecutive exact-order research records**: **Build Your Own Clone - Green Pony; Leeds Fuzz; Li'l Beaver (NYC); Li'l Beaver (Opamp); Li'l Beaver (Ram's Head); Li'l Beaver (Russian); Li'l Beaver (Triangle); Li'l Breaker; Li'l Fuzz; and Li'l Gray OD**.

All ten now have individual Pedal Info research records synchronized into PEDAL_INDEX.json, PEDAL_IMAGES.json, and PRP_TRACKER.csv. Sparse historical BYOC entries were kept conservative rather than assigning unsupported circuit details.

**Verified tracker totals:** **3821 total / 1005 researched / 300 pictured / 300 complete / 3521 incomplete / 705 researched-photo-pending**.

**Next exact-order research target:** **Build Your Own Clone - Li'l Modified Overdrive**.

**Public data version:** 2026-09-19-prp1-byoc-li-l-gray-od.


## PRP1 Batch 133 checkpoint — September 19, 2026

Batch 133 advanced **10 consecutive exact-order research records**: **Bulinski Effect Pedals - Velociraptor Diode Bass Fuzz; Buzzing Bugs Audio Devices - BB01 Fuzz Pre-Amp; BB02 Percolator Fuzz; BB04 Full Range Drive; Bolster; Mortal Joy - Los Campesinos! Collaboration; Byron Amplification - Blood Drive Overdrive; Cabeza Borradora Octave Fuzz; Cowboy Overdrive; and Dark Arts Drive Overdrive**.

All ten now have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Exact-model image source URLs were captured for **9 of the 10** records for future local archival recovery; no image was promoted to a local catalog asset without the archival cache step. Velociraptor remains source-only because the reviewed manufacturer/database material showed version-specific image/control differences that should not be collapsed into one guessed image.

**Verified tracker totals:** **3,821 total / 1,035 researched / 300 pictured / 300 complete / 3,521 incomplete / 735 researched-photo-pending**.

**Next exact-order research target:** **Byron Amplification - Green Concussion Fuzz**.

**Public data version:** **2026-09-19-prp1-batch-133**.


## PRP1 Batch 134 checkpoint — September 19, 2026

Batch 134 added **10 consecutive exact-order research records**: **Byron Amplification - Green Concussion Fuzz; Her Majesty Drive/Fuzz; Jabberwocky Distortion; Lil' Shaman Overdrive; Pai Mei Fuzz; Phattie Overdrive; Poder Del Alma Fuzz; POW! Boost/Drive and Fuzz; Shearling Overdrive; and Viper Ninja Overdrive**.

The pass stayed conservative where Byron's catalog did not expose technical documentation. Jabberwocky, Lil' Shaman, Phattie, and Viper Ninja received documented technical details; the remaining records retain only claims supported by the manufacturer catalog. No questionable photo was promoted.

**Verified tracker totals:** **3,821 total / 1042 researched / 303 pictured / 300 complete / 3521 incomplete / 739 researched-photo-pending**.

**Next exact-order research target:** **BYW Audio - Blacky' Blower**.

**Public data version:** **2026-09-19-prp1-batch-134**.


## PRP1 Batch 135 checkpoint — September 19, 2026

Batch 135 added **10 consecutive exact-order research records**: **BYW Audio - Blacky' Blower; BYW Audio - Gros Buzz; BZZT Electronics - SELEKTOR 16; C.Giant - OD-1 Warm Blues - Overdrive/Distortion; C.I.C - MOD-7 Overdrive; C.Q.O. - Super Distortion; C14 Devices - Tone Chaser; Cactus - MTL-5 Ultra Metal; Cactus - OVD-5 Overdrive; and Cajita Stompboxes - Bdi.ts with Overdrive**.

All ten now have individual Pedal Info research records synchronized into **PEDAL_INDEX.json**, **PEDAL_IMAGES.json**, and **PRP_TRACKER.csv**. Research stayed conservative where the available evidence did not support circuit-level claims. No questionable photo was promoted; the ten remain **Picture: NEEDED** pending exact local image archival.

**Verified tracker totals:** **3821 total / 1052 researched / 303 pictured / 300 complete / 2769 incomplete / 752 researched-photo-pending**.

**Next exact-order research target:** **Cajita Stompboxes - BRIT30 preamplificador tipo Vox AC30 overdrive**.

**Public data version:** **2026-09-19-prp1-batch-135**.


## PRP1 Batch 135 checkpoint — September 19, 2026

Batch 135 advanced the next **10 consecutive exact-order research records**: **BYW Audio - Blacky' Blower; BYW Audio - Gros Buzz; BZZT Electronics - SELEKTOR 16; C.Giant - OD-1 Warm Blues - Overdrive/Distortion; C.I.C - MOD-7 Overdrive; C.Q.O. - Super Distortion; C14 Devices - Tone Chaser; Cactus - MTL-5 Ultra Metal; Cactus - OVD-5 Overdrive; and Cajita Stompboxes - Bdi.ts with Overdrive**.

All ten have individual Pedal Info records synchronized across the canonical catalog, image/research manifest, and tracker. Research stayed conservative where source material was sparse. No questionable image was promoted, so these ten remain photo-pending.

**Verified tracker totals:** **3,821 total / 1,053 researched / 302 pictured / 300 complete / 3,521 incomplete / 753 researched-photo-pending**.

**Next exact-order research target:** **Cajita Stompboxes - BRIT30 preamplificador tipo Vox AC30 overdrive**.

**Public data version:** **2026-09-19-prp1-batch-135**.


## PRP1 Batch 136 checkpoint — September 19, 2026

Batch 136 advanced **5 consecutive exact-order research records**: **Cajita Stompboxes - BRIT30 preamplificador tipo Vox AC30 overdrive; Distorsión Marshall CR800 JCM + booster; Distorsión RAT 6 6 modos; Dr Boogie Distorsion Hi Gain Mesa; and Dr Boogie VN Hi Gain Mesa Boogie**.

All five have individual Pedal Info records synchronized across the canonical catalog, image/research manifest, and tracker. The RAT 6 entry was kept deliberately conservative because the reviewed current storefront confirmed the exact model but did not expose enough model-specific specifications. No questionable image was promoted.

**Verified tracker totals:** **3821 total / 1058 researched / 302 pictured / 300 complete / 2763 incomplete / 758 researched-photo-pending**.

**Next exact-order research targets:** **Cajita Stompboxes - FBASSDRIVE; Cajita Stompboxes - Fuzz RBmuff - TBmuff; Cajita Stompboxes - Fuzz Womut; Cajita Stompboxes - Overdrive Bb.pre; Cajita Stompboxes - Overdrive Shoc más booster**.

**Public data version:** **2026-09-19-prp1-batch-136**.
