(() => {
  // Super-Fuzz network specimen references. Keep Honey, Shin-Ei, Companion,
  // Univox and other OEM identities distinct even when the lineage is shared.
  const specimens = [
    {
      title:'Honey Baby Crying', role:'Early family specimen', era:'1967',
      variant_type:'Earliest Super-Fuzz family branch', appearance:'Black rectangular Japanese enclosure with Fresh Sounds Honey Co. Ltd. branding and single central footswitch.',
      electronics:'Source listing identifies Matsushita C828 transistors. Treat individual component claims as specimen-level evidence rather than a universal specification.',
      caption:'Early Honey “Baby Crying” specimen. This object anchors the documented Super-Fuzz family chronology before the Shin-Ei-branded FY-6.',
      src:'https://rvb-img.reverb.com/image/upload/s--vCkxqp1m--/a_0/t_card-square/v1696568257/yarwxsqtrou5q9fsczay.jpg',
      page:'https://reverb.com/item/74129150-1967-honey-baby-crying-the-original-super-fuzz-with-box-manual-pre-shin-ei-univox', credit:'Reverb listing · external identification reference', rights:'Reference'
    },
    {
      title:'Shin-Ei Companion FY-6 Super Fuzz', role:'Early Shin-Ei specimen', era:'1968',
      variant_type:'Shin-Ei-branded family continuation', appearance:'Textured silver/grey folded enclosure with red-and-white Shin-ei Companion badge and single footswitch.',
      electronics:'FY-6 family circuit; exact individual component populations should be recorded only when tied to a specific specimen or documented production source.',
      caption:'Early Shin-Ei-branded FY-6 specimen. The badge and enclosure help distinguish it from earlier Honey and later private-label examples.',
      src:'https://rvb-img.reverb.com/image/upload/s--_qRFjpa2--/a_0/f_auto,t_large/v1703397732/hdrirruav9ggfpqoxequ.jpg',
      page:'https://reverb.com/item/77462252-ultra-rare-original-shin-ei-companion-fy-6-1968-vintage-fuzz', credit:'Reverb listing · external identification reference', rights:'Reference'
    },
    {
      title:'Shin-Ei Companion WF-24 8-Tr Fuzz Wah', role:'Integrated-effect specimen', era:'1970s',
      variant_type:'Fuzz + wah / multi-control variant', appearance:'Black wedge enclosure with long treadle, separate fuzz section and dual switching.',
      electronics:'Integrated fuzz/wah family; individual seller documentation identifies original C945 silicon transistors on a related Companion 6TR example. Do not transfer that component claim to every WF-24 specimen.',
      caption:'Companion fuzz/wah specimen. The treadle hardware and separate fuzz controls are primary identification clues.',
      src:'https://rvb-img.reverb.com/image/upload/s--7n17H_IO--/f_auto,t_large/v1666926053/evrjuf4js6hkhwx2r5ff.jpg',
      page:'https://reverb.com/item/62644793-shin-ei-companion-6tr-fuzz-wah-vintage-guitar-effects-pedal-silicon-fuzz-japan', credit:'Reverb listing · external identification reference', rights:'Reference'
    },
    {
      title:'Univox U-1095 Super-Fuzz', role:'North American specimen', era:'c. 1970s',
      variant_type:'Unicord / Univox OEM branch', appearance:'Red textured enclosure with blue raised Super-Fuzz footplate; earlier and later enclosure constructions are known.',
      electronics:'Super-Fuzz family lineage. Production-era and component differences should be handled as separate generation/specimen attributes rather than inferred from the red/blue finish.',
      caption:'Vintage Univox U-1095 specimen. The red/blue appearance is recorded separately from its Univox/Unicord product identity and production generation.',
      src:'https://www.maharsvintageguitars.com/cdn/shop/files/univox-super-fuzz-u-1095-red-blue-1972-8266558.jpg?v=1763874006&width=1200',
      page:'https://www.maharsvintageguitars.com/collections/effect-pedals', credit:'Mahar’s Vintage Guitars · external identification reference', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
