(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-11.tsv','discovery-12.tsv'];
  const builders = {
    'BLD-DISC-WALCO-01': ['Walco','Japan','Historical / importer-brand','Japanese effects brand associated with the Fuzz Tone Generator and other small effects.'],
    'BLD-DISC-VTP-01': ['Vintage Tone Project','USA','Boutique / historical','Small-builder fuzz project preserved from the Tone Bender relationship network.'],
    'BLD-DISC-IDEEN-01': ['IDEEN Tech','Unknown','Modern boutique / obscure','Obscure boutique fuzz builder preserved for product-history research.'],
    'BLD-DISC-DEVI-01': ['Devi Ever FX','USA','Historical / boutique','Devi Ever effects brand with a substantial experimental fuzz lineage.'],
    'BLD-DISC-AREA51-01': ['Area 51','USA','Boutique','Boutique effects builder represented by the Area 51 Fuzz.'],
    'BLD-DISC-NOVA-01': ['Nova','Italy','Historical / OEM brand','Italian badge associated with the Jen-made Tone Bender lineage.'],
    'BLD-DISC-SEARS-01': ['Sears Roebuck & Co.','USA','Historical / retailer brand','Mail-order retailer and house brand; individual effects may have been sourced from outside manufacturers.'],
    'BLD-DISC-CLARK-01': ['Clark Amplification','USA','Historical / manufacturer','New Jersey amplifier maker represented by the SS-600 fuzz.'],
    'BLD-DISC-ORPHEUM-01': ['Orpheum','Unknown','Historical / unresolved','Vintage fuzz badge preserved through the Clark/Wurlitzer/MGI relationship cluster.'],
    'BLD-DISC-MICA-TONE-01': ['Mica-Tone','USA / Japan OEM','Historical / brand','Vintage fuzz badge preserved in the U.S. fuzz relationship cluster.'],
    'BLD-DISC-WATTSON-01': ['Wattson Classic Electronics','USA','Boutique / historical','Modern builder known for careful reproductions and vintage-inspired effects.'],
    'BLD-DISC-GUYATONE-01': ['Guyatone','Japan','Historical / manufacturer','Japanese effects manufacturer with a long fuzz history, including the FS and TZ series.'],
    'BLD-DISC-GHOST-01': ['Ghost Effects','USA','Boutique','Boutique builder represented by a Shin-Ei FY-2 interpretation.'],
    'BLD-DISC-FREDRIC-01': ['Fredric Effects','U.K.','Boutique / historical','North London boutique builder with a dense vintage-inspired fuzz catalog.'],
    'BLD-DISC-PICTURES-01': ['Pigeon FX','USA','Boutique','Boutique builder represented by Companion/FY-2 interpretations.'],
    'BLD-DISC-ELECTRONIC-ORANGE-01': ['Electronic Orange','Unknown','Boutique','Modern boutique builder represented by SuperFuzz-inspired products.']
  };
  let merged = false;
  async function merge(base) {
    const texts = await Promise.all(batches.map(n => nativeFetch(n).then(r => r.ok ? r.text() : '')));
    base.pedals = base.pedals || []; base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id, v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v[0],country:v[1],status:v[2],founded:null,description:v[3],primary_source:'https://www.effectsdatabase.com/type/fuzz'});
      ids.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const text of texts) for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id, primary_builder_id, primary_category, model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
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
    try { const base = await response.clone().json(); const data = await merge(base); merged = true; return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}}); }
    catch (err) { console.error('Discovery extension failed to load:', err); return response; }
  };
})();
