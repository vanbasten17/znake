## ADDED Requirements

### Requirement: Central event-choice consequence-memory tuning

The system SHALL keep delayed event-choice consequence-memory definitions in centralized balance config with bounded queue controls.

#### Scenario: Consequence-memory definitions are deterministic and bounded
- **WHEN** consequence-memory config is read
- **THEN** each definition includes source option id, delay-floor window, and bounded effects
- **AND** queue cap constraints are centralized and data-driven
