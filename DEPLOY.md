# Deploying The Dirt Archive

The current project uses Cloudflare Workers Static Assets. Cloudflare recommends Workers Static Assets for new static sites, and the project is configured with `assets.directory = "./public"`.

## Cloudflare settings

Project name: `the-dirt-archive`

Build command: leave blank

Deploy command: `npx wrangler deploy`

Path: `/`

The GitHub repository's `main` branch should be the production branch.

## Why `/public`?

The website contains project documentation, SQL schema, research notes and other files that should not be exposed as web assets. Only the files under `/public` need to be served to visitors.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000 --directory public
```

Then open `http://localhost:8000/`.
