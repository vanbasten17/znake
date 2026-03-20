## MODIFIED Requirements

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Core pressure activates on eligible non-boss floors

- **WHEN** a floor starts and biome pressure config is enabled for that floor
- **THEN** a pressure countdown starts
- **AND** pressure state is represented in run status text

#### Scenario: Food resets core pressure countdown

- **WHEN** player consumes food while core pressure is active
- **THEN** pressure countdown resets to configured interval

#### Scenario: Timeout consumes coolant before degrading tail

- **WHEN** core pressure countdown reaches zero and coolant charges are available
- **THEN** one coolant charge is consumed
- **AND** countdown resets without degrading snake length

#### Scenario: Timeout degrades tail when no coolant is available

- **WHEN** core pressure countdown reaches zero and coolant charges are not available
- **THEN** snake length is reduced by configured pressure amount
- **AND** countdown resets
