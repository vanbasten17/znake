## ADDED Requirements

### Requirement: Boss identity and readability progression
The system SHALL resolve boss encounters through explicit identity and phase-readability contracts while keeping encounter sequencing deterministic.

#### Scenario: Boss phase transitions expose identity-aware cues
- **WHEN** boss encounter phase changes during an active boss floor
- **THEN** simulation-owned encounter state includes current boss identity and phase readability payload
- **AND** scene presentation consumes that payload without owning phase transition logic

### Requirement: Boss pressure fairness guardrails
The system SHALL preserve fairness during boss pressure escalation through deterministic reaction and overlap guardrails.

#### Scenario: Boss escalation preserves minimum reaction opportunity
- **WHEN** boss pressure escalates into higher-threat phase behavior
- **THEN** escalation respects configured reaction and anti-overlap thresholds
- **AND** deterministic fallback sequencing applies when strict fairness constraints cannot all be satisfied
