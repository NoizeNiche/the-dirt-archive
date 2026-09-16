(() => {
  // Broad visual census: add clean, legally reusable exterior photos without
  // pretending they are generation-exact. Variant work comes later.
  const images = {
    'BOSS OS-2 OverDrive Distortion': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/BOSS_OS-2_OverDrive_Distortion.jpg',
      page:'https://commons.wikimedia.org/wiki/File:BOSS_OS-2_OverDrive_Distortion.jpg',
      credit:'Wikimedia Commons · CC BY-SA 2.0'
    },
    'BOSS ODB-3 Bass OverDrive': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boss_ODB-3_Bass_overdrive_pedal.jpg',
      page:'https://commons.wikimedia.org/wiki/File:Boss_ODB-3_Bass_overdrive_pedal.jpg',
      credit:'Wikimedia Commons · CC BY-SA 2.0'
    },
    'DOD 250 Overdrive Preamp': {
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2013_DOD_250_Overdrive_Preamp_and_201_Phasor.png',
      page:'https://commons.wikimedia.org/wiki/File:2013_DOD_250_Overdrive_Preamp_and_201_Phasor.png',
      credit:'Tom Cram · Wikimedia Commons · licensed image, see file page'
    }
  };
  window.DIRT_BROAD_PASS_IMAGES = images;
  window.DIRT_CLEARED_IMAGES = Object.assign(window.DIRT_CLEARED_IMAGES || {}, images);
})();
