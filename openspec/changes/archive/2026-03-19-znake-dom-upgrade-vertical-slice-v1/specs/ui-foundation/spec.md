## MODIFIED Requirements

### Requirement: Shared UI design tokens

The system SHALL provide a shared design-token and shell-primitive layer for non-gameplay UI styling.

#### Scenario: Token layer is available globally

- **WHEN** app styles are loaded
- **THEN** a shared token stylesheet defines canonical variables for color, typography, spacing, radius, glow, z-index, and motion

#### Scenario: Core shell styles consume tokens

- **WHEN** shell-level UI styles are applied
- **THEN** core layout and control styles use token references instead of ad-hoc literals
- **AND** visual behavior remains equivalent for existing flows

#### Scenario: UI shell primitives are reusable

- **WHEN** a scene sets shell mode through HUD/system API
- **THEN** common menu/run shell layout is applied through reusable shell primitives
- **AND** split ratios can be adjusted without scene-specific CSS rewrites

#### Scenario: Upgrade vertical slice uses scoped CSS module

- **WHEN** upgrade DOM UI is rendered
- **THEN** styles are applied through a scene-scoped CSS Module backed by shared tokens
- **AND** global gameplay styling remains isolated
