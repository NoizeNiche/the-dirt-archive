# Developer Project Map

This is the quick orientation layer for developers. The longer policy documents remain authoritative for their own domains.

## Public application

Root `*.html` files are deliberately thin static page shells.

`assets/js/` contains browser controllers and shared runtime code.

`assets/css/` contains page-specific presentation. The visual system is intentionally shared through repeated tokens, surfaces, and component patterns rather than through a framework dependency.

## Canonical data

```
research/PEDAL_INDEX.json
        |
        +-- public catalog identity
        +-- public relationships / versions
        +-- local image + provenance references
                |
                +-- research/pedals/**/*.md
                +-- assets/pedals/**
                +-- research/pedals/PEDAL_IMAGES.json
```

`research/PRP_TRACKER.csv` and `research/RESEARCH_QUEUE.json` are derived operational views.

## Scripts

The `scripts/` directory is intentionally flat at the current scale. File names carry ownership prefixes:

- `build-*` and `generate-*` produce derived artifacts.
- `sync-*` reconciles canonical and derived state.
- `audit-*` and `verify-*` check integrity.
- `cache-*` and `browser-*` handle photo recovery.
- `photo-foreman.py` and recovery helpers coordinate photo publishing.
- `research-*` and `synthesize-*` handle evidence and editorial research.
- `serve-static.js` provides deterministic local HTTP serving for browser audits.
- `validate-archive.py` is the main structural contract checker.

The directory should not be split into nested tool folders unless script count or ownership boundaries materially justify it. Unnecessary indirection is not a virtue.

## GitHub Actions

### Automatic production

- **Deploy The Dirt Archive**: filtered `main` changes to GitHub Pages.
- **Validate The Dirt Archive**: pull requests and relevant `main` changes.
- **Hourly Site Health**: read-only live smoke check.
- **Fast photo catch-up**: explicit photo kick/manual, bounded and serialized.
- **Research worker team**: weekly and explicit research kicks.

### Scheduled/manual quality

Exhaustive detail/photo audits, photo provenance/content/source-fidelity audits, research-content audit, and cache utilities remain available without running on every commit.

### Manual specialist lanes

Legacy PRP1 closeout, direct/emergency/parallel photo recovery, metadata repair, research evidence/synthesis and historical probes remain available when their specialized behavior is needed.

This distinction is intentional. A workflow being present in `.github/workflows/` does not mean it should execute on every commit.

## Where changes belong

| Change | Owner |
| --- | --- |
| New public pedal identity | `research/PEDAL_INDEX.json` |
| Research prose | `research/pedals/` |
| Exact photo asset | `assets/pedals/` |
| Photo provenance | canonical catalog + photo-source tables |
| Shared page runtime | `assets/js/archive-core.js` |
| Page interaction | corresponding `archive-*.js` |
| Page styling | corresponding `archive-*.css` |
| Structural rules | `scripts/validate-archive.py` |
| Deployment | `.github/workflows/deploy-pages.yml` |
| CI orchestration | `.github/workflows/` |
| Operational guidance | `docs/` |

## What not to do

Do not create a second public catalog, hand-edit generated queue state, weaken exact-photo identity checks to improve coverage, add another public image host without an explicit provenance reason, make hourly health mutate catalog state, or add recurring automation merely to compensate for a one-time migration.
