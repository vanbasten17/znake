## Why

On large desktop screens, the game shell can feel visually anchored instead of intentionally centered.
This hurts presentation quality during desktop testing/recording.

## What Changes

- Adjust desktop shell layout so the game stack (`hud` + playable area) is centered on screen.
- Keep mobile-first behavior unchanged.
- Keep gameplay/render logic untouched (CSS-only layout adjustment).

## Out of Scope

- No gameplay/input/system changes.
- No visual redesign of HUD/cards/controls.
- No mobile spacing changes.

## Key Points (Codex-style)

- What is changing: Desktop-only shell centering via CSS in shell layout rules.
- Why it matters: Better presentation/readability for widescreen desktop sessions.
- Impacted areas: `src/styles/shell.css` only.
- Risks / unknowns: Potential minor spacing shifts between menu/run; mitigated by desktop media query scoping.
