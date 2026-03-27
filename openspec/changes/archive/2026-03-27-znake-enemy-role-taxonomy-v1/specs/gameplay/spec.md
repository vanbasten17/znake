## ADDED Requirements

### Requirement: Room-level enemy role composition

The system SHALL compose encounter pressure from explicit enemy role contracts so room-level threat priorities are readable and tactically distinct.

#### Scenario: Combat room starts with readable role mix

- **WHEN** a combat or elite room initializes enemy pressure
- **THEN** active enemy composition is built from declared role contracts
- **AND** the resulting role mix avoids collapsing into functionally indistinguishable pressure sources

### Requirement: First-pass role behavior contracts

The system SHALL preserve deterministic gameplay contracts for first-pass roles `sniper`, `blocker`, `summoner`, `charger`, and `leech`.

#### Scenario: Sniper creates lane-threat timing

- **WHEN** a `sniper` role enemy resolves its primary action
- **THEN** it uses an explicit pre-fire telegraph and line-commit threat window
- **AND** the player has a readable opportunity to reposition before impact

#### Scenario: Blocker creates space denial without deadlock

- **WHEN** a `blocker` role enemy applies pressure
- **THEN** it constrains routing or lane access through deterministic area denial behavior
- **AND** room logic preserves at least one practical escape route when alternatives exist

#### Scenario: Summoner scales pressure with management window

- **WHEN** a `summoner` role enemy attempts to add secondary threats
- **THEN** summon cadence follows deterministic role timing with pre-escalation readability
- **AND** player counterplay can interrupt or contain pressure before runaway board saturation

#### Scenario: Charger commits to burst lane attack

- **WHEN** a `charger` role enemy triggers a burst action
- **THEN** it enters a readable windup before high-commit movement
- **AND** post-commit recovery creates a punish or disengage window

#### Scenario: Leech applies economy pressure

- **WHEN** a `leech` role enemy interacts with economy targets
- **THEN** it applies deterministic pressure to pickup or reward value flow
- **AND** telegraph/counterplay windows allow the player to contest that pressure intentionally

### Requirement: Gameplay fairness from role interactions

The system SHALL enforce fairness at the interaction level when multiple roles are active in the same room.

#### Scenario: Multi-role pressure remains fair

- **WHEN** at least two role types are simultaneously applying pressure
- **THEN** anti-stack and cadence guardrails preserve a minimum reaction opportunity for the player
- **AND** unavoidable near-instant damage chains are prevented when valid alternatives exist
