## ADDED Requirements

### Requirement: Persistent profile

The system SHALL maintain a persistent player profile with versioned schema, one currency, unlocked talents, and lifetime stats.

#### Scenario: New profile bootstrap

- **WHEN** the game is launched without existing profile data
- **THEN** it creates a default profile with zero currency, no unlocked talents, and initialized lifetime stats

#### Scenario: Existing profile load

- **WHEN** the game is launched with valid profile data
- **THEN** it loads the profile and exposes it to run-start and run-end flows

### Requirement: Run-start relic draft

The system SHALL present exactly three relic options before each run and require selecting one.

#### Scenario: Relic selection gates run start

- **WHEN** the player starts a run
- **THEN** the game shows three draft relic options and starts gameplay only after one is selected

#### Scenario: Selected relic affects run config

- **WHEN** a relic is selected
- **THEN** its effect is applied to the run configuration before the first gameplay tick

### Requirement: End-of-run currency rewards

The system SHALL convert run performance into persistent currency at run end.

#### Scenario: Currency granted on death summary

- **WHEN** a run ends
- **THEN** currency gain is computed from run performance inputs and added to persistent profile

#### Scenario: Lifetime stats update

- **WHEN** currency reward is granted
- **THEN** lifetime counters (runs played, total score, total kills, best floor) are updated

### Requirement: Talent unlock spending

The system SHALL allow spending persistent currency on talent nodes in a capped tree.

#### Scenario: Unlock successful

- **WHEN** player has enough currency and talent prerequisites are met
- **THEN** currency is deducted and the talent is marked unlocked in profile

#### Scenario: Unlock blocked

- **WHEN** player attempts to unlock without enough currency or missing prerequisites
- **THEN** the unlock is rejected and profile state remains unchanged
