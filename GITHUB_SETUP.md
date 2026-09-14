# The Dirt Archive: GitHub setup

1. Create a new GitHub repository named `the-dirt-archive`.
2. Keep it public for the first prototype unless you have a reason to keep it private.
3. Upload the contents of this folder to the repository root.
4. Do not commit secrets, Supabase service-role keys, passwords, or private contributor information.
5. For the first public deployment, use Cloudflare Pages with the repository as the source.
6. Build command: leave blank for this static prototype.
7. Output directory: `/` (the repository root).
8. After deployment, Cloudflare will provide a free `*.pages.dev` address.
9. Later, connect Supabase and move structured records out of `data.json`.

## Current architecture

The prototype is intentionally static:
- HTML/CSS/JavaScript frontend
- local `data.json` archive seed
- no login
- no public editing
- no private secrets
- no schematics, gutshots, PCB diagrams, or complete component recipes

The next production step is to connect the existing Supabase schema, then add moderated contributor submissions.