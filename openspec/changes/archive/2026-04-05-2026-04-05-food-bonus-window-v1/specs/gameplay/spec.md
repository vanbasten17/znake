## ADDED Requirements

### Requirement: Food bonus-window scoring cadence
The system SHALL arm a short score bonus window after every 5 foods eaten and apply extra score to the next food pickup.

#### Scenario: Fifth food arms bonus window for next pickup
- **WHEN** the player eats the 5th food in the current bonus cadence
- **THEN** the current pickup uses base food score only
- **AND** the next food pickup is marked as bonus-eligible

#### Scenario: Next food consumes armed bonus
- **WHEN** a bonus window is armed and the player eats a food
- **THEN** the pickup grants base food score plus extra bonus score
- **AND** the bonus window is consumed immediately after that pickup

#### Scenario: Bonus cadence rearms deterministically
- **WHEN** the player continues collecting foods after consuming a bonus pickup
- **THEN** the bonus window re-arms again after the next 5 foods
- **AND** trigger/consume behavior is deterministic for identical pickup sequences
