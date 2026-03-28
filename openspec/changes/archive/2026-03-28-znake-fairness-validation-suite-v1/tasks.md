## 1. Fairness Suite Contracts

- [x] 1.1 Add centralized fairness-suite seeds and per-depth-band thresholds in balance config.
- [x] 1.2 Add deterministic fairness validation evaluator contract in core/tooling paths.

## 2. Tooling Integration

- [x] 2.1 Add a fairness validation CLI that emits concise evidence artifacts and exits non-zero on threshold failures.
- [x] 2.2 Integrate fairness validation into existing workflow scripts without runtime gameplay behavior changes.

## 3. Deterministic Verification

- [x] 3.1 Add deterministic tests that assert stable fairness reports for equivalent inputs and schema fields.
- [x] 3.2 Add deterministic tests that assert threshold comparison behavior for pass/fail outcomes.

## 4. Validation

- [x] 4.1 Run `pnpm check` and resolve regressions.
- [x] 4.2 Run `pnpm build` if required by resulting scope.
