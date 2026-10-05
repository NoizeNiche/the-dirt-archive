# Contributing to The Dirt Archive

The archive is maintained as a data product first and a website second. Changes should leave the repository easier to understand and the catalog more trustworthy than they found it.

## Before editing

Read:

- `START_HERE.md`
- `ARCHIVE_GOVERNANCE.md`
- `CURRENT_STATE.md`
- `SITE_ARCHITECTURE.md`
- `docs/PROJECT_MAP.md`

Then inspect the current `main` state. Never work from an old conversational checkpoint.

## Data rules

The canonical identity is **Builder + Pedal**.

Do not create duplicate identities for alternate capitalization, retailer wording, cosmetic colorways, or ordinary revision names when an existing canonical identity already covers the product.

A missing exact photo is a legitimate state. Never solve a photo gap by substituting another pedal, clone, or guessed image.

Research prose belongs in `research/pedals/`. Public catalog wiring belongs in `research/PEDAL_INDEX.json`. Derived queues and trackers are generated from their owners and should not be hand-edited.

## Site rules

Keep page-specific behavior in its controller under `assets/js/` and page-specific presentation in its `assets/css/`. Shared loading, identity keying, routing and cache behavior belong in `assets/js/archive-core.js`.

Avoid inline style or script when the existing architecture has an appropriate external owner.

When adding a public surface, wire it into navigation, sitemap generation, validation, and the deployment audit where applicable.

## Workflow rules

Prefer one coherent change over a chain of tiny commits.

Do not add a recurring workflow when a manual or explicit-kick workflow is sufficient.

Any workflow that writes canonical data must have explicit permissions, a concurrency policy, a bounded workload, and a clear single owner for the files it mutates.

Do not create recursive workflow dispatch loops without a strong operational reason.

## Validation

At minimum:

```bash
python scripts/validate-archive.py
```

For public browser changes, also run the relevant browser audit locally or through the deployment workflow.

Before merging, confirm:

1. canonical identity did not change unexpectedly
2. tracker / manifest / queue state remains synchronized
3. no exact-photo provenance rule was weakened
4. the public page still exposes the exact Builder + Pedal identity
5. architecture changes are documented

## Commit style

Use direct, descriptive imperative messages, for example:

- `Refine builder archive navigation`
- `Harden exact-photo source matching`
- `Document Cloudflare edge architecture`

Avoid vague messages such as `fix stuff`, `update site`, or `more changes`.
