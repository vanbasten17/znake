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

#### Scenario: Menu uses DOM vertical slice

- **WHEN** menu scene is active
- **THEN** menu composition is rendered via DOM overlay in game area
- **AND** keyboard shortcuts and touch interactions remain equivalent
