## Why

The current gameplay shell still feels constrained on mobile devices because the canvas and controls do not follow a clear portrait-first vertical split.

To improve readability, touch ergonomics, and consistency with the Stitch references, we need a dedicated mobile-first vertical layout rule for run-time scenes.

## What Changes

- Enforce a portrait-first game canvas ratio aligned to the existing Stitch direction (roughly 768x1376 proportion).
- Define a run-scene DOM shell where gameplay area uses ~2/3 of vertical space and controls use ~1/3 on touch/no-keyboard devices.
- Keep keyboard/large-screen behavior intact (arrow-key driven play and hidden touch controls).
- Re-space polished menu/relic/upgrade compositions to avoid overlap on portrait-first dimensions.

## Scope

- In scope: layout and scene composition changes (no new game mechanics).
- Out of scope: progression balance redesign, new monetization systems, or control remapping behavior changes.

## Impacted Specs

- `mobile-readiness`
- `input-hud`
- `scenes`
