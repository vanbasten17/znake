## ADDED Requirements

### Requirement: Bounded moment feedback

The system SHALL provide immediate, lightweight feedback for meaningful gameplay outcomes without changing the underlying gameplay result.

#### Scenario: Damage taken is immediately readable

- **WHEN** the player loses a shield, loses body segments, or takes a nonlethal hazard hit
- **THEN** presentation triggers a bounded impact response with readable flash/emphasis
- **AND** any micro-pause remains short enough to preserve control responsiveness

#### Scenario: Pickups are clearly acknowledged

- **WHEN** the player collects food, a powerup, or a biome item
- **THEN** presentation triggers an immediate pickup response distinct from damage feedback
- **AND** the response makes the collection readable without overwhelming nearby hazards

#### Scenario: Objective success gets a reward moment

- **WHEN** a room objective becomes reward-ready or a floor objective completes
- **THEN** presentation triggers a short celebration/emphasis response
- **AND** the response communicates success before the next reward or transition step begins
