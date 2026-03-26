## 1. OpenSpec definition

- [x] 1.1 Create proposal, design, tasks, and spec deltas for combat readability and fairness.

## 2. Core implementation

- [x] 2.1 Add centralized combat fairness balance knobs and supporting type fields for telegraphs and grace windows.
- [x] 2.2 Implement deterministic enemy telegraph behavior for current high-risk enemy actions and expose it to rendering.
- [x] 2.3 Implement spawn fairness validation helpers and route enemy spawns through them.
- [x] 2.4 Add room-entry and post-hit grace-window handling in `GameScene` without freezing the board.
- [x] 2.5 Add lightweight presentation cues for active telegraphs and grace state.

## 3. Validation

- [x] 3.1 Add or update deterministic tests for telegraph and spawn fairness helpers.
- [x] 3.2 Run `openspec validate znake-combat-readability-fairness-v1`.
- [x] 3.3 Run `pnpm check`.
- [x] 3.4 Run `pnpm build`.
- [ ] 3.5 Manual smoke:
- [ ] ambusher dash gives readable warning before impact
- [ ] new enemy spawns avoid obvious near-hit and low-agency cells when alternatives exist
- [ ] room entry and post-hit grace windows feel protective but not abusable
