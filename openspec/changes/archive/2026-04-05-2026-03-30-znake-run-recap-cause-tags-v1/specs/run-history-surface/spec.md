## ADDED Requirements

### Requirement: Run recap includes deterministic top cause tags

The system SHALL present deterministic cause tags in run recap/history.

#### Scenario: Run ends with multi-factor failure
- WHEN a run ends and recap is generated
- THEN the recap shows top-ranked cause tags within configured display budget
- AND repeated playback with identical state yields the same tags
