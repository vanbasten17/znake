## ADDED Requirements

### Requirement: Scene overlays use reusable UI primitive helpers

The UI layer SHALL expose reusable primitive helpers for common overlay/button/chip composition.

#### Scenario: Scene code composes with primitives
- **WHEN** scenes render interactive DOM overlays
- **THEN** they may compose using shared primitive helpers instead of duplicating low-level DOM setup.
