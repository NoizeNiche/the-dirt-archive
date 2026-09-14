(() => {
  // Visual specimen registry. Keep appearance, electronics, and provenance separate.
  // A specimen may represent a colorway without implying a circuit change.
  // When evidence supports an electronics distinction, use variant/electronics fields.
  window.DIRT_SPECIMENS = [
    {
      title:'Fuzz Face', role:'Primary example', era:'1966–1967', rights:'Cleared',
      caption:'Early Arbiter-era round enclosure specimen.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dallas_Arbiter_Fuzz_Face.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Dallas_Arbiter_Fuzz_Face.jpg', credit:'sploshette · CC BY 2.0',
      variant:'Arbiter / early germanium', electronics:{semiconductor_family:'Germanium', notes:'Early production family; component details should be tied to the documented generation rather than inferred from color.'}
    },
    {
      title:'Tone Bender', role:'Reference specimen', era:'1960s', rights:'Cleared',
      caption:'British Tone Bender family specimen for enclosure and graphic identification.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1966_VOX_TONE_BENDER_FUZZ.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1966_VOX_TONE_BENDER_FUZZ.jpg', credit:'Wikimedia Commons · CC BY 2.0',
      variant:'OEM / Vox-branded family', electronics:{semiconductor_family:'Germanium / generation dependent', notes:'Do not treat the family name alone as proof of a single component set.'}
    },
    {
      title:'Big Muff Pi', role:'Primary example', era:'NYC era', rights:'Cleared',
      caption:'NYC Big Muff specimen used for family-level visual identification.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Electro_Harmonix_Big_Muff.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Electro_Harmonix_Big_Muff.jpg', credit:'Skimel · CC BY-SA 4.0',
      variant:'NYC Big Muff family', electronics:{semiconductor_family:'Silicon', notes:'Generation-specific component substitutions belong in the generation record, not the colorway label.'}
    },
    {
      title:'TS808 Tube Screamer', role:'Primary example', era:'1979–1981', rights:'Cleared',
      caption:'Original-style TS808 enclosure and control layout reference.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_TS808_Tube_Screamer_%2848588080527%29_cropped.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_TS808_Tube_Screamer_%2848588080527%29_%28cropped%29.jpg', credit:'Guitar Chalk · CC BY 2.0',
      variant:'TS808 / early compact', electronics:{semiconductor_family:'Op-amp overdrive', notes:'Component changes should be recorded by production generation where documented.'}
    },
    {
      title:'RAT', role:'Primary example', era:'Original production', rights:'Cleared',
      caption:'ProCo RAT enclosure specimen for visual identification.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Proco-rat.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Proco-rat.jpg', credit:'Jazzman · Wikimedia Commons · see file page for license',
      variant:'Original RAT family', electronics:{semiconductor_family:'Silicon', notes:'RAT revisions and production changes must remain generation-specific.'}
    },
    {
      title:'MXR M-104 Distortion+', role:'Primary example', era:'1979', rights:'Cleared',
      caption:'1979 Distortion+ specimen.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1979_MXR_Distortion_%2B.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1979_MXR_Distortion_%2B.jpg', credit:'Wikimedia Commons · licensed image, see file page',
      variant:'Vintage M-104', electronics:{semiconductor_family:'Silicon diode clipping', notes:'Specific diode or transistor substitutions should be documented only with source-backed evidence.'}
    },
    {
      title:'BOSS DS-1 Distortion', role:'Primary example', era:'Original production', rights:'Cleared',
      caption:'Classic orange DS-1 enclosure specimen.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss-DS-1.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss-DS-1.jpg', credit:'Matt Eason · CC BY-SA 3.0 / GFDL',
      variant:'Classic orange', electronics:{semiconductor_family:'Silicon distortion', notes:'Color is an appearance attribute; production/electronics revisions are tracked separately.'}
    },
    {
      title:'Vox Tone Bender', role:'Primary example', era:'British OEM branch', rights:'Cleared',
      caption:'Vox-branded Tone Bender specimen.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Vox_Tone_Bender.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Vox_Tone_Bender.jpg', credit:'Johann Burkard · CC BY 2.0',
      variant:'Vox-branded', electronics:{semiconductor_family:'Germanium / model dependent', notes:'OEM identity and circuit lineage are tracked independently from finish.'}
    },
    {
      title:'Colorsound Supa Tonebender', role:'Primary example', era:'1970s', rights:'Cleared',
      caption:'Supa Tonebender specimen from the 1970s.',
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png',
      page:'https://commons.wikimedia.org/wiki/File:Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png', credit:'Wikimedia Commons · licensed image, see file page',
      variant:'1974 specimen', electronics:{semiconductor_family:'Silicon', notes:'Supa Tonebender family; distinguish documented production variants from cosmetic changes.'}
    }
  ];
})();
