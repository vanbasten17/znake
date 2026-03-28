## ADDED Requirements

### Requirement: Boss identity includes deterministic remix context

The system SHALL expose boss identity context that includes deterministic phase-remix identifier for encounter-depth analysis.

#### Scenario: Encounter summary identity includes remix dimension
- **WHEN** boss encounter summary identity is resolved for a run
- **THEN** identity payload includes stable remix context in addition to base boss identity
- **AND** equivalent runs produce equivalent identity+remix tuples
