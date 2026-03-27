## ADDED Requirements

### Requirement: Central enemy role taxonomy tuning

The system SHALL keep first-pass enemy role contract knobs in centralized balance configuration.

#### Scenario: Role timing knobs are config-driven

- **WHEN** gameplay resolves role telegraph duration, action commitment, cooldown, or recovery windows
- **THEN** values are read from centralized role balance config
- **AND** role simulation code does not duplicate inline timing constants

#### Scenario: Role identity knobs are config-driven

- **WHEN** gameplay resolves per-role pressure identity parameters
- **THEN** values come from centralized role config tables
- **AND** role behavior can be tuned without scene-level edits

### Requirement: Central role cadence and composition policy

The system SHALL keep room-level role cadence, caps, and anti-stack constraints in centralized balance configuration.

#### Scenario: Role cadence is centrally tuned

- **WHEN** spawn cadence or role action cadence is evaluated
- **THEN** cadence intervals and weighting policies come from centralized config
- **AND** encounter pacing can be tuned without editing multiple call sites

#### Scenario: Anti-stack constraints are centrally tuned

- **WHEN** gameplay evaluates simultaneous high-pressure role overlap
- **THEN** max-overlap, cooldown-gap, or equivalent anti-stack thresholds come from centralized config
- **AND** deterministic fallback thresholds are defined when strict constraints cannot be satisfied
