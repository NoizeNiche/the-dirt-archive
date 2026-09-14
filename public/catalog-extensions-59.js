(() => {
  const nativeFetch = window.fetch.bind(window);
  let merged = false;
  async function merge(base) {
    base.builders = base.builders || [];
    base.pedals = base.pedals || [];
    base.generations = base.generations || [];
    base.distinguishers = base.distinguishers || [];
    base.claims = base.claims || [];
    base.sources = base.sources || [];

    const builderId = 'BLD-MOD-WALRUS-01';
    if (!base.builders.some(b => b.builder_id === builderId)) {
      base.builders.push({
        builder_id: builderId,
        name: 'Walrus Audio',
        aliases: '',
        country: 'USA',
        status: 'Active',
        founded: null,
        description: 'Modern effects manufacturer with a documented 385 Overdrive family and multiple later revisions/editions.',
        primary_source: 'https://www.walrusaudio.com/',
        source_confidence: 'High'
      });
    }

    let pedal = base.pedals.find(p => p.model_name === '385 Overdrive');
    if (!pedal) {
      pedal = {
        pedal_id: 'MOD-PED-0044',
        primary_builder_id: builderId,
        model_name: '385 Overdrive',
        primary_category: 'Overdrive',
        subcategory: 'Modern preservation / variant research',
        introduced_year: 2016,
        discontinued_year: null,
        production_status: 'Current family / later revision documented',
        description: 'Walrus Audio 385 Overdrive family, including the MKII revision.',
        archive_status: 'Research',
        confidence: 'Verified'
      };
      base.pedals.push(pedal);
    }

    const generationId = 'GEN-MOD-0044-MKII';
    if (!base.generations.some(g => g.generation_id === generationId)) {
      base.generations.push({
        generation_id: generationId,
        pedal_id: pedal.pedal_id,
        name: 'MKII',
        start_year: 2024,
        end_year: null,
        summary: 'Revision adds A/B selection with a second Gain/Volume pair plus a 385+ high-gain switch, while retaining shared Tone controls. Manufacturer documents two enclosure/artwork treatments.',
        description: 'Modern preservation generation record based on Walrus Audio product documentation.',
        status: 'VERIFIED'
      });
    }

    const distinguisherId = 'DST-MOD-0044-MKII';
    if (!base.distinguishers.some(d => d.distinguisher_id === distinguisherId)) {
      base.distinguishers.push({
        distinguisher_id: distinguisherId,
        generation_id: generationId,
        type: 'Controls / appearance',
        description: 'MKII has an A/B switch, two sets of Gain and Volume controls, a 385+ switch, shared Tone controls, and documented black enclosure/artwork variants.',
        identification_value: 'Look for the A/B selector, doubled Gain/Volume controls, 385+ switch, and the documented MKII enclosure/artwork treatments.',
        source_url: 'https://www.walrusaudio.com/products/385-overdrive-mkii',
        status: 'VERIFIED'
      });
    }

    const claimId = 'CLM-MOD-0044-MKII';
    if (!base.claims.some(c => c.claim_id === claimId)) {
      base.claims.push({
        claim_id: claimId,
        subject_id: pedal.pedal_id,
        claim_text: 'Walrus Audio states that the 385 MKII adds an A/B switch and a second Gain/Volume set to accommodate both the lighter and heavier 385 sounds in one pedal, plus a 385+ gain/saturation switch.',
        status: 'VERIFIED',
        confidence: 'High',
        source_url: 'https://www.walrusaudio.com/products/385-overdrive-mkii'
      });
    }

    const sourceUrl = 'https://www.walrusaudio.com/products/385-overdrive-mkii';
    if (!base.sources.some(s => s.url === sourceUrl)) {
      base.sources.push({
        source_id: 'SRC-MOD-0044',
        title: '385 Overdrive MKII',
        url: sourceUrl,
        source_type: 'manufacturer product page',
        author_or_org: 'Walrus Audio'
      });
    }

    return base;
  }
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.endsWith('/data.json') || merged) return response;
    try {
      const base = await response.clone().json();
      const data = await merge(base);
      merged = true;
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('Variant evidence extension 59 failed:', err);
      return response;
    }
  };
})();
