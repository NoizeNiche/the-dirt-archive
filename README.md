# The Dirt Archive

**A Pedal Archive For Overdrive / Distortion / Fuzz**

The Dirt Archive is a static, research-driven catalog of guitar dirt pedals. The public site is deliberately fast and simple: **Search → Dirt Type → Builder → Pedal**.

The repository is the source of truth for the archive. Canonical catalog data, research records, exact-photo provenance, validation rules, and deployment are version-controlled so the project can grow without losing its identity rules.

## Production status

- **Canonical catalog:** 4,200 records
- **Research:** 4,200 deep-researched records
- **Exact local photos:** 4,200
- **Current launch gate:** exact-photo recovery is clear; final production QA remains
- **Production origin:** GitHub Pages
- **Planned edge layer:** Cloudflare in front of the Pages origin once a custom domain is configured

The four remaining exact-photo gaps are tracked in `research/PHOTO_BACKLOG.csv`. The archive never substitutes a different pedal, clone, or guessed image for an exact missing photograph.

## Start here

For project-maintenance work, read these in order:

1. [START_HERE.md](START_HERE.md) for operating rules and the recovery protocol.
2. [ARCHIVE_GOVERNANCE.md](ARCHIVE_GOVERNANCE.md) for identity, research, photo and public-product rules.
3. [CURRENT_STATE.md](CURRENT_STATE.md) for the latest committed checkpoint.
4. [SITE_ARCHITECTURE.md](SITE_ARCHITECTURE.md) for system ownership and data flow.
5. [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md) for the developer-facing repository map.
6. [docs/OPERATIONS.md](docs/OPERATIONS.md) for maintenance and CI.
7. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for GitHub Pages + Cloudflare architecture.

## Public site

| Surface | Purpose |
| --- | --- |
| `index.html` | Main searchable archive |
| `pedal-detail.html` | Canonical exact-record detail page |
| `builder.html` | Builder-focused catalog view |
| `builders.html` | Builder directory |
| `identify.html` | Pedal identification utility |
| `compare.html` | Device-local exact-record comparison |
| `methodology.html` | Public methodology |
| `photo-credits.html` | Image provenance and credits |
| `corrections.html` | Exact-record correction intake |
| `audit.html` | Public audit/status surface |
| `404.html` | Search-friendly not-found page |

## Source of truth

The archive follows a one-owner rule:

- `research/PEDAL_INDEX.json` owns canonical public identities and relationships.
- `research/pedals/**/*.md` owns research prose.
- `assets/pedals/**` owns archived photo assets.
- Catalog `image_source_url` / `image_source_page` fields preserve photo provenance.
- `research/pedals/PEDAL_IMAGES.json` mirrors the catalog for photo verification.
- `research/PRP_TRACKER.csv` stores derived status.
- `research/RESEARCH_QUEUE.json` is a generated working view and must not be hand-edited.
- `scripts/validate-archive.py` is the structural quality gate.
- `assets/js/archive-core.js` owns shared client-side loading and identity behavior.
- `.github/workflows/deploy-pages.yml` owns GitHub Pages deployment orchestration.

## Repository layout

```
/
├── .github/
│   └── workflows/        CI, deployment, research and recovery automation
├── assets/
│   ├── css/               page presentation
│   ├── js/                shared/client-side archive behavior
│   └── pedals/            exact local photo assets
├── docs/                  developer-facing operations and architecture notes
├── research/              canonical data, research records and audit state
├── scripts/               build, sync, audit, recovery and validation tooling
├── index.html             public archive shell
└── *.html                 other public archive surfaces
```

## Local development

The site is intentionally static. A lightweight local server is provided:

```bash
node scripts/serve-static.js
```

Useful checks:

```bash
python scripts/validate-archive.py
python scripts/refresh-image-cache-report.py
```

Browser-level deployment auditing is orchestrated by GitHub Actions because it requires Playwright and the full production data tree.

## CI philosophy

Automation is divided into two tempos.

**Production lanes** are bounded, resumable, and serialized when they mutate canonical data.

**Archive-growth lanes** run on a weekly cadence or explicit kicks so research can grow without turning every catalog edit into a project-wide CI storm.

Heavy exhaustive audits are scheduled/manual. The hourly live-health check is read-only.

## Contribution standard

Accuracy beats volume. Every new canonical record must preserve exact Builder + Pedal identity, clear provenance, and the existing ownership boundaries.

See [CONTRIBUTING.md](CONTRIBUTING.md) before making archive or infrastructure changes.

## Licensing

No open-source license is currently declared for the repository. Do not assume that the catalog data, research prose, images, or other project material is freely reusable.
