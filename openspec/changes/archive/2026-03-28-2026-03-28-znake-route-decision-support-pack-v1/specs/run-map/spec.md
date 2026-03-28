## ADDED Requirements

### Requirement: Route-choice cards expose deterministic tactical support lines

The system SHALL expose deterministic tactical support lines on route-choice cards derived only from already-resolved route preview metadata.

#### Scenario: Card lines expose pressure and recovery context
- **WHEN** route-choice cards are rendered
- **THEN** each card includes deterministic pressure/recovery context derived from selected room and bounded preview composition
- **AND** context derivation does not modify route generation or room outcomes

#### Scenario: Card lines expose depth and biome pivot context
- **WHEN** selected route metadata differs by depth band or biome
- **THEN** route-choice cards can expose deterministic depth and biome-pivot context for readability
- **AND** exposed context remains consistent with selected route payload

### Requirement: Route-choice overlay framing clarifies risk semantics

The system SHALL provide bounded framing text so route risk levels remain interpretable at commit time.

#### Scenario: Overlay framing includes mastery-aware subtitle and risk legend
- **WHEN** route-choice overlay opens with multiple route options
- **THEN** subtitle can include current route-mastery short summary
- **AND** overlay includes a compact risk-level legend explaining low/medium/high semantics
