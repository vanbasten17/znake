## ADDED Requirements

### Requirement: Central body economy tuning
The system SHALL define first-pass body economy costs, cooldowns, and gating thresholds in centralized balance configuration.

#### Scenario: Body pulse tuning is config-driven
- **WHEN** gameplay evaluates body pulse segment cost, cooldown, and effect duration
- **THEN** each value comes from centralized balance config
- **AND** scene/gameplay call sites do not duplicate inline constants

#### Scenario: Reward overclock tuning is config-driven
- **WHEN** gameplay evaluates reward overclock segment cost and per-objective usage limit
- **THEN** values come from centralized balance config
- **AND** reward flow code does not hardcode spend magnitudes

#### Scenario: Minimum spendable floor is config-driven
- **WHEN** gameplay validates any body spend request
- **THEN** minimum spendable length floor is read from centralized balance config
- **AND** all body sinks use the same shared floor policy

