## ADDED Requirements

### Requirement: Shared body segment economy
The system SHALL treat snake body length as a shared deterministic resource consumed by both damage and voluntary spend actions.

#### Scenario: Spend and damage consume same segment pool
- **WHEN** the player takes enemy contact damage and later triggers a body spend sink in the same run
- **THEN** both outcomes remove segments from the same snake length pool
- **AND** no separate hidden spend currency is introduced

#### Scenario: Spending respects survivability floor
- **WHEN** a body spend sink is requested while current length is at or below configured minimum spendable length
- **THEN** the spend request is rejected deterministically
- **AND** the snake length remains unchanged

### Requirement: Controlled body spend sinks
The system SHALL provide first-pass deterministic sink contracts for combat space relief and reward-flow quality tradeoff.

#### Scenario: Body pulse spend resolves in combat
- **WHEN** the player triggers `body_pulse` and spend validation passes
- **THEN** configured segment cost is removed
- **AND** a deterministic pulse effect state is emitted for gameplay resolution

#### Scenario: Reward overclock spend resolves before reward selection
- **WHEN** reward selection is active after objective completion and player triggers `reward_overclock`
- **THEN** configured segment cost is removed
- **AND** reward options are rerolled deterministically once for that objective completion

### Requirement: Simulation-owned spend resolution
Body spend validation, state transitions, and effect outputs SHALL be resolved in simulation/domain helpers rather than scene code.

#### Scenario: Scene forwards intent only
- **WHEN** spend input is received in gameplay runtime
- **THEN** scene code forwards intent to simulation/domain resolvers
- **AND** resolver outputs drive state mutation and result typing (`applied`, `blocked`, `on_cooldown`)

