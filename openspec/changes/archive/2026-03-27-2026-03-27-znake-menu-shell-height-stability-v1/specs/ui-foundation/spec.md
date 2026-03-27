## MODIFIED Requirements

### Requirement: Shared UI design tokens

The system SHALL provide a shared design-token and shell-primitive layer for non-gameplay UI styling, including desktop centering behavior for shell composition.

#### Scenario: Desktop shell is centered for menu and run

- **WHEN** the app is rendered on desktop-class viewports
- **THEN** the shell block (`hud`, gameplay area, controls if visible) is centered in the viewport
- **AND** the gameplay/overlay region still uses the full available desktop height instead of a reduced fixed-height panel
- **AND** mobile-first layout behavior remains unchanged on touch/phone viewports

#### Scenario: Menu shell transition keeps stable vertical anchoring

- **WHEN** menu mode is active and overlays fill the game area
- **THEN** the menu shell uses the full available content height without overlap/negative-margin compensation hacks
- **AND** transitioning to the next scene does not introduce avoidable vertical offset jumps caused by shell anchoring mismatch

#### Scenario: Draft and reward overlays preserve vertical continuity

- **WHEN** relic/upgrade/reward overlays render card stacks in the shared shell
- **THEN** top spacing scales without creating large dead zones on tall viewports
- **AND** overflow is handled by the card list region instead of clipping primary actions/content
