## Why

Znake has deterministic run seeds and mutator systems, but no recurring challenge presets that create shared cadence and replay goals. Adding bounded daily/weekly challenge presets now gives players clear short-cycle targets while staying data-driven and deterministic.

## Key Points (Codex-style)

- What is changing
  - Add deterministic daily/weekly challenge preset resolution for run seed + bounded mutator pack selection.
  - Allow starting preset runs from menu shortcuts without changing existing standard run flow.
  - Extend run-start and run-end telemetry context with preset identifiers.
- Why we are doing it
  - Improve replayability and mastery loops with low implementation risk.
  - Create recurring challenge hooks without introducing backend coupling.
- Impacted areas
  - Menu/Death run-start flow, gameplay mutator bootstrap, observability payload context.
- Risks / unknowns
  - Preset tuning may feel too mild or too punishing; first pass should prioritize fairness and readability over intensity.

## What Changes

- Add a challenge preset resolver for `standard`, `daily`, and `weekly` run starts.
- Add deterministic preset mutator-pack selection (first pass: one forced mutator id when floor requirements allow).
- Add menu keyboard shortcuts for daily (`D`) and weekly (`W`) starts while keeping Enter/Space standard.
- Keep death-restart aligned to the active challenge preset so retries stay comparable.
- Extend telemetry with challenge preset context at run start and run end.

## Capabilities

### New Capabilities

- `challenge-presets`: Deterministic recurring challenge preset contracts for run bootstrap and retry continuity.

### Modified Capabilities

- `gameplay`: Add preset bootstrap and forced mutator composition constraints.
- `scenes`: Add menu/death scene preset start orchestration and readable input entry points.
- `observability`: Add preset context fields to run lifecycle telemetry.

## Impact

- Affected code:
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/core/state.ts`, `src/game/core/types.ts`
  - new `src/game/core/challengePresets.ts`
  - tests for deterministic preset resolution and runtime composition behavior
- No new dependencies.
- No external API breaking changes.
