## Why

Znake exposes long-term goals, but players lack a concise rotating focus that highlights what to chase right now. Adding a lightweight mastery-focus track in menu improves progression clarity and supports short-session decision making.

## Key Points (Codex-style)

- What is changing
  - Add a rotating mastery focus line in menu derived from existing progression goals.
- Why we are doing it
  - Improve progression readability and actionability between runs.
- Impacted areas
  - Menu scene goal presentation and minor menu styling.
- Risks / unknowns
  - If rotation cadence is unclear, players may miss why focus changed.

## What Changes

- Add deterministic daily rotating focus selection over current progression goals.
- Show one compact mastery focus line with live progress/claim-ready state.
- Reuse existing goal labels/status strings to avoid duplicate progression logic.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scenes`: Menu scene includes rotating mastery-focus presentation.
- `meta-progression`: Existing goal progress signals gain a bounded rotating surface.

## Impact

- Affected code:
  - `src/game/scenes/MenuScene.ts`
  - `src/styles/menuOverlay.module.css`
- No dependency changes.
