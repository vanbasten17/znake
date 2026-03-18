## MODIFIED Requirements

### Requirement: Floor progression

The system SHALL advance floor when enough food is eaten; floor affects difficulty and upgrade choice, using centralized balance configuration for progression values.

#### Scenario: Floor clears after configured food threshold

- **WHEN** `foodEaten` reaches the configured per-floor target
- **THEN** scene transitions to Upgrade with score and floor

#### Scenario: Floor difficulty derives from balance config

- **WHEN** floor N starts
- **THEN** wall count, enemy count, and enemy interval are computed through centralized floor setup values, not inline literals

### Requirement: Powerup spawning and effects

The system SHALL spawn powerups and apply runtime effects using configurable balance values.

#### Scenario: Powerup spawn chances are configurable

- **WHEN** floor starts, food is eaten, or post-pick respawn is evaluated
- **THEN** spawn chances and respawn delay use centralized balance probabilities and timings

#### Scenario: Slow and score powerups use configurable multipliers

- **WHEN** player collects slow or score powerups
- **THEN** enemy slow multiplier and score bonus come from centralized balance values
