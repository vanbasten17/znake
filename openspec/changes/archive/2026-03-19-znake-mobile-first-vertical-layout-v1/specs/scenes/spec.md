## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Menu visual language matches reference

- **WHEN** menu scene is rendered
- **THEN** hero title, stat strip, talent rows, goals, and start CTA use a cohesive neon-grid style aligned to the provided design reference
- **AND** composition avoids text overlap on portrait-first dimensions

#### Scenario: Menu behavior remains stable

- **WHEN** player uses menu interactions (start, talent unlock, goal claim, language switch)
- **THEN** all interactions behave equivalently to pre-redesign behavior

## ADDED Requirements

### Requirement: Relic draft polished composition

The system SHALL render relic selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Relic selection fits vertical layout

- **WHEN** relic draft scene is shown
- **THEN** title, subtitle, and three relic cards fit without overlap
- **AND** card hit zones remain fully interactive

### Requirement: Upgrade selection polished composition

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive
