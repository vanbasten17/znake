## ADDED Requirements

### Requirement: First-run intent cues explain urgent threat and objective context

The system SHALL provide deterministic intent cues during onboarding-tagged runs.

#### Scenario: Urgent danger cue appears with objective context
- WHEN a run is within onboarding cue eligibility
- AND threat pressure crosses the configured urgency threshold
- THEN the player receives an urgent cue with objective-aware context
- AND the cue trigger remains deterministic for identical seeds and inputs
