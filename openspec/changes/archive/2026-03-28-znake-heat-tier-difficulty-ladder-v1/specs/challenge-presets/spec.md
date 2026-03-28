## ADDED Requirements

### Requirement: Heat tiers derive deterministic mutator stacks

The system SHALL derive heat-tier mutator stacks deterministically from preset mutator context.

#### Scenario: Heat tier stack rotates deterministically from base mutator
- **WHEN** a valid forced mutator and heat tier are provided
- **THEN** stack order is derived by deterministic pool rotation from base mutator index
- **AND** equivalent inputs return identical stack output.

#### Scenario: Heat tier bounds are clamped
- **WHEN** heat tier input is outside supported range
- **THEN** tier is clamped to supported bounds before stack resolution
- **AND** no invalid tier creates undefined mutator output.
