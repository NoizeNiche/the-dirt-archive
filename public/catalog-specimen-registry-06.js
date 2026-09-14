(() => {
  // Additional Colorsound / Sola Sound specimens and closely related
  // combination effects. These remain external references unless cleared.
  const specimens = [
    {
      title:'Colorsound Supa Wah-Fuzz', role:'Combination-effect specimen', era:'1970s',
      variant_type:'Treadle / fuzz-wah variant', appearance:'Elongated Colorsound treadle enclosure with dedicated wah/fuzz controls and period graphics.',
      electronics:'Combination wah/fuzz design. Do not assume equivalence with similarly shaped Wah Fuzz, Wow Fuzz or Wah-Fuzz-Straight examples without evidence.',
      caption:'Supa Wah-Fuzz specimen reference. Model naming, treadle hardware and printed control layout should be preserved together.',
      src:'https://www.effectsdatabase.com/model/colorsound/supawahfuzz',
      page:'https://www.effectsdatabase.com/model/colorsound/supawahfuzz', credit:'Effects Database · external identification reference', rights:'Reference'
    },
    {
      title:'Colorsound Supa Wah-Fuzz-Swell', role:'Combination-effect specimen', era:'1970s',
      variant_type:'Three-effect treadle variant', appearance:'Large Colorsound treadle enclosure combining wah, fuzz and swell functions.',
      electronics:'Three-function treadle family. Preserve as a distinct model rather than assuming it is a control-only variation of Wah-Fuzz.',
      caption:'Supa Wah-Fuzz-Swell family specimen reference. The additional swell function is part of the product identity.',
      src:'https://www.effectsdatabase.com/model/colorsound/wahfuzzswell',
      page:'https://www.effectsdatabase.com/model/colorsound/wahfuzzswell', credit:'Effects Database · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Wow Fuzz', role:'Sola Sound specimen', era:'1970s',
      variant_type:'Brand / treadle family', appearance:'Sola Sound branded treadle fuzz-wah family related to Colorsound and RotoSound versions.',
      electronics:'Family identity should be based on the Sola Sound product record and specimen graphics, not on resemblance to Colorsound-branded units.',
      caption:'Sola Sound Wow Fuzz reference. Brand identity is an important archival attribute within the broader treadle network.',
      src:'https://www.effectsdatabase.com/model/solasound/wowfuzz',
      page:'https://www.effectsdatabase.com/model/solasound/wowfuzz', credit:'Effects Database · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Wow Pedal', role:'Sola Sound specimen', era:'1970s',
      variant_type:'Wah family', appearance:'Stand-alone Sola Sound treadle wah enclosure related to Colorsound Wow products.',
      electronics:'Wah family identity; preserve separately from combination Wow Fuzz products even where the enclosure family overlaps.',
      caption:'Sola Sound Wow Pedal reference. A useful control object for distinguishing stand-alone wah from combination-effect variants.',
      src:'https://www.effectsdatabase.com/model/solasound/wow',
      page:'https://www.effectsdatabase.com/model/solasound/wow', credit:'Effects Database · external identification reference', rights:'Reference'
    },
    {
      title:'Colorsound Bass Fuzz', role:'Revival-era specimen', era:'1990s onward',
      variant_type:'Revival / product-family variant', appearance:'Colorsound-branded bass fuzz in the later revival product family.',
      electronics:'Later revival-era bass fuzz related to Jumbo/Supa/B&M design history; do not classify it as a 1970s vintage Colorsound production object under the same name.',
      caption:'Bass Fuzz specimen reference. The revival-era date distinction is essential because the name can invite a false vintage attribution.',
      src:'https://www.effectsdatabase.com/model/colorsound/bassfuzz',
      page:'https://www.effectsdatabase.com/model/colorsound/bassfuzz', credit:'Effects Database · external identification reference', rights:'Reference'
    }
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
