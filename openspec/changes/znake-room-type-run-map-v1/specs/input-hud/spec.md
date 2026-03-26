## ADDED Requirements

### Requirement: Upcoming route choice readability

The system SHALL present the next reachable room choices clearly enough that the player can make an informed route decision at a glance.

#### Scenario: Route choice shows room type and branch identity

- **WHEN** a route-decision prompt is shown
- **THEN** each reachable option displays its room type
- **AND** the player can distinguish one branch from another without opening a separate map screen

#### Scenario: Route choice stays lightweight on mobile

- **WHEN** route choices are presented on portrait touch layouts
- **THEN** the prompt fits within the existing run HUD or overlay composition without obscuring critical game-state context
- **AND** keyboard and touch interaction patterns remain consistent with existing selection flows

### Requirement: Current route context visibility

The system SHALL expose enough current path context in the run HUD to support planning without overwhelming the player.

#### Scenario: Current room context is visible during the run

- **WHEN** a room is active
- **THEN** the HUD can show the current room type or immediate route context
- **AND** that context remains secondary to the active room objective display

#### Scenario: Preview horizon does not become full-map clutter

- **WHEN** route preview data is rendered
- **THEN** the HUD presents only the bounded set of relevant upcoming choices
- **AND** does not require a full-screen permanent run-map view in v1
