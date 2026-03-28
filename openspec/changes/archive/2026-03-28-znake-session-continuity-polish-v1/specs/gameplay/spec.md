## ADDED Requirements

### Requirement: Lifecycle resume continuity cue

The system SHALL emit a concise deterministic continuity cue when gameplay resumes from lifecycle auto-pause.

#### Scenario: Auto-resume hint includes objective and pending context
- **WHEN** app focus returns and lifecycle resumes an auto-paused run
- **THEN** the hint surface includes floor, objective preview, and bounded pending-context summary
- **AND** cue text is derived from deterministic run state
