## MODIFIED Requirements

### Requirement: Enemy AI and collision

The system SHALL provide explicit feedback for lethal collision outcomes.

#### Scenario: Lethal collision emits crash cue

- **WHEN** player death reason is `wall`, `self`, or `enemy`
- **THEN** feedback system emits a dedicated `crash` cue
- **AND** the cue is distinct from generic success/confirm interactions

#### Scenario: Non-collision lethal hazard preserves danger cue

- **WHEN** player death reason is `rift`
- **THEN** feedback system keeps using `danger` cue semantics
