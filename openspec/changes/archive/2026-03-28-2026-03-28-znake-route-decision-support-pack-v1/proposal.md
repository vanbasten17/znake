## Why

Recent roguelite design references emphasize clear pre-commit decision readability (telegraphed intent, visible risk framing, and route-node clarity) to reduce unfair-feeling losses. Znake route cards already expose room/biome/future room, but they still under-communicate tactical pressure at commit time.

## Key Points (Codex-style)

- What is changing
  - Add a compact route decision support pack with 10 readability upgrades on route cards and overlay framing.
- Why we are doing it
  - Improve player confidence, fairness perception, and faster decision quality without changing simulation outcomes.
- Impacted areas
  - Route overlay UI composition, route insight helper, route overlay styling, and deterministic tests.
- Risks / unknowns
  - Extra lines could become noisy on smaller displays if not kept compact.

## What Changes

- Add deterministic route insight helper for pressure/recovery/elite/depth/pivot metadata.
- Extend route cards with compact tactical lines and two-step future readout.
- Add risk-level card visual treatment and legend framing.
- Keep all additions presentation-only; no route generation or outcome changes.

## Capabilities

### Modified Capabilities

- `run-map`: Route-decision cards expose richer deterministic preview insight signals.
- `scenes`: Route overlay adds clearer commit support framing.
- `ui-foundation`: Route card visual hierarchy expands with bounded tactical lines.

## Impact

- Affected code:
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/gameScene/overlayController.ts`
  - `src/game/simulation/routeChoiceInsights.ts`
  - `src/styles/routeOverlay.module.css`
  - `src/game/systems/i18nResources.ts`
  - `tests/route-choice-insights.test.ts`
- No dependency changes.

## External Inspiration (researched)

- Into the Breach presskit: explicit telegraphed intent for decision fairness.
- Slay the Spire map generation references: node/path readability for route planning.
- Existing Znake route readability specs and mastery readout contracts.
