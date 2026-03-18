## MODIFIED Requirements

### Requirement: Central balance source

The system SHALL include economy and talent-cadence tuning values in centralized balance configuration.

#### Scenario: Reward pacing coefficients are centralized

- **WHEN** run reward is computed
- **THEN** all reward coefficients and clamps are read from centralized balance config

#### Scenario: Talent cadence values are centralized

- **WHEN** menu talent prices are evaluated
- **THEN** talent costs are read from centralized balance config and not scene literals
