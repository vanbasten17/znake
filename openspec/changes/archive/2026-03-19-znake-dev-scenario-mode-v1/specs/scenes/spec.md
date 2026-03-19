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

#### Scenario: Menu exposes voice toggle while visual accessibility remains dark-launched

- **WHEN** menu scene is active
- **THEN** player can toggle voice input mode from menu
- **AND** high-contrast / large-text / reduced-effects remain implemented but hidden from menu UI
- **AND** the next run uses the configured visible accessibility/input preferences

#### Scenario: Dev scenario launcher appears only in dev mode

- **WHEN** menu scene is rendered with URL query `?dev=1`
- **THEN** a developer scenario launcher is visible with quick-start entries
- **AND** selecting an entry starts gameplay directly using that scenario preset
- **AND** normal start CTA remains available

#### Scenario: Dev scenario launcher stays hidden in normal mode

- **WHEN** menu scene is rendered without URL query `?dev=1`
- **THEN** no developer launcher UI is shown
- **AND** menu interactions remain equivalent to production flow
