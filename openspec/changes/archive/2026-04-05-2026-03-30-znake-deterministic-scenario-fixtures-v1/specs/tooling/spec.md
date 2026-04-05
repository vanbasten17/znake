## ADDED Requirements

### Requirement: Tooling provides deterministic reusable scenario fixtures

The tooling system SHALL expose deterministic reusable scenario fixtures for tests.

#### Scenario: Test constructs a baseline combat-economy scenario
- WHEN a test requests a named scenario fixture
- THEN the fixture returns canonical seeded state builders
- AND repeated fixture construction yields deterministic equivalent state
