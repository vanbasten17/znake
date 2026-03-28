## ADDED Requirements

### Requirement: Due event-choice consequences resolve at floor start

The system SHALL resolve due delayed event-choice consequences at floor initialization in deterministic order.

#### Scenario: Due consequences apply before room setup
- **WHEN** a new floor starts and pending delayed consequences are due
- **THEN** consequence effects are applied to floor-start runtime state before room-specific setup
- **AND** consumed consequences are removed from pending queue
