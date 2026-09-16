(() => {
  let promise = null;

  function loadArchiveData() {
    if (promise) return promise;

    promise = fetch('data.json', {cache: 'no-store'})
      .then(response => {
        if (!response.ok) throw new Error(`Archive data request failed: HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!data || typeof data !== 'object') throw new Error('Archive data is not an object');
        return data;
      })
      .catch(error => {
        promise = null;
        throw error;
      });

    return promise;
  }

  window.DIRT_ARCHIVE = Object.assign(window.DIRT_ARCHIVE || {}, {loadArchiveData});

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
