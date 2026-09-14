(() => {
  // Rolling homepage activity rail. Keep newest-first and update this list with each meaningful archive release.
  const RECENT_HOME_MODELS = [
    'Morley Power Wah Fuzz PWF',
    'Jennings FP.1 Fuzz',
    'EKO Multitone',
    'fOXX Clean Machine',
    'OD-909 Overdrive Pro'
  ];

  function recentHomeRecords() {
    const wanted = RECENT_HOME_MODELS.map(name => DATA.pedals.find(p => p.model_name === name)).filter(Boolean);
    return wanted.slice(0, 5);
  }

  // Replace only the homepage renderer. All inner routes and archive data handling remain untouched.
  const originalHome = home;
  home = function recentHome() {
    const featured = ['Fuzz Face','Tone Bender','Big Muff Pi','TS808 Tube Screamer','RAT']
      .map(n => DATA.pedals.find(p => p.model_name === n)).filter(Boolean);
    const bs = [...DATA.builders]
      .filter(b => DATA.pedals.some(p => p.primary_builder_id === b.builder_id && inDirt(p)))
      .sort((a,b) => a.name.localeCompare(b.name)).slice(0,24);
    const recent = recentHomeRecords();

    app.innerHTML = `<section class="hero"><div><div class="eyebrow">FOUNDING COLLECTION · DIRT</div><h1>Document<br>the dirt.</h1><p class="hero-copy">An independent reference project for <strong>overdrive, distortion and fuzz</strong>. Browse the builders, follow the lineage, compare production periods, and figure out which version of the box you own.</p><div class="catalog-callout"><div class="callout"><span class="num">${stat('builders')}</span><span class="label">builders represented</span></div><div class="callout"><span class="num">${stat('dirt')}</span><span class="label">dirt records</span></div><div class="callout"><span class="num">${stat('generations')}</span><span class="label">structured generations</span></div></div></div><aside class="hero-side"><div class="big">01</div><div class="label">Founding issue</div><div class="big" style="margin-top:25px;font-size:62px">${stat('sources')}</div><div class="label">source records</div></aside></section><section class="section"><div class="section-head"><h2>Browse by builder</h2><div class="section-note">The builder is the front door</div></div><div class="builder-grid">${bs.map(builderCard).join('')}</div><div style="margin-top:17px"><a class="eyebrow" href="#/builders">View the complete builder index →</a></div></section><section class="section"><div class="section-head"><h2>Recently added / updated</h2><div class="section-note">Latest five archive changes</div></div><div class="pedal-grid">${recent.map(pedalCard).join('')||'<div class="empty">Recent archive activity will appear here.</div>'}</div></section><section class="section"><div class="section-head"><h2>Founding collection</h2><div class="section-note">Five historical stress tests</div></div><div class="pedal-grid">${featured.map(pedalCard).join('')}</div></section><section class="section"><div class="editorial-grid"><div class="paper-box"><h3>Browse the dirt</h3><p>Start with the kind of dirt you want to explore.</p><div class="link-list"><a href="#/category/fuzz">Fuzz →</a><a href="#/category/overdrive">Overdrive →</a><a href="#/category/distortion">Distortion →</a></div></div><div class="paper-box"><h3>Document the object, not the recipe.</h3><p>Meaningful technical distinctions may be recorded when they help identify a production period. The archive does not publish schematics, PCB layouts, gutshot libraries, complete bills of materials or cloning instructions.</p></div></div></section>`;
  };

  // Keep the original symbol referenced so the intent is explicit and future changes stay local.
  window.DIRT_ORIGINAL_HOME = originalHome;
})();
