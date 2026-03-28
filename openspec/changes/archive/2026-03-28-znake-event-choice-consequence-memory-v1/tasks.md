## 1. Spec and design contracts

- [x] 1.1 Add OpenSpec deltas for delayed event-choice consequence memory.
- [x] 1.2 Add proposal/design with Key Points and bounded first-pass scope.

## 2. Implementation

- [x] 2.1 Add bounded consequence-memory configuration in central balance config.
- [x] 2.2 Add simulation helpers to draft/partition/resolve delayed consequences.
- [x] 2.3 Persist pending consequence queue in `GameState` and clear on run reset.
- [x] 2.4 Schedule consequences on qualifying event-choice picks.
- [x] 2.5 Apply due consequences deterministically on floor start.
- [x] 2.6 Emit schedule/apply telemetry for delayed consequences.
- [x] 2.7 Add deterministic simulation tests.

## 3. Validation and closeout

- [x] 3.1 Run `pnpm check`.
- [x] 3.2 Run `pnpm smoke`.
- [x] 3.3 Run `openspec validate znake-event-choice-consequence-memory-v1 --type change --strict`.
- [x] 3.4 Run `pnpm build`.
- [x] 3.5 Summarize implementation and focused playtest guidance.
