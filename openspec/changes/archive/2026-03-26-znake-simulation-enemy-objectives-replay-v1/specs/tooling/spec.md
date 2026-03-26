## ADDED Requirements

### Requirement: Enemy/objective simulation deterministic tests

The project SHALL provide deterministic tests for pure enemy and objective simulation modules.

#### Scenario: Enemy movement tests are deterministic

- **WHEN** enemy simulation tests run with fixed seeds/inputs
- **THEN** resulting movement/collision decisions are reproducible across runs

#### Scenario: Objective timers tests are deterministic

- **WHEN** objective simulation tests run with fixed timer progressions
- **THEN** portal/core-pressure state transitions match expected event outputs

### Requirement: Replay capture model tests

The project SHALL validate replay capture ordering and seed linkage.

#### Scenario: Replay capture preserves intent order

- **WHEN** inputs are appended to capture
- **THEN** events remain ordered by append sequence and relative time
- **AND** capture seed remains attached to run metadata
