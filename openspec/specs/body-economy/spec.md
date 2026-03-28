# body-economy Specification

## Purpose
TBD - created by archiving change znake-body-economy-v1. Update Purpose after archive.
## Requirements
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

### Requirement: Terrain-aware spend recoverability checks

Body spend validation SHALL include deterministic terrain-aware recoverability checks before applying spend cost.

#### Scenario: Body pulse validates terrain recoverability

- **WHEN** `body_pulse` is requested
- **THEN** spend validation includes current terrain snapshot and recoverability threshold checks
- **AND** blocked outcomes emit bounded guardrail reason context

#### Scenario: Reward overclock validates terrain recoverability

- **WHEN** `reward_overclock` is requested in reward window
- **THEN** spend validation includes terrain recoverability checks before spend is applied
- **AND** successful spends remain deterministic and bounded by existing usage limits


### Requirement: Panic recovery guard window
Body economy SHALL expose a bounded low-health panic recovery window with deterministic cooldown gating.

#### Scenario: Panic window arms at low-health threshold
- **WHEN** runtime body economy tick observes snake length near spend floor and cooldown is clear
- **THEN** panic-recovery window arms for a short bounded duration
- **AND** cooldown begins to prevent immediate rearming.

#### Scenario: Emergency spend fallback is one-shot per panic window
- **WHEN** body pulse spend would fail at spend floor while panic window is active
- **THEN** emergency fallback allows one deterministic pulse without additional segment spend
- **AND** panic active window is consumed before subsequent spend attempts.
