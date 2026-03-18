## MODIFIED Requirements

### Requirement: Persistent game state

The system SHALL separate run-scoped state from profile-scoped persistent state.

#### Scenario: New run resets run state only

- **WHEN** a new run starts
- **THEN** run counters and temporary upgrades reset, while profile currency and unlocked talents remain unchanged

#### Scenario: Profile survives app reload

- **WHEN** the app is reloaded
- **THEN** profile currency, unlocked talents, and lifetime stats are restored from persistence
