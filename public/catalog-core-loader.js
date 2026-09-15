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

  window.DIRT_ARCHIVE = Object.assign(window.DIRT_ARCHIVE || {}, {
    loadArchiveData
  });
})();
