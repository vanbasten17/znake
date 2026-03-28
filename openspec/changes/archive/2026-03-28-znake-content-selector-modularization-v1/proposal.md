## Why

Content-selection logic in one file mixes public API and internal helper logic. Extracting helpers improves modularity and testability.

## Key Points (Codex-style)

- What is changing
  - Move selector internals into a dedicated module and add direct tests.
- Why we are doing it
  - Easier to add/remove selector rules without touching broader config surfaces.
- Impacted areas
  - `content.ts`, new selector module, tests.
- Risks / unknowns
  - Must keep deterministic behavior identical.
