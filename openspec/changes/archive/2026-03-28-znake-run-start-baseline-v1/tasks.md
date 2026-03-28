## 1. Spec And Config Alignment

- [x] 1.1 Set run baseline start length to `3` in centralized balance config while preserving additive bonus fields.
- [x] 1.2 Confirm run-start composition path still resolves `baseSnakeLength + bonusStartLength` without scene-local overrides.

## 2. Deterministic Regression Coverage

- [x] 2.1 Add deterministic checks that default run-start composition yields baseline length `3` with no bonuses.
- [x] 2.2 Add deterministic checks that representative progression bonuses stack additively on top of baseline.

## 3. Validation

- [x] 3.1 Run `pnpm check` and resolve any regressions introduced by this change.
