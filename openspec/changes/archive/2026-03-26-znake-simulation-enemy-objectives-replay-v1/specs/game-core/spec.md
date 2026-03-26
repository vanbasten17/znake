## MODIFIED Requirements

### Requirement: Persistent game state

The runtime SHALL capture replay-ready run metadata for deterministic debugging.

#### Scenario: Run capture starts with seed

- **WHEN** a run starts
- **THEN** runtime initializes replay capture with the resolved run seed
- **AND** capture timeline starts at run-begin

#### Scenario: Input intents are appended in order

- **WHEN** gameplay accepts input intents (direction, turn, ability, pause)
- **THEN** each accepted intent is appended to replay capture with relative timestamp
- **AND** event ordering is preserved for reproducibility
