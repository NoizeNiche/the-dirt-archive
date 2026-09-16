(() => {
  const images = {
    'Fuzz Face': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dallas_Arbiter_Fuzz_Face.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Dallas_Arbiter_Fuzz_Face.jpg',
      credit:'sploshette · CC BY 2.0'
    },
    'Tone Bender': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1966_VOX_TONE_BENDER_FUZZ.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1966_VOX_TONE_BENDER_FUZZ.jpg',
      credit:'sploshette · CC BY 2.0'
    },
    'Colorsound Supa Tonebender': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png',
      page:'https://commons.wikimedia.org/wiki/File:Sola_Sound_Colorsound_Supa_Tonebender,_from_1974.png',
      credit:'Wikimedia Commons · licensed image, see file page'
    },
    'MXR M-104 Distortion+': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/1979_MXR_Distortion_%2B.jpg',
      page:'https://commons.wikimedia.org/wiki/File:1979_MXR_Distortion_%2B.jpg',
      credit:'Wikimedia Commons · licensed image, see file page'
    },
    'BOSS DS-1 Distortion': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss-DS-1.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss-DS-1.jpg',
      credit:'Matt Eason · CC BY-SA 3.0 / GFDL'
    },
    'BOSS OD-1 OverDrive': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/BOSS_OD-1.jpg',
      page:'https://commons.wikimedia.org/wiki/File:BOSS_OD-1.jpg',
      credit:'zynke · CC BY 2.0'
    },
    'BOSS SD-1 Super OverDrive': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss_SD-1_Super_Overdrive.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss_SD-1_Super_Overdrive.jpg',
      credit:'Kuriosatempel · CC BY-SA 4.0; photo credited on Commons to Johan Rosén'
    },
    'BOSS HM-2 Heavy Metal': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss_HM-2_Heavy_Metal.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss_HM-2_Heavy_Metal.jpg',
      credit:'Styroks · public domain dedication'
    },
    'BOSS MT-2 Metal Zone': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss_MT-2_Metal_Zone.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss_MT-2_Metal_Zone.jpg',
      credit:'Kuriosatempel · CC BY-SA 4.0; photo credited on Commons to Johan Rosén'
    },
    'DOD Grunge Distortion': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/DOD-GrungeDistortion.jpg',
      page:'https://commons.wikimedia.org/wiki/File:DOD-GrungeDistortion.jpg',
      credit:'Styroks · CC BY-SA 4.0'
    },
    'Blackout Effectors Musket Fuzz': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Blackout_Effectors_Musket_fuzz.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Blackout_Effectors_Musket_fuzz.jpg',
      credit:'Oldangelmidnight · CC BY-SA 2.0'
    },
    'Vox Tone Bender': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Vox_Tone_Bender.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Vox_Tone_Bender.jpg',
      credit:'Johann Burkard · CC BY 2.0'
    },
    'Ibanez TS-9 Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_ts9_tube_screamer.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_ts9_tube_screamer.jpg',
      credit:'Mataresephotos · CC BY 3.0 US'
    },
    'TS808 Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_TS808_Tube_Screamer_%2848588080527%29_cropped.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_TS808_Tube_Screamer_%2848588080527%29_%28cropped%29.jpg',
      credit:'Guitar Chalk · CC BY 2.0'
    },
    'Tube Screamer': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ibanez_TS808_Tube_Screamer_%2848588080527%29_cropped.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Ibanez_TS808_Tube_Screamer_%2848588080527%29_%28cropped%29.jpg',
      credit:'Guitar Chalk · CC BY 2.0'
    },
    'Big Muff Pi': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Electro_Harmonix_Big_Muff.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Electro_Harmonix_Big_Muff.jpg',
      credit:'Skimel · CC BY-SA 4.0'
    },
    'Big Muff Pi Russian': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Electro-Harmonix_Big_Muff_Pi_(Russian_Sovtek_version).jpg',
      page:'https://commons.wikimedia.org/wiki/File:Electro-Harmonix_Big_Muff_Pi_(Russian_Sovtek_version).jpg',
      credit:'Wikimedia Commons · CC BY-SA 2.0'
    },
    'RAT': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Proco-rat.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Proco-rat.jpg',
      credit:'Jazzman · Wikimedia Commons · see file page for license'
    },
    'RAT2': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/ProCo_Rat_2.jpg',
      page:'https://commons.wikimedia.org/wiki/File:ProCo_Rat_2.jpg',
      credit:'GreyCat · CC BY 2.0 · retouched from Michael Morel photograph'
    },
    'Maestro FZ-1A Fuzz-Tone': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gibson_maestro_fuzz_tone_1_752.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Gibson_maestro_fuzz_tone_1_752.jpg',
      credit:'Red Rooster · Wikimedia Commons · unrestricted redistribution/commercial-use permission stated on file page'
    },
    'Kay Fuzz Tone': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kay_Fuzz_Tone_(small).png',
      page:'https://commons.wikimedia.org/wiki/File:Kay_Fuzz_Tone_(small).png',
      credit:'Guitarpop · CC BY 2.0 · derivative of Johann Burkard photograph'
    }
  };

  window.DIRT_CLEARED_IMAGES = images;
})();
