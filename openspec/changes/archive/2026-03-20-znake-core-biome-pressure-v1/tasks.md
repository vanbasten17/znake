## 1. Spec

- [x] 1.1 Add gameplay delta for core pressure countdown and timeout behavior.
- [x] 1.2 Add balance-config delta for centralized pressure knobs.

## 2. Implementation

- [x] 2.1 Add pressure configuration knobs under biome balance.
- [x] 2.2 Implement pressure timer loop in `GameScene` with cooldown reset on food.
- [x] 2.3 Implement coolant-charge absorption from biome core item collection.
- [x] 2.4 Add localized run-status copy for pressure and coolant state.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-core-biome-pressure-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
