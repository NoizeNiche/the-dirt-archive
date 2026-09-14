(() => {
  const nativeFetch = window.fetch.bind(window);
  const batches = ['discovery-68.tsv'];
  const builders = {
    'BLD-DISC-BJFE-01':['BJF Electronics (BJFE)','Sweden','Boutique / historical','Björn Juhl founded BJFE in Stockholm in 1999; the catalog spans fuzz, overdrive, distortion, boost, compression, modulation and filter designs.'],
    'BLD-DISC-GUILD-01':['Guild','USA / OEM','Historical / OEM lineage','Guild effects catalog with important Applied Audio, Aria, fOXX and Top Gear manufacturing relationships, plus the Foxey Lady and Timbre Generator lineage.'],
    'BLD-DISC-MJM-01':['MJM Guitar Effects','Canada / USA','Boutique / historical','Boutique builder catalog centered on vintage-inspired fuzz, boost, overdrive and modulation products.'],
    'BLD-DISC-DMB-01':['DMB Pedals','USA','Historical boutique','Mike Blakemore and Daniel Minton operation founded in 2007, with original effects, modification work and a documented product range.']
  };
  let merged=false;
  async function merge(base){
    const texts=await Promise.all(batches.map(n=>nativeFetch(n).then(r=>r.ok?r.text():'')));
    base.pedals=base.pedals||[]; base.builders=base.builders||[];
    const ids=new Set(base.builders.map(b=>b.builder_id));
    for(const [id,v] of Object.entries(builders)){if(ids.has(id))continue;base.builders.push({builder_id:id,name:v[0],country:v[1],status:v[2],founded:null,description:v[3],primary_source:'https://www.effectsdatabase.com/'});ids.add(id);}
    const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for(const text of texts)for(const line of text.split(/\r?\n/)){if(!line.trim())continue;const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');const key=`${primary_builder_id}::${String(model_name||'').trim().toLowerCase()}`;if(!model_name||existing.has(key))continue;existing.add(key);base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Complete lineup discovery',introduced_year:null,discontinued_year:null,production_status:'Discovery',description:'Captured from a builder-level catalog. Product-level historical research, variations and image rights research pending.',archive_status:'Research',confidence:'Discovery'});}
    return base;
  }
  window.fetch=async(input,init)=>{const response=await nativeFetch(input,init);const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.endsWith('/data.json')||merged)return response;try{const base=await response.clone().json();const data=await merge(base);merged=true;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});}catch(err){console.error('Discovery extension 69 failed:',err);return response;}};
})();
