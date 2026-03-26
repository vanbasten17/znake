## ADDED Requirements

### Requirement: HUD support for meaningful moment emphasis

The system SHALL support short-lived HUD emphasis for major success/readability moments without introducing a broader HUD redesign.

#### Scenario: Reward-ready state receives explicit short emphasis

- **WHEN** a room objective completes and reward selection becomes available
- **THEN** the active HUD or hint presentation briefly emphasizes that success state
- **AND** the emphasis clears or settles into the normal reward-prompt state automatically

#### Scenario: Pickup feedback does not replace core hint readability

- **WHEN** a pickup emphasis message is shown
- **THEN** it remains brief and compatible with existing move/reward hint behavior
- **AND** control guidance returns after the short feedback window ends
