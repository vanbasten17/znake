## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks and spec deltas for scenes + gameplay.

## 2. Implementation

- [x] 2.1 Add typed dev scenario presets and `?dev=1` guard helper.
- [x] 2.2 Add menu dev panel with scenario buttons (visible only in dev mode).
- [x] 2.3 Wire menu scenario action to reset run state and start `GameScene` with scenario id.
- [x] 2.4 Finalize `GameScene` scenario bootstrap behavior for floor/score/flags.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-dev-scenario-mode-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
