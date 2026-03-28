## ADDED Requirements

### Requirement: Enemy tick uses explicit strategy routing for special kinds

The system SHALL route special enemy tick behavior through explicit strategy selection before normal chase fallback.

#### Scenario: Special enemy kind selects deterministic strategy
- **WHEN** an enemy tick starts for a known special kind
- **THEN** the matching strategy handler is selected deterministically
- **AND** normal chase fallback executes only when no special strategy result applies.
