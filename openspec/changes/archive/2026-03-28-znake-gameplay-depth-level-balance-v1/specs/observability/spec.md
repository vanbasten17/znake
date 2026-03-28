## ADDED Requirements

### Requirement: Per-level fail-point depth telemetry
The system SHALL emit bounded deterministic fail-point telemetry fields for each run level to support depth-balance tuning.

#### Scenario: Fail events include level and depth-band context
- **WHEN** a run-ending or major fail-point event is emitted
- **THEN** payload includes floor/level index, depth-band identifier, and bounded fail-reason context
- **AND** fields are stable for cross-run aggregation and comparison

#### Scenario: Fail telemetry supports spike and flat-segment diagnostics
- **WHEN** fail-point telemetry is aggregated for tuning review
- **THEN** data can identify depth bands with concentrated spike deaths and low-pressure plateaus
- **AND** missing dimensions are explicitly marked unavailable rather than inferred

### Requirement: Depth-balance tuning outcome telemetry
The system SHALL emit bounded telemetry describing resolved depth-tuning outcomes for enemy composition and item usefulness.

#### Scenario: Composition and item outcome fields are emitted
- **WHEN** room/floor setup resolves depth-aware enemy and item tuning
- **THEN** telemetry includes compact outcome fields for selected role-composition profile and item usefulness profile
- **AND** payload values align with centralized depth-balance taxonomy

#### Scenario: Outcome telemetry remains deterministic and non-invasive
- **WHEN** depth-balance outcome telemetry is emitted
- **THEN** emission is best-effort and non-blocking
- **AND** telemetry collection does not alter deterministic gameplay resolution
