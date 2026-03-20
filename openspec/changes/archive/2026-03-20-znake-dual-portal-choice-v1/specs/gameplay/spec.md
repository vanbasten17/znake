## MODIFIED Requirements

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Portal objective presents dual destination routes

- **WHEN** objective type is `portal` and portal timer reaches spawn state
- **THEN** two portals are spawned with distinct route labels (`safer`, `riskier`)
- **AND** route choice is readable through visual and localized UI cues

#### Scenario: Entered portal sets pending route for next floor

- **WHEN** player reaches one of the active portals
- **THEN** selected portal route is stored as pending route choice
- **AND** floor completion continues through the existing upgrade-transition flow

#### Scenario: Pending route modulates next floor setup once

- **WHEN** next floor gameplay initializes
- **THEN** pending route is consumed and applies configured setup modifiers (difficulty up/down)
- **AND** route effect does not persist beyond that floor unless a new route is selected
