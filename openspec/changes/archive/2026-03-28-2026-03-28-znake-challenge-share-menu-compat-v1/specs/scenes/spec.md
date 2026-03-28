## ADDED Requirements

### Requirement: Menu challenge-share prompt copy resolution

The system SHALL keep Menu scene challenge-share prompt flow localized and fallback-safe without changing run-start behavior.

#### Scenario: Menu scene copy prompt remains behaviorally equivalent with localized text

- **WHEN** challenge-share export falls back to prompt-based copy flow
- **THEN** Menu scene uses localized challenge-share copy prompt title
- **AND** export telemetry and run flow behavior remain unchanged

#### Scenario: Menu scene import prompt remains behaviorally equivalent with localized text

- **WHEN** challenge-share import prompt is shown
- **THEN** Menu scene uses localized challenge-share import prompt title
- **AND** successful/failed import behavior and telemetry remain unchanged
