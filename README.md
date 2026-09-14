# The Dirt Archive · Site Prototype v0.2

Working title: The Dirt Archive
Scope: Overdrive · Distortion · Fuzz
Positioning: Independent reference project
Visual direction: Vintage catalog

## What is included

- Static public-site prototype
- Builder-first browsing
- Dirt category browsing
- Pedal pages with generations, production periods, distinguishers, evidence/claims and sources
- Search overlay
- Rights-conscious image references using Wikimedia Commons material where available
- `supabase_schema.sql` for the future production database

## Photography in this prototype

The five founding records use Wikimedia Commons reference photographs where the file pages indicate reuse licensing. Credits and license notes are displayed on the pedal pages. Production use should still preserve the exact license/credit metadata and should add owned or builder/contributor-permissioned images as they become available.

## Local preview

Run from this folder:

`python3 -m http.server 8000`

Then open `http://localhost:8000/`.

Opening `index.html` directly may block `fetch('data.json')` in some browsers, so use the local server.

## Hosting plan

The intended low-cost architecture is GitHub + Cloudflare Pages for the static frontend and Supabase for structured data/storage. Cloudflare's current Pages Free limits include 500 builds/month, 20,000 files/site and a 25 MiB maximum asset size; static asset requests are free/unlimited. Supabase's current Free plan includes two free projects, 500 MB database size per project and 1 GB storage; free projects can be paused under inactivity rules.

No secrets are included in this prototype.

## Photography policy

Use owned, builder-provided, contributor-permissioned or appropriately licensed images. Store the source URL, rights status and credit line with each image. Do not assume commercial listing images are reusable.
