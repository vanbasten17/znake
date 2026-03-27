## 1. Boss depth contracts and data

- [x] 1.1 Add centralized boss identity/readability + fairness tuning fields in balance config with deterministic defaults.
- [x] 1.2 Extend gameplay state/types to track bounded boss encounter summary context (identity/phase/reason counters).

## 2. Encounter implementation and presentation

- [x] 2.1 Wire boss encounter transitions to update boss summary/readability context from simulation-owned logic.
- [x] 2.2 Keep `GameScene` thin by consuming that payload for concise boss cue/summary text without adding gameplay ownership.

## 3. Observability and validation

- [x] 3.1 Extend boss-related telemetry payloads/run-end mapping with additive bounded fields aligned to existing reason taxonomy.
- [x] 3.2 Add or update deterministic tests for boss summary/readability updates and run `pnpm check` (plus `pnpm build` for behavior-impact validation).
