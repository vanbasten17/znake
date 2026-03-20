## MODIFIED Requirements

### Requirement: Gameplay entity visual readability

The system SHALL provide distinct visual signatures for core gameplay entities without changing gameplay mechanics.

#### Scenario: Marker overlays remain readable without ring clutter

- **WHEN** gameplay markers are rendered in active runs
- **THEN** marker sprites and glow cues are visible without additional circular ring overlays
- **AND** readability improvements do not alter gameplay behavior

#### Scenario: Score-linked entities avoid persistent glow emphasis

- **WHEN** an entity’s primary role is score collection/progression
- **THEN** it does not use persistent glow emphasis by default
- **AND** score visibility relies on clear sprite silhouette and hierarchy-safe contrast

#### Scenario: Players classify danger-vs-reward in under one second

- **WHEN** multiple entity categories are visible simultaneously
- **THEN** visual signals allow primary classification (`danger`, `reward`, `utility`, `obstacle`) in under one second under normal gameplay conditions
- **AND** classification does not depend solely on micro-detail icons

## ADDED Requirements

### Requirement: Shape semantics for entity categories

The system SHALL define primary shape families that communicate gameplay intent consistently.

#### Scenario: Shape family maps to gameplay meaning

- **WHEN** an entity is rendered
- **THEN** its base silhouette follows category intent (rounded for collectible/utility, angular for threat, rectilinear for terrain/obstacle)
- **AND** opposite intents do not share identical primary silhouettes in the same gameplay context

#### Scenario: Ambiguity is blocked by constraints

- **WHEN** two high-priority entities coexist on screen
- **THEN** they are distinguishable via at least one major channel (shape, color family, or state emphasis)
- **AND** no pair relies only on tiny inner icon differences for disambiguation

### Requirement: Priority and urgency feedback hierarchy

The system SHALL communicate player-action priority through a bounded emphasis model.

#### Scenario: Priority maps to bounded emphasis intensity

- **WHEN** an entity priority is `low`, `medium`, `high`, or `critical`
- **THEN** emphasis (contrast, glow, pulse, and optional cue intensity) scales with that level
- **AND** `critical` receives strongest emphasis while preserving readability

#### Scenario: Attention budget prevents overload

- **WHEN** several emphasized entities are present
- **THEN** the system limits concurrent critical visual cues to avoid clutter
- **AND** non-interactive/passive entities downgrade emphasis automatically

### Requirement: Entity classification contract

The system SHALL define visual rules per gameplay category.

#### Scenario: Category rules are explicit

- **WHEN** category is `obstacles`, `enemies`, `collectibles`, or `power-ups`
- **THEN** each category has documented gameplay role and default visual representation rules
- **AND** each category includes constraints that prevent semantic conflicts with other categories

### Requirement: State-driven visual behavior

The system SHALL map entity state to predictable visual intensity.

#### Scenario: State progression changes visual urgency

- **WHEN** an entity transitions across `idle`, `active`, and `dangerous`
- **THEN** visual emphasis escalates in that order
- **AND** transitions remain perceivable without disorienting motion spikes

### Requirement: Extensible visual token mapping

The system SHALL support adding new entity types via data-driven semantic mapping.

#### Scenario: New entity onboarding uses token mapping

- **WHEN** a new entity type is introduced
- **THEN** it must declare category, intent, priority, state-visual mapping, shape token, and color token
- **AND** it is rejected for release if mapping is missing or conflicts with existing semantics

#### Scenario: Dev reference board reflects shared mapping

- **WHEN** reference/guide visual previews are rendered
- **THEN** they are sourced from the same semantic mapping used in gameplay
- **AND** previews do not diverge from in-run meaning
