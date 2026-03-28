## 1. Spec and design contracts

- [x] 1.1 Add OpenSpec deltas for composition director behavior.
- [x] 1.2 Add proposal/design with Key Points and bounded first-pass scope.

## 2. Director implementation

- [x] 2.1 Add depth-band role composition window config and resolver helper in `balance`.
- [x] 2.2 Integrate window-aware role policy usage in `GameScene` normal enemy spawning.
- [x] 2.3 Extend encounter role-composition telemetry with `roleWindowId`.
- [x] 2.4 Add deterministic tests for window rotation and cap override behavior.

## 3. Validation and closeout

- [x] 3.1 Run `pnpm check`.
- [x] 3.2 Run `pnpm smoke`.
- [x] 3.3 Run `openspec validate znake-enemy-composition-director-v1 --type change --strict`.
- [x] 3.4 Run `pnpm build`.
- [x] 3.5 Summarize implementation and focused playtest guidance.
