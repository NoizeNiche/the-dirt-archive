# Publish The Dirt Archive for $0

## Recommended first hosting setup

Use GitHub for the repository and Cloudflare Pages for the public static site. Keep Supabase as the future structured-data layer. You do not need a custom domain for the first public test.

## 1. Create a GitHub repository

Create an empty repository named something like `the-dirt-archive`. Upload the contents of this folder so `index.html` sits at the repository root.

## 2. Connect the repository to Cloudflare Pages

In Cloudflare: Workers & Pages → Create application → Pages → Import an existing Git repository. Choose the GitHub repository.

For this static prototype, the build command can be left blank and the output directory can be the repository root.

Cloudflare Pages Free currently permits 500 builds per month, 20,000 files per site, and a 25 MiB maximum single asset. Static asset requests are free and unlimited.

## 3. Deploy

Cloudflare will assign a free `*.pages.dev` address. That is enough to send people a link and start testing the archive.

## 4. Add a custom domain later

When the name is settled, buy the domain and attach it to the Pages project. Do this only after the prototype feels right.

## 5. Add Supabase only when the static site is stable

Create a Supabase project and run `supabase_schema.sql` in the SQL editor. The current Free plan allows two free projects, 500 MB database size per project and 1 GB storage. It is sufficient for the archive prototype, although free projects can be paused under inactivity rules.

## 6. Keep secrets out of Git

Never commit Supabase service-role keys, database passwords, or other secrets. The public browser should only receive keys intended for public client use, with database Row Level Security configured before opening write access.

## Suggested production sequence

1. Static prototype on Cloudflare Pages.
2. Refine the design and information architecture.
3. Create the Supabase schema.
4. Import the research workbook into Supabase.
5. Replace the local JSON data source with read-only database queries.
6. Add moderated contributor submissions.
7. Add image storage and rights metadata.
8. Add the identification workflow.
