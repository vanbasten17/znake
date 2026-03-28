## 1. Spec and data contracts

- [x] 1.1 Add OpenSpec deltas for gameplay, scenes, and observability challenge-preset behavior.
- [x] 1.2 Add proposal/design with Key Points and bounded first-pass scope.

## 2. Deterministic preset resolution

- [x] 2.1 Implement challenge preset resolver for `standard`, `daily`, and `weekly` modes.
- [x] 2.2 Extend game state/types with active challenge preset context fields.
- [x] 2.3 Add deterministic tests for daily/weekly bucket stability.

## 3. Scene orchestration and gameplay merge

- [x] 3.1 Update MenuScene start flow to support daily/weekly keyboard presets.
- [x] 3.2 Update DeathScene restart flow to preserve current preset mode.
- [x] 3.3 Merge preset forced mutator into GameScene mutator orchestration using existing guardrails.
- [x] 3.4 Extend run lifecycle telemetry with challenge preset context.

## 4. Validation and closeout

- [x] 4.1 Run `pnpm check`.
- [x] 4.2 Run `pnpm smoke`.
- [x] 4.3 Run `openspec validate znake-daily-weekly-challenge-presets-v1 --type change --strict`.
- [x] 4.4 Summarize implementation and focused playtest guidance.
