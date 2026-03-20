## ADDED Requirements

### Requirement: Elimination run type with venom combat

The system SHALL support elimination-oriented kill floors with manual venom offense.

#### Scenario: Kill objective floors run as elimination mode

- **WHEN** floor objective kind is `kills`
- **THEN** floor runs without food spawning
- **AND** progression depends on reaching kill target

#### Scenario: Venom charge can be collected and fired

- **WHEN** player collects venom powerup
- **THEN** a venom charge is added
- **AND** player can manually fire while charge is available

#### Scenario: Venom projectile damages enemies and respects cooldown

- **WHEN** venom is fired
- **THEN** projectile travels forward until wall/enemy contact
- **AND** enemy hit applies venom damage behavior
- **AND** subsequent fire is blocked until cooldown completes

#### Scenario: Boss floors expose venom pickup opportunity

- **WHEN** current floor objective is `boss`
- **THEN** run offers collectible venom opportunities during the fight
- **AND** venom remains manually fired via ability trigger
