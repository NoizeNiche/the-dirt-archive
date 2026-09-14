(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-01.tsv','discovery-02.tsv','discovery-03.tsv','discovery-04.tsv','discovery-05.tsv','discovery-06.tsv','discovery-07.tsv'];
  const provisionalBuilders = {
    'BLD-DISC-APL-01': {name:'Lectrolab', country:'USA', status:'Historical / rare', description:'Mid-century electronics maker associated with the Fuzz Buzz; Allied marketing/distribution is documented in surviving period material.'},
    'BLD-DISC-APL-02': {name:'Applied Electronics / Applied Audio Products', country:'USA', status:'Historical / OEM attribution', description:'Obscure late-1960s to early-1970s U.S. effects manufacturing lineage associated with several store and house-brand fuzz products.'},
    'BLD-DISC-LR-01': {name:'Lou Rose Music Center', country:'USA', status:'Historical / store brand', description:'New Jersey music-store brand associated with the Lou Rose Combo-Fuzz, attributed to Applied Audio Products.'},
    'BLD-DISC-CONRAD-01': {name:'Conrad', country:'USA', status:'Historical / house brand', description:'Chicago-distributed house brand with surviving late-1960s effects records and unresolved OEM relationships.'},
    'BLD-DISC-KUROSAWA-01': {name:'Kurosawa?', country:'Japan', status:'Provisional attribution', description:'Provisional attribution associated with a rare Japanese The Fuzz specimen carrying Kurosawa/PRAT-7 markings.'},
    'BLD-DISC-JP-UNKNOWN-01': {name:'Unknown Japanese maker', country:'Japan', status:'Unresolved', description:'Unknown Japanese fuzz group preserved from Effects Database relationships; exact maker remains unresolved.'},
    'BLD-DISC-UK-UNKNOWN-01': {name:'Unknown U.K. maker', country:'U.K.', status:'Unresolved', description:'Unresolved British fuzz attribution preserved as a discovery record.'},
    'BLD-DISC-USSR-UNKNOWN-01': {name:'Unknown USSR maker', country:'USSR', status:'Unresolved', description:'Rare Soviet-era effects leads preserved for later specimen and regional research.'},
    'BLD-DISC-POLAND-UNKNOWN-01': {name:'Unknown Polish maker', country:'Poland', status:'Unresolved', description:'Obscure Polish fuzz records preserved as discovery leads.'},
    'BLD-DISC-GERMANY-UNKNOWN-01': {name:'Unknown German maker', country:'Germany', status:'Unresolved', description:'Obscure German fuzz records preserved as discovery leads.'},
    'BLD-DISC-JANSEN-01': {name:'Jansen', country:'New Zealand', status:'Historical / rare', description:'New Zealand effects maker associated with the Fuzzman and an important regional early-fuzz history.'},
    'BLD-DISC-HERALD-01': {name:'Herald Electronics', country:'Japan', status:'Historical / OEM', description:'Japanese effects manufacturer associated with the AM-44A Fuzz Master and multiple regional rebrandings.'},
    'BLD-DISC-EFEL-01': {name:'EF-EL / Calderoni Musica', country:'Italy', status:'Historical / OEM', description:'Italian effects manufacturer associated with Vox-branded and other early transistor fuzz products.'},
    'BLD-DISC-MORESCHI-01': {name:'Cav. Giovanni Moreschi', country:'Italy', status:'Historical / rare', description:'Italian accordion maker that briefly produced guitar effects including the Moreschi Octave Fuzz.'},
    'BLD-DISC-ELECTRONIC-SOUNDS-01': {name:'Electronic Sounds', country:'Italy', status:'Historical / design label', description:'Italian-era Gary Hurst-associated effects label documented in rare UFO-series octave fuzz products.'},
    'BLD-DISC-PIGDOG-01': {name:'Pigdog', country:'U.K.', status:'Boutique / historical preservation', description:'Small Surrey workshop known for hand-made period-inspired fuzz interpretations.'},
    'BLD-DISC-GOLDSOUND-01': {name:'Goldsound', country:'Italy', status:'Historical / badge brand', description:'Italian effects badge appearing within the broader Cosmosound / EF-EL production ecosystem.'},
    'BLD-DISC-COSMOSOUND-01': {name:'Cosmosound', country:'Italy', status:'Historical / brand', description:'Italian effects brand associated with a broader EF-EL / Calderoni Musica production ecosystem and multiple related badges.'},
    'BLD-DISC-SILVERSOUND-01': {name:'Silversound', country:'Italy', status:'Historical / badge brand', description:'Italian effects badge associated with the Cosmosound / EF-EL product family.'},
    'BLD-DISC-GIS-01': {name:'G.I.S.', country:'Italy', status:'Historical / badge brand', description:'Italian effects badge associated with the Cosmosound / EF-EL family of dirt and hybrid effects.'},
    'BLD-DISC-EUR-01': {name:'EUR', country:'Italy', status:'Historical / badge brand', description:'Italian badge appearing on effects in the broader EF-EL / Calderoni Musica ecosystem.'},
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
    'BLD-DISC-CSCATHEY-01': {name:'CS. Cathey', country:'Japan', status:'Historical / rare', description:'Obscure Japanese effects series documented in period material with AS-01, AD-02, AB-03 and AO-05 models.'}
  };
  let merged = false;

  async function loadDiscovery(base) {
    const texts = await Promise.all(batches.map(name =>
      nativeFetch(name).then(r => r.ok ? r.text() : '')
    ));
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const builderIds = new Set(base.builders.map(b => b.builder_id));
    for (const [id, info] of Object.entries(provisionalBuilders)) {
      if (builderIds.has(id)) continue;
      base.builders.push({
        builder_id: id,
        name: info.name,
        country: info.country,
        status: info.status,
        founded: null,
        description: info.description,
        primary_source: 'https://www.effectsdatabase.com/type/fuzz'
      });
      builderIds.add(id);
    }
    const existing = new Set(base.pedals.map(p =>
      `${p.primary_builder_id}::${String(p.model_name || '').trim().toLowerCase()}`
    ));
    for (const text of texts) {
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
        const key = `${primary_builder_id}::${String(model_name || '').trim().toLowerCase()}`;
        if (!model_name || existing.has(key)) continue;
        existing.add(key);
        base.pedals.push({
          pedal_id,
          primary_builder_id,
          model_name,
          primary_category,
          subcategory: 'Discovery record',
          introduced_year: null,
          discontinued_year: null,
          production_status: 'Discovery',
          description: 'Imported from the Dirt Archive discovery layer. Historical normalization and deeper research pending.',
          archive_status: 'Research',
          confidence: 'Discovery'
        });
      }
    }
    return base;
  }

  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await loadDiscovery(base);
      merged = true;
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
      });
    } catch (err) {
      console.error('Discovery layer failed to load:', err);
      return response;
    }
  };
})();
