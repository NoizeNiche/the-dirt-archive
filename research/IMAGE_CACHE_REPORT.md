# Pedal Image Cache Report

- Cached in this run: **3**
- Staged browser photos converted: **0**
- Local images retained/reorganized: **0**
- Cleared stale/quarantined local image references: **0**
- Download failures: **4**
- Remaining tracker photo backlog: **130**
- Researched, photo pending: **130**
- External source images awaiting localization: **0**

## Storage layout

- Primary image: `assets/pedals/{builder}/{pedal}/primary.webp`
- Colorway/edition image: `assets/pedals/{builder}/{pedal}/variants/{variant}.webp`
- Original source URL remains stored as `image_source_url`.

## Newly cached

- RYRA - The Klone -> `./assets/pedals/ryra/the-klone/primary.webp`
- VOX - Ice 9 Overdrive -> `./assets/pedals/vox/ice-9-overdrive/primary.webp`
- Xotic Effects - SL Drive — Distortion / Overdrive -> `./assets/pedals/xotic-effects/sl-drive-distortion-overdrive/primary.webp`

## Still external / failed

- Bad Cat - Double Drive - Stackable Overdrive: https://rvb-img.reverb.com/i/s--_2x4wC4z--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/xssmspqlgqw4o4jvttzb.jpg: curl: (22) The requested URL returned error: 500 | https://media.guitarcenter.com/is/image/MMGS7/L81332000001000-00-86x86.jpg: source image dimensions below 120px (`https://rvb-img.reverb.com/i/s--_2x4wC4z--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/xssmspqlgqw4o4jvttzb.jpg`)
- Collateral FX - P031 Zeugma Fuzz: https://rvb-img.reverb.com/i/s--TVI901eJ--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/be2a7c96-dd48-417b-b680-f89664e8c439.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--TVI901eJ--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain/be2a7c96-dd48-417b-b680-f89664e8c439.jpg`)
- Compulsive Audio - Hair Band Distortion: https://rvb-img.reverb.com/i/s--Pr3LLNGk--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain%2Ctrim.top%3D0%2Ctrim.left%3D0%2Ctrim.width%3D3024%2Ctrim.height%3D3024/duit0yyskhthfnxklild.jpg: curl: (22) The requested URL returned error: 500 (`https://rvb-img.reverb.com/i/s--Pr3LLNGk--/quality%3Dmedium-low%2Cheight%3D800%2Cwidth%3D800%2Cfit%3Dcontain%2Ctrim.top%3D0%2Ctrim.left%3D0%2Ctrim.width%3D3024%2Ctrim.height%3D3024/duit0yyskhthfnxklild.jpg`)
- Way Huge - Saucy Box Overdrive: https://static.bax-shop.es/image/product/148222/965920/9d638cba/450x450/1489504636Way%20Huge%20WHE205%20Saucy%20Box%20overdrive%20front.JPG: invalid image data: cannot identify image file <_io.BytesIO object at 0x7f16a657fb50> (`https://static.bax-shop.es/image/product/148222/965920/9d638cba/450x450/1489504636Way%20Huge%20WHE205%20Saucy%20Box%20overdrive%20front.JPG`)

These records remain externally referenced until a later cache run succeeds.
