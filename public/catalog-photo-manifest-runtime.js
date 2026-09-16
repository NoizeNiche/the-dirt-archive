(() => {
  const native = window.imageFor;
  window.imageFor = p => {
    const manifest = window.DIRT_PHOTO_MANIFEST || {};
    const hit = manifest[p?.model_name];
    if (hit && hit.src) return hit;
    return native ? native(p) : null;
  };
  window.DIRT_PHOTO_MANIFEST_READY = true;
  if (typeof window.route === 'function') window.route();
})();
