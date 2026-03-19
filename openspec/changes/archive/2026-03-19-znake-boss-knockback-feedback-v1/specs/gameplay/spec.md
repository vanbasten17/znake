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

#### Scenario: Boss impact with shield uses readable knockback response

- **WHEN** player collides with boss while having at least one shield
- **THEN** boss takes configured collision damage
- **AND** player consumes shield and receives explicit knockback/impact feedback
- **AND** resulting player position remains valid within current collision constraints

#### Scenario: Boss impact without shield remains lethal

- **WHEN** player collides with boss without shield
- **THEN** run ends per existing lethal collision rules
