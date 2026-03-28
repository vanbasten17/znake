## ADDED Requirements

### Requirement: Architecture guardrail checks for iteration speed

The system SHALL provide tooling checks that surface architecture-boundary and complexity-budget regressions during development.

#### Scenario: Simulation side-effect boundaries are checked

- **WHEN** project checks run on changes touching gameplay simulation modules
- **THEN** tooling reports forbidden side-effect usage in `simulation/*` (for example direct DOM/window/localStorage/Phaser dependencies)
- **AND** check output is actionable for fast remediation

#### Scenario: Scene complexity-budget drift is reported

- **WHEN** scene files exceed agreed complexity budgets (for example file length/import count thresholds)
- **THEN** tooling reports budget breaches with file-level context
- **AND** output encourages extraction-first remediation in subsequent apply slices
