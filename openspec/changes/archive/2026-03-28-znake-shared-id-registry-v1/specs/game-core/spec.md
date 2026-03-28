## ADDED Requirements

### Requirement: Core gameplay identifiers are centrally declared

The system SHALL provide a shared registry for core gameplay identifiers used across modules.

#### Scenario: Systems reuse shared identifier constants
- **WHEN** gameplay modules need known IDs (direction/enemy/powerup)
- **THEN** they use shared constants/types rather than ad-hoc literals
- **AND** behavior remains equivalent to prior contracts.
