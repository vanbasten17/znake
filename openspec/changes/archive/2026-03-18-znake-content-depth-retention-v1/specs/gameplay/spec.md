## MODIFIED Requirements

### Requirement: Enemy AI and collision

The system SHALL support an additional elite enemy pattern beyond stalker and boss.

#### Scenario: Ambusher elite can spawn

- **WHEN** floor and spawn rules meet ambusher conditions
- **THEN** ambusher enemy can be selected in enemy spawn resolution

#### Scenario: Ambusher applies burst pressure

- **WHEN** ambusher movement updates during gameplay
- **THEN** it can execute a short burst/dash behavior with safety constraints

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Rift battery suppresses hazard window

- **WHEN** player collects a rift battery item
- **THEN** rift pressure is reduced or paused for configured duration
