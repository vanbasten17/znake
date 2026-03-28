## ADDED Requirements

### Requirement: Content selectors are modular and deterministic

Game-core SHALL keep content selector internals modular while preserving deterministic outcomes.

#### Scenario: Selector internals are extracted without behavior drift
- **WHEN** selector code is moved to dedicated helpers
- **THEN** public selector outcomes remain deterministic for equivalent inputs.
