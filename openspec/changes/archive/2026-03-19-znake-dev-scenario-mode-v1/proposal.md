## Why

Smoke-testing gameplay changes currently requires replaying multiple floors, which slows feedback loops and makes regression checks harder.

A lightweight dev scenario mode lets us jump directly into specific states (boss collision, portal countdown, darkness, magnet edge cases) and validate fixes quickly on both desktop and mobile.

## What Changes

- Add a developer-only scenario launcher in the main menu when URL query `?dev=1` is present.
- Add predefined scenario presets that can start a run directly in `GameScene` with deterministic floor/setup overrides.
- Keep normal production flow unchanged when `?dev=1` is absent.
- Keep keyboard/mobile controls and scene transitions behaviorally equivalent outside dev mode.

## Capabilities

### Modified Capabilities

- `scenes`: Menu scene optionally exposes a developer scenario launcher panel in dev mode.
- `gameplay`: Game scene accepts scenario bootstrap data to reproduce targeted gameplay situations.

## Impact

- Affected code:
  - `src/game/core/devScenarios.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/styles/menuOverlay.module.css`
- No new dependencies.
