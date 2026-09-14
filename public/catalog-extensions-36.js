(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-36.tsv'];
  const builders = {
    'BLD-DISC-36-01':{name:'British Pedal Company',country:'UK',status:'Boutique / active',description:'UK effects company focused heavily on historically styled recreations of classic British fuzz and boost pedals, with a documented wider current catalog.',primary_source:'https://www.britishpedalcompany.com/sitemap'},
    'BLD-DISC-36-02':{name:'Jerms',country:'USA',status:'Boutique / small-batch',description:'Jim Roth’s small-batch effects operation, known for hand-built recreations and custom vintage-derived fuzzes.',primary_source:'https://www.effectsdatabase.com/model/jerms'},
    'BLD-DISC-36-03':{name:'Anarchy Audio Australia',country:'Australia',status:'Boutique / active',description:'Australian effects builder with a documented catalog of fuzz, overdrive, boost, filter and modulation products, including long-running Bee Baa and Super Fuzz-derived designs.',primary_source:'https://www.effectsdatabase.com/model/anarchyaudio'},
    'BLD-DISC-36-04':{name:'Ananashead FX',country:'Unknown',status:'Boutique / historical',description:'Boutique effects catalog with a strong vintage British-fuzz emphasis, including Tone Bender, Fuzz Face, Super Fuzz and booster families.',primary_source:'https://www.effectsdatabase.com/model/ananashead'},
    'BLD-DISC-36-05':{name:'Herald Electronics',country:'USA',status:'Historical / imported OEM brand',description:'Small Chicago-based brand whose AM-44A Fuzz Master was an imported Japanese-made effects unit sold in the 1960s/early 1970s.',primary_source:'https://www.effectsdatabase.com/model/herald'},
    'BLD-DISC-36-06':{name:'StoneFly Effects',country:'Canada',status:'Boutique / historical',description:'Montreal builder founded by Marc-Eric Gagnon, with a tiny documented catalog including Buzzaround-derived fuzz work.',primary_source:'https://www.effectsdatabase.com/model/stonefly'}
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-36.tsv').then(r => r.ok ? r.text() : '');
    base.pedals = base.pedals || [];
    base.builders = base.builders || [];
    const ids = new Set(base.builders.map(b => b.builder_id));
    for (const [id,v] of Object.entries(builders)) {
      if (ids.has(id)) continue;
      base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});
      ids.add(id);
    }
    const existing = new Set(base.pedals.map(p => `${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name] = line.split('\t');
      const key = `${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;
      if (!model_name || existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await merge(base);
      merged = true;
      return new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}});
    } catch (err) {
      console.error('Builder-first discovery extension 36 failed:', err);
      return response;
    }
  };
})();
