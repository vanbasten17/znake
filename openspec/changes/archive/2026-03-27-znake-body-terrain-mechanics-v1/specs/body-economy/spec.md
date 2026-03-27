## ADDED Requirements

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
