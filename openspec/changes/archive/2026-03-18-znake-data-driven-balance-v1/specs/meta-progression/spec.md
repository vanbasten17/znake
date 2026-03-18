## MODIFIED Requirements

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
