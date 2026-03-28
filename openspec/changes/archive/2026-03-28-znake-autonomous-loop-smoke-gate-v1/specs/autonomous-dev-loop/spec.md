## ADDED Requirements

### Requirement: Resumable autonomous loop orchestration

The system SHALL provide a command-driven loop that can resume from saved state and execute quality gates in deterministic order.

#### Scenario: Loop persists state between executions

- **WHEN** the loop starts or completes a stage
- **THEN** it writes state and stage results to `.autoloop/state.json`
- **AND** a subsequent run can continue without recomputing previous successful stages

#### Scenario: Loop fails fast on gate failure

- **WHEN** `pnpm check` or `pnpm smoke` returns a failing status
- **THEN** the loop exits non-zero
- **AND** emits a summary artifact with failed stage and suggested next action

### Requirement: Deterministic smoke playtest metrics

The system SHALL execute deterministic bot-driven smoke simulations and evaluate heuristic thresholds.

#### Scenario: Smoke run uses fixed seed set

- **WHEN** `pnpm smoke` is executed with default settings
- **THEN** it runs a predefined fixed seed set
- **AND** records per-seed metrics and aggregate results

#### Scenario: Threshold policy blocks regressions

- **WHEN** aggregate metrics violate configured minimum/maximum thresholds
- **THEN** smoke command exits non-zero
- **AND** reports threshold deltas in a machine-readable artifact

### Requirement: Low-AI prompt and action preparation

The system SHALL minimize repeated AI usage by storing deterministic prompt/action artifacts for each loop cycle.

#### Scenario: Loop generates reusable prompt pack

- **WHEN** next work item context is prepared
- **THEN** loop writes a prompt pack artifact under `.autoloop/`
- **AND** prompt pack includes concise propose/apply/archive intent text without requiring new free-form prompt drafting

#### Scenario: Loop emits commit message suggestion

- **WHEN** loop reaches post-verify or post-archive stage
- **THEN** it writes a single-line conventional commit suggestion artifact
- **AND** suggested message reflects completed change scope
