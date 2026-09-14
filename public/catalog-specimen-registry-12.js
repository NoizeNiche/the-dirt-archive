(() => {
  const specimens=[
    {builder:'Catalinbread',title:'Karma Suture GE',role:'Electronics-defined specimen',era:'Historical / manufacturer documented',variant_type:'Germanium electronics variant',appearance:'Karma Suture GE enclosure and artwork.',electronics:'GE family. Preserve as a distinct electronics variant from Karma Suture SI.',caption:'Karma Suture GE specimen reference. The GE designation is product identity, not merely cosmetic.',src:'https://catalinbread.com/pages/manuals',page:'https://catalinbread.com/pages/manuals',credit:'Catalinbread Effects · manufacturer reference',rights:'Reference'},
    {builder:'Catalinbread',title:'Karma Suture SI',role:'Electronics-defined specimen',era:'Historical / manufacturer documented',variant_type:'Silicon electronics variant',appearance:'Karma Suture SI enclosure and artwork.',electronics:'SI family. Preserve as a distinct electronics variant from Karma Suture GE.',caption:'Karma Suture SI specimen reference. The SI designation is product identity, not merely cosmetic.',src:'https://catalinbread.com/pages/manuals',page:'https://catalinbread.com/pages/manuals',credit:'Catalinbread Effects · manufacturer reference',rights:'Reference'}
  ];
  const existing=Array.isArray(window.DIRT_SPECIMENS)?window.DIRT_SPECIMENS:[];
  window.DIRT_SPECIMENS=existing.concat(specimens);
})();
