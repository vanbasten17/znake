## MODIFIED Requirements

### Requirement: Floor progression

The system SHALL use snake-length targets for non-boss floor advancement and keep boss-clear routing on boss floors.

#### Scenario: Non-boss floor clears by snake length

- **WHEN** run is on a non-boss floor
- **THEN** floor transitions after snake reaches configured total-length target

#### Scenario: Start-length modifiers do not auto-clear floor

- **WHEN** run starts with relic/talent bonuses that increase initial snake length
- **THEN** non-boss floor is not auto-cleared until snake grows at least one segment in that floor

#### Scenario: Boss floor still clears by boss defeat

- **WHEN** run is on a boss floor
- **THEN** floor transitions after boss encounter is resolved

#### Scenario: In-run next-floor hint is explicit

- **WHEN** player is in a non-boss floor
- **THEN** HUD shows remaining segments needed for next floor
- **AND** on boss floor HUD shows explicit boss-clear message
