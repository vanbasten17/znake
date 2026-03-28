# ui-foundation Specification

## Purpose
TBD - created by archiving change znake-design-tokens-foundation-v1. Update Purpose after archive.
## Requirements
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

### Requirement: Semantic color token families
The system SHALL define shared semantic token families for `danger`, `heal`, `economy`, `control`, and `elite` readability intents.

#### Scenario: Semantic token values are centralized
- **WHEN** UI styles resolve semantic colors
- **THEN** values are sourced from shared token variables
- **AND** major overlay/HUD call sites avoid duplicating divergent hardcoded literals for those intents

### Requirement: Semantic token contrast guardrails
The system SHALL keep semantic token foreground use readable against existing shell/overlay backgrounds.

#### Scenario: Semantic text cues remain readable
- **WHEN** semantic token colors are applied to primary status or cue text
- **THEN** contrast remains readable on supported desktop and portrait mobile layouts
- **AND** readability does not require gameplay behavior changes

### Requirement: Release compliance disclosure baseline
The system SHALL define minimum disclosure metadata and visibility requirements for release-targeted builds.

#### Scenario: Release-targeted UI surfaces include required disclosure links/text
- **WHEN** a release candidate build is prepared for distribution
- **THEN** required privacy and telemetry disclosure references are available from shell/menu-accessible UI surfaces
- **AND** disclosure presentation remains readable on supported portrait mobile and desktop layouts

#### Scenario: Compliance review metadata is tracked in release baseline
- **WHEN** release compliance review is performed
- **THEN** checklist output records reviewer, review date, and disclosure artifact references
- **AND** missing required metadata blocks release compliance approval

### Requirement: Launch transparency footer token slot
The system SHALL provide a stable UI slot and tokenized text hierarchy for release transparency metadata in menu-facing shell surfaces.

#### Scenario: Version and channel metadata remain readable
- **WHEN** menu shell renders launch-adjacent metadata
- **THEN** version identifier and release channel are displayed using tertiary hierarchy tokens with readable contrast
- **AND** metadata placement does not overlap primary action controls on supported mobile and desktop layouts

#### Scenario: Metadata slot remains layout-safe under localization
- **WHEN** localized channel labels increase text length
- **THEN** metadata wraps or truncates according to shared shell rules without clipping interactive controls
- **AND** shell vertical continuity remains preserved during menu transitions

