# ui-foundation Specification

## Purpose
TBD - created by archiving change znake-design-tokens-foundation-v1. Update Purpose after archive.
## Requirements
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

#### Scenario: Death vertical slice uses scoped CSS module

- **WHEN** death DOM UI is rendered
- **THEN** styles are applied through a scene-scoped CSS Module backed by shared tokens
- **AND** global gameplay styling remains isolated

### Requirement: Runtime UI shell mount

The system SHALL create the shared HUD/gameplay/controls shell structure at runtime before gameplay systems bind DOM behavior.

#### Scenario: Shell contract is mounted before system setup

- **WHEN** app bootstrap starts
- **THEN** runtime shell markup is created before input and i18n setup
- **AND** all existing shell hook IDs (`hud`, `game-area`, `phaser-container`, `controls`, `hint-bar`) exist in the DOM

#### Scenario: Runtime shell preserves styling contract

- **WHEN** shell CSS is applied
- **THEN** runtime-mounted nodes expose the same IDs/classes as the previous static markup
- **AND** existing shell/tokens styles render without selector rewrites

