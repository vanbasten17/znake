## ADDED Requirements

### Requirement: Input pipeline supports deterministic turn grace buffering

The system SHALL support a deterministic short grace buffer for turn commands.

#### Scenario: Near-valid turn command arrives before eligibility tick
- WHEN a valid turn intent is submitted within the configured grace window
- THEN the command is buffered and executed on the first valid movement tick
- AND replaying identical input/tick sequences yields identical turns
