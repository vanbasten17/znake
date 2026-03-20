## MODIFIED Requirements

### Requirement: Central balance source

The system SHALL keep elite, item, and floor-template variety tuning in centralized balance tables.

#### Scenario: Core pressure knobs are centralized

- **WHEN** gameplay resolves core pressure activation, countdown, and coolant behavior
- **THEN** floor threshold, interval scaling, decay amount, and coolant gain values are read from centralized balance config

#### Scenario: Floor template cadence knobs are centralized

- **WHEN** gameplay resolves floor template selection
- **THEN** template type and cadence/threshold knobs are read from centralized balance config
