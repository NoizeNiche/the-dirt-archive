(() => {
  // Compatibility shim. The primary research runtime now owns badge/status settling.
  if (window.DIRT_RESEARCH_UI?.schedule) window.DIRT_RESEARCH_UI.schedule();
})();
