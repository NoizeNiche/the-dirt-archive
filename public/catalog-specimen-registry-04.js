(() => {
  // BOSS / Ibanez / ProCo specimen references. External photographs remain
  // reference-only until an explicit compatible reuse right is established.
  const specimens = [
    {
      title:'BOSS OD-1 OverDrive', role:'Early production specimen', era:'1977',
      variant_type:'First-generation Compact pedal', appearance:'Yellow BOSS compact enclosure with two recessed controls: Level and Over Drive.',
      electronics:'Early OD-1 production includes documented quad-op-amp variants; first-year examples are especially useful for production identification.',
      caption:'First-generation OD-1 specimen. Control layout and early enclosure details are more useful for identification than color alone.',
      src:'https://stangguitars.com/cdn/shop/files/VINTAGEBOSSOD-119771_grande.jpg?v=1747180389',
      page:'https://stangguitars.com/products/vintage-boss-od-1-1977', credit:'Stang Guitars · external identification reference', rights:'Reference'
    },
    {
      title:'BOSS SD-1 Super OverDrive', role:'Early Japanese specimen', era:'1980s',
      variant_type:'Early production / country-of-origin specimen', appearance:'Yellow BOSS compact enclosure with Level, Tone and Drive controls and early Japanese labeling.',
      electronics:'OD-1-derived asymmetric clipping architecture with added tone control; production technology changed over the model’s life and should be tracked by era.',
      caption:'Early Japanese SD-1 specimen. The 1980s enclosure is visually distinct while the production electronics should remain a separate research field.',
      src:'https://www.wolfmusiccompany.com/cdn/shop/files/gxonbx8n5movobhl9nma.jpg?v=1736122458',
      page:'https://www.wolfmusiccompany.com/products/used-boss-sd-1-made-in-japan-1980s', credit:'Wolf Music Company · external identification reference', rights:'Reference'
    },
    {
      title:'Ibanez TS-9 Tube Screamer', role:'Vintage Japanese specimen', era:'1982–1984',
      variant_type:'TS-9 production specimen', appearance:'Green narrow enclosure with three controls and the raised black footswitch plate.',
      electronics:'Original Japanese TS-9 production belongs to the early Tube Screamer family; exact IC/component substitutions should be tied to serial/era evidence rather than assumed from the green finish.',
      caption:'Vintage TS-9 specimen. Useful for distinguishing the TS-9 enclosure/control identity from the earlier TS808 and later reissues.',
      src:'https://www.fairdealmusic.co.uk/cdn/shop/files/DSC09121_037d0963-773d-425d-b703-be5d9b29ce12_1200x1800.jpg?v=1724157204',
      page:'https://www.fairdealmusic.co.uk/products/ibanez-ts9-tube-screamer-1982-1984-used', credit:'Fair Deal Music · external identification reference', rights:'Reference'
    },
    {
      title:'RAT', role:'Vintage production specimen', era:'Original / big-box to later production',
      variant_type:'Enclosure / production-era specimen', appearance:'Black ProCo enclosure with the characteristic three-control layout; enclosure geometry changed across production periods.',
      electronics:'RAT production spans multiple hardware and manufacturing periods. Generation-specific component changes should be documented separately from the black enclosure appearance.',
      caption:'RAT specimen reference. The Archive should distinguish big-box, small-box and later RAT-family variants rather than treating every black RAT as identical.',
      src:'https://rvb-img.reverb.com/image/upload/s--hyOnb7yq--/a_0/f_auto,t_large/v1715957780/st5df3oux9gyyqiff9qo.jpg',
      page:'https://reverb.com/item/82233204-proco-rat2-anfang-2000er-usa-original-box', credit:'Reverb listing · external identification reference', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
