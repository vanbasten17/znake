# boss-encounter-depth Specification

## Purpose
TBD - created by archiving change znake-boss-encounter-depth-followup-v1. Update Purpose after archive.
## Requirements
### Requirement: Deterministic boss identity contract
The system SHALL resolve boss encounter identity from centralized balance descriptors and expose it through simulation-owned state for readability and telemetry.

#### Scenario: Boss identity is stable for equivalent context
- **WHEN** two runs reach the same boss encounter context with equivalent seed and floor state
- **THEN** the resolved boss identity descriptor is identical
- **AND** scene/UI code consumes the resolved identity without recomputing encounter semantics

### Requirement: Boss counterplay readability windows
The system SHALL expose boss phase/counterplay windows through deterministic state transitions before damaging commits.

#### Scenario: Boss high-commit actions expose readable pre-impact window
- **WHEN** boss encounter pressure transitions into a high-commit action
- **THEN** a deterministic pre-impact counterplay window is available in encounter readability state
- **AND** the action cannot skip directly from neutral to damaging resolution in the same update step

### Requirement: Boss encounter summary attribution
The system SHALL maintain bounded boss encounter summary fields for post-run fairness learning and observability.

#### Scenario: Run-end summary includes boss-depth context when encountered
- **WHEN** a run ends after a boss encounter was active
- **THEN** run-end context includes bounded boss identity/phase and failure-reason summary fields
- **AND** summary fields align with centralized reason taxonomy used during the encounter

### Requirement: Boss identity includes deterministic remix context

The system SHALL expose boss identity context that includes deterministic phase-remix identifier for encounter-depth analysis.

#### Scenario: Encounter summary identity includes remix dimension
- **WHEN** boss encounter summary identity is resolved for a run
- **THEN** identity payload includes stable remix context in addition to base boss identity
- **AND** equivalent runs produce equivalent identity+remix tuples

