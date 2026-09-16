# The Dirt Archive Runtime Inventory

This is a working map of the current public-site runtime on `foundation-audit`. It is an audit document, not a claim that the current architecture is the desired long-term architecture.

## Current boot order

`public/index.html` loads the runtime as a long sequence of classic browser scripts. The current production baseline contains bootstrap layers, dirt qualification layers, numbered catalog extensions, research layers, thumbnail layers, the core app, then a second group of runtime/decorator layers and specimen UI.

The order matters because several scripts extend or replace functions created by earlier scripts.

## Core application

### `public/app.js`

Responsibilities:
- owns the main `DATA` object
- owns the main `#app` route renderer
- defines the public routes: home, builders, builder detail, dirt category, pedal detail and about
- renders builder cards and pedal cards
- renders the primary pedal-page history, identification, production-history, claims and source sections
- owns the initial `data.json` fetch
- owns the base search behavior attached to the search dialog

Long-term direction: this should become the single predictable application/rendering layer.

## Data/bootstrap mutation

### `catalog-bootstrap.js`
### `catalog-bootstrap-10.js`
### `catalog-bootstrap-11.js`

Responsibilities:
- intercept `fetch('data.json')`
- merge discovery TSV batches into the returned in-memory catalog
- inject provisional builder records
- deduplicate discovery pedal records during the merge

Architectural risk:
- `window.fetch` is replaced globally
- multiple bootstrap files participate in the same interception pattern
- data assembly therefore depends on script order and interception state

Long-term direction: build one explicit archive-data loader instead of globally replacing `fetch`.

## Dirt qualification

### `catalog-dirt-qualification-*.js`

Responsibilities vary by file, but the family acts as an additional qualification/enrichment layer for the catalog, generally by intercepting or modifying data before the main application uses it.

Long-term direction: move qualification into an explicit data-normalization stage rather than another global runtime layer.

## Numbered catalog extensions

### `catalog-extensions-12.js` through later numbered extensions

Responsibilities vary by batch. These files represent incremental catalog additions and historical corrections accumulated during research runs.

Architectural risk:
- file count is high
- responsibilities are distributed across many small patches
- some are likely data additions while others also modify runtime behavior
- the public page therefore carries the history of the research implementation itself

Long-term direction: preserve the research records, but compile their public catalog contributions into stable data assets rather than loading every historical patch as executable JavaScript.

## Research layers

### `catalog-research-*.js`
### `catalog-research-*-generations.js`

Responsibilities:
- attach historical research payloads to catalog records
- provide generation/version information
- expose research evidence and related metadata to later UI layers

Architectural risk:
- research payloads and presentation logic are partly separated, but the delivery mechanism still relies on many executable files

Long-term direction: research should become structured data consumed by the core application.

## Thumbnail/media layers

### `catalog-thumbnails-*.js`
### `catalog-cleared-images.js`
### `catalog-visual-references.js`

Responsibilities:
- register reference imagery and image metadata
- distinguish cleared imagery from external/reference-only imagery
- add visual-reference links to cards and detail pages
- supply additional image candidates to specimen presentation

Architectural risk:
- several independent layers can decorate the same card or detail page
- image rendering is partly owned by `app.js` and partly by post-render decorators

Long-term direction: make media a first-class data field and have the core renderer decide which asset is appropriate.

## Research runtime / UI decorators

### `catalog-research-runtime.js`
### `catalog-research-ui.js`
### `catalog-lineage-runtime.js`
### `catalog-specimen-ui.js`

Responsibilities:
- load additional research/lineage data after the core page has rendered
- locate elements by CSS selectors
- append additional sections or replace images
- use `MutationObserver` and timed retries to detect newly rendered pages

Architectural risk:
- multiple observers react to the same DOM changes
- timing becomes part of correctness
- a page can render successfully while a decorator silently fails
- adding a new renderer can accidentally conflict with an existing decorator

Long-term direction: fold these responsibilities into explicit page render functions and remove the observers one at a time.

## Current target architecture

The desired shape is:

`raw archive data`
→ `normalization / relationship resolution`
→ `single application state`
→ `route`
→ `page renderer`
→ `stable DOM`

Optional media, lineage and research information should be values consumed by the renderer, not separate scripts that have to rediscover the page after rendering.

## Safe refactor order

1. Keep the current application behavior unchanged.
2. Add and maintain browser smoke tests.
3. Create one explicit data-loader boundary.
4. Move one research decorator's useful data behind that boundary.
5. Render the same information directly from the core application.
6. Remove the old decorator only after the smoke suite passes.
7. Repeat for the next decorator.
8. Only after the decorator stack is reduced should new identification UI be introduced.

## Non-negotiable regression checks

Every architectural or visual change must continue to support:

- home route
- builders index
- builder detail
- fuzz category
- overdrive category
- distortion category
- pedal detail
- about
- search open
- search results
- search close
- valid `data.json`
- every script referenced by `index.html`
- zero browser page errors and console errors in the smoke-test run

`main` remains production. This inventory belongs to the experimental foundation branch until the refactor is proven safe.
