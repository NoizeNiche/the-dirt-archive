(() => {
  const nativeFetch = window.fetch.bind(window);
  const familyRules = [
    {family:'Sola Sound production network', names:['Sola Sound','Vox','Rotosound','Park','Marshall','Carlsbro','D*A*M']},
    {family:'Schaller production network', names:['Schaller','Höfner','Kent','Van Hall','Blackfield']},
    {family:'Jen Elettronica production network', names:['Jen Elettronica','Elka','Luxor','Unicord','Vintage Technology','Excetro']},
    {family:'Shin-Ei production network', names:['Shin-Ei','Companion','Avora','J.H. Experience','JAX','Kimbara','Suzuki','Tele-Star','Tempo','Thomas','Zenta']},
    {family:'Maxon / Hoshino Tube Screamer lineage', names:['Maxon','Ibanez / Hoshino']}
  ];
  const relationshipNames = new Set(familyRules.flatMap(r=>r.names).map(x=>x.toLowerCase()));
  const groupFor = b => {
    const name=String(b.name||'').trim().toLowerCase();
    const text=`${b.status||''} ${b.description||''}`.toLowerCase();
    if (relationshipNames.has(name) || /oem|importer|export brand|regional badge|brand/.test(text)) return 'Brands, Licensing & Production Relationships';
    if (/diy|kit|small-run/.test(text)) return 'DIY / Kit / Small-Run';
    if (/modern boutique|boutique|one-person|small batch|hand-made/.test(text)) return 'Independent / Boutique Builders';
    if (/manufacturer/.test(text) && !/historical/.test(text)) return 'Major Manufacturers';
    if (/manufacturer/.test(text)) return 'Historical / Defunct Builders';
    if (/historical|defunct|rare|unresolved/.test(text)) return 'Historical / Defunct Builders';
    return 'Independent / Boutique Builders';
  };
  const familyFor = name => {
    const n = String(name || '').trim().toLowerCase();
    const hit = familyRules.find(r => r.names.some(x => x.toLowerCase() === n));
    return hit ? hit.family : '';
  };
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    try {
      const url = new URL(typeof input === 'string' ? input : input.url, location.href);
      if (!url.pathname.endsWith('/data.json')) return response;
      const data = await response.clone().json();
      data.builders = (data.builders || []).map(b => ({...b, browse_group:b.browse_group || groupFor(b), organization_family:b.organization_family || familyFor(b.name)}));
      return new Response(JSON.stringify(data), {status:response.status, headers:{'Content-Type':'application/json'}});
    } catch (_) { return response; }
  };
  window.DIRT_ARCHIVE_ORGANIZATION = {familyRules, groupFor, familyFor};
})();
