(() => {
  // Big Muff / Fuzz Face specimen layer. Reference images stay external until
  // a license-compatible or Archive-owned copy is independently cleared.
  const specimens = [
    {
      title:'Big Muff Pi', role:'Triangle / V1 specimen', era:'c. 1969–1973',
      variant_type:'Generation / circuit-family variant', appearance:'Early plain metallic enclosure with black graphics and triangular control layout.',
      electronics:'Four-transistor Big Muff circuit family; documented V1 production contains numerous component-value variations between individual examples.',
      caption:'Triangle Big Muff specimen. The Triangle designation is retrospective and describes the control layout; individual early units can differ in component values.',
      src:'https://rvb-img.reverb.com/image/upload/s--R0-NVLqF--/f_auto,t_large/v1712594752/gchm2kcg0t8ozsxw8erz.png',
      page:'https://reverb.com/uk/p/electro-harmonix-big-muff-pi-v1-triangle', credit:'Reverb listing · external identification reference', rights:'Reference'
    },
    {
      title:'Big Muff Pi', role:'Ram’s Head / V2 specimen', era:'1973–1976',
      variant_type:'Generation / circuit-family variant', appearance:'Larger enclosure, row-mounted controls, beige/cream finish with red Big Muff graphic and Ram’s Head-era artwork.',
      electronics:'Four-transistor Big Muff family; V2 production contains multiple documented circuit variants.',
      caption:'Ram’s Head-era specimen. The visual change from the Triangle enclosure corresponds to a new production generation, not merely a paint change.',
      src:'https://www.ikebe-gakki.com/Contents/ProductImages/0/863802_LL.jpg',
      page:'https://www.ikebe-gakki.com/Form/Product/ProductDetail.aspx?bid=ec&pid=863802&shop=0', credit:'Ikebe Gakki · external identification reference', rights:'Reference'
    },
    {
      title:'Big Muff Pi', role:'EHX / Sovtek specimen', era:'1990s Russian branch',
      variant_type:'Country / manufacturer lineage variant', appearance:'Military-green metal enclosure with dark Big Muff graphics and Soviet/Russian markings.',
      electronics:'Russian-production Big Muff branch; retain separate from NYC USA generations and identify individual production revisions where documented.',
      caption:'Russian/Sovtek branch specimen. Country-of-origin, enclosure, labeling and production lineage distinguish this family from the classic NYC versions.',
      src:'https://i.ebayimg.com/images/g/r0AAAOSwGDhnvIFl/s-l1200.jpg',
      page:'https://www.ebay.com/itm/205313121267', credit:'eBay listing · external identification reference', rights:'Reference'
    },
    {
      title:'Fuzz Face', role:'Red vintage specimen', era:'1968',
      variant_type:'Production/color specimen', appearance:'Red circular Dallas-Arbiter enclosure with black center plate and white label.',
      electronics:'Vintage germanium Fuzz Face example identified in the source listing with NKT-275 devices; exact electronics should follow specimen-level evidence.',
      caption:'Worn red Dallas-Arbiter specimen. The red finish is an appearance attribute; the exact transistor set belongs to the specimen record.',
      src:'https://rvb-img.reverb.com/image/upload/s--p28G15Q8--/f_auto,t_large/v1536510703/bbclzi32mtlqssgkhzsp.jpg',
      page:'https://reverb.com/item/14955899-vintage-original-red-1968-dallas-arbiter-fuzz-face-guitar-effect-pedal-nkt-275', credit:'Reverb listing · external identification reference', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
