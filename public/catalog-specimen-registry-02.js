(() => {
  // Tone Bender / OEM specimen layer. This registry deliberately separates
  // appearance, product identity, and electronics. These are reference images
  // unless rights are explicitly marked Cleared.
  const specimens = [
    {
      title:'Sola Sound Tone Bender MkI', role:'Primary vintage specimen', era:'1965',
      variant_type:'Early production / appearance variant', appearance:'Gold-and-black folded-steel wedge; early examples may show hand-applied lettering.',
      electronics:'Three-transistor germanium fuzz; early examples documented with OC75 and 2G381-family devices.',
      caption:'Early British Tone Bender MKI specimen. The earliest production enclosure and later screened examples should remain distinguishable.',
      src:'https://fuzzboxes.org/wp-content/uploads/2021/05/Sola-Sound-Tone-Bender-MKI-01.jpg',
      page:'https://fuzzboxes.org/tonebendermki', credit:'Fuzzboxes.org · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender Mk1.5', role:'Primary vintage specimen', era:'1965–1966',
      variant_type:'Transitional model / circuit identity', appearance:'Cast aluminium hammertone enclosure, normally grey; rare gold-painted examples exist.',
      electronics:'Two-transistor germanium circuit, commonly OC75; early examples can use a 500k level pot and some use Impex S3-1T devices.',
      caption:'The collector term MK1.5 is retrospective. This specimen represents the distinct two-transistor transitional Tone Bender, not merely a different finish.',
      src:'https://fuzzboxes.org/wp-content/uploads/2021/05/Sola-Sound-Tone-Bender-MK1.5-03.webp',
      page:'https://fuzzboxes.org/transitionaltonebender', credit:'Fuzzboxes.org · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender Mk1.5', role:'Rare color / electronics specimen', era:'1965–1966',
      variant_type:'Colorway + production variant', appearance:'Rare gold-painted cast enclosure, distinct from the common grey hammertone appearance.',
      electronics:'Two-transistor germanium MK1.5 circuit; documented Goldie example includes early-production features.',
      caption:'Rare gold MK1.5 specimen known as “Goldie.” Color alone is not the identity: the two-transistor circuit and other early-production features are separately documented.',
      src:'https://fuzzboxes.org/wp-content/uploads/2021/05/Goldie-01.jpg',
      page:'https://fuzzboxes.org/transitionaltonebender', credit:'Fuzzboxes.org · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender MkII', role:'Short-board specimen', era:'1966',
      variant_type:'Electronics / construction variant', appearance:'Cast enclosure with Professional MKII graphics; early units can retain MK1.5-era enclosure hardware.',
      electronics:'Three-transistor germanium MKII. Early “short-board” examples are modified MK1.5 units with the older stripboard rearranged to accommodate the added gain stage.',
      caption:'Short-board MKII specimen. This is precisely the kind of object where the exterior does not tell the complete electronics story.',
      src:'https://fuzzboxes.org/wp-content/uploads/2021/05/Sola-Sound-Tone-Bender-MKII-short-board-01.jpg',
      page:'https://fuzzboxes.org/tonebendermkii', credit:'Fuzzboxes.org · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender MkII', role:'Large-board specimen', era:'1966–1968',
      variant_type:'Production construction variant', appearance:'Professional MKII cast enclosure with the conventional larger circuit board.',
      electronics:'Three-transistor germanium Professional MKII; documented production includes OC75, Impex S3-1T and late OC81D examples.',
      caption:'Conventional large-board MKII production specimen. Keep it separate from short-board conversions even though the model name is the same.',
      src:'https://mmguitarbar.com/cdn/shop/files/medium_8e8c89d1-2f75-49ca-866d-5a8d3bc67bad.jpg?v=1760468335',
      page:'https://mmguitarbar.com/products/2011-sola-sound-professional-mkii-tone-bender-david-main-dam-mint-w-box-oc81-germanium', credit:'MM Guitar Bar · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender MkIII', role:'Family specimen', era:'1968 onward',
      variant_type:'Generation / electronics family', appearance:'Punched-metal three-control enclosure family; branding and graphics vary by production and OEM customer.',
      electronics:'Three-transistor fuzz family with documented germanium and later silicon production changes; exact specimen should be identified from circuit evidence.',
      caption:'MKIII family specimen. Do not treat every three-knob Tone Bender as electronically identical.',
      src:'https://www.premierguitar.com/media-library/image.jpg?id=25786039&quality=70&width=800',
      page:'https://www.premierguitar.com/gear/fifty-years-of-filth-the-story-of-the-mighty-tone-bender-fuzz', credit:'Premier Guitar · external identification reference', rights:'Reference'
    },
    {
      title:'Sola Sound Tone Bender MkIV', role:'Family specimen', era:'1969–1970s',
      variant_type:'Generation / enclosure variant', appearance:'Later, more compact Tone Bender enclosure with changing graphics and OEM presentations.',
      electronics:'MKIII/MKIV-related silicon/germanium production history varies by period; do not infer semiconductor type from case graphics alone.',
      caption:'MKIV family specimen. The archive should preserve concurrent enclosure and circuit histories rather than forcing a single rigid ladder.',
      src:'https://www.macaris.co.uk/UserFiles/images/products/1600x1600/4xmk11600.jpg',
      page:'https://www.macaris.co.uk/colorsound', credit:'Macari’s / Sola Sound · external identification reference', rights:'Reference'
    },
    {
      title:'Vox Tone Bender Professional MKII', role:'OEM specimen', era:'1967–1968',
      variant_type:'OEM / British production', appearance:'Vox-branded cast enclosure, silver/grey hammertone, two control knobs.',
      electronics:'British Sola Sound Professional MKII family; late production includes documented OC81D examples.',
      caption:'British-built Vox Professional MKII. This is distinct from the Italian V828 even though both carry Vox Tone Bender branding.',
      src:'https://rvb-img.reverb.com/image/upload/s--qNWXq0J9--/f_auto%2Ct_large/v1657922179/zz5p8msjnumrvlozirxc.jpg',
      page:'https://reverb.com/item/57901229-vox-tone-bender-mkii-oc81d-mullard-sola-sound-1967-jimmy-page', credit:'Reverb seller listing · external identification reference', rights:'Reference'
    },
    {
      title:'Vox V828 Tone Bender', role:'Italian OEM specimen', era:'1966–1970s',
      variant_type:'OEM / country-of-origin variant', appearance:'Cast aluminium enclosure with printed Vox faceplate; grey and later black versions are documented.',
      electronics:'Italian JEN/EME PCB-based two- and later three-transistor variants; related to the MK1.5 topology but not the British MK1.5 product.',
      caption:'V828 specimen. The model number and Italian manufacture are essential identity fields because this is a separate branch from the British Tone Bender lineage.',
      src:'https://rvb-img.reverb.com/image/upload/s--KLrtO5Y6--/a_0/f_auto%2Ct_large/v1704077842/qppxd7itbg1klvr5un2y.jpg',
      page:'https://reverb.com/au/item/77694850-vox-tone-bender-italian-model-v828-1960s-black', credit:'Reverb seller listing · external identification reference', rights:'Reference'
    },
    {
      title:'Marshall SupaFuzz', role:'OEM specimen', era:'1966–1972+',
      variant_type:'OEM / production variant', appearance:'Silver/grey hammertone Tone Bender-style enclosure with Marshall Supa-Fuzz graphics; later versions changed appearance.',
      electronics:'Sola Sound Professional MKII-derived germanium family in early production, with later Marshall production changes.',
      caption:'Marshall Supa-Fuzz specimen showing the OEM relationship without collapsing it into the Vox or Sola Sound product record.',
      src:'https://knowyourvintageguitars.be/cdn/shop/products/image_349c476f-8dd9-40d2-a4c1-e0da4239fd8b_3024x.jpg?v=1615034318',
      page:'https://knowyourvintageguitars.be/products/marshall-supa-fuzz', credit:'Know Your Vintage Guitars · external identification reference', rights:'Reference'
    },
    {
      title:'Rotosound Fuzz Box', role:'OEM specimen', era:'1960s–1970s',
      variant_type:'OEM / multi-generation family', appearance:'Multiple Tone Bender-derived enclosure and graphic forms are documented across production.',
      electronics:'Sola Sound supplied more than one Tone Bender generation for Rotosound; identify the individual specimen by its enclosure, controls and circuit evidence.',
      caption:'Rotosound Fuzz Box family record. Model naming alone is insufficient because the same commercial name spans different Tone Bender-derived generations.',
      src:'https://fuzzboxes.org/wp-content/uploads/2021/05/Sola-Sound-Tone-Bender-MKIII-01.jpg',
      page:'https://fuzzboxes.org/features/tonebenders', credit:'Fuzzboxes.org · external identification reference', rights:'Reference'
    }
  ];

  const existing = Array.isArray(window.DIRT_SPECIMENS) ? window.DIRT_SPECIMENS : [];
  window.DIRT_SPECIMENS = existing.concat(specimens);
})();
