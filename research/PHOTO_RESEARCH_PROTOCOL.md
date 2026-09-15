# Dirt Archive Photo Research Protocol

## Purpose

Build a complete visual reference layer for every public dirt record without confusing a discoverable image with an image the archive is licensed to republish.

## Coverage rule

Every pedal in `DATA.pedals` whose `primary_category` is `Fuzz`, `Overdrive`, or `Distortion` gets a photo-research slot. Every researched production generation gets its own visual research slot when a generation identifier is available.

No record is considered complete merely because a search result exists.

## Evidence states

- `queued`: no source lead has been reviewed yet.
- `reference-lead`: a likely visual source has been found, but publication rights have not been established.
- `rights-review`: provenance and license/permission are being checked.
- `archive-ready`: provenance and an allowed public-use status are documented.
- `owner-supplied`: photograph supplied by the builder, collector, archive, or project owner with permission recorded.
- `contested`: identity, generation assignment, provenance, or rights information needs human review.

## Required media fields

Each durable media record should carry, where known:

`pedal_id`
`generation_id`
`src`
`page`
`title`
`credit`
`author`
`source_site`
`source_url`
`rights_status`
`license`
`permission_evidence`
`public_use_decision`
`provenance_notes`
`visual_match_notes`
`reviewed_at`

## Search order

1. Archive-owned or project-owned photography.
2. Builder/manufacturer-provided photography when permission permits archival display.
3. Wikimedia Commons or another source with an explicit reusable license, verified on the file page.
4. Public-domain collections and institutional archives with clear reuse terms.
5. Other web images only as external reference leads unless permission is documented.

## Generation matching rule

A photograph is not attached to a generation solely because its filename or search-result title contains the generation name. The visual assignment should be backed by visible exterior characteristics, dated documentation, catalog material, serial/date evidence, or another explicit source. When the generation assignment remains uncertain, keep the image as a reference lead and record the uncertainty rather than promoting it.

## Public display rule

The site may display an image only when the media record carries an allowed rights status and an explicit `public_use_decision` of `approved`, or when the project has documented ownership/permission.

Search links are always acceptable as research tools. They are not evidence of permission.

## What the archive should collect visually

For each important model/generation, prioritize a clean exterior view that shows:

- overall enclosure and proportions
- artwork and typography
- control layout
- footswitch and indicator placement
- jacks and enclosure hardware when visible without opening the unit
- branding, logos, labels, and model markings
- generation-specific exterior details

The archive does not need internal photographs for public identification, and the public site should not become a gutshot collection.

## Review checklist

Before a photo moves to `archive-ready`:

1. The depicted pedal is identified with enough confidence for the intended record.
2. The generation assignment is supported when a generation label is used.
3. The source page is retained.
4. The photographer/creator is credited.
5. The license or permission basis is explicitly recorded.
6. The public-use decision is explicit.
7. The image does not expose material the archive has intentionally excluded from publication.

## Research output

The Photo Desk should always be able to answer four separate questions:

- Which dirt records need a photo?
- Which records have a source lead?
- Which records have a publishable image?
- Which generations still need visual evidence?

Those counts should never be collapsed into a single "has photo" flag.
