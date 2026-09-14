(() => {
  const nativeFetch = window.fetch.bind(window);
  const builders = {
    'BLD-DISC-30-01':{name:'SkinPimp',country:'USA',status:'Historical / boutique',description:'Ryan Kirkland’s tattoo-art-influenced boutique effects line known especially for Tone Bender and related vintage fuzz recreations.',primary_source:'https://www.effectsdatabase.com/model/skinpimp'},
    'BLD-DISC-30-02':{name:'M.A.S.F.',country:'Japan',status:'Historical / experimental',description:'Japanese experimental pedal builder associated with distinctive fuzz, noise and unusual effect designs.',primary_source:'https://www.effectsdatabase.com/model/masf'},
    'BLD-DISC-30-03':{name:'T. Jauernig Electronics',country:'USA',status:'Historical / revived lineage',description:'Timothy Jauernig’s Wausau, Wisconsin operation, known for Luxury Drive, DGTM and Gristle King plus artist and licensing relationships.',primary_source:'https://www.effectsdatabase.com/model/jauernig'},
    'BLD-DISC-30-04':{name:'Rastop Designs',country:'USA',status:'Historical / boutique',description:'Alexander Rastopchin’s NYC one-person effects operation with fuzz, divider, modulation, bass and experimental products.',primary_source:'https://www.effectsdatabase.com/model/rastop'},
    'BLD-DISC-30-05':{name:'Compulsive Audio',country:'USA',status:'Historical / boutique',description:'John De Luca’s New Jersey builder operation founded in 2009, spanning dirt, boost, compression, modulation and utility products.',primary_source:'https://www.effectsdatabase.com/model/compulsive'},
    'BLD-DISC-30-06':{name:'Main.Ace.FX',country:'USA',status:'Historical / boutique',description:'James Granuzzo’s New Jersey boutique operation with production beginning in 2011 and a small catalog of fuzz and utility-oriented designs.',primary_source:'https://www.effectsdatabase.com/model/mainace'},
    'BLD-DISC-30-07':{name:'GoosoniqueWorx',country:'Singapore',status:'Historical / boutique',description:'Ravi Goose’s Singapore operation, important for early small-run fuzz, distortion and high-gain designs.',primary_source:'https://www.effectsdatabase.com/model/goosonique'},
    'BLD-DISC-30-08':{name:'1969 Effects',country:'France',status:'Historical / boutique',description:'French boutique builder documented with a compact catalog centered on vintage-style fuzz and boost designs.',primary_source:'https://www.effectsdatabase.com/model/1969'},
    'BLD-DISC-30-09':{name:'Pigdog',country:'UK',status:'Boutique / historical',description:'Steve Williams’s Surrey/London operation known for hand-built fuzz, Tone Bender-related recreations, boosts and custom work.',primary_source:'https://www.effectsdatabase.com/model/pigdog'}
  };
  async function merge(base) {
    const text = await nativeFetch('discovery-30.tsv').then(r=>r.ok?r.text():'');
    base.pedals=base.pedals||[]; base.builders=base.builders||[];
    const ids=new Set(base.builders.map(b=>b.builder_id));
    for(const [id,v] of Object.entries(builders)){if(ids.has(id))continue;base.builders.push({builder_id:id,name:v.name,country:v.country,status:v.status,founded:null,description:v.description,primary_source:v.primary_source,source_confidence:'Discovery'});ids.add(id)}
    const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for(const line of text.split(/\r?\n/)){if(!line.trim())continue;const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');const key=`${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;if(!model_name||existing.has(key))continue;existing.add(key);base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Builder-first discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Product enumerated during builder-first catalog expansion. Historical chronology, variations and production relationships pending.',archive_status:'Research',confidence:'Discovery'})}
    return base;
  }
  let merged=false;
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})}catch(err){console.error('Builder-first discovery extension 30 failed:',err);return response}};
})();
