## ADDED Requirements

### Requirement: Confidence cues stay integrated with existing hint flow

The system SHALL keep input-confidence cues integrated in existing scene hint flow without modal interruption.

#### Scenario: Confidence cues are additive and non-blocking
- **WHEN** scene updates hint text during active run state
- **THEN** confidence cues are appended as additive context only
- **AND** scene input/update flow remains unchanged
