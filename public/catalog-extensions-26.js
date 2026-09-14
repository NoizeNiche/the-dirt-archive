(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-26.tsv'];
  const builders = {
    'BLD-DISC-26-01':{name:'Analog Man',country:'USA',status:'Boutique / active',description:'Analog Mike Piera’s effects company in Bethel, Connecticut; known for fuzz, boost and overdrive families.',primary_source:'https://www.effectsdatabase.com/model/analogman'},
    'BLD-DISC-26-02':{name:'Barber Electronics',country:'USA',status:'Boutique / active',description:'David Barber’s pedal company, represented by a substantial overdrive, fuzz and distortion catalog.',primary_source:'https://www.effectsdatabase.com/model/barber'},
    'BLD-DISC-26-03':{name:'BMF Effects',country:'USA',status:'Boutique / historical',description:'Scott Kiraly’s Hermosa Beach, California pedal company, with an early commercial date of September 17, 2005.',primary_source:'https://www.effectsdatabase.com/model/bmf'},
    'BLD-DISC-26-04':{name:'Catalinbread',country:'USA',status:'Boutique / active',description:'Portland pedal company founded by Nicholas Harris in 2003, with a broad catalog spanning fuzz, overdrive and distortion.',primary_source:'https://www.effectsdatabase.com/model/catalinbread'},
    'BLD-DISC-26-05':{name:'Devi Ever FX',country:'USA',status:'Historical / revived lineage',description:'Devi Ever’s Portland, Oregon effects lineage, begun as Effector 13 in the early 2000s and later continued under the Devi Ever name.',primary_source:'https://www.effectsdatabase.com/model/deviever'},
    'BLD-DISC-26-06':{name:'Fuzzrocious Pedals',country:'USA',status:'Boutique / active',description:'Ryan and Shannon Ratajski’s Mount Laurel, New Jersey pedal company, founded out of Ryan’s early home builds around 2008.',primary_source:'https://www.effectsdatabase.com/model/fuzzrocious'},
    'BLD-DISC-26-07':{name:'Guyatone',country:'Japan',status:'Historical / active lineage',description:'Japanese effects brand with multiple historical PS/FS/GT and Mighty Micro series plus later USA periods.',primary_source:'https://www.effectsdatabase.com/model/guyatone'},
    'BLD-DISC-26-08':{name:'Rockett Pedals / J. Rockett Audio Designs',country:'USA',status:'Boutique / active',description:'Joint venture associated with Jay Rockett, Chris Van Tassel and Ron Hahn.',primary_source:'https://www.effectsdatabase.com/model/rockett'},
    'BLD-DISC-26-09':{name:'Keeley Electronics',country:'USA',status:'Boutique / active',description:'Robert Keeley’s effects company with a large catalog spanning modified classics, original dirt designs and collaborations.',primary_source:'https://www.effectsdatabase.com/model/keeley'},
    'BLD-DISC-26-10':{name:'Lovepedal',country:'USA',status:'Boutique / historical',description:'Sean’s Lovepedal line, notable for many compact overdrive, fuzz and boost models and frequent short-run variants.',primary_source:'https://www.effectsdatabase.com/model/lovepedal'},
    'BLD-DISC-26-11':{name:'Malekko Heavy Industry',country:'USA',status:'Boutique / active',description:'Joshua Holley and Paul Barker’s company, started in Austin in 2006 and moved to Portland in 2010.',primary_source:'https://www.effectsdatabase.com/model/malekko'},
    'BLD-DISC-26-12':{name:'Menatone',country:'USA',status:'Boutique / active',description:'Brian Mena’s boutique pedal company with a broad amp-in-a-box, fuzz and overdrive catalog.',primary_source:'https://www.effectsdatabase.com/model/menatone'},
    'BLD-DISC-26-13':{name:'MI Audio',country:'Australia',status:'Boutique / historical',description:'Michael Ibrahim’s Sydney company; Tube Zone work began in 1995 before the company was founded in 2002.',primary_source:'https://www.effectsdatabase.com/model/miaudio'},
    'BLD-DISC-26-14':{name:'Moody Sounds',country:'Sweden',status:'Boutique / historical',description:'Albin Roslund’s Malmö-based operation, active in assembled pedals and kits from the mid-2000s.',primary_source:'https://www.effectsdatabase.com/model/moodysounds'},
    'BLD-DISC-26-15':{name:'Smallsound/Bigsound',country:'USA',status:'Historical / boutique',description:'Brian Hamilton’s Philadelphia pedal brand, important to the 2000s–2010s boutique fuzz and overdrive scene.',primary_source:'https://www.effectsdatabase.com/model/smallsoundbigsound'},
    'BLD-DISC-26-16':{name:'Systech',country:'USA',status:'Historical',description:'Systems & Technology in Music, Inc. of Kalamazoo, associated with Greg Hochman, Charlie Wicks and the Sound Factory circle.',primary_source:'https://www.effectsdatabase.com/model/systech'},
    'BLD-DISC-26-17':{name:'T-Pedals',country:'Italy',status:'Boutique / historical',description:'Alberto Dani’s Tuscany company; T-Fuzz prototypes date to 2002 and full-time pedal activity began in 2006.',primary_source:'https://www.effectsdatabase.com/model/tpedals'},
    'BLD-DISC-26-18':{name:'Wampler Pedals',country:'USA',status:'Boutique / active',description:'Brian Wampler’s Indianapolis-area pedal company with a large overdrive, distortion and fuzz catalog.',primary_source:'https://www.effectsdatabase.com/model/wampler'},
    'BLD-DISC-26-19':{name:'Z. Vex',country:'USA',status:'Boutique / active',description:'Zachary Vex’s effects company, a foundational boutique builder with hand-painted and Vexter production families.',primary_source:'https://www.effectsdatabase.com/model/zvex'},
  };
  let merged = false;
  async function merge(base) {
    const text = await nativeFetch('discovery-26.tsv').then(r => r.ok ? r.text() : '');
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
      base.pedals.push({
        pedal_id,primary_builder_id,model_name,primary_category,
        subcategory:'Builder-first discovery',
        introduced_year:null,discontinued_year:null,
        production_status:'Discovery',
        description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',
        archive_status:'Research',confidence:'Discovery'
      });
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
      console.error('Builder-first discovery extension 26 failed:', err);
      return response;
    }
  };
})();
