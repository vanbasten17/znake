## ADDED Requirements

### Requirement: Central runway cadence policy for boss milestones
The system SHALL define boss milestone cadence in centralized balance configuration with a first-pass runway policy of nine regular floors followed by a boss floor at interval ten.

#### Scenario: Boss cadence interval is centrally authored for runway pacing
- **WHEN** run progression computes boss-floor cadence from balance config
- **THEN** cadence interval resolves to ten floors for the baseline runway policy
- **AND** systems consuming cadence avoid hardcoded per-scene boss-floor schedules
