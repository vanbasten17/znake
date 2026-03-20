## ADDED Requirements

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
