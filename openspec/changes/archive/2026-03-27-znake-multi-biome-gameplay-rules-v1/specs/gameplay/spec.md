## ADDED Requirements

### Requirement: Biome gameplay-rule taxonomy and deterministic activation
The system SHALL resolve biome gameplay rules through a deterministic taxonomy-driven activation path that is independent of scene-local randomness.

#### Scenario: Biome rule activation is deterministic for equivalent seed context
- **WHEN** the same run seed, run-map node biome metadata, and progression state are resolved
- **THEN** the same active biome gameplay-rule set is selected
- **AND** activation order is stable and reproducible across runs with equivalent context

#### Scenario: Biome rule activation happens at deterministic progression boundaries
- **WHEN** progression enters a new biome-qualified room or segment boundary
- **THEN** biome gameplay-rule activation is evaluated once for that boundary context
- **AND** in-room updates consume the resolved rule payload without re-rolling biome behavior

### Requirement: Biome modifiers alter route planning and pressure rhythm
The system SHALL provide first-pass biome gameplay modifiers that change movement, routing, or survival-pressure timing decisions, not only presentation.

#### Scenario: Active biome modifier changes tactical routing choices
- **WHEN** a biome gameplay rule is active in a combat-oriented segment
- **THEN** at least one rule effect changes reachable safe-lane planning, timing windows, or route-risk tradeoffs
- **AND** the resulting decision impact is attributable to the active biome rule payload

#### Scenario: Biome pressure cadence changes are bounded for fairness
- **WHEN** biome rules modify survival-pressure rhythm in a segment
- **THEN** cadence shifts remain within configured fairness floors for reaction and recoverability
- **AND** biome modifiers do not bypass existing anti-cheap-hit protection contracts

### Requirement: Biome compatibility guardrails across objectives, mutators, and body economy
The system SHALL validate biome gameplay-rule compatibility with objective contracts, mutator contracts, and body-economy constraints before final activation.

#### Scenario: Conflicting biome combinations are resolved with deterministic guardrail fallback
- **WHEN** candidate biome rules conflict with active objective, mutator, or body-economy recoverability thresholds
- **THEN** the system applies deterministic fallback behavior (downgrade, replacement, or deferral) from centralized policy
- **AND** the final activated rule set preserves minimum player agency constraints

#### Scenario: Objective-critical segments preserve completion viability under biome rules
- **WHEN** a biome rule would reduce viability for an active objective type (`survive`, `collect_cores`, `defeat_elite`, `activate_terminals`)
- **THEN** compatibility checks enforce objective-specific guardrails before activation is finalized
- **AND** objective progression contracts remain intact without scene-specific exception logic
