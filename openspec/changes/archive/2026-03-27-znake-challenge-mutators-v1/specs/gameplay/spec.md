## ADDED Requirements

### Requirement: Deterministic challenge mutator activation

The system SHALL resolve first-pass challenge mutators deterministically from run seed and progression context before gameplay begins.

#### Scenario: Same seed yields same mutator set
- **WHEN** two runs start with the same seed and equivalent progression context
- **THEN** mutator selection and ordering are identical
- **AND** scene-local randomness does not alter the selected mutator set

#### Scenario: Mutator activation occurs before first gameplay tick
- **WHEN** gameplay initializes a new run
- **THEN** mutator effects are attached to run state before the first gameplay tick
- **AND** objective, enemy, and reward systems read the same resolved mutator context

### Requirement: Safe mutator composition across gameplay systems

The system SHALL apply mutators through simulation-owned composition contracts that preserve objective solvability and deterministic outcomes.

#### Scenario: Objective loop remains solvable under mutators
- **WHEN** mutators adjust pressure, timers, or reward tradeoffs
- **THEN** active room objectives remain achievable under configured fairness constraints
- **AND** invalid mutator combinations are rejected before run start

#### Scenario: Body and event outcomes remain recoverable
- **WHEN** mutators interact with body spend sinks or event-choice effects
- **THEN** composition enforces configured recoverability floors
- **AND** no accepted mutator set creates deterministic non-recoverable non-boss states

### Requirement: Anti-frustration guardrails for mutator pressure

The system SHALL enforce anti-frustration limits for stacked mutator pressure and preserve player reaction windows.

#### Scenario: Pressure stack ceiling is enforced
- **WHEN** candidate mutators exceed configured pressure budget or blocked-combination rules
- **THEN** those candidates are rejected deterministically
- **AND** replacement selection follows deterministic fallback logic

#### Scenario: Reaction fairness windows remain active
- **WHEN** mutators alter enemy tempo, spawn cadence, or hazard density
- **THEN** existing room-entry and post-hit fairness windows remain respected
- **AND** player reaction windows do not drop below configured minimum thresholds
