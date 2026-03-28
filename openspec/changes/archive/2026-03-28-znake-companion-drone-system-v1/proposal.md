## Why

Adds build diversity and tactical planning around cooldown timing.

## Key Points (Codex-style)

- What is changing
  - Introduce a deterministic companion-drone support trigger on enemy defeat with bounded cooldown.
- Why we are doing it
  - Adds a tactical cadence layer where players can plan around recurring support windows.
- Impacted areas
  - Combat scoring feedback, cooldown logic, scene hint messaging.
- Risks / unknowns
  - If bonus cadence is overtuned, score pacing may spike too quickly in dense combat rooms.

## What Changes

- Add a pure `companionDrone` system module for cooldown ticking and trigger resolution.
- Integrate drone trigger into enemy defeat flow in `GameScene`.
- Add deterministic tests for trigger/cooldown behavior.

## Capabilities

### Modified Capabilities

- affected spec: gameplay

## Impact

- Affected code:
  - src/game/systems/companionDrone.ts
  - src/game/scenes/GameScene.ts
  - src/game/systems/i18nResources.ts
  - tests/companion-drone-system.test.ts
