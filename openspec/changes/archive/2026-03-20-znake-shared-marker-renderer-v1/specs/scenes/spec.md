## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Guide marker visuals reuse gameplay marker renderer

- **WHEN** glossary markers are rendered in menu guide
- **THEN** icon primitives are produced from the shared marker renderer used by gameplay
- **AND** guide and in-game marker icons remain visually consistent from the same source mapping
