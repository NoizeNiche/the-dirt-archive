(() => {
  // Catalinbread special-edition specimen layer. Limited graphics and
  // colorways are separated from genuine circuit/product changes.
  const specimens = [
    {
      builder:'Catalinbread', title:'Dirty Little Secret', role:'Special edition specimen', era:'Limited / DLS Red',
      variant_type:'Electronics variant / limited edition', appearance:'Red special-edition enclosure and DLS Red artwork.',
      electronics:'Catalinbread describes DLS Red as a modified version of the flagship DLS circuitry with refined gain stages, extended gain, revised EQ and a changed tonal profile. This is therefore not merely a red colorway.',
      caption:'Dirty Little Soda / DLS Red specimen. The red enclosure is visually distinctive, but the documented circuit changes make this a real product variant as well.',
      src:'https://catalinbread.com/products/dirty-little-soda-dls-red', page:'https://catalinbread.com/products/dirty-little-soda-dls-red', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Dirty Little Secret Deluxe', role:'Limited colorway specimen', era:'Focus Pro Audio exclusive',
      variant_type:'Colorway / retailer exclusive', appearance:'Purple retailer-exclusive enclosure/graphics.',
      electronics:'Treat as the Dirty Little Secret Deluxe design unless separate evidence establishes an electrical change. Retailer exclusivity alone is not a circuit identity.',
      caption:'Purple Dirty Little Secret Deluxe specimen from the retailer-exclusive program. Finish is recorded independently from electronics.',
      src:'https://catalinbread.com/collections/exclusives', page:'https://catalinbread.com/collections/exclusives', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'RAH', role:'Limited colorway specimen', era:'Focus Pro Audio exclusive',
      variant_type:'Colorway / retailer exclusive', appearance:'Purple retailer-exclusive enclosure/graphics.',
      electronics:'Treat as the RAH design unless independent documentation identifies an electronics revision.',
      caption:'Purple RAH specimen from the retailer-exclusive program. Colorway is stored separately from product/circuit identity.',
      src:'https://catalinbread.com/collections/exclusives', page:'https://catalinbread.com/collections/exclusives', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Echorec', role:'Limited colorway specimen', era:'Focus Pro Audio exclusive',
      variant_type:'Colorway / retailer exclusive', appearance:'Purple retailer-exclusive Echorec enclosure/graphics.',
      electronics:'Preserve as an appearance/retailer edition unless separate evidence establishes a circuit revision.',
      caption:'Purple Echorec specimen. This is the kind of edition that belongs in the specimen gallery without becoming a separate model record.',
      src:'https://catalinbread.com/collections/exclusives', page:'https://catalinbread.com/collections/exclusives', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Topanga', role:'Limited colorway specimen', era:'Focus Pro Audio exclusive',
      variant_type:'Colorway / retailer exclusive', appearance:'Purple retailer-exclusive Topanga enclosure/graphics.',
      electronics:'Treat as the Topanga design unless independent evidence identifies an electrical revision.',
      caption:'Purple Topanga specimen. Retailer-exclusive finish is preserved as appearance metadata.',
      src:'https://catalinbread.com/collections/exclusives', page:'https://catalinbread.com/collections/exclusives', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Sabbra Cadabra', role:'Limited colorway specimen', era:'Sweetwater exclusive',
      variant_type:'Colorway / retailer exclusive', appearance:'Clearwell retailer-exclusive Sabbra Cadabra appearance.',
      electronics:'Do not infer a circuit change from the retailer-exclusive finish without separate documentation.',
      caption:'Sabbra Cadabra Clearwell specimen. Preserved as a colorway/retailer edition under the core model.',
      src:'https://catalinbread.com/collections/exclusives', page:'https://catalinbread.com/collections/exclusives', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
