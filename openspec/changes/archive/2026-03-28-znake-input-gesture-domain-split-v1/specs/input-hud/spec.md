## ADDED Requirements

### Requirement: Touch gesture interpretation is modular and ambiguity-aware

The system SHALL isolate touch gesture interpretation from DOM wiring and reduce ambiguous diagonal turns.

#### Scenario: Input wiring uses modular interpreter
- **WHEN** touch input is captured in run mode
- **THEN** directional intent is resolved through a dedicated interpreter helper
- **AND** the virtual input contract remains compatible with existing gameplay systems.

#### Scenario: Ambiguous diagonal swipe does not force a turn
- **WHEN** a swipe is below the configured axis-dominance ratio
- **THEN** no directional turn is committed
- **AND** player control remains stable and predictable.
