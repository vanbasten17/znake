## 1. Unlock policy alignment

- [x] 1.1 Replace hardcoded mutator unlock gating with centralized unlock policy map + deterministic breadth evaluation in meta helpers.
- [x] 1.2 Keep challenge mutator availability wiring unchanged except consuming the updated unlock helper output.

## 2. Progression surface consistency

- [x] 2.1 Surface mutator unlock readiness in menu progression UI using concise localized copy and existing layout.

## 3. Deterministic verification

- [x] 3.1 Add or update deterministic tests for unlock breadth policy behavior and safe-locked defaults.
- [x] 3.2 Run `pnpm check` and `pnpm build` to validate behavior-impact changes.
