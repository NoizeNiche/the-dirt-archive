(() => {
  const settleRuntime = () => {
    if (window.__dirtArchiveRuntimeSettled) return;
    if (!Array.isArray(window.DATA?.pedals) || !Array.isArray(window.DATA?.builders) || typeof window.route !== 'function') {
      setTimeout(settleRuntime, 50);
      return;
    }
    window.__dirtArchiveRuntimeSettled = true;
    try { window.route(); } catch (error) { console.error('Archive route finalization failed:', error); }
    window.dispatchEvent(new CustomEvent('dirtarchive:runtime-ready'));
  };

  window.addEventListener('load', settleRuntime, {once: true});
  setTimeout(settleRuntime, 0);
})();
