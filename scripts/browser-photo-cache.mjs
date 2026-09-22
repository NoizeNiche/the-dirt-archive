  if (normalized.length <= 90) return normalized;
  const digest = crypto.createHash('sha1').update(raw).digest('hex').slice(0, 10);
  return normalized.slice(0, 79).replace(/-+$/g, '') + '-' + digest;
}

function exactIdentity(value) {
  return String(value || '').trim().toLowerCase();
}

function compactIdentity(value) {
  return normalizedIdentity(value).replace(/\\s+/g, '');
}

function collisionSlug(value) {
  const raw = String(value || '').trim();
  const plusAware = raw.replace(/\+/g, ' plus ');
  const readable = slug(plusAware);
  const base = slug(raw);
  if (readable !== base) return readable;
  return base + '-' + crypto.createHash('sha1').update(raw).digest('hex').slice(0, 8);
}

function relativeAssetPath(targetPath) {
  return './' + path.relative(ROOT, targetPath).split(path.sep).join('/');
}

function sameManifestOwner(owner, entry) {
  if (!owner) return false;
  return exactIdentity(owner.builder) === exactIdentity(entry.company || entry.builder) &&
    exactIdentity(owner.pedal) === exactIdentity(entry.pedal);
}

function safeAssetSlug(builder, name, buildPath, entry) {
  const base = slug(name);
  const basePath = buildPath(base);
  const owner = manifestOwnersByImage.get(relativeAssetPath(basePath));
  if (!fs.existsSync(basePath) || !owner || sameManifestOwner(owner, entry)) return base;

  let candidate = collisionSlug(name);
  let candidatePath = buildPath(candidate);
  const candidateOwner = manifestOwnersByImage.get(relativeAssetPath(candidatePath));
  if (fs.existsSync(candidatePath) && candidateOwner && !sameManifestOwner(candidateOwner, entry)) {
    candidate = slug(name) + '-' + crypto.createHash('sha1').update(String(name || '')).digest('hex').slice(0, 8);
  }
  return candidate;
}

function target(entry) {
  const builder = entry.company || entry.builder;
  if (entry.catalog_role === 'variation' && entry.parent_pedal) {
    const variant = entry.variation_name || entry.pedal;
    const parentDir = path.join(ROOT, 'assets/pedals', slug(builder), slug(entry.parent_pedal), 'variants');
    const variantSlug = safeAssetSlug(builder, variant, candidate => path.join(parentDir, candidate + '.webp'), entry);
    return path.join(parentDir, variantSlug + '.webp');
  }
  const builderSlug = slug(builder);
  const pedalSlug = safeAssetSlug(
    builder,
    entry.pedal,
    candidate => path.join(ROOT, 'assets/pedals', builderSlug, candidate, 'primary.webp'),
    entry
  );
  return path.join(ROOT, 'assets/pedals', builderSlug, pedalSlug, 'primary.webp');
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function identityTokens(pedal) {
  const ignored = new Set(['the', 'and', 'with', 'distortion', 'overdrive', 'fuzz', 'crunch', 'drive', 'double', 'pro']);
  return normalizedIdentity(pedal)
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => (token.length >= 4 || /\d/.test(token)) && !ignored.has(token));
}

function identityPhrases(pedal) {
  const raw = String(pedal || '').trim();
  const variants = new Set([
    raw,
    raw.split('(')[0].trim(),
    raw.split(' - ')[0].trim()
  ]);
  return [...variants]
    .map(normalizedIdentity)
    .filter(value => value.length >= 5 && value.split(/\s+/).length >= 2);
}

function pageMatchesSearchIdentity(entry, title, h1) {
  const haystack = normalizedIdentity(String(title || '') + ' ' + String(h1 || ''));
  const compactHaystack = compactIdentity(String(title || '') + ' ' + String(h1 || ''));
  const pedalTokens = identityTokens(entry.pedal);
  const builderTokens = identityTokens(entry.company);
  const pedalPhrases = identityPhrases(entry.pedal);
  const phraseMatch = pedalPhrases.some(phrase =>
    haystack.includes(phrase) || compactHaystack.includes(compactIdentity(phrase))
  );
  const pedalPhrase = normalizedIdentity(entry.pedal);
  const exactPhrase = pedalPhrase && pedalPhrase.split(/\s+/).length >= 2 &&
    (haystack.includes(pedalPhrase) || compactHaystack.includes(compactIdentity(pedalPhrase)));
  const pedalHits = pedalTokens.filter(token => haystack.includes(token)).length;
  const builderHits = builderTokens.filter(token => haystack.includes(token)).length;
  const requiredPedalHits = pedalTokens.length >= 2 ? Math.min(2, pedalTokens.length) : Math.max(1, pedalTokens.length);

  // Search-result identity must be proven by the title/H1 itself. For names
  // written as "Model - descriptor", the model phrase before the dash is often
  // the exact product name shown by marketplaces, so recognize that phrase while
  // still requiring builder context. Do not use arbitrary body text here.
  return Boolean(
    (phraseMatch && builderHits >= 1) ||
    (exactPhrase && builderHits >= 1) ||
    (pedalHits >= requiredPedalHits && builderHits >= 1)
  );