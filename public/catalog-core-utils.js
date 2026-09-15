(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const slug = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const byId = (arr,id,key) => (arr || []).find(x => x && x[key] === id) || null;
  const inDirt = p => ['Fuzz','Overdrive','Distortion'].includes(p?.primary_category);
  const findBuilder = (data,id) => byId(data?.builders,id,'builder_id');
  const findPedal = (data,key) => {
    const k = String(key ?? '');
    return (data?.pedals || []).find(p => String(p.pedal_id) === k)
      || (data?.pedals || []).find(p => String(p.model_name || '') === k)
      || (data?.pedals || []).find(p => String(p.model_name || '').trim().toLowerCase() === k.trim().toLowerCase())
      || (data?.pedals || []).find(p => slug(p.model_name) === slug(k));
  };
  const years = p => p?.introduced_year
    ? `${p.introduced_year}${p.discontinued_year ? `–${p.discontinued_year}` : '–present'}`
    : 'Date range not established';
  const gensFor = (data,p) => (data?.generations || []).filter(g => g.pedal_id === p?.pedal_id);
  const runsFor = (data,p) => {
    const ids = new Set(gensFor(data,p).map(g => g.generation_id));
    return (data?.runs || []).filter(r => ids.has(r.generation_id));
  };
  const distinguishersFor = (data,p) => {
    const ids = new Set(gensFor(data,p).map(g => g.generation_id));
    return (data?.distinguishers || []).filter(d => ids.has(d.generation_id));
  };
  const counts = data => ({
    builders: (data?.builders || []).length,
    dirt: (data?.pedals || []).filter(inDirt).length,
    generations: (data?.generations || []).length,
    sources: (data?.sources || []).length
  });
  window.DIRT_CORE = Object.assign(window.DIRT_CORE || {}, {esc,slug,byId,inDirt,findBuilder,findPedal,years,gensFor,runsFor,distinguishersFor,counts});
})();