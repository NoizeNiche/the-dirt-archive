(()=>{
  const nativeFetch=window.fetch.bind(window);
  let merged=false;
  const qualified=[
    {builder_id:'BLD-QUAL-SEAMOON-01',name:'Seamoon Inc.',country:'USA (California)',status:'Verified dirt maker',founded:1973,dirt_count:1,description:'Berkeley effects maker documented for the Fresh Fuzz; original builder identity is kept separate from later tribute/reissue products.',dirt_evidence:'Fresh Fuzz',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-CARLSBRO-01',name:'Carlsbro',country:'United Kingdom',status:'Verified dirt maker',founded:1966,dirt_count:1,description:'British amplifier maker documented for the original 1966 Fuzz-Tone; later fuzz production involved Sola Sound.',dirt_evidence:'Fuzz-Tone',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-ROSAC-01',name:'Rosac / Sierra Electronics',country:'USA (California)',status:'Verified dirt maker',founded:1968,dirt_count:3,description:'Bakersfield effects maker documented for Nu-Fuzz, Nu-Wa-Fuzz and related dirt products.',dirt_evidence:'Nu-Fuzz; Nu-Wa-Fuzz; Nu-Fuzz Distortion Blender',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-AUL-01',name:'Aul Instruments',country:'USA',status:'Verified dirt maker',founded:1967,dirt_count:1,description:'Historical U.S. manufacturer documented for the Aul Instruments Fuzz and contract production of the Guild Foxey Lady run.',dirt_evidence:'Aul Instruments Fuzz; Guild Foxey Lady production',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-CHUNK-01',name:'Chunk Systems',country:'Australia',status:'Verified dirt maker',founded:1995,dirt_count:2,description:'Australian builder documented for the FZ002 Gated Bass Fuzz and Brown Dog Gated Bass Fuzz.',dirt_evidence:'FZ002 Gated Bass Fuzz; Brown Dog Gated Bass Fuzz',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-MONTARBO-01',name:'Montarbo',country:'Italy',status:'Verified dirt maker',founded:null,dirt_count:1,description:'Italian manufacturer documented for the Sinfhoton fuzz/distortion.',dirt_evidence:'Sinfhoton fuzz/distortion',qualification:'verified_dirt_maker'}
  ];
  const aliases={
    'rosac / sierra electronics':'BLD-QUAL-ROSAC-01',
    'aul instruments':'BLD-QUAL-AUL-01',
    'chunk systems':'BLD-QUAL-CHUNK-01',
    'montarbo':'BLD-QUAL-MONTARBO-01'
  };
  window.fetch=async(input,init)=>{
    const response=await nativeFetch(input,init);
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.endsWith('/data.json')||merged) return response;
    try{
      const base=await response.clone().json();
      base.builders=Array.isArray(base.builders)?base.builders:[];
      const byName=new Map(base.builders.map(b=>[String(b.name||'').trim().toLowerCase(),b]));
      for(const q of qualified){
        const key=String(q.name).trim().toLowerCase();
        const existing=byName.get(key)||base.builders.find(b=>aliases[key]===b.builder_id);
        if(existing){
          existing.qualification='verified_dirt_maker';
          existing.status=q.status;
          existing.dirt_evidence=q.dirt_evidence;
          existing.dirt_count=Math.max(Number(existing.dirt_count||0),Number(q.dirt_count||0));
          if(!existing.description||existing.description.startsWith('Historical builder')) existing.description=q.description;
        }else{
          base.builders.push({...q});
        }
      }
      merged=true;
      return new Response(JSON.stringify(base),{status:200,headers:{'Content-Type':'application/json'}});
    }catch(err){console.error('Dirt qualification gate failed:',err);return response;}
  };
})();
