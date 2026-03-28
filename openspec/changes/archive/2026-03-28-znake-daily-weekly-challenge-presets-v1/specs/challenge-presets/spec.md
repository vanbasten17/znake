## ADDED Requirements

### Requirement: Calendar-bucketed challenge preset contract

The system SHALL define challenge preset contracts for `standard`, `daily`, and `weekly` run starts.

#### Scenario: Preset ids resolve to stable bucket semantics
- **WHEN** a run-start request includes challenge preset id
- **THEN** `standard` uses fallback ad-hoc seed behavior
- **AND** `daily` resolves through UTC day bucket semantics
- **AND** `weekly` resolves through UTC week bucket semantics

### Requirement: Preset includes bounded modifier-pack context

The system SHALL include bounded modifier-pack context in challenge preset resolution output.

#### Scenario: Preset resolution can emit deterministic mutator identifier
- **WHEN** a `daily` or `weekly` preset is resolved
- **THEN** output may include one deterministic mutator identifier from configured pool
- **AND** `standard` preset returns no forced mutator identifier
