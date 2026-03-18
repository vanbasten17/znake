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

The system SHALL maintain a persistent player profile with versioned schema, one currency, unlocked talents, and lifetime stats.

#### Scenario: New profile bootstrap

- **WHEN** the game is launched without existing profile data
- **THEN** it creates a default profile with zero currency, no unlocked talents, and initialized lifetime stats

#### Scenario: Existing profile load

- **WHEN** the game is launched with valid profile data
- **THEN** it loads the profile and exposes it to run-start and run-end flows

### Requirement: Run-start relic draft

The system SHALL present exactly three relic options before each run and require selecting one.

#### Scenario: Relic selection gates run start

- **WHEN** the player starts a run
- **THEN** the game shows three draft relic options and starts gameplay only after one is selected

#### Scenario: Selected relic affects run config

- **WHEN** a relic is selected
- **THEN** its effect is applied to the run configuration before the first gameplay tick

### Requirement: End-of-run currency rewards

The system SHALL convert run performance into persistent currency using centralized economy coefficients.

#### Scenario: Currency formula reads central economy config

- **WHEN** run reward is computed from score, kills, and floor
- **THEN** score divisor, kill value, floor value, and minimum reward are read from centralized balance config

### Requirement: Talent unlock spending

The system SHALL allow spending persistent currency on talent nodes with centralized talent cost values.

#### Scenario: Talent costs read central config

- **WHEN** talent tree is loaded in menu and unlock checks run
- **THEN** each talent cost is sourced from centralized balance config

