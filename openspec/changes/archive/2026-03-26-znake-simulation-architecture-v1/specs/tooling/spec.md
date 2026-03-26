## ADDED Requirements

### Requirement: Simulation invariants test coverage

The system SHALL provide automated tests for extracted pure simulation logic and persistence migrations.

#### Scenario: Deterministic simulation tests run without Phaser

- **WHEN** automated tests execute for simulation modules
- **THEN** tests import pure TypeScript logic only
- **AND** verify invariants such as connectivity, spawn safety, and RNG repeatability

#### Scenario: Profile migration tests validate version transitions

- **WHEN** profile versioning logic is tested
- **THEN** migrations from older profile versions to current are validated
- **AND** invalid payloads fallback safely to defaults without throwing

### Requirement: Internal gameplay debug controls

The system SHALL provide low-risk internal devtools hooks for deterministic iteration.

#### Scenario: Devtools expose run seed and restart with same seed

- **WHEN** game runs in development mode
- **THEN** internal debug surface exposes current seed and a restart action preserving that seed

#### Scenario: Devtools expose slow-motion toggle

- **WHEN** developer toggles sim speed from debug controls
- **THEN** gameplay update timing applies a slow-motion multiplier without changing core rules
