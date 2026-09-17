# The Dirt Archive — Governance

## Mission
The Dirt Archive is a practical visual reference for guitar dirt pedals spanning the 1960s through the current day. The long-term sequence is:

**Builder → Pedals → Photos → Information on the pedal**

The current active phase is deliberately narrower:

**Builder → Pedals. THAT’S IT.**

## Current-phase scope
Research and record:
- builder names
- overdrive pedals
- distortion pedals
- fuzz pedals
- the builder-to-pedal relationship

Prioritize builders with multiple relevant dirt pedals so the census grows efficiently.

## Do not expand scope during this phase
Do not spend time on photos, pedal biographies, deep history, components, schematics, PCB work, BOMs, gutshots/internal imagery, cloning information, variant rabbit holes, or unrelated website/UI architecture unless the repository state explicitly changes the mission.

## Data principles
The builder/product pairing is the primary research relationship. Keep research material separate from published presentation data. Avoid inventing certainty where builder/product attribution is unclear. A same-name product from a different recognized builder is a separate identity; cosmetic or technical variations of the same underlying product should not create unnecessary duplicate identities during the initial catalog pass.

## Workflow discipline
Before an operation:
1. Read the governing files and current state.
2. Inspect the actual repository.
3. Identify the source of truth and dependencies.
4. Make the smallest coherent change.

After every operation:
1. Validate the changed files.
2. Re-read the resulting repository state.
3. Verify the live/rendered result where tooling permits.
4. Confirm the result matches the request.
5. Update `CURRENT_STATE.md` and `research/BREADCRUMB.md`.
6. Commit a recoverable state.

A successful file write or GitHub commit is not proof that a live website is correct.

## Durable checkpoints
The repository is the durable project memory. Every meaningful stopping point must leave enough state for a new ChatGPT/Codex session to resume without relying on conversation history.
