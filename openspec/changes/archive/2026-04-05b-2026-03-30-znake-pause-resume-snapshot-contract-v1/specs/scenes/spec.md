## ADDED Requirements

### Requirement: Pause and resume preserve deterministic gameplay state

The system SHALL restore gameplay-critical state deterministically after pause.

#### Scenario: Resume returns to equivalent simulation boundary
- WHEN the player pauses mid-run and then resumes
- THEN simulation state restores from a defined snapshot boundary
- AND scene overlays/input ownership restore in deterministic order
