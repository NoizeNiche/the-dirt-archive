(() => {
  const nativeFetch=window.fetch.bind(window);
  let merged=false;
  async function merge(base){
    const text=await nativeFetch('discovery-49.tsv').then(r=>r.ok?r.text():'');
    base.builders=base.builders||[];
    base.pedals=base.pedals||[];
    const builderId='BLD-CAT-0001';
    if(!base.builders.some(b=>b.builder_id===builderId)){
      base.builders.push({builder_id:builderId,name:'Catalinbread',aliases:'Catalinbread Effects',country:'USA',status:'Active',founded:null,description:'Portland, Oregon pedal company known for historically inspired foundation overdrives, fuzzes, boosts and related effects.',primary_source:'https://catalinbread.com/',source_confidence:'High'});
    }
    const existing=new Set(base.pedals.map(p=>`${p.primary_builder_id}::${String(p.model_name||'').trim().toLowerCase()}`));
    for(const line of text.split(/\r?\n/)){
      if(!line.trim()) continue;
      const [pedal_id,primary_builder_id,primary_category,model_name]=line.split('\t');
      if(!model_name||!['Fuzz','Overdrive','Distortion'].includes(primary_category)) continue;
      const key=`${primary_builder_id}::${String(model_name).trim().toLowerCase()}`;
      if(existing.has(key)) continue;
      existing.add(key);
      base.pedals.push({pedal_id,primary_builder_id,model_name,primary_category,subcategory:'Catalinbread / manufacturer lineup snapshot',introduced_year:null,discontinued_year:null,production_status:'Active / historical variants',description:'Catalinbread dirt product captured from the manufacturer lineup. Detailed historical generations, artwork/colorway history and electronics distinctions are researched separately.',archive_status:'Research',confidence:'Discovery'});
    }
    return base;
  }
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged)return response;
    try{
      const base=await response.clone().json();
      const data=await merge(base);
      merged=true;
      return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
    }catch(e){console.error('Catalinbread catalog extension failed:',e);return response;}
  };
})();
