(()=>{
  const nativeFetch=window.fetch.bind(window);
  let merged=false;
  const qualified=[
    {builder_id:'BLD-QUAL-GP-01',name:'G. P. Electronics',country:'United Kingdom (Devon)',status:'Verified dirt maker',founded:1964,dirt_count:1,description:'Early British fuzz maker documented for the Harmonic Generator, with construction carried out at the G. P. Electronics workshop.',dirt_evidence:'Harmonic Generator',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-ROGERMAYER-01',name:'Roger Mayer',country:'United Kingdom',status:'Verified custom dirt maker',founded:1964,dirt_count:2,description:'Early British custom effects maker documented for 1964 fuzz boxes and the Octavia lineage.',dirt_evidence:'1964 custom fuzz boxes; Octavia',qualification:'verified_custom_dirt_maker'},
    {builder_id:'BLD-QUAL-REDRHODES-01',name:"Orville 'Red' Rhodes",country:'USA (California)',status:'Verified custom dirt maker',founded:1961,dirt_count:1,description:'California electronics technician and musician documented as the maker of multiple early Rhodes fuzz boxes for professional players.',dirt_evidence:'Rhodes Fuzz Box',qualification:'verified_custom_dirt_maker'},
    {builder_id:'BLD-QUAL-TVM-01',name:'TVM Manchester Ltd / TVM Sound',country:'United Kingdom (Salford)',status:'Verified dirt maker',founded:1957,dirt_count:1,description:'Manchester-area amplifier and PA manufacturer documented for a surviving 1960s-era TVM Fuzz Box.',dirt_evidence:'TVM Fuzz Box',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-EFEL-01',name:'EF-EL / Calderoni Musica',country:'Italy',status:'Verified dirt maker',founded:null,dirt_count:1,description:'Italian effects manufacturer documented for late-1960s fuzz/distortion products sold under multiple customer brands.',dirt_evidence:'Vox by EF-EL Distortion / EUR Distortion family',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-RIDINGER-01',name:'fOXX / Ridinger Associates Inc.',country:'USA (California)',status:'Verified dirt maker',founded:1966,dirt_count:2,description:'Independent American effects lineage documented for the Liverpool Fuzz-Tone and later fOXX fuzz products.',dirt_evidence:'Liverpool Fuzz-Tone; Foxx Tone Machine',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-SEAMOON-01',name:'Seamoon Inc.',country:'USA (California)',status:'Verified dirt maker',founded:1973,dirt_count:1,description:'Berkeley effects maker documented for the Fresh Fuzz; original builder identity is kept separate from later tribute/reissue products.',dirt_evidence:'Fresh Fuzz',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-CARLSBRO-01',name:'Carlsbro',country:'United Kingdom',status:'Verified dirt maker',founded:1966,dirt_count:1,description:'British amplifier maker documented for the original 1966 Fuzz-Tone; later fuzz production involved Sola Sound.',dirt_evidence:'Fuzz-Tone',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-ROSAC-01',name:'Rosac / Sierra Electronics',country:'USA (California)',status:'Verified dirt maker',founded:1968,dirt_count:3,description:'Bakersfield effects maker documented for Nu-Fuzz, Nu-Wa-Fuzz and related dirt products.',dirt_evidence:'Nu-Fuzz; Nu-Wa-Fuzz; Nu-Fuzz Distortion Blender',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-AUL-01',name:'Aul Instruments',country:'USA',status:'Verified dirt maker',founded:1967,dirt_count:1,description:'Historical U.S. manufacturer documented for the Aul Instruments Fuzz and contract production of the Guild Foxey Lady run.',dirt_evidence:'Aul Instruments Fuzz; Guild Foxey Lady production',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-CHUNK-01',name:'Chunk Systems',country:'Australia',status:'Verified dirt maker',founded:1995,dirt_count:2,description:'Australian builder documented for the FZ002 Gated Bass Fuzz and Brown Dog Gated Bass Fuzz.',dirt_evidence:'FZ002 Gated Bass Fuzz; Brown Dog Gated Bass Fuzz',qualification:'verified_dirt_maker'},
    {builder_id:'BLD-QUAL-MONTARBO-01',name:'Montarbo',country:'Italy',status:'Verified dirt maker',founded:null,dirt_count:1,description:'Italian manufacturer documented for the Sinfhoton fuzz/distortion.',dirt_evidence:'Sinfhoton fuzz/distortion',qualification:'verified_dirt_maker'}
  ];
  const aliases={
    'g. p. electronics':'BLD-QUAL-GP-01','roger mayer':'BLD-QUAL-ROGERMAYER-01',"orville 'red' rhodes":'BLD-QUAL-REDRHODES-01','tvm manchester ltd / tvm sound':'BLD-QUAL-TVM-01','ef-el / calderoni musica':'BLD-QUAL-EFEL-01','fox / ridinger associates inc.':'BLD-QUAL-RIDINGER-01','foxx / ridinger associates inc.':'BLD-QUAL-RIDINGER-01','rosac / sierra electronics':'BLD-QUAL-ROSAC-01','aul instruments':'BLD-QUAL-AUL-01','chunk systems':'BLD-QUAL-CHUNK-01','montarbo':'BLD-QUAL-MONTARBO-01'
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
        if(existing){existing.qualification=q.qualification;existing.status=q.status;existing.dirt_evidence=q.dirt_evidence;existing.dirt_count=Math.max(Number(existing.dirt_count||0),Number(q.dirt_count||0));if(!existing.description||existing.description.startsWith('Historical builder'))existing.description=q.description;}
        else base.builders.push({...q});
      }
      merged=true;return new Response(JSON.stringify(base),{status:200,headers:{'Content-Type':'application/json'}});
    }catch(err){console.error('Dirt qualification gate failed:',err);return response;}
  };
})();
