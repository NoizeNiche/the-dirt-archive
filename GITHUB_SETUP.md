# The Dirt Archive — GitHub + Cloudflare setup

## Repository layout

The repository is intentionally split into a public site folder and project documentation:

```text
/public
  index.html
  styles.css
  app.js
  data.json
  .assetsignore
README.md
ROADMAP.md
DEPLOY.md
GITHUB_SETUP.md
image_sources.md
seed_preview.sql
supabase_schema.sql
wrangler.jsonc
```

Only `/public` is configured as the Cloudflare Static Assets directory. This prevents internal project documents and SQL files from being served as website assets.

## First Cloudflare deployment

Use the GitHub-connected Workers deployment screen.

- Project name: `the-dirt-archive`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Path: `/`
- Do not add API-token variables for this static prototype.

Wrangler reads `wrangler.jsonc`, finds `assets.directory = "./public"`, and serves the static website from that directory.

## Important

Do not put secrets, passwords, Supabase service-role keys, private contributor information, or unpublished research in `/public`.
