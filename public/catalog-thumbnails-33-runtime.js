(() => {
  const originalImageFor = window.imageFor;
  window.imageFor = (p) => {
    const lead = window.DIRT_MEDIA?.[p?.model_name];
    if (lead && ['Licensed','Permission granted','Owned','Public domain','CC-BY','CC-BY-SA'].includes(lead.rights_status) && lead.public_use_decision === 'approved') return lead;
    return originalImageFor ? originalImageFor(p) : null;
  };
  // Refresh the current route after the media registry is installed so cards use
  // the updated resolver without changing the core application bundle yet.
  if (typeof window.route === 'function') window.route();
})();
