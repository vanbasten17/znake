## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Menu exposes glossary/bestiary reference panel

- **WHEN** player activates the Guide action in Menu
- **THEN** a polished glossary panel opens inside the menu overlay
- **AND** panel includes category navigation for items, powerups, hazards, enemies, and talents
- **AND** each entry presents a visual sprite marker, localized name, and localized description

#### Scenario: Glossary panel closes without breaking menu flow

- **WHEN** glossary panel is closed (close button or keyboard shortcut)
- **THEN** player returns to the same menu state
- **AND** Start, talent unlock, goal claim, and language toggle remain behaviorally equivalent
