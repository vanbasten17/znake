## ADDED Requirements

### Requirement: Feedback output follows bounded profile scaling

The system SHALL apply bounded profile scaling to feedback audio and haptic output.

#### Scenario: Profile modifies intensity while preserving cue semantics
- **WHEN** feedback event is emitted under a selected audio profile
- **THEN** vibration intensity and tone gain/duration are scaled by profile
- **AND** cue pattern semantics remain recognizable across profiles
