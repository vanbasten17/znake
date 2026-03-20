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

#### Scenario: Gameplay readability palette stays token-coherent

- **WHEN** gameplay readability visuals are tuned
- **THEN** color/contrast changes remain coherent with shared token palette intent
- **AND** shell and gameplay accents do not diverge into conflicting visual languages

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

### Requirement: DOM readability token hierarchy

The system SHALL expose a consistent readability-oriented token hierarchy for DOM overlay text.

#### Scenario: Text hierarchy tokens are available

- **WHEN** overlay styles are loaded
- **THEN** shared tokens provide primary, secondary, and tertiary text levels
- **AND** overlays can apply consistent contrast without ad-hoc literals

#### Scenario: Baseline text rendering improves legibility

- **WHEN** app UI is rendered in modern mobile/desktop browsers
- **THEN** global text rendering and smoothing defaults improve readability
- **AND** existing layout behavior remains unchanged

### Requirement: Accessibility-ready token presets

The system SHALL provide token/class-driven accessibility presets that can be applied globally without scene-specific CSS duplication.

#### Scenario: High contrast preset improves foreground/background separation

- **WHEN** high-contrast mode is enabled
- **THEN** text and interactive surfaces increase contrast against background
- **AND** CTA/interactive boundaries remain visually distinguishable

#### Scenario: Large text preset scales core UI typography

- **WHEN** large-text mode is enabled
- **THEN** primary/secondary UI text scales up consistently across shell overlays
- **AND** key controls remain readable without overlap in portrait layout

#### Scenario: Reduced effects preset lowers non-essential motion intensity

- **WHEN** reduced-effects mode is enabled
- **THEN** non-essential glow/shake/flash intensity is reduced
- **AND** gameplay-critical state feedback remains visible

### Requirement: Gameplay color semantics contract

The system SHALL define stable color families for gameplay meaning and forbid conflicting semantic reuse in the same context.

#### Scenario: Color family maps to meaning

- **WHEN** gameplay visuals are authored or tuned
- **THEN** color usage follows semantic families (`danger`, `reward`, `utility`, `hazard/pressure`, `neutral terrain`)
- **AND** color decisions prioritize gameplay meaning over decorative preference

#### Scenario: Conflicting color signals are prevented

- **WHEN** a color family is already associated with an active intent in context
- **THEN** opposite intents do not reuse the same family without additional clear differentiation
- **AND** any unavoidable reuse requires explicit compensators (shape and/or emphasis differences)

### Requirement: Readability hierarchy and contrast guardrails

The system SHALL maintain a consistent gameplay attention hierarchy with strong contrast guardrails.

#### Scenario: Attention hierarchy is preserved

- **WHEN** rendering objective-critical, immediate-danger, reward, and ambient elements together
- **THEN** visual hierarchy prioritizes in this order: objective-critical > immediate danger > rewards > ambient
- **AND** secondary elements never overpower immediate survival cues

#### Scenario: Contrast remains robust across shell and gameplay layers

- **WHEN** overlays, HUD, and gameplay entities coexist
- **THEN** foreground/background contrast remains sufficient for quick recognition on mobile and desktop
- **AND** readability is maintained without requiring users to disable non-essential visuals

