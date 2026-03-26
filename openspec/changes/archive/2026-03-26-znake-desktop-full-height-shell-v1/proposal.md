## Why

Desktop shell centering improved the framing on wide monitors, but the current desktop row sizing now clamps the playable shell to `78dvh`.
Tall overlays like the upgrade draft no longer fit in full on desktop, which hurts readability and makes selection screens feel cropped.

## What Changes

- Restore full available desktop height for the run/menu shell while keeping the shell horizontally centered.
- Preserve mobile-first behavior and touch-screen sizing rules.
- Keep the fix CSS-only so gameplay, simulation, and rendering logic stay untouched.

## Out of Scope

- No gameplay balance or upgrade-content changes.
- No redesign of overlay cards, HUD styling, or mobile layout rules.
- No Phaser camera or canvas-resolution changes.

## Key Points (Codex-style)

- What is changing: Desktop shell layout stops capping the main shell track to `78dvh` and instead lets the shell use the available viewport height.
- Why we are doing it: Desktop upgrade/reward screens must remain fully visible and readable, with no cropped choices or reduced reaction clarity.
- Impacted areas: `src/styles/shell.css`, `openspec/specs/ui-foundation/spec.md`.
- Risks / unknowns: Desktop framing may feel slightly less “boxed” on very tall monitors; mitigated by keeping centering behavior and existing max widths.
