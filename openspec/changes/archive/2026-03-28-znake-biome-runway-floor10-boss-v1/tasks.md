## 1. Cadence Config Update

- [x] 1.1 Update centralized boss cadence interval to `10` so floors `1-9` are regular and floor `10` is boss cadence.
- [x] 1.2 Verify floor setup cadence paths still consume centralized cadence policy without scene-local overrides.

## 2. Deterministic Regression Coverage

- [x] 2.1 Update/add deterministic tests for boss phase remix and cadence milestones aligned to floor-10 runway policy.

## 3. Validation

- [x] 3.1 Run `pnpm check` and fix regressions.
- [x] 3.2 Run `pnpm build` due gameplay behavior cadence change.
