## ADDED Requirements

### Requirement: Unified progression contract ownership boundary
The system SHALL resolve progression composition in deterministic core/config helpers, and scene orchestration SHALL consume the resolved payload without duplicating composition rules.

#### Scenario: Scene orchestration consumes composed progression payload
- **WHEN** gameplay needs progression knobs for a floor/spawn context
- **THEN** orchestration reads resolved progression payload from core helper boundary
- **AND** scene code does not re-compose depth/pressure/role-cap rules inline
