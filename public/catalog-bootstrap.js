(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-01.tsv','discovery-02.tsv','discovery-03.tsv','discovery-04.tsv','discovery-05.tsv','discovery-06.tsv','discovery-07.tsv','discovery-08.tsv','discovery-09.tsv','discovery-10.tsv'];
  const provisionalBuilders = {
    'BLD-DISC-GAREN-01': {name:'Garen', country:'France', status:'Historical / rare', description:'Paris-based French electronics maker associated with the 1960s Chambre de Distorsion / Garen Distortion.'},
    'BLD-DISC-SCHALLER-01': {name:'Schaller', country:'West Germany', status:'Historical / manufacturer', description:'West German effects manufacturer whose fuzz line also appears under several OEM and house-brand names.'},
    'BLD-DISC-HOFNER-01': {name:'Höfner', country:'West Germany', status:'Historical / brand', description:'German instrument brand represented here by Schaller-built effects sold under Höfner branding.'},
    'BLD-DISC-KENT-01': {name:'Kent', country:'USA / West Germany OEM', status:'Historical / importer-brand', description:'Brand associated with the Kent 6406 The Angry Fuzz in the Schaller OEM family.'},
    'BLD-DISC-VANHALL-01': {name:'Van Hall', country:'West Germany', status:'Historical / OEM brand', description:'Brand represented by a silicon Schaller-family fuzz.'},
    'BLD-DISC-BLACKFIELD-01': {name:'Blackfield', country:'West Germany', status:'Historical / OEM brand', description:'Rare rebrand associated with the Schaller Fuzz family.'},
    'BLD-DISC-ROSAC-01': {name:'Rosac / Sierra Electronics', country:'USA', status:'Historical / manufacturer', description:'Bakersfield manufacturer descended from the 1969 Sierra Electronics startup after Mosrite bankruptcy, with Ed Sanner design lineage.'},
    'BLD-DISC-JEN-01': {name:'Jen Elettronica', country:'Italy', status:'Historical / OEM manufacturer', description:'Italian effects manufacturer in Pescara associated with Vox, Luxor and other branded fuzz and wah products.'},
    'BLD-DISC-ELKA-01': {name:'Elka', country:'Italy', status:'Historical / brand', description:'Italian electronics brand represented here by the Dizzy Tone fuzz and related Italian effects lineage.'},
    'BLD-DISC-LUXOR-01': {name:'Luxor', country:'Italy / OEM brand', status:'Historical / OEM brand', description:'Italian badge appearing on Jen-built fuzz and fuzz-wah products.'},
    'BLD-DISC-UNICORD-01': {name:'Unicord', country:'USA / Italian OEM', status:'Historical / importer-brand', description:'American brand associated with Italian-made effects in the Jen production network.'},
    'BLD-DISC-GOODFUZZY-01': {name:'Good Fuzzy Sounds', country:'Unknown', status:'Modern boutique / obscure', description:'Small-builder fuzz record preserved from the Effects Database Tone Bender relationship network.'},
    'BLD-DISC-1969-01': {name:'1969 Effects', country:'France', status:'Boutique / hand-made', description:'French boutique builder represented by hand-made fuzzes rooted in classic 1960s designs.'},
    'BLD-DISC-UNKNOWN-USA-01': {name:'Unknown U.S. maker', country:'USA', status:'Unresolved', description:'Vintage U.S. fuzz record preserved without a resolved manufacturer attribution.'},
    'BLD-DISC-PROTRAFFIC-01': {name:"Pro'Traffic", country:'Unknown', status:'Historical / unresolved', description:'Obscure fuzz record preserved through the Tone Bender MkII relationship tree; manufacturer attribution unresolved.'},
    'BLD-DISC-KLINGER-01': {name:'Klinger Custom Pedals', country:'Australia', status:'Boutique / historical preservation', description:'Melbourne boutique builder represented by the Jimi Fuzz.'},
    'BLD-DISC-BIGJOHN-01': {name:'Big John Music', country:'Belgium / Netherlands', status:'Boutique / builder lineage', description:'European boutique builder represented by a dense effects catalog and later Netherlands operation.'},
    'BLD-DISC-AUL-01': {name:'Aul Instruments', country:'USA', status:'Historical / OEM', description:'Historical U.S. instrument/effects maker associated with the 1967 Guild Foxey Lady replacement production.'},
    'BLD-DISC-MGI-01': {name:'MGI', country:'USA', status:'Historical / unresolved', description:'Vintage U.S. badge preserved through the Clark/Wurlitzer/Halifax fuzz relationship cluster.'},
    'BLD-DISC-VINTAGETECH-01': {name:'Vintage Technology', country:'Unknown', status:'Boutique / historical', description:'Vintage Technology record linked by Effects Database to the Vox/Jen V8161/V8162 branch.'},
    'BLD-DISC-SUNHAUS-01': {name:'Sunhaus', country:'Australia', status:'Modern boutique / small batch', description:'Melbourne small-batch effects builder represented by the Djandek Geological Fuzz.'},
    'BLD-DISC-SHINEI-01': {name:'Shin-Ei', country:'Japan', status:'Historical / manufacturer', description:'Japanese effects manufacturer behind the Companion/FY-series family and many OEM-branded regional examples.'},
    'BLD-DISC-COMPANION-01': {name:'Companion', country:'Japan / export brand', status:'Historical / OEM brand', description:'Consumer-facing brand associated with the Shin-Ei FY-2 family.'},
    'BLD-DISC-AVORA-01': {name:'Avora', country:'Japan / export brand', status:'Historical / OEM brand', description:'Rare FY-2-family export badge preserved as a separate branded object.'},
    'BLD-DISC-JH-EXPERIENCE-01': {name:'J.H. Experience', country:'Japan / export brand', status:'Historical / OEM brand', description:'FY-2-family branded example documented in Effects Database.'},
    'BLD-DISC-JAX-01': {name:'JAX', country:'Japan / export brand', status:'Historical / OEM brand', description:'Export badge appearing on Shin-Ei-family fuzz products.'},
    'BLD-DISC-KIMBARA-01': {name:'Kimbara', country:'Japan / export brand', status:'Historical / OEM brand', description:'Export badge appearing on FY-2-family fuzz products.'},
    'BLD-DISC-SUZUKI-01': {name:'Suzuki', country:'Mexico market / Japan OEM', status:'Historical / regional badge', description:'Rare Suzuki-branded FY-2 example documented as a 1970s Mexico-market pedal.'},
    'BLD-DISC-TELESTAR-01': {name:'Tele-Star', country:'USA / Japan OEM', status:'Historical / importer-brand', description:'American importer/distributor brand with Japanese-made effects, including FY-2-family and wedge-fuzz examples.'},
    'BLD-DISC-TEMPO-01': {name:'Tempo', country:'Japan / export brand', status:'Historical / OEM brand', description:'Export badge appearing on Shin-Ei-family fuzz products.'},
    'BLD-DISC-THOMAS-01': {name:'Thomas', country:'Japan / export brand', status:'Historical / OEM brand', description:'Rare branded FY-2-family example preserved for future specimen research.'},
    'BLD-DISC-ZENTA-01': {name:'Zenta', country:'Japan / export brand', status:'Historical / OEM brand', description:'OEM-branded FY-2 example documented by Effects Database.'},
    'BLD-DISC-IDEAL-01': {name:'Ideal', country:'USA / Japan OEM', status:'Historical / importer-brand', description:'American brand associated with a rare Japanese wedge fuzz in the Ideal/Sekova/Greco family.'},
    'BLD-DISC-GRECO-01': {name:'Greco', country:'Japan', status:'Historical / brand', description:'Japanese guitar/effects brand represented here by the No. 35 Haztone wedge-fuzz family.'},
    'BLD-DISC-APOLLO-01': {name:'Apollo', country:'Japan / export brand', status:'Historical / OEM brand', description:'Brand represented by the No. 843 Distorter in the Japanese wedge-fuzz family.'},
    'BLD-DISC-CRESTWOOD-01': {name:'Crestwood', country:'USA / Japan OEM', status:'Historical / importer-brand', description:'Brand represented by a Japanese wedge-fuzz object linked in the Effects Database family tree.'},
    'BLD-DISC-SEKOVA-01': {name:'Sekova', country:'USA / Japan OEM', status:'Historical / importer-brand', description:'Brand associated with the Model No. 59 Distortion Box in the Japanese wedge-fuzz network.'},
    'BLD-DISC-CSCATHEY-01': {name:'CS. Cathey', country:'Japan', status:'Historical / rare', description:'Obscure Japanese effects series documented in mid-1970s period material with AS-01, AD-02, AB-03 and AO-05 models.'},
    'BLD-DISC-SMFUZZ-01': {name:'SM Fuzz', country:'U.K.', status:'Boutique / limited', description:'Scott McKeon boutique fuzz project; preserve as a distinct small-builder record.'},
    'BLD-DISC-WESTMINSTER-01': {name:'Westminster Effects', country:'USA', status:'Modern boutique', description:'Modern boutique effects builder with multiple fuzz and related gain products.'},
    'BLD-DISC-LEONE-01': {name:'Leone Effects Co.', country:'USA', status:'Modern boutique', description:'Hand-built effects builder represented by the Super Box fuzz series.'},
    'BLD-DISC-SHOE-01': {name:'Shoe Pedals', country:'USA', status:'Boutique / one-person', description:'One-person operation associated with Christopher Venter and a long-running boutique effects catalog.'},
    'BLD-DISC-SPIRAL-01': {name:'Spiral Electric FX', country:'USA', status:'Boutique', description:'Boutique builder represented by hybrid germanium/silicon fuzz products.'},
    'BLD-DISC-GIGAHEARTS-01': {name:'Gigahearts FX', country:'Unknown', status:'Modern boutique', description:'Modern boutique builder represented here by the Small Cheese fuzz.'},
    'BLD-DISC-MYTHOS-01': {name:'Mythos Pedals', country:'USA', status:'Modern boutique', description:'Nashville boutique builder with a wide fuzz and overdrive catalog.'},
    'BLD-DISC-ORION-01': {name:'Orion Effekte', country:'Germany', status:'Boutique / one-person', description:'Jan van Triest one-person German effects workshop.'},
    'BLD-DISC-MONTGOMERY-01': {name:'Montgomery Appliances', country:'USA', status:'Boutique / one-person', description:'David Gill one-person workshop with a dense fuzz-oriented catalog.'},
    'BLD-DISC-KAY-01': {name:'Kay', country:'USA / Japan OEM', status:'Historical / brand', description:'American brand associated with the Japanese-made F-1 Fuzz Tone; original manufacturer remains unresolved.'},
    'BLD-DISC-EXCETRO-01': {name:'Excetro', country:'Japan', status:'Historical / OEM', description:'Japanese OEM badge represented by Wau Wau fuzz-wah and related effects.'}
  };
  let merged = false;
  async function loadDiscovery(base) {
    const texts = await Promise.all(batches.map(name => nativeFetch(name).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || []; base.builders = base.builders || [];
    const builderIds = new Set(base.builders.map(b => b.builder_id));
    for (const [id, info] of Object.entries(provisionalBuilders)) {
      if (builderIds.has(id)) continue;
      base.builders.push({builder_id:id,name:info.name,country:info.country,status:info.status,founded:null,description:info.description,primary_source:'https://www.effectsdatabase.com/type/fuzz'});
      builderIds.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`));
    for (const text of texts) for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name || '').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Discovery record',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try { const base = await response.clone().json(); const data = await loadDiscovery(base); merged = true; return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}}); }
    catch (err) { console.error('Discovery layer failed to load:', err); return response; }
  };
})();
