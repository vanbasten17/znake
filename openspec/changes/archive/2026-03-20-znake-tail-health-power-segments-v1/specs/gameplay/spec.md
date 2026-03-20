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

#### Scenario: Enemy head contact applies heavier tail damage

- **WHEN** player collides with an enemy head and no shield is available
- **THEN** player loses multiple tail segments
- **AND** run only ends if no survivable segments remain

#### Scenario: Enemy body contact applies lighter tail damage

- **WHEN** player collides with an enemy body segment and no shield is available
- **THEN** player loses a smaller tail segment amount than head contact
- **AND** run only ends if no survivable segments remain

#### Scenario: Wall/self collisions remain instantly lethal

- **WHEN** player collides with wall or own body
- **THEN** existing instant-death behavior is preserved
