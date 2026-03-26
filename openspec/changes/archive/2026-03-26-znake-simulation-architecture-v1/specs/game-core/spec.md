## MODIFIED Requirements

### Requirement: Run configuration

The system SHALL provide deterministic randomness primitives for gameplay systems that depend on random decisions.

#### Scenario: Seeded RNG drives extracted simulation systems

- **WHEN** a run starts
- **THEN** the runtime initializes a seeded RNG instance for simulation helpers
- **AND** extracted simulation modules consume that RNG instead of direct `Math.random()` usage

#### Scenario: Same seed reproduces same simulation decisions

- **WHEN** the same seed and equivalent simulation inputs are used
- **THEN** extracted simulation functions produce equivalent random decisions and outputs
