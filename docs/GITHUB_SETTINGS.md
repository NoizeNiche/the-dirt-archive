# GitHub Repository Settings

This document records the intended repository-level settings. These are GitHub account controls rather than files in the published site.

## Production model

- Default branch: `main`
- Pages source: GitHub Actions
- Pages origin: GitHub Pages
- Edge/DNS target: Cloudflare after the production custom domain is configured
- Repository is public
- Pull requests are preferred for structural changes; direct automation commits are reserved for bounded archive-owned write lanes.

## Recommended branch controls

When the repository is ready for stricter collaboration:

1. Protect `main`.
2. Require the archive validation check before merge.
3. Require pull requests for human changes.
4. Require branches to be up to date before merge when practical.
5. Keep workflow permissions minimal.
6. Retain the single production deployment workflow.

Do not enable settings that force every research/photo maintenance commit through heavyweight exhaustive audits. The repository's workflow architecture intentionally separates fast validation from scheduled deep QA.

## Cloudflare

Cloudflare configuration belongs to the DNS/edge account, not to this repository. Do not add a second Cloudflare Pages deployment pipeline.

When a production custom domain is selected, follow `docs/DEPLOYMENT.md`.
