# meta-progression Specification

## Purpose
TBD - created by archiving change znake-menu-spend-and-run-routing. Update Purpose after archive.
## Requirements
### Requirement: Talent spending interaction

The system SHALL allow spending persistent currency from Main Menu via pointer/touch interaction, not keyboard only.

#### Scenario: Buy talent from menu row

- **WHEN** player taps/clicks an available talent entry in Main Menu
- **THEN** currency is deducted, talent is unlocked, and menu state refreshes immediately

#### Scenario: Disabled row does not purchase

- **WHEN** player taps/clicks a talent that is unaffordable, locked by prerequisite, or already unlocked
- **THEN** no currency is deducted and unlock state remains unchanged

### Requirement: Persistent profile

The system SHALL load and persist profile state through explicit versioned migrations.

#### Scenario: Migration chain upgrades older profile versions

- **WHEN** stored profile payload version is older than current profile schema
- **THEN** ordered migration steps upgrade payload to current schema
- **AND** upgraded profile is validated before being used by runtime

#### Scenario: Unsafe payloads fallback safely

- **WHEN** stored profile payload is malformed or migration fails validation
- **THEN** runtime falls back to safe default profile
- **AND** backup payload path remains available as secondary recovery source

### Requirement: Run-start relic draft

The system SHALL present exactly three relic options before each run and require selecting one.

#### Scenario: Relic selection gates run start

- **WHEN** the player starts a run
- **THEN** the game shows three draft relic options and starts gameplay only after one is selected

#### Scenario: Selected relic affects run config

- **WHEN** a relic is selected
- **THEN** its effect is applied to the run configuration before the first gameplay tick

### Requirement: End-of-run currency rewards

The system SHALL produce reward breakdown data and apply tuned economy coefficients.

#### Scenario: Reward breakdown is available at run end

- **WHEN** a run ends
- **THEN** score/kill/floor components and final reward can be derived from centralized economy config

### Requirement: Talent unlock spending

The system SHALL allow spending persistent currency on talent nodes with centralized talent cost values.

#### Scenario: Talent costs read central config

- **WHEN** talent tree is loaded in menu and unlock checks run
- **THEN** each talent cost is sourced from centralized balance config

### Requirement: Mid-term progression goals

The system SHALL track and reward lightweight one-time goals across runs.

#### Scenario: Goal progress persists

- **WHEN** player advances goal metrics (for example floor reached or elite kills)
- **THEN** goal progress is persisted in profile state

#### Scenario: Goal reward can be claimed once

- **WHEN** player reaches a goal target and claims its reward
- **THEN** currency increases once and goal is marked claimed

### Requirement: Lightweight mutator availability progression

The system SHALL support lightweight deterministic mutator availability gating without introducing permanent stat inflation.

#### Scenario: Availability reads profile progression flags
- **WHEN** a run is prepared for mutator draft
- **THEN** mutator availability is filtered by persisted progression flags or milestones
- **AND** gating does not directly increase baseline combat stats

#### Scenario: Default profile remains valid
- **WHEN** profile data lacks mutator progression fields
- **THEN** runtime applies safe default mutator availability behavior
- **AND** run startup remains deterministic and migration-safe

### Requirement: Data-driven mutator unlock breadth policy
The system SHALL resolve mutator availability from centralized goal-threshold policy rather than hardcoded single-goal checks.

#### Scenario: Any configured goal can satisfy unlock breadth policy
- **WHEN** profile goal progress meets at least one configured unlock threshold under `any` mode
- **THEN** mutator availability resolves as unlocked
- **AND** unlock decision remains deterministic from profile and balance inputs

### Requirement: Unlock policy remains deterministic and migration-safe
The system SHALL evaluate unlock policy safely when profile fields are partially initialized by migration/default paths.

#### Scenario: Missing or zeroed progress keeps gating stable
- **WHEN** profile goal progress fields are missing, defaulted, or below thresholds
- **THEN** mutator availability resolves as locked
- **AND** run startup remains deterministic without runtime exceptions

