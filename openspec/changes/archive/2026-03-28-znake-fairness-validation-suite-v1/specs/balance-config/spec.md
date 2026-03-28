## ADDED Requirements

### Requirement: Central fairness-suite threshold configuration
The system SHALL keep fairness validation seed inputs and per-depth-band thresholds in centralized balance configuration.

#### Scenario: Fairness suite thresholds are centrally tuned
- **WHEN** balancing updates fairness validation thresholds or seed table
- **THEN** tooling reads the updated values from centralized configuration
- **AND** validation behavior does not rely on duplicated script-local threshold constants
