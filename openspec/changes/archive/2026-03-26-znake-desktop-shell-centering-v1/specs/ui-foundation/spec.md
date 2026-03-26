## MODIFIED Requirements

### Requirement: Shared UI design tokens

The system SHALL provide a shared design-token and shell-primitive layer for non-gameplay UI styling, including desktop centering behavior for shell composition.

#### Scenario: Desktop shell is centered for menu and run

- **WHEN** the app is rendered on desktop-class viewports
- **THEN** the shell block (`hud`, gameplay area, controls if visible) is centered in the viewport
- **AND** mobile-first layout behavior remains unchanged on touch/phone viewports
