## ADDED Requirements

### Requirement: Developer scenario bootstrap

The system SHALL support deterministic debug scenario bootstrap for fast smoke testing.

#### Scenario: Game scene applies scenario floor and score bootstrap

- **WHEN** `GameScene` starts with a valid `devScenarioId`
- **THEN** scene bootstrap applies preset floor and score overrides before runtime setup
- **AND** base run config and regular gameplay systems still initialize normally

#### Scenario: Scenario flags force targeted runtime conditions

- **WHEN** a dev scenario includes optional flags (e.g. magnet, extra shields, darkness, short portal timer, near-head food)
- **THEN** those conditions are applied at startup
- **AND** the resulting state is immediately testable without replaying prior floors

#### Scenario: Invalid scenario id degrades to normal run setup

- **WHEN** `GameScene` receives an unknown `devScenarioId`
- **THEN** gameplay starts with normal progression bootstrap
- **AND** no runtime error is thrown
