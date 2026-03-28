## ADDED Requirements

### Requirement: Pacing guardrail contract aligns with unified progression director
The system SHALL expose pressure-budget guardrail knobs through the unified progression-director payload using centralized pacing config.

#### Scenario: Unified payload carries pressure budget guardrail knobs
- **WHEN** progression payload is resolved for a floor/spawn context
- **THEN** payload includes pacing guardrail knobs for max concurrent pressure and minimum action cadence gap
- **AND** knobs are sourced from centralized deterministic pacing config
