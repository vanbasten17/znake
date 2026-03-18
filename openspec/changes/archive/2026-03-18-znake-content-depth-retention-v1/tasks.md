## 1. Elite pattern

- [x] 1.1 Add `ambusher` enemy kind with floor-gated spawn rule.
- [x] 1.2 Implement ambusher movement pattern (burst/dash intent with safeguards).
- [x] 1.3 Add ambusher reward tuning and defeat handling.

## 2. Item interaction

- [x] 2.1 Add `rift_battery` spawn rules and pickup entity state.
- [x] 2.2 Implement rift-suppression effect window on pickup.
- [x] 2.3 Ensure interaction feedback is visible in run HUD.

## 3. Data-driven tables

- [x] 3.1 Add centralized elite spawn/weight tuning tables in balance config.
- [x] 3.2 Add centralized item spawn/effect tuning tables in balance config.
- [x] 3.3 Remove scene-local literals for new content tuning.

## 4. Observability

- [x] 4.1 Emit telemetry for elite spawn/defeat by kind.
- [x] 4.2 Emit telemetry for item collection and rift suppression windows.

## 5. Validation

- [x] 5.1 Validate OpenSpec change.
- [x] 5.2 Run `biome`, `tsc --noEmit`, and `build`.
