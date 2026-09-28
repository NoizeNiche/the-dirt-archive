const correctionParams=new URLSearchParams(location.search);
const correctionBuilder=correctionParams.get('builder')||'';
const correctionPedal=correctionParams.get('pedal')||'';
const correctionIssue=correctionParams.get('issue')||'';
const correctionContext=document.getElementById('correctionContext');
const openForm=document.getElementById('openCorrectionForm');
if(correctionBuilder||correctionPedal){
  correctionContext.hidden=false;
  correctionContext.innerHTML='<strong>Record in question</strong><span>'+esc(correctionBuilder)+' · '+esc(correctionPedal)+'</span>'+(correctionIssue==='photo'?'<small>Photo issue selected</small>':'');
  if(openForm){
    const u=new URL(openForm.href);
    u.searchParams.set('title','[Correction] '+correctionBuilder+' / '+correctionPedal+(correctionIssue==='photo'?' - photo issue':''));
    u.searchParams.set('body','## Exact record\n\n**Builder:** '+correctionBuilder+'\n\n**Pedal:** '+correctionPedal+'\n\n'+(correctionIssue==='photo'?'## Photo issue\n\n':'')+'## What appears to be wrong?\n\n');
    openForm.href=u.href;
  }
}