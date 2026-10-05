# Deployment Architecture

## Production topology

The intended production path is:

```
GitHub repository (main)
        |
        v
GitHub Actions
  +-- Validate
  +-- Deploy The Dirt Archive
        |
        v
GitHub Pages origin
        |
        v
Cloudflare DNS / edge proxy
        |
        v
Visitor custom domain
```

GitHub Pages remains the deployment origin. Cloudflare is the edge/DNS layer, not a second application build system.

The repository currently publishes at:

`https://noizeniche.github.io/the-dirt-archive/`

## Why this is intentionally split

GitHub Actions already owns static publication through `.github/workflows/deploy-pages.yml`. Adding Cloudflare Pages as a second build/deploy pipeline would create two competing deployment systems for the same site.

The clean architecture is:

- **GitHub Actions** validates and publishes.
- **Publishing workflows** make one explicit Pages handoff when their `GITHUB_TOKEN` push would otherwise suppress a follow-on workflow.
- **GitHub Pages** serves the canonical build.
- **Cloudflare** handles custom-domain DNS and, when enabled, edge proxy/cache/security.

## Cloudflare activation state

The repository intentionally does not contain a fake CNAME or pretend that Cloudflare is already active.

A real Cloudflare edge setup requires a custom domain and DNS/account configuration outside the repository. Once the domain is chosen, configure the same domain on the GitHub Pages site first, then point the domain's DNS record at the GitHub Pages hostname and enable Cloudflare proxying for web traffic.

For a GitHub Actions publishing workflow, GitHub's current Pages documentation says the custom domain is configured in repository Pages settings and a CNAME file is not required. Cloudflare's current DNS documentation describes proxied CNAME records as the way HTTP/HTTPS traffic is routed through its network.

## Activation checklist

When the production domain is available:

1. Verify the domain for GitHub Pages.
2. In **Repository → Settings → Pages**, set the production custom domain.
3. In Cloudflare, add/onboard the domain as a zone and confirm DNS.
4. Create the appropriate DNS record for the chosen apex or subdomain, targeting the GitHub Pages hostname.
5. Enable Cloudflare proxying for the web record.
6. Confirm GitHub Pages HTTPS is available and enforce HTTPS.
7. Test the custom domain, GitHub Pages origin, redirects, sitemap and robots file.
8. Only then replace the current project URL in generated metadata such as `og:url`, canonical URLs and sitemap output.

Do not commit a `CNAME` file with a placeholder hostname.

## Operational rule

There must be one production publish path.

Do not introduce Cloudflare Pages builds, Workers builds, alternate artifact stores or duplicate deployment workflows unless the architecture is explicitly changed and documented as a replacement.

## References

GitHub custom-domain documentation:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Cloudflare DNS proxy-status documentation:
https://developers.cloudflare.com/dns/proxy-status/
