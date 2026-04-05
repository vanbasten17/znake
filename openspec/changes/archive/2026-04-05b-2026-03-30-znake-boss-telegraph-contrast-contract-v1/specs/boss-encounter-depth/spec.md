## ADDED Requirements

### Requirement: Boss telegraphs maintain readability under combat load

The system SHALL guarantee minimum telegraph readability for boss attacks.

#### Scenario: Heavy boss attack announces with contrast-safe telegraph
- WHEN a heavy boss attack is queued
- THEN the telegraph appears with configured lead-time and contrast floor
- AND the telegraph sequence is deterministic for identical run state
