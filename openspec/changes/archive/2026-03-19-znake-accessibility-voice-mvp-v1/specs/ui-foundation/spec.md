## ADDED Requirements

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
