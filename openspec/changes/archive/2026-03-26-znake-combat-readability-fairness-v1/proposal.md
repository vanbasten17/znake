## Why

Combat currently resolves correctly, but key danger moments can feel too abrupt: some enemy threats land without enough anticipation, enemy spawns can begin too close to the player lane, and recovery moments after room entry or damage are too thin to reliably read the board.

This change improves fairness by making danger communication, spawn validation, and short recovery windows explicit and tunable instead of emergent from scattered scene logic.

## Key Points (Codex-style)

- **What is changing**
  - Add telegraph timing for existing enemy threat moments.
  - Add spawn safety validation so new enemies avoid unfair proximity and no-escape pressure.
  - Add short grace windows on room start and after taking damage.
- **Why we are doing it**
  - Combat readability is a fairness feature; players should understand incoming danger before impact and have a small but real chance to react.
- **Impacted areas**
  - Enemy simulation timing, spawn candidate selection, `GameScene` damage/recovery flow, centralized balance config, and deterministic tests.
- **Risks / unknowns**
  - Too much grace could trivialize pressure.
  - Over-strict spawn rules could reduce valid candidate space on dense floors.
  - Telegraphs must stay readable without introducing heavy per-frame simulation work.

## What Changes

- Define tunable telegraph windows for existing enemy actions that can create burst danger, with a focus on ambusher dash threats and hatch timing readability.
- Introduce centralized spawn fairness rules for minimum distance, lane pressure, and local escape-space checks before enemies are seeded.
- Add short room-entry and post-hit grace windows that suppress enemy contact damage long enough to restore player agency without masking bad positioning.
- Keep all fairness timings and thresholds centralized under balance config and covered by pure-logic helpers where practical.

## Capabilities

### New Capabilities

- `combat-fairness`: Tunable fairness rules for telegraphs, spawn safety, and short combat recovery windows.

### Modified Capabilities

- `gameplay`: Combat interactions now include readable telegraphs, safer enemy spawn behavior, and short player recovery windows in targeted moments.
- `balance-config`: Centralized balance config now governs combat fairness timings and spawn safety thresholds.

## Impact

- Affected code (planned):
  - `src/game/core/balance.ts`
  - `src/game/core/types.ts`
  - `src/game/simulation/enemy.ts`
  - `src/game/simulation/spawn.ts`
  - `src/game/scenes/GameScene.ts`
  - `tests/enemy-simulation.test.ts`
  - `tests/spawn.test.ts`
- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/balance-config/spec.md`
