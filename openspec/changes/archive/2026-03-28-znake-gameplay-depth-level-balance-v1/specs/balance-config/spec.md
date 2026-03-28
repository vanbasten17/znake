## ADDED Requirements

### Requirement: Central depth-band tuning tables
The system SHALL define depth-band balance tuning tables in centralized configuration for bounded floor progression and deterministic tuning iteration.

#### Scenario: Depth-band pressure targets are centrally authored
- **WHEN** gameplay resolves floor pressure knobs (enemy count, spawn cadence, interval pressure, and relief cadence)
- **THEN** values are read from centralized depth-band tuning tables
- **AND** scene code does not hardcode per-depth pressure constants inline

#### Scenario: Depth-band guardrails are centrally authored
- **WHEN** progression guardrails evaluate spike or flat-segment thresholds
- **THEN** threshold values and fallback priorities are read from centralized balance config
- **AND** tuning changes do not require editing multiple gameplay call sites

### Requirement: Central depth-aware item usefulness policy
The system SHALL define item spawn and usefulness policy by depth band and bounded run context in centralized balance configuration.

#### Scenario: Item usefulness knobs are config-driven
- **WHEN** gameplay resolves item spawn chance and context-sensitive usefulness weighting
- **THEN** values come from centralized depth-aware item policy tables
- **AND** gameplay/scene modules do not duplicate inline tuning branches

#### Scenario: Item policy remains deterministic and bounded
- **WHEN** depth-aware item policy applies context adjustments
- **THEN** adjustments are bounded by configured min/max ranges
- **AND** outcomes remain deterministic from seed and state inputs
