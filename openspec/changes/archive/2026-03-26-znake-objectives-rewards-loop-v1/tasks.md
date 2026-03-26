## 1. Spec

- [x] 1.1 Add an `objective-reward-loop` spec for room objective lifecycle and reward draft behavior.
- [x] 1.2 Add `gameplay` delta requirements for room objective gating, completion, and reward-triggered progression.
- [x] 1.3 Add `input-hud` delta requirements for objective readability and reward-choice presentation.
- [x] 1.4 Add `balance-config` delta requirements for centralized objective and reward tuning.

## 2. Objective and reward data model

- [x] 2.1 Add objective/reward definitions and runtime state types under `src/game/core/types.ts`.
- [x] 2.2 Add centralized objective declarations, target values, and reward pool config under `src/game/core/balance.ts` or adjacent data modules.
- [x] 2.3 Extend `src/game/simulation/objectives.ts` with pure helpers for objective start, progress updates, completion detection, and reward draft generation.

## 3. Runtime orchestration

- [x] 3.1 Update `src/game/scenes/GameScene.ts` to initialize one active objective for each test room/run segment.
- [x] 3.2 Wire gameplay events into objective progress for survive, core, elite, and terminal objectives.
- [x] 3.3 Trigger and resolve reward choice before advancing to the next segment while keeping `GameScene` as orchestrator only.
- [x] 3.4 Add minimal runtime support for terminal objective props if required by the chosen objective declaration.

## 4. UI and reward application

- [x] 4.1 Add HUD hooks for current objective text and progress in `src/game/systems/domHud.ts` and supporting shell markup/copy.
- [x] 4.2 Add a lightweight reward-choice overlay that presents three tradeoff options and applies the selected reward.
- [x] 4.3 Add localized/player-facing copy for first-pass objectives and reward tradeoffs.

## 5. Validation

- [x] 5.1 Run `openspec validate znake-objectives-rewards-loop-v1`.
- [x] 5.2 Run `pnpm check`.
- [x] 5.3 Run `pnpm build`.
