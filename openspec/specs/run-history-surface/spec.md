# run-history-surface Specification

## Purpose
TBD - created by archiving change znake-menu-run-history-timeline-v1. Update Purpose after archive.
## Requirements
### Requirement: Bounded run-history summary contract

The system SHALL persist a bounded local history of recent run summaries for menu-level learning support.

#### Scenario: New run summary is appended deterministically
- **WHEN** a run ends and death summary is generated
- **THEN** a run-history summary entry is appended with timestamp, seed, floor, score, death reason, and build leaning
- **AND** history keeps newest-first ordering with bounded maximum size

#### Scenario: Malformed persisted history fails safely
- **WHEN** persisted run-history payload is missing or malformed
- **THEN** loader returns an empty history set
- **AND** menu rendering remains stable

### Requirement: Run history entries keep stable persisted shape

The system SHALL enforce this contract as part of the znake-run-history-entry-shape-contract-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

