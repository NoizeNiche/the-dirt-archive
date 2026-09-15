(() => {
  const preApp = [
    'catalog-bootstrap.js','catalog-bootstrap-10.js','catalog-bootstrap-11.js',
    'catalog-dirt-qualification-gate.js','catalog-dirt-qualification-lectrolab.js','catalog-dirt-qualification-aca-sunn.js','catalog-dirt-qualification-astro-fisonic-verlage.js','catalog-dirt-qualification-eastcoast-ny.js','catalog-dirt-qualification-jansen.js',
    ...Array.from({length:13},(_,i)=>`catalog-extensions-${i+12}.js`),
    'catalog-verified-25.js',
    ...Array.from({length:92},(_,i)=>`catalog-extensions-${i+26}.js`),
    ...Array.from({length:20},(_,i)=>`catalog-research-${String(i+1).padStart(2,'0')}.js`),
    ...Array.from({length:8},(_,i)=>`catalog-research-${String(i+3).padStart(2,'0')}-generations.js`),
    ...Array.from({length:10},(_,i)=>`catalog-thumbnails-${i+33}.js`)
  ];
  const postApp = [
    'catalog-recent-home.js','catalog-identity-routing.js','catalog-research-runtime.js','catalog-research-ui.js','catalog-lineage-runtime.js',
    'catalog-thumbnails-33-runtime.js',...Array.from({length:8},(_,i)=>`catalog-thumbnails-${i+35}-runtime.js`),
    'catalog-polish.js','catalog-visual-references.js','catalog-cleared-images.js',
    ...Array.from({length:13},(_,i)=>`catalog-specimen-registry-${String(i+1).padStart(2,'0')}.js`),
    'catalog-specimen-ui.js','catalog-browse-ui.js'
  ];
  const load = src => new Promise((resolve,reject) => {
    const s=document.createElement('script'); s.src=src; s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
  });
  (async () => {
    try {
      for (const src of preApp) await load(src);
      await load('catalog-organization.js');
      await load('app.js');
      for (const src of postApp) await load(src);
    } catch (err) { console.error('Dirt Archive catalog manifest failed:', err); }
  })();
})();
