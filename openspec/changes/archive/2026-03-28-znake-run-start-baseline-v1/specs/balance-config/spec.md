## ADDED Requirements

### Requirement: Central run-start baseline and additive composition policy
The system SHALL define run-start baseline length in centralized balance configuration and SHALL keep additive bonus composition policy explicit and deterministic.

#### Scenario: Baseline start length is centrally authored
- **WHEN** runtime creates default run config for a new run
- **THEN** baseline start length value comes from centralized balance configuration
- **AND** baseline can be tuned without scene-local constant edits

#### Scenario: Additive composition policy is centrally preserved
- **WHEN** run-start length is computed with progression bonuses
- **THEN** the system uses centralized baseline plus additive bonus fields as the single composition contract
- **AND** composition behavior remains deterministic for identical seeds and profile state
