(() => {
  // Catalinbread specimen layer. Manufacturer pages are used as source leads;
  // imagery remains external reference-only unless independently cleared.
  const specimens = [
    {
      builder:'Catalinbread', title:'Fuzzrite', role:'Manufacturer specimen', era:'Current production',
      variant_type:'Silicon recreation', appearance:'Compact modern Catalinbread enclosure with Fuzzrite branding.',
      electronics:'Silicon Fuzzrite recreation. Keep distinct from the Catalinbread Germanium edition.',
      caption:'Current Fuzzrite manufacturer specimen. Visual identity is documented separately from the original Mosrite-era object.',
      src:'https://catalinbread.com/products/fuzzrite', page:'https://catalinbread.com/products/fuzzrite', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Fuzzrite Germanium', role:'Manufacturer specimen', era:'Current production',
      variant_type:'Electronics variant', appearance:'Current Catalinbread Fuzzrite Germanium enclosure and graphics.',
      electronics:'Catalinbread documents two NOS PNP germanium semiconductors plus a polarity-inverter IC; modern/vintage switching changes the low-end response.',
      caption:'Germanium Fuzzrite specimen. This is an electronics-defined variant, not merely a different colorway.',
      src:'https://catalinbread.com/products/fuzzrite-germanium', page:'https://catalinbread.com/products/fuzzrite-germanium', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Fuzzrite Germanium', role:'Manufacturer specimen', era:'White limited run',
      variant_type:'Colorway / limited production variant', appearance:'White enclosure limited-edition finish.',
      electronics:'Germanium Fuzzrite family. Finish is recorded independently from the Germanium electronics identity.',
      caption:'White Germanium Fuzzrite colorway. Preserve the white finish as appearance metadata while retaining the Germanium product identity.',
      src:'https://catalinbread.com/products/fuzzrite-germanium-white', page:'https://catalinbread.com/products/fuzzrite-germanium-white', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Fuzzrite Mini', role:'Format specimen', era:'Current production',
      variant_type:'Mini enclosure / format variant', appearance:'Reduced-format Catalinbread enclosure.',
      electronics:'Fuzzrite-family recreation; catalog separately because enclosure format and product identity differ from full-size versions.',
      caption:'Fuzzrite Mini manufacturer specimen. Format is treated separately from electronics unless a revision is documented.',
      src:'https://catalinbread.com/products/fuzzrite-mini', page:'https://catalinbread.com/products/fuzzrite-mini', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Sabbra Cadabra', role:'Manufacturer specimen', era:'Current production',
      variant_type:'Standard production', appearance:'Standard Sabbra Cadabra enclosure and artwork.',
      electronics:'Current Sabbra Cadabra product. Do not infer component identity from the standard enclosure alone.',
      caption:'Standard Sabbra Cadabra manufacturer specimen.',
      src:'https://catalinbread.com/products/sabbra-cadabra', page:'https://catalinbread.com/products/sabbra-cadabra', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Sabbra Cadabra', role:'Colorway specimen', era:'10th Anniversary',
      variant_type:'Colorway / anniversary edition', appearance:'Sparkle Red 10th Anniversary artwork with “10” motif.',
      electronics:'Manufacturer states the anniversary release uses the same Sabbra circuit. The red finish is therefore an appearance/edition distinction.',
      caption:'10th Anniversary Sparkle Red Sabbra specimen. A textbook example of a colorway that does not automatically imply a circuit change.',
      src:'https://catalinbread.com/products/sabbra-cadabra-10th-anniversary-edition', page:'https://catalinbread.com/products/sabbra-cadabra-10th-anniversary-edition', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'SFT', role:'Manufacturer specimen', era:'Current production',
      variant_type:'Artwork variant', appearance:'Current SFT enclosure with modern artwork.',
      electronics:'Current SFT design. Manufacturer describes newer artwork while retaining the same insides on the current page.',
      caption:'Current SFT specimen. Artwork change is recorded separately from circuit identity.',
      src:'https://catalinbread.com/products/sft2', page:'https://catalinbread.com/products/sft2', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'SFT', role:'Limited colorway specimen', era:'Blackout Series',
      variant_type:'Colorway / graphics variant', appearance:'Black-on-black Blackout Series enclosure and graphics.',
      electronics:'Same SFT family; the Blackout series description identifies the blacked-out visual treatment as a limited series rather than a new circuit.',
      caption:'SFT Blackout specimen. Appearance is explicitly tracked separately from the standard SFT product identity.',
      src:'https://catalinbread.com/products/sft-blackout-series', page:'https://catalinbread.com/products/sft-blackout-series', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Dirty Little Secret', role:'Manufacturer specimen', era:'Current / historical production',
      variant_type:'Foundation overdrive family', appearance:'Compact Catalinbread enclosure with Dirty Little Secret artwork.',
      electronics:'Foundation overdrive emulating classic Marshall Plexi/Super Lead/Super Bass behavior; current page documents internal mode and presence controls.',
      caption:'Dirty Little Secret manufacturer specimen. Historical revisions should be layered beneath the model identity rather than overwritten.',
      src:'https://catalinbread.com/products/dirty-little-secret', page:'https://catalinbread.com/products/dirty-little-secret', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    },
    {
      builder:'Catalinbread', title:'Dirty Little Secret Deluxe', role:'Manufacturer specimen', era:'Current production',
      variant_type:'Expanded product / generation branch', appearance:'Larger enclosure with Deluxe artwork and expanded control set.',
      electronics:'Expanded all-discrete amp-in-a-box architecture adding phase inverter, power-amp simulation and output-transformer modeling plus a footswitchable boost.',
      caption:'Dirty Little Secret Deluxe specimen. Treat as a separate product identity rather than simply a color or enclosure revision of the original DLS.',
      src:'https://catalinbread.com/products/dirty-little-secret-deluxe', page:'https://catalinbread.com/products/dirty-little-secret-deluxe', credit:'Catalinbread Effects · manufacturer source', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
