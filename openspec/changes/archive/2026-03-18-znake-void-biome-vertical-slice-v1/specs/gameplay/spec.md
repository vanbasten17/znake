## MODIFIED Requirements

### Requirement: Enemy AI and collision

The system SHALL support biome-exclusive enemy variants and mini-boss behavior in addition to baseline enemies.

#### Scenario: Stalker variant can appear in mid floors

- **WHEN** floor is at or above stalker unlock threshold and enemy spawn resolves variant chance
- **THEN** a stalker enemy may spawn with more aggressive movement and higher kill reward

#### Scenario: Mini-boss floor encounter

- **WHEN** floor index matches configured boss interval
- **THEN** run starts with a boss enemy that has multi-hit health and grants boss reward on defeat

### Requirement: Powerup spawning and effects

The system SHALL support a biome-exclusive collectible item with score and growth benefits.

#### Scenario: Core item spawns from biome rules

- **WHEN** food is consumed on eligible floors and biome spawn chance succeeds
- **THEN** a core item appears on a safe cell

#### Scenario: Core item collection grants biome bonus

- **WHEN** player collects biome core item
- **THEN** score increases and pending growth increments by configured biome bonuses

### Requirement: Floor progression

The system SHALL include a biome hazard loop that applies recurring pressure during gameplay.

#### Scenario: Moving rift hazard pulses over time

- **WHEN** biome rift timer ticks
- **THEN** rift relocates and applies configured hazard outcome if player occupies rift cell
