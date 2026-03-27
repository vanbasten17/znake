## ADDED Requirements

### Requirement: Active biome-rule readability in GameScene
`GameScene` SHALL present active biome gameplay-rule context as concise tactical cues without owning biome-rule resolution logic.

#### Scenario: Scene surfaces deterministic active-rule summary
- **WHEN** a room or segment begins with active biome gameplay rules
- **THEN** GameScene displays concise active-rule summary cues sourced from deterministic simulation payloads
- **AND** cue content communicates movement/routing/survival impact in readable player-facing language

#### Scenario: HUD status reflects active biome rule state changes
- **WHEN** biome gameplay-rule state changes due to deterministic boundary activation or guardrail fallback
- **THEN** HUD/overlay status updates within bounded presentation timing
- **AND** update behavior does not mutate gameplay rule activation order

### Requirement: Biome-rule cue readability constraints
The system SHALL keep biome-rule readability cues legible across supported layouts while preserving movement-space visibility.

#### Scenario: Mobile and desktop layouts keep biome cues readable
- **WHEN** active biome-rule cues are shown on portrait mobile or desktop layouts
- **THEN** labels and short tactical descriptors remain readable without overlap with primary objective/status UI
- **AND** cues remain bounded in density to avoid cognitive overload during high-pressure moments

#### Scenario: Biome cues avoid obscuring critical movement information
- **WHEN** biome-rule overlays are visible during gameplay
- **THEN** cue placement does not hide critical movement-space information near the player head or immediate threat lanes
- **AND** presentation fallback behavior is applied when layout constraints are exceeded
