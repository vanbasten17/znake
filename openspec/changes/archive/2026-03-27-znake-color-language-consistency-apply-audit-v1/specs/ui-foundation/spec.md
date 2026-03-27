## ADDED Requirements

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
