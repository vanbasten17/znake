## ADDED Requirements

### Requirement: Boss-floor encounter scaffold

The system SHALL maintain a dedicated boss-floor encounter branch that can be extended incrementally without breaking baseline progression.

#### Scenario: Boss floor uses explicit encounter objective

- **WHEN** floor is marked as boss floor
- **THEN** progression objective is boss defeat
- **AND** non-boss objective checks are bypassed for that floor

#### Scenario: Boss defeat transitions cleanly to upgrade selection

- **WHEN** boss health reaches zero
- **THEN** scene transitions to upgrade flow
- **AND** no additional portal/score/kill objective gating blocks the transition

#### Scenario: Boss floor provides recurring shield support opportunities

- **WHEN** boss encounter is active and no powerup is present
- **THEN** a shield-oriented support powerup is offered on a recurring timer
- **AND** support cadence remains configurable in centralized balance knobs

#### Scenario: Boss support does not grant direct shield charges

- **WHEN** boss support logic triggers
- **THEN** shield availability is provided through collectible powerup spawn only
- **AND** shield count changes only on player pickup or damage consumption

#### Scenario: Boss floors do not preload shields at start

- **WHEN** a boss floor initializes
- **THEN** player starts with zero active shields
- **AND** shield access is obtained from collectible shield powerups during encounter
