## ADDED Requirements

### Requirement: Shared UI design tokens

The system SHALL provide a shared design-token layer for non-gameplay UI styling.

#### Scenario: Token layer is available globally

- **WHEN** app styles are loaded
- **THEN** a shared token stylesheet defines canonical variables for color, typography, spacing, radius, glow, z-index, and motion

#### Scenario: Core shell styles consume tokens

- **WHEN** shell-level UI styles are applied
- **THEN** core layout and control styles use token references instead of ad-hoc literals
- **AND** visual behavior remains equivalent for existing flows
