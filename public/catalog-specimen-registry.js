(() => {
  // Visual specimen registry. Keep appearance, production identity, and
  // electronics identity separate. A cosmetic variant is not automatically
  // a circuit variant, and a circuit variant is not automatically a new model.
  const specimens = [
    {
      title:'Karma Suture',
      role:'Documented specimen',
      era:'Current / historical production',
      variant_type:'Electronics variant',
      appearance:'Purple enclosure with orange/white line artwork',
      electronics:'NOS Russian PNP germanium transistor + NPN silicon transistor',
      caption:'Karma Suture visual specimen. The Germanium version is treated as a distinct electronic variant, not merely a colorway.',
      src:'https://www.premierguitar.com/media-library/image.jpg?id=25723771&quality=70&width=980',
      page:'https://www.premierguitar.com/catalinbread-introduces-the-karma-suture-and-topanga-spring-reverb',
      credit:'Premier Guitar · image used as external identification reference',
      rights:'Reference'
    },
    {
      title:'Karma Suture Germanium',
      role:'Documented specimen',
      era:'Germanium edition',
      variant_type:'Electronics variant',
      appearance:'Purple enclosure with orange/white artwork',
      electronics:'NOS PNP germanium transistor + NPN silicon transistor',
      caption:'Germanium-branded Karma Suture specimen. Treat the explicit Germanium designation as a production/electronics identity field.',
      src:'https://img.audiofanzine.com/images/u/product/normal/catalinbread-karma-suture-germanium-203121.png',
      page:'https://fr.audiofanzine.com/fuzz-guitare/catalinbread/karma-suture/',
      credit:'Audiofanzine · image used as external identification reference',
      rights:'Reference'
    },
    {
      title:'Sabbra Cadabra (10th Anniversary Edition) [White]',
      role:'Colorway / limited edition family',
      era:'10th Anniversary',
      variant_type:'Appearance variant',
      appearance:'White anniversary enclosure; related anniversary color series includes red, blue, green, black and yellow examples',
      electronics:'Do not infer electronics from color alone; research separately when documented',
      caption:'Anniversary Sabbra Cadabra color-series specimen. Colorway is recorded separately from circuit identity.',
      src:'https://cdn.shopify.com/s/files/1/0370/1873/0628/files/summerofsabbra_300x_6fd406be-1468-48ae-aa07-a1b789a9a969.png?v=1751575774&width=2048',
      page:'https://catalinbread.com/products/sabbra-white',
      credit:'Catalinbread Effects · manufacturer product image',
      rights:'Reference'
    }
  ];
  window.DIRT_SPECIMENS = specimens;
})();
