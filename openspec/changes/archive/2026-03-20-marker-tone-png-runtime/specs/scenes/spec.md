# scenes (delta)

Delta for `openspec/specs/scenes/spec.md` — menu guide markers and gameplay share optional PNG-backed rasterization.

## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Guide marker visuals reuse gameplay marker renderer

- **WHEN** glossary markers are rendered in menu guide
- **THEN** icon primitives are produced from the shared marker renderer used by gameplay
- **AND** guide and in-game marker icons remain visually consistent from the same source mapping
- **AND** when `marker_<tone>.png` loads successfully for a tone, that bitmap is used for that tone’s icon; otherwise procedural art is used for that tone
