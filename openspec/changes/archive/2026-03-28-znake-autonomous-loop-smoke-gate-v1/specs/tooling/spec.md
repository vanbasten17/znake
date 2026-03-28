## MODIFIED Requirements

### Requirement: Simulation invariants test coverage

The system SHALL provide automated tests for extracted pure simulation logic and persistence migrations.

#### Scenario: Deterministic simulation tests run without Phaser

- **WHEN** automated tests execute for simulation modules
- **THEN** tests import pure TypeScript logic only
- **AND** verify invariants such as connectivity, spawn safety, and RNG repeatability

#### Scenario: Smoke playtest gate runs before verification/archive

- **WHEN** an autonomous release/apply loop runs quality gates
- **THEN** `pnpm smoke` is executed after `pnpm check` and before OpenSpec verify/archive actions
- **AND** loop progression is blocked when smoke thresholds fail

### Requirement: Release candidate gate contract
The system SHALL define a release candidate gate contract that requires engineering, visual, and asset-quality checks before candidate approval.

#### Scenario: Engineering gate enforces baseline checks
- **WHEN** a release candidate is evaluated
- **THEN** gate evaluation requires successful `pnpm check` execution
- **AND** requires successful production build validation for release-targeted candidates
- **AND** candidate approval is blocked when any required engineering check fails

#### Scenario: Autonomous loop includes deterministic smoke evidence

- **WHEN** autonomous loop mode is used for implementation quality checks
- **THEN** gate output includes deterministic smoke playtest metrics artifact
- **AND** artifacts include pass/fail status and threshold comparisons for reproducible auditing
