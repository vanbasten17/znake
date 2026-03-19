## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks and relevant spec deltas.

## 2. Timed portal + squeeze implementation

- [x] 2.1 Add portal/squeeze balance configuration.
- [x] 2.2 Implement non-boss countdown -> portal open -> squeeze state machine in GameScene.
- [x] 2.3 Render portal and squeeze feedback in gameplay frame.
- [x] 2.4 Advance floor on portal entry and keep boss flow unchanged.
- [x] 2.5 Localize run-status copy for portal states.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-timed-portal-squeeze-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.

## 4. Objective rotation extension (same change)

- [x] 4.1 Add data-driven non-boss objective rotation config (`portal`, `score`, `kills`) in balance.
- [x] 4.2 Implement deterministic non-boss objective selection in GameScene, excluding boss floors from rotation index.
- [x] 4.3 Implement completion logic for `score` and `kills` objectives with live progress counters.
- [x] 4.4 Keep countdown + squeeze pressure active for all rotated objective types.
- [x] 4.5 Add/adjust localized run-status copy for each objective type and progress format.
- [x] 4.6 Validate with `openspec validate znake-timed-portal-squeeze-v1`, `pnpm check`, and `pnpm build`.
- [x] 4.7 Add run-level randomized objective rotation offset while keeping per-run order stable.
- [x] 4.8 Surface randomized objective previews consistently in menu/relic/upgrade overlays.
